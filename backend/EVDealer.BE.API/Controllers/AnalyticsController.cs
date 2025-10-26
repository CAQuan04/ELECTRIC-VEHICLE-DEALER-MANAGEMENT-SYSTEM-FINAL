using EVDealer.BE.Services.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using EVDealer.BE.Common.DTOs;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Ghi chú: Bảo vệ toàn bộ Controller bằng Policy "CanViewAnalytics".
    // Chỉ những người dùng có quyền này (Admin) mới có thể gọi bất kỳ API nào trong đây.
    [Authorize(Policy = "CanViewAnalytics")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService; // Ghi chú: Cần Service để xử lý nghiệp vụ.

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService; // Ghi chú: Được cung cấp qua Dependency Injection.
        }

        // Endpoint: GET /api/analytics/sales-by-dealer?startDate=2024-01-01&endDate=2024-03-31
        [HttpGet("sales-by-dealer")]
        // Ghi chú: Phương thức bây giờ chỉ nhận MỘT tham số là SalesReportQueryDto.
        // Thuộc tính [FromQuery] báo cho ASP.NET Core biết hãy lấy các giá trị từ URL
        // (ví dụ: ?StartDate=...&EndDate=...) và tự động điền vào đối tượng 'query'.
        public async Task<IActionResult> GetSalesReportByDealer([FromQuery] SalesReportQueryDto query)
        {
            try
            {
                // Ghi chú: Truyền các thuộc tính từ DTO vào Service.
                // Logic bên trong Service không cần thay đổi.
                var report = await _analyticsService.GenerateSalesReportByDealerAsync(query.StartDate, query.EndDate);
                return Ok(report);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}