// File: EVDealer.BE.DAL/Repositories/IVehicleAdminRepository.cs
using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho tất cả các hành động CSDL liên quan đến quản lý xe của Admin.
    public interface IVehicleAdminRepository
    {
        // --- Chức năng ĐỌC ---
        Task<Vehicle> FindVehicleByIdAsync(int vehicleId);
        Task<VehicleConfig> FindConfigByIdAsync(int configId);
        Task<IEnumerable<Vehicle>> GetAllVehiclesForAdminAsync();

        // --- Chức năng GHI ---
        Task AddVehicleAsync(Vehicle vehicle);
        Task AddConfigToVehicleAsync(VehicleConfig config);

        // Ghi chú: Thao tác Update và Delete được EF Core xử lý trong bộ nhớ,
        // chỉ cần SaveChangesAsync() để thực thi.

        // ===================================================================================
        // === PHẦN BỔ SUNG: THÊM HỢP ĐỒNG CHO VIỆC XÓA CONFIG ===
        void DeleteConfig(VehicleConfig config);
        // ===================================================================================

        Task<bool> SaveChangesAsync();
    }
}