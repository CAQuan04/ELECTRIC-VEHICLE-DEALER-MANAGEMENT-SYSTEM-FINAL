// File: EVDealer.BE.Services/Admin/IVehicleAdminService.cs
using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Admin
{
    public interface IVehicleAdminService
    {
        // === SỬA LỖI: SỬ DỤNG ĐÚNG VEHICLELISTDTO ===
        Task<VehicleListDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto);
        Task<VehicleListDto> UpdateVehicleAsync(int vehicleId, UpdateVehicleDto updateDto);
        Task<IEnumerable<VehicleListDto>> GetAllVehiclesForAdminAsync();
        // ===========================================

        Task<bool> DeactivateVehicleAsync(int vehicleId);
        Task<bool> ActivateVehicleAsync(int vehicleId);

        // --- Hợp đồng cho Config ---
        Task<VehicleConfigDto> AddConfigToVehicleAsync(int vehicleId, CreateVehicleConfigDto createConfigDto);
        Task<VehicleConfigDto> UpdateConfigAsync(int vehicleId, int configId, UpdateVehicleConfigDto updateDto);
        Task<bool> ToggleConfigStatusAsync(int vehicleId, int configId);
        Task<bool> DeleteConfigAsync(int vehicleId, int configId);
    }
}