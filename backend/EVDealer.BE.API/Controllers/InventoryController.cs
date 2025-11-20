using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.Services.IInventory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Yêu cầu phải đăng nhập cho tất cả các hành động trong Controller này.
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        public InventoryController(IInventoryService inventoryService) => _inventoryService = inventoryService;

        // Endpoint: POST /api/inventory/stock
        // Ghi chú: Dùng để nhập/xuất kho tổng. Chỉ người có quyền 'ManageInventory' được dùng.
        [HttpPost("stock")]
        [Authorize(Policy = "ManageInventory")]
        public async Task<IActionResult> UpdateStock([FromBody] UpdateStockDto dto)
        {
            try
            {
                var success = await _inventoryService.UpdateStockAsync(dto);
                return Ok(new { success });
            }
            catch (InvalidOperationException ex)
            {
                // Bắt lỗi nghiệp vụ "Tồn kho âm" từ Service và trả về lỗi 400 Bad Request.
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint: POST /api/inventory/distributions
        // Ghi chú: Dùng để tạo phiếu điều phối. Chỉ người có quyền 'ManageDistributions' được dùng.
        [HttpPost("distributions")]
        [Authorize(Policy = "ManageDistributions")]
        public async Task<IActionResult> CreateDistribution([FromBody] CreateDistributionDto dto)
        {
            var newDistribution = await _inventoryService.CreateDistributionAsync(dto);
            return Ok(newDistribution);
        }

        // Endpoint: POST /api/inventory/distributions/{id}/confirm
        // Ghi chú: Dùng để Đại lý xác nhận nhận hàng. Chỉ người có quyền 'ConfirmDistributions' được dùng.
        [HttpPost("distributions/{id}/confirm")]
        [Authorize(Policy = "ConfirmDistributions")]
        public async Task<IActionResult> ConfirmDistribution(int id)
        {
            // 1. Lấy dealerId của người dùng đang đăng nhập từ "Thẻ Bài" (Token).
            var dealerIdClaim = User.FindFirstValue("dealerId");
            if (dealerIdClaim == null || !int.TryParse(dealerIdClaim, out int dealerId))
            {
                // Nếu người dùng không thuộc đại lý nào (ví dụ Admin), không cho phép xác nhận.
                return Forbid("Chỉ nhân viên đại lý mới có thể xác nhận nhận hàng.");
            }

            // 2. Gọi Service để thực hiện nghiệp vụ phức tạp.
            var success = await _inventoryService.ConfirmDistributionReceiptAsync(id, dealerId);

            // 3. Nếu không thành công (phiếu không hợp lệ, hết hàng,...).
            if (!success)
            {
                return BadRequest(new { message = "Xác nhận không thành công. Phiếu không hợp lệ hoặc kho nguồn đã hết hàng." });
            }

            // 4. Nếu thành công.
            return Ok(new { message = "Xác nhận nhận hàng thành công. Tồn kho đã được cập nhật." });
        }

        // --- Các endpoint GET để Frontend gọi ---

        [HttpGet("summary")] // GET /api/inventory/summary
        public async Task<IActionResult> GetInventorySummary()
        {
            var summary = await _inventoryService.GetInventorySummaryAsync();
            return Ok(summary);
        }

        [HttpGet("distributions/summary")] // GET /api/inventory/distributions/summary
        public async Task<IActionResult> GetDistributionSummary()
        {
            var summary = await _inventoryService.GetDistributionSummaryAsync();
            return Ok(summary);
        }

        // ==================== DEALER INVENTORY ENDPOINTS ====================

        /// <summary>
        /// Lấy danh sách kho xe của dealer
        /// GET /api/Inventory/dealer/{dealerId}
        /// </summary>
        [HttpGet("dealer/{dealerId}")]
        [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
        public async Task<IActionResult> GetDealerInventory(int dealerId, [FromQuery] string? search)
        {
            try
            {
                Console.WriteLine($"📞 [InventoryController] GetDealerInventory called - dealerId: {dealerId}, search: {search}");
                var inventory = await _inventoryService.GetDealerInventoryAsync(dealerId, search);
                var inventoryList = inventory.ToList();
                Console.WriteLine($"📦 [InventoryController] Returning {inventoryList.Count} items");
                if (inventoryList.Count > 0)
                {
                    Console.WriteLine($"📦 [InventoryController] First item: {System.Text.Json.JsonSerializer.Serialize(inventoryList[0])}");
                }
                return Ok(inventoryList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [InventoryController] Error: {ex.Message}");
                Console.WriteLine($"❌ [InventoryController] StackTrace: {ex.StackTrace}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy chi tiết một item trong kho
        /// GET /api/Inventory/dealer/{dealerId}/item/{inventoryId}
        /// </summary>
        [HttpGet("dealer/{dealerId}/item/{inventoryId}")]
        [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
        public async Task<IActionResult> GetInventoryItemDetail(int dealerId, int inventoryId)
        {
            try
            {
                var item = await _inventoryService.GetInventoryItemDetailAsync(dealerId, inventoryId);
                if (item == null)
                    return NotFound(new { message = "Không tìm thấy thông tin kho" });
                
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật thông tin kho
        /// PUT /api/Inventory/update
        /// </summary>
        [HttpPut("update")]
        [Authorize(Policy = "ManageInventory")]
        public async Task<IActionResult> UpdateInventory([FromBody] UpdateInventoryDto dto)
        {
            try
            {
                var result = await _inventoryService.UpdateInventoryAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ==================== STOCK REQUEST ENDPOINTS (Staff → Manager Flow) ====================

        /// <summary>
        /// Lấy danh sách yêu cầu nhập hàng (cho Manager xem)
        /// GET /api/Inventory/distributions/requests
        /// </summary>
        [HttpGet("distributions/requests")]
        [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
        public async Task<IActionResult> GetStockRequests([FromQuery] string? status, [FromQuery] string? search)
        {
            try
            {
                var dealerIdClaim = User.FindFirstValue("dealerId");
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim, out int dealerId))
                {
                    return BadRequest(new { message = "Không xác định được dealer" });
                }

                var requests = await _inventoryService.GetStockRequestsAsync(dealerId, status, search);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy chi tiết yêu cầu nhập hàng
        /// GET /api/Inventory/distributions/requests/{requestId}
        /// </summary>
        [HttpGet("distributions/requests/{requestId}")]
        [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
        public async Task<IActionResult> GetStockRequestById(int requestId)
        {
            try
            {
                var request = await _inventoryService.GetStockRequestByIdAsync(requestId);
                if (request == null)
                    return NotFound(new { message = "Không tìm thấy yêu cầu" });
                
                return Ok(request);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Tạo yêu cầu nhập hàng (Staff tạo)
        /// POST /api/Inventory/distributions/requests
        /// </summary>
        [HttpPost("distributions/requests")]
        [Authorize(Roles = "DealerStaff,DealerManager")]
        public async Task<IActionResult> CreateStockRequest([FromBody] CreateStockRequestDto dto)
        {
            try
            {
                var dealerIdClaim = User.FindFirstValue("dealerId");
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (dealerIdClaim == null || !int.TryParse(dealerIdClaim, out int dealerId))
                {
                    return BadRequest(new { message = "Không xác định được dealer" });
                }
                
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                {
                    return BadRequest(new { message = "Không xác định được user" });
                }

                var result = await _inventoryService.CreateStockRequestAsync(dto, dealerId, userId);
                return CreatedAtAction(nameof(GetStockRequestById), new { requestId = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Manager duyệt yêu cầu nhập hàng
        /// PUT /api/Inventory/distributions/requests/{requestId}/approve
        /// </summary>
        [HttpPut("distributions/requests/{requestId}/approve")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> ApproveStockRequest(int requestId)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int managerId))
                {
                    return BadRequest(new { message = "Không xác định được manager" });
                }

                var result = await _inventoryService.ApproveStockRequestAsync(requestId, managerId);
                return Ok(new { success = true, message = "Đã duyệt yêu cầu", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Manager từ chối yêu cầu nhập hàng
        /// PUT /api/Inventory/distributions/requests/{requestId}/reject
        /// </summary>
        [HttpPut("distributions/requests/{requestId}/reject")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> RejectStockRequest(int requestId, [FromBody] RejectStockRequestDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int managerId))
                {
                    return BadRequest(new { message = "Không xác định được manager" });
                }

                var result = await _inventoryService.RejectStockRequestAsync(requestId, managerId, dto.Reason);
                return Ok(new { success = true, message = "Đã từ chối yêu cầu", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
