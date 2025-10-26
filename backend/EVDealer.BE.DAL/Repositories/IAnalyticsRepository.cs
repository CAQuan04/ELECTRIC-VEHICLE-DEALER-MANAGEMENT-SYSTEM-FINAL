using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" đã được nâng cấp để hỗ trợ lọc.
    public interface IAnalyticsRepository
    {
        // ===================================================================================
        // === PHẦN ĐÃ SỬA ĐỔI: THÊM CÁC THAM SỐ LỌC ===
        // Ghi chú: Phương thức này bây giờ yêu cầu 4 tham số, trong đó 2 tham số cuối là tùy chọn.
        Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId);
        // ===================================================================================

        // Ghi chú: Các phương thức cho báo cáo tồn kho cũng cần được nâng cấp tương tự.
        Task<Dictionary<int, int>> GetTotalSalesByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId);
        Task<Dictionary<int, int>> GetTotalReceiptsByDealerAsync(DateOnly startDate, DateOnly endDate, int? dealerId, int? vehicleId);
        Task<Dictionary<int, int>> GetCurrentInventoryByDealerAsync(int? dealerId, int? vehicleId);
    }
}