using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

public class StockRequest
{
    [Key]
    [Column("stock_request_id")]
    public int StockRequestId { get; set; }

    [Required]
    [Column("vehicle_id")]
    public int VehicleId { get; set; }

    [Column("config_id")]
    public int? ConfigId { get; set; }

    [Required]
    [Column("quantity")]
    public int Quantity { get; set; }

    [Required]
    [Column("dealer_id")]
    public int DealerId { get; set; }

    [Required]
    [Column("requested_by_user_id")]
    public int RequestedByUserId { get; set; }

    [Required]
    [Column("request_date")]
    public DateTime RequestDate { get; set; }

    [Required]
    [StringLength(20)]
    [Column("priority")]
    public string Priority { get; set; } = "Normal"; // Khẩn cấp, Cao, Bình thường, Thấp

    [Required]
    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

    [Required]
    [Column("reason", TypeName = "nvarchar(500)")]
    public string Reason { get; set; } = null!;

    [Column("notes", TypeName = "nvarchar(MAX)")]
    public string? Notes { get; set; }

    [Column("rejection_reason", TypeName = "nvarchar(500)")]
    public string? RejectionReason { get; set; }

    [Column("processed_date")]
    public DateTime? ProcessedDate { get; set; }

    [Column("processed_by_user_id")]
    public int? ProcessedByUserId { get; set; }

    // Navigation properties
    [ForeignKey("VehicleId")]
    public virtual Vehicle Vehicle { get; set; } = null!;

    [ForeignKey("ConfigId")]
    public virtual VehicleConfig? Config { get; set; }

    [ForeignKey("DealerId")]
    public virtual Dealer Dealer { get; set; } = null!;

    [ForeignKey("RequestedByUserId")]
    public virtual User RequestedBy { get; set; } = null!;

    [ForeignKey("ProcessedByUserId")]
    public virtual User? ProcessedBy { get; set; }
}
