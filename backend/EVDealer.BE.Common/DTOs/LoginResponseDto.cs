using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


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
