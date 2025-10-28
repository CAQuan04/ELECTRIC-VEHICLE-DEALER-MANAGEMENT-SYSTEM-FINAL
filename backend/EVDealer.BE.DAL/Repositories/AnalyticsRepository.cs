using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly ApplicationDbContext _context;
        public AnalyticsRepository(ApplicationDbContext context) => _context = context;

        // ===================================================================================
        // === PHẦN ĐÃ SỬA ĐỔI HOÀN TOÀN: CHIA NHỎ CÂU LỆNH TRUY VẤN ===
        public async Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId)
        {
            // Ghi chú: Bắt đầu xây dựng câu truy vấn trên bảng SalesOrder.
            var query = _context.SalesOrders
                .Where(order => order.Status == "Completed" && order.OrderDate >= startDate && order.OrderDate <= endDate);

            // Ghi chú: Áp dụng các bộ lọc động như cũ.
            if (dealerId.HasValue)
            {
                query = query.Where(order => order.DealerId == dealerId.Value);
            }

            if (vehicleId.HasValue)
            {
                query = query.Where(order => order.OrderItems.Any(item => item.VehicleId == vehicleId.Value));
            }

            // Ghi chú: Đây là bước quan trọng. Thay vì thực hiện GroupBy và Sum lồng nhau,
            // chúng ta chỉ thực hiện GroupBy và Sum cho TotalRevenue.
            // Đối với TotalQuantitySold, chúng ta sẽ tính toán riêng.
            var reportData = await query
                .Include(order => order.Dealer) // Cần Include Dealer để lấy tên.
                .GroupBy(order => new { order.DealerId, order.Dealer.Name }) // Nhóm theo cả ID và Tên.
                .Select(dealerGroup => new SalesReportItemDto
                {
                    GroupingKey = dealerGroup.Key.Name, // Lấy tên từ key của nhóm.
                    TotalRevenue = dealerGroup.Sum(order => order.TotalAmount),
                    // Ghi chú: Bây giờ chúng ta tính tổng số lượng của tất cả các item trong nhóm.
                    // SelectMany sẽ "làm phẳng" tất cả các OrderItems từ tất cả các đơn hàng trong nhóm
                    // thành một danh sách duy nhất, sau đó chúng ta Sum trên danh sách đó.
                    TotalQuantitySold = dealerGroup.SelectMany(order => order.OrderItems).Sum(item => item.Quantity)
                })
                .ToListAsync();

            return reportData;
        }
        // ===================================================================================

        // --- CÁC PHƯƠNG THỨC CHO BÁO CÁO TỒN KHO KHÔNG BỊ ẢNH HƯỞNG VÀ GIỮ NGUYÊN ---
        // ... (GetTotalSalesByDealerAsync, GetTotalReceiptsByDealerAsync, GetCurrentInventoryByDealerAsync) ...
        // ... (Toàn bộ các phương thức này đã đúng và không cần sửa) ...
        public async Task<Dictionary<int, int>> GetTotalSalesByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId)
        {
            var query = _context.OrderItems
                .Where(item => item.Order.Status == "Completed" && item.Order.OrderDate >= startDate && item.Order.OrderDate <= endDate);
            if (dealerId.HasValue) { query = query.Where(item => item.Order.DealerId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(item => item.VehicleId == vehicleId.Value); }
            return await query
                .GroupBy(item => item.Order.DealerId)
                .ToDictionaryAsync(group => group.Key, group => group.Sum(item => item.Quantity));
        }

        public async Task<Dictionary<int, int>> GetTotalReceiptsByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId)
        {
            var query = _context.Distributions
                .Where(dist => dist.Status == "Completed" && dist.ScheduledDate >= startDate && dist.ScheduledDate <= endDate);
            if (dealerId.HasValue) { query = query.Where(dist => dist.ToDealerId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(dist => dist.VehicleId == vehicleId.Value); }
            return await query
                .GroupBy(dist => dist.ToDealerId)
                .ToDictionaryAsync(group => group.Key, group => group.Sum(dist => dist.Quantity));
        }

        public async Task<Dictionary<int, int>> GetCurrentInventoryByDealerAsync(int? dealerId, int? vehicleId)
        {
            var query = _context.Inventories
                .Where(inv => inv.LocationType == "DEALER");
            if (dealerId.HasValue) { query = query.Where(inv => inv.LocationId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(inv => inv.VehicleId == vehicleId.Value); }
            return await query
                .GroupBy(inv => inv.LocationId)
                .ToDictionaryAsync(group => group.Key, group => group.Sum(inv => inv.Quantity));
        }

    }
}