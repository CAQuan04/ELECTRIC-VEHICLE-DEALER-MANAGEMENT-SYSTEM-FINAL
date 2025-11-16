using AutoMapper;
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Pricing
{
    // Ghi chú: Lớp triển khai logic nghiệp vụ cho việc định giá.
    public class PricingService : IPricingService
    {
        private readonly IPricingRepository _pricingRepo;
        private readonly IMapper _mapper; // Dùng AutoMapper để chuyển đổi DTO sang Model

        public PricingService(IPricingRepository pricingRepo, IMapper mapper)
        {
            _pricingRepo = pricingRepo;
            _mapper = mapper;
        }

        // Triển khai nghiệp vụ: Thiết lập giá sỉ.
        public async Task<WholesalePrice> SetWholesalePriceAsync(SetWholesalePriceDto dto)
        {
            // Bước 1: Dùng AutoMapper để chuyển đổi DTO thành đối tượng Model.
            var newPrice = _mapper.Map<WholesalePrice>(dto);
            // Bước 2: Ra lệnh cho Repository thêm vào CSDL.
            await _pricingRepo.AddWholesalePriceAsync(newPrice);
            await _pricingRepo.SaveChangesAsync();
            // Bước 3: Trả về đối tượng vừa được tạo.
            return newPrice;
        }

        // Triển khai nghiệp vụ: Tạo chính sách khuyến mãi.
        public async Task<PromotionPolicy> CreatePromotionPolicyAsync(CreatePromotionPolicyDto dto)
        {
            // Tương tự như trên.
            var newPolicy = _mapper.Map<PromotionPolicy>(dto);
            await _pricingRepo.AddPromotionPolicyAsync(newPolicy);
            await _pricingRepo.SaveChangesAsync();
            return newPolicy;
        }

        // Triển khai nghiệp vụ: Lấy giá áp dụng cho đại lý.
        public async Task<WholesalePrice?> GetPriceForDealerAsync(int vehicleId, int dealerId)
        {
            // Lấy ngày hiện tại để kiểm tra hiệu lực.
            var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);
            // Giao toàn bộ logic phức tạp cho Repository xử lý.
            return await _pricingRepo.GetApplicablePriceForDealerAsync(vehicleId, dealerId, currentDate);
        }

        public async Task<IEnumerable<WholesalePriceSummaryDto>> GetWholesalePricesSummaryAsync()
        {
            var prices = await _pricingRepo.GetAllWholesalePricesSummaryAsync();
            // Ghi chú: Mapping thủ công từ Model sang DTO
            return prices.Select(p => new WholesalePriceSummaryDto
            {
                PriceId = p.PriceId,
                ProductId = p.ProductId,
                ProductName = p.Product?.Model ?? "N/A",
                //"N/A", // Lấy tên Model từ Vehicle
                DealerId = p.DealerId,
                DealerName = p.Dealer?.Name, // Lấy tên từ Dealer
                Price = p.Price,
                ValidFrom = p.ValidFrom,
                ValidTo = p.ValidTo
            });
        }

        public async Task<IEnumerable<PromotionPolicySummaryDto>> GetPromotionPoliciesSummaryAsync()
        {
            var policies = await _pricingRepo.GetAllPromotionPoliciesSummaryAsync();
            // Dùng AutoMapper hoặc mapping thủ công
            return policies.Select(p => new PromotionPolicySummaryDto
            {
                PolicyId = p.PolicyId,
                DealerId = p.DealerId,
                DealerName = p.Dealer?.Name ?? "N/A",
                Description = p.Description,
                DiscountPercent = p.DiscountPercent,
                StartDate = p.StartDate,
                EndDate = p.EndDate
            });
        }
    }
}
