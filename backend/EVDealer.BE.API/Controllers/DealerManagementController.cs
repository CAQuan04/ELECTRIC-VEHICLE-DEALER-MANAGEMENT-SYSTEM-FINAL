using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.DealerManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace EVDealer.BE.API.Controllers
{
    // Ghi chú: Toàn bộ Controller được bảo vệ bởi Policy "ManageDealers", chỉ Admin có quyền truy cập.
    [Route("api/manage/dealers")]
    [ApiController]
    [Authorize(Policy = "ManageDealers")]
    public class DealerManagementController : ControllerBase
    {
        private readonly IDealerManagementService _dealerService;
        public DealerManagementController(IDealerManagementService dealerService) => _dealerService = dealerService;

        // --- Endpoints TẠO MỚI (POST) ---

        [HttpPost("{dealerId}/contracts")]
        public async Task<IActionResult> CreateContract(int dealerId, [FromBody] CreateContractDto contractDto)
        {
            var newContract = await _dealerService.CreateContractAsync(dealerId, contractDto);
            return Ok(newContract);
        }

        [HttpPost("{dealerId}/targets")]
        public async Task<IActionResult> SetTarget(int dealerId, [FromBody] SetTargetDto targetDto)
        {
            var newTarget = await _dealerService.SetTargetAsync(dealerId, targetDto);
            return Ok(newTarget);
        }

        // --- Endpoints ĐỌC DỮ LIỆU (GET) ---

        [HttpGet("{dealerId}/contracts")]
        public async Task<IActionResult> GetContractsForDealer(int dealerId)
        {
            var contracts = await _dealerService.GetContractsAsync(dealerId);
            return Ok(contracts);
        }

        [HttpGet("{dealerId}/targets")]
        public async Task<IActionResult> GetTargetsForDealer(int dealerId)
        {
            var targets = await _dealerService.GetTargetsAsync(dealerId);
            return Ok(targets);
        }

        [HttpGet("{dealerId}/performance")]
        public async Task<IActionResult> TrackPerformance(int dealerId, [FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var performanceReport = await _dealerService.TrackPerformanceAsync(dealerId, startDate, endDate);
            return Ok(performanceReport);
        }

        [HttpGet("{dealerId}/debts")]
        public async Task<IActionResult> GetDebtsForDealer(int dealerId)
        {
            var debts = await _dealerService.GetDebtsAsync(dealerId);
            return Ok(debts);
        }

        // === PHẦN BỔ SUNG: ENDPOINT UPLOAD FILE ===
        // POST: /api/manage/dealers/{dealerId}/contracts/{contractId}/upload-pdf
        [HttpPost("{dealerId}/contracts/{contractId}/upload-pdf")]
        public async Task<IActionResult> UploadContractPdf(int dealerId, int contractId, IFormFile file)
        {
            try
            {
                var updatedContract = await _dealerService.UploadContractFileAsync(dealerId, contractId, file);
                if (updatedContract == null)
                {
                    return NotFound("Không tìm thấy hợp đồng tương ứng.");
                }
                return Ok(updatedContract);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server nội bộ: {ex.Message}");
            }
        }
    }
}
