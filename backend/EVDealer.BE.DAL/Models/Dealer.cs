using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Dealer
{
    public int DealerId { get; set; }

    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public int SafetyStockLevel { get; set; }

    public virtual ICollection<DemandForecast> DemandForecasts { get; set; } = new List<DemandForecast>();

    public virtual ICollection<Distribution> Distributions { get; set; } = new List<Distribution>();

    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();

    public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();

    public virtual ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
