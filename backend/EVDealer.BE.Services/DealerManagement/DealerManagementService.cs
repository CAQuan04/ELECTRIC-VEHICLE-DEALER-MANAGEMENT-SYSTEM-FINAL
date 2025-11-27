using AutoMapper;
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using FluentNHibernate.Automapping;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public async Task<IEnumerable<DebtDto>> GetDebtsAsync(int dealerId)
        {
            var debtsFromDb = await _dealerRepo.GetDebtsByDealerIdAsync(dealerId);
            // Ghi chú: Sử dụng AutoMapper để chuyển đổi List<Debt> thành List<DebtDto>.
            return _mapper.Map<IEnumerable<DebtDto>>(debtsFromDb);
        }

        public async Task<ContractDto?> UploadContractFileAsync(int dealerId, int contractId, IFormFile file)
        {
            // 1. Kiểm tra nghiệp vụ
            if (file == null || file.Length == 0)
                throw new ArgumentException("Không có file nào được tải lên.");

            if (Path.GetExtension(file.FileName).ToLower() != ".pdf")
                throw new ArgumentException("Chỉ chấp nhận file định dạng PDF.");

            var contract = await _dealerRepo.GetContractByIdAsync(contractId);
            if (contract == null || contract.DealerId != dealerId)
            {
                // Không tìm thấy hợp đồng hoặc hợp đồng không thuộc đại lý này
                return null;
            }

            // 2. Xử lý lưu file
            // Tạo một tên file duy nhất để tránh trùng lặp
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            // Định nghĩa đường dẫn lưu file trên server (ví dụ: wwwroot/uploads/contracts)
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "contracts", fileName);

            // Tạo thư mục nếu chưa tồn tại
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            // Lưu file vào đường dẫn đã định
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 3. Cập nhật CSDL
            // Tạo đường dẫn URL có thể truy cập từ bên ngoài
            var fileUrl = $"/uploads/contracts/{fileName}";
            contract.ContractFileUrl = fileUrl;

            _dealerRepo.UpdateContract(contract);
            await _dealerRepo.SaveChangesAsync();

            // 4. Trả về DTO đã được cập nhật
            return _mapper.Map<ContractDto>(contract);
        }
    }
}
