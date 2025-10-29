using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class SetWholesalePriceDto
    {
        public int ProductId { get; set; } // Là VehicleId
        public int? DealerId { get; set; } // Nullable, nếu null là giá chung
        public decimal Price { get; set; }
        public DateOnly ValidFrom { get; set; }
        public DateOnly ValidTo { get; set; }
    }
}
