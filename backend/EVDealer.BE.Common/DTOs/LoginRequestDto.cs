using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: Định nghĩa một "biểu mẫu" chuẩn để client gửi thông tin đăng nhập lên.
// Chỉ chứa những trường cần thiết, không thừa, không thiếu.
namespace EVDealer.BE.Common.DTOs
{
    public class LoginRequestDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
