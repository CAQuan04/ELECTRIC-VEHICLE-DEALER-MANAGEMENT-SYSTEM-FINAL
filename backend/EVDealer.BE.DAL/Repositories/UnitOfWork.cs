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
        public IDemandForecastRepository DemandForecasts { get; private set; }
        public IAnalyticsRepository Analytics { get; private set; }

        // === PHẦN BỔ SUNG: THÊM CÁC THUỘC TÍNH TRIỂN KHAI ===
        public IVehicleRepository Vehicles { get; private set; }
        public IDealerRepository Dealers { get; private set; }
        public IUserRepository Users { get; private set; }
        public IDistributionSuggestionRepository DistributionSuggestions { get; private set; }
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;

            // --- KHỞI TẠO CÁC REPOSITORY ---
            // Ghi chú: "Bỏ" các phiên bản repository cụ thể vào bên trong Unit of Work.
            // Tất cả các repository này sẽ chia sẻ CÙNG MỘT DbContext,
            // điều này cực kỳ quan trọng để đảm bảo tính toàn vẹn của giao dịch (transaction).
            Users = new UserRepository(_context);
            Analytics = new AnalyticsRepository(_context);
            Pricing = new PricingRepository(_context);
            DemandForecasts = new DemandForecastRepository(_context);
            Vehicles = new VehicleRepository(_context);
            Dealers = new DealerRepository(_context);

            DistributionSuggestions = new DistributionSuggestionRepository(_context);
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
