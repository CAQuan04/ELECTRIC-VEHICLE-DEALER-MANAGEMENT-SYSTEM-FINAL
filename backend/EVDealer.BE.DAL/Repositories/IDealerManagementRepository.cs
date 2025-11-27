using EVDealer.BE.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" tổng hợp tất cả các hành động CSDL cần thiết cho module quản lý đại lý.
    public interface IDealerManagementRepository
    {
        // --- Các hành động GHI (Write) ---
        Task AddContractAsync(DealerContract contract);
        Task AddTargetAsync(DealerTarget target);
        Task AddDebtAsync(Debt debt);
        Task<bool> SaveChangesAsync();

        // --- Các hành động ĐỌC (Read) ---
        Task<IEnumerable<DealerContract>> GetContractsByDealerIdAsync(int dealerId);
        Task<IEnumerable<DealerTarget>> GetTargetsByDealerIdAsync(int dealerId);
        Task<DealerTarget?> GetTargetForPeriodAsync(int dealerId, DateOnly startDate, DateOnly endDate);
        Task<decimal> CalculateActualSalesAsync(int dealerId, DateOnly startDate, DateOnly endDate);

        Task<IEnumerable<Debt>> GetDebtsByDealerIdAsync(int dealerId);
        Task<DealerContract?> GetContractByIdAsync(int contractId);
        void UpdateContract(DealerContract contract); // Không cần async vì nó chỉ đánh dấu thay đổi
    }
}
