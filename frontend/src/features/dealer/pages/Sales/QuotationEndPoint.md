

### 📝 Yêu cầu Setup Endpoint: Tạo Báo Giá (Create Quotation)

**Endpoint:** `POST /dealer/quotations`

**Component Front-end (để tham khảo):** `CreateQuotation.jsx`

**Mô tả:** Endpoint này sẽ nhận toàn bộ dữ liệu cấu hình của một báo giá từ front-end, thực hiện tính toán lại giá, lưu vào CSDL, và (nếu được yêu cầu) tự động tạo PDF và gửi email cho khách hàng.

-----

### 1\. Request Body (Payload) mong đợi

Front-end sẽ gửi lên một object JSON với cấu trúc như sau:

```json
{
  // Dữ liệu Form chính
  "customerId": "kh-123",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "customerEmail": "nguyenvana@email.com",
  "vehicleId": "xe-model-y", 
  "basePrice": 1500000000,
  "discount": 0,
  "voucherCode": "SALE50",
  "voucherDiscount": 50000000,
  "paymentMethod": "financing",
  "validUntil": "2025-11-10T00:00:00.000Z", // (Date ISO String)
  "batteryPolicy": "thuê pin",
  "notes": "Khách hàng VIP",

  // Dữ liệu các tùy chọn
  "additionalOptions": [
    { "id": 2, "name": "Nội thất cao cấp", "price": 100000000 },
    { "id": 3, "name": "Autopilot nâng cao", "price": 150000000 }
  ],

  // Dữ liệu các dịch vụ
  "additionalServices": {
    "registration": "trọn gói",
    "interiorTrim": "carbon",
    "extendedWarranty": "1 năm"
  },

  // Cờ (flag) yêu cầu gửi email
  "sendEmail": true, 

  // (Optional) Front-end tính toán để tham khảo
  "priceBreakdown": {
    "basePrice": 1500000000,
    "optionsTotal": 250000000,
    "servicesTotal": 125000000,
    "subtotal": 1875000000,
    "totalDiscount": 50000000,
    "taxableAmount": 1825000000,
    "vat": 182500000,
    "registrationFee": 182500000,
    "total": 2190000000
  }
}
```

-----

### 2\. Logic nghiệp vụ (Yêu cầu Back-end)

1.  **Xác thực giá (Quan trọng):**

      * Không tin tưởng 100% vào `basePrice` và `priceBreakdown` do front-end gửi lên (chỉ dùng để tham khảo).
      * Back-end **PHẢI** dựa vào `vehicleId`, `additionalOptions` (dùng ID của option), `additionalServices` (dùng key), `voucherCode` để truy vấn CSDL và **tính toán lại** toàn bộ `priceBreakdown` (giá, thuế, tổng tiền) để đảm bảo bảo mật và chính xác về tài chính.

2.  **Lưu vào CSDL:**

      * Lưu toàn bộ báo giá (bao gồm cả `priceBreakdown` đã được BE tính toán lại) vào bảng `Quotations`.
      * Liên kết báo giá này với `customer_id`.

3.  **Xử lý Logic Gửi Email (Nếu có):**

      * Kiểm tra cờ `sendEmail`.
      * Nếu `sendEmail == true`:
          * **Tạo PDF:** Tự động tạo một file PDF báo giá (dựa trên dữ liệu vừa lưu) ở phía server.
          * **Gửi Email:** Sử dụng một dịch vụ email (SendGrid, Mailgun, Nodemailer...) để gửi email đến `customerEmail` và đính kèm (attach) file PDF vừa tạo.

-----

### 3\. Response (Phản hồi)

  * **Nếu thành công (Lưu + Gửi email nếu có):**
    ```json
    {
      "success": true,
      "data": { ... (object báo giá vừa được tạo) ... }
    }
    ```
  * **Nếu thất bại (Lỗi validate, lỗi server...):**
    ```json
    {
      "success": false,
      "message": "Lý do lỗi (ví dụ: Mã voucher không hợp lệ, không thể gửi email...)"
    }
    ```