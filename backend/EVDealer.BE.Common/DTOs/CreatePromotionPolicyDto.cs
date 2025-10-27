using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO để nhận dữ liệu khi EVM Staff tạo một chính sách khuyến mãi.
    public class CreatePromotionPolicyDto
    {
        public int DealerId { get; set; }
        public string Description { get; set; }
        public decimal DiscountPercent { get; set; }
        public string? Conditions { get; set; } // Dạng chuỗi JSON
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
