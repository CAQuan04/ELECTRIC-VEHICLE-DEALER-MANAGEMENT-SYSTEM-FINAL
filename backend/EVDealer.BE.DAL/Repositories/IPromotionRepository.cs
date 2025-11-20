using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IPromotionRepository
    {
        Task<Promotion> CreateAsync(Promotion promotion);
        Task<Promotion?> GetByIdAsync(int promotionId);
        Task<IEnumerable<Promotion>> GetAllAsync();
        Task AddPromotionToOrderAsync(OrderPromotion orderPromotion);
    }
}