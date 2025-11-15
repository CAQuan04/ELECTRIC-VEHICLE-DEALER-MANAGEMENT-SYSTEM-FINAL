// Ghi chú: Lớp này chứa tất cả các quy tắc kiểm tra tính hợp lệ cho dữ liệu
// khi tạo một người dùng mới.
using EVDealer.BE.Common.DTOs;
using FluentValidation;
using System;

namespace EVDealer.BE.API.Validators
{
    public class UserCreateDtoValidator : AbstractValidator<UserCreateDto>
    {
        public UserCreateDtoValidator()
        {
            // === Quy tắc cho Username ===
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
                .MinimumLength(5).WithMessage("Tên đăng nhập phải có ít nhất 5 ký tự.");




            // === Quy tắc cho FullName ===
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ và tên không được để trống.");
                

            // === Quy tắc cho Email ===
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống.")
                .EmailAddress().WithMessage("Định dạng email không hợp lệ.");

            // === Quy tắc cho PhoneNumber ===
            RuleFor(x => x.PhoneNumber)
                .Matches("^[0-9]{10,11}$").WithMessage("Số điện thoại phải có 10 hoặc 11 chữ số.")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber)); // Chỉ kiểm tra khi trường này không rỗng

            // === Quy tắc cho DateOfBirth ===
            RuleFor(x => x.DateOfBirth)
                .LessThan(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Ngày sinh phải là một ngày trong quá khứ.")
                .When(x => x.DateOfBirth.HasValue); // Chỉ kiểm tra khi có giá trị

            // === Quy tắc cho RoleId ===
            RuleFor(x => x.RoleId)
                .GreaterThan(0).WithMessage("RoleId không hợp lệ.");

            // === Quy tắc cho DealerId ===
            // Ghi chú: Nếu Role là DealerStaff (3) hoặc DealerManager (2), thì DealerId là bắt buộc.
            RuleFor(x => x.DealerId)
                .NotNull().WithMessage("Cần phải chọn đại lý cho vai trò này.")
                .GreaterThan(0).WithMessage("DealerId không hợp lệ.")
                .When(x => x.RoleId == 2 || x.RoleId == 3);
        }
    }
}