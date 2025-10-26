using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{

    // Ghi chú: Định nghĩa cấu trúc cho MỘT DÒNG trong báo cáo.
    // Ví dụ: "Đại lý A | 2 | 1,500,000,000"
    public class SalesReportItemDto
    {
        // Ghi chú: Dùng để chứa tên của nhóm (ví dụ: "Đại lý A", "Khu vực Miền Bắc").
        public string GroupingKey { get; set; }

        // Ghi chú: Dùng để chứa tổng số lượng xe bán được trong nhóm đó.
        public int TotalQuantitySold { get; set; }

        // Ghi chú: Dùng để chứa tổng doanh thu của nhóm đó.
        public decimal TotalRevenue { get; set; }
    }
}
