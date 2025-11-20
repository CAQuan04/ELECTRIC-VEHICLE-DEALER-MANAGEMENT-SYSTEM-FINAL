using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class PurchaseRequest
{
    public int RequestId { get; set; }

    public int DealerId { get; set; }

    public int VehicleId { get; set; }

    public int ConfigId { get; set; }

    public int Quantity { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Dealer Dealer { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
    
    public virtual VehicleConfig Config { get; set; } = null!;
}
