using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Deliveries
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepo;
        private readonly IOrderRepository _orderRepo;

        public DeliveryService(IDeliveryRepository deliveryRepo, IOrderRepository orderRepo)
        {
            _deliveryRepo = deliveryRepo;
            _orderRepo = orderRepo;
        }

        public async Task<DeliveryDto> ScheduleDeliveryAsync(DeliveryScheduleDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null) throw new Exception("Order not found.");
            if (order.Delivery != null) throw new Exception("A delivery has already been scheduled for this order.");

            var delivery = new Delivery
            {
                OrderId = dto.OrderId,
                ScheduledDate = dto.ScheduledDate,
                CarrierInfo = dto.CarrierInfo,
                Status = "Scheduled",
                TrackingNo = Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper()
            };

            order.Status = "PreparingForDelivery";
            await _orderRepo.UpdateAsync(order);
            
            var createdDelivery = await _deliveryRepo.CreateAsync(delivery);
            return MapToDto(createdDelivery);
        }

        public async Task<DeliveryDto> UpdateDeliveryStatusAsync(int deliveryId, DeliveryUpdateDto dto)
        {
            var delivery = await _deliveryRepo.GetByIdAsync(deliveryId);
            if (delivery == null) throw new Exception("Delivery not found.");

            delivery.Status = dto.Status;
            delivery.TrackingNo = dto.TrackingNo ?? delivery.TrackingNo;
            delivery.ActualDate = dto.ActualDate ?? delivery.ActualDate;

            if (dto.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
            {
                var order = await _orderRepo.GetByIdAsync(delivery.OrderId);
                if (order != null)
                {
                    order.Status = "Completed";
                    await _orderRepo.UpdateAsync(order);
                }
                delivery.ActualDate ??= DateOnly.FromDateTime(DateTime.UtcNow);
            }

            var updatedDelivery = await _deliveryRepo.UpdateAsync(delivery);
            return MapToDto(updatedDelivery);
        }

        public async Task<DeliveryDto?> TrackDeliveryAsync(int deliveryId)
        {
            var delivery = await _deliveryRepo.GetByIdAsync(deliveryId);
            return delivery == null ? null : MapToDto(delivery);
        }

        private DeliveryDto MapToDto(Delivery delivery)
        {
            return new DeliveryDto
            {
                DeliveryId = delivery.DeliveryId,
                OrderId = delivery.OrderId,
                Status = delivery.Status,
                ScheduledDate = delivery.ScheduledDate,
                ActualDate = delivery.ActualDate,
                TrackingNo = delivery.TrackingNo,
                CarrierInfo = delivery.CarrierInfo
            };
        }
    }
}