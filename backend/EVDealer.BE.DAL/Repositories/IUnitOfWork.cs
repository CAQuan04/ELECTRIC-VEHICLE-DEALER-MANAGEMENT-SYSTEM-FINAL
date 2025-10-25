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

        // Ghi chú: Hành động "khóa két sắt" - thực thi tất cả các thay đổi trong một giao dịch.
        Task<int> CompleteAsync();
    }
}