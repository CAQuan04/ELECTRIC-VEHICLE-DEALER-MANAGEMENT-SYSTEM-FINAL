// Ghi chú: Đây là nơi chứa toàn bộ "não bộ" của chức năng đăng nhập.
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
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
            // Bước 1: Yêu cầu DAL tìm người dùng (câu lệnh này đã được tối ưu để lấy đủ Role và Permissions).
            var user = await _userRepository.GetByUsernameAsync(loginRequest.Username);

            // Bước 2: Xử lý quy tắc nghiệp vụ - "User phải tồn tại VÀ mật khẩu phải đúng".
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                return new LoginResponseDto { IsSuccess = false, Message = "Tài khoản hoặc mật khẩu không đúng." };
            }

            // Bước 3: Tạo một "Tấm Thẻ Bài" (JWT Token) hoàn chỉnh chứa đủ quyền hạn.
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

        // ===================================================================================
        // === PHẦN ĐÃ HOÀN CHỈNH: TẠO TOKEN LINH HOẠT VÀ ĐẦY ĐỦ THÔNG TIN ===
        // ===================================================================================
        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Ghi chú: Bắt đầu tạo một danh sách các claims (thông tin).
            // Sử dụng List<Claim> để có thể thêm các claim một cách linh hoạt.
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.RoleName)
            };

            // Ghi chú: Thêm claim "dealerId" nếu người dùng này thuộc về một đại lý.
            // Claim này cực kỳ quan trọng để lọc dữ liệu sau này.
            if (user.DealerId.HasValue)
            {
                claims.Add(new Claim("dealerId", user.DealerId.Value.ToString()));
            }

            //Ghi chú: Duyệt qua danh sách các quyền của vai trò người dùng
            //và thêm mỗi quyền như một claim riêng biệt có type là "permission".
            if (user.Role?.RolePermissions != null)
            {
                foreach (var rolePermission in user.Role.RolePermissions)
                {
                    if (rolePermission.Permission != null)
                    {
                        claims.Add(new Claim("permission", rolePermission.Permission.PermissionName));
                    }
                }
            }



            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims, // Sử dụng danh sách claims đã được mở rộng
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}