using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Analytics
{
    // Ghi chú: Lớp triển khai logic điều phối cho việc tạo báo cáo.
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IAnalyticsRepository _analyticsRepo; // Ghi chú: Cần Repository để lấy dữ liệu.

        public AnalyticsService(IAnalyticsRepository analyticsRepo)
        {
            _analyticsRepo = analyticsRepo; // Ghi chú: Được cung cấp qua Dependency Injection.
        }

        public async Task<SalesReportResponseDto> GenerateSalesReportByDealerAsync(DateOnly startDate, DateOnly endDate)
        {
            // Bước 1: Kiểm tra logic nghiệp vụ (Validation).
            if (startDate > endDate)
            {
                // Ghi chú: Ném ra một lỗi nghiệp vụ rõ ràng nếu dữ liệu đầu vào không hợp lệ.
                throw new ArgumentException("Ngày bắt đầu không được sau ngày kết thúc.");
            }

            // Bước 2: Ra lệnh cho Repository đi lấy dữ liệu đã được tổng hợp.
            var reportData = await _analyticsRepo.GetSalesDataByDealerAsync(startDate, endDate);

            // Bước 3: Đóng gói kết quả vào một đối tượng DTO hoàn chỉnh để trả về.
            var response = new SalesReportResponseDto
            {
                ReportData = reportData,
                ReportTitle = $"Báo cáo doanh số theo Đại lý từ {startDate:yyyy-MM-dd} đến {endDate:yyyy-MM-dd}"
            };

            return response;
        }
    }
}