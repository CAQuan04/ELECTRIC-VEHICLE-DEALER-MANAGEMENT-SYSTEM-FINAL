namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO này là "biểu mẫu" chuẩn để hiển thị kết quả dự báo.
    // Nó chỉ chứa những thông tin mà người dùng CẦN xem.
    public class DemandForecastDto
    {
        public int ForecastId { get; set; }
        public int VehicleId { get; set; }
        // Ghi chú: Lấy tên xe để hiển thị, thay vì chỉ có ID.
        public string VehicleName { get; set; }
        public int? DealerId { get; set; }
        // Ghi chú: Lấy tên đại lý để hiển thị.
        public string? DealerName { get; set; }
        public DateOnly ForecastPeriodStart { get; set; }
        public DateOnly ForecastPeriodEnd { get; set; }
        public int PredictedQuantity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}