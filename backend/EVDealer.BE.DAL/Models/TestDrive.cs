using System;
using System.Collections.Generic;

namespace EVDealer.BE.DAL.Models;

public static class TestDriveStatus
{
    public const string Pending = "Pending";
    public const string Confirmed = "Confirmed";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
}

public partial class TestDrive
{
    public int TestId { get; set; }

    public int CustomerId { get; set; }

    public int VehicleId { get; set; }

    public int DealerId { get; set; }

    public DateTime ScheduleDatetime { get; set; }

    public string Status { get; set; } = null!;

    public string? Feedback { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Dealer Dealer { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}
