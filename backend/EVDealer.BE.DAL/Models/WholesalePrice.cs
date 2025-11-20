using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Models
{
    public class WholesalePrice
    {
        [Key] // Đánh dấu đây là khóa chính
        [Column("price_id")] // Ánh xạ đến tên cột trong CSDL
        public int PriceId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; } // Trong trường hợp này là VehicleId 

        // Ghi chú: dealer_id có thể NULL, cho biết đây là giá sỉ áp dụng chung.
        // Dấu ? cho biết thuộc tính này là nullable.
        [Column("dealer_id")]
        public int? DealerId { get; set; }

        [Column("price", TypeName = "decimal(18, 2)")] // Định nghĩa kiểu dữ liệu và độ chính xác
        public decimal Price { get; set; }

        [Column("valid_from")]
        public DateOnly ValidFrom { get; set; }

        [Column("valid_to")]
        public DateOnly ValidTo { get; set; }

        // === Navigation Properties ===
        // Ghi chú: Các thuộc tính này giúp EF Core hiểu mối quan hệ giữa các bảng.
        [ForeignKey("ProductId")]
        public virtual Vehicle Product { get; set; }

        [ForeignKey("DealerId")]
        public virtual Dealer? Dealer { get; set; }
    }
}
