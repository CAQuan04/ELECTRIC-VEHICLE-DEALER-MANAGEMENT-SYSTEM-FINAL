using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

/// <summary>
/// DealerInventory - Simplified inventory model for dealer stock management
/// This is a denormalized view that combines Inventory + VehicleConfig for easier dealer operations
/// </summary>
public class DealerInventory
{
    [Key]
    [Column("dealer_inventory_id")]
    public int DealerInventoryId { get; set; }

    [Required]
    [Column("vehicle_id")]
    public int VehicleId { get; set; }

    [Required]
    [Column("dealer_id")]
    public int DealerId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("color")]
    public string Color { get; set; } = null!;

    [Required]
    [Column("quantity")]
    public int Quantity { get; set; }

    [Required]
    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "Available"; // Available, Reserved, Sold

    [Column("last_restock_date")]
    public DateTime? LastRestockDate { get; set; }

    [Column("last_updated")]
    public DateTime? LastUpdated { get; set; }

    [Column("config_id")]
    public int? ConfigId { get; set; }

    // Navigation properties
    [ForeignKey("VehicleId")]
    public virtual Vehicle Vehicle { get; set; } = null!;

    [ForeignKey("DealerId")]
    public virtual Dealer Dealer { get; set; } = null!;

    [ForeignKey("ConfigId")]
    public virtual VehicleConfig? Config { get; set; }
}
