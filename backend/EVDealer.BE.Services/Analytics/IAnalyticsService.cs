using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Analytics
{
    // Ghi chú: "Hợp đồng" cho dịch vụ phân tích.
    public interface IAnalyticsService
    {
        // Ghi chú: Yêu cầu phải có chức năng tạo báo cáo doanh số theo Đại lý.
        Task<SalesReportResponseDto> GenerateSalesReportByDealerAsync(DateOnly startDate, DateOnly endDate);
    }
}

