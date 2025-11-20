
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Ghi chú: Áp dụng [Authorize] cho toàn bộ Controller.
    // Mọi endpoint trong đây đều yêu cầu phải có Token hợp lệ.
    [Authorize]
    public class DashboardController : ControllerBase
    {
        // Ghi chú: API này để lấy thông tin cơ bản của người dùng đang đăng nhập.
        // Bất kỳ ai đăng nhập cũng có thể gọi.
        // URL: GET /api/dashboard/user-info
        [HttpGet("user-info")]
        public IActionResult GetUserInfo()
        {
            // Ghi chú: Sau khi được xác thực, thông tin từ Token sẽ được lưu trong đối tượng `User`.
            // Chúng ta có thể đọc các claim từ đó một cách an toàn để cá nhân hóa trải nghiệm.
            var username = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var dealerId = User.FindFirstValue("dealerId"); // Lấy dealerId (nếu có)

            return Ok(new
            {
                Message = $"Xin chào {username}!",
                YourRole = role,
                YourDealerId = dealerId ?? "N/A (Tài khoản của hãng)" // Hiển thị thông tin tương ứng
            });
        }
        // Ghi chú: Endpoint này được bảo vệ bởi chính sách "CanViewDashboardStats".
        // Bất kỳ vai trò nào, miễn là được gán quyền "ViewDashboardStats" thì đều có thể truy cập.
        // Điều này linh hoạt hơn nhiều so với việc chỉ cho phép "Admin".
        // URL: GET /api/dashboard/stats
        [HttpGet("stats")]
        [Authorize]
        public IActionResult GetDashboardStats()
        {
            return Ok("Đây là dữ liệu thống kê trên Dashboard. Bạn đã được xác thực có quyền xem nó!");
        }
    }
}