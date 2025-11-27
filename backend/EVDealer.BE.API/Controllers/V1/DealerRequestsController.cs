// File: API/Controllers/V1/DealerRequestsController.cs
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Procurement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers.V1
{
    [ApiController]
    [Route("api/v1/dealer-requests")]
    [Authorize]
    public class DealerRequestsController : ControllerBase
    {
        private readonly IPurchaseRequestService _requestService;

        public DealerRequestsController(IPurchaseRequestService requestService)
        {
            _requestService = requestService;
        }

        // === ENDPOINTS CHO EVM STAFF ===

        /// <summary>
        /// Lấy danh sách tất cả các yêu cầu đang chờ duyệt từ các đại lý.
        /// </summary>
        // GET /api/v1/dealer-requests/pending (Endpoint này không có trong doc nhưng cần thiết cho EVM)
        [HttpGet("pending")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var result = await _requestService.GetPendingRequestsAsync();
            return Ok(result);
        }

        /// <summary>
        /// Duyệt một yêu cầu (toàn bộ hoặc một phần).
        /// </summary>
        // POST /api/v1/dealer-requests/{id}/approve
        [HttpPost("{id}/approve")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> ApproveRequest(int id, [FromBody] ApproveRequestDto? dto)
        {
            try
            {
                // Ghi chú: Gọi phương thức Service mới đã được nâng cấp.
                var result = await _requestService.ProcessApprovalAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Từ chối một yêu cầu đặt xe.
        /// </summary>
        // POST /api/v1/dealer-requests/{id}/reject
        [HttpPost("{id}/reject")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            try
            {
                // Ghi chú: Gọi lại phương thức Reject đã có sẵn.
                var result = await _requestService.RejectRequestAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}