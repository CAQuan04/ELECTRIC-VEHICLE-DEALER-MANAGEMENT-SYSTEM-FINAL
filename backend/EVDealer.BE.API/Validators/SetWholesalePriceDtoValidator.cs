using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    // Ghi chú: Lớp chứa các quy tắc kiểm tra tính hợp lệ cho dữ liệu giá sỉ.
    public class SetWholesalePriceDtoValidator : AbstractValidator<SetWholesalePriceDto>
    {
        public SetWholesalePriceDtoValidator()
        {
            // Quy tắc: Giá phải là một số dương.
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Giá bán phải lớn hơn 0.");
            // Quy tắc: Ngày hết hạn phải sau hoặc bằng ngày bắt đầu.
            RuleFor(x => x.ValidTo).GreaterThanOrEqualTo(x => x.ValidFrom).WithMessage("Ngày hết hạn phải sau hoặc bằng ngày bắt đầu.");
        }
    }
}
