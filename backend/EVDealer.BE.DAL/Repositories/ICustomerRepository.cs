using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.DAL.Repositories;

public interface ICustomerRepository
{
    Task<Customer> CreateAsync(Customer customer);
    Task<Customer> UpdateAsync(Customer customer);
    Task<Customer?> GetByIdAsync(int customerId);
    Task<IEnumerable<Customer>> GetAllAsync();
    Task<IEnumerable<Customer>> GetWithPagingAsync(CustomerQueryDto query);
    Task<int> GetTotalCountAsync(CustomerQueryDto query);
    Task<bool> DeleteAsync(int customerId);
    Task<bool> ExistsAsync(int customerId);
    Task<Customer?> GetByPhoneAsync(string phone);
}

#region Query DTO
public class CustomerQueryDto
{
    public string? Search { get; set; }
    public string? Phone { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
}
#endregion