using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class CreateDistributionDto
    {
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public string FromLocation { get; set; } // Ví dụ: "Kho Tổng Hà Nội"
        public int ToDealerId { get; set; } // ID của đại lý sẽ nhận hàng
        // Ghi chú: Sử dụng DateOnly? vì ngày giao hàng có thể có hoặc không (nullable).
        public DateOnly? ScheduledDate { get; set; }
    }
}
