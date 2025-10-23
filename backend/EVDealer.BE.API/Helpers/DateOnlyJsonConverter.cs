// Ghi chú: Đây là một lớp "phiên dịch viên" tùy chỉnh.
// Nhiệm vụ của nó là dạy cho System.Text.Json cách đọc và viết kiểu dữ liệu DateOnly.
using System.Text.Json;
using System.Text.Json.Serialization;

namespace EVDealer.BE.API.Helpers
{
    public class DateOnlyJsonConverter : JsonConverter<DateOnly>
    {
        // Ghi chú: Định dạng chuẩn ISO 8601 cho ngày.
        // "O" (Round-trip format) cho DateOnly sẽ tự động ra "yyyy-MM-dd".
        private const string Format = "O";

        // Ghi chú: Phương thức này được gọi khi API nhận JSON từ client và cần
        // chuyển đổi một chuỗi (ví dụ: "2025-12-31") thành đối tượng DateOnly.
        public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // Đọc chuỗi từ JSON.
            var dateString = reader.GetString();
            // Phân tích chuỗi đó thành đối tượng DateOnly.
            // Nếu chuỗi không hợp lệ, nó sẽ throw exception và API sẽ trả về lỗi 400 Bad Request.
            return DateOnly.ParseExact(dateString, Format);
        }

        // Ghi chú: Phương thức này được gọi khi API gửi JSON cho client và cần
        // chuyển đổi một đối tượng DateOnly thành một chuỗi (ví dụ: "2025-12-31").
        public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        {
            // Chuyển đổi đối tượng DateOnly thành chuỗi theo định dạng đã định nghĩa.
            writer.WriteStringValue(value.ToString(Format));
        }
    }
}