using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Dùng để nhận dữ liệu khi Admin thay đổi trạng thái active/inactive.
namespace EVDealer.BE.Common.DTOs
{
    public class UserStatusUpdateDto
    {
        public string Status { get; set; }
    }
}
