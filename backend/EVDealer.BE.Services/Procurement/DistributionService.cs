using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.IInventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Procurement
{
    public class DistributionService : IDistributionService
    {
        private readonly IDistributionRepository _distributionRepo;
        private readonly IInventoryService _inventoryService;

        public DistributionService(IDistributionRepository distributionRepo, IInventoryService inventoryService)
        {
            _distributionRepo = distributionRepo;
            _inventoryService = inventoryService;
        }

        public async Task<IEnumerable<DistributionDto>> GetDistributionsForDealerAsync(int dealerId)
        {
            var distributions = await _distributionRepo.GetAllByDealerAsync(dealerId);
            return distributions.Select(MapToDto);
        }

        public async Task<DistributionDto> ConfirmDistributionAsync(int distId, int dealerId)
        {
            var distribution = await _distributionRepo.GetByIdAsync(distId);
            if (distribution == null || distribution.ToDealerId != dealerId || distribution.Status != "scheduled")
                throw new Exception("Distribution not found or not in a valid state for confirmation.");

            distribution.Status = "completed";
            await _distributionRepo.UpdateAsync(distribution);

            await _inventoryService.UpdateStockAsync(new UpdateStockDto
            {
                LocationType = "Dealer",
                LocationId = dealerId,
                VehicleId = distribution.VehicleId,
                ConfigId = distribution.ConfigId,
                Quantity = distribution.Quantity
            });

            return MapToDto(distribution);
        }

        private DistributionDto MapToDto(Distribution distribution)
        {
            return new DistributionDto
            {
                DistId = distribution.DistId,
                FromLocation = distribution.FromLocation,
                ToDealerId = distribution.ToDealerId,
                VehicleId = distribution.VehicleId,
                ConfigId = distribution.ConfigId,
                Quantity = distribution.Quantity,
                ScheduledDate = distribution.ScheduledDate,
                Status = distribution.Status
            };
        }
    }
}