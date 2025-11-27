using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO để trả về thông tin chi tiết của một hợp đồng.
    public class ContractDto
    {
        public int ContractId { get; set; }
        public int DealerId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Terms { get; set; }
        public string Status { get; set; }
        public string? ContractFileUrl { get; set; }
    }
}
