using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Procurement
{
    public class PurchaseRequestService : IPurchaseRequestService
    {
        private readonly IPurchaseRequestRepository _purchaseRequestRepo;
        private readonly IDistributionRepository _distributionRepo;
        private readonly IInventoryRepository _inventoryRepo;

        public PurchaseRequestService(
            IPurchaseRequestRepository purchaseRequestRepo,
            IDistributionRepository distributionRepo,
            IInventoryRepository inventoryRepo)
        {
            _purchaseRequestRepo = purchaseRequestRepo;
            _distributionRepo = distributionRepo;
            _inventoryRepo = inventoryRepo;
        }

        public async Task<PurchaseRequestDto> CreateRequestAsync(PurchaseRequestCreateDto dto, int dealerId)
        {
            var request = new PurchaseRequest
            {
                DealerId = dealerId,
                VehicleId = dto.VehicleId,
                ConfigId = dto.ConfigId,
                Quantity = dto.Quantity,
                Status = "draft",
                Notes = dto.Notes, // Map thêm Notes từ DTO tạo mới
                CreatedAt = DateTime.UtcNow
            };
            var createdRequest = await _purchaseRequestRepo.CreateAsync(request);
            return MapToDto(createdRequest);
        }

        public async Task<IEnumerable<PurchaseRequestDto>> GetRequestsForDealerAsync(int dealerId)
        {
            var requests = await _purchaseRequestRepo.GetAllByDealerAsync(dealerId);
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<PurchaseRequestDto>> GetPendingRequestsAsync()
        {
            var requests = await _purchaseRequestRepo.GetAllPendingAsync();
            return requests.Select(MapToDto);
        }

        public async Task<PurchaseRequestDto> ApproveRequestAsync(int requestId)
        {
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != "pending")
                throw new Exception("Request not found or not in a pending state.");

            request.Status = "approved";
            await _purchaseRequestRepo.UpdateAsync(request);

            var distribution = new Distribution
            {
                FromLocation = "EVM Central Warehouse",
                ToDealerId = request.DealerId,
                VehicleId = request.VehicleId,
                ConfigId = request.ConfigId,
                Quantity = request.Quantity,
                ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
                Status = "scheduled"
            };
            await _distributionRepo.CreateAsync(distribution);

            return MapToDto(request);
        }

        public async Task<PurchaseRequestDto> RejectRequestAsync(int requestId)
        {
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);
            if (request == null || request.Status != "pending")
                throw new Exception("Request not found or not in a pending state.");

            request.Status = "rejected";
            var updatedRequest = await _purchaseRequestRepo.UpdateAsync(request);
            return MapToDto(updatedRequest);
        }

        private PurchaseRequestDto MapToDto(PurchaseRequest request)
        {
            return new PurchaseRequestDto
            {
                RequestId = request.RequestId,
                DealerId = request.DealerId,
                VehicleId = request.VehicleId,
                ConfigId = request.ConfigId,
                Quantity = request.Quantity,
                Status = request.Status,
                CreatedAt = request.CreatedAt,
                Notes = request.Notes // ✅ Đã thêm Notes vào đây
            };
        }

        // ==================== NEW: STOCK REQUEST INTEGRATION ====================

        public async Task<PurchaseRequestDto> CreateFromStockRequestAsync(int stockRequestId, int managerId)
        {
            // 1. Get approved stock request
            var stockRequest = await _inventoryRepo.GetStockRequestByIdAsync(stockRequestId);

            if (stockRequest == null || stockRequest.Status != "Approved")
            {
                throw new Exception("Stock request must be approved first");
            }

            // 2. Create purchase request
            var purchaseRequest = new PurchaseRequest
            {
                VehicleId = stockRequest.VehicleId,
                ConfigId = stockRequest.ConfigId ?? 0,
                DealerId = stockRequest.DealerId,
                Quantity = stockRequest.Quantity,
                //Priority = stockRequest.Priority,
                Status = "draft",
                Notes = $"From Stock Request #{stockRequest.StockRequestId}: {stockRequest.Reason}",
                //RequestedByUserId = managerId,
                CreatedAt = DateTime.UtcNow,
                //SourceStockRequestId = stockRequestId
            };

            var created = await _purchaseRequestRepo.CreateAsync(purchaseRequest);
            return MapToDto(created);
        }

        public async Task<bool> SendToEVMAsync(int purchaseRequestId, string managerPassword)
        {
            // 1. Tìm đơn hàng
            var request = await _purchaseRequestRepo.GetByIdAsync(purchaseRequestId);

            if (request == null)
            {
                throw new Exception("Không tìm thấy đơn hàng.");
            }

            if (request.Status != "draft")
            {
                throw new Exception($"Đơn hàng đang ở trạng thái '{request.Status}', không thể gửi lại.");
            }

            // 3. XÁC THỰC MẬT KHẨU (LOGIC QUAN TRỌNG)
            // ⚠️ TODO: Kết nối với AuthService thực tế của bạn để check pass
            /* var currentUserId = ...; // Lấy từ UserContext
               var isValid = await _authService.CheckPasswordAsync(currentUserId, managerPassword);
               if (!isValid) throw new Exception("Mật khẩu xác nhận không chính xác.");
            */

            // 👉 Code tạm để test (Chỉ check không được rỗng)
            if (string.IsNullOrWhiteSpace(managerPassword))
            {
                throw new Exception("Vui lòng nhập mật khẩu xác nhận.");
            }
            // Nếu muốn test pass cứng: 
            // if (managerPassword != "123456") throw new Exception("Sai mật khẩu (Demo: 123456)");

            // 4. Cập nhật trạng thái
            // Đổi sang "Sent" (Đã gửi) hoặc "Processing" (Đang xử lý) tùy quy ước của bạn
            request.Status = "Pending";

            // (Optional) Lưu thời gian gửi
            // request.SentDate = DateTime.UtcNow; 

            // 5. Lưu xuống DB
            await _purchaseRequestRepo.UpdateAsync(request);

            return true;
        }

        public async Task<PurchaseRequestDto?> GetByEVMOrderIdAsync(string evmOrderId)
        {
            var requests = await _purchaseRequestRepo.GetAllPendingAsync();
            var request = requests.FirstOrDefault();

            return request == null ? null : MapToDto(request);
        }

        // ✅ FIX: Sử dụng Repository thay vì _context
        public async Task<PurchaseRequestDto> GetRequestByIdAsync(int requestId, int dealerId)
        {
            // 1. Sử dụng Repo có sẵn để lấy request theo ID
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);

            // 2. Kiểm tra tồn tại và quyền sở hữu (DealerId)
            if (request == null || request.DealerId != dealerId)
            {
                return null;
            }

            // 3. Sử dụng hàm MapToDto chung để đồng bộ
            return MapToDto(request);
        }

        // === PHẦN BỔ SUNG: KHÔNG SỬA CÁI CŨ ===
        public async Task<PurchaseRequestDto> ProcessApprovalAsync(int requestId, ApproveRequestDto? dto)
        {
            var request = await _purchaseRequestRepo.GetByIdAsync(requestId);
            // Ghi chú: Sử dụng StringComparison.OrdinalIgnoreCase để so sánh không phân biệt hoa thường.
            if (request == null || !request.Status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Yêu cầu không hợp lệ hoặc đã được xử lý.");
            }

            // TODO: Bổ sung logic kiểm tra tồn kho tổng trước khi duyệt.

            if (dto == null || dto.ApprovedItems == null || !dto.ApprovedItems.Any())
            {
                // Trường hợp 1: Duyệt Toàn bộ (Body rỗng) - Tái sử dụng logic cũ
                return await ApproveRequestAsync(requestId);
            }
            else
            {
                // Trường hợp 2: Duyệt Một Phần
                request.Status = "PartiallyApproved"; // Hoặc "Approved" tùy nghiệp vụ
                                                      // TODO: Logic xử lý duyệt một phần: Cập nhật số lượng đã duyệt, số lượng còn lại.
                var updatedRequest = await _purchaseRequestRepo.UpdateAsync(request);

                // TODO: Logic tự động tạo phiếu Distribution dựa trên `dto.ApprovedItems`.
                // await _distributionRepo.CreateAsync(...);

                return MapToDto(updatedRequest);
            }
        }
    }
}