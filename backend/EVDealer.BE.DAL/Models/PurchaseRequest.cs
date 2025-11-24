using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models;

public partial class PurchaseRequest
{
    [Key]
    [Column("request_id")]
    public int RequestId { get; set; }

    [Required]
    [Column("dealer_id")]
    public int DealerId { get; set; }

    [Required]
    [Column("vehicle_id")]
    public int VehicleId { get; set; }

    [Required]
    [Column("config_id")]
    public int ConfigId { get; set; }

    [Required]
    [Column("quantity")]
    public int Quantity { get; set; }

    [Required]
    [StringLength(20)]
    [Column("status")]
    public string Status { get; set; } = "Pending";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("requested_by_user_id")]
    public int? RequestedByUserId { get; set; }

    [StringLength(20)]
    [Column("priority")]
    public string? Priority { get; set; }

    [Column("notes", TypeName = "nvarchar(MAX)")]
    public string? Notes { get; set; }

    [Column("source_stock_request_id")]
    public int? SourceStockRequestId { get; set; }

    [Column("sent_to_evm_date")]
    public DateTime? SentToEVMDate { get; set; }

    [Column("evm_order_id")]
    public string? EVMOrderId { get; set; }

    [Column("completed_date")]
    public DateTime? CompletedDate { get; set; }

    // Navigation properties
    [ForeignKey("DealerId")]
    public virtual Dealer Dealer { get; set; } = null!;

    [ForeignKey("VehicleId")]
    public virtual Vehicle Vehicle { get; set; } = null!;
    
    [ForeignKey("ConfigId")]
    public virtual VehicleConfig Config { get; set; } = null!;

    [ForeignKey("RequestedByUserId")]
    public virtual User? RequestedBy { get; set; }

    [ForeignKey("SourceStockRequestId")]
    public virtual StockRequest? SourceStockRequest { get; set; }
    [Column("order_id")]
    public int? OrderId { get; set; }

    [Column("remaining_qty")]
    public int? RemainingQty { get; set; }
    // --- NEW Navigation ---
    [ForeignKey("OrderId")]
    public virtual SalesOrder? Order { get; set; }
}
