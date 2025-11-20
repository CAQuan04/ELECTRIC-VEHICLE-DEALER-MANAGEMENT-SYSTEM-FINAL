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