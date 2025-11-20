using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Models
{
    public partial class Region
    {
        [Key] // Đánh dấu đây là khóa chính
        public int RegionId { get; set; }

        [Required] // Bắt buộc phải có tên
        [MaxLength(100)] // Giới hạn độ dài
        public string Name { get; set; }

        // Ghi chú: Thuộc tính điều hướng ngược lại.
        // Cho EF Core biết rằng một Region có thể có nhiều Dealer.
        public virtual ICollection<Dealer> Dealers { get; set; } = new List<Dealer>();
    }
}
