using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai các truy vấn phân tích (Phiên bản cuối cùng, sửa lỗi toàn diện).
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly ApplicationDbContext _context;
        public AnalyticsRepository(ApplicationDbContext context) => _context = context;

        // --- Báo cáo Doanh số ---
        // --- Triển khai Báo cáo Doanh số (Linh hoạt) ---
         public async Task<IEnumerable<SalesReportItemDto>> GetSalesDataAsync(DateOnly startDate, DateOnly endDate, string groupBy, int? dealerId, int? vehicleId)
        {
            // Ghi chú: Bắt đầu xây dựng câu truy vấn trên bảng SalesOrder.
            // Cách tiếp cận này đơn giản hơn và tránh được lỗi DISTINCT.
            var query = _context.SalesOrders
                .Where(o => o.Status == "Completed" && o.OrderDate >= startDate && o.OrderDate <= endDate);

            // Ghi chú: Áp dụng các bộ lọc như cũ.
            if (dealerId.HasValue)
            {
                query = query.Where(o => o.DealerId == dealerId.Value);
            }
            if (vehicleId.HasValue)
            {
                query = query.Where(o => o.OrderItems.Any(i => i.VehicleId == vehicleId.Value));
            }

            if (groupBy.Equals("region", StringComparison.OrdinalIgnoreCase))
            {
                // --- Nhóm theo Khu vực ---
                return await query
                    .Include(o => o.Dealer.Region)
                    .GroupBy(o => o.Dealer.Region.Name) // Nhóm các đơn hàng theo tên khu vực.
                    .Select(group => new SalesReportItemDto
                    {
                        GroupingKey = group.Key,
                        // Ghi chú: 'group' bây giờ là một tập hợp các đối tượng SalesOrder.
                        // Chúng ta có thể Sum trực tiếp trên các đối tượng này.
                        TotalRevenue = group.Sum(o => o.TotalAmount),
                        // Ghi chú: SelectMany để "làm phẳng" tất cả OrderItems của các đơn hàng trong nhóm
                        // thành một danh sách duy nhất, sau đó Sum() trên đó.
                        TotalQuantitySold = group.SelectMany(o => o.OrderItems).Sum(i => i.Quantity)
                    })
                    .OrderByDescending(r => r.TotalRevenue)
                    .ToListAsync();
            }
            else // --- Mặc định nhóm theo Đại lý ---
            {
                return await query
                    .Include(o => o.Dealer)
                    .GroupBy(o => o.Dealer.Name) // Nhóm các đơn hàng theo tên đại lý.
                    .Select(group => new SalesReportItemDto
                    {
                        GroupingKey = group.Key,
                        // Logic tính toán tương tự.
                        TotalRevenue = group.Sum(o => o.TotalAmount),
                        TotalQuantitySold = group.SelectMany(o => o.OrderItems).Sum(i => i.Quantity)
                    })
                    .OrderByDescending(r => r.TotalRevenue)
                    .ToListAsync();
            }
        }

        // --- Huấn luyện AI ---
        public async Task<IEnumerable<OrderItem>> GetHistoricalSalesDataAsync(DateOnly untilDate)
        {
            return await _context.OrderItems
                .AsNoTracking()
                .Include(i => i.Order)
                .Where(i => i.Order.Status == "Completed" && i.Order.OrderDate < untilDate)
                .ToListAsync();
        }

        // ===================================================================================
        // === CÁC PHƯƠNG THỨC ĐÃ NÂNG CẤP CHO MODULE HOẠCH ĐỊNH (SỬA LỖI) ===

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalSalesByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId)
        {
            var query = _context.OrderItems
                .Where(item => item.Order.Status == "Completed" &&
                               item.Order.OrderDate >= startDate &&
                               item.Order.OrderDate <= endDate);

            // Ghi chú: Áp dụng các bộ lọc nếu chúng được cung cấp.
            if (dealerId.HasValue) { query = query.Where(item => item.Order.DealerId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(item => item.VehicleId == vehicleId.Value); }

            return await query
                .GroupBy(item => new { item.Order.DealerId, item.VehicleId })
                .ToDictionaryAsync(group => (group.Key.DealerId, group.Key.VehicleId), group => group.Sum(item => item.Quantity));
        }

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalReceiptsByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId)
        {
            var query = _context.Distributions
                .Where(dist => dist.Status == "Completed" &&
                               dist.ScheduledDate >= startDate &&
                               dist.ScheduledDate <= endDate);

            if (dealerId.HasValue) { query = query.Where(dist => dist.ToDealerId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(dist => dist.VehicleId == vehicleId.Value); }

            return await query
                .GroupBy(dist => new { dist.ToDealerId, dist.VehicleId })
                .ToDictionaryAsync(group => (group.Key.ToDealerId, group.Key.VehicleId), group => group.Sum(dist => dist.Quantity));
        }

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetCurrentInventoryByDealerAndVehicleAsync(int? dealerId, int? vehicleId)
        {
            var query = _context.Inventories
                .Where(inv => inv.LocationType == "DEALER");

            if (dealerId.HasValue) { query = query.Where(inv => inv.LocationId == dealerId.Value); }
            if (vehicleId.HasValue) { query = query.Where(inv => inv.VehicleId == vehicleId.Value); }

            return await query
                .GroupBy(inv => new { DealerId = inv.LocationId, inv.VehicleId })
                .ToDictionaryAsync(group => (group.Key.DealerId, group.Key.VehicleId), group => group.Sum(inv => inv.Quantity));
        }

        // --- Báo cáo Kế hoạch Sản xuất ---
        public async Task<Dictionary<int, int>> GetTotalDemandForecastByVehicleAsync(DateOnly periodStart)
        {
            return await _context.DemandForecasts
                .Where(f => f.ForecastPeriodStart == periodStart)
                .GroupBy(f => f.VehicleId)
                .ToDictionaryAsync(group => group.Key, group => group.Sum(f => f.PredictedQuantity));
        }

        public async Task<Dictionary<int, int>> GetTotalInventoryByVehicleAsync(string locationType)
        {
            return await _context.Inventories
                .Where(inv => inv.LocationType == locationType)
                .GroupBy(inv => inv.VehicleId)
                .ToDictionaryAsync(group => group.Key, group => group.Sum(inv => inv.Quantity));
        }
    }
}