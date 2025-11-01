using System;
using System.Collections.Generic;

namespace EVDealer.BE.Common.DTOs
{
    // Ghi chú: Lớp này là "vỏ bọc" cho toàn bộ báo cáo, chứa các thông tin tổng quan.
    public class ProductionPlanReportDto
    {
        // Ghi chú: Tiêu đề của báo cáo, ví dụ: "Báo cáo Kế hoạch Sản xuất tháng 11/2025".
        public string ReportTitle { get; set; }

        // Ghi chú: Kỳ báo cáo mà các con số này áp dụng.
        public DateOnly ReportPeriodStart { get; set; }
        public DateOnly ReportPeriodEnd { get; set; }

        // Ghi chú: Danh sách chi tiết kế hoạch cho từng mẫu xe.
        public IEnumerable<ProductionPlanReportItemDto> PlanItems { get; set; }
    }
}