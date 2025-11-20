using System;

namespace EVDealer.BE.DAL.Models
{
    public class Delivery
    {
        public int DeliveryId { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; } = null!;
        public DateOnly ScheduledDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public string? TrackingNo { get; set; }
        public string? CarrierInfo { get; set; }
        public virtual SalesOrder Order { get; set; } = null!;
    }
}