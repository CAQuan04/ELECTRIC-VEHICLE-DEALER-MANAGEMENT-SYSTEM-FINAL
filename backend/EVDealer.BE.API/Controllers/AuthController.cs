
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) => _authService = authService;

        // Endpoint: POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
        {
            var result = await _authService.LoginAsync(loginRequest);
            if (!result.IsSuccess)
            {
                // Trả về mã lỗi 401 Unauthorized nếu đăng nhập thất bại.
                return Unauthorized(result);
            }
            // Trả về mã thành công 200 OK cùng với Token.
            return Ok(result);


        }

        // File: Controllers/AuthController.cs
        [HttpGet("hash/{password}")]
        public IActionResult HashPassword(string password)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            return Ok(hashedPassword);
        }

    }

}