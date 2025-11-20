using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Dealers;

public interface IDealerService
{
    Task<DealerDto> CreateAsync(DealerCreateDto createDto);
    Task<DealerDto> UpdateAsync(int dealerId, DealerUpdateDto updateDto);
    Task<DealerDto?> GetByIdAsync(int dealerId);
    Task<IEnumerable<DealerDto>> GetAllAsync();
    Task<PagedResult<DealerDto>> GetWithPagingAsync(DealerQueryDto query);
    Task<bool> DeleteAsync(int dealerId);
    Task<DealerDto?> GetByPhoneAsync(string phone);
    Task<DealerDto?> GetByNameAsync(string name);
    Task<IEnumerable<object>> GetAllBasicAsync();

}