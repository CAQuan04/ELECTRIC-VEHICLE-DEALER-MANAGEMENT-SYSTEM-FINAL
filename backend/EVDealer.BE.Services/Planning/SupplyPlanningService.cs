// Ghi chú: Thêm các using cần thiết.
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Planning
{
    // Ghi chú: Lớp triển khai logic nghiệp vụ cho việc hoạch định cung ứng.
    public class SupplyPlanningService : ISupplyPlanningService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SupplyPlanningService> _logger;

        public SupplyPlanningService(IUnitOfWork unitOfWork, ILogger<SupplyPlanningService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // --- Chức năng: Tạo đề xuất Phân phối ---
        public async Task GenerateDistributionSuggestionsAsync()
        {
            _logger.LogInformation("Bắt đầu quy trình tạo đề xuất phân phối...");

            // ===================================================================================
            // === PHẦN SỬA LỖI: CHUYỂN TỪ TRUY VẤN SONG SONG SANG TUẦN TỰ ===
            // Ghi chú: Chúng ta sẽ 'await' từng tác vụ một để tránh lỗi truy cập DbContext đồng thời.
            // Mỗi thao tác CSDL sẽ được hoàn thành trước khi thao tác tiếp theo bắt đầu.

            _logger.LogInformation("Đang thu thập dữ liệu dự báo mới nhất...");
            var latestForecasts = await _unitOfWork.DemandForecasts.GetLatestForecastsAsync();

            // Ghi chú: Kiểm tra dữ liệu quan trọng nhất ngay sau khi lấy.
            if (!latestForecasts.Any())
            {
                _logger.LogWarning("Không có dữ liệu dự báo nào được tìm thấy. Dừng quy trình hoạch định.");
                return;
            }

            _logger.LogInformation("Đang thu thập dữ liệu tồn kho hiện tại của các đại lý...");
            var currentInventories = await _unitOfWork.Analytics.GetCurrentInventoryByDealerAndVehicleAsync();

            _logger.LogInformation("Đang thu thập danh sách đại lý cơ bản...");
            var allDealers = await _unitOfWork.Dealers.GetAllBasicAsync();
            // ===================================================================================

            var suggestionsToSave = new List<DistributionSuggestion>();

            _logger.LogInformation("Đang xóa các đề xuất cũ còn chờ xử lý...");
            await _unitOfWork.DistributionSuggestions.ClearPendingSuggestionsAsync();

            _logger.LogInformation("Bắt đầu tính toán các đề xuất phân phối mới...");
            // Bước 2: Duyệt qua từng bản ghi dự báo.
            foreach (var forecast in latestForecasts)
            {
                // Bỏ qua nếu dự báo không dành cho một đại lý cụ thể.
                if (!forecast.DealerId.HasValue) continue;

                var dealerInfo = allDealers.FirstOrDefault(d => d.DealerId == forecast.DealerId.Value);
                if (dealerInfo == null) continue; // Bỏ qua nếu không tìm thấy thông tin đại lý.

                var safetyStock = dealerInfo.SafetyStockLevel;

                // Ghi chú: Tạo key là một cặp (DealerId, VehicleId) để tra cứu tồn kho chính xác.
                var inventoryKey = (DealerId: forecast.DealerId.Value, VehicleId: forecast.VehicleId);
                // Ghi chú: Tra cứu tồn kho. Nếu không tìm thấy, currentStock sẽ mặc định là 0.
                currentInventories.TryGetValue(inventoryKey, out var currentStock);

                // Bước 3: Áp dụng công thức nghiệp vụ cốt lõi.
                // Lượng cần giao = Nhu cầu dự báo - Tồn kho hiện tại + Mức tồn kho an toàn.
                int requiredShipment = forecast.PredictedQuantity - currentStock + safetyStock;

                // Bước 4: Chỉ tạo đề xuất nếu số lượng cần giao lớn hơn 0.
                if (requiredShipment > 0)
                {
                    suggestionsToSave.Add(new DistributionSuggestion
                    {
                        DealerId = forecast.DealerId.Value,
                        VehicleId = forecast.VehicleId,
                        SuggestedQuantity = requiredShipment,
                        ForecastedDemand = forecast.PredictedQuantity,
                        CurrentInventory = currentStock,
                        SafetyStock = safetyStock,
                        Status = "Pending",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // Bước 5: Lưu kết quả vào CSDL.
            if (suggestionsToSave.Any())
            {
                await _unitOfWork.DistributionSuggestions.AddRangeAsync(suggestionsToSave);
                // Ghi chú: Chỉ gọi CompleteAsync() một lần duy nhất ở cuối để lưu tất cả thay đổi.
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Đã tạo và lưu thành công {count} đề xuất phân phối mới.", suggestionsToSave.Count);
            }
            else
            {
                _logger.LogInformation("Không có đề xuất phân phối nào cần tạo trong kỳ này.");
            }
        }

        // --- Chức năng: Lấy các đề xuất đang chờ xử lý ---
        public async Task<IEnumerable<DistributionSuggestion>> GetPendingSuggestionsAsync()
        {
            _logger.LogInformation("Đang lấy danh sách các đề xuất phân phối đang chờ xử lý...");
            return await _unitOfWork.DistributionSuggestions.GetAllPendingAsync();
        }

        // --- Chức năng: Tạo báo cáo Kế hoạch Sản xuất ---
        public async Task<ProductionPlanReportDto> GenerateProductionPlanReportAsync(DateOnly periodStart)
        {
            _logger.LogInformation("Bắt đầu tạo báo cáo kế hoạch sản xuất cho kỳ {period}", periodStart);

            var totalDemandData = await _unitOfWork.Analytics.GetTotalDemandForecastByVehicleAsync(periodStart);
            var hqInventoryData = await _unitOfWork.Analytics.GetTotalInventoryByVehicleAsync("HQ");
            var allVehicles = await _unitOfWork.Vehicles.GetAllBasicAsync(); // Tối ưu: Dùng GetAllBasicAsync
            var workInProgressData = GetWorkInProgressData(); // Dữ liệu giả định

            var planItems = new List<ProductionPlanReportItemDto>();

            foreach (var vehicle in allVehicles.Where(v => v.Status == "Active"))
            {
                totalDemandData.TryGetValue(vehicle.VehicleId, out var forecastedDemand);
                hqInventoryData.TryGetValue(vehicle.VehicleId, out var hqInventory);
                workInProgressData.TryGetValue(vehicle.VehicleId, out var wip);

                planItems.Add(new ProductionPlanReportItemDto
                {
                    VehicleId = vehicle.VehicleId,
                    VehicleName = vehicle.Model,
                    TotalForecastedDemand = forecastedDemand,
                    TotalHqInventory = hqInventory,
                    WorkInProgress = wip
                });
            }

            return new ProductionPlanReportDto
            {
                ReportTitle = $"Báo cáo Kế hoạch Sản xuất tháng {periodStart:MM/yyyy}",
                ReportPeriodStart = periodStart,
                ReportPeriodEnd = periodStart.AddMonths(1).AddDays(-1),
                PlanItems = planItems
            };
        }

        // Dữ liệu giả định cho các xe đang trong dây chuyền sản xuất
        private Dictionary<int, int> GetWorkInProgressData()
        {
            return new Dictionary<int, int>
            {
                { 6, 50 },
                { 7, 30 }
            };
        }
    }
}