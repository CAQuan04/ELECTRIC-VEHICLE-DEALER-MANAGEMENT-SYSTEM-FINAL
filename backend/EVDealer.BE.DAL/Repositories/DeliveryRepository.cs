using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class DeliveryRepository : IDeliveryRepository
    {
        private readonly ApplicationDbContext _context;

        public DeliveryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Delivery> CreateAsync(Delivery delivery)
        {
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();
            return delivery;
        }

        public async Task<Delivery?> GetByOrderIdAsync(int orderId)
        {
            return await _context.Deliveries.FirstOrDefaultAsync(d => d.OrderId == orderId);
        }

        public async Task<Delivery?> GetByIdAsync(int deliveryId)
        {
            return await _context.Deliveries.FindAsync(deliveryId);
        }

        public async Task<Delivery> UpdateAsync(Delivery delivery)
        {
            _context.Deliveries.Update(delivery);
            await _context.SaveChangesAsync();
            return delivery;
        }
    }
}