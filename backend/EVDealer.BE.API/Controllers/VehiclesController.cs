using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Vehicles;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    /// <summary>
    /// Load danh mục xe với lọc và phân trang
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetVehicles([FromQuery] VehicleQueryDto query)
    {
        var result = await _vehicleService.GetVehiclesAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Chi tiết xe
    /// </summary>
    [HttpGet("{vehicleId}")]
    public async Task<IActionResult> GetVehicleDetail(int vehicleId)
    {
        var vehicle = await _vehicleService.GetVehicleDetailAsync(vehicleId);

        if (vehicle == null) return NotFound();
        return Ok(vehicle);
    }

    /// <summary>
    /// So sánh các mẫu xe
    /// </summary>
    [HttpPost("compare")]
    public async Task<IActionResult> CompareVehicles([FromBody] IEnumerable<int> vehicleIds)
    {
        if (vehicleIds == null || !vehicleIds.Any())
            return BadRequest("Danh sách xe không được trống");

        var comparison = await _vehicleService.CompareVehiclesAsync(vehicleIds);
        return Ok(comparison);
    }

    /// <summary>
    /// Lấy các cấu hình có sẵn của xe
    /// </summary>
    [HttpGet("{vehicleId}/configs")]
    public async Task<IActionResult> GetAvailableConfigs(int vehicleId)
    {
        var configs = await _vehicleService.GetAvailableConfigsAsync(vehicleId);
        return Ok(configs);
    }

}