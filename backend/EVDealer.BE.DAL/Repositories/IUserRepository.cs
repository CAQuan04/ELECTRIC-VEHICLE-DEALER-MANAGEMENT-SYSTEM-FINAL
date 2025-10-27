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


        //Phần chức năng quản lý user cho Admin
        Task<User> GetByIdAsync(int userId);//Lấy user theo ID
        Task<IEnumerable<User>> GetAllAsync();//Lấy tất cả user
        Task AddAsync(User user);//Thêm user mới
        void Update(User user);//Đánh dấu user đã bị sửa đổi
        Task<bool> SaveChangesAsync();//Lưu các thay đổi vào DB
    }
}
