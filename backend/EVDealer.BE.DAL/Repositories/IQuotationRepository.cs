using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IQuotationRepository
    {
        Task<Quotation> CreateAsync(Quotation quotation);
        Task<Quotation?> GetByIdAsync(int quotationId);
        Task<IEnumerable<Quotation>> GetAllAsync();
        Task<Quotation> UpdateAsync(Quotation quotation);
    }
}