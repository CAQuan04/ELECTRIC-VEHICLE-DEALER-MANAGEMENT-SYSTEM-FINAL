using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.TestDrives;

public class TestDriveService : ITestDriveService
{
    private readonly ITestDriveRepository _testDriveRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IDealerRepository _dealerRepository;
    private readonly IVehicleRepository _vehicleRepository;

    public TestDriveService(
        ITestDriveRepository testDriveRepository,
        ICustomerRepository customerRepository,
        IDealerRepository dealerRepository,
        IVehicleRepository vehicleRepository)
    {
        _testDriveRepository = testDriveRepository;
        _customerRepository = customerRepository;
        _dealerRepository = dealerRepository;
        _vehicleRepository = vehicleRepository;
    }

    public async Task<TestDriveDto> CreateAsync(TestDriveCreateDto createDto)
    {
        var customer = await _customerRepository.GetByIdAsync(createDto.CustomerId);
        if (customer == null)
            throw new Exception("Customer not found");

        var dealer = await _dealerRepository.GetByIdAsync(createDto.DealerId);
        if (dealer == null)
            throw new Exception("Dealer not found");

        var vehicle = await _vehicleRepository.GetVehicleWithDetailsAsync(createDto.VehicleId);
        if (vehicle == null)
            throw new Exception("Vehicle not found");

        // Validate ScheduleDatetime is in future
        if (createDto.ScheduleDatetime <= DateTime.Now)
            throw new Exception("Schedule datetime must be in the future");

        if (!GetAvailableStatuses().Contains(createDto.Status))
            throw new Exception("Invalid status");

        var testDrive = new TestDrive
        {
            CustomerId = createDto.CustomerId,
            VehicleId = createDto.VehicleId,
            DealerId = createDto.DealerId,
            ScheduleDatetime = createDto.ScheduleDatetime,
            Status = createDto.Status
        };

        var createdTestDrive = await _testDriveRepository.CreateAsync(testDrive);
        return MapToTestDriveDto(createdTestDrive);
    }

    public async Task<TestDriveDto?> GetByIdAsync(int testId)
    {
        var testDrive = await _testDriveRepository.GetByIdAsync(testId);
        return testDrive != null ? MapToTestDriveDto(testDrive) : null;
    }

    public async Task<TestDriveDto> UpdateStatusAsync(int testId, TestDriveUpdateStatusDto updateDto)
    {
        var testDrive = await _testDriveRepository.GetByIdAsync(testId);
        if (testDrive == null)
            throw new Exception("Test drive not found");

        // Validate Status using TestDriveStatus enum directly
        if (!IsValidStatus(updateDto.Status))
            throw new Exception("Invalid status");

        testDrive.Status = updateDto.Status;
        testDrive.Feedback = updateDto.Feedback;

        var updatedTestDrive = await _testDriveRepository.UpdateAsync(testDrive);
        return MapToTestDriveDto(updatedTestDrive);
    }

    public async Task<PagedResult<TestDriveDto>> GetByCustomerIdAsync(int customerId, TestDriveQueryDto query)
    {
        var customer = await _customerRepository.GetByIdAsync(customerId);
        if (customer == null)
            throw new Exception("Customer not found");

        var testDrives = await _testDriveRepository.GetByCustomerIdAsync(customerId, query);
        var total = await _testDriveRepository.GetCountByCustomerIdAsync(customerId, query);

        var testDriveDtos = new List<TestDriveDto>();
        foreach (var testDrive in testDrives)
        {
            testDriveDtos.Add(MapToTestDriveDto(testDrive));
        }

        return new PagedResult<TestDriveDto>
        {
            Items = testDriveDtos,
            Pagination = new Pagination
            {
                Page = query.Page,
                Size = query.Size,
                Total = total
            }
        };
    }

    public async Task<PagedResult<TestDriveDto>> GetByDealerIdAsync(int dealerId, TestDriveQueryDto query)
    {
        var dealer = await _dealerRepository.GetByIdAsync(dealerId);
        if (dealer == null)
            throw new Exception("Dealer not found");

        var testDrives = await _testDriveRepository.GetByDealerIdAsync(dealerId, query);
        var total = await _testDriveRepository.GetCountByDealerIdAsync(dealerId, query);

        var testDriveDtos = new List<TestDriveDto>();
        foreach (var testDrive in testDrives)
        {
            testDriveDtos.Add(MapToTestDriveDto(testDrive));
        }

        return new PagedResult<TestDriveDto>
        {
            Items = testDriveDtos,
            Pagination = new Pagination
            {
                Page = query.Page,
                Size = query.Size,
                Total = total
            }
        };
    }

    public async Task<bool> CancelAsync(int testId, string reason)
    {
        var testDrive = await _testDriveRepository.GetByIdAsync(testId);
        if (testDrive == null)
            return false;

        if (testDrive.Status == TestDriveStatus.Completed || testDrive.Status == TestDriveStatus.Cancelled)
            throw new Exception("Cannot cancel completed or already cancelled test drive");

        testDrive.Status = TestDriveStatus.Cancelled;
        testDrive.Feedback = reason;

        await _testDriveRepository.UpdateAsync(testDrive);
        return true;
    }

    private static bool IsValidStatus(string status)
    {
        return status == TestDriveStatus.Pending ||
                status == TestDriveStatus.Confirmed ||
                status == TestDriveStatus.Completed ||
                status == TestDriveStatus.Cancelled;
    }

    public static IEnumerable<string> GetAvailableStatuses()
    {
        return new[]
        {
            TestDriveStatus.Pending,
            TestDriveStatus.Confirmed,
            TestDriveStatus.Completed,
            TestDriveStatus.Cancelled
        };
    }

    private TestDriveDto MapToTestDriveDto(TestDrive testDrive)
    {
        return new TestDriveDto
        {
            TestId = testDrive.TestId,
            CustomerId = testDrive.CustomerId,
            CustomerName = testDrive.Customer?.FullName ?? "Unknown",
            VehicleId = testDrive.VehicleId,
            VehicleModel = testDrive.Vehicle?.Model ?? "Unknown",
            VehicleBrand = testDrive.Vehicle?.Brand ?? "Unknown",
            DealerId = testDrive.DealerId,
            DealerName = testDrive.Dealer?.Name ?? "Unknown",
            ScheduleDatetime = testDrive.ScheduleDatetime,
            Status = testDrive.Status,
            Feedback = testDrive.Feedback
        };
    }
}