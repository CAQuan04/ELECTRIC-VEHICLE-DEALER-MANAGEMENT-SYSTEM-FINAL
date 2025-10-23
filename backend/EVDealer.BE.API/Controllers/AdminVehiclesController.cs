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
        // GHI CHÚ: BỔ SUNG ENDPOINT GET
        // Endpoint: GET /api/admin/vehicles
        // Ghi chú: Dùng để lấy TOÀN BỘ danh sách xe (cả Active và Inactive) cho Admin quản lý.
        [HttpGet]
        public async Task<IActionResult> GetAllVehiclesForAdmin()
        {
            // 1. Gọi xuống Service của Admin.
            var vehicles = await _vehicleAdminService.GetAllVehiclesForAdminAsync();

            // 2. Trả về kết quả 200 OK cùng với danh sách xe.
            return Ok(vehicles);
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

        // Ghi chú: Dùng để cập nhật thông tin của một mẫu xe đã có.
        // [HttpPut] là động từ HTTP chuẩn cho việc cập nhật toàn bộ đối tượng.
        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> UpdateVehicle(int vehicleId, [FromBody] UpdateVehicleDto updateDto)
        {
            // 1. Gọi xuống Service để thực hiện logic nghiệp vụ.
            var updatedVehicle = await _vehicleAdminService.UpdateVehicleAsync(vehicleId, updateDto);

            // 2. Nếu Service trả về null, nghĩa là không tìm thấy xe, trả về lỗi 404.
            if (updatedVehicle == null)
            {
                return NotFound($"Không tìm thấy xe với ID = {vehicleId}.");
            }

            // 3. Nếu thành công, trả về 200 OK cùng với thông tin xe đã được cập nhật.
            return Ok(updatedVehicle);
        }

        // Endpoint: PUT /api/admin/vehicles/configs/{configId}
        // Ghi chú: Dùng để cập nhật một phiên bản cấu hình cụ thể.
        [HttpPut("configs/{configId}")]
        public async Task<IActionResult> UpdateConfig(int configId, [FromBody] UpdateVehicleConfigDto updateDto)
        {
            var updatedConfig = await _vehicleAdminService.UpdateConfigAsync(configId, updateDto);

            if (updatedConfig == null)
            {
                return NotFound($"Không tìm thấy cấu hình với ID = {configId}.");
            }

            return Ok(updatedConfig);
        }

        // Ghi chú: Dùng để "xóa mềm" một mẫu xe.
        // Dùng động từ [HttpDelete] là phù hợp về mặt ngữ nghĩa RESTful API
        // dù backend chỉ cập nhật trạng thái.
        // Endpoint: DELETE /api/admin/vehicles/{vehicleId}
        // Ghi chú: Dùng để "xóa mềm" một mẫu xe. (Đã có)
        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            var success = await _vehicleAdminService.DeactivateVehicleAsync(vehicleId);
            if (!success)
            {
                return NotFound($"Không tìm thấy xe với ID = {vehicleId} để xóa.");
            }
            return NoContent();
        }
        
        // Endpoint: DELETE /api/admin/vehicles/configs/{configId}
        // Ghi chú: Dùng để "xóa mềm" một phiên bản cấu hình cụ thể.
        // Route này rất rõ ràng, cho biết chúng ta đang thao tác trên một "config".
        [HttpDelete("configs/{configId}")]
        public async Task<IActionResult> DeleteConfig(int configId)
        {
            // 1. Gọi xuống Service để thực hiện logic nghiệp vụ vô hiệu hóa config.
            var success = await _vehicleAdminService.DeactivateConfigAsync(configId);

            // 2. Nếu Service trả về false, có thể là do không tìm thấy config đó.
            if (!success)
            {
                return NotFound($"Không tìm thấy cấu hình với ID = {configId} để xóa.");
            }

            // 3. Trả về 204 No Content - mã trạng thái HTTP chuẩn cho việc xóa thành công.
            return NoContent();
        }
    }
}