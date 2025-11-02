using System;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho Unit of Work. Nó là một trình quản lý cho tất cả các Repository.
    public interface IUnitOfWork : IDisposable
    {
        // Ghi chú: Cung cấp quyền truy cập đến tất cả các repository cần thiết.
        IPricingRepository Pricing { get; }
        // ... bạn có thể thêm các repository khác ở đây, ví dụ: IDealerManagementRepository Dealers { get; }

        // Ghi chú: Bổ sung một thuộc tính mới vào "hợp đồng" Unit of Work.
        IDemandForecastRepository DemandForecasts { get; }

        IAnalyticsRepository Analytics { get; }

        // === PHẦN BỔ SUNG: KHAI BÁO CÁC "BỘ PHẬN" MỚI ===
        // Ghi chú: Thêm dòng này để "bắt buộc" mọi Unit of Work phải có khả năng cung cấp
        // một IVehicleRepository.
        IVehicleRepository Vehicles { get; }

        // Ghi chú: Tương tự, bắt buộc phải cung cấp một IDealerRepository.
        IDealerRepository Dealers { get; }

        // Ghi chú: Hành động "khóa két sắt" - thực thi tất cả các thay đổi trong một giao dịch.
        IDistributionSuggestionRepository DistributionSuggestions { get; }
        IUserRepository Users { get; }
        Task<int> CompleteAsync();
    }
}