using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: DTO này định nghĩa các trường được phép cập nhật cho một PHIÊN BẢN CẤU HÌNH.
namespace EVDealer.BE.Common.DTOs
{
    public class UpdateVehicleConfigDto
    {
        // Ghi chú: Tên màu sắc mới.
        public string Color { get; set; }
        // Ghi chú: Dung lượng pin cập nhật.
        public int? BatteryKwh { get; set; }
        // Ghi chú: Tầm xa di chuyển cập nhật.
        public int? RangeKm { get; set; }
    }
}