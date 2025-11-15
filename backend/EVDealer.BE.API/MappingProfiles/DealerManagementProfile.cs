using AutoMapper;
using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;

namespace EVDealer.BE.API.MappingProfiles
{
    public class DealerManagementProfile : Profile
    {
        public DealerManagementProfile()
        {
            // === Quy tắc 1: Mapping hai chiều giữa DealerContract và ContractDto ===
            // Ghi chú: CreateMap định nghĩa cách chuyển từ nguồn (source) sang đích (destination).
            // ReverseMap() tự động tạo ra quy tắc mapping ngược lại.
            CreateMap<DealerContract, ContractDto>().ReverseMap();

            // === Quy tắc 2: Mapping từ CreateContractDto sang DealerContract ===
            // Ghi chú: Vì CreateContractDto không có các trường như ContractId, DealerId,
            // chúng ta chỉ cần định nghĩa mapping một chiều.
            CreateMap<CreateContractDto, DealerContract>();

            // === Quy tắc 3: Mapping hai chiều giữa DealerTarget và TargetDto ===
            CreateMap<DealerTarget, TargetDto>().ReverseMap();

            // === Quy tắc 4: Mapping từ SetTargetDto sang DealerTarget ===
            CreateMap<SetTargetDto, DealerTarget>();

            CreateMap<Debt, DebtDto>();
        }
    }
}