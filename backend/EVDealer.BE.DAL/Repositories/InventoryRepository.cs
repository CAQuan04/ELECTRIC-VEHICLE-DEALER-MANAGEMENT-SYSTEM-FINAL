using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly ApplicationDbContext _context;
        public InventoryRepository(ApplicationDbContext context) => _context = context;

        // Triển khai: Tìm một bản ghi tồn kho. Nếu không thấy, tạo mới một bản ghi với Quantity = 0.
        public async Task<Inventory> GetOrCreateInventoryRecordAsync(int vehicleId, int configId, string locationType, int locationId)
        {
            var inventoryRecord = await _context.Inventories.FirstOrDefaultAsync(i =>
                i.VehicleId == vehicleId &&
                i.ConfigId == configId &&
                i.LocationType == locationType &&
                i.LocationId == locationId);

            if (inventoryRecord == null)
            {
                inventoryRecord = new Inventory
                {
                    VehicleId = vehicleId,
                    ConfigId = configId,
                    LocationType = locationType,
                    LocationId = locationId,
                    Quantity = 0 // Bắt đầu từ 0
                };
                await _context.Inventories.AddAsync(inventoryRecord);
            }
            return inventoryRecord;
        }

        // Triển khai: Chuẩn bị thêm một đối tượng Distribution vào DbContext.
        public async Task AddDistributionAsync(Distribution distribution)
        {
            await _context.Distributions.AddAsync(distribution);
        }

        // Triển khai: Tìm một phiếu điều phối theo khóa chính.
        public async Task<Distribution> GetDistributionByIdAsync(int distributionId)
        {
            return await _context.Distributions.FindAsync(distributionId);
        }

        // Triển khai: Gọi SaveChangesAsync() của DbContext để thực thi các thay đổi vào CSDL.
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<IEnumerable<Inventory>> GetAllSummaryAsync()
        {
            return await _context.Inventories
                .AsNoTracking() // Tăng hiệu năng vì chỉ đọc
                .Include(i => i.Vehicle)
                .Include(i => i.Config)
                .Include(i => i.Location)  // Join sang Dealer
                .OrderByDescending(i => i.UpdatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Distribution>> GetAllDistributionsSummaryAsync()
        {
            return await _context.Distributions
                .AsNoTracking()
                .Include(d => d.Vehicle)
                .Include(d => d.Config)
                .Include(d => d.ToDealer)     // Join sang Dealer
                .OrderByDescending(d => d.ScheduledDate)
                .ToListAsync();
        }
    }
}
