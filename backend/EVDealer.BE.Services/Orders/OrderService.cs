using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IQuotationRepository _quotationRepository;
        private readonly IUserRepository _userRepository;

        public OrderService(IOrderRepository orderRepository, IQuotationRepository quotationRepository, IUserRepository userRepository)
        {
            _orderRepository = orderRepository;
            _quotationRepository = quotationRepository;
            _userRepository = userRepository;
        }

        public async Task<OrderDto> CreateOrderFromQuotationAsync(int quotationId, int staffUserId)
        {
            var quotation = await _quotationRepository.GetByIdAsync(quotationId);
            if (quotation == null)
                throw new Exception("Quotation not found.");
            if (quotation.SalesOrder != null)
                throw new Exception("An order has already been created for this quotation.");
            if (quotation.ValidUntil.HasValue && quotation.ValidUntil.Value < DateOnly.FromDateTime(DateTime.UtcNow))
                 throw new Exception("Quotation has expired.");

            var staffUser = await _userRepository.GetByIdAsync(staffUserId);
            if (staffUser?.DealerId == null)
                 throw new Exception("User is not associated with any dealer.");

            var salesOrder = new SalesOrder
            {
                QuotationId = quotation.QuotationId,
                CustomerId = quotation.CustomerId,
                DealerId = staffUser.DealerId.Value,
                TotalAmount = quotation.TotalAmount,
                OrderDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Status = "PendingApproval",
                OrderItems = quotation.QuotationItems.Select(qi => new OrderItem
                {
                    VehicleId = qi.VehicleId,
                    ConfigId = qi.ConfigId,
                    Quantity = qi.Quantity,
                    UnitPrice = qi.UnitPrice
                }).ToList()
            };

            salesOrder.Contract = GenerateContract(salesOrder);
            
            var createdOrder = await _orderRepository.CreateAsync(salesOrder);
            
            return MapToOrderDto(createdOrder);
        }

        public async Task<OrderDto> ApproveOrderAsync(int orderId, OrderApproveDto approveDto, int managerUserId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                throw new Exception("Order not found.");

            order.Status = approveDto.Status;
            order.ApprovalNote = approveDto.ApprovalNote;
            order.ApprovedBy = managerUserId;
            order.ApprovedAt = DateTime.UtcNow;

            var updatedOrder = await _orderRepository.UpdateAsync(order);
            return MapToOrderDto(updatedOrder);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            return order != null ? MapToOrderDto(order) : null;
        }

        private Contract GenerateContract(SalesOrder order)
        {
            var terms = $"This contract is made on {DateTime.UtcNow.ToShortDateString()} for the sale of vehicles with a total amount of {order.TotalAmount:C}.";
            
            return new Contract
            {
                Order = order,
                ContractDate = DateTime.UtcNow,
                Terms = terms,
                Status = "Generated"
            };
        }

        private OrderDto MapToOrderDto(SalesOrder order)
        {
            return new OrderDto
            {
                OrderId = order.OrderId,
                QuotationId = order.QuotationId,
                CustomerId = order.CustomerId,
                DealerId = order.DealerId,
                TotalAmount = order.TotalAmount,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ApprovedBy = order.ApprovedBy,
                ApprovalNote = order.ApprovalNote,
                ApprovedAt = order.ApprovedAt,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    VehicleId = oi.VehicleId,
                    ConfigId = oi.ConfigId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList(),
                Contract = order.Contract != null ? new SalesOrderContractDto()
                {
                    ContractId = order.Contract.ContractId,
                    ContractDate = order.Contract.ContractDate,
                    Status = order.Contract.Status,
                    Terms = order.Contract.Terms
                } : null
            };
        }
    }
}