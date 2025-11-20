using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.DealerManagement
{
    // Ghi chú: "Hợp đồng" tổng hợp các chức năng nghiệp vụ mà Service phải cung cấp.
    public interface IDealerManagementService
    {
        // --- Chức năng Tạo mới ---
        Task<ContractDto> CreateContractAsync(int dealerId, CreateContractDto contractDto);
        Task<TargetDto> SetTargetAsync(int dealerId, SetTargetDto targetDto);

        // --- Chức năng Đọc & Phân tích ---
        Task<IEnumerable<ContractDto>> GetContractsAsync(int dealerId);
        Task<IEnumerable<TargetDto>> GetTargetsAsync(int dealerId);
        Task<DealerPerformanceDto> TrackPerformanceAsync(int dealerId, DateOnly startDate, DateOnly endDate);

        Task<IEnumerable<DebtDto>> GetDebtsAsync(int dealerId);

    }
}
