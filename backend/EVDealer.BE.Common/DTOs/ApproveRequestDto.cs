using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EVDealer.BE.Common.DTOs
{
    /// <summary>
    /// Định nghĩa một item trong danh sách được duyệt.
    /// </summary>
    public class ApproveRequestItemDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int VehicleId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng duyệt phải lớn hơn 0.")]
        public int Quantity { get; set; }
    }

    /// <summary>
    /// DTO nhận dữ liệu từ body của API khi EVM Staff duyệt một yêu cầu đặt xe.
    /// </summary>
    public class ApproveRequestDto
    {
        /// <summary>
        /// Danh sách các sản phẩm và số lượng được duyệt.
        /// Nếu danh sách này là null hoặc rỗng, hệ thống sẽ hiểu là duyệt toàn bộ yêu cầu.
        /// Nếu danh sách này có dữ liệu, hệ thống sẽ hiểu là duyệt một phần.
        /// </summary>
        public List<ApproveRequestItemDto>? ApprovedItems { get; set; }
    }
}