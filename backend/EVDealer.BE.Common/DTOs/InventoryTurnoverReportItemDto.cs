using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: Lớp này định nghĩa cấu trúc cho MỘT DÒNG trong báo cáo tồn kho.
    // Ví dụ: "Đại lý ABC | Tồn đầu: 40 | Nhập: 20 | Bán: 10 | Tồn cuối: 50 | Tỷ lệ: 16.67%"
    public class InventoryTurnoverReportItemDto
    {
        // Ghi chú: Tên của nhóm (ví dụ: "Đại lý Hà Nội", "Đại lý TP.HCM").
        public string GroupingKey { get; set; }

        // Ghi chú: Số lượng tồn kho tại thời điểm BẮT ĐẦU kỳ báo cáo.
        // Đây là một con số được TÍNH TOÁN ngược lại dựa trên các hoạt động trong kỳ.
        public int OpeningStock { get; set; }

        // Ghi chú: Tổng số lượng hàng đã NHẬP về trong kỳ (từ các phiếu Distribution).
        public int QuantityReceived { get; set; }

        // Ghi chú: Tổng số lượng hàng đã BÁN ra trong kỳ (từ các SalesOrder).
        public int QuantitySold { get; set; }

        // Ghi chú: Số lượng tồn kho tại thời điểm KẾT THÚC kỳ báo cáo (tồn kho hiện tại).
        // Đây là con số lấy trực tiếp từ bảng Inventory.
        public int ClosingStock { get; set; }

        // Ghi chú: Tốc độ tiêu thụ (Sell-through Rate), một chỉ số nghiệp vụ cực kỳ quan trọng.
        // Công thức: (Lượng bán ra) / (Tồn đầu kỳ + Lượng nhập về).
        public decimal SellThroughRatePercentage { get; set; }
    }
}