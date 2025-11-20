using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.Services.IInventory
{
    public interface IInventoryService
    {
        // Hợp đồng: Phải có chức năng cập nhật tồn kho cho một địa điểm.
        Task<bool> UpdateStockAsync(UpdateStockDto updateStockDto);

        // Hợp đồng: Phải có chức năng tạo phiếu điều phối.
        Task<Distribution> CreateDistributionAsync(CreateDistributionDto createDistributionDto);

        // Hợp đồng: Phải có chức năng xác nhận nhận hàng, đây là nghiệp vụ cốt lõi.
        // Cần dealerId để xác thực đúng người nhận.
        Task<bool> ConfirmDistributionReceiptAsync(int distributionId, int dealerId);

        Task<IEnumerable<InventoryySummaryDto>> GetInventorySummaryAsync();
        Task<IEnumerable<DistributionSummaryDto>> GetDistributionSummaryAsync();

        // ==================== DEALER INVENTORY ====================
        Task<IEnumerable<DealerInventoryDto>> GetDealerInventoryAsync(int dealerId, string? search);
        Task<DealerInventoryDetailDto?> GetInventoryItemDetailAsync(int dealerId, int inventoryId);
        Task<DealerInventoryDto> UpdateInventoryAsync(UpdateInventoryDto dto);

        // ==================== STOCK REQUEST (Staff → Manager Flow) ====================
        Task<IEnumerable<StockRequestDto>> GetStockRequestsAsync(int dealerId, string? status, string? search);
        Task<StockRequestDto?> GetStockRequestByIdAsync(int requestId);
        Task<StockRequestDto> CreateStockRequestAsync(CreateStockRequestDto dto, int dealerId, int userId);
        Task<StockRequestDto> ApproveStockRequestAsync(int requestId, int managerId);
        Task<StockRequestDto> RejectStockRequestAsync(int requestId, int managerId, string reason);

        // ==================== INVENTORY MANAGEMENT (EVM → Dealer) ====================
        Task IncreaseInventoryAsync(int dealerId, int vehicleId, int configId, int quantity);
    }
}
