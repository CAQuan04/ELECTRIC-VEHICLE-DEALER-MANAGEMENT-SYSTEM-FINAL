using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Orders
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderFromQuotationAsync(int quotationId, int staffUserId);
        Task<OrderDto> ApproveOrderAsync(int orderId, OrderApproveDto approveDto, int managerUserId);
        Task<OrderDto?> GetOrderByIdAsync(int orderId);
        Task<IEnumerable<OrderDto>> GetDealerOrdersAsync(int dealerId, string? status, string? search);
        Task UpdateOrderStatusAsync(int orderId, string status);
        Task CompleteOrderAsync(int orderId);
    }
}