using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public partial class DemandForecast
{
    public int ForecastId { get; set; }

    public int VehicleId { get; set; }

    public int? DealerId { get; set; }

    public DateOnly ForecastPeriodStart { get; set; }

    public DateOnly ForecastPeriodEnd { get; set; }

    public int PredictedQuantity { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Dealer? Dealer { get; set; }

    public virtual Vehicle Vehicle { get; set; } = null!;
}
