using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Dealers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DealersController : ControllerBase
{
    private readonly IDealerService _dealerService;

    public DealersController(IDealerService dealerService)
    {
        _dealerService = dealerService;
    }

    /// <summary>
    /// Tạo dealer mới
    /// Auth: EVM/Admin
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "EVMStaff,Admin")]
    public async Task<IActionResult> CreateDealer([FromBody] DealerCreateDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var dealer = await _dealerService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetDealerById), new { dealerId = dealer.DealerId }, dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    // === PHẦN BỔ SUNG QUAN TRỌNG CHO DROPDOWN ===
    [HttpGet("basic")]
    public async Task<IActionResult> GetAllBasicDealers()
    {
        // Ghi chú: Controller gọi phương thức tương ứng từ Service.
        // Nó không cần biết làm thế nào để lấy được dữ liệu.
        var dealers = await _dealerService.GetAllBasicAsync();
        return Ok(dealers);
    }
    /// <summary>
    /// Cập nhật dealer
    /// Auth: EVM/Admin
    /// </summary>
    [HttpPut("{dealerId}")]
    [Authorize(Roles = "EVMStaff,Admin")]
    public async Task<IActionResult> UpdateDealer(int dealerId, [FromBody] DealerUpdateDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var dealer = await _dealerService.UpdateAsync(dealerId, updateDto);
            return Ok(dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy dealer theo ID
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("{dealerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetDealerById(int dealerId)
    {
        var dealer = await _dealerService.GetByIdAsync(dealerId);
        if (dealer == null)
            return NotFound();

        return Ok(dealer);
    }

    /// <summary>
    /// Lấy tất cả dealers
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetAllDealers()
    {
        var dealers = await _dealerService.GetAllAsync();
        return Ok(dealers);
    }

    /// <summary>
    /// Lấy dealers với phân trang và lọc
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("paged")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetDealersWithPaging([FromQuery] DealerQueryDto query)
    {
        var result = await _dealerService.GetWithPagingAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Xóa dealer
    /// Auth: Admin
    /// </summary>
    [HttpDelete("{dealerId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDealer(int dealerId)
    {
        var result = await _dealerService.DeleteAsync(dealerId);
        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Tìm dealer theo số điện thoại
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("by-phone/{phone}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetDealerByPhone(string phone)
    {
        var dealer = await _dealerService.GetByPhoneAsync(phone);
        if (dealer == null)
            return NotFound();

        return Ok(dealer);
    }

    /// <summary>
    /// Tìm dealer theo tên
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("by-name/{name}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetDealerByName(string name)
    {
        var dealer = await _dealerService.GetByNameAsync(name);
        if (dealer == null)
            return NotFound();

        return Ok(dealer);
    }
}