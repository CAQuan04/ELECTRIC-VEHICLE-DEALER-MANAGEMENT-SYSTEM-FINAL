// Ghi chú: Lớp này chứa các quy tắc kiểm tra tính hợp lệ cho dữ liệu
// khi cập nhật thông tin của một người dùng.
using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    public class UserUpdateDtoValidator : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateDtoValidator()
        {
            // === Các quy tắc tương tự như UserCreateDtoValidator, nhưng không có Password ===

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ và tên không được để trống.")
                .MaximumLength(150).WithMessage("Họ và tên không được vượt quá 150 ký tự.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống.")
                .EmailAddress().WithMessage("Định dạng email không hợp lệ.");

            RuleFor(x => x.PhoneNumber)
                .Matches("^[0-9]{10,11}$").WithMessage("Số điện thoại phải có 10 hoặc 11 chữ số.")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

            RuleFor(x => x.DateOfBirth)
                .LessThan(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Ngày sinh phải là một ngày trong quá khứ.")
                .When(x => x.DateOfBirth.HasValue);

            RuleFor(x => x.RoleId)
                .GreaterThan(0).WithMessage("RoleId không hợp lệ.");

            RuleFor(x => x.DealerId)
                .NotNull().WithMessage("Cần phải chọn đại lý cho vai trò này.")
                .GreaterThan(0).WithMessage("DealerId không hợp lệ.")
                .When(x => x.RoleId == 2 || x.RoleId == 3);
        }
    }
}