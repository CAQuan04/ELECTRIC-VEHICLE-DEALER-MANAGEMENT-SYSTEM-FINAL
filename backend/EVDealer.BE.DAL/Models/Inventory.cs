using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public int VehicleId { get; set; }

    public int ConfigId { get; set; }

    public string LocationType { get; set; } = null!;

    public int LocationId { get; set; }

    public int Quantity { get; set; }

    public virtual VehicleConfig Config { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}
