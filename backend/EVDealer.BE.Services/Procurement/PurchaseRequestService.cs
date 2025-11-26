using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Procurement
{
    public class PurchaseRequestService : IPurchaseRequestService
    {
        private readonly IPurchaseRequestRepository _purchaseRequestRepo;
        private readonly IDistributionRepository _distributionRepo;
        private readonly IInventoryRepository _inventoryRepo;

        public PurchaseRequestService(
            IPurchaseRequestRepository purchaseRequestRepo, 
            IDistributionRepository distributionRepo,
            IInventoryRepository inventoryRepo)
        {
            _purchaseRequestRepo = purchaseRequestRepo;
            _distributionRepo = distributionRepo;
            _inventoryRepo = inventoryRepo;
        }

        public async Task<PurchaseRequestDto> CreateRequestAsync(PurchaseRequestCreateDto dto, int dealerId)
        {
            var request = new PurchaseRequest
            {
                DealerId = dealerId,
                VehicleId = dto.VehicleId,
                ConfigId = dto.ConfigId,
                Quantity = dto.Quantity,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };
            var createdRequest = await _purchaseRequestRepo.CreateAsync(request);
            return MapToDto(createdRequest);
        }

        public async Task<IEnumerable<PurchaseRequestDto>> GetRequestsForDealerAsync(int dealerId)
        {
            var requests = await _purchaseRequestRepo.GetAllByDealerAsync(dealerId);
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<PurchaseRequestDto>> GetPendingRequestsAsync()
        {
            var requests = await _purchaseRequestRepo.GetAllPendingAsync();
            return requests.Select(MapToDto);
        }

        public async Task<PurchaseRequestDto> ApproveRequestAsync(int requestId)
        {
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != "pending")
                throw new Exception("Request not found or not in a pending state.");

            request.Status = "approved";
            await _purchaseRequestRepo.UpdateAsync(request);
            
            var distribution = new Distribution
            {
                FromLocation = "EVM Central Warehouse",
                ToDealerId = request.DealerId,
                VehicleId = request.VehicleId,
                ConfigId = request.ConfigId,
                Quantity = request.Quantity,
                ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
                Status = "scheduled"
            };
            await _distributionRepo.CreateAsync(distribution);

            return MapToDto(request);
        }

        public async Task<PurchaseRequestDto> RejectRequestAsync(int requestId)
        {
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != "pending")
                throw new Exception("Request not found or not in a pending state.");

            request.Status = "rejected";
            var updatedRequest = await _purchaseRequestRepo.UpdateAsync(request);
            return MapToDto(updatedRequest);
        }
        
        private PurchaseRequestDto MapToDto(PurchaseRequest request)
        {
            return new PurchaseRequestDto
            {
                RequestId = request.RequestId,
                DealerId = request.DealerId,
                VehicleId = request.VehicleId,
                ConfigId = request.ConfigId,
                Quantity = request.Quantity,
                Status = request.Status,
                CreatedAt = request.CreatedAt
            };
        }

        // ==================== NEW: STOCK REQUEST INTEGRATION ====================
        
        public async Task<PurchaseRequestDto> CreateFromStockRequestAsync(int stockRequestId, int managerId)
        {
            // 1. Get approved stock request
            var stockRequest = await _inventoryRepo.GetStockRequestByIdAsync(stockRequestId);

            if (stockRequest == null || stockRequest.Status != "Approved")
            {
                throw new Exception("Stock request must be approved first");
            }

            // 2. Create purchase request
            var purchaseRequest = new PurchaseRequest
            {
                VehicleId = stockRequest.VehicleId,
                ConfigId = stockRequest.ConfigId ?? 0,
                DealerId = stockRequest.DealerId,
                Quantity = stockRequest.Quantity,
                //Priority = stockRequest.Priority,
                Status = "Pending",
                Notes = $"From Stock Request #{stockRequest.StockRequestId}: {stockRequest.Reason}",
                //RequestedByUserId = managerId,
                CreatedAt = DateTime.UtcNow,
                //SourceStockRequestId = stockRequestId
            };

            var created = await _purchaseRequestRepo.CreateAsync(purchaseRequest);
            return MapToDto(created);
        }

        public async Task<bool> SendToEVMAsync(int purchaseRequestId, string managerPassword)
        {
            // TODO: Implement password verification with IAuthService
            // var managerId = GetCurrentUserId();
            // var isValid = await _authService.VerifyPasswordAsync(managerId, managerPassword);
            // if (!isValid) throw new UnauthorizedException("Invalid password");

            // Get purchase request
            var request = await _purchaseRequestRepo.GetByIdAsync(purchaseRequestId);
            if (request == null)
            {
                throw new Exception("Purchase request not found");
            }

            // Mock: Send to EVM (in real scenario, call EVM API)
            await Task.Delay(100); // Simulate API call
            var success = true;

            if (success)
            {
                request.Status = "Sent";
                //request.SentToEVMDate = DateTime.UtcNow;
                //request.EVMOrderId = $"EVM-{purchaseRequestId}-{DateTime.UtcNow:yyyyMMddHHmmss}";
                await _purchaseRequestRepo.UpdateAsync(request);
            }

            return success;
        }

        public async Task<PurchaseRequestDto?> GetByEVMOrderIdAsync(string evmOrderId)
        {
            var requests = await _purchaseRequestRepo.GetAllPendingAsync();
            var request = requests.FirstOrDefault();
            
            return request == null ? null : MapToDto(request);
        }
    }
}