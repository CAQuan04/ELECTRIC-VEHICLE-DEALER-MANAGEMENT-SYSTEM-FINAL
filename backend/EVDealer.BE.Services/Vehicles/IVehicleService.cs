using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Vehicles;

public interface IVehicleService
{
    Task<PagedResult<VehicleListDto>> GetVehiclesAsync(VehicleQueryDto query);
    Task<VehicleDetailDto> GetVehicleDetailAsync(int vehicleId);
    Task<VehicleComparisonDto> CompareVehiclesAsync(IEnumerable<int> vehicleIds);
    Task<IEnumerable<VehicleConfigDto>> GetAvailableConfigsAsync(int vehicleId);
}
