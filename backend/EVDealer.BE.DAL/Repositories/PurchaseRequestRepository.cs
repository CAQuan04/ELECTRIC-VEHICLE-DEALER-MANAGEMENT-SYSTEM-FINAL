using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class PurchaseRequestRepository : IPurchaseRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public PurchaseRequestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PurchaseRequest> CreateAsync(PurchaseRequest request)
        {
            _context.PurchaseRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<PurchaseRequest?> GetByIdAsync(int requestId)
        {
            return await _context.PurchaseRequests.FindAsync(requestId);
        }

        public async Task<IEnumerable<PurchaseRequest>> GetAllByDealerAsync(int dealerId)
        {
            return await _context.PurchaseRequests
                .Where(r => r.DealerId == dealerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<PurchaseRequest>> GetAllPendingAsync()
        {
            return await _context.PurchaseRequests
                .Where(r => r.Status == "pending")
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();
        }
        
        public async Task<PurchaseRequest> UpdateAsync(PurchaseRequest request)
        {
            _context.PurchaseRequests.Update(request);
            await _context.SaveChangesAsync();
            return request;
        }
    }
}