// Ghi chú: Controller này là "cửa ra vào" cho các chức năng xác thực.
// Nó chỉ làm nhiệm vụ nhận yêu cầu HTTP và chuyển cho AuthService, không tự xử lý logic.

using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Auth;
using Microsoft.AspNetCore.Authorization;
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

        //[HttpGet("hash/{password}")]
        //public IActionResult HashPassword(string password)
        //{
        //    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        //    return Ok(hashedPassword);
        //}
    }
}

// Ghi chú: Controller này chứa các API yêu cầu phải đăng nhập và có quyền hạn cụ thể.

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        // Ghi chú: [Authorize] là "chốt bảo vệ". Bất kỳ request nào đến đây
        // mà không có JWT Token hợp lệ trong Header sẽ bị chặn với lỗi 401.
        [HttpGet("general-stats")]
        [Authorize]
        public IActionResult GetGeneralStats()
        {
            // Chỉ cần đăng nhập là có thể vào đây.
            return Ok("Đây là dữ liệu thống kê chung cho tất cả người dùng đã đăng nhập.");
        }

        // Ghi chú: [Authorize(Roles = "Admin")] là "chốt bảo vệ cấp cao".
        // Yêu cầu Token không chỉ hợp lệ, mà còn phải chứa claim Role="Admin".
        // Nếu một DealerManager cố gắng truy cập, họ sẽ nhận lỗi 403 Forbidden (Bị cấm).
        [HttpGet("admin-only-data")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAdminOnlyData()
        {
            // Chỉ Admin mới có thể vào đây.
            return Ok("Đây là dữ liệu siêu bí mật chỉ dành cho Admin.");
        }
    }
}