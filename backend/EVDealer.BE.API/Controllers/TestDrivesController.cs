using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.Services.TestDrives;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.Json.Serialization;

namespace EVDealer.BE.API.Controllers;

// DTO nhận dữ liệu từ Frontend
public class CheckAvailabilityRequest
{
    [JsonPropertyName("vehicleId")]
    public int VehicleId { get; set; }

    [JsonPropertyName("date")]
    public string Date { get; set; }
}

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

    // Logic check availbability
    [HttpPost("check-availability")]
    [Authorize(Roles = "DealerStaff,DealerManager")]
    public async Task<IActionResult> CheckAvailability([FromBody] CheckAvailabilityRequest request)
    {
        // 1. Validation cơ bản
        if (request == null || request.VehicleId <= 0) return BadRequest("Dữ liệu không hợp lệ.");

        // Parse ngày và thời gian requested (nếu có gửi lên để check cụ thể)
        // Mặc định request này dùng để lấy danh sách slot trống gợi ý
        DateTime selectedDate;
        if (!DateTime.TryParse(request.Date, out selectedDate))
            return BadRequest("Ngày không hợp lệ.");

        // 2. Cấu hình thời gian làm việc (Hardcode hoặc lấy từ Setting)
        TimeSpan workStart = new TimeSpan(8, 0, 0);  // 08:00
        TimeSpan workEnd = new TimeSpan(17, 30, 0);  // 17:30
        int bufferMinutes = 10; // Thời gian nghỉ giữa 2 ca

        // 3. Lấy danh sách lịch ĐÃ ĐẶT trong ngày từ Database
        // TODO: Gọi Service -> Repository để lấy data thật
        // var bookings = await _testDriveService.GetBookedSlots(request.VehicleId, selectedDate);

        // --- MOCK DATA ĐỂ TEST LOGIC CỦA BẠN ---
        var bookedRanges = new List<(TimeSpan Start, TimeSpan End)>();

        // Giả lập case bạn yêu cầu: Có khách đặt 15:20 trong 30 phút
        // 15:20 + 30p = 15:50. Cộng thêm 10p buffer = 16:00.
        // Khoảng bận thực tế: 15:20 -> 16:00
        if (request.VehicleId == 2 && selectedDate.Date == new DateTime(2025, 11, 26).Date)
        {
            bookedRanges.Add((new TimeSpan(15, 20, 0), new TimeSpan(15, 50, 0)));
        }
        // ---------------------------------------

        // 4. Thuật toán tìm Slot trống (Gợi ý các mốc giờ chẵn 15 phút)
        var suggestedSlots = new List<string>();
        var timePointer = workStart;

        // Nếu là ngày hôm nay, không gợi ý giờ trong quá khứ
        if (selectedDate.Date == DateTime.Now.Date)
        {
            var now = DateTime.Now.TimeOfDay;
            if (timePointer < now) timePointer = new TimeSpan(now.Hours, now.Minutes, 0).Add(TimeSpan.FromMinutes(30)); // Delay 30p chuẩn bị
        }

        // Loop từng khoảng 15 phút một để check availability
        while (timePointer.Add(TimeSpan.FromMinutes(30)) <= workEnd) // Giả sử min duration là 30p
        {
            bool isConflict = false;

            // Thời gian kết thúc dự kiến của Slot này (giả định test drive ngắn nhất 30p)
            var proposedEnd = timePointer.Add(TimeSpan.FromMinutes(30));

            foreach (var booking in bookedRanges)
            {
                // Thời gian Busy = Booking End + Buffer 10 mins
                var busyEnd = booking.End.Add(TimeSpan.FromMinutes(bufferMinutes));
                var busyStart = booking.Start;

                // Kiểm tra va chạm: 
                // (StartMới < EndBận) && (EndMới > StartBận)
                if (timePointer < busyEnd && proposedEnd > busyStart)
                {
                    isConflict = true;
                    break;
                }
            }

            if (!isConflict)
            {
                suggestedSlots.Add(timePointer.ToString(@"hh\:mm"));
            }

            // Nhảy mỗi 15 phút để gợi ý (08:00, 08:15, 08:30...)
            timePointer = timePointer.Add(TimeSpan.FromMinutes(15));
        }

        return Ok(new
        {
            success = true,
            data = new
            {
                available = suggestedSlots.Any(),
                slots = suggestedSlots, // Danh sách các giờ CÓ THỂ bắt đầu
                bufferTime = bufferMinutes,
                message = suggestedSlots.Any() ? "Có lịch trống" : "Đã kín lịch"
            }
        });
    }

    // --- CÁC API CŨ GIỮ NGUYÊN ---

    [HttpGet("by-customer/{customerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetByCustomerId(int customerId, [FromQuery] TestDriveQueryDto query)
    {
        try { return Ok(await _testDriveService.GetByCustomerIdAsync(customerId, query)); }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpGet("by-dealer/{dealerId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetByDealerId(int dealerId, [FromQuery] TestDriveQueryDto query)
    {
        try { return Ok(await _testDriveService.GetByDealerIdAsync(dealerId, query)); }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpPost]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> CreateTestDrive([FromBody] TestDriveCreateDto createDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        try
        {
            var testDrive = await _testDriveService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetTestDriveById), new { testId = testDrive.TestId }, testDrive);
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpGet("{testId}")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> GetTestDriveById(int testId)
    {
        var testDrive = await _testDriveService.GetByIdAsync(testId);
        return testDrive == null ? NotFound() : Ok(testDrive);
    }

    [HttpPut("{testId}/status")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> UpdateTestDriveStatus(int testId, [FromBody] TestDriveUpdateStatusDto updateDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        try { return Ok(await _testDriveService.UpdateStatusAsync(testId, updateDto)); }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpPut("{testId}/cancel")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public async Task<IActionResult> CancelTestDrive(int testId, [FromBody] string reason)
    {
        try { return await _testDriveService.CancelAsync(testId, reason) ? NoContent() : NotFound(); }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpGet("statuses")]
    [Authorize(Roles = "DealerStaff,DealerManager,EVMStaff,Admin")]
    public IActionResult GetAvailableStatuses()
    {
        return Ok(TestDriveService.GetAvailableStatuses());
    }
}