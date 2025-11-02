using System;
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai các hành động CSDL cho DemandForecast.
    public class DemandForecastRepository : IDemandForecastRepository
    {
        private readonly ApplicationDbContext _context; // Ghi chú: Cần DbContext để truy vấn.

        public DemandForecastRepository(ApplicationDbContext context)
        {
            _context = context; // Ghi chú: Được cung cấp qua Dependency Injection.
        }

        // Triển khai: Chuẩn bị thêm một đối tượng DemandForecast vào DbContext.
        public async Task AddAsync(DemandForecast forecast)
        {
            await _context.DemandForecasts.AddAsync(forecast);
        }
        // === PHẦN BỔ SUNG: TRIỂN KHAI PHƯƠNG THỨC THÊM NHIỀU BẢN GHI ===
        // Ghi chú: Phương thức này nhận một danh sách và gọi AddRangeAsync của DbContext.
        // Đây là cách làm hiệu quả nhất để thêm nhiều bản ghi cùng lúc.
        public async Task AddRangeAsync(IEnumerable<DemandForecast> forecasts)
        {
            await _context.DemandForecasts.AddRangeAsync(forecasts);
        }
        // Triển khai: Xóa các dự báo cũ.
        public async Task ClearForecastsForPeriodAsync(DateOnly periodStart)
        {
            // Ghi chú: Tìm tất cả các bản ghi có cùng kỳ bắt đầu dự báo.
            var oldForecasts = await _context.DemandForecasts
                .Where(f => f.ForecastPeriodStart == periodStart)
                .ToListAsync();

            // Ghi chú: Nếu tìm thấy, xóa chúng khỏi DbContext.
            if (oldForecasts.Any())
            {
                _context.DemandForecasts.RemoveRange(oldForecasts);
            }
        }

        // Triển khai: Lấy các dự báo mới nhất.
        public async Task<IEnumerable<DemandForecast>> GetLatestForecastsAsync()
        {
            // Ghi chú: Bước 1 - Tìm ngày tạo (CreatedAt) mới nhất trong toàn bộ bảng.
            var latestTimestamp = await _context.DemandForecasts
                .MaxAsync(f => (DateTime?)f.CreatedAt); // Dùng (DateTime?) để tránh lỗi nếu bảng rỗng.

            if (latestTimestamp == null)
            {
                // Ghi chú: Nếu không có dự báo nào, trả về một danh sách rỗng.
                return new List<DemandForecast>();
            }

            // Ghi chú: Bước 2 - Lấy tất cả các bản ghi có ngày tạo bằng với ngày mới nhất đó.
            // Điều này đảm bảo chúng ta lấy toàn bộ kết quả của lần chạy AI cuối cùng.
            return await _context.DemandForecasts
                .Include(f => f.Vehicle) // JOIN sang bảng Vehicle để lấy tên xe.
                .Include(f => f.Dealer)  // JOIN sang bảng Dealer để lấy tên đại lý.
                .Where(f => f.CreatedAt == latestTimestamp.Value)
                .ToListAsync();
        }
    }
}