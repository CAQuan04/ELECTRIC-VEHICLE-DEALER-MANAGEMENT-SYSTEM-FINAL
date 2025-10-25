using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Customers;

public interface ICustomerService
{
    Task<CustomerDto> CreateAsync(CustomerCreateDto createDto);
    Task<CustomerDto> UpdateAsync(int customerId, CustomerUpdateDto updateDto);
    Task<CustomerDto?> GetByIdAsync(int customerId);
    Task<IEnumerable<CustomerDto>> GetAllAsync();
    Task<PagedResult<CustomerDto>> GetWithPagingAsync(CustomerQueryDto query);
    Task<bool> DeleteAsync(int customerId);
    Task<CustomerDto?> GetByPhoneAsync(string phone);
}