using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Promotions
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _promotionRepository;
        private readonly IOrderRepository _orderRepository;

        public PromotionService(IPromotionRepository promotionRepository, IOrderRepository orderRepository)
        {
            _promotionRepository = promotionRepository;
            _orderRepository = orderRepository;
        }

        public async Task<PromotionDto> CreatePromotionAsync(PromotionCreateDto createDto)
        {
            var promotion = MapToPromotion(createDto);
            var createdPromotion = await _promotionRepository.CreateAsync(promotion);
            return MapToPromotionDto(createdPromotion);
        }

        public async Task<IEnumerable<PromotionDto>> GetAllPromotionsAsync()
        {
            var promotions = await _promotionRepository.GetAllAsync();
            return promotions.Select(MapToPromotionDto);
        }

        public async Task<OrderDto> ApplyPromotionToOrderAsync(int orderId, int promotionId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found.");

            var promotion = await _promotionRepository.GetByIdAsync(promotionId);
            if (promotion == null) throw new Exception("Promotion not found.");
            
            if (promotion.Status != "Active") throw new Exception("Promotion is not active.");
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (today < promotion.StartDate || today > promotion.EndDate) throw new Exception("Promotion is not valid at this time.");
            if (order.OrderPromotions.Any(op => op.PromotionId == promotionId)) throw new Exception("Promotion has already been applied to this order.");
            
            decimal discountAmount = 0;
            if (promotion.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
            {
                discountAmount = order.TotalAmount * (promotion.DiscountValue / 100);
            }
            else if (promotion.DiscountType.Equals("FixedAmount", StringComparison.OrdinalIgnoreCase))
            {
                discountAmount = promotion.DiscountValue;
            }

            order.TotalAmount -= discountAmount;
            if (order.TotalAmount < 0) order.TotalAmount = 0;

            var orderPromotion = new OrderPromotion { OrderId = orderId, PromotionId = promotionId };
            order.OrderPromotions.Add(orderPromotion);

            var updatedOrder = await _orderRepository.UpdateAsync(order);
            return MapToOrderDto(updatedOrder);
        }

        private Promotion MapToPromotion(PromotionCreateDto dto)
        {
            return new Promotion
            {
                Name = dto.Name,
                Description = dto.Description,
                DiscountType = dto.DiscountType,
                DiscountValue = dto.DiscountValue,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status
            };
        }

        private PromotionDto MapToPromotionDto(Promotion promotion)
        {
            return new PromotionDto
            {
                PromotionId = promotion.PromotionId,
                Name = promotion.Name,
                Description = promotion.Description,
                DiscountType = promotion.DiscountType,
                DiscountValue = promotion.DiscountValue,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                Status = promotion.Status
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