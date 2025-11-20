using EVDealer.BE.DAL.Models;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IDeliveryRepository
    {
        Task<Delivery> CreateAsync(Delivery delivery);
        Task<Delivery?> GetByOrderIdAsync(int orderId);
        Task<Delivery?> GetByIdAsync(int deliveryId);
        Task<Delivery> UpdateAsync(Delivery delivery);
    }
}