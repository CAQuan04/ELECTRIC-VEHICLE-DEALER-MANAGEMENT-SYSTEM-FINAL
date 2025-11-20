using EVDealer.BE.Common.DTOs;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Quotations
{
    public interface IQuotationService
    {
        Task<QuotationDto> CreateAsync(QuotationCreateDto createDto, int createdByUserId);
        Task<QuotationDto?> GetByIdAsync(int quotationId);
    }
}