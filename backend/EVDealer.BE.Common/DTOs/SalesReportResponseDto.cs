using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: Lớp này là "vỏ bọc" cho toàn bộ kết quả báo cáo.
    // Việc bọc lại giúp API có thể mở rộng trong tương lai, ví dụ thêm các thông tin
    // tổng hợp như "Tổng doanh thu toàn hệ thống".
    public class SalesReportResponseDto
    {
        // Ghi chú: Danh sách các dòng dữ liệu của báo cáo.
        public IEnumerable<SalesReportItemDto> ReportData { get; set; }

        // Ghi chú: Mô tả về báo cáo, ví dụ "Báo cáo doanh số theo Đại lý".
        public string ReportTitle { get; set; }
    }
}
