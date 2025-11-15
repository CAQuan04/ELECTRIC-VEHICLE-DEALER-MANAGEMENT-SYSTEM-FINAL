using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" tổng hợp cho các truy vấn phân tích, đã được tối ưu hóa.
    public interface IAnalyticsRepository
    {
        // === Hợp đồng cho Báo cáo Doanh số ===
        Task<IEnumerable<SalesReportItemDto>> GetSalesDataAsync(DateOnly startDate, DateOnly endDate, string groupBy, int? dealerId, int? vehicleId);

        // === Hợp đồng cho Huấn luyện AI ===
        Task<IEnumerable<OrderItem>> GetHistoricalSalesDataAsync(DateOnly untilDate);

        // === Hợp đồng cho Module Hoạch định (Planning) ===

        // Ghi chú: Hợp nhất và nâng cấp. Lấy tổng lượng bán theo cặp (DealerId, VehicleId).
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalSalesByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId);
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalReceiptsByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId);
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetCurrentInventoryByDealerAndVehicleAsync(int? dealerId, int? vehicleId);

        // --- Hợp đồng cho Báo cáo Sản xuất ---
        Task<Dictionary<int, int>> GetTotalDemandForecastByVehicleAsync(DateOnly periodStart);
        Task<Dictionary<int, int>> GetTotalInventoryByVehicleAsync(string locationType);
    }
}