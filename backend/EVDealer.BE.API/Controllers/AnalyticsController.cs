using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CanViewAnalytics")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        public AnalyticsController(IAnalyticsService analyticsService) => _analyticsService = analyticsService;

        // Endpoint: GET /api/analytics/sales-by-dealer?StartDate=...&EndDate=...&DealerId=...
        [HttpGet("sales-by-dealer")]
        public async Task<IActionResult> GetSalesReportByDealer([FromQuery] SalesReportQueryDto query)
        {
            try
            {
                // ===================================================================================
                // === PHẦN ĐÃ SỬA ĐỔI: TRUYỀN TOÀN BỘ DTO XUỐNG SERVICE ===
                // Ghi chú: Chúng ta truyền nguyên cả đối tượng 'query' xuống cho Service.
                // Service sẽ tự chịu trách nhiệm đọc các thuộc tính bên trong nó (StartDate, EndDate, DealerId,...).
                // Điều này giúp Controller luôn gọn gàng, ngay cả khi chúng ta thêm nhiều bộ lọc mới.
                var report = await _analyticsService.GenerateSalesReportByDealerAsync(query);
                // ===================================================================================

                return Ok(report);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Ghi chú: Phương thức này đã được viết đúng ngay từ đầu và không cần thay đổi.
        [HttpGet("inventory-turnover")]
        public async Task<IActionResult> GetInventoryTurnoverReport([FromQuery] SalesReportQueryDto query)
        {
            try
            {
                var report = await _analyticsService.GenerateInventoryTurnoverReportAsync(query);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi trong quá trình xử lý báo cáo.");
            }
        }
    }
}