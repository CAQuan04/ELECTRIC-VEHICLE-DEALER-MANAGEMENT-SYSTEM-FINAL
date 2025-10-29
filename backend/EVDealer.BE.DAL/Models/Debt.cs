// Ghi chú: File này là bản thiết kế cho bảng Debt.
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models
{
    [Table("Debt")]
    public class Debt
    {
        [Key]
        [Column("debt_id")]
        public int DebtId { get; set; }

        [Column("dealer_id")]
        public int DealerId { get; set; }

        [Column("amount_due", TypeName = "decimal(18, 2)")]
        public decimal AmountDue { get; set; }

        [Column("due_date")]
        public DateOnly DueDate { get; set; }

        [Column("status")]
        [StringLength(20)]
        public string Status { get; set; }

        [ForeignKey("DealerId")]
        public virtual Dealer Dealer { get; set; }
    }
}