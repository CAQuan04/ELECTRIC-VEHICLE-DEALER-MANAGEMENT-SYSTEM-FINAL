using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class CreateVehicleDto
    {
        public string Model { get; set; }
        public string Brand { get; set; }
        public int? Year { get; set; }
        public decimal? BasePrice { get; set; }
        public string? ImageUrl { get; set; }
    }
}
