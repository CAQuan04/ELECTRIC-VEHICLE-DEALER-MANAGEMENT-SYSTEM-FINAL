using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace EVDealer.BE.DAL.Models
{
    [Table("Permissions")]
    public class Permission
    {
        [Key]
        public int PermissionId { get; set; }

        [Required]
        [StringLength(100)]
        public string PermissionName { get; set; }

        public virtual ICollection<RolePermission> RolePermissions { get; set; }
    }
}
