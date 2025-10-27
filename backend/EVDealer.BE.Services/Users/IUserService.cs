using EVDealer.BE.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Users
{
    public interface IUserService
    {
        Task<UserDto> CreateUserAsync(UserCreateDto userCreateDto);
        Task<bool> UpdateUserAsync(int userId, UserUpdateDto userUpdateDto);
        Task<bool> ChangeUserStatusAsync(int userId, UserStatusUpdateDto statusUpdateDto);
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
    }
}
