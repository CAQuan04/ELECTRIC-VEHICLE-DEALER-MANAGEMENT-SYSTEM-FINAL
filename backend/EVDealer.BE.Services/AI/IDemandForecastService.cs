using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Threading.Tasks;

namespace EVDealer.BE.Services.AI
{
    // Ghi chú: "Hợp đồng" cho dịch vụ AI.
    public interface IDemandForecastService
    {
        // Ghi chú: Yêu cầu phải có một chức năng chính để chạy toàn bộ quy trình:
        // Lấy dữ liệu -> Huấn luyện -> Dự báo -> Lưu kết quả.
        Task RunDemandForecastProcessAsync();
        // === THAY ĐỔI: TRẢ VỀ DANH SÁCH DTO THAY VÌ MODEL ===
        Task<IEnumerable<DemandForecastDto>> GetLatestForecastsAsync();

    }
}
