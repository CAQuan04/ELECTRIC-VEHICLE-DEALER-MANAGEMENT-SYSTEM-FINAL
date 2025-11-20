# README: Hướng dẫn Logic & Use Cases (Cho BE)

Tài liệu này mô tả các luồng nghiệp vụ (Use Cases) mà Front-end (FE) đã implement cho tính năng **Quản lý Yêu cầu Mua hàng (Purchase Request)**.

## 🧍 Tác nhân (Actors)

* **Dealer Staff / Manager:** Người dùng đại lý, chịu trách nhiệm theo dõi tồn kho và tạo yêu cầu nhập thêm xe từ nhà sản xuất (EVM).

---

## 📋 UC-PR-1: Tra cứu Danh sách Yêu cầu Mua hàng

* **ID:** UC-PR-1
* **Component FE:** `PurchaseRequestList.jsx`
* **Mục tiêu:** Cho phép nhân viên/quản lý đại lý xem, lọc, và tra cứu trạng thái của tất cả các yêu cầu nhập xe đã gửi đến EVM.
* **Tiền điều kiện:** Người dùng đã đăng nhập và có quyền xem module.

### Luồng chính (Main Flow)

1.  Người dùng truy cập trang "Yêu cầu Mua hàng".
2.  Hệ thống (FE) tải danh sách các yêu cầu mua hàng.
    * *(Hiện tại FE đang dùng **mock data**, FE sẽ sớm cập nhật để gọi `dealerAPI.getPurchaseRequests()`)*.
3.  Hệ thống hiển thị các thẻ thống kê (`MetricCard`) về: Tổng số yêu cầu, Chờ duyệt, Đã duyệt, Đang xử lý.
4.  Người dùng được cung cấp các công cụ lọc:
    * Ô tìm kiếm (theo tên xe).
    * Dropdown lọc theo "Trạng thái".
    * Dropdown sắp xếp (theo Ngày, Chi phí).
5.  Hệ thống (FE) tự động lọc và sắp xếp lại bảng (`<Table>`) dựa trên lựa chọn của người dùng.
6.  Người dùng nhấn nút "Chi tiết" trên một hàng.
7.  Hệ thống điều hướng (`Maps`) đến trang chi tiết (ví dụ: `/dealer-dashboard/purchase-requests/:id`).

### Luồng phụ (Alternative Flow)

* **A1: Không tìm thấy yêu cầu:** Nếu danh sách rỗng (hoặc bộ lọc không có kết quả), hệ thống hiển thị component `<EmptyState>` với thông báo "Không tìm thấy yêu cầu".

### ⚡ Yêu cầu Back-end (Endpoints)

* `GET /dealer/purchase-requests`: (Endpoint chính) Cần hỗ trợ nhận các tham số `?search=`, `?status=`, `?sort=`.
* `GET /dealer/purchase-requests/:id`: Cần thiết cho nút "Chi tiết".

---

## 📋 UC-PR-2: Tạo Yêu cầu Mua hàng

* **ID:** UC-PR-2
* **Component FE:** `CreatePurchaseRequest.jsx`
* **Mục tiêu:** Cho phép đại lý tạo và gửi một yêu cầu nhập xe (với số lượng, lý do, độ ưu tiên) đến EVM.
* **Tiền điều kiện:** Người dùng đã đăng nhập.

### Luồng chính (Main Flow)

1.  Người dùng nhấn "Yêu cầu nhập hàng" (từ `PurchaseRequestList.jsx`).
2.  Hệ thống (FE) mở trang `CreatePurchaseRequest.jsx`.
3.  Hệ thống **tự động** gọi `dealerAPI.getVehicles()` để lấy danh sách xe và điền vào dropdown "Dòng xe".
4.  Người dùng chọn "Dòng xe" (`productId`), nhập "Số lượng", chọn "Mức độ ưu tiên", và nhập "Lý do yêu cầu".
5.  Người dùng nhấn "Gửi yêu cầu".
6.  Hệ thống (FE) thực hiện `validateForm` (kiểm tra các trường bắt buộc).
7.  Nếu hợp lệ, hệ thống hiển thị một Modal xác nhận (`RequestStockConfirmationModal`).
8.  Người dùng xác nhận trên Modal (logic trong `handleFinalSubmit`).
9.  Hệ thống (FE) đóng gói dữ liệu (bao gồm `productId`, `quantity`, `priority`, `notes`) và gọi `dealerAPI.requestStock(requestData)`.

### Luồng ngoại lệ (Exception Flow)

* **E1: Lỗi tải danh sách xe:** Nếu `dealerAPI.getVehicles()` thất bại, hệ thống hiển thị `alert`.
* **E2: Lỗi gửi yêu cầu:** Nếu `dealerAPI.requestStock()` thất bại, hệ thống hiển thị `alert` lỗi.

### ✅ Hậu điều kiện (Postconditions)

* Nếu `requestStock` thành công, hệ thống hiển thị `alert` "Tạo yêu cầu mua hàng thành công!".
* Người dùng được tự động điều hướng (`Maps`) trở lại trang danh sách (`/dealer/purchase-requests`).

### ⚡ Yêu cầu Back-end (Endpoints)

* `POST /dealer/inventory/request`: (Endpoint chính) Nhận và xử lý yêu cầu nhập kho.
* `GET /dealer/vehicles`: (Endpoint phụ) Cung cấp danh sách xe cho dropdown.