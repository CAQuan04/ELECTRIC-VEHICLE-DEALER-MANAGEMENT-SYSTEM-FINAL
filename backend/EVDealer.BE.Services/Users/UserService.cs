using EVDealer.BE.Common.DTOs;
using EVDealer.BE.DAL.Models;
using EVDealer.BE.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> CreateUserAsync(UserCreateDto userCreateDto)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(userCreateDto.Username);
            if (existingUser != null) return null; // Username đã tồn tại

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password);
            var newUser = new User
            {
                Username = userCreateDto.Username,
                PasswordHash = passwordHash,
                // === PHẦN BỔ SUNG: GÁN CÁC GIÁ TRỊ MỚI TỪ DTO ===
                FullName = userCreateDto.FullName,
                Email = userCreateDto.Email,
                PhoneNumber = userCreateDto.PhoneNumber,
                DateOfBirth = userCreateDto.DateOfBirth,
                CreatedAt = DateTime.UtcNow, // Ghi nhận thời gian tạo
                RoleId = userCreateDto.RoleId,
                DealerId = userCreateDto.DealerId,
                Status = "active"
            };

            await _userRepository.AddAsync(newUser);
            await _userRepository.SaveChangesAsync();

            // Sau khi lưu, newUser sẽ có UserId, chúng ta cần lấy lại để có đủ thông tin
            var createdUserWithDetails = await _userRepository.GetByIdAsync(newUser.UserId);
            return MapToUserDto(createdUserWithDetails);
        }

        public async Task<bool> UpdateUserAsync(int userId, UserUpdateDto userUpdateDto)
        {
            var userToUpdate = await _userRepository.GetByIdAsync(userId);
            if (userToUpdate == null) return false;

            userToUpdate.RoleId = userUpdateDto.RoleId;
            userToUpdate.DealerId = userUpdateDto.DealerId;
            // === PHẦN BỔ SUNG: CẬP NHẬT CÁC THÔNG TIN MỚI TỪ DTO ===
            userToUpdate.FullName = userUpdateDto.FullName;
            userToUpdate.Email = userUpdateDto.Email;
            userToUpdate.PhoneNumber = userUpdateDto.PhoneNumber;
            userToUpdate.DateOfBirth = userUpdateDto.DateOfBirth;
            userToUpdate.UpdatedAt = DateTime.UtcNow; // Ghi nhận thời gian cập nhật

            _userRepository.Update(userToUpdate);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> ChangeUserStatusAsync(int userId, UserStatusUpdateDto statusUpdateDto)
        {
            var userToUpdate = await _userRepository.GetByIdAsync(userId);
            if (userToUpdate == null) return false;

            if (userToUpdate.Username.Equals("admin", System.StringComparison.OrdinalIgnoreCase))
            {
                // Nếu là tài khoản admin, ném ra một lỗi nghiệp vụ rõ ràng.
                // Controller sẽ bắt lỗi này và trả về 400 Bad Request.
                throw new InvalidOperationException("Không thể thay đổi trạng thái của tài khoản Admin gốc.");
            }

            userToUpdate.Status = statusUpdateDto.Status;
            userToUpdate.UpdatedAt = DateTime.UtcNow;

            _userRepository.Update(userToUpdate);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return MapToUserDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToUserDto);
        }

        private UserDto MapToUserDto(User user)
        {
            if (user == null) return null;
            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                // === PHẦN BỔ SUNG: MAPPING CÁC TRƯỜNG MỚI SANG DTO ===
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,

                RoleId = user.RoleId,
                RoleName = user.Role?.RoleName,
                DealerId = user.DealerId,
                DealerName = user.Dealer?.Name,
                Status = user.Status
            };
        }
    }
}
