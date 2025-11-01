namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: Lớp này định nghĩa cấu trúc cho MỘT DÒNG trong báo cáo kế hoạch sản xuất.
    // Mỗi dòng tương ứng với một mẫu xe (Vehicle).
    public class ProductionPlanReportItemDto
    {
        // Ghi chú: ID và Tên của mẫu xe để nhận diện.
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }

        // Ghi chú: Tổng nhu cầu dự báo cho mẫu xe này trên toàn hệ thống (tất cả các đại lý).
        public int TotalForecastedDemand { get; set; }

        // Ghi chú: Tổng số lượng xe của mẫu này đang có sẵn tại các kho tổng của hãng (HQ).
        public int TotalHqInventory { get; set; }

        // Ghi chú: Số lượng xe đang trong dây chuyền sản xuất (Work-In-Progress).
        // Trong thực tế, dữ liệu này có thể đến từ hệ thống quản lý sản xuất (MES).
        public int WorkInProgress { get; set; }

        // Ghi chú: CON SỐ CUỐI CÙNG VÀ QUAN TRỌNG NHẤT - Số lượng xe cần sản xuất thêm.
        // Công thức: Nhu cầu - Tồn kho - Đang sản xuất.
        public int RequiredToProduce => Math.Max(0, TotalForecastedDemand - TotalHqInventory - WorkInProgress);
    }
}