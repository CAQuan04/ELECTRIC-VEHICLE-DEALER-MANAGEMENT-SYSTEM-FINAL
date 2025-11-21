using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SalesOrder> CreateAsync(SalesOrder order)
        {
            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<SalesOrder?> GetByIdAsync(int orderId)
        {
            return await _context.SalesOrders
                .Include(so => so.OrderItems)
                .Include(so => so.Contract)
                .FirstOrDefaultAsync(so => so.OrderId == orderId);
        }

        public async Task<SalesOrder> UpdateAsync(SalesOrder order)
        {
            _context.SalesOrders.Update(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllAsync()
        {
            return await _context.SalesOrders
                .Include(so => so.OrderItems)
                .Include(so => so.Contract)
                .ToListAsync();
        }
    }
}