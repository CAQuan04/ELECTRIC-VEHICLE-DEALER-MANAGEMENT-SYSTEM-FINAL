using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs;

public class QuotationItemDto
{
    public int VehicleId { get; set; }
    public int ConfigId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class QuotationDto
{
    public int QuotationId { get; set; }
    public int CustomerId { get; set; }
    public int CreatedByUserId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateOnly? ValidUntil { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
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

public class QuotationCreateDto
{
    [Required]
    public int CustomerId { get; set; }
    public DateOnly? ValidUntil { get; set; }
    [Required]
    [MinLength(1, ErrorMessage = "Quotation must have at least one item.")]
    public List<QuotationItemCreateDto> Items { get; set; } = new List<QuotationItemCreateDto>();
}