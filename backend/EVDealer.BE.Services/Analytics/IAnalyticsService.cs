using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Analytics
{
    // Ghi chú: "Hợp đồng" cho các dịch vụ phân tích, đã được cập nhật.
    public interface IAnalyticsService
    {
        // ===================================================================================
        // === PHẦN ĐÃ SỬA ĐỔI: SỬ DỤNG DTO LÀM THAM SỐ ===
        // Ghi chú: Hợp đồng yêu cầu phương thức này phải nhận MỘT tham số duy nhất là SalesReportQueryDto.
        Task<SalesReportResponseDto> GenerateSalesReportByDealerAsync(SalesReportQueryDto query);
        // ===================================================================================

        // Ghi chú: Phương thức cho báo cáo tồn kho cũng sử dụng cùng một DTO.
        Task<IEnumerable<InventoryTurnoverReportItemDto>> GenerateInventoryTurnoverReportAsync(SalesReportQueryDto query);
    }
}