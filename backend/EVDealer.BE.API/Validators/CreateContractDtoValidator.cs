// Ghi chú: Lớp này chứa các quy tắc kiểm tra tính hợp lệ cho DTO tạo hợp đồng.
using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    public class CreateContractDtoValidator : AbstractValidator<CreateContractDto>
    {
        public CreateContractDtoValidator()
        {
            // Ghi chú: RuleFor chỉ định thuộc tính cần kiểm tra.
            // NotEmpty() là quy tắc: không được null hoặc rỗng.
            // WithMessage() là thông báo lỗi trả về nếu quy tắc bị vi phạm.
            RuleFor(dto => dto.Status)
                .NotEmpty().WithMessage("Trạng thái hợp đồng không được để trống.");

            // Ghi chú: Đây là một quy tắc phức tạp hơn, so sánh giữa hai thuộc tính.
            RuleFor(dto => dto.EndDate)
                .GreaterThanOrEqualTo(dto => dto.StartDate)
                .WithMessage("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        }
    }
}