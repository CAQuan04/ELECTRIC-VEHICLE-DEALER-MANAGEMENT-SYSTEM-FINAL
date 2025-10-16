using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations.Schema;

namespace EVDealer.BE.DAL.Models
{
    
    [Table("Role_Permission")]
    public class RolePermission
    {
        
        public int RoleId { get; set; }

        
        public int PermissionId { get; set; }

        //Thuộc tính điều hướng trỏ về đối tượng Role tương ứng.
        // Từ một RolePermission, ta có thể truy cập thông tin của Role.
        public virtual Role Role { get; set; }

        //Thuộc tính điều hướng trỏ về đối tượng Permission tương ứng.
        public virtual Permission Permission { get; set; }
    }
}
