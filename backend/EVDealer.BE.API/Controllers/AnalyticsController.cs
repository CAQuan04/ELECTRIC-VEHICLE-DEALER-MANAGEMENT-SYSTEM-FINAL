using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.AI;
using EVDealer.BE.Services.Analytics;
using Hangfire;
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
        private readonly IDemandForecastService _forecastService;

        public AnalyticsController(IAnalyticsService analyticsService, IDemandForecastService forecastService)
        {
            _analyticsService = analyticsService;
            _forecastService = forecastService;
        }

        [HttpGet("sales-by-dealer")]
        public async Task<IActionResult> GetSalesReportByDealer([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            try
            {
                var report = await _analyticsService.GenerateSalesReportByDealerAsync(startDate, endDate);
                return Ok(report);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("inventory-turnover")]
        public async Task<IActionResult> GetInventoryTurnoverReport([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            try
            {
                var report = await _analyticsService.GenerateInventoryTurnoverReportAsync(startDate, endDate);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi trong quá trình xử lý báo cáo.");
            }
        }

        [HttpGet("demand-forecasts")]
        public async Task<IActionResult> GetDemandForecasts()
        {
            var forecasts = await _forecastService.GetLatestForecastsAsync();
            // Trình đóng gói JSON sẽ xử lý DTO một cách hoàn hảo vì không có vòng lặp.
            return Ok(forecasts);
        }

        [HttpPost("run-demand-forecast")]
        [Authorize(Roles = "Admin")]
        public IActionResult RunDemandForecast()
        {
            var jobId = BackgroundJob.Enqueue<IDemandForecastService>(service => service.RunDemandForecastProcessAsync());
            return Accepted(new { message = "Yêu cầu chạy quy trình dự báo đã được tiếp nhận...", jobId });
        }
    }
}