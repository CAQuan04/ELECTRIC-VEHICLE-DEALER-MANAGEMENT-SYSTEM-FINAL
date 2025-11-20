using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho các thao tác CSDL liên quan đến giá và khuyến mãi.
    public interface IPricingRepository
    {
        // Hợp đồng: Phải có chức năng thêm một bản ghi giá sỉ mới.
        Task AddWholesalePriceAsync(WholesalePrice price);

        // Hợp đồng: Phải có chức năng thêm một chính sách khuyến mãi mới.
        Task AddPromotionPolicyAsync(PromotionPolicy policy);

        // Hợp đồng: Phải có chức năng lấy giá áp dụng cho một đại lý tại một thời điểm.
        // Đây là nghiệp vụ đọc quan trọng.
        Task<WholesalePrice?> GetApplicablePriceForDealerAsync(int vehicleId, int dealerId, DateOnly currentDate);

        Task<IEnumerable<WholesalePrice>> GetAllWholesalePricesSummaryAsync();
        Task<IEnumerable<PromotionPolicy>> GetAllPromotionPoliciesSummaryAsync();

        // Hợp đồng: Phải có chức năng lưu tất cả các thay đổi.
        Task<bool> SaveChangesAsync();
    }
}
