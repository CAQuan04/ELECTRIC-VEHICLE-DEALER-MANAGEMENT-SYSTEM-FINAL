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
    }
}
