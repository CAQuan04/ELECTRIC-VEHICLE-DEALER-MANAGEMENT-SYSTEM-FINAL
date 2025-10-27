using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.Services.IInventory
{
    public interface IInventoryService
    {
        // Hợp đồng: Phải có chức năng cập nhật tồn kho cho một địa điểm.
        Task<bool> UpdateStockAsync(UpdateStockDto updateStockDto);

        // Hợp đồng: Phải có chức năng tạo phiếu điều phối.
        Task<Distribution> CreateDistributionAsync(CreateDistributionDto createDistributionDto);

        // Hợp đồng: Phải có chức năng xác nhận nhận hàng, đây là nghiệp vụ cốt lõi.
        // Cần dealerId để xác thực đúng người nhận.
        Task<bool> ConfirmDistributionReceiptAsync(int distributionId, int dealerId);
    }
}
