// File: SalesPredictionOutput.cs
using Microsoft.ML.Data;

namespace EVDealer.BE.Common.MLModels
{
    // Ghi chú: Lớp này định nghĩa cấu trúc của kết quả dự báo do mô hình AI trả về.
    // Nó chỉ chứa những thông tin đầu ra mà chúng ta quan tâm.
    public class SalesPredictionOutput
    {
        // Ghi chú: Thuộc tính [ColumnName("Score")] là một quy ước của ML.NET.
        // Khi một mô hình hồi quy (regression) đưa ra dự đoán, nó sẽ đặt kết quả
        // vào một cột có tên mặc định là "Score". Thuộc tính này giúp chúng ta
        // lấy được giá trị đó một cách dễ dàng.
        [ColumnName("Score")]
        public float PredictedQuantity { get; set; }
    }
}