using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Procurement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/procurement/requests")]
    [ApiController]
    [Authorize]
    public class PurchaseRequestsController : ControllerBase
    {
        private readonly IPurchaseRequestService _requestService;

        public PurchaseRequestsController(IPurchaseRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpPost]
        [Authorize(Roles = "DealerManager,DealerStaff")]
        public async Task<IActionResult> CreatePurchaseRequest([FromBody] PurchaseRequestCreateDto createDto)
        {
            var dealerId = GetDealerIdFromClaims();
            if (dealerId == null) return Unauthorized();

            var result = await _requestService.CreateRequestAsync(createDto, dealerId.Value);
            return CreatedAtAction(nameof(GetRequestsForDealer), new { }, result);
        }

        [HttpGet("mine")]
        [Authorize(Roles = "DealerManager,DealerStaff")]
        public async Task<IActionResult> GetRequestsForDealer()
        {
            var dealerId = GetDealerIdFromClaims();
            if (dealerId == null) return Unauthorized();

            var result = await _requestService.GetRequestsForDealerAsync(dealerId.Value);
            return Ok(result);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var result = await _requestService.GetPendingRequestsAsync();
            return Ok(result);
        }
        
        [HttpPut("{requestId}/approve")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> ApproveRequest(int requestId)
        {
            try
            {
                var result = await _requestService.ApproveRequestAsync(requestId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut("{requestId}/reject")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> RejectRequest(int requestId)
        {
            try
            {
                var result = await _requestService.RejectRequestAsync(requestId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Tạo Purchase Request từ Stock Request đã được duyệt
        /// Auth: DealerManager
        /// </summary>
        [HttpPost("from-stock-request/{stockRequestId}")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> CreateFromStockRequest(int stockRequestId)
        {
            try
            {
                var managerId = GetUserIdFromClaims();
                var result = await _requestService.CreateFromStockRequestAsync(stockRequestId, managerId);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Gửi Purchase Request tới EVM
        /// Auth: DealerManager (requires password confirmation)
        /// </summary>
        [HttpPost("{purchaseRequestId}/send-to-evm")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> SendToEVM(int purchaseRequestId, [FromBody] SendToEVMDto dto)
        {
            try
            {
                var success = await _requestService.SendToEVMAsync(purchaseRequestId, dto.ManagerPassword);
                return Ok(new { success = true, message = "Purchase request sent to EVM successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        private int? GetDealerIdFromClaims()
        {
            var dealerIdClaim = User.FindFirst("dealerId")?.Value;
            if (int.TryParse(dealerIdClaim, out var dealerId))
            {
                return dealerId;
            }
            return null;
        }

        private int GetUserIdFromClaims()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user identifier");
            }
            return userId;
        }
    }
}

// DTO for SendToEVM endpoint
namespace EVDealer.BE.Common.DTOs
{
    public class SendToEVMDto
    {
        public string ManagerPassword { get; set; } = null!;
    }
}