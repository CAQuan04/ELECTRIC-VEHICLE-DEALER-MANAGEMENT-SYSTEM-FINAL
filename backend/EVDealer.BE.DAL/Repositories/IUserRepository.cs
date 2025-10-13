using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ghi chú: Đây là "bản hợp đồng", định nghĩa những gì có thể làm với dữ liệu User.
// Dùng interface giúp mã nguồn linh hoạt và dễ kiểm thử hơn.
using EVDealer.BE.DAL.Models;
namespace EVDealer.BE.DAL.Repositories
{
    public interface IUserRepository
    {
        // Chức năng: Tìm một người dùng dựa vào tên đăng nhập.
        Task<User> GetByUsernameAsync(string username);
    }
}
