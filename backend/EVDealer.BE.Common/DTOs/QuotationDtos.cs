using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    public class QuotationItemDto
    {
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    // ✅ DTO trả về (Output)
    public class QuotationDto
    {
        public int QuotationId { get; set; }
        public int CustomerId { get; set; }
        public int CreatedByUserId { get; set; }
        public int? DealerId { get; set; } // Thêm mới

        public decimal TotalAmount { get; set; }
        public decimal? TotalDiscount { get; set; } // Thêm mới

        public DateOnly? ValidUntil { get; set; }

        public string Status { get; set; } = null!; // Khởi tạo null! để tránh CS8618

        public DateTime CreatedAt { get; set; }

        public string? PaymentType { get; set; } // Thêm mới
        public string? Notes { get; set; }       // Thêm mới

        public List<QuotationItemDto> Items { get; set; } = new List<QuotationItemDto>();
    }

    public class QuotationItemCreateDto
    {
        [Required]
        public int VehicleId { get; set; }
        [Required]
        public int ConfigId { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        [Required]
        [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
        public decimal UnitPrice { get; set; }
    }

    // ✅ DTO Tạo mới (Input)
    public class QuotationCreateDto
    {
        public int DealerId { get; set; } // Thêm mới

        [Required]
        public int CustomerId { get; set; }

        public DateOnly? ValidUntil { get; set; }

        // Các trường bổ sung từ FE
        public int? PromotionId { get; set; }
        public decimal Discount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? BatteryPolicy { get; set; }
        public string? Notes { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Quotation must have at least one item.")]
        public List<QuotationItemCreateDto> Items { get; set; } = new List<QuotationItemCreateDto>();

        // Hứng mảng option IDs
        public List<int>? Options { get; set; }

        // Hứng object services
        public Dictionary<string, string>? Services { get; set; }
    }

    public class QuotationUpdateDto
    {
        public DateOnly? ValidUntil { get; set; }
        public string? Status { get; set; }
        public List<QuotationItemCreateDto>? Items { get; set; }
    }
}