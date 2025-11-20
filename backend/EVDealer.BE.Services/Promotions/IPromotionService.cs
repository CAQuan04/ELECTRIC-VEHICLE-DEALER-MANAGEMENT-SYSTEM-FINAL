using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Promotions
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreatePromotionAsync(PromotionCreateDto createDto);
        Task<IEnumerable<PromotionDto>> GetAllPromotionsAsync();
        Task<OrderDto> ApplyPromotionToOrderAsync(int orderId, int promotionId);
    }
}