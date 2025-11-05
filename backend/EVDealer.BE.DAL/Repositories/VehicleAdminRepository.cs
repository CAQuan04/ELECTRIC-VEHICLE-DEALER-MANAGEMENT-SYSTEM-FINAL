// File: EVDealer.BE.DAL/Repositories/VehicleAdminRepository.cs
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class VehicleAdminRepository : IVehicleAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public VehicleAdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- Triển khai ĐỌC ---
        public async Task<Vehicle> FindVehicleByIdAsync(int vehicleId)
        {
            // Ghi chú: Khi tìm một xe, luôn kèm theo danh sách config của nó.
            return await _context.Vehicles
                .Include(v => v.VehicleConfigs)
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId);
        }

        public async Task<VehicleConfig> FindConfigByIdAsync(int configId)
        {
            return await _context.VehicleConfigs.FindAsync(configId);
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehiclesForAdminAsync()
        {
            return await _context.Vehicles
                .Include(v => v.VehicleConfigs)
                .OrderBy(v => v.Model)
                .ToListAsync();
        }

        // --- Triển khai GHI ---
        public async Task AddVehicleAsync(Vehicle vehicle)
        {
            await _context.Vehicles.AddAsync(vehicle);
        }

        public async Task AddConfigToVehicleAsync(VehicleConfig config)
        {
            await _context.VehicleConfigs.AddAsync(config);
        }

        // ===================================================================================
        // === PHẦN BỔ SUNG: TRIỂN KHAI PHƯƠNG THỨC XÓA CONFIG ===
        public void DeleteConfig(VehicleConfig config)
        {
            _context.VehicleConfigs.Remove(config);
        }
        // ===================================================================================

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}