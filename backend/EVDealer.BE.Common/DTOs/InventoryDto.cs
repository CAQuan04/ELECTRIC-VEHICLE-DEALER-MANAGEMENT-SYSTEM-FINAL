namespace EVDealer.BE.Common.DTOs;

/// <summary>
/// DTO cho thông tin kho xe của dealer
/// </summary>
public class DealerInventoryDto
{
    public int InventoryId { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal BasePrice { get; set; }
    public string Status { get; set; } = "Available"; // Available, Reserved, Sold
    public int DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public DateTime? LastUpdated { get; set; }
}

/// <summary>
/// DTO cho chi tiết kho xe
/// </summary>
public class DealerInventoryDetailDto
{
    public int InventoryId { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public int ReservedQuantity { get; set; }
    public int SoldQuantity { get; set; }
    public decimal BasePrice { get; set; }
    public int DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public List<string> VehicleImages { get; set; } = new();
    public string Specifications { get; set; } = string.Empty;
    public DateTime? LastRestockDate { get; set; }
}

/// <summary>
/// DTO cho cập nhật kho
/// </summary>
public class UpdateInventoryDto
{
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
