using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Promotions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PromotionsController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public PromotionsController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        /// <summary>
        /// Tạo chương trình khuyến mãi
        /// Auth: EVMStaff, Admin
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "EVMStaff,Admin")]
        public async Task<IActionResult> CreatePromotion([FromBody] PromotionCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var promotion = await _promotionService.CreatePromotionAsync(createDto);
                return Ok(promotion);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Lấy tất cả chương trình khuyến mãi
        /// Auth: EVMStaff, DealerManager, Admin
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "EVMStaff,DealerManager,Admin")]
        public async Task<IActionResult> GetAllPromotions()
        {
            var promotions = await _promotionService.GetAllPromotionsAsync();
            return Ok(promotions);
        }

        /// <summary>
        /// Áp dụng khuyến mãi cho đơn hàng
        /// Auth: DealerManager, Admin
        /// </summary>
        [HttpPost("apply/{orderId}")]
        [Authorize(Roles = "DealerManager,Admin")]
        public async Task<IActionResult> ApplyPromotion(int orderId, [FromBody] ApplyPromotionDto applyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedOrder = await _promotionService.ApplyPromotionToOrderAsync(orderId, applyDto.PromotionId);
                return Ok(updatedOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}