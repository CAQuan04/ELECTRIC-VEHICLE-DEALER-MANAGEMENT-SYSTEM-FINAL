// Ghi chú: Lớp này chứa các quy tắc kiểm tra tính hợp lệ cho DTO thiết lập chỉ tiêu.
using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    public class SetTargetDtoValidator : AbstractValidator<SetTargetDto>
    {
        public SetTargetDtoValidator()
        {
            // Ghi chú: Quy tắc: Chỉ tiêu doanh số phải là một số lớn hơn 0.
            RuleFor(dto => dto.SalesTarget)
                .GreaterThan(0).WithMessage("Chỉ tiêu doanh số phải lớn hơn 0.");

            // Ghi chú: Quy tắc: Ngày kết thúc kỳ phải sau hoặc bằng ngày bắt đầu.
            RuleFor(dto => dto.PeriodEnd)
                .GreaterThanOrEqualTo(dto => dto.PeriodStart)
                .WithMessage("Ngày kết thúc kỳ phải sau hoặc bằng ngày bắt đầu.");
        }
    }
}