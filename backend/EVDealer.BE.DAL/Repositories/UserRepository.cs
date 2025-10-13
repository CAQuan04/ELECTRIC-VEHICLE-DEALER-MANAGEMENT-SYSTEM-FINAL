using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: Đây là nơi triển khai chi tiết các chức năng đã hứa trong "hợp đồng" IUserRepository.
// Mọi logic truy vấn CSDL liên quan đến User sẽ nằm gọn trong file này.
using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
namespace EVDealer.BE.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        // _context là cầu nối do Entity Framework cung cấp để giao tiếp với CSDL.
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context) => _context = context;

        public async Task<User> GetByUsernameAsync(string username)
        {
            // Ghi chú: Dòng lệnh này sẽ được EF Core dịch thành câu lệnh SQL SELECT...FROM...WHERE...JOIN...
            // .Include(u => u.Role) là một lệnh JOIN thông minh, giúp lấy luôn thông tin vai trò của người dùng.
            return await _context.Users.Include(u => u.Role)
                                   .FirstOrDefaultAsync(u => u.Username == username);
        }
    }
}
