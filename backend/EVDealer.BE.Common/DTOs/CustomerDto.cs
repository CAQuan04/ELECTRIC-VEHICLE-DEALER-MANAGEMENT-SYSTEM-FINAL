namespace EVDealer.BE.Common.DTOs;

public class CustomerCreateDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? IdDocumentNumber { get; set; }
}

public class CustomerUpdateDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? IdDocumentNumber { get; set; }
}

public class CustomerDto
{
    public int CustomerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? IdDocumentNumber { get; set; }
    public int TotalOrders { get; set; }
    public int TotalTestDrives { get; set; }
    public int TotalQuotations { get; set; }
}
