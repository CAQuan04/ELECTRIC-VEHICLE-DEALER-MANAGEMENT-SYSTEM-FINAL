using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

public partial class Vehicle
{
    public int VehicleId { get; set; }

    public string Model { get; set; } = null!;

    public string Brand { get; set; } = null!;

    public int? Year { get; set; }


    public virtual ICollection<WholesalePrice> WholesalePrices { get; set; } = new List<WholesalePrice>();
    public decimal? BasePrice { get; set; }

    public virtual ICollection<DemandForecast> DemandForecasts { get; set; } = new List<DemandForecast>();

    public virtual ICollection<Distribution> Distributions { get; set; } = new List<Distribution>();

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();

    public virtual ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();

    public virtual ICollection<VehicleConfig> VehicleConfigs { get; set; } = new List<VehicleConfig>();

    public virtual ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();
    // === PHẦN BỔ SUNG: THÊM THUỘC TÍNH LƯU LINK HÌNH ẢNH ===
    // Ghi chú: Chúng ta sẽ lưu URL của hình ảnh dưới dạng một chuỗi.
    // Dấu '?' cho biết thuộc tính này có thể là null (không bắt buộc phải có hình ảnh).
    [Column(TypeName = "nvarchar(MAX)")] // Chỉ định kiểu dữ liệu trong SQL Server là nvarchar(MAX)
    public string? ImageUrl { get; set; }

    [Required]
    [Column(TypeName = "varchar(20)")] // <-- Thử thêm attribute này để rõ ràng hơn
    public string Status { get; set; }
}

#region Seed Query
//INSERT INTO[Vehicle] (model, brand, year, base_price)
//VALUES
//('Model S', 'Tesla', 2024, 89999),
//('Model 3', 'Tesla', 2024, 49999),
//('Mustang Mach-E', 'Ford', 2023, 55999),
//('Ioniq 6', 'Hyundai', 2024, 46999),
//('EV6', 'Kia', 2024, 47999),
//('e-tron GT', 'Audi', 2024, 99999),
//('ID.4', 'Volkswagen', 2023, 43999),
//('XC40 Recharge', 'Volvo', 2024, 51999),
//('Leaf', 'Nissan', 2023, 29999),
//('Air Pure', 'Lucid', 2024, 89999);
#endregion