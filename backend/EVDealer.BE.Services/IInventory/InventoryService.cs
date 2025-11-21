using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.IInventory
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepo;
        private readonly ApplicationDbContext _context;

        public InventoryService(IInventoryRepository inventoryRepo, ApplicationDbContext context)
        {
            _inventoryRepo = inventoryRepo;
            _context = context;
        }

        // Nghiệp vụ: Nhập/xuất kho tại một địa điểm duy nhất.
        public async Task<bool> UpdateStockAsync(UpdateStockDto dto)
        {
            var inventoryRecord = await _inventoryRepo.GetOrCreateInventoryRecordAsync(dto.VehicleId, dto.ConfigId, dto.LocationType, dto.LocationId);
            inventoryRecord.Quantity += dto.Quantity;

            // Quy tắc nghiệp vụ: Tồn kho không bao giờ được phép âm.
            if (inventoryRecord.Quantity < 0)
            {
                // Ném ra một lỗi để Controller có thể bắt và trả về cho client.
                throw new InvalidOperationException("Số lượng tồn kho không thể là số âm.");
            }
            return await _inventoryRepo.SaveChangesAsync();
        }

        // Nghiệp vụ: Tạo một phiếu điều phối mới.
        public async Task<Distribution> CreateDistributionAsync(CreateDistributionDto dto)
        {
            var distribution = new Distribution
            {
                VehicleId = dto.VehicleId,
                ConfigId = dto.ConfigId,
                Quantity = dto.Quantity,
                FromLocation = dto.FromLocation,
                ToDealerId = dto.ToDealerId,
                ScheduledDate = dto.ScheduledDate,
                Status = "InTransit" // Trạng thái ban đầu khi xe đang trên đường đi.
            };

            await _inventoryRepo.AddDistributionAsync(distribution);
            await _inventoryRepo.SaveChangesAsync();
            return distribution;
        }

        // Nghiệp vụ CỐT LÕI: Xác nhận nhận hàng và cập nhật tồn kho 2 bên.
        public async Task<bool> ConfirmDistributionReceiptAsync(int distributionId, int dealerId)
        {
            // 1. Tìm phiếu điều phối cần xác nhận.
            var distribution = await _inventoryRepo.GetDistributionByIdAsync(distributionId);

            // 2. Kiểm tra hàng loạt các quy tắc nghiệp vụ:
            // - Phiếu phải tồn tại.
            // - Phiếu phải được gửi đến đúng đại lý đang yêu cầu xác nhận.
            // - Phiếu phải đang ở trạng thái "InTransit". Nếu đã "Completed" thì không xác nhận lại.
            if (distribution == null || distribution.ToDealerId != dealerId || distribution.Status != "InTransit")
            {
                return false; // Thao tác không hợp lệ.
            }

            // 3. Lấy bản ghi tồn kho của KHO NGUỒN (Kho tổng HQ).
            // Giả định nghiệp vụ: Kho nguồn luôn là "HQ" và có LocationId = 1.
            var sourceInventory = await _inventoryRepo.GetOrCreateInventoryRecordAsync(distribution.VehicleId, distribution.ConfigId, "HQ", 1);

            // 4. Lấy bản ghi tồn kho của KHO ĐÍCH (Đại lý).
            var destinationInventory = await _inventoryRepo.GetOrCreateInventoryRecordAsync(distribution.VehicleId, distribution.ConfigId, "DEALER", dealerId);

            // 5. Kiểm tra quy tắc nghiệp vụ quan trọng: Kho nguồn phải có đủ hàng để trừ.
            if (sourceInventory.Quantity < distribution.Quantity)
            {
                // Nếu không đủ, đổi trạng thái phiếu thành thất bại và báo lỗi.
                distribution.Status = "Failed_OutOfStock";
                await _inventoryRepo.SaveChangesAsync();
                return false;
            }

            // 6. Thực hiện giao dịch nguyên tử (atomic transaction): TRỪ kho nguồn, CỘNG kho đích.
            sourceInventory.Quantity -= distribution.Quantity;
            destinationInventory.Quantity += distribution.Quantity;

            // 7. Cập nhật trạng thái phiếu điều phối thành "Hoàn thành".
            distribution.Status = "Completed";
            // distribution.ActualDate = DateOnly.FromDateTime(DateTime.UtcNow); // Nếu có trường ngày nhận thực tế

            // 8. Lưu tất cả các thay đổi này vào CSDL trong một lần duy nhất.
            // Nếu bước này thất bại, tất cả thay đổi (trừ, cộng, cập nhật status) sẽ được rollback.
            return await _inventoryRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<InventoryySummaryDto>> GetInventorySummaryAsync()
        {
            var inventories = await _inventoryRepo.GetAllSummaryAsync();
            return inventories.Select(i => new InventoryySummaryDto
            {
                InventoryId = i.InventoryId,
                VehicleName = i.Vehicle?.Model ?? "N/A",
                ConfigName = i.Config?.Color ?? "N/A", // Giả sử lấy Color làm tên Config
                LocationType = i.LocationType,
                // Dòng code bạn đã hỏi
                LocationName = i.LocationType == "HQ" ? "Kho Tổng" : i.Location?.Name ?? "N/A",
                Quantity = i.Quantity,
                UpdatedAt = i.UpdatedAt
            });
        }

        public async Task<IEnumerable<DistributionSummaryDto>> GetDistributionSummaryAsync()
        {
            var distributions = await _inventoryRepo.GetAllDistributionsSummaryAsync();
            return distributions.Select(d => new DistributionSummaryDto
            {
                DistId = d.DistId,
                VehicleName = d.Vehicle?.Model ?? "N/A",
                ConfigName = d.Config?.Color ?? "N/A",
                Quantity = d.Quantity,
                FromLocation = d.FromLocation,
                ToDealerId = d.ToDealerId,
                ToDealerName = d.ToDealer?.Name ?? "N/A",
                ScheduledDate = (DateOnly)d.ScheduledDate,
                ActualDate = d.ActualDate,
                Status = d.Status
            });
        }

        // ==================== DEALER INVENTORY IMPLEMENTATIONS ====================

        public async Task<IEnumerable<DealerInventoryDto>> GetDealerInventoryAsync(int dealerId, string? search)
        {
            // Query from existing Inventory table using LocationType="Dealer" and LocationId=dealerId
            var query = _context.Inventories
                .Include(i => i.Vehicle)
                .Include(i => i.Config)
                .Include(i => i.Location)
                .Where(i => i.LocationType == "Dealer" && i.LocationId == dealerId);

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(i =>
                    i.Vehicle.Brand.ToLower().Contains(search) ||
                    i.Vehicle.Model.ToLower().Contains(search) ||
                    (i.Config.Color != null && i.Config.Color.ToLower().Contains(search))
                );
            }

            var inventories = await query
                .OrderBy(i => i.Vehicle.Brand)
                .ThenBy(i => i.Vehicle.Model)
                .ToListAsync();

            return inventories.Select(inv => new DealerInventoryDto
            {
                InventoryId = inv.InventoryId,
                VehicleId = inv.VehicleId,
                VehicleName = $"{inv.Vehicle.Brand} {inv.Vehicle.Model}",
                Model = inv.Vehicle.Model,
                Brand = inv.Vehicle.Brand,
                Color = inv.Config.Color,
                Quantity = inv.Quantity,
                BasePrice = inv.Vehicle.BasePrice ?? 0,
                Status = inv.Quantity > 0 ? "Available" : "OutOfStock",
                DealerId = dealerId,
                DealerName = inv.Location?.Name ?? "N/A",
                LastUpdated = inv.UpdatedAt
            });
        }

        public async Task<DealerInventoryDetailDto?> GetInventoryItemDetailAsync(int dealerId, int inventoryId)
        {
            Console.WriteLine($"[Service] Querying InventoryId={inventoryId}, dealerId={dealerId}");
            var item = await _context.Inventories
                .Include(i => i.Vehicle)
                .Include(i => i.Config)
                .Include(i => i.Location)
                .FirstOrDefaultAsync(i =>
                    i.InventoryId == inventoryId &&
                    i.LocationType.ToLower() == "dealer" &&
                    i.LocationId == dealerId
                );
            Console.WriteLine($"[Service] Query result: {(item == null ? "null" : "found")}");
            if (item != null)
            {
                Console.WriteLine($"[Service] Vehicle: {(item.Vehicle == null ? "null" : item.Vehicle.Model)}");
                Console.WriteLine($"[Service] Config: {(item.Config == null ? "null" : item.Config.Color)}");
                Console.WriteLine($"[Service] Location: {(item.Location == null ? "null" : item.Location.Name)}");
            }
            if (item == null)
            {
                Console.WriteLine("[Service] No inventory found for detail API!");
                return null;
            }

            // Calculate available, reserved, sold quantities from orders/reservations
            var availableQty = item.Quantity; // TODO: minus reserved
            var reservedQty = 0; // TODO: count from orders with status Reserved
            var soldQty = 0; // TODO: count from completed orders

            return new DealerInventoryDetailDto
            {
                InventoryId = item.InventoryId,
                VehicleId = item.VehicleId,
                VehicleName = $"{item.Vehicle.Brand} {item.Vehicle.Model}",
                Model = item.Vehicle.Model,
                Brand = item.Vehicle.Brand,
                Color = item.Config.Color,
                TotalQuantity = item.Quantity,
                AvailableQuantity = availableQty,
                ReservedQuantity = reservedQty,
                SoldQuantity = soldQty,
                BasePrice = item.Vehicle.BasePrice ?? 0,
                DealerId = dealerId,
                DealerName = item.Location?.Name ?? "N/A",
                VehicleImages = string.IsNullOrEmpty(item.Vehicle.ImageUrl)
                    ? new List<string>()
                    : item.Vehicle.ImageUrl.Split(',').ToList(),
                Specifications = null, // TODO: Add if available
                LastRestockDate = item.UpdatedAt
            };
        }

        public async Task<DealerInventoryDto> UpdateInventoryAsync(UpdateInventoryDto dto)
        {
            // Query Inventory table
            var item = await _context.Inventories
                .Include(i => i.Vehicle)
                .Include(i => i.Config)
                .Include(i => i.Location)
                .FirstOrDefaultAsync(i => i.InventoryId == dto.InventoryId);

            if (item == null)
            {
                throw new Exception("Inventory item not found");
            }

            // Update fields
            item.Quantity = dto.Quantity;
            item.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new DealerInventoryDto
            {
                InventoryId = item.InventoryId,
                VehicleId = item.VehicleId,
                VehicleName = $"{item.Vehicle.Brand} {item.Vehicle.Model}",
                Model = item.Vehicle.Model,
                Brand = item.Vehicle.Brand,
                Color = item.Config.Color,
                Quantity = item.Quantity,
                BasePrice = item.Vehicle.BasePrice ?? 0,
                Status = item.Quantity > 0 ? "Available" : "OutOfStock",
                DealerId = item.LocationId,
                DealerName = item.Location?.Name ?? "N/A",
                LastUpdated = item.UpdatedAt
            };
        }

        // ==================== STOCK REQUEST IMPLEMENTATIONS ====================
        // TODO: Implement StockRequest workflow if needed later
        // For now, use PurchaseRequest directly or Distribution workflow

        public Task<IEnumerable<StockRequestDto>> GetStockRequestsAsync(int dealerId, string? status, string? search)
        {
            // Return empty list for now
            return Task.FromResult(Enumerable.Empty<StockRequestDto>());
        }

        public Task<StockRequestDto?> GetStockRequestByIdAsync(int requestId)
        {
            return Task.FromResult<StockRequestDto?>(null);
        }

        public Task<StockRequestDto> CreateStockRequestAsync(CreateStockRequestDto dto, int dealerId, int userId)
        {
            throw new NotImplementedException("StockRequest workflow not implemented yet. Use Distribution or PurchaseRequest instead.");
        }

        public Task<StockRequestDto> ApproveStockRequestAsync(int requestId, int managerId)
        {
            throw new NotImplementedException("StockRequest workflow not implemented yet.");
        }

        public Task<StockRequestDto> RejectStockRequestAsync(int requestId, int managerId, string reason)
        {
            throw new NotImplementedException("StockRequest workflow not implemented yet.");
        }

        // ==================== INVENTORY INCREASE (EVM FULFILLMENT) ====================

        public async Task IncreaseInventoryAsync(int dealerId, int vehicleId, int configId, int quantity)
        {
            // Find existing Inventory record for this dealer + vehicle + config
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i =>
                    i.LocationType == "Dealer" &&
                    i.LocationId == dealerId &&
                    i.VehicleId == vehicleId &&
                    i.ConfigId == configId);

            if (inventory == null)
            {
                // Create new inventory record if not exists
                inventory = new Inventory
                {
                    VehicleId = vehicleId,
                    ConfigId = configId,
                    LocationType = "Dealer",
                    LocationId = dealerId,
                    Quantity = quantity,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Inventories.Add(inventory);
            }
            else
            {
                // Increase existing quantity
                inventory.Quantity += quantity;
                inventory.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }

}
