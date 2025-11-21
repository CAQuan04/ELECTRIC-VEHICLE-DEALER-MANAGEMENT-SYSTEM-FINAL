using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Promotions;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        
        private readonly ApplicationDbContext _context;

        // Inject cả 2 vào Constructor
        public PromotionsController(IPromotionService promotionService,
            IPromotionRepository promotionRepo,
            ApplicationDbContext context)
        {
            _promotionService = promotionService;
            
            _context = context;
        }

        /// <summary>
        /// Tạo chương trình khuyến mãi
        /// Auth: EVMStaff, Admin
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "DealerManager,EVMStaff,Admin")]
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
        /// Lấy chi tiết khuyến mãi theo ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [HttpGet("{id}")]
        [Authorize(Roles = "EVMStaff,DealerManager,Admin")]
        public async Task<IActionResult> GetPromotionById(int id)
        {
            
            var promotion = await _context.Promotions
                                          .AsNoTracking()
                                          .FirstOrDefaultAsync(p => p.PromotionId == id); 

            if (promotion == null)
            {
                return NotFound(new { message = $"Không tìm thấy khuyến mãi ID = {id}" });
            }

            return Ok(promotion);
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
        [HttpPut("{id}")]
        [Authorize(Roles = "DealerManager,EVMStaff,Admin")]
        public async Task<IActionResult> UpdatePromotion(int id, [FromBody] PromotionCreateDto dto)
        {
            // 1. Tìm bản ghi trong DB
            var promotion = await _context.Promotions.FindAsync(id);

            // 2. Nếu không thấy -> Trả về lỗi
            if (promotion == null)
            {
                return NotFound(new { message = $"Không tìm thấy khuyến mãi ID = {id}" });
            }

            // 3. Cập nhật dữ liệu mới
            promotion.Name = dto.Name;
            promotion.Description = dto.Description;
            promotion.DiscountType = dto.DiscountType;
            promotion.DiscountValue = dto.DiscountValue;
            promotion.StartDate = dto.StartDate;
            promotion.EndDate = dto.EndDate;
            promotion.Status = dto.Status;

            // Lưu ý: Nếu có trường DealerId, hãy đảm bảo không bị ghi đè thành null hoặc sai
            // promotion.DealerId = ... (giữ nguyên hoặc cập nhật nếu cần)

            // 4. Lưu xuống Database
            try
            {
                await _context.SaveChangesAsync();
                return Ok(promotion);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
            }
        }
    }
}