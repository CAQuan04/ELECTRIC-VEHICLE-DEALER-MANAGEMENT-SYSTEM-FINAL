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

        public PurchaseRequestService(IPurchaseRequestRepository purchaseRequestRepo, IDistributionRepository distributionRepo)
        {
            _purchaseRequestRepo = purchaseRequestRepo;
            _distributionRepo = distributionRepo;
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
    }
}