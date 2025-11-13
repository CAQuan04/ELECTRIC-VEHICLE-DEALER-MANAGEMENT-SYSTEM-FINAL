using EVDealer.BE.DAL.Data;
using EVDealer.BE.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: Lớp triển khai thực tế của IRoleRepository.
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        public RoleRepository(ApplicationDbContext context) => _context = context;

        // Ghi chú: Triển khai phương thức GetAllAsync, lấy tất cả bản ghi từ bảng Roles.
        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            // Ghi chú: Dùng AsNoTracking() để tăng hiệu suất vì chỉ đọc dữ liệu.
            return await _context.Roles.AsNoTracking().ToListAsync();
        }
    }
}