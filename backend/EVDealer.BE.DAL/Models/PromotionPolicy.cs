using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Models
{
    public class PromotionPolicy
    {
        [Key]
        [Column("policy_id")]
        public int PolicyId { get; set; }

        [Column("dealer_id")]
        public int DealerId { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("discount_percent", TypeName = "decimal(5, 2)")]
        public decimal DiscountPercent { get; set; }

        // Ghi chú: Lưu các điều kiện phức tạp dưới dạng chuỗi JSON.
        // Ví dụ: '{"min_quantity": 10, "product_category": "SUV"}'
        [Column("conditions")]
        public string? Conditions { get; set; }

        [Column("start_date")]
        public DateOnly StartDate { get; set; }

        [Column("end_date")]
        public DateOnly EndDate { get; set; }

        // === Navigation Property ===
        [ForeignKey("DealerId")]
        public virtual Dealer Dealer { get; set; }
    }
}
