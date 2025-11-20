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

        private int? GetDealerIdFromClaims()
        {
            var dealerIdClaim = User.FindFirst("dealerId")?.Value;
            if (int.TryParse(dealerIdClaim, out var dealerId))
            {
                return dealerId;
            }
            return null;
        }
    }
}