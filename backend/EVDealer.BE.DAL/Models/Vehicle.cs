using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Vehicle
{
    public int VehicleId { get; set; }

    public string Model { get; set; } = null!;

    public string Brand { get; set; } = null!;

    public int? Year { get; set; }

    public decimal? BasePrice { get; set; }

    public virtual ICollection<DemandForecast> DemandForecasts { get; set; } = new List<DemandForecast>();

    public virtual ICollection<Distribution> Distributions { get; set; } = new List<Distribution>();

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();

    public virtual ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();

    public virtual ICollection<VehicleConfig> VehicleConfigs { get; set; } = new List<VehicleConfig>();
}
