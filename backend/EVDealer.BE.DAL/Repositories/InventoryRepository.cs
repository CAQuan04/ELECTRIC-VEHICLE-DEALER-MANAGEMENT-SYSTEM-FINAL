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

        // ===== DEALER INVENTORY MANAGEMENT IMPLEMENTATIONS =====
        
        public async Task<IEnumerable<DealerInventory>> GetDealerInventoryAsync(int dealerId, string? search)
        {
            var query = _context.DealerInventories
                .Include(di => di.Vehicle)
                .Include(di => di.Dealer)
                .Include(di => di.Config)
                .Where(di => di.DealerId == dealerId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(di =>
                    di.Vehicle.Model.Contains(search) ||
                    di.Vehicle.Brand.Contains(search) ||
                    di.Color.Contains(search));
            }

            return await query
                .OrderByDescending(di => di.LastUpdated)
                .ToListAsync();
        }

        public async Task<DealerInventory?> GetInventoryItemByIdAsync(int inventoryId)
        {
            return await _context.DealerInventories
                .Include(di => di.Vehicle)
                .Include(di => di.Dealer)
                .Include(di => di.Config)
                .FirstOrDefaultAsync(di => di.DealerInventoryId == inventoryId);
        }

        public async Task<DealerInventory?> GetDealerInventoryByVehicleAsync(int dealerId, int vehicleId, string? color = null)
        {
            var query = _context.DealerInventories
                .Where(di => di.DealerId == dealerId && di.VehicleId == vehicleId);

            if (!string.IsNullOrEmpty(color))
            {
                query = query.Where(di => di.Color == color);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<DealerInventory> UpdateInventoryItemAsync(DealerInventory item)
        {
            item.LastUpdated = DateTime.UtcNow;
            _context.DealerInventories.Update(item);
            return item;
        }

        public async Task<DealerInventory?> GetOrCreateDealerInventoryAsync(int dealerId, int vehicleId, string color)
        {
            var inventory = await _context.DealerInventories
                .FirstOrDefaultAsync(di => 
                    di.DealerId == dealerId && 
                    di.VehicleId == vehicleId && 
                    di.Color == color);

            if (inventory == null)
            {
                inventory = new DealerInventory
                {
                    DealerId = dealerId,
                    VehicleId = vehicleId,
                    Color = color,
                    Quantity = 0,
                    Status = "Available",
                    LastUpdated = DateTime.UtcNow
                };
                await _context.DealerInventories.AddAsync(inventory);
            }

            return inventory;
        }

        // ===== STOCK REQUEST MANAGEMENT IMPLEMENTATIONS =====
        
        public async Task<IEnumerable<StockRequest>> GetStockRequestsAsync(int dealerId, string? status, string? search)
        {
            var query = _context.StockRequests
                .Include(sr => sr.Vehicle)
                .Include(sr => sr.Config)
                .Include(sr => sr.Dealer)
                .Include(sr => sr.RequestedBy)
                .Include(sr => sr.ProcessedBy)
                .Where(sr => sr.DealerId == dealerId);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(sr => sr.Status == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(sr =>
                    sr.Vehicle.Model.Contains(search) ||
                    sr.Vehicle.Brand.Contains(search) ||
                    sr.Reason.Contains(search));
            }

            return await query
                .OrderByDescending(sr => sr.RequestDate)
                .ToListAsync();
        }

        public async Task<StockRequest?> GetStockRequestByIdAsync(int requestId)
        {
            return await _context.StockRequests
                .Include(sr => sr.Vehicle)
                .Include(sr => sr.Config)
                .Include(sr => sr.Dealer)
                .Include(sr => sr.RequestedBy)
                .Include(sr => sr.ProcessedBy)
                .FirstOrDefaultAsync(sr => sr.StockRequestId == requestId);
        }

        public async Task<StockRequest> CreateStockRequestAsync(StockRequest request)
        {
            await _context.StockRequests.AddAsync(request);
            return request;
        }

        public async Task<StockRequest> UpdateStockRequestAsync(StockRequest request)
        {
            _context.StockRequests.Update(request);
            return request;
        }
    }
}
