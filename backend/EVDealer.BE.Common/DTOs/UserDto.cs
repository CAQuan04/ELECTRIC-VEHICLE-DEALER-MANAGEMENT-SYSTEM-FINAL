using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? DealerId { get; set; }
        public string DealerName { get; set; }
        public string Status { get; set; }
    }
}
