using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: Đây là "bản hợp đồng", định nghĩa các hành động bắt buộc phải có
// khi làm việc với dữ liệu của Kho (Inventory) và Điều phối (Distribution).
using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.DAL.Repositories
{
    public interface IInventoryRepository
    {
        // Hợp đồng: Phải có chức năng tìm hoặc tạo mới một bản ghi tồn kho.
        // Điều này rất quan trọng để tránh lỗi khi một sản phẩm lần đầu được nhập vào một kho mới.
        Task<Inventory> GetOrCreateInventoryRecordAsync(int vehicleId, int configId, string locationType, int locationId);

        // Hợp đồng: Phải có chức năng thêm một phiếu điều phối mới vào CSDL.
        Task AddDistributionAsync(Distribution distribution);

        // Hợp đồng: Phải có chức năng tìm một phiếu điều phối theo ID của nó.
        Task<Distribution> GetDistributionByIdAsync(int distributionId);

        // Hợp đồng: Phải có chức năng lưu tất cả các thay đổi vào CSDL.
        Task<bool> SaveChangesAsync();
    }
}
