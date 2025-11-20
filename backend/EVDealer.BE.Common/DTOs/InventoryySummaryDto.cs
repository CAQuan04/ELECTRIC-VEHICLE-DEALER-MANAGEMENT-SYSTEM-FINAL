using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class InventoryySummaryDto
    {
        public int InventoryId { get; set; }
        public string VehicleName { get; set; }
        public string ConfigName { get; set; }
        public string LocationType { get; set; }
        public string LocationName { get; set; }
        public int Quantity { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
