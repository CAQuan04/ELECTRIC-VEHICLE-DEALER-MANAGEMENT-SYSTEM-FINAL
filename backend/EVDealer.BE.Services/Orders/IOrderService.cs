using EVDealer.BE.Common.DTOs;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Orders
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderFromQuotationAsync(int quotationId, int staffUserId);
        Task<OrderDto> ApproveOrderAsync(int orderId, OrderApproveDto approveDto, int managerUserId);
        Task<OrderDto?> GetOrderByIdAsync(int orderId);
    }
}