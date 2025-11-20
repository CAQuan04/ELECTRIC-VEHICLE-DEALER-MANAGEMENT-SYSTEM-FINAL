using EVDealer.BE.DAL.Models;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IOrderRepository
    {
        Task<SalesOrder> CreateAsync(SalesOrder order);
        Task<SalesOrder?> GetByIdAsync(int orderId);
        Task<SalesOrder> UpdateAsync(SalesOrder order);
    }
}