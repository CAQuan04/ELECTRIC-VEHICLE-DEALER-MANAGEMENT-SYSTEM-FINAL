using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Procurement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    // Đảm bảo Route này khớp với dealer.api.js ở Frontend
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

        // =========================================================================
        // 1. CREATE (Đã sửa để nhận JSON mảng items & config_id)
        // =========================================================================
        [HttpPost]
        [Authorize(Roles = "DealerManager,DealerStaff")]
        public async Task<IActionResult> CreatePurchaseRequest([FromBody] BulkPurchaseRequestInputDto input)
        {
            try
            {
                // Bảo mật: Lấy DealerId thực tế từ Token người đăng nhập
                var dealerIdFromToken = GetDealerIdFromClaims();
                if (dealerIdFromToken == null) return Unauthorized("Không tìm thấy thông tin đại lý trong token.");

                // (Tùy chọn) Validate dealerId gửi lên có khớp token không
                if (input.DealerId != 0 && input.DealerId != dealerIdFromToken)
                {
                    // Có thể return BadRequest hoặc chỉ cảnh báo log. 
                    // Ở đây ta ưu tiên dùng ID từ Token để đảm bảo an toàn.
                }

                var createdResults = new List<PurchaseRequestDto>();

                // Xử lý vòng lặp: Tách gói items thành từng request lẻ để lưu xuống DB
                foreach (var item in input.Items)
                {
                    var serviceDto = new PurchaseRequestCreateDto
                    {
                        VehicleId = item.VehicleId,
                        ConfigId = item.ConfigId, // Đã được map từ config_id
                        Quantity = item.Quantity,
                        Notes = input.Note // Lưu ghi chú chung vào từng đơn (hoặc xử lý khác tùy logic)
                    };

                    // Gọi Service tạo đơn lẻ
                    var result = await _requestService.CreateRequestAsync(serviceDto, dealerIdFromToken.Value);
                    createdResults.Add(result);
                }

                return Ok(new
                {
                    success = true,
                    message = $"Đã tạo thành công {createdResults.Count} yêu cầu nhập hàng.",
                    data = createdResults
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // =========================================================================
        // CÁC METHOD KHÁC (GIỮ NGUYÊN)
        // =========================================================================

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
        /// Lấy chi tiết yêu cầu mua hàng theo ID
        /// GET /api/procurement/requests/{id}
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "DealerManager,DealerStaff")]
        public async Task<IActionResult> GetPurchaseRequestById(int id)
        {
            var dealerId = GetDealerIdFromClaims();
            if (dealerId == null) return Unauthorized();
            var request = await _requestService.GetRequestByIdAsync(id, dealerId.Value);

            if (request == null) return NotFound(new { message = "Không tìm thấy yêu cầu hoặc bạn không có quyền truy cập." });

            return Ok(request);
        }
        /// <summary>
        /// Gửi đơn hàng đến EVM (Yêu cầu mật khẩu xác nhận)
        /// POST: api/procurement/requests/{id}/send-to-evm
        /// </summary>
        [HttpPost("{purchaseRequestId}/send-to-evm")]
        [Authorize(Roles = "DealerManager,Admin")] // Chỉ Manager mới được gửi
        public async Task<IActionResult> SendToEVM(int purchaseRequestId, [FromBody] SendToEVMDto dto)
        {
            try
            {
                // Gọi Service xử lý
                var success = await _requestService.SendToEVMAsync(purchaseRequestId, dto.ManagerPassword);

                if (success)
                {
                    return Ok(new { success = true, message = "Đơn hàng đã được gửi đến EVM thành công." });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Gửi thất bại." });
                }
            }
            catch (Exception ex)
            {
                // Trả về lỗi (ví dụ: Sai mật khẩu, Đơn hàng không tồn tại...)
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // --- HELPER METHODS ---

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