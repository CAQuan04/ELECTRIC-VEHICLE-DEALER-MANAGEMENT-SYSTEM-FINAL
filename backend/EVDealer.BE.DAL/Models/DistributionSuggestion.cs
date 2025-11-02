// File: DAL/Models/DistributionSuggestion.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models
{
    // Ghi chú: Bảng này lưu các đề xuất phân phối do hệ thống AI/hoạch định tạo ra.
    public class DistributionSuggestion
    {
        [Key]
        public int SuggestionId { get; set; }

        public int DealerId { get; set; }
        [ForeignKey("DealerId")]
        public virtual Dealer Dealer { get; set; }

        public int VehicleId { get; set; }
        [ForeignKey("VehicleId")]
        public virtual Vehicle Vehicle { get; set; }

        public int SuggestedQuantity { get; set; }

        // Ghi chú: Lưu lại các con số đã được dùng để tính toán ra đề xuất này.
        // Điều này giúp người quản lý hiểu tại sao hệ thống lại đề xuất con số đó.
        public int ForecastedDemand { get; set; }
        public int CurrentInventory { get; set; }
        public int SafetyStock { get; set; }

        // Ghi chú: Trạng thái của đề xuất: Pending, Approved, Rejected.
        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}