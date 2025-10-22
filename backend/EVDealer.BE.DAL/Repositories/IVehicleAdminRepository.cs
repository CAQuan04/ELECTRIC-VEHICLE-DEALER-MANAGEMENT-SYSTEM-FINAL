using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IVehicleAdminRepository
    {
        // Hợp đồng: Phải có chức năng tìm một xe theo ID (để kiểm tra tồn tại trước khi thêm config).
        Task<Vehicle> FindVehicleByIdAsync(int vehicleId);

        // Hợp đồng: Phải có chức năng THÊM một xe mới vào CSDL.
        Task AddVehicleAsync(Vehicle vehicle);

        // Hợp đồng: Phải có chức năng THÊM một cấu hình/phiên bản mới cho một xe.
        Task AddConfigToVehicleAsync(VehicleConfig config);

        // Hợp đồng: Phải có chức năng lưu tất cả các thay đổi (thêm, sửa, xóa).
        Task<bool> SaveChangesAsync();
    }
}
