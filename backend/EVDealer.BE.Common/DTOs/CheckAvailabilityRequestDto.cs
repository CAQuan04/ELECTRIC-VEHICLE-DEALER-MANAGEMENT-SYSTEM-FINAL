using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class CheckAvailabilityRequestDto
    {
        public int VehicleId { get; set; }
        public DateTime Date { get; set; }
    }
}