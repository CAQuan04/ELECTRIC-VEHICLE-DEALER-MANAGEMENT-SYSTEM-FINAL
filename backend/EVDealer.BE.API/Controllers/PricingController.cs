using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Pricing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers
{
    // Ghi chú: Route riêng cho các nghiệp vụ về giá.
    [Route("api/pricing")]
    [ApiController]
    // Ghi chú: Toàn bộ Controller được bảo vệ bởi Policy "ManagePricing".
    [Authorize(Policy = "ManagePricing")]
    public class PricingController : ControllerBase
    {
        private readonly IPricingService _pricingService;
        public PricingController(IPricingService pricingService) => _pricingService = pricingService;

        // Endpoint: POST /api/pricing/wholesale-prices
        // Ghi chú: Dùng để thiết lập một mức giá sỉ mới.
        [HttpPost("wholesale-prices")]
        public async Task<IActionResult> SetWholesalePrice([FromBody] SetWholesalePriceDto dto)
        {
            var result = await _pricingService.SetWholesalePriceAsync(dto);
            return Ok(result);
        }

        // Endpoint: POST /api/pricing/promotion-policies
        // Ghi chú: Dùng để tạo một chính sách khuyến mãi mới cho đại lý.
        [HttpPost("promotion-policies")]
        public async Task<IActionResult> CreatePromotionPolicy([FromBody] CreatePromotionPolicyDto dto)
        {
            var result = await _pricingService.CreatePromotionPolicyAsync(dto);
            return Ok(result);
        }

        // Endpoint: GET /api/pricing/dealers/{dealerId}/vehicles/{vehicleId}/applicable-price
        // Ghi chú: Dùng để kiểm tra giá áp dụng hiện tại cho một đại lý đối với một sản phẩm.
        [HttpGet("dealers/{dealerId}/vehicles/{vehicleId}/applicable-price")]
        public async Task<IActionResult> GetApplicablePrice(int dealerId, int vehicleId)
        {
            var price = await _pricingService.GetPriceForDealerAsync(vehicleId, dealerId);
            if (price == null)
            {
                return NotFound(new { message = "Không tìm thấy giá sỉ nào còn hiệu lực cho sản phẩm này." });
            }
            return Ok(price);
        }
    }
}
