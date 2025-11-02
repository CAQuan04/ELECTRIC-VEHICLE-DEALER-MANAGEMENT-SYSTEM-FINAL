# README: Hướng dẫn Logic & Use Cases (Dành cho Back-End)

Tài liệu này mô tả các luồng nghiệp vụ (Use Cases) chính mà Front-end (FE) đã implement, dựa trên các component React đã được xây dựng. Mục tiêu là để Back-end (BE) nắm được luồng dữ liệu, các yêu cầu đặc biệt, và setup các API endpoint tương ứng.

## 1. 🚀 Luồng Nghiệp vụ chính: Bán hàng (Sales Flow)

Đây là luồng quan trọng nhất, đi từ Báo giá -> Đơn hàng -> Thanh toán.

### Use Case 1: Tạo & Sửa Báo Giá (UC4)

* **Component FE:** `CreateQuotation.jsx`
* **Mô tả:** Đây là file "tất cả trong một" cho phép Tạo mới (Create) và Sửa (Edit) báo giá.
* **Logic FE:**
    1.  **Tải dữ liệu:** Khi component mount, FE gọi `dealerAPI.getCustomers()` và `dealerAPI.getInventory()` để lấy danh sách khách hàng và xe có sẵn.
    2.  **(Đang chờ BE)** FE đang dùng **mock data** cho "Tùy chọn" (availableOptions) và "Dịch vụ" (servicePrices). BE cần cung cấp API cho mục này.
    3.  **Tạo mới (Create):** Người dùng điền form.
    4.  **Sửa (Edit) (UC4):** Nếu có `quotationId` trên URL, FE gọi `dealerAPI.getQuotationById(id)` để điền dữ liệu cũ vào form.
    5.  **Tính toán:** FE tự tính toán toàn bộ chi phí (giá xe, tùy chọn, dịch vụ, giảm giá, voucher, VAT, phí trước bạ) và hiển thị trong `Card` "Tổng cộng".
    6.  **Submit:** Khi nhấn "Tạo báo giá" / "Lưu thay đổi", FE gọi `dealerAPI.createQuotation(data)` hoặc `dealerAPI.updateQuotation(id, data)`.

* **⚡ Yêu cầu đặc biệt cho BE:**
    * **Tính toán lại:** BE **phải** tính toán lại toàn bộ `priceBreakdown` (giá, thuế, v.v.) dựa trên ID của xe, tùy chọn, dịch vụ và mã voucher. **Không tin tưởng** con số `totalAmount` do FE gửi lên.
    * **Gửi Email (PDF):**
        * FE sẽ gửi một cờ (flag) `sendEmail: true` nếu người dùng check vào ô "Gửi PDF cho khách hàng".
        * Nếu `sendEmail: true`, BE phải tự tạo file PDF (dựa trên dữ liệu báo giá) và gửi email đính kèm đến `customerEmail`.
    * **In PDF:** Nút "Xuất PDF" ở FE sử dụng thư viện `@react-pdf/renderer`. Nó chỉ hoạt động khi BE cung cấp **font .ttf** (ví dụ: Roboto) trong thư mục `public/fonts/`.

### Use Case 2: Chuyển đổi Báo giá thành Đơn hàng (UC7)

* **Component FE:** `CreateOrder.jsx` (đã được thiết kế lại).
* **Mô tả:** Tính năng này **KHÔNG** phải là tạo đơn hàng từ đầu. Nó là bước "Chốt" một báo giá đã có.
* **Logic FE:**
    1.  Người dùng nhấn nút "Chuyển thành Đơn hàng" từ `QuotationList.jsx`.
    2.  Hệ thống điều hướng đến `/dealer/orders/create?quotationId=...`.
    3.  `CreateOrder.jsx` lấy `quotationId` từ URL.
    4.  FE gọi `dealerAPI.getQuotationById(quotationId)` để tải dữ liệu báo giá gốc.
    5.  FE hiển thị thông tin Khách hàng, Xe, Tùy chọn, Dịch vụ, và Tổng tiền (ở dạng **read-only** - chỉ đọc).
    6.  FE **chỉ yêu cầu** người dùng nhập các trường còn thiếu của Đơn hàng (theo UC7): "Tiền đặt cọc" (`downPayment`), "Địa chỉ giao xe" (`deliveryAddress`), và "Ngày giao dự kiến" (`estimatedDelivery`).
    7.  Khi submit, FE gọi `dealerAPI.createOrder(orderData)`.

* **⚡ Yêu cầu đặc biệt cho BE:**
    * Khi nhận `POST /dealer/orders`, BE phải kiểm tra `quotationId`.
    * BE phải tự động **sao chép toàn bộ dữ liệu** (thông tin xe, giá, tùy chọn, dịch vụ...) từ báo giá gốc (`quotationId`) sang đơn hàng mới, sau đó cập nhật trạng thái báo giá đó thành "Đã chuyển đổi" (Converted).

### Use Case 3: Ghi nhận Thanh toán

* **Component FE:** `PaymentForm.jsx`
* **Logic FE:**
    1.  Tải danh sách các đơn hàng (`dealerAPI.getOrders()`).
    2.  Người dùng chọn một đơn hàng từ dropdown.
    3.  FE hiển thị số tiền còn lại.
    4.  Người dùng nhập số tiền thanh toán, phương thức, mã giao dịch.
    5.  Submit gọi `dealerAPI.processPayment(orderId, paymentData)`.
* **⚡ Yêu cầu đặc biệt cho BE:**
    * Endpoint `POST /dealer/orders/:id/payment` cần xử lý việc cộng dồn thanh toán và cập nhật trạng thái của đơn hàng (ví dụ: "Đã thanh toán đủ").

## 2. 📊 Luồng Nghiệp vụ: Báo cáo & Công nợ

### Use Case 4: Báo cáo Doanh số (Sales Performance)

* **Component FE:** `SalesPerformanceReport.jsx`
* **Logic FE:**
    1.  Cho phép lọc theo `period` (month, quarter, year).
    2.  Gọi `dealerAPI.getSalesReport({ period })`.
    3.  Hiển thị dữ liệu lên các `StatCard` và Bảng.
* **⚡ Yêu cầu đặc biệt cho BE:**
    * Endpoint `GET /dealer/reports/sales-performance` phải trả về cấu trúc JSON chính xác như FE mong đợi (xem Ghi chú Setup Endpoint để biết chi tiết các trường).

### Use Case 5: Báo cáo Công nợ (Khách hàng & NCC)

* **Components FE:** `CustomerDebtReport.jsx`, `SupplierDebtReport.jsx`
* **Logic FE:**
    1.  Tải danh sách công nợ (`dealerAPI.getCustomerDebtReport` hoặc `getSupplierDebtReport`).
    2.  Cho phép lọc theo `status` (overdue, upcoming, ...).
    3.  Hiển thị lên bảng.
* **⚡ Yêu cầu đặc biệt cho BE:**
    * **Nhắc nợ (UC 1.D.2):**
        * `POST /dealer/debts/:debtId/remind`: Gửi nhắc nợ đơn lẻ.
        * `POST /dealer/debts/remind-bulk`: Gửi hàng loạt. FE sẽ gửi kèm `filters` (bao gồm `status` và `search`) trong body, BE phải xử lý lọc trước khi gửi.
    * **Xuất file (UC 1.D.2):**
        * `GET /dealer/reports/debt/export`: FE gọi hàm này (ví dụ: `?format=excel&type=customer`).
        * BE **phải** trả về file `blob` (Excel/PDF), không phải JSON.

## 3. 👤 Luồng Nghiệp vụ: Quản lý Khách hàng (CRUD)

* **Component FE:** `CustomerForm.jsx`
* **Logic FE:**
    1.  Tương tự `CreateQuotation`, file này xử lý cả "Tạo mới" và "Sửa" (dựa trên `customerId` từ URL).
    2.  **Địa chỉ:** Dữ liệu Tỉnh/Thành (`provinces.json`) và Xã/Phường (`wards.json`) được tải và xử lý lọc **hoàn toàn ở Front-end**.
    3.  **Submit (Sửa):** Gọi `dealerAPI.updateCustomer(id, data)`.
    4.  **Submit (Tạo):** Gọi `dealerAPI.createCustomer(data)`.
* **⚡ Yêu cầu đặc biệt cho BE:**
    * BE chỉ cần lưu `city` (ID tỉnh) và `ward` (ID xã).

---

## 4. 📋 Danh sách Endpoints BE Cần Chuẩn Bị (Tóm tắt)

(Dựa trên file `dealer.api.js` và các component)

| Phương thức | Endpoint | Chức năng (Front-end) |
| :--- | :--- | :--- |
| **Báo giá (Quotation)** | | |
| `POST` | `/dealer/quotations` | (UC4) Tạo báo giá mới. (BE phải xử lý `sendEmail`). |
| `GET` | `/dealer/quotations` | (UC6) Lấy danh sách báo giá. |
| `GET` | `/dealer/quotations/:id` | (UC4/UC7) Lấy chi tiết báo giá (để Sửa hoặc Chuyển đổi). |
| `PUT` | `/dealer/quotations/:id` | (UC4) Cập nhật báo giá. |
| **Đơn hàng (Order)** | | |
| `POST` | `/dealer/orders` | (UC7) Tạo đơn hàng MỚI (từ `quotationId`). |
| `GET` | `/dealer/orders` | Lấy danh sách đơn hàng (cho `OrderList` và `PaymentForm`). |
| **Thanh toán (Payment)** | | |
| `POST` | `/dealer/orders/:id/payment` | Ghi nhận thanh toán cho đơn hàng. |
| `GET` | `/dealer/payments` | Lấy lịch sử thanh toán. |
| **Khách hàng (Customer)** | | |
| `POST` | `/dealer/customers` | Tạo khách hàng mới. |
| `GET` | `/dealer/customers` | Lấy danh sách khách hàng. |
| `GET` | `/dealer/customers/:id` | Lấy chi tiết khách hàng (để Sửa). |
| `PUT` | `/dealer/customers/:id` | Cập nhật khách hàng. |
| **Báo cáo (Reports)** | | |
| `GET` | `/dealer/reports/sales-performance` | Lấy dữ liệu báo cáo doanh số (theo `period`). |
| `GET` | `/dealer/reports/customer-debt` | Lấy công nợ khách hàng (theo `status`). |
| `GET` | `/dealer/reports/supplier-debt` | Lấy công nợ nhà cung cấp (theo `status`). |
| `POST` | `/dealer/debts/:debtId/remind` | Gửi 1 nhắc nợ. |
| `POST` | `/dealer/debts/remind-bulk` | Gửi nhiều nhắc nợ (nhận `filters` trong body). |
| `GET` | `/dealer/reports/debt/export` | Xuất file (trả về `blob`). |
| **Dữ liệu Cấu hình (Đang thiếu)** | | |
| `GET` | `/dealer/vehicle-options` | (CẦN MỚI) Lấy danh sách Tùy chọn (Autopilot, v.v.). |
| `GET` | `/dealer/additional-services` | (CẦN MỚI) Lấy danh sách Dịch vụ (Đăng ký, Bảo hành). |
| `GET` | `/dealer/vouchers/apply?code=...` | (CẦN MỚI) Kiểm tra và lấy giá trị voucher. |