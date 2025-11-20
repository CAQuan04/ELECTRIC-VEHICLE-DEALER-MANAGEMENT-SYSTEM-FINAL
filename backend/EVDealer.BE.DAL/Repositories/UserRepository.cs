using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


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
            return await _context.Users.Include(u => u.Role).ThenInclude(r => r.RolePermissions).ThenInclude(rp => rp.Permission).FirstOrDefaultAsync(u => u.Username == username);

        }

        //Phần chức năng quản lý user cho Admin
        public async Task<User> GetByIdAsync(int userId)
        {
            //Khi lấy một user, luôn kèm theo thông tin Role và Dealer của họ
            return await _context.Users.Include(u => u.Role)
                .Include(u => u.Dealer)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            //Lấy tất cả user và thông tin liên quan
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Dealer)
                .OrderBy(u => u.FullName)
                .ToListAsync();
        }
        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }
        public void Update(User user)
        {
            _context.Users.Update(user);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
