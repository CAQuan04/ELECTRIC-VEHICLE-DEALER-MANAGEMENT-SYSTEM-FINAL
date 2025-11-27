using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IPurchaseRequestRepository
    {
        Task<PurchaseRequest> CreateAsync(PurchaseRequest request);
        Task<PurchaseRequest?> GetByIdAsync(int requestId);
        Task<IEnumerable<PurchaseRequest>> GetAllByDealerAsync(int dealerId);
        Task<IEnumerable<PurchaseRequest>> GetAllPendingAsync();
        Task<PurchaseRequest> UpdateAsync(PurchaseRequest request);


    }
}