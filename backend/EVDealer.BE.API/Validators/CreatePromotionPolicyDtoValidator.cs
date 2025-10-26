using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    // Ghi chú: Lớp chứa các quy tắc kiểm tra tính hợp lệ cho chính sách khuyến mãi.
    public class CreatePromotionPolicyDtoValidator : AbstractValidator<CreatePromotionPolicyDto>
    {
        public CreatePromotionPolicyDtoValidator()
        {
            // Quy tắc: Mô tả không được để trống.
            RuleFor(x => x.Description).NotEmpty().WithMessage("Mô tả chính sách không được để trống.");
            // Quy tắc: Tỷ lệ chiết khấu phải từ 0 đến 100.
            RuleFor(x => x.DiscountPercent).InclusiveBetween(0, 100).WithMessage("Tỷ lệ chiết khấu phải từ 0 đến 100.");
            // Quy tắc: Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.
            RuleFor(x => x.EndDate).GreaterThanOrEqualTo(x => x.StartDate).WithMessage("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        }
    }
}
