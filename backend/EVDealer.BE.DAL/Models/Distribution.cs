using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class Distribution
{
    public int DistId { get; set; }

    public string? FromLocation { get; set; }

    public int ToDealerId { get; set; }

    public int VehicleId { get; set; }
    public int ConfigId { get; set; }

    public int Quantity { get; set; }

    public DateOnly? ScheduledDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual Dealer ToDealer { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
    public virtual VehicleConfig Config { get; set; } = null!;
}
