using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System; // Cần thiết cho DateOnly
using System.Linq; // Cần thiết cho các phương thức LINQ
using System.Threading.Tasks; // Cần thiết cho các tác vụ bất đồng bộ

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai thực tế cho các thao tác CSDL về giá.
    // Phiên bản này đã được tối ưu hóa về hiệu suất và tính rõ ràng.
    public class PricingRepository : IPricingRepository
    {
        private readonly ApplicationDbContext _context;
        public PricingRepository(ApplicationDbContext context) => _context = context;

        // Triển khai: Chuẩn bị thêm giá sỉ vào DbContext.
        // Ghi chú: Không có thay đổi ở đây, phương thức này đã rất tốt.
        public async Task AddWholesalePriceAsync(WholesalePrice price) => await _context.WholesalePrices.AddAsync(price);

        // Triển khai: Chuẩn bị thêm chính sách khuyến mãi vào DbContext.
        // Ghi chú: Không có thay đổi ở đây.
        public async Task AddPromotionPolicyAsync(PromotionPolicy policy) => await _context.PromotionPolicies.AddAsync(policy);

        // ===================================================================================
        // === PHẦN SỬA ĐỔI VÀ HOÀN CHỈNH: TỐI ƯU HÓA LOGIC LẤY GIÁ ===
        // ===================================================================================

        // Triển khai: Lấy giá áp dụng cho đại lý - LOGIC QUAN TRỌNG ĐÃ TỐI ƯU
        public async Task<WholesalePrice?> GetApplicablePriceForDealerAsync(int vehicleId, int dealerId, DateOnly currentDate)
        {
            // Cải tiến 1: Gộp hai lần truy vấn thành MỘT LẦN DUY NHẤT.
            // Ghi chú: Bằng cách này, chúng ta chỉ cần đi đến CSDL một lần, giảm thiểu độ trễ mạng.
            var applicablePrices = await _context.WholesalePrices
                // Ghi chú: Lọc tất cả các bản ghi có khả năng áp dụng được.
                .Where(p =>
                    p.ProductId == vehicleId &&              // Phải đúng sản phẩm
                    (p.DealerId == dealerId || p.DealerId == null) && // Hoặc là giá RIÊNG, hoặc là giá CHUNG
                    p.ValidFrom <= currentDate &&            // Và phải còn trong thời gian hiệu lực
                    p.ValidTo >= currentDate)
                // Cải tiến 2: Chỉ thị cho EF Core không cần theo dõi các đối tượng này.
                // Ghi chú: Vì đây là một thao tác chỉ đọc (Read-Only), .AsNoTracking()
                // sẽ giúp tăng hiệu suất đáng kể bằng cách bỏ qua việc tạo snapshot đối tượng.
                .AsNoTracking()
                // Ghi chú: Lấy tất cả các bản ghi thỏa mãn điều kiện về bộ nhớ của ứng dụng.
                .ToListAsync();

            // Cải tiến 3: Xử lý logic ưu tiên trong bộ nhớ (in-memory), cực kỳ nhanh.
            // Ghi chú: Sau khi đã có danh sách các giá tiềm năng, chúng ta áp dụng logic ưu tiên:

            // Ưu tiên 1: Tìm giá RIÊNG (có DealerId khớp) trong danh sách vừa lấy.
            var dealerSpecificPrice = applicablePrices.FirstOrDefault(p => p.DealerId == dealerId);
            if (dealerSpecificPrice != null)
            {
                // Nếu tìm thấy, đây là giá đúng, trả về ngay lập tức.
                return dealerSpecificPrice;
            }

            // Ưu tiên 2: Nếu không có giá riêng, tìm giá CHUNG (có DealerId là null).
            var generalPrice = applicablePrices.FirstOrDefault(p => p.DealerId == null);

            // Trả về giá chung nếu có, hoặc null nếu không có giá nào.
            return generalPrice;
        }
        public async Task<IEnumerable<WholesalePrice>> GetAllWholesalePricesSummaryAsync()
        {
            return await _context.WholesalePrices
                .AsNoTracking()
                .Include(p => p.Product) // JOIN sang bảng Vehicle (giả sử navigation property là 'Product')
                .Include(p => p.Dealer)  // JOIN sang bảng Dealer
                .OrderByDescending(p => p.ValidFrom)
                .ToListAsync();
        }

        public async Task<IEnumerable<PromotionPolicy>> GetAllPromotionPoliciesSummaryAsync()
        {
            return await _context.PromotionPolicies
                .AsNoTracking()
                .Include(p => p.Dealer) // JOIN sang bảng Dealer
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();
        }
        // Triển khai: Lưu các thay đổi vào CSDL.
        // Ghi chú: Không có thay đổi ở đây.
        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }
}