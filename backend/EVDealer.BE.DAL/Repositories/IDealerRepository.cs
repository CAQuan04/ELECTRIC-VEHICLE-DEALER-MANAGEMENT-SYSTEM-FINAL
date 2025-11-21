using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.DAL.Repositories;

public interface IDealerRepository
{
    Task<Dealer> CreateAsync(Dealer dealer);
    Task<Dealer> UpdateAsync(Dealer dealer);
    Task<Dealer?> GetByIdAsync(int dealerId);
    Task<IEnumerable<Dealer>> GetAllAsync();
    Task<IEnumerable<Dealer>> GetWithPagingAsync(DealerQueryDto query);
    Task<int> GetTotalCountAsync(DealerQueryDto query);
    Task<bool> DeleteAsync(int dealerId);
    Task<bool> ExistsAsync(int dealerId);
    Task<Dealer?> GetByPhoneAsync(string phone);
    Task<Dealer?> GetByNameAsync(string name);

    Task<IEnumerable<Dealer>> GetAllBasicAsync();

    Task<IEnumerable<Dealer>> GetDealerListAsync();
}

#region Query DTO
public class DealerQueryDto
{
    public string? Search { get; set; }
    public string? Phone { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}
#endregion