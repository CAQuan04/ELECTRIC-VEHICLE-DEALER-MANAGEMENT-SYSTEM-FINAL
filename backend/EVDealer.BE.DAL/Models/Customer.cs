using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FullName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Address { get; set; }

    public string? IdDocumentNumber { get; set; }

    public virtual ICollection<Quotation> Quotations { get; set; } = new List<Quotation>();

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();

    public virtual ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();
}
