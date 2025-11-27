using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.IInventory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers.V1
{
    [ApiController]
    [Route("api/v1/distributions")]
    [Authorize(Roles = "EVMStaff,Admin, DealerManager")]
    public class DistributionsController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public DistributionsController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        /// <summary>
        /// Tạo (các) lệnh điều phối mới từ một yêu cầu.
        /// </summary>
        // POST /api/v1/distributions
        [HttpPost]
        public async Task<IActionResult> CreateDistributions([FromBody] CreateDistributionFromRequestDto dto)
        {
            try
            {
                var result = await _inventoryService.CreateDistributionsFromRequestAsync(dto);
                // Trả về 201 Created và danh sách các phiếu đã tạo
                return StatusCode(201, result);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy danh sách tất cả các phiếu điều phối.
        /// </summary>
        // GET /api/v1/distributions
        [HttpGet]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> GetAllDistributions()
        {
            var distributions = await _inventoryService.GetDistributionSummaryAsync();
            return Ok(distributions);
        }

        /// <summary>
        /// Lấy chi tiết của một phiếu điều phối.
        /// </summary>
        // GET /api/v1/distributions/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> GetDistributionById(int id)
        {
            var distribution = await _inventoryService.GetDistributionDetailsByIdAsync(id);
            if (distribution == null)
                return NotFound(new { message = $"Không tìm thấy phiếu điều phối với ID = {id}" });

            return Ok(distribution);
        }

        /// <summary>
        /// Lấy danh sách các phiếu điều phối gửi đến đại lý của người dùng hiện tại.
        /// </summary>
        // GET /api/v1/distributions/mine
        [HttpGet("mine")]
        [Authorize(Roles = "DealerManager,DealerStaff")] // Chỉ nhân viên đại lý được gọi
        public async Task<IActionResult> GetMyDistributions()
        {
            // 1. Lấy dealerId của người dùng đang đăng nhập từ Token.
            var dealerIdClaim = User.FindFirstValue("dealerId");
            if (dealerIdClaim == null || !int.TryParse(dealerIdClaim, out int dealerId))
            {
                // Trả về lỗi nếu người dùng không thuộc đại lý nào.
                return Unauthorized("Tài khoản của bạn không được liên kết với một đại lý nào.");
            }

            // 2. Gọi Service với dealerId đã được xác thực để lấy dữ liệu.
            // Ghi chú: Cần đảm bảo IInventoryService có phương thức GetDistributionSummaryForDealerAsync.
            var distributions = await _inventoryService.GetDistributionSummaryForDealerAsync(dealerId);
            return Ok(distributions);
        }
        // === PHẦN BỔ SUNG QUAN TRỌNG: ENDPOINT XÁC NHẬN CỦA ĐẠI LÝ ===

        /// <summary>
        /// Đại lý xác nhận đã nhận hàng từ một phiếu điều phối.
        /// </summary>
        // POST /api/v1/distributions/{id}/confirm
        [HttpPost("{id}/confirm")]
        [Authorize(Roles = "DealerManager,Admin, EVMStaff")] 
        public async Task<IActionResult> ConfirmReceipt(int id)
        {
            // 1. Lấy dealerId của người dùng đang đăng nhập từ Token.
            var dealerIdClaim = User.FindFirstValue("dealerId");
            if (dealerIdClaim == null || !int.TryParse(dealerIdClaim, out int dealerId))
            {
                return Forbid("Chỉ tài khoản thuộc đại lý mới có thể thực hiện hành động này.");
            }

            try
            {
                // 2. Gọi phương thức Service đã có sẵn, truyền vào cả ID phiếu và ID đại lý để xác thực.
                var success = await _inventoryService.ConfirmDistributionReceiptAsync(id, dealerId);

                // 3. Xử lý kết quả trả về từ Service.
                if (!success)
                {
                    // Lỗi này có thể do: phiếu không tồn tại, không phải gửi cho đại lý này,
                    // đã được xác nhận trước đó, hoặc kho tổng hết hàng.
                    return BadRequest(new { message = "Xác nhận không thành công. Phiếu không hợp lệ, đã được xử lý hoặc kho nguồn không đủ hàng." });
                }

                // 4. Nếu thành công.
                return Ok(new { message = "Xác nhận nhận hàng thành công. Tồn kho đã được cập nhật." });
            }
            catch (System.Exception ex)
            {
                // Bắt các lỗi hệ thống khác nếu có
                return StatusCode(500, new { message = "Đã có lỗi xảy ra trong quá trình xử lý.", error = ex.Message });
            }
        }

    }
}