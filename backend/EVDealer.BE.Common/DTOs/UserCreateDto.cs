using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


//  Dùng để nhận dữ liệu từ Admin khi họ tạo một tài khoản mới.
namespace EVDealer.BE.Common.DTOs
{
    public class UserCreateDto
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public int RoleId { get; set; }
        public int? DealerId { get; set; } // Có thể null nếu là user của hãng
    }
}
