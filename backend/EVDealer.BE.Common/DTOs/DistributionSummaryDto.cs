using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class DistributionSummaryDto
    {
        public int DistId { get; set; }
        public string VehicleName { get; set; }
        public string ConfigName { get; set; }
        public int Quantity { get; set; }
        public string FromLocation { get; set; }
        public int ToDealerId { get; set; }
        public string ToDealerName { get; set; }
        public DateOnly ScheduledDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public string Status { get; set; }
    }
}
