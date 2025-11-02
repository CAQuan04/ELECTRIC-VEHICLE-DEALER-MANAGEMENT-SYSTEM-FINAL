using EVDealer.BE.Services.Planning;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/planning")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SupplyPlanningController : ControllerBase
    {
        private readonly ISupplyPlanningService _planningService;

        public SupplyPlanningController(ISupplyPlanningService planningService)
        {
            _planningService = planningService;
        }

        [HttpGet("distribution-suggestions")]
        public async Task<IActionResult> GetDistributionSuggestions()
        {
            var suggestions = await _planningService.GetPendingSuggestionsAsync();
            return Ok(suggestions);
        }

        [HttpPost("run-suggestion-generator")]
        public IActionResult RunSuggestionGenerator()
        {
            var jobId = BackgroundJob.Enqueue<ISupplyPlanningService>(service => service.GenerateDistributionSuggestionsAsync());
            return Accepted(new { message = "Yêu cầu tạo đề xuất phân phối đã được tiếp nhận.", jobId });
        }

        [HttpGet("production-report")]
        public async Task<IActionResult> GetProductionReport([FromQuery] DateOnly periodStart)
        {
            var report = await _planningService.GenerateProductionPlanReportAsync(periodStart);
            return Ok(report);
        }
    }
}