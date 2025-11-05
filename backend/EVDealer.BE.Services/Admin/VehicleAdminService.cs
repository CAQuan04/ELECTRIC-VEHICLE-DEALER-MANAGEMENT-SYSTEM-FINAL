// File: EVDealer.BE.Services/Admin/VehicleAdminService.cs
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Admin;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Vehicles
{
    public class VehicleAdminService : IVehicleAdminService
    {
        private readonly IVehicleAdminRepository _vehicleAdminRepository;

        public VehicleAdminService(IVehicleAdminRepository vehicleAdminRepository)
        {
            _vehicleAdminRepository = vehicleAdminRepository;
        }

        // --- CHỨC NĂNG TẠO MỚI XE ---
        public async Task<VehicleListDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto)
        {
            var vehicle = new Vehicle
            {
                Model = createVehicleDto.Model,
                Brand = createVehicleDto.Brand,
                Year = createVehicleDto.Year,
                BasePrice = createVehicleDto.BasePrice,
                ImageUrl = createVehicleDto.ImageUrl,
                Status = "Active"
            };

            await _vehicleAdminRepository.AddVehicleAsync(vehicle);
            await _vehicleAdminRepository.SaveChangesAsync();

            return new VehicleListDto
            {
                VehicleId = vehicle.VehicleId,
                Model = vehicle.Model,
                Brand = vehicle.Brand,
                Year = vehicle.Year,
                BasePrice = vehicle.BasePrice,
                ImageUrl = vehicle.ImageUrl,
                Status = vehicle.Status,
                Configs = new List<VehicleConfigDto>(),
                InventorySummary = new InventorySummaryDto { TotalQuantity = 0 }
            };
        }

        // --- CHỨC NĂNG CẬP NHẬT XE ---
        public async Task<VehicleListDto> UpdateVehicleAsync(int vehicleId, UpdateVehicleDto updateDto)
        {
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);
            if (vehicle == null) return null;

            vehicle.Model = updateDto.Model;
            vehicle.Brand = updateDto.Brand;
            vehicle.Year = updateDto.Year;
            vehicle.BasePrice = updateDto.BasePrice;
            vehicle.ImageUrl = updateDto.ImageUrl;

            await _vehicleAdminRepository.SaveChangesAsync();

            return new VehicleListDto
            {
                VehicleId = vehicle.VehicleId,
                Model = vehicle.Model,
                Brand = vehicle.Brand,
                Year = vehicle.Year,
                BasePrice = vehicle.BasePrice,
                ImageUrl = vehicle.ImageUrl,
                Status = vehicle.Status,
                Configs = vehicle.VehicleConfigs.Select(c => new VehicleConfigDto
                {
                    ConfigId = c.ConfigId,
                    Color = c.Color,
                    BatteryKwh = c.BatteryKwh,
                    RangeKm = c.RangeKm,
                    Status = c.Status
                }).ToList(),
                InventorySummary = new InventorySummaryDto
                {
                    TotalQuantity = vehicle.Inventories.Sum(i => i.Quantity)
                }
            };
        }

        // --- CHỨC NĂNG LẤY TẤT CẢ XE ---
        public async Task<IEnumerable<VehicleListDto>> GetAllVehiclesForAdminAsync()
        {
            var vehicles = await _vehicleAdminRepository.GetAllVehiclesForAdminAsync();

            return vehicles.Select(v => new VehicleListDto
            {
                VehicleId = v.VehicleId,
                Model = v.Model,
                Brand = v.Brand,
                Year = v.Year,
                BasePrice = v.BasePrice,
                ImageUrl = v.ImageUrl,
                Status = v.Status,
                Configs = v.VehicleConfigs.Select(c => new VehicleConfigDto
                {
                    ConfigId = c.ConfigId,
                    Color = c.Color,
                    BatteryKwh = c.BatteryKwh,
                    RangeKm = c.RangeKm,
                    Status = c.Status
                }).ToList(),
                InventorySummary = new InventorySummaryDto
                {
                    TotalQuantity = v.Inventories.Sum(i => i.Quantity)
                }
            });
        }

        // --- CÁC CHỨC NĂNG TRẠNG THÁI XE ---
        public async Task<bool> DeactivateVehicleAsync(int vehicleId)
        {
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);
            if (vehicle == null) return false;
            vehicle.Status = "Inactive";
            return await _vehicleAdminRepository.SaveChangesAsync();
        }

        public async Task<bool> ActivateVehicleAsync(int vehicleId)
        {
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);
            if (vehicle == null) return false;
            vehicle.Status = "Active";
            return await _vehicleAdminRepository.SaveChangesAsync();
        }


        // --- CÁC CHỨC NĂNG LIÊN QUAN ĐẾN CẤU HÌNH (CONFIG) ---

        public async Task<VehicleConfigDto> AddConfigToVehicleAsync(int vehicleId, CreateVehicleConfigDto createConfigDto)
        {
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);
            if (vehicle == null) return null;

            var config = new VehicleConfig
            {
                VehicleId = vehicleId,
                Color = createConfigDto.Color,
                BatteryKwh = createConfigDto.BatteryKwh,
                RangeKm = createConfigDto.RangeKm,
                Status = "Active"
            };

            await _vehicleAdminRepository.AddConfigToVehicleAsync(config);
            await _vehicleAdminRepository.SaveChangesAsync();

            return new VehicleConfigDto
            {
                ConfigId = config.ConfigId,
                Color = config.Color,
                BatteryKwh = config.BatteryKwh,
                RangeKm = config.RangeKm,
                Status = config.Status
            };
        }

        // ===================================================================================
        // === PHẦN BỔ SUNG: TRIỂN KHAI HOÀN CHỈNH CÁC PHƯƠNG THỨC CÒN LẠI ===

        public async Task<VehicleConfigDto> UpdateConfigAsync(int vehicleId, int configId, UpdateVehicleConfigDto updateDto)
        {
            var config = await _vehicleAdminRepository.FindConfigByIdAsync(configId);
            if (config == null || config.VehicleId != vehicleId) return null;

            config.Color = updateDto.Color;
            config.BatteryKwh = updateDto.BatteryKwh;
            config.RangeKm = updateDto.RangeKm;

            await _vehicleAdminRepository.SaveChangesAsync();

            return new VehicleConfigDto
            {
                ConfigId = config.ConfigId,
                Color = config.Color,
                BatteryKwh = config.BatteryKwh,
                RangeKm = config.RangeKm,
                Status = config.Status
            };
        }

        public async Task<bool> ToggleConfigStatusAsync(int vehicleId, int configId)
        {
            var config = await _vehicleAdminRepository.FindConfigByIdAsync(configId);
            if (config == null || config.VehicleId != vehicleId) return false;

            config.Status = (config.Status == "Active") ? "Inactive" : "Active";

            return await _vehicleAdminRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteConfigAsync(int vehicleId, int configId)
        {
            var config = await _vehicleAdminRepository.FindConfigByIdAsync(configId);
            if (config == null || config.VehicleId != vehicleId) return false;

            _vehicleAdminRepository.DeleteConfig(config);

            return await _vehicleAdminRepository.SaveChangesAsync();
        }
        // ===================================================================================
    }
}