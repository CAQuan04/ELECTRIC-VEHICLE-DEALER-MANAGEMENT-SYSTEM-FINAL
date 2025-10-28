using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.TestDrives;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TestDrivesController : ControllerBase
{
    private readonly ITestDriveService _testDriveService;

    public TestDrivesController(ITestDriveService testDriveService)
    {
        _testDriveService = testDriveService;
    }

    /// <summary>
    /// Lấy tất cả lịch test drive theo CustomerId với phân trang
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("by-customer/{customerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetByCustomerId(int customerId, [FromQuery] TestDriveQueryDto query)
    {
        try
        {
            var result = await _testDriveService.GetByCustomerIdAsync(customerId, query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy tất cả lịch test drive theo DealerId với phân trang
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("by-dealer/{dealerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetByDealerId(int dealerId, [FromQuery] TestDriveQueryDto query)
    {
        try
        {
            var result = await _testDriveService.GetByDealerIdAsync(dealerId, query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Tạo lịch test drive mới
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> CreateTestDrive([FromBody] TestDriveCreateDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var testDrive = await _testDriveService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetTestDriveById), new { testId = testDrive.TestId }, testDrive);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Xem chi tiết test drive
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("{testId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetTestDriveById(int testId)
    {
        var testDrive = await _testDriveService.GetByIdAsync(testId);
        if (testDrive == null)
            return NotFound();

        return Ok(testDrive);
    }

    /// <summary>
    /// Cập nhật trạng thái test drive
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpPut("{testId}/status")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> UpdateTestDriveStatus(int testId, [FromBody] TestDriveUpdateStatusDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var testDrive = await _testDriveService.UpdateStatusAsync(testId, updateDto);
            return Ok(testDrive);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Hủy test drive
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpPut("{testId}/cancel")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> CancelTestDrive(int testId, [FromBody] string reason)
    {
        try
        {
            var result = await _testDriveService.CancelAsync(testId, reason);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy danh sách status có sẵn
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("statuses")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public IActionResult GetAvailableStatuses()
    {
        var statuses = TestDriveService.GetAvailableStatuses();
        return Ok(statuses);
    }
}