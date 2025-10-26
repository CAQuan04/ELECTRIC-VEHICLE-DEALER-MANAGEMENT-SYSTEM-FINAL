using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: Đây là một lớp DTO đặc biệt, dùng để đóng gói tất cả các tham số
    // mà người dùng có thể gửi lên qua URL (query string) để tùy chỉnh báo cáo.
    public class SalesReportQueryDto
    {
        // Ghi chú: Ngày bắt đầu của kỳ báo cáo.
        public DateOnly StartDate { get; set; }

        // Ghi chú: Ngày kết thúc của kỳ báo cáo.
        public DateOnly EndDate { get; set; }
    }
}
