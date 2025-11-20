using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Tạo đơn hàng từ báo giá
        /// Auth: DealerStaff, Admin
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "DealerStaff,Admin")]
        public async Task<IActionResult> CreateOrderFromQuotation([FromBody] OrderCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                 var userId = GetCurrentUserId();
                 if (userId == null) return Unauthorized();

                var order = await _orderService.CreateOrderFromQuotationAsync(createDto.QuotationId, userId.Value);
                return CreatedAtAction(nameof(GetOrderById), new { orderId = order.OrderId }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Duyệt đơn hàng
        /// Auth: DealerManager, Admin
        /// </summary>
        [HttpPut("{orderId}/approve")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> ApproveOrder(int orderId, [FromBody] OrderApproveDto approveDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null) return Unauthorized();

                var order = await _orderService.ApproveOrderAsync(orderId, approveDto, userId.Value);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Lấy đơn hàng theo ID
        /// Auth: DealerStaff, DealerManager, Admin
        /// </summary>
        [HttpGet("{orderId}")]
        [Authorize(Roles = "DealerStaff,DealerManager,Admin")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound();
            
            return Ok(order);
        }

        /// <summary>
        /// Lấy danh sách đơn hàng của dealer
        /// Auth: DealerStaff, DealerManager
        /// </summary>
        [HttpGet("dealer/{dealerId}")]
        [Authorize(Roles = "DealerStaff,DealerManager,Admin")]
        public async Task<IActionResult> GetDealerOrders(int dealerId, [FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            try
            {
                var orders = await _orderService.GetDealerOrdersAsync(dealerId, status, search);
                return Ok(new { success = true, data = orders });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Cập nhật trạng thái đơn hàng
        /// Auth: DealerStaff, DealerManager
        /// </summary>
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "DealerStaff,DealerManager,Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatusUpdateDto statusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _orderService.UpdateOrderStatusAsync(orderId, statusDto.Status);
                return Ok(new { success = true, message = "Order status updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Hoàn thành đơn hàng (cập nhật inventory)
        /// Auth: DealerManager
        /// </summary>
        [HttpPost("{orderId}/complete")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> CompleteOrder(int orderId)
        {
            try
            {
                await _orderService.CompleteOrderAsync(orderId);
                return Ok(new { success = true, message = "Order completed and inventory updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return null;
            }
            return userId;
        }
    }
}