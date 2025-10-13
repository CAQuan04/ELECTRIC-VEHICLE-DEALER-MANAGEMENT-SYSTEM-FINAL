using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: Định nghĩa "biểu mẫu" chuẩn để server trả kết quả đăng nhập về cho client.
// Chúng ta chủ động chọn những thông tin an toàn để trả về, không trả về toàn bộ đối tượng User.
namespace EVDealer.BE.Common.DTOs
{
    public class LoginResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string Token { get; set; } // "Tấm vé" để client dùng cho các lần sau
        public string Username { get; set; }
        public string Role { get; set; } // Vai trò của người dùng
    }
}
