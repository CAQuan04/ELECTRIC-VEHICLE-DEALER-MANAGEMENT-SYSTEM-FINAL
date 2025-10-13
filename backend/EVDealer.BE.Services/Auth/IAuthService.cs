using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: "Hợp đồng" cho dịch vụ xác thực.
using EVDealer.BE.Common.DTOs;
namespace EVDealer.BE.Services.Auth
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequest);
    }
}
