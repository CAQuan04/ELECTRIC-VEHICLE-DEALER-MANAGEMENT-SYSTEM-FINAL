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
        public async Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _context.SalesOrders
                .Where(order => order.Status == "Completed" && order.OrderDate >= startDate && order.OrderDate <= endDate)
                .Include(order => order.Dealer)
                .GroupBy(order => order.Dealer.Name)
                .Select(dealerGroup => new SalesReportItemDto
                {
                    GroupingKey = dealerGroup.Key,
                    TotalRevenue = dealerGroup.Sum(order => order.TotalAmount),
                    TotalQuantitySold = dealerGroup.Sum(order => order.OrderItems.Sum(item => item.Quantity))
                })
                .OrderByDescending(result => result.TotalRevenue)
                .ToListAsync();
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

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalSalesByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate)
        {
            // === PHẦN SỬA LỖI: THÊM LẠI TOÀN BỘ LOGIC ===
            return await _context.OrderItems
                .Where(item => item.Order.Status == "Completed" &&
                               item.Order.OrderDate >= startDate &&
                               item.Order.OrderDate <= endDate)
                .GroupBy(item => new { item.Order.DealerId, item.VehicleId })
                .ToDictionaryAsync(group => (group.Key.DealerId, group.Key.VehicleId), group => group.Sum(item => item.Quantity));
        }

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalReceiptsByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate)
        {
            // === PHẦN SỬA LỖI: THÊM LẠI TOÀN BỘ LOGIC ===
            return await _context.Distributions
                .Where(dist => dist.Status == "Completed" &&
                               dist.ScheduledDate >= startDate &&
                               dist.ScheduledDate <= endDate)
                .GroupBy(dist => new { dist.ToDealerId, dist.VehicleId })
                .ToDictionaryAsync(group => (group.Key.ToDealerId, group.Key.VehicleId), group => group.Sum(dist => dist.Quantity));
        }

        public async Task<Dictionary<(int DealerId, int VehicleId), int>> GetCurrentInventoryByDealerAndVehicleAsync()
        {
            // === PHẦN SỬA LỖI: THÊM LẠI TOÀN BỘ LOGIC ===
            return await _context.Inventories
                .Where(inv => inv.LocationType == "DEALER")
                .GroupBy(inv => new { DealerId = inv.LocationId, inv.VehicleId })
                .ToDictionaryAsync(group => (group.Key.DealerId, group.Key.VehicleId), group => group.Sum(inv => inv.Quantity));
        }
        // ===================================================================================

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