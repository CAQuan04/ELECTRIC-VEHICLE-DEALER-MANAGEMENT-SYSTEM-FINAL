using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO này dùng để hiển thị danh sách chính sách khuyến mãi.
    public class PromotionPolicySummaryDto
    {
        public int PolicyId { get; set; }
        public int DealerId { get; set; }
        public string DealerName { get; set; } // Tên đại lý
        public string Description { get; set; }
        public decimal DiscountPercent { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
