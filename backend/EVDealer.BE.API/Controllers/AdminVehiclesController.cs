using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers
{
    // Ghi chú: Đặt một route riêng, ví dụ /api/admin/vehicles để phân biệt rõ ràng.
    [Route("api/admin/vehicles")]
    [ApiController]
    // Ghi chú: Bảo vệ toàn bộ Controller bằng Policy 'CanManageVehicles'.
    [Authorize(Policy = "CanManageVehicles")]
    public class AdminVehiclesController : ControllerBase
    {
        // Ghi chú: Yêu cầu hệ thống cung cấp Service dành cho Admin.
        private readonly IVehicleAdminService _vehicleAdminService;

        public AdminVehiclesController(IVehicleAdminService vehicleAdminService)
        {
            _vehicleAdminService = vehicleAdminService;
        }

        // Endpoint: POST /api/admin/vehicles
        // Ghi chú: Tạo một mẫu xe mới.
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto createVehicleDto)
        {
            var newVehicle = await _vehicleAdminService.CreateVehicleAsync(createVehicleDto);
            return CreatedAtAction(nameof(CreateVehicle), new { id = newVehicle.VehicleId }, newVehicle);
        }

        // Endpoint: POST /api/admin/vehicles/{vehicleId}/configs
        // Ghi chú: Thêm một phiên bản/cấu hình mới cho một xe đã có.
        [HttpPost("{vehicleId}/configs")]
        public async Task<IActionResult> AddConfig(int vehicleId, [FromBody] CreateVehicleConfigDto createConfigDto)
        {
            var newConfig = await _vehicleAdminService.AddConfigToVehicleAsync(vehicleId, createConfigDto);
            if (newConfig == null)
            {
                return NotFound($"Không tìm thấy xe với ID = {vehicleId}.");
            }
            return Ok(newConfig);
        }
    }
}