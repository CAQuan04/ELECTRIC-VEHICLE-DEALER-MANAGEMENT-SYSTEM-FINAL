using EVDealer.BE.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Procurement
{
    public interface IDistributionService
    {
        Task<IEnumerable<DistributionDto>> GetDistributionsForDealerAsync(int dealerId);
        Task<DistributionDto> ConfirmDistributionAsync(int distId, int dealerId);
    }
}