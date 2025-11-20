using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Quotations
{
    public interface IQuotationService
    {
        Task<QuotationDto> CreateAsync(QuotationCreateDto createDto, int createdByUserId);
        Task<QuotationDto?> GetByIdAsync(int quotationId);
        Task<IEnumerable<QuotationDto>> GetDealerQuotationsAsync(int dealerId, string? status, string? search);
        Task<QuotationDto> UpdateAsync(int quotationId, QuotationUpdateDto updateDto);
        Task SendQuotationAsync(int quotationId);
    }
}