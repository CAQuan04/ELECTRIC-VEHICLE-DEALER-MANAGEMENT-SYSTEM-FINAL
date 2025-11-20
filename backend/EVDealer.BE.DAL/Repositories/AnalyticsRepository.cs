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
            // Ghi chú: Bắt đầu xây dựng câu truy vấn trên bảng OrderItem, là nguồn dữ liệu chi tiết nhất.
            var query = _context.OrderItems
                .Where(item => item.Order.Status == "Completed" &&
                               item.Order.OrderDate >= startDate &&
                               item.Order.OrderDate <= endDate);

            // Ghi chú: Áp dụng các bộ lọc trực tiếp trên dữ liệu chi tiết.
            if (dealerId.HasValue)
            {
                query = query.Where(item => item.Order.DealerId == dealerId.Value);
            }
            if (vehicleId.HasValue)
            {
                query = query.Where(item => item.VehicleId == vehicleId.Value);
            }

            if (groupBy.Equals("region", StringComparison.OrdinalIgnoreCase))
            {
                // --- Nhóm theo Khu vực ---
                return await query
                    .Include(item => item.Order.Dealer.Region)
                    .GroupBy(item => item.Order.Dealer.Region.Name)
                    .Select(group => new SalesReportItemDto
                    {
                        GroupingKey = group.Key,
                        // Ghi chú: Doanh thu phải được tính tổng từ các Đơn hàng (Order),
                        // nhưng phải cẩn thận để không tính trùng lặp.
                        // Chúng ta sẽ nhóm theo OrderId trước, lấy TotalAmount, rồi mới Sum.
                        TotalRevenue = group.Select(item => item.Order).Distinct().Sum(order => order.TotalAmount),
                        TotalQuantitySold = group.Sum(item => item.Quantity)
                    })
                    .OrderByDescending(r => r.TotalRevenue)
                    .ToListAsync();
            }
            else // --- Mặc định nhóm theo Đại lý ---
            {
                return await query
                    .Include(item => item.Order.Dealer)
                    .GroupBy(item => item.Order.Dealer.Name)
                    .Select(group => new SalesReportItemDto
                    {
                        GroupingKey = group.Key,
                        // Tương tự, tính tổng doanh thu cẩn thận.
                        TotalRevenue = group.Select(item => item.Order).Distinct().Sum(order => order.TotalAmount),
                        TotalQuantitySold = group.Sum(item => item.Quantity)
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