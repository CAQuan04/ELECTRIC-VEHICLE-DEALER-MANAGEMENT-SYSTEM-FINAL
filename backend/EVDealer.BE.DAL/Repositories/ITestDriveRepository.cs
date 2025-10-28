using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.DAL.Repositories;

public interface ITestDriveRepository
{
    Task<TestDrive> CreateAsync(TestDrive testDrive);
    Task<TestDrive?> GetByIdAsync(int testId);
    Task<TestDrive> UpdateAsync(TestDrive testDrive);
    Task<IEnumerable<TestDrive>> GetByCustomerIdAsync(int customerId, TestDriveQueryDto query);
    Task<IEnumerable<TestDrive>> GetByDealerIdAsync(int dealerId, TestDriveQueryDto query);
    Task<int> GetCountByCustomerIdAsync(int customerId, TestDriveQueryDto query);
    Task<int> GetCountByDealerIdAsync(int dealerId, TestDriveQueryDto query);
    Task<bool> ExistsAsync(int testId);
}

#region Query DTO
public class TestDriveQueryDto
{
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}
#endregion