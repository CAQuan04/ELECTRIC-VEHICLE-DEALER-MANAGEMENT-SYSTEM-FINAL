using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Vehicles;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleService(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    public async Task<PagedResult<VehicleListDto>> GetVehiclesAsync(VehicleQueryDto query)
    {
        var vehicles = await _vehicleRepository.GetVehiclesWithPagingAsync(query);
        var total = await _vehicleRepository.GetVehiclesTotalCountAsync(query);

        var vehicleDtos = vehicles.Select(MapToVehicleListDto).ToList();

        return new PagedResult<VehicleListDto>
        {
            Items = vehicleDtos,
            Pagination = new Pagination
            {
                Page = query.Page,
                Size = query.Size,
                Total = total
            }
        };
    }

    public async Task<VehicleDetailDto> GetVehicleDetailAsync(int vehicleId)
    {
        var vehicle = await _vehicleRepository.GetVehicleWithDetailsAsync(vehicleId);
        if (vehicle == null)
            throw new Exception("Vehicle not found");

        var inventories = await _vehicleRepository.GetInventoriesByVehicleAsync(vehicleId);

        return MapToVehicleDetailDto(vehicle, inventories);
    }

    public async Task<VehicleComparisonDto> CompareVehiclesAsync(IEnumerable<int> vehicleIds)
    {
        var vehicles = await _vehicleRepository.GetVehiclesForComparisonAsync(vehicleIds);

        var comparison = new VehicleComparisonDto
        {
            Vehicles = vehicles.Select(MapToComparisonItemDto).ToList()
        };

        return comparison;
    }

    public async Task<IEnumerable<VehicleConfigDto>> GetAvailableConfigsAsync(int vehicleId)
    {
        var configs = await _vehicleRepository.GetAvailableConfigsAsync(vehicleId);
        return configs.Select(MapToVehicleConfigDto);
    }

    private VehicleListDto MapToVehicleListDto(Vehicle vehicle)
    {
        return new VehicleListDto
        {
            VehicleId = vehicle.VehicleId,
            Model = vehicle.Model,
            Brand = vehicle.Brand,
            Year = vehicle.Year,
            BasePrice = vehicle.BasePrice,
            ImageUrl = vehicle.ImageUrl,
            Configs = vehicle.VehicleConfigs.Select(MapToVehicleConfigDto).ToList(),
            InventorySummary = MapToInventorySummaryDto(vehicle.Inventories)
        };
    }

    private VehicleDetailDto MapToVehicleDetailDto(Vehicle vehicle, IEnumerable<Inventory> inventories)
    {
        return new VehicleDetailDto
        {
            VehicleId = vehicle.VehicleId,
            Model = vehicle.Model,
            Brand = vehicle.Brand,
            Year = vehicle.Year,
            ImageUrl = vehicle.ImageUrl,
            Configs = vehicle.VehicleConfigs.Select(MapToVehicleConfigDto).ToList(),
            Inventory = inventories.Select(MapToInventoryDto).ToList()
        };
    }

    private VehicleComparisonItemDto MapToComparisonItemDto(Vehicle vehicle)
    {
        return new VehicleComparisonItemDto
        {
            VehicleId = vehicle.VehicleId,
            VehicleName = $"{vehicle.Brand} {vehicle.Model}",
            Brand = vehicle.Brand,
            Model = vehicle.Model,
            Year = vehicle.Year,
            BasePrice = vehicle.BasePrice,
            ImageUrl = vehicle.ImageUrl,
            Configs = vehicle.VehicleConfigs.Select(MapToVehicleConfigDto).ToList()
        };
    }

    private VehicleConfigDto MapToVehicleConfigDto(VehicleConfig config)
    {
        return new VehicleConfigDto
        {
            ConfigId = config.ConfigId,
            Color = config.Color!,
            BatteryKwh = config.BatteryKwh,
            RangeKm = config.RangeKm
        };
    }

    private InventorySummaryDto MapToInventorySummaryDto(IEnumerable<Inventory> inventories)
    {
        var inventoryList = inventories.ToList();
        return new InventorySummaryDto
        {
            TotalQuantity = inventoryList.Sum(i => i.Quantity)
        };
    }

    private InventoryDto MapToInventoryDto(Inventory inventory)
    {
        return new InventoryDto
        {
            InventoryId = inventory.InventoryId,
            VehicleId = inventory.VehicleId,
            ConfigId = inventory.ConfigId,
            LocationType = inventory.LocationType,
            LocationId = inventory.LocationId,
            Quantity = inventory.Quantity
        };
    }
}