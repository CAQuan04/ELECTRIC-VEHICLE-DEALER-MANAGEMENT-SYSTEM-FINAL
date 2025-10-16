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
    }
}
