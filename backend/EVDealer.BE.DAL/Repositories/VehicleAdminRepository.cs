using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        // Triển khai: Tìm một xe theo ID. Chúng ta không cần .Include() ở đây
        // vì chỉ cần kiểm tra sự tồn tại của xe.
        public async Task<Vehicle> FindVehicleByIdAsync(int vehicleId)
        {
            return await _context.Vehicles.FindAsync(vehicleId);
        }

        // Triển khai: Chuẩn bị thêm một đối tượng Vehicle vào DbContext.
        public async Task AddVehicleAsync(Vehicle vehicle)
        {
            await _context.Vehicles.AddAsync(vehicle);
        }

        // Triển khai: Chuẩn bị thêm một đối tượng VehicleConfig vào DbContext.
        public async Task AddConfigToVehicleAsync(VehicleConfig config)
        {
            await _context.VehicleConfigs.AddAsync(config);
        }

        // Triển khai: Gọi SaveChangesAsync() để thực thi các thay đổi vào CSDL.
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        // Ghi chú: Triển khai chức năng tìm cấu hình bằng hàm FindAsync, rất hiệu quả.
        public async Task<VehicleConfig> FindConfigByIdAsync(int configId)
        {
            return await _context.VehicleConfigs.FindAsync(configId);
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehiclesForAdminAsync()
        {
            // Ghi chú: Câu lệnh này lấy tất cả xe và các cấu hình liên quan.
            // Điểm khác biệt mấu chốt so với Repository của Dealer là nó KHÔNG CÓ
            // mệnh đề .Where(v => v.Status == "Active").
            return await _context.Vehicles
                .Include(v => v.VehicleConfigs)
                .ToListAsync();
        }
    }
}
