// Ghi chú: File này là bản thiết kế cho bảng DealerTarget.
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models
{
    [Table("DealerTarget")]
    public class DealerTarget
    {
        [Key]
        [Column("target_id")]
        public int TargetId { get; set; }

        [Column("dealer_id")]
        public int DealerId { get; set; }

        [Column("period_start")]
        public DateOnly PeriodStart { get; set; }

        [Column("period_end")]
        public DateOnly PeriodEnd { get; set; }

        // Ghi chú: [Column(TypeName = "...")] chỉ định rõ ràng kiểu dữ liệu trong SQL Server.
        // Điều này rất quan trọng để đảm bảo độ chính xác cho các con số tài chính.
        [Column("sales_target", TypeName = "decimal(18, 2)")]
        public decimal SalesTarget { get; set; }

        [Column("actual_sales", TypeName = "decimal(18, 2)")]
        public decimal? ActualSales { get; set; }

        [ForeignKey("DealerId")]
        public virtual Dealer Dealer { get; set; }
    }
}