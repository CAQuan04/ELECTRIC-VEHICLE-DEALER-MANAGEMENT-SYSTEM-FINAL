using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Repositories;

public class TestDriveRepository : ITestDriveRepository
{
    private readonly ApplicationDbContext _context;

    public TestDriveRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TestDrive> CreateAsync(TestDrive testDrive)
    {
        _context.TestDrives.Add(testDrive);
        await _context.SaveChangesAsync();
        return testDrive;
    }

    public async Task<TestDrive?> GetByIdAsync(int testId)
    {
        return await _context.TestDrives
            .Include(td => td.Customer)
            .Include(td => td.Dealer)
            .Include(td => td.Vehicle)
            .FirstOrDefaultAsync(td => td.TestId == testId);
    }

    public async Task<TestDrive> UpdateAsync(TestDrive testDrive)
    {
        _context.TestDrives.Update(testDrive);
        await _context.SaveChangesAsync();
        return testDrive;
    }

    public async Task<IEnumerable<TestDrive>> GetByCustomerIdAsync(int customerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = BuildTestDrivesByCustomerQuery(customerId, query);

        return await testDrivesQuery
            .OrderByDescending(td => td.ScheduleDatetime)
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<IEnumerable<TestDrive>> GetByDealerIdAsync(int dealerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = BuildTestDrivesByDealerQuery(dealerId, query);

        return await testDrivesQuery
            .OrderByDescending(td => td.ScheduleDatetime)
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<int> GetCountByCustomerIdAsync(int customerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = BuildTestDrivesByCustomerQuery(customerId, query);
        return await testDrivesQuery.CountAsync();
    }

    public async Task<int> GetCountByDealerIdAsync(int dealerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = BuildTestDrivesByDealerQuery(dealerId, query);
        return await testDrivesQuery.CountAsync();
    }

    public async Task<bool> ExistsAsync(int testId)
    {
        return await _context.TestDrives.AnyAsync(td => td.TestId == testId);
    }

    private IQueryable<TestDrive> BuildTestDrivesByCustomerQuery(int customerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = _context.TestDrives
            .Include(td => td.Customer)
            .Include(td => td.Dealer)
            .Include(td => td.Vehicle)
            .Where(td => td.CustomerId == customerId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Status))
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.Status == query.Status);
        }

        if (query.FromDate.HasValue)
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.ScheduleDatetime >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.ScheduleDatetime <= query.ToDate.Value);
        }

        return testDrivesQuery;
    }

    private IQueryable<TestDrive> BuildTestDrivesByDealerQuery(int dealerId, TestDriveQueryDto query)
    {
        var testDrivesQuery = _context.TestDrives
            .Include(td => td.Customer)
            .Include(td => td.Dealer)
            .Include(td => td.Vehicle)
            .Where(td => td.DealerId == dealerId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Status))
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.Status == query.Status);
        }

        if (query.FromDate.HasValue)
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.ScheduleDatetime >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            testDrivesQuery = testDrivesQuery.Where(td => td.ScheduleDatetime <= query.ToDate.Value);
        }

        return testDrivesQuery;
    }
}