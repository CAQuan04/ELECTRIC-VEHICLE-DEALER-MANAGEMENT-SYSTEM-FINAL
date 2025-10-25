namespace EVDealer.BE.Common.DTOs;

public class TestDriveCreateDto
{
    public int CustomerId { get; set; }
    public int VehicleId { get; set; }
    public int DealerId { get; set; }
    public DateTime ScheduleDatetime { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class TestDriveUpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? Feedback { get; set; }
}

public class TestDriveDto
{
    public int TestId { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int VehicleId { get; set; }
    public string VehicleModel { get; set; } = string.Empty;
    public string VehicleBrand { get; set; } = string.Empty;
    public int DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public DateTime ScheduleDatetime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Feedback { get; set; }
}
