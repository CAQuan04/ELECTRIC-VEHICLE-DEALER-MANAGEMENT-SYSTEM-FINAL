using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Deliveries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "DealerStaff,DealerManager,Admin")]
    public class DeliveriesController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveriesController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleDelivery([FromBody] DeliveryScheduleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var delivery = await _deliveryService.ScheduleDeliveryAsync(dto);
                return CreatedAtAction(nameof(TrackDelivery), new { deliveryId = delivery.DeliveryId }, delivery);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{deliveryId}/status")]
        public async Task<IActionResult> UpdateDeliveryStatus(int deliveryId, [FromBody] DeliveryUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var delivery = await _deliveryService.UpdateDeliveryStatusAsync(deliveryId, dto);
                return Ok(delivery);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{deliveryId}/track")]
        public async Task<IActionResult> TrackDelivery(int deliveryId)
        {
            var delivery = await _deliveryService.TrackDeliveryAsync(deliveryId);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }
    }
}