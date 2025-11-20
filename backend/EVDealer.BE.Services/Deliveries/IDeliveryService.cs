using EVDealer.BE.Common.DTOs;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Deliveries
{
    public interface IDeliveryService
    {
        Task<DeliveryDto> ScheduleDeliveryAsync(DeliveryScheduleDto dto);
        Task<DeliveryDto> UpdateDeliveryStatusAsync(int deliveryId, DeliveryUpdateDto dto);
        Task<DeliveryDto?> TrackDeliveryAsync(int deliveryId);
    }
}