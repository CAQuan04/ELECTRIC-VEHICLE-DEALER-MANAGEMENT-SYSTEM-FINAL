// Ghi chú: Đây là nơi chứa toàn bộ "não bộ" của chức năng đăng nhập.
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EVDealer.BE.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        // Yêu cầu hệ thống cung cấp Repository để lấy dữ liệu và Configuration để đọc JWT key.
        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequest)
        {
            // Bước 1 của luồng nghiệp vụ: Yêu cầu DAL tìm người dùng.
            var user = await _userRepository.GetByUsernameAsync(loginRequest.Username);

            // Bước 2: Xử lý quy tắc nghiệp vụ - "User phải tồn tại VÀ mật khẩu phải đúng".
            // BCrypt.Verify là hàm so sánh mật khẩu thô với chuỗi đã được băm.
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                return new LoginResponseDto { IsSuccess = false, Message = "Tài khoản hoặc mật khẩu không đúng." };
            }

            // Bước 3: Xử lý quy tắc nghiệp vụ - "Nếu đăng nhập đúng, tạo một 'tấm vé' (JWT Token)".
            var token = GenerateJwtToken(user);

            // Bước 4: Chuẩn bị "biểu mẫu" DTO để trả về kết quả thành công.
            return new LoginResponseDto
            {
                IsSuccess = true,
                Message = "Đăng nhập thành công!",
                Token = token,
                Username = user.Username,
                Role = user.Role.RoleName
            };
        }

        // Hàm nội bộ để tạo JWT Token
        private string GenerateJwtToken(User user)
        {
            // Ghi chú: Token chứa các thông tin (claims) về người dùng và được ký bằng một khóa bí mật.
            // Điều này đảm bảo Token không thể bị giả mạo.
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Các "claim" là thông tin chúng ta muốn gửi gắm trong token.
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("userId", user.UserId.ToString()),
                // Quan trọng: Thêm vai trò của người dùng vào token để dùng cho việc phân quyền sau này.
                new Claim(ClaimTypes.Role, user.Role.RoleName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24), // Token có hiệu lực trong 24 giờ
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}