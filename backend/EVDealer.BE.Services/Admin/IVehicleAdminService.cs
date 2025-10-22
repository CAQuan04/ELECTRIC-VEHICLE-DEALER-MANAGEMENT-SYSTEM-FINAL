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
    }
}
