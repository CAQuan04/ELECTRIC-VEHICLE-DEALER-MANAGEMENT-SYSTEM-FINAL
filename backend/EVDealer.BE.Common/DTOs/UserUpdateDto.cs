using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Dùng để nhận dữ liệu khi Admin cập nhật thông tin vai trò/đại lý của user.
namespace EVDealer.BE.Common.DTOs
{
    public class UserUpdateDto
    {
        public int RoleId { get; set; }
        public int? DealerId { get; set; }
    }
}