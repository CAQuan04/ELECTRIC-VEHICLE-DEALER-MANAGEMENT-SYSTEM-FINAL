using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai các hành động CSDL cho DistributionSuggestion.
    public class DistributionSuggestionRepository : IDistributionSuggestionRepository
    {
        private readonly ApplicationDbContext _context;

        public DistributionSuggestionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Triển khai: Thêm nhiều đề xuất cùng lúc.
        public async Task AddRangeAsync(IEnumerable<DistributionSuggestion> suggestions)
        {
            await _context.DistributionSuggestions.AddRangeAsync(suggestions);
        }

        // Triển khai: Lấy các đề xuất đang chờ.
        public async Task<IEnumerable<DistributionSuggestion>> GetAllPendingAsync()
        {
            return await _context.DistributionSuggestions
                .Where(s => s.Status == "Pending")
                .Include(s => s.Dealer)
                .Include(s => s.Vehicle)
                .OrderBy(s => s.DealerId).ThenBy(s => s.VehicleId)
                .ToListAsync();
        }

        // ===================================================================================
        // === PHẦN BỔ SUNG ĐỂ SỬA LỖI ===
        // Triển khai: Xóa các đề xuất đang chờ.
        public async Task ClearPendingSuggestionsAsync()
        {
            // Ghi chú: Dùng ExecuteDeleteAsync() là cách hiệu quả nhất để xóa nhiều bản ghi
            // mà không cần phải tải chúng vào bộ nhớ trước.
            await _context.DistributionSuggestions
                .Where(s => s.Status == "Pending")
                .ExecuteDeleteAsync();
        }
        // ===================================================================================
    }
}