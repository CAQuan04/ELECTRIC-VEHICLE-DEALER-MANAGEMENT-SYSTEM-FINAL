// File: SalesDataInput.cs
using Microsoft.ML.Data;

namespace EVDealer.BE.Common.MLModels
{
    // Ghi chú: Lớp này định nghĩa cấu trúc của MỘT DÒNG dữ liệu đầu vào cho mô hình AI.
    // Đây là "thức ăn" mà chúng ta sẽ cung cấp cho AI để nó học.
    // Mỗi thuộc tính (property) ở đây tương ứng với một cột trong bộ dữ liệu huấn luyện.
    public class SalesDataInput
    {
        // Ghi chú: Thuộc tính [LoadColumn(index)] chỉ cho ML.NET biết cột này ở vị trí thứ mấy
        // khi nó đọc dữ liệu. Index bắt đầu từ 0.

        // Ghi chú: Đây là cột "Label" (nhãn) - là giá trị mà chúng ta muốn mô hình dự đoán.
        // Trong trường hợp này, chúng ta muốn dự đoán số lượng (Quantity).
        [LoadColumn(0)]
        public float Quantity { get; set; }

        // Ghi chú: Các cột còn lại là "Features" (đặc trưng) - những thông tin
        // mà mô hình sẽ sử dụng để đưa ra dự đoán. ML.NET yêu cầu các feature
        // phải ở dạng số (float) để tính toán.

        [LoadColumn(1)]
        public float Year { get; set; }

        [LoadColumn(2)]
        public float Month { get; set; }

        [LoadColumn(3)]
        public float Day { get; set; }

        [LoadColumn(4)]
        public float DayOfWeek { get; set; }

        // Ghi chú: Mã hóa ID của xe. Thay vì dùng chuỗi "VF8", chúng ta dùng số 4.
        [LoadColumn(5)]
        public float EncodedVehicleId { get; set; }

        // Ghi chú: Mã hóa ID của đại lý. Thay vì dùng tên "Đại lý Hà Nội", chúng ta dùng số 2.
        [LoadColumn(6)]
        public float EncodedDealerId { get; set; }
    }
}