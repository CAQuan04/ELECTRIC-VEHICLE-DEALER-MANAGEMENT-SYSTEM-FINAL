// Ghi chú: File này là bản thiết kế cho bảng DealerContract trong CSDL.
// Mỗi thuộc tính tương ứng với một cột trong bảng.
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models
{
    // Ghi chú: [Table("DealerContract")] chỉ định rõ ràng tên của bảng trong CSDL.
    [Table("DealerContract")]
    public class DealerContract
    {
        // Ghi chú: [Key] đánh dấu đây là khóa chính.
        [Key]
        [Column("contract_id")] // Ghi chú: Ánh xạ tới cột có tên 'contract_id'.
        public int ContractId { get; set; }

        [Column("dealer_id")]
        public int DealerId { get; set; }

        [Column("start_date")]
        public DateOnly StartDate { get; set; }

        [Column("end_date")]
        public DateOnly EndDate { get; set; }

        [Column("terms")]
        public string? Terms { get; set; }

        [Column("status")]
        [StringLength(20)] // Ghi chú: Giới hạn độ dài chuỗi, tương ứng với VARCHAR(20).
        public string Status { get; set; }

        // Ghi chú: [ForeignKey("DealerId")] thiết lập mối quan hệ khóa ngoại.
        // Điều này giúp EF Core hiểu rằng DealerContract này thuộc về một Dealer.
        [ForeignKey("DealerId")]
        public virtual Dealer Dealer { get; set; }
    }
}