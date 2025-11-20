using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

public partial class VehicleConfig
{
    public int ConfigId { get; set; }

    public int VehicleId { get; set; }

    public string? Color { get; set; }

    public int? BatteryKwh { get; set; }

    public int? RangeKm { get; set; }

    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Vehicle Vehicle { get; set; } = null!;
    public virtual ICollection<Distribution> Distributions { get; set; }

    public virtual ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();

    public virtual ICollection<PurchaseRequest> PurchaseRequests { get; set; } = new List<PurchaseRequest>();

    [Required]
    [Column(TypeName = "varchar(20)")]
    public string Status { get; set; }
}


#region Seed Query
//INSERT INTO[VehicleConfig] (vehicle_id, color, battery_kwh, range_km)
//VALUES
//(1, 'Red', 100, 650),
//(1, 'White', 100, 640),
//(2, 'Blue', 75, 500),
//(2, 'Black', 75, 480),
//(3, 'Gray', 88, 520),
//(4, 'Silver', 77, 580),
//(5, 'Green', 82, 560),
//(6, 'Black', 93, 600),
//(7, 'White', 77, 500),
//(8, 'Blue', 82, 540),
//(9, 'Gray', 60, 350),
//(9, 'White', 60, 340),
//(10, 'Gold', 112, 720),
//(10, 'Silver', 112, 710),
//(5, 'White', 82, 555);
#endregion