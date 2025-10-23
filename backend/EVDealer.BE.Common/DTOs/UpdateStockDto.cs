using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class UpdateStockDto
    {
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        // Ghi chú: Số lượng này có thể là số dương (nhập kho) hoặc số âm (xuất kho).
        public int Quantity { get; set; }
        public string LocationType { get; set; } // Ví dụ: "HQ"
        public int LocationId { get; set; } // Ví dụ: 1 (ID của kho tổng)
    }
}
