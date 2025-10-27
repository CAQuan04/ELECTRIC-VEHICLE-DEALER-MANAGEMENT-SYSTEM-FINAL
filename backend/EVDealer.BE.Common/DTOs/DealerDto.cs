namespace EVDealer.BE.Common.DTOs;

public class DealerCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
}

public class DealerUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
}

public class DealerDto
{
    public int DealerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public int TotalUsers { get; set; }
    public int TotalOrders { get; set; }
    public int TotalTestDrives { get; set; }
    public int TotalDemandForecasts { get; set; }
    public int TotalDistributions { get; set; }
    public int TotalPurchaseRequests { get; set; }
}
