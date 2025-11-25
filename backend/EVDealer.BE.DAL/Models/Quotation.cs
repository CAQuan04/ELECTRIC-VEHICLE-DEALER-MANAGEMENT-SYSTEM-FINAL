using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Quotation
{
    public int QuotationId { get; set; }
    public int CustomerId { get; set; }
    public int CreatedByUserId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateOnly? ValidUntil { get; set; }
    public string Status { get; set; } = null!;

    // --- NEW: Các cột mới ---
    public int? DealerId { get; set; }
    public int? VehicleId { get; set; }
    public int? ConfigId { get; set; }
    public string? PaymentType { get; set; }
    public decimal? TotalBefore { get; set; }
    public decimal? TotalDiscount { get; set; }
    public decimal? TotalAfter { get; set; }
    public decimal? OnroadPrice { get; set; }
    public decimal? DownPaymentEst { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Notes { get; set; }

    // --- Navigation Properties ---
    public virtual User CreatedByUser { get; set; } = null!;
    public virtual Customer Customer { get; set; } = null!;
    public virtual SalesOrder? SalesOrder { get; set; }
    public virtual ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();

    // --- NEW: Liên kết mới ---
    public virtual Dealer? Dealer { get; set; }
    public virtual Vehicle? Vehicle { get; set; }
    public virtual VehicleConfig? Config { get; set; }
    public virtual ICollection<QuotationPromotion> QuotationPromotions { get; set; } = new List<QuotationPromotion>();
}