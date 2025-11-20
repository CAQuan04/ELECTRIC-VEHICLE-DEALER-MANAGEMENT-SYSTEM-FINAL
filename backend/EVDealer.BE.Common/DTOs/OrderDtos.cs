using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    public class OrderCreateDto
    {
        [Required]
        public int QuotationId { get; set; }
    }

    public class OrderApproveDto
    {
        [Required]
        public string Status { get; set; }
        public string? ApprovalNote { get; set; }
    }
    
    public class OrderItemDto
    {
        public int VehicleId { get; set; }
        public int ConfigId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class SalesOrderContractDto
    {
        public int ContractId { get; set; }
        public DateTime ContractDate { get; set; }
        public string Status { get; set; }
        public string Terms { get; set; }
    }

    public class OrderDto
    {
        public int OrderId { get; set; }
        public int? QuotationId { get; set; }
        public int CustomerId { get; set; }
        public int DealerId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateOnly OrderDate { get; set; }
        public string Status { get; set; }
        public int? ApprovedBy { get; set; }
        public string? ApprovalNote { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public SalesOrderContractDto? Contract { get; set; }
    }
}