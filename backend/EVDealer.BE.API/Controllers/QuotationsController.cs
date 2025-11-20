using EVDealer.BE.Common.DTOs;
using EVDealer.BE.Services.Quotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace EVDealer.BE.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuotationsController : ControllerBase
    {
        private readonly IQuotationService _quotationService;

        public QuotationsController(IQuotationService quotationService)
        {
            _quotationService = quotationService;
        }

        /// <summary>
        /// Tạo báo giá mới
        /// Auth: DealerStaff
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "DealerStaff,Admin")]
        public async Task<IActionResult> CreateQuotation([FromBody] QuotationCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user identifier.");
                }

                var quotation = await _quotationService.CreateAsync(createDto, userId);
                return CreatedAtAction(nameof(GetQuotationById), new { id = quotation.QuotationId }, quotation);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Lấy báo giá theo ID
        /// Auth: DealerStaff
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "DealerStaff,Admin")]
        public async Task<IActionResult> GetQuotationById(int id)
        {
            var quotation = await _quotationService.GetByIdAsync(id);
            if (quotation == null)
                return NotFound();

            return Ok(quotation);
        }
    }
}