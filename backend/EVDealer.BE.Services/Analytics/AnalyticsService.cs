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
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IAnalyticsRepository _analyticsRepo;
        private readonly ApplicationDbContext _context;

        public AnalyticsService(IAnalyticsRepository analyticsRepo, ApplicationDbContext context)
        {
            _analyticsRepo = analyticsRepo;
            _context = context;
        }

        // ===================================================================================
        // === PHẦN ĐÃ SỬA ĐỔI: CẬP NHẬT CHỮ KÝ PHƯƠNG THỨC ===
        // Ghi chú: Chữ ký phương thức này bây giờ khớp chính xác với định nghĩa trong IAnalyticsService.
        public async Task<SalesReportResponseDto> GenerateSalesReportByDealerAsync(SalesReportQueryDto query)
        {
            // Ghi chú: Logic kiểm tra nghiệp vụ không đổi, nhưng bây giờ nó đọc từ các thuộc tính của 'query'.
            if (query.StartDate > query.EndDate)
            {
                throw new ArgumentException("Ngày bắt đầu không được sau ngày kết thúc.");
            }

            // Ghi chú: Truyền các tham số đã được lọc xuống Repository.
            var reportData = await _analyticsRepo.GetSalesDataByDealerAsync(query.StartDate, query.EndDate, query.DealerId, query.VehicleId);

            // Ghi chú: Đóng gói kết quả vào DTO response.
            var response = new SalesReportResponseDto
            {
                ReportData = reportData,
                ReportTitle = $"Báo cáo doanh số theo Đại lý từ {query.StartDate:yyyy-MM-dd} đến {query.EndDate:yyyy-MM-dd}"
            };

            return response;
        }
        // ===================================================================================

        // Ghi chú: Phương thức này đã được viết đúng từ trước.
        public async Task<IEnumerable<InventoryTurnoverReportItemDto>> GenerateInventoryTurnoverReportAsync(SalesReportQueryDto query)
        {
            // (Toàn bộ logic của phương thức này giữ nguyên như phiên bản đã sửa lỗi InvalidOperationException)
            var salesData = await _analyticsRepo.GetTotalSalesByDealerAsync(query.StartDate, query.EndDate, query.DealerId, query.VehicleId);
            var receiptData = await _analyticsRepo.GetTotalReceiptsByDealerAsync(query.StartDate, query.EndDate, query.DealerId, query.VehicleId);
            var inventoryData = await _analyticsRepo.GetCurrentInventoryByDealerAsync(query.DealerId, query.VehicleId);
            var dealersToReport = await (query.DealerId.HasValue
                ? _context.Dealers.Where(d => d.DealerId == query.DealerId.Value).ToListAsync()
                : _context.Dealers.AsNoTracking().ToListAsync());

            var report = new List<InventoryTurnoverReportItemDto>();

            foreach (var dealer in dealersToReport)
            {
                salesData.TryGetValue(dealer.DealerId, out var quantitySold);
                receiptData.TryGetValue(dealer.DealerId, out var quantityReceived);
                inventoryData.TryGetValue(dealer.DealerId, out var closingStock);
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
            return report;
        }
    }
}