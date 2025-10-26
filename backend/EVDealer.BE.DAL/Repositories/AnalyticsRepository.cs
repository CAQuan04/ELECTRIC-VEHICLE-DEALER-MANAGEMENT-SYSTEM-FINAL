using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly ApplicationDbContext _context;
        public AnalyticsRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate)
        {
            // === PHIÊN BẢN SỬA LỖI - TIẾP CẬN TỪ SALESORDER ===

            // Ghi chú: Bắt đầu truy vấn trực tiếp từ bảng SalesOrder.
            // Đây là cách tiếp cận tự nhiên và chính xác nhất cho bài toán này.
            return await _context.SalesOrders
                // Ghi chú: Bước 1 - Lọc ra các đơn hàng hợp lệ để tính toán.
                .Where(order => order.Status == "Completed" &&
                               order.OrderDate >= startDate &&
                               order.OrderDate <= endDate)

                // Ghi chú: Bước 2 - Nhóm các đơn hàng đã lọc theo thông tin của Đại lý.
                // Chúng ta nhóm theo cả ID và Tên để đảm bảo tính duy nhất.
                .GroupBy(order => new { order.DealerId, order.Dealer.Name })

                // Ghi chú: Bước 3 - Biến đổi mỗi nhóm thành một dòng báo cáo (DTO).
                .Select(dealerGroup => new SalesReportItemDto
                {
                    // Ghi chú: Lấy Tên của Đại lý từ khóa của nhóm.
                    GroupingKey = dealerGroup.Key.Name,

                    // Ghi chú: Tính tổng doanh thu.
                    // Đây là thao tác SUM trực tiếp và đơn giản trên cột TotalAmount của tất cả các đơn hàng trong nhóm.
                    // Nó sẽ cộng tất cả các đơn, kể cả các đơn có vẻ trùng lặp, đây là điều chúng ta muốn.
                    TotalRevenue = dealerGroup.Sum(order => order.TotalAmount),

                    // Ghi chú: Tính tổng số lượng xe bán được.
                    // SelectMany dùng để "làm phẳng" danh sách các OrderItem từ tất cả các đơn hàng trong nhóm
                    // thành một danh sách duy nhất, sau đó tính tổng Quantity trên danh sách đó.
                    TotalQuantitySold = dealerGroup.SelectMany(order => order.OrderItems).Sum(item => item.Quantity)
                })
                // Ghi chú: Thực thi truy vấn và trả về kết quả.
                .ToListAsync();
        }
    }
}