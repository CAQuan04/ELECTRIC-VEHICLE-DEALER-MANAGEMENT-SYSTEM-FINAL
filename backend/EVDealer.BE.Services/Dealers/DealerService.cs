using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using EVDealer.BE.DAL.Utils;

namespace EVDealer.BE.Services.Dealers;

public class DealerService : IDealerService
{
    private readonly IDealerRepository _dealerRepository;

    public DealerService(IDealerRepository dealerRepository)
    {
        _dealerRepository = dealerRepository;
    }
    public async Task<IEnumerable<object>> GetAllBasicAsync()
    {
        // Bước 1: Gọi xuống Repository để lấy dữ liệu.
        var dealers = await _dealerRepository.GetAllBasicAsync();

        // Bước 2: Dùng LINQ Select để định dạng lại dữ liệu, chỉ trả về ID và Name.
        // Điều này giúp giữ cho Controller "trong sáng", không cần biết đến logic này.
        return dealers.Select(d => new { d.DealerId, d.Name });
    }
    public async Task<DealerDto> CreateAsync(DealerCreateDto createDto)
    {
        if (!string.IsNullOrEmpty(createDto.Phone))
        {
            var existingDealerWithPhone = await _dealerRepository.GetByPhoneAsync(createDto.Phone);
            if (existingDealerWithPhone != null)
                throw new Exception("Dealer with this phone number already exists");
        }

        var existingDealerWithName = await _dealerRepository.GetByNameAsync(createDto.Name);
        if (existingDealerWithName != null)
            throw new Exception("Dealer with this name already exists");

        var dealer = new Dealer
        {
            Name = createDto.Name,
            Address = createDto.Address,
            Phone = createDto.Phone
        };

        var createdDealer = await _dealerRepository.CreateAsync(dealer);
        return MapToDealerDto(createdDealer);
    }

    public async Task<DealerDto> UpdateAsync(int dealerId, DealerUpdateDto updateDto)
    {
        var dealer = await _dealerRepository.GetByIdAsync(dealerId);
        if (dealer == null)
            throw new Exception("Dealer not found");

        if (!string.IsNullOrEmpty(updateDto.Phone))
        {
            var existingDealerWithPhone = await _dealerRepository.GetByPhoneAsync(updateDto.Phone);
            if (existingDealerWithPhone != null && existingDealerWithPhone.DealerId != dealerId)
                throw new Exception("Another dealer with this phone number already exists");
        }

        var existingDealerWithName = await _dealerRepository.GetByNameAsync(updateDto.Name);
        if (existingDealerWithName != null && existingDealerWithName.DealerId != dealerId)
            throw new Exception("Another dealer with this name already exists");

        dealer.Name = updateDto.Name;
        dealer.Address = updateDto.Address;
        dealer.Phone = updateDto.Phone;

        var updatedDealer = await _dealerRepository.UpdateAsync(dealer);
        return MapToDealerDto(updatedDealer);
    }

    public async Task<DealerDto?> GetByIdAsync(int dealerId)
    {
        var dealer = await _dealerRepository.GetByIdAsync(dealerId);
        return dealer != null ? MapToDealerDto(dealer) : null;
    }

    public async Task<IEnumerable<DealerDto>> GetAllAsync()
    {
        var dealers = await _dealerRepository.GetAllAsync();
        return dealers.Select(MapToDealerDto);
    }

    public async Task<PagedResult<DealerDto>> GetWithPagingAsync(DealerQueryDto query)
    {
        var dealers = await _dealerRepository.GetWithPagingAsync(query);
        var total = await _dealerRepository.GetTotalCountAsync(query);

        var dealerDtos = dealers.Select(MapToDealerDto).ToList();

        return new PagedResult<DealerDto>
        {
            Items = dealerDtos,
            Pagination = new Pagination
            {
                Page = query.Page,
                Size = query.Size,
                Total = total
            }
        };
    }

    public async Task<bool> DeleteAsync(int dealerId)
    {
        if (!await _dealerRepository.ExistsAsync(dealerId))
            return false;

        return await _dealerRepository.DeleteAsync(dealerId);
    }

    public async Task<DealerDto?> GetByPhoneAsync(string phone)
    {
        var dealer = await _dealerRepository.GetByPhoneAsync(phone);
        return dealer != null ? MapToDealerDto(dealer) : null;
    }

    public async Task<DealerDto?> GetByNameAsync(string name)
    {
        var dealer = await _dealerRepository.GetByNameAsync(name);
        return dealer != null ? MapToDealerDto(dealer) : null;
    }

    private DealerDto MapToDealerDto(Dealer dealer)
    {
        return new DealerDto
        {
            DealerId = dealer.DealerId,
            Name = dealer.Name,
            Address = dealer.Address,
            Phone = dealer.Phone,
            TotalUsers = dealer.Users?.Count ?? 0,
            TotalOrders = dealer.SalesOrders?.Count ?? 0,
            TotalTestDrives = dealer.TestDrives?.Count ?? 0,
            TotalDemandForecasts = dealer.DemandForecasts?.Count ?? 0,
            TotalDistributions = dealer.Distributions?.Count ?? 0,
            TotalPurchaseRequests = dealer.PurchaseRequests?.Count ?? 0
        };
    }
}