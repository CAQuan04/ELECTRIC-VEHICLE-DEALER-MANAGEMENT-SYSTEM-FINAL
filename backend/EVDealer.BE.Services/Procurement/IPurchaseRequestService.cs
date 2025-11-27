using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Procurement
{
    public interface IPurchaseRequestService
    {
        Task<PurchaseRequestDto> CreateRequestAsync(PurchaseRequestCreateDto dto, int dealerId);
        Task<IEnumerable<PurchaseRequestDto>> GetRequestsForDealerAsync(int dealerId);
        Task<IEnumerable<PurchaseRequestDto>> GetPendingRequestsAsync();
        Task<PurchaseRequestDto> ApproveRequestAsync(int requestId);
        Task<PurchaseRequestDto> RejectRequestAsync(int requestId);
        Task<PurchaseRequestDto> GetRequestByIdAsync(int requestId, int dealerId);
        Task<bool> SendToEVMAsync(int purchaseRequestId, string managerPassword);
        // New methods for StockRequest integration
        Task<PurchaseRequestDto> CreateFromStockRequestAsync(int stockRequestId, int managerId);
        Task<PurchaseRequestDto?> GetByEVMOrderIdAsync(string evmOrderId);
    }
}