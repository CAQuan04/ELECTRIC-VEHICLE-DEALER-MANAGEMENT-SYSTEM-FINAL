using EVDealer.BE.Common.DTOs;
using FluentValidation;

namespace EVDealer.BE.API.Validators
{
    // Ghi chú: Lớp này chứa các "luật lệ" cho một truy vấn báo cáo hợp lệ.
    public class SalesReportQueryDtoValidator : AbstractValidator<SalesReportQueryDto>
    {
        public SalesReportQueryDtoValidator()
        {
            // === QUY TẮC 1: Logic cơ bản ===
            // Ghi chú: Định nghĩa một quy tắc cho thuộc tính EndDate.
            RuleFor(query => query.EndDate)
                // Ghi chú: Quy tắc yêu cầu EndDate phải lớn hơn hoặc bằng StartDate.
                .GreaterThanOrEqualTo(query => query.StartDate)
                // Ghi chú: Thông báo lỗi thân thiện sẽ được trả về nếu quy tắc bị vi phạm.
                .WithMessage("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");

            // === QUY TẮC 2: BẢO VỆ HỆ THỐNG (NGHIỆP VỤ QUAN TRỌNG) ===
            // Ghi chú: Định nghĩa một quy tắc áp dụng cho toàn bộ đối tượng (query).
            RuleFor(query => query)
                // Ghi chú: Must() cho phép chúng ta viết một logic kiểm tra tùy chỉnh phức tạp.
                .Must(query => query.EndDate.DayNumber - query.StartDate.DayNumber <= 366)
                // Ghi chú: Thông báo lỗi này rất quan trọng, nó cho người dùng biết giới hạn của hệ thống.
                .WithMessage("Khoảng thời gian báo cáo không được vượt quá 1 năm (366 ngày).");
        }
    }
}
