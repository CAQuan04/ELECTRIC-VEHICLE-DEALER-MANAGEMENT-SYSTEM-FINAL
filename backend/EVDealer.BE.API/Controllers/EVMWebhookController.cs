using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.IInventory;
using EVDealer.BE.Services.Procurement;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    /// <summary>
    /// Webhook endpoints for EVM system to notify Dealer system about order fulfillment
    /// </summary>
    [Route("api/evm-webhook")]
    [ApiController]
    public class EVMWebhookController : ControllerBase
    {
        private readonly IPurchaseRequestService _purchaseService;
        private readonly IInventoryService _inventoryService;

        public EVMWebhookController(
            IPurchaseRequestService purchaseService,
            IInventoryService inventoryService)
        {
            _purchaseService = purchaseService;
            _inventoryService = inventoryService;
        }

        /// <summary>
        /// Handle order fulfilled notification from EVM
        /// This endpoint is called by EVM system when an order is completed
        /// </summary>
        [HttpPost("order-fulfilled")]
        public async Task<IActionResult> HandleOrderFulfilled([FromBody] EVMOrderFulfilledDto dto)
        {
            try
            {
                // 1. Find purchase request by EVM order ID
                var purchaseRequest = await _purchaseService.GetByEVMOrderIdAsync(dto.EVMOrderId);

                if (purchaseRequest == null)
                {
                    return NotFound(new { message = $"Purchase request not found for EVM Order ID: {dto.EVMOrderId}" });
                }

                // 2. Increase dealer inventory
                await _inventoryService.IncreaseInventoryAsync(
                    purchaseRequest.DealerId,
                    purchaseRequest.VehicleId,
                    purchaseRequest.ConfigId,
                    purchaseRequest.Quantity
                );

                // 3. Update purchase request status (would need to implement UpdateStatusAsync)
                // await _purchaseService.UpdateStatusAsync(purchaseRequest.RequestId, "Completed");

                return Ok(new 
                { 
                    success = true, 
                    message = "Order fulfilled successfully, inventory updated",
                    dealerId = purchaseRequest.DealerId,
                    vehicleId = purchaseRequest.VehicleId,
                    quantityAdded = purchaseRequest.Quantity
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint for EVM to verify webhook availability
        /// </summary>
        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new 
            { 
                status = "healthy", 
                timestamp = DateTime.UtcNow,
                service = "Dealer EVM Webhook"
            });
        }
    }
}

namespace EVDealer.BE.Common.DTOs
{
    /// <summary>
    /// DTO for EVM order fulfillment notification
    /// </summary>
    public class EVMOrderFulfilledDto
    {
        public string EVMOrderId { get; set; } = null!;
        public int VehicleId { get; set; }
        public int Quantity { get; set; }
        public string? Color { get; set; }
        public DateTime FulfilledDate { get; set; }
    }
}
