using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO để trả về thông tin chi tiết của một chỉ tiêu.
    public class TargetDto
    {
        public int TargetId { get; set; }
        public int DealerId { get; set; }
        public DateOnly PeriodStart { get; set; }
        public DateOnly PeriodEnd { get; set; }
        public decimal SalesTarget { get; set; }
        public decimal ActualSales { get; set; }
    }
}
