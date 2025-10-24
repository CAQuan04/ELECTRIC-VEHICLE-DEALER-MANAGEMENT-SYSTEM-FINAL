using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using FluentNHibernate.Automapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace EVDealer.BE.Services.DealerManagement
{
    // Ghi chú: Lớp triển khai logic nghiệp vụ.
    public class DealerManagementService : IDealerManagementService
    {
        private readonly IDealerManagementRepository _dealerRepo;
        // Ghi chú: Chúng ta sẽ dùng AutoMapper ở đây để code sạch sẽ hơn.
        // Giả định bạn đã cài đặt và cấu hình AutoMapper.
        private readonly AutoMapper.IMapper _mapper;

        public DealerManagementService(IDealerManagementRepository dealerRepo, AutoMapper.IMapper mapper)
        {
            _dealerRepo = dealerRepo;
            _mapper = mapper;
        }

        // --- Triển khai Tạo mới ---
        public async Task<ContractDto> CreateContractAsync(int dealerId, CreateContractDto contractDto)
        {
            var newContract = _mapper.Map<DealerContract>(contractDto);
            newContract.DealerId = dealerId;
            await _dealerRepo.AddContractAsync(newContract);
            await _dealerRepo.SaveChangesAsync();
            return _mapper.Map<ContractDto>(newContract);
        }

        public async Task<TargetDto> SetTargetAsync(int dealerId, SetTargetDto targetDto)
        {
            var newTarget = _mapper.Map<DealerTarget>(targetDto);
            newTarget.DealerId = dealerId;
            newTarget.ActualSales = 0;
            await _dealerRepo.AddTargetAsync(newTarget);
            await _dealerRepo.SaveChangesAsync();
            return _mapper.Map<TargetDto>(newTarget);
        }

        // --- Triển khai Đọc & Phân tích ---
        public async Task<IEnumerable<ContractDto>> GetContractsAsync(int dealerId)
        {
            var contractsFromDb = await _dealerRepo.GetContractsByDealerIdAsync(dealerId);
            return _mapper.Map<IEnumerable<ContractDto>>(contractsFromDb);
        }

        public async Task<IEnumerable<TargetDto>> GetTargetsAsync(int dealerId)
        {
            var targetsFromDb = await _dealerRepo.GetTargetsByDealerIdAsync(dealerId);
            return _mapper.Map<IEnumerable<TargetDto>>(targetsFromDb);
        }

        public async Task<DealerPerformanceDto> TrackPerformanceAsync(int dealerId, DateOnly startDate, DateOnly endDate)
        {
            var target = await _dealerRepo.GetTargetForPeriodAsync(dealerId, startDate, endDate);
            var actualSales = await _dealerRepo.CalculateActualSalesAsync(dealerId, startDate, endDate);

            if (target == null)
            {
                return new DealerPerformanceDto { /* ... xử lý khi không có chỉ tiêu ... */ };
            }

            return new DealerPerformanceDto
            {
                DealerId = dealerId,
                PeriodStart = target.PeriodStart,
                PeriodEnd = target.PeriodEnd,
                ActualSales = actualSales,
                SalesTarget = target.SalesTarget,
                Message = "Báo cáo hiệu suất."
            };
        }
    }
}
