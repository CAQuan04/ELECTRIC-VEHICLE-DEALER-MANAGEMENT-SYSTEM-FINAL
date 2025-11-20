using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using System; // Cần cho DateOnly
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Planning
{
    // Ghi chú: Hợp đồng cho các dịch vụ hoạch định (Không thay đổi).
    public interface ISupplyPlanningService
    {
        Task GenerateDistributionSuggestionsAsync();
        Task<IEnumerable<DistributionSuggestion>> GetPendingSuggestionsAsync();
        Task<ProductionPlanReportDto> GenerateProductionPlanReportAsync(DateOnly periodStart);
    }
}