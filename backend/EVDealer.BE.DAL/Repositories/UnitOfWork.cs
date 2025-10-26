using EVDealer.BE.DAL.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai thực tế của Unit of Work.
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        // Ghi chú: Khởi tạo các repository một lần duy nhất.
        public IPricingRepository Pricing { get; private set; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            // Ghi chú: "Bỏ" các repository vào bên trong Unit of Work.
            Pricing = new PricingRepository(_context);
        }

        // Ghi chú: Gọi SaveChangesAsync() của DbContext.
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Ghi chú: Giải phóng tài nguyên DbContext khi Unit of Work kết thúc.
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
