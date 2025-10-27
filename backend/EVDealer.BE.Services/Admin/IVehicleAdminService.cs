using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EVDealer.BE.Common.DTOs;

namespace EVDealer.BE.Services.Admin
{
    public interface IVehicleAdminService
    {
        // Hợp đồng: Phải có chức năng tạo xe mới dựa trên dữ liệu từ DTO.
        Task<VehicleListDto> CreateVehicleAsync(CreateVehicleDto createVehicleDto);

        // Hợp đồng: Phải có chức năng thêm cấu hình mới cho xe.
        Task<VehicleConfigDto> AddConfigToVehicleAsync(int vehicleId, CreateVehicleConfigDto createConfigDto);

        // Ghi chú: Bổ sung hợp đồng - Phải có chức năng cập nhật một mẫu xe.
        Task<VehicleListDto> UpdateVehicleAsync(int vehicleId, UpdateVehicleDto updateDto);

        // Ghi chú: Bổ sung hợp đồng - Phải có chức năng cập nhật một phiên bản cấu hình.
        Task<VehicleConfigDto> UpdateConfigAsync(int configId, UpdateVehicleConfigDto updateDto);

        Task<bool> DeactivateVehicleAsync(int vehicleId);

        Task<bool> DeactivateConfigAsync(int configId);

        // GHI CHÚ: BỔ SUNG HỢP ĐỒNG MỚI
        // Hợp đồng: Phải có chức năng lấy toàn bộ danh sách xe cho Admin.
        Task<IEnumerable<VehicleListDto>> GetAllVehiclesForAdminAsync();
    }
}
