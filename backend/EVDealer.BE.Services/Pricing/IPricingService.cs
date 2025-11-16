using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Pricing
{
    // Ghi chú: Hợp đồng cho các dịch vụ nghiệp vụ liên quan đến giá.
    public interface IPricingService
    {
        // Hợp đồng: Phải có chức năng thiết lập giá sỉ.
        Task<WholesalePrice> SetWholesalePriceAsync(SetWholesalePriceDto dto);
        // Hợp đồng: Phải có chức năng tạo chính sách khuyến mãi.
        Task<PromotionPolicy> CreatePromotionPolicyAsync(CreatePromotionPolicyDto dto);
        // Hợp đồng: Phải có chức năng lấy giá áp dụng cho đại lý.
        Task<WholesalePrice?> GetPriceForDealerAsync(int vehicleId, int dealerId);

        Task<IEnumerable<WholesalePriceSummaryDto>> GetWholesalePricesSummaryAsync();
        Task<IEnumerable<PromotionPolicySummaryDto>> GetPromotionPoliciesSummaryAsync();
    }
}
