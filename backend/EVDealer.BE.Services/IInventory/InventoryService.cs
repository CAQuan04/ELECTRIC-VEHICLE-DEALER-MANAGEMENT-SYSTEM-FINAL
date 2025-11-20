using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
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
        public InventoryService(IInventoryRepository inventoryRepo) => _inventoryRepo = inventoryRepo;

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
    }
}
