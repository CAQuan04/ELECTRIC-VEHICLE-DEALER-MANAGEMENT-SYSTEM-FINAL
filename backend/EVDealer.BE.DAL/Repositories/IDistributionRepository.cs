using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IDistributionRepository
    {
        Task<Distribution> CreateAsync(Distribution distribution);
        Task<Distribution?> GetByIdAsync(int distId);
        Task<Distribution> UpdateAsync(Distribution distribution);
        Task<IEnumerable<Distribution>> GetAllByDealerAsync(int dealerId);
    }
}