using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVDealer.BE.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    /// <summary>
    /// Tạo customer mới
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreateDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var customer = await _customerService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetCustomerById), new { customerId = customer.CustomerId }, customer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Cập nhật customer
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpPut("{customerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> UpdateCustomer(int customerId, [FromBody] CustomerUpdateDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var customer = await _customerService.UpdateAsync(customerId, updateDto);
            return Ok(customer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Lấy customer theo ID
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("{customerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetCustomerById(int customerId)
    {
        var customer = await _customerService.GetByIdAsync(customerId);
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }

    /// <summary>
    /// Lấy tất cả customers
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetAllCustomers()
    {
        var customers = await _customerService.GetAllAsync();
        return Ok(customers);
    }

    /// <summary>
    /// Lấy customers với phân trang và lọc
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("paged")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetCustomersWithPaging([FromQuery] CustomerQueryDto query)
    {
        var result = await _customerService.GetWithPagingAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Xóa customer
    /// Auth: Dealer Manager/EVM/Admin
    /// </summary>
    [HttpDelete("{customerId}")]
    [Authorize(Roles = "DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> DeleteCustomer(int customerId)
    {
        var result = await _customerService.DeleteAsync(customerId);
        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Tìm customer theo số điện thoại
    /// Auth: Dealer Staff/Manager/EVM/Admin
    /// </summary>
    [HttpGet("by-phone/{phone}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetCustomerByPhone(string phone)
    {
        var customer = await _customerService.GetByPhoneAsync(phone);
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }
}