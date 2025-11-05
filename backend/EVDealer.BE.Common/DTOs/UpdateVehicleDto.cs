using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


// Ghi chú: DTO này định nghĩa các trường thông tin được phép cập nhật cho một MẪU XE.
// Việc dùng DTO riêng giúp kiểm soát, ví dụ: không cho phép client sửa VehicleId.
namespace EVDealer.BE.Common.DTOs
{
    public class UpdateVehicleDto
    {
        // Ghi chú: Tên model mới của xe.
        public string Model { get; set; }
        // Ghi chú: Tên thương hiệu mới.
        public string Brand { get; set; }
        // Ghi chú: Năm sản xuất cập nhật.
        public int? Year { get; set; }
        // Ghi chú: Giá cơ bản cập nhật.
        public decimal? BasePrice { get; set; }

        public string? ImageUrl { get; set; }
    }
}
