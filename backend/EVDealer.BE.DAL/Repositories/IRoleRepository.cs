using EVDealer.BE.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho các thao tác với bảng Role.
    public interface IRoleRepository
    {
        // Ghi chú: Yêu cầu phải có một phương thức để lấy tất cả các vai trò.
        Task<IEnumerable<Role>> GetAllAsync();
    }
}