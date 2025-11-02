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
        Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate);

        // === Hợp đồng cho Huấn luyện AI ===
        Task<IEnumerable<OrderItem>> GetHistoricalSalesDataAsync(DateOnly untilDate);

        // === Hợp đồng cho Module Hoạch định (Planning) ===

        // Ghi chú: Hợp nhất và nâng cấp. Lấy tổng lượng bán theo cặp (DealerId, VehicleId).
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalSalesByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate);

        // Ghi chú: Hợp nhất và nâng cấp. Lấy tổng lượng nhập theo cặp (DealerId, VehicleId).
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetTotalReceiptsByDealerAndVehicleAsync(DateOnly startDate, DateOnly endDate);

        // Ghi chú: Nâng cấp để lấy tồn kho chi tiết theo từng cặp (DealerId, VehicleId).
        // Đây là thay đổi quan trọng nhất để logic hoạch định chạy đúng.
        Task<Dictionary<(int DealerId, int VehicleId), int>> GetCurrentInventoryByDealerAndVehicleAsync();

        // Ghi chú: Lấy tổng nhu cầu dự báo theo từng Vehicle.
        Task<Dictionary<int, int>> GetTotalDemandForecastByVehicleAsync(DateOnly periodStart);

        // Ghi chú: Lấy tổng tồn kho theo từng Vehicle tại một loại kho nhất định.
        Task<Dictionary<int, int>> GetTotalInventoryByVehicleAsync(string locationType);
    }
}