using System;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    public class PromotionDto
    {
        public int PromotionId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Status { get; set; }
    }

    public class PromotionCreateDto
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public string DiscountType { get; set; }
        [Required]
        [Range(0.01, (double)decimal.MaxValue)]
        public decimal DiscountValue { get; set; }
        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly EndDate { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class ApplyPromotionDto
    {
        [Required]
        public int PromotionId { get; set; }
    }
}