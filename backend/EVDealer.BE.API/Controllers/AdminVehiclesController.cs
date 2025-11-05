// File: EVDealer.BE.API/Controllers/AdminVehiclesController.cs
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/admin/vehicles")]
    [ApiController]
    [Authorize(Policy = "CanManageVehicles")]
    public class AdminVehiclesController : ControllerBase
    {
        private readonly IVehicleAdminService _vehicleAdminService;

        public AdminVehiclesController(IVehicleAdminService vehicleAdminService)
        {
            _vehicleAdminService = vehicleAdminService;
        }

        // --- CÁC ENDPOINT LIÊN QUAN ĐẾN VEHICLE ---

        // Endpoint: GET /api/admin/vehicles
        [HttpGet]
        public async Task<IActionResult> GetAllVehiclesForAdmin()
        {
            var vehicles = await _vehicleAdminService.GetAllVehiclesForAdminAsync();
            return Ok(vehicles);
        }

        // Endpoint: POST /api/admin/vehicles
        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto createDto)
        {
            var newVehicle = await _vehicleAdminService.CreateVehicleAsync(createDto);
            // Trả về 201 Created cùng với location header và đối tượng vừa tạo
            return CreatedAtAction(nameof(GetAllVehiclesForAdmin), new { id = newVehicle.VehicleId }, newVehicle);
        }

        // Endpoint: PUT /api/admin/vehicles/{vehicleId}
        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> UpdateVehicle(int vehicleId, [FromBody] UpdateVehicleDto updateDto)
        {
            var updatedVehicle = await _vehicleAdminService.UpdateVehicleAsync(vehicleId, updateDto);
            if (updatedVehicle == null)
            {
                return NotFound($"Không tìm thấy xe với ID = {vehicleId}.");
            }
            return Ok(updatedVehicle);
        }

        // Endpoint: DELETE /api/admin/vehicles/{vehicleId}
        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeactivateVehicle(int vehicleId)
        {
            var success = await _vehicleAdminService.DeactivateVehicleAsync(vehicleId);
            if (!success)
            {
                return NotFound($"Không tìm thấy xe với ID = {vehicleId} để xóa mềm.");
            }
            return NoContent();
        }

        // Endpoint: PUT /api/admin/vehicles/{vehicleId}/status
        [HttpPut("{vehicleId}/status")]
        public async Task<IActionResult> ActivateVehicle(int vehicleId)
        {
            var success = await _vehicleAdminService.ActivateVehicleAsync(vehicleId);
            if (!success)
            {
                return NotFound("Không tìm thấy xe để cập nhật trạng thái.");
            }
            return NoContent();
        }

        // --- CÁC ENDPOINT LIÊN QUAN ĐẾN CONFIG ---

        // Endpoint: POST /api/admin/vehicles/{vehicleId}/configs
        [HttpPost("{vehicleId}/configs")]
        public async Task<IActionResult> AddConfig(int vehicleId, [FromBody] CreateVehicleConfigDto createDto)
        {
            var newConfig = await _vehicleAdminService.AddConfigToVehicleAsync(vehicleId, createDto);
            if (newConfig == null)
            {
                return NotFound($"Không tìm thấy xe cha với ID = {vehicleId} để thêm cấu hình.");
            }
            return Ok(newConfig);
        }

        // ===================================================================================
        // === PHẦN SỬA ĐỔI: CHUẨN HÓA LẠI CÁC ENDPOINT UPDATE VÀ DELETE CHO CONFIG ===

        // Endpoint: PUT /api/admin/vehicles/{vehicleId}/configs/{configId}
        [HttpPut("{vehicleId}/configs/{configId}")]
        public async Task<IActionResult> UpdateConfig(int vehicleId, int configId, [FromBody] UpdateVehicleConfigDto updateDto)
        {
            // Ghi chú: Gọi xuống Service với đầy đủ 3 tham số.
            var updatedConfig = await _vehicleAdminService.UpdateConfigAsync(vehicleId, configId, updateDto);
            if (updatedConfig == null)
            {
                return NotFound("Không tìm thấy cấu hình hoặc ID xe không khớp.");
            }
            return Ok(updatedConfig);
        }

        // Endpoint: PUT /api/admin/vehicles/{vehicleId}/configs/{configId}/status
        [HttpPut("{vehicleId}/configs/{configId}/status")]
        public async Task<IActionResult> ToggleVehicleConfigStatus(int vehicleId, int configId)
        {
            var success = await _vehicleAdminService.ToggleConfigStatusAsync(vehicleId, configId);
            if (!success)
            {
                return NotFound("Không tìm thấy cấu hình hoặc ID xe không hợp lệ.");
            }
            return NoContent();
        }

        // Endpoint: DELETE /api/admin/vehicles/{vehicleId}/configs/{configId}
        [HttpDelete("{vehicleId}/configs/{configId}")]
        public async Task<IActionResult> DeleteConfig(int vehicleId, int configId)
        {
            // Ghi chú: Gọi xuống Service với đầy đủ 2 tham số.
            var success = await _vehicleAdminService.DeleteConfigAsync(vehicleId, configId);
            if (!success)
            {
                return NotFound("Không tìm thấy cấu hình để xóa.");
            }
            return NoContent();
        }
        // ===================================================================================
    }
}