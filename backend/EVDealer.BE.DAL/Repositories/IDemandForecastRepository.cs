using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho các thao tác với bảng kết quả dự báo (DemandForecast).
    public interface IDemandForecastRepository
    {
        // Ghi chú: Yêu cầu chức năng thêm một bản ghi dự báo mới vào DbContext (chưa lưu).
        Task AddAsync(DemandForecast forecast);
        Task AddRangeAsync(IEnumerable<DemandForecast> forecasts);

        // Ghi chú: Yêu cầu chức năng xóa tất cả các dự báo CŨ của một kỳ nào đó.
        // Điều này cực kỳ quan trọng để đảm bảo bảng chỉ chứa dự báo mới nhất cho kỳ tới,
        // tránh việc người dùng xem nhầm dữ liệu cũ.
        Task ClearForecastsForPeriodAsync(DateOnly periodStart);

        // Ghi chú: Yêu cầu chức năng lấy các dự báo mới nhất để hiển thị cho người dùng.
        // Chúng ta sẽ lấy các dự báo có ngày tạo (CreatedAt) gần nhất.
        Task<IEnumerable<DemandForecast>> GetLatestForecastsAsync();
    }
}
