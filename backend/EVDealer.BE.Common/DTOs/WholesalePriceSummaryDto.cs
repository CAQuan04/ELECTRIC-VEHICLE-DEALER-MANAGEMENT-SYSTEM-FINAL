using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO này dùng để hiển thị danh sách giá sỉ một cách đầy đủ thông tin.
    public class WholesalePriceSummaryDto
    {
        public int PriceId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } // Tên sản phẩm (xe)
        public int? DealerId { get; set; }
        public string? DealerName { get; set; } // Tên đại lý
        public decimal Price { get; set; }
        public DateOnly ValidFrom { get; set; }
        public DateOnly ValidTo { get; set; }
    }
}
