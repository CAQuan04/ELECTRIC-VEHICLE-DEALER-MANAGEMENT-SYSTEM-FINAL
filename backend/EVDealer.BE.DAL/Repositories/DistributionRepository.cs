using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public class DistributionRepository : IDistributionRepository
    {
        private readonly ApplicationDbContext _context;

        public DistributionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Distribution> CreateAsync(Distribution distribution)
        {
            _context.Distributions.Add(distribution);
            await _context.SaveChangesAsync();
            return distribution;
        }

        public async Task<Distribution?> GetByIdAsync(int distId)
        {
            return await _context.Distributions.FindAsync(distId);
        }

        public async Task<Distribution> UpdateAsync(Distribution distribution)
        {
            _context.Distributions.Update(distribution);
            await _context.SaveChangesAsync();
            return distribution;
        }
        
        public async Task<IEnumerable<Distribution>> GetAllByDealerAsync(int dealerId)
        {
            return await _context.Distributions
                .Where(d => d.ToDealerId == dealerId)
                .OrderByDescending(d => d.ScheduledDate)
                .ToListAsync();
        }
    }
}