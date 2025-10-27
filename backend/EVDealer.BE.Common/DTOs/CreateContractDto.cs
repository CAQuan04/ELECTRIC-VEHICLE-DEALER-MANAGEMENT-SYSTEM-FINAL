using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO để nhận dữ liệu khi tạo mới một hợp đồng.
    public class CreateContractDto
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Terms { get; set; }
        public string Status { get; set; }
    }
}
