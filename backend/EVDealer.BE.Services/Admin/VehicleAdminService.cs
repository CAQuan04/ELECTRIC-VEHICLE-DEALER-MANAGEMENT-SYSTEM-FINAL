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

        public async Task<VehicleListDto> UpdateVehicleAsync(int vehicleId, UpdateVehicleDto updateDto)
        {
            // 1. Dùng Repository để tìm đối tượng xe gốc trong CSDL.
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);

            // 2. Nếu không tìm thấy, trả về null để Controller biết và báo lỗi 404.
            if (vehicle == null) return null;

            // 3. Cập nhật các thuộc tính của đối tượng xe gốc từ dữ liệu trong DTO.
            vehicle.Model = updateDto.Model;
            vehicle.Brand = updateDto.Brand;
            vehicle.Year = updateDto.Year;
            vehicle.BasePrice = updateDto.BasePrice;

            // 4. Yêu cầu Repository lưu các thay đổi này vào CSDL.
            await _vehicleAdminRepository.SaveChangesAsync();

            // 5. Chuyển đổi đối tượng xe đã cập nhật sang DTO để trả về cho client.
            return new VehicleListDto { /* ... logic mapping ... */ };
        }

        // Ghi chú: Triển khai logic nghiệp vụ cho việc cập nhật một phiên bản cấu hình.
        public async Task<VehicleConfigDto> UpdateConfigAsync(int configId, UpdateVehicleConfigDto updateDto)
        {
            // 1. Dùng Repository để tìm đối tượng cấu hình gốc trong CSDL.
            var config = await _vehicleAdminRepository.FindConfigByIdAsync(configId);

            // 2. Nếu không tìm thấy, trả về null.
            if (config == null) return null;

            // 3. Cập nhật các thuộc tính.
            config.Color = updateDto.Color;
            config.BatteryKwh = updateDto.BatteryKwh;
            config.RangeKm = updateDto.RangeKm;

            // 4. Lưu thay đổi.
            await _vehicleAdminRepository.SaveChangesAsync();

            // 5. Chuyển đổi sang DTO và trả về.
            return new VehicleConfigDto { /* ... logic mapping ... */ };
        }

        // Ghi chú: Triển khai logic nghiệp vụ cho việc xóa mềm.
        // Ghi chú: Triển khai logic nghiệp vụ cho việc xóa mềm.
        public async Task<bool> DeactivateVehicleAsync(int vehicleId)
        {
            // 1. Tìm xe trong CSDL.
            var vehicle = await _vehicleAdminRepository.FindVehicleByIdAsync(vehicleId);

            // 2. Nếu không tìm thấy, trả về false (thất bại).
            if (vehicle == null) return false;

            // 3. Đây là hành động "xóa mềm": chỉ cần đổi trạng thái.
            vehicle.Status = "Inactive";

            // 4. Lưu thay đổi và trả về kết quả (true nếu thành công).
         
            return await _vehicleAdminRepository.SaveChangesAsync();
        }

        // GHI CHÚ: TRIỂN KHAI LOGIC NGHIỆP VỤ MỚI
        // Logic nghiệp vụ cho việc xóa mềm một phiên bản cấu hình.
        public async Task<bool> DeactivateConfigAsync(int configId)
        {
            // 1. Dùng Repository để tìm đối tượng cấu hình gốc trong CSDL.
            var config = await _vehicleAdminRepository.FindConfigByIdAsync(configId);

            // 2. Nếu không tìm thấy, trả về false (thất bại).
            if (config == null) return false;

            // 3. Đây là hành động "xóa mềm": chỉ cần đổi trạng thái của config đó.
            // Điều này không ảnh hưởng đến trạng thái của xe cha (Vehicle) hay các config khác.
            config.Status = "Inactive";

            // 4. Lưu thay đổi vào CSDL và trả về kết quả (true nếu thành công).
            return await _vehicleAdminRepository.SaveChangesAsync();
        }

        // GHI CHÚ: TRIỂN KHAI LOGIC NGHIỆP VỤ MỚI
        // Logic để lấy tất cả xe và chuyển đổi chúng sang dạng DTO.
        public async Task<IEnumerable<VehicleListDto>> GetAllVehiclesForAdminAsync()
        {
            // 1. Gọi xuống Repository của Admin để lấy dữ liệu thô (bao gồm cả xe Inactive).
            var vehicles = await _vehicleAdminRepository.GetAllVehiclesForAdminAsync();

            // 2. Dùng LINQ .Select() để biến đổi mỗi đối tượng Vehicle trong danh sách
            // thành một đối tượng VehicleDto tương ứng.
            return vehicles.Select(v => new VehicleListDto
            {
                VehicleId = v.VehicleId,
                Model = v.Model,
                Brand = v.Brand,
                Year = v.Year,
                BasePrice = v.BasePrice,
                Status = v.Status, // <-- Ghi chú: Thêm cả Status vào DTO để Admin thấy được.
                Configs = v.VehicleConfigs.Select(c => new VehicleConfigDto
                {
                    ConfigId = c.ConfigId,
                    Color = c.Color,
                    BatteryKwh = c.BatteryKwh,
                    RangeKm = c.RangeKm,
                    Status = c.Status // <-- Thêm cả Status của Config.
                }).ToList()
            });
        }
    }
}