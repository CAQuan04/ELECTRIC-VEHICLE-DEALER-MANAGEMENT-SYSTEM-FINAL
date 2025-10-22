// File: EVDealer.BE.Services/Admin/VehicleAdminService.cs
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Admin;

namespace EVDealer.BE.Services.Vehicles
{
    public class VehicleAdminService : IVehicleAdminService
    {
        private readonly IVehicleAdminRepository _vehicleAdminRepository;

        public VehicleAdminService(IVehicleAdminRepository vehicleAdminRepository)
        {
            _vehicleAdminRepository = vehicleAdminRepository;
        }

        public async Task<VehicleListDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto)
        {
            // 1. Chuyển đổi từ DTO sang Model (Phần này vẫn đúng).
            var vehicle = new Vehicle
            {
                Model = createVehicleDto.Model,
                Brand = createVehicleDto.Brand,
                Year = createVehicleDto.Year,
                BasePrice = createVehicleDto.BasePrice
            };

            // 2. Yêu cầu Repository thêm vào CSDL và lưu lại (Phần này vẫn đúng).
            await _vehicleAdminRepository.AddVehicleAsync(vehicle);
            await _vehicleAdminRepository.SaveChangesAsync();

            // ===================================================================================
            // === PHẦN SỬA ĐỔI: MAP DỮ LIỆU TỪ MODEL ĐÃ LƯU TRỞ LẠI DTO ===
            // Ghi chú: Sau khi SaveChangesAsync() được gọi, Entity Framework sẽ tự động
            // cập nhật đối tượng 'vehicle' trong bộ nhớ với các giá trị được sinh ra từ CSDL,
            // quan trọng nhất là 'VehicleId'.
            // Bây giờ chúng ta cần đọc các giá trị đã được cập nhật đó và đưa vào DTO để trả về.
            // 3. Chuyển đổi Model vừa tạo sang DTO để trả về.
            return new VehicleListDto {
                VehicleId = vehicle.VehicleId, // Lấy ID vừa được tạo.
                Model = vehicle.Model,         // Lấy Model từ đối tượng đã lưu.
                Brand = vehicle.Brand,         // Lấy Brand từ đối tượng đã lưu.
                Year = vehicle.Year,           // Lấy Year từ đối tượng đã lưu.
                BasePrice = vehicle.BasePrice, // Lấy BasePrice từ đối tượng đã lưu.
                
            };
            // ===================================================================================
        }

        // ... (phương thức AddConfigToVehicleAsync tương tự) ...
        public async Task<VehicleConfigDto> AddConfigToVehicleAsync(int vehicleId, CreateVehicleConfigDto createConfigDto)
        {
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);
            if (vehicle == null) return null;

            var config = new VehicleConfig
            {
                VehicleId = vehicleId,
                Color = createConfigDto.Color,
                BatteryKwh = createConfigDto.BatteryKwh,
                RangeKm = createConfigDto.RangeKm
            };

            await _vehicleAdminRepository.AddConfigToVehicleAsync(config);
            await _vehicleAdminRepository.SaveChangesAsync();

            // Ghi chú: Sửa cả phần mapping ở đây để đảm bảo trả về đúng dữ liệu.
            return new VehicleConfigDto
            {
                ConfigId = config.ConfigId,
                Color = config.Color,
                BatteryKwh = config.BatteryKwh,
                RangeKm = config.RangeKm
            };
        }
    }
}