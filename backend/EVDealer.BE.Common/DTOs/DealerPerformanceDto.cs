using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: DTO để trả về báo cáo hiệu suất của đại lý.
    public class DealerPerformanceDto
    {
        public int DealerId { get; set; }
        public DateOnly PeriodStart { get; set; }
        public DateOnly PeriodEnd { get; set; }
        public decimal SalesTarget { get; set; }
        public decimal ActualSales { get; set; }
        public decimal Difference => ActualSales - SalesTarget;
        public decimal AchievementPercentage => SalesTarget > 0 ? Math.Round((ActualSales / SalesTarget) * 100, 2) : 0;
        public string Message { get; set; }
    }
}
