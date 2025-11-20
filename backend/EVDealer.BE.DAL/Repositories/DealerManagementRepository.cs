using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai thực tế, chứa các câu lệnh Entity Framework.
    public class DealerManagementRepository : IDealerManagementRepository
    {
        private readonly ApplicationDbContext _context;
        public DealerManagementRepository(ApplicationDbContext context) => _context = context;

        // --- Triển khai GHI ---
        public async Task AddContractAsync(DealerContract contract) => await _context.DealerContracts.AddAsync(contract);
        public async Task AddTargetAsync(DealerTarget target) => await _context.DealerTargets.AddAsync(target);
        public async Task AddDebtAsync(Debt debt) => await _context.Debts.AddAsync(debt);
        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

        // --- Triển khai ĐỌC ---
        public async Task<IEnumerable<DealerContract>> GetContractsByDealerIdAsync(int dealerId) =>
            await _context.DealerContracts
                .Where(c => c.DealerId == dealerId)
                .OrderByDescending(c => c.StartDate)
                .ToListAsync();

        public async Task<IEnumerable<DealerTarget>> GetTargetsByDealerIdAsync(int dealerId) =>
            await _context.DealerTargets
                .Where(t => t.DealerId == dealerId)
                .OrderByDescending(t => t.PeriodStart)
                .ToListAsync();

        public async Task<DealerTarget?> GetTargetForPeriodAsync(int dealerId, DateOnly startDate, DateOnly endDate) =>
            await _context.DealerTargets.FirstOrDefaultAsync(t =>
                t.DealerId == dealerId &&
                t.PeriodStart <= endDate &&
                t.PeriodEnd >= startDate);

        public async Task<decimal> CalculateActualSalesAsync(int dealerId, DateOnly startDate, DateOnly endDate)
        {
            return await _context.SalesOrders
                .Where(o =>
                    o.DealerId == dealerId &&
                    o.Status == "Completed" && // <--- ĐIỂM NGHI VẤN SỐ 1
                    o.OrderDate >= startDate && // <-- ĐIỂM NGHI VẤN SỐ 2
                    o.OrderDate <= endDate)
                .SumAsync(o => o.TotalAmount);
        }

        public async Task<IEnumerable<Debt>> GetDebtsByDealerIdAsync(int dealerId)
        {
            return await _context.Debts
                .Where(d => d.DealerId == dealerId)
                .OrderByDescending(d => d.DueDate)
                .ToListAsync();
        }
    }
}
