using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Analytics
{
    // Ghi chú: Lớp triển khai dịch vụ phân tích, đã được cập nhật để sử dụng các phương thức Repository mới.
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;

        // Ghi chú: Cập nhật Constructor để sử dụng IUnitOfWork thay vì IAnalyticsRepository trực tiếp.
        // Điều này giúp quản lý transaction tốt hơn.
        public AnalyticsService(IUnitOfWork unitOfWork, ApplicationDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        // --- Báo cáo Doanh số ---
        public async Task<SalesReportResponseDto> GenerateSalesReportByDealerAsync(DateOnly startDate, DateOnly endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException("Ngày bắt đầu không được sau ngày kết thúc.");
            }

            // Ghi chú: Gọi phương thức GetSalesDataByDealerAsync thông qua Unit of Work.
            var reportData = await _unitOfWork.Analytics.GetSalesDataByDealerAsync(startDate, endDate);

            return new SalesReportResponseDto
            {
                ReportData = reportData,
                ReportTitle = $"Báo cáo doanh số theo Đại lý từ {startDate:yyyy-MM-dd} đến {endDate:yyyy-MM-dd}"
            };
        }

        // --- Báo cáo Tồn kho & Tốc độ tiêu thụ ---
        public async Task<IEnumerable<InventoryTurnoverReportItemDto>> GenerateInventoryTurnoverReportAsync(DateOnly startDate, DateOnly endDate)
        {
            // ===================================================================================
            // === PHẦN SỬA LỖI: SỬ DỤNG CÁC PHƯƠNG THỨC REPOSITORY MỚI ===

            // Ghi chú: Gọi các phương thức mới trả về Dictionary chi tiết theo cặp (Dealer, Vehicle).
            var salesDataTask = _unitOfWork.Analytics.GetTotalSalesByDealerAndVehicleAsync(startDate, endDate);
            var receiptDataTask = _unitOfWork.Analytics.GetTotalReceiptsByDealerAndVehicleAsync(startDate, endDate);
            var inventoryDataTask = _unitOfWork.Analytics.GetCurrentInventoryByDealerAndVehicleAsync();
            var allDealersTask = _context.Dealers.AsNoTracking().ToListAsync();

            await Task.WhenAll(salesDataTask, receiptDataTask, inventoryDataTask, allDealersTask);

            var salesByVehicle = salesDataTask.Result;
            var receiptsByVehicle = receiptDataTask.Result;
            var inventoryByVehicle = inventoryDataTask.Result;
            var allDealers = allDealersTask.Result;

            var report = new List<InventoryTurnoverReportItemDto>();

            // Ghi chú: Logic tính toán được sửa lại để tổng hợp dữ liệu từ cấp độ chi tiết (Vehicle)
            // lên cấp độ tổng hợp (Dealer).
            foreach (var dealer in allDealers)
            {
                // Tính tổng lượng bán của ĐẠI LÝ này bằng cách lọc và tính tổng từ dictionary chi tiết.
                var quantitySold = salesByVehicle
                    .Where(kvp => kvp.Key.DealerId == dealer.DealerId)
                    .Sum(kvp => kvp.Value);

                // Tính tổng lượng nhập.
                var quantityReceived = receiptsByVehicle
                    .Where(kvp => kvp.Key.DealerId == dealer.DealerId)
                    .Sum(kvp => kvp.Value);

                // Tính tổng tồn kho cuối kỳ.
                var closingStock = inventoryByVehicle
                    .Where(kvp => kvp.Key.DealerId == dealer.DealerId)
                    .Sum(kvp => kvp.Value);

                // Chỉ thêm vào báo cáo nếu đại lý có hoạt động.
                if (quantitySold > 0 || quantityReceived > 0 || closingStock > 0)
                {
                    // Công thức tính tồn đầu kỳ vẫn không đổi.
                    var openingStock = closingStock - quantityReceived + quantitySold;
                    var denominator = openingStock + quantityReceived;
                    var sellThroughRate = (denominator > 0)
                        ? Math.Round((decimal)quantitySold / denominator * 100, 2)
                        : 0;

                    report.Add(new InventoryTurnoverReportItemDto
                    {
                        GroupingKey = dealer.Name,
                        OpeningStock = openingStock,
                        QuantityReceived = quantityReceived,
                        QuantitySold = quantitySold,
                        ClosingStock = closingStock,
                        SellThroughRatePercentage = sellThroughRate
                    });
                }
            }
            return report;
            // ===================================================================================
        }
    }
}