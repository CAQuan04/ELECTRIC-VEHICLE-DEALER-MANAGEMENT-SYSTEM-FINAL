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
        public async Task<SalesReportResponseDto> GenerateSalesReportAsync(SalesReportQueryDto query)
        {
            if (query.StartDate > query.EndDate)
            {
                throw new ArgumentException("Ngày bắt đầu không được sau ngày kết thúc.");
            }

            // Ghi chú: Truyền tất cả các tham số từ DTO xuống Repository.
            var reportData = await _unitOfWork.Analytics.GetSalesDataAsync(query.StartDate, query.EndDate, query.GroupBy, query.DealerId, query.VehicleId);

            return new SalesReportResponseDto
            {
                ReportData = reportData,
                ReportTitle = $"Báo cáo doanh số từ {query.StartDate:yyyy-MM-dd} đến {query.EndDate:yyyy-MM-dd}"
            };
        }

        // --- Báo cáo Tồn kho ---
        public async Task<IEnumerable<InventoryTurnoverReportItemDto>> GenerateInventoryTurnoverReportAsync(SalesReportQueryDto query)
        {
            // Ghi chú: Truyền đầy đủ các tham số lọc từ DTO 'query' xuống các hàm Repository.
            var salesData = await _unitOfWork.Analytics.GetTotalSalesByDealerAndVehicleAsync(query.StartDate, query.EndDate, query.DealerId, query.VehicleId);
            var receiptData = await _unitOfWork.Analytics.GetTotalReceiptsByDealerAndVehicleAsync(query.StartDate, query.EndDate, query.DealerId, query.VehicleId);
            var inventoryData = await _unitOfWork.Analytics.GetCurrentInventoryByDealerAndVehicleAsync(query.DealerId, query.VehicleId);

            var dealersQuery = _context.Dealers.AsNoTracking();
            if (query.DealerId.HasValue)
            {
                dealersQuery = dealersQuery.Where(d => d.DealerId == query.DealerId.Value);
            }
            var dealersToReport = await dealersQuery.ToListAsync();

            var report = new List<InventoryTurnoverReportItemDto>();

            foreach (var dealer in dealersToReport)
            {
                var quantitySold = salesData.Where(kvp => kvp.Key.DealerId == dealer.DealerId).Sum(kvp => kvp.Value);
                var quantityReceived = receiptData.Where(kvp => kvp.Key.DealerId == dealer.DealerId).Sum(kvp => kvp.Value);
                var closingStock = inventoryData.Where(kvp => kvp.Key.DealerId == dealer.DealerId).Sum(kvp => kvp.Value);

                if (quantitySold > 0 || quantityReceived > 0 || closingStock > 0)
                {
                    var openingStock = closingStock - quantityReceived + quantitySold;
                    var denominator = openingStock + quantityReceived;
                    var sellThroughRate = (denominator > 0) ? Math.Round((decimal)quantitySold / denominator * 100, 2) : 0;

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
        }
    }
}