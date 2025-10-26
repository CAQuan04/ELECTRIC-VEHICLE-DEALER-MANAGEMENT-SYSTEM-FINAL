using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EVDealer.BE.Common.DTOs;

namespace EVDealer.BE.DAL.Repositories
{
    // Ghi chú: "Hợp đồng" cho các hành động truy vấn dữ liệu phân tích.
    public interface IAnalyticsRepository
    {
        // Ghi chú: Hợp đồng yêu cầu phải có chức năng lấy dữ liệu doanh số được
        // nhóm theo Đại lý trong một khoảng thời gian.
        Task<IEnumerable<SalesReportItemDto>> GetSalesDataByDealerAsync(DateOnly startDate, DateOnly endDate);
    }

}
