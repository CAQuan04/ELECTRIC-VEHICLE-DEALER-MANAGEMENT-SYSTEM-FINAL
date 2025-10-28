using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.TestDrives;

public interface ITestDriveService
{
    Task<TestDriveDto> CreateAsync(TestDriveCreateDto createDto);
    Task<TestDriveDto?> GetByIdAsync(int testId);
    Task<TestDriveDto> UpdateStatusAsync(int testId, TestDriveUpdateStatusDto updateDto);
    Task<PagedResult<TestDriveDto>> GetByCustomerIdAsync(int customerId, TestDriveQueryDto query);
    Task<PagedResult<TestDriveDto>> GetByDealerIdAsync(int dealerId, TestDriveQueryDto query);
    Task<bool> CancelAsync(int testId, string reason);
}