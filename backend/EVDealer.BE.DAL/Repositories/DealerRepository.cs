using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace EVDealer.BE.DAL.Repositories;

public class DealerRepository : IDealerRepository
{
    private readonly ApplicationDbContext _context;

    public DealerRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Dealer> CreateAsync(Dealer dealer)
    {
        _context.Dealers.Add(dealer);
        await _context.SaveChangesAsync();
        return dealer;
    }

    public async Task<Dealer> UpdateAsync(Dealer dealer)
    {
        _context.Dealers.Update(dealer);
        await _context.SaveChangesAsync();
        return dealer;
    }

    public async Task<Dealer?> GetByIdAsync(int dealerId)
    {
        return await _context.Dealers
            .Include(d => d.Users)
            .Include(d => d.SalesOrders)
            .Include(d => d.TestDrives)
            .Include(d => d.DemandForecasts)
            .Include(d => d.Distributions)
            .Include(d => d.PurchaseRequests)
            .FirstOrDefaultAsync(d => d.DealerId == dealerId);
    }

    public async Task<IEnumerable<Dealer>> GetAllAsync()
    {
        return await _context.Dealers
            .Include(d => d.Users)
            .Include(d => d.SalesOrders)
            .Include(d => d.TestDrives)
            .Include(d => d.DemandForecasts)
            .Include(d => d.Distributions)
            .Include(d => d.PurchaseRequests)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Dealer>> GetWithPagingAsync(DealerQueryDto query)
    {
        var dealersQuery = BuildDealersBaseQuery(query);

        return await dealersQuery
            .OrderBy(d => d.Name)
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(DealerQueryDto query)
    {
        var dealersQuery = BuildDealersBaseQuery(query);
        return await dealersQuery.CountAsync();
    }

    public async Task<bool> DeleteAsync(int dealerId)
    {
        var dealer = await _context.Dealers.FindAsync(dealerId);
        if (dealer == null)
            return false;

        _context.Dealers.Remove(dealer);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int dealerId)
    {
        return await _context.Dealers.AnyAsync(d => d.DealerId == dealerId);
    }

    public async Task<Dealer?> GetByPhoneAsync(string phone)
    {
        return await _context.Dealers
            .FirstOrDefaultAsync(d => d.Phone == phone);
    }

    public async Task<Dealer?> GetByNameAsync(string name)
    {
        return await _context.Dealers
            .FirstOrDefaultAsync(d => d.Name == name);
    }

    private IQueryable<Dealer> BuildDealersBaseQuery(DealerQueryDto query)
    {
        var dealersQuery = _context.Dealers.AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
        {
            dealersQuery = dealersQuery.Where(d =>
                d.Name.Contains(query.Search) ||
                (d.Phone != null && d.Phone.Contains(query.Search)) ||
                (d.Address != null && d.Address.Contains(query.Search)));
        }

        if (!string.IsNullOrEmpty(query.Phone))
        {
            dealersQuery = dealersQuery.Where(d => d.Phone != null && d.Phone.Contains(query.Phone));
        }

        return dealersQuery;
    }
    // Ghi chú: Đây là phương thức được tối ưu hóa riêng cho các nghiệp vụ cần danh sách nhanh,
    // như chức năng AI của bạn.
    public async Task<IEnumerable<Dealer>> GetAllBasicAsync()
    {
        // Ghi chú: Chỉ lấy dữ liệu từ bảng Dealers, không Join với bất kỳ bảng nào khác.
        return await _context.Dealers
            // Ghi chú: Dùng AsNoTracking() để báo cho EF biết chúng ta chỉ đọc, không sửa,
            // giúp tăng tốc độ và giảm bộ nhớ sử dụng.
            .AsNoTracking()
            .OrderBy(d => d.Name)
            .ToListAsync();
    }
}