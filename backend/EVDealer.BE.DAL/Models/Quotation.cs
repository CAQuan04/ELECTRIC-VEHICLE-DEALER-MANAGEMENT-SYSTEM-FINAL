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

    public virtual User CreatedByUser { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();

    public virtual SalesOrder? SalesOrder { get; set; }
}
