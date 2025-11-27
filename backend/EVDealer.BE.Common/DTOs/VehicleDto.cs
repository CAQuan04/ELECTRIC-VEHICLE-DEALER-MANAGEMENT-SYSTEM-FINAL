namespace EVDealer.BE.Common.DTOs;

public class VehicleListDto
{
    public int VehicleId { get; set; }
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int? Year { get; set; }
    public decimal? BasePrice { get; set; }
    public string? ImageUrl { get; set; }
    public List<VehicleConfigDto> Configs { get; set; } = new();
    public InventorySummaryDto InventorySummary { get; set; } = new();
    public string Status { get; set; }
}

public class VehicleConfigDto
{
    public int ConfigId { get; set; }
    public string Color { get; set; } = string.Empty;
    public int? BatteryKwh { get; set; }
    public int? RangeKm { get; set; }
    public string Status { get; set; }
}

public class InventorySummaryDto
{
    public int TotalQuantity { get; set; }
}

public class VehicleDetailDto
{
    public int VehicleId { get; set; }
    public string Model { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int? Year { get; set; }
    public string? ImageUrl { get; set; }
    public List<VehicleConfigDto> Configs { get; set; } = new();
    public List<InventoryDto> Inventory { get; set; } = new();
}

public class InventoryDto
{
    public int InventoryId { get; set; }
    public int VehicleId { get; set; }
    public int ConfigId { get; set; }
    public string LocationType { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public int Quantity { get; set; }
}

public class VehicleComparisonDto
{
    public List<VehicleComparisonItemDto> Vehicles { get; set; } = new();
}

public class VehicleComparisonItemDto
{
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int? Year { get; set; }
    public decimal? BasePrice { get; set; }
    public string? ImageUrl { get; set; }
    public List<VehicleConfigDto> Configs { get; set; } = new();
}
