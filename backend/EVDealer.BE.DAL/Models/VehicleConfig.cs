using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class VehicleConfig
{
    public int ConfigId { get; set; }

    public int VehicleId { get; set; }

    public string? Color { get; set; }

    public int? BatteryKwh { get; set; }

    public int? RangeKm { get; set; }

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Vehicle Vehicle { get; set; } = null!;
}
