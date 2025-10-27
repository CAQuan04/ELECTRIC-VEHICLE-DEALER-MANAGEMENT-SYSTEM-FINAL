using AutoMapper;
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.API.MappingProfiles
{
    // Ghi chú: Lớp chứa các quy tắc mapping cho module Pricing.
    public class PricingProfile : Profile
    {
        public PricingProfile()
        {
            // Quy tắc: Chuyển từ DTO sang Model khi thiết lập giá sỉ.
            CreateMap<SetWholesalePriceDto, WholesalePrice>();
            // Quy tắc: Chuyển từ DTO sang Model khi tạo chính sách khuyến mãi.
            CreateMap<CreatePromotionPolicyDto, PromotionPolicy>();
        }
    }
}