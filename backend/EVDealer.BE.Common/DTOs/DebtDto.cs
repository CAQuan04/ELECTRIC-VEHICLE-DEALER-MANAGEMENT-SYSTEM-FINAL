using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    public class DebtDto
    {
        // Mã định danh của công nợ.
        public int DebtId { get; set; }

        // Mã của đại lý đang nợ.
        public int DealerId { get; set; }

        // Số tiền nợ.
        public decimal AmountDue { get; set; }

        // Ngày đến hạn thanh toán.
        public DateOnly DueDate { get; set; }

        // Trạng thái của công nợ (ví dụ: "Pending", "Paid", "Overdue").
        public string Status { get; set; }
    }
}
