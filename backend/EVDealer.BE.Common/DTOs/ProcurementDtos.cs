using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // Bắt buộc có để dùng JsonPropertyName

namespace EVDealer.BE.Common.DTOs
{
    // --- DTO HIỆN TẠI (Output ra ngoài) ---
    public class PurchaseRequestDto
    {
        public int RequestId { get; set; }
        public int DealerId { get; set; }
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Notes { get; set; }
    }

    // --- DTO TẠO MỚI (Dùng cho Service nội bộ) ---
    public class PurchaseRequestCreateDto
    {
        [Required]
        public int VehicleId { get; set; }
        [Required]
        public int ConfigId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        public string? Notes { get; set; }
    }

    // --- DTO HỨNG JSON TỪ FRONTEND (Bulk Create) ---
    public class BulkPurchaseRequestInputDto
    {
        public int DealerId { get; set; }

        public string? Note { get; set; }

        public List<PurchaseRequestItemInputDto> Items { get; set; } = new();
    }

    public class PurchaseRequestItemInputDto
    {
        public int VehicleId { get; set; }

        public int Quantity { get; set; }

        [JsonPropertyName("config_id")]
        public int ConfigId { get; set; }
    }

    // --- DTO CHO DISTRIBUTION (Nếu có dùng) ---
    public class DistributionDto
    {
        public int DistId { get; set; }
        public string FromLocation { get; set; }
        public int ToDealerId { get; set; }
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public DateOnly? ScheduledDate { get; set; }
        public string Status { get; set; }
    }

    // --- DTO GỬI HÃNG (Fix lỗi thiếu class này) ---
    public class SendToEVMDto
    {
        public string ManagerPassword { get; set; } = null!;
    }
}
