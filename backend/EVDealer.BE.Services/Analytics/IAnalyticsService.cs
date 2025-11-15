using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Analytics
{
    // Ghi chú: "Hợp đồng" cho dịch vụ phân tích (Phiên bản GỐC).
    public interface IAnalyticsService
    {
        Task<SalesReportResponseDto> GenerateSalesReportAsync(SalesReportQueryDto query);
        Task<IEnumerable<InventoryTurnoverReportItemDto>> GenerateInventoryTurnoverReportAsync(SalesReportQueryDto query);
    }
}