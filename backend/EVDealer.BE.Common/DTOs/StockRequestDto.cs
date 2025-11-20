namespace EVDealer.BE.Common.DTOs;

/// <summary>
/// DTO cho yêu cầu nhập kho từ Staff
/// </summary>
public class StockRequestDto
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string ConfigName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string RequestedBy { get; set; } = string.Empty; // Staff name
    public int RequestedByUserId { get; set; }
    public DateTime RequestDate { get; set; }
    public string Priority { get; set; } = "Bình thường"; // Khẩn cấp, Cao, Bình thường, Thấp
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int DealerId { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public int? ProcessedByUserId { get; set; }
    public string? ProcessedByName { get; set; }
}

/// <summary>
/// DTO cho tạo yêu cầu nhập kho
/// </summary>
public class CreateStockRequestDto
{
    public int VehicleId { get; set; }
    public int? ConfigId { get; set; }
    public int Quantity { get; set; }
    public string Priority { get; set; } = "Bình thường";
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

/// <summary>
/// DTO cho từ chối yêu cầu
/// </summary>
public class RejectStockRequestDto
{
    public string Reason { get; set; } = string.Empty;
}
