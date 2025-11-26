using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class DistributionItemDto
    {
        public int VehicleId { get; set; }
        public int ConfigId { get; set; } // Thêm ConfigId
        public int Quantity { get; set; }
    }

    public class CreateDistributionFromRequestDto
    {
        // Ghi chú: Có thể dùng dealerRequestId hoặc không, tùy vào logic
        public int? DealerRequestId { get; set; }
        public int ToDealerId { get; set; } // Thêm ToDealerId
        public string FromLocation { get; set; } = "Kho Tong";
        public DateOnly ScheduledDate { get; set; }
        public List<DistributionItemDto> Items { get; set; } = new List<DistributionItemDto>();
    }
}
