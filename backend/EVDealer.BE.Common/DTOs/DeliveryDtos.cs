using System;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    public class DeliveryDto
    {
        public int DeliveryId { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateOnly ScheduledDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public string? TrackingNo { get; set; }
        public string? CarrierInfo { get; set; }
    }

    public class DeliveryScheduleDto
    {
        [Required]
        public int OrderId { get; set; }
        [Required]
        public DateOnly ScheduledDate { get; set; }
        public string? CarrierInfo { get; set; }
    }

    public class DeliveryUpdateDto
    {
        [Required]
        public string Status { get; set; }
        public DateOnly? ActualDate { get; set; }
        public string? TrackingNo { get; set; }
    }
}