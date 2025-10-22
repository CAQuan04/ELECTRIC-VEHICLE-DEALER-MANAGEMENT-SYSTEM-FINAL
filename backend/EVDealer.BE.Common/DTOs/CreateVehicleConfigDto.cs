using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class CreateVehicleConfigDto
    {
        public string Color { get; set; }
        public int? BatteryKwh { get; set; }
        public int? RangeKm { get; set; }
    }
}
