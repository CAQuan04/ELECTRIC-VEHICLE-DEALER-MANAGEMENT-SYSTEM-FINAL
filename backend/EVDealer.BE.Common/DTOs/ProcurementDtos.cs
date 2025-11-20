using System;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    public class PurchaseRequestDto
    {
        public int RequestId { get; set; }
        public int DealerId { get; set; }
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PurchaseRequestCreateDto
    {
        [Required]
        public int VehicleId { get; set; }
        [Required]
        public int ConfigId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
    
    public class DistributionDto
    {
        public int DistId { get; set; }
        public string FromLocation { get; set; }
        public int ToDealerId { get; set; }
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public string Status { get; set; }
    }
}