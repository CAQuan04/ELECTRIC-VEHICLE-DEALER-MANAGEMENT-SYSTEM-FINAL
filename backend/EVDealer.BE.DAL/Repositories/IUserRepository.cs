using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using EVDealer.BE.DAL.Models;
namespace EVDealer.BE.DAL.Repositories
{
    public interface IUserRepository
    {
        // Chức năng: Tìm một người dùng dựa vào tên đăng nhập.
        Task<User> GetByUsernameAsync(string username);
    }
}
