using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho các thao tác với bảng đề xuất phân phối.
    public interface IDistributionSuggestionRepository
    {
        // Ghi chú: Yêu cầu chức năng thêm một danh sách các đề xuất mới.
        Task AddRangeAsync(IEnumerable<DistributionSuggestion> suggestions);

        // Ghi chú: Yêu cầu chức năng lấy tất cả các đề xuất đang ở trạng thái "Pending".
        Task<IEnumerable<DistributionSuggestion>> GetAllPendingAsync();

        // ===================================================================================
        // === PHẦN BỔ SUNG ĐỂ SỬA LỖI ===
        // Ghi chú: Yêu cầu chức năng xóa tất cả các đề xuất đang ở trạng thái "Pending".
        Task ClearPendingSuggestionsAsync();
        // ===================================================================================
    }
}