using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class SalesOrder
{
    public int OrderId { get; set; }

    public int? QuotationId { get; set; }

    public int CustomerId { get; set; }

    public int DealerId { get; set; }

    public decimal TotalAmount { get; set; }

    public DateOnly OrderDate { get; set; }

    public string Status { get; set; } = null!;

    public int? ApprovedBy { get; set; }

    public virtual User? ApprovedByNavigation { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Dealer Dealer { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Quotation? Quotation { get; set; }
}
