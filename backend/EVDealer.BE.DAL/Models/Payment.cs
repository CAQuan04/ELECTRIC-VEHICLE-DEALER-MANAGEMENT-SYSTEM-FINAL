using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public decimal Amount { get; set; }

    public string Method { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual SalesOrder Order { get; set; } = null!;
}
