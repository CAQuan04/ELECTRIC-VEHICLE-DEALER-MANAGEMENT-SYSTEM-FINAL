# Test Drive - Tính năng Xác nhận Trả xe và Ghi nhận Thời gian

## 📋 Tổng quan

Tính năng này cho phép nhân viên dealer ghi nhận thời gian thực tế khi:
- **Giao xe**: Xác nhận thời điểm khách hàng bắt đầu lái thử
- **Trả xe**: Xác nhận thời điểm khách hàng trả xe và tự động tính thời lượng sử dụng

## 🎯 Quy trình làm việc

### 1. Tạo lịch lái thử (Test Drive)
- Tạo lịch hẹn với khách hàng
- Trạng thái: **Pending** (Chờ xác nhận)

### 2. Xác nhận lịch
- Nhân viên xác nhận lịch hẹn
- Trạng thái: **Confirmed** (Đã xác nhận)

### 3. Bắt đầu lái thử (Giao xe) ⭐ MỚI
- Khi khách hàng đến và sẵn sàng lái thử
- Nhân viên nhấn nút **"Bắt đầu lái thử (Giao xe)"**
- Hệ thống ghi nhận `ActualStartTime` (Thời gian thực tế bắt đầu)
- Trạng thái: Vẫn là **Confirmed** nhưng đã có thời gian bắt đầu

### 4. Trả xe ⭐ MỚI
- Khi khách hàng quay lại trả xe
- Nhân viên nhấn nút **"Xác nhận trả xe"**
- Hệ thống tự động:
  - Ghi nhận `ActualEndTime` (Thời gian trả xe)
  - Tính toán `DurationMinutes` (Thời lượng sử dụng thực tế)
  - Cập nhật trạng thái: **Completed** (Hoàn thành)

## 💻 Cấu trúc Database

### Các trường mới thêm vào bảng `TestDrive`:

```sql
ActualStartTime    DATETIME2 NULL    -- Thời gian thực tế bắt đầu lái thử
ActualEndTime      DATETIME2 NULL    -- Thời gian thực tế trả xe
DurationMinutes    INT NULL          -- Thời lượng sử dụng (phút)
```

## 🔧 Cách chạy Migration

### Option 1: Sử dụng SQL Script trực tiếp
```bash
# Mở file SQL và chạy trong SQL Server Management Studio hoặc Azure Data Studio
backend/EVDealer.BE.DAL/Migrations/AddTestDriveTimingFields.sql
```

### Option 2: Sử dụng Entity Framework Core (nếu đã cấu hình)
```bash
cd backend/EVDealer.BE.DAL
dotnet ef migrations add AddTestDriveTimingFields
dotnet ef database update
```

## 📡 API Endpoints

### 1. Bắt đầu lái thử (Giao xe)
```http
POST /api/TestDrives/{testId}/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "actualStartTime": "2024-11-10T09:30:00"
}
```

**Response:**
```json
{
  "testId": 1,
  "status": "Confirmed",
  "actualStartTime": "2024-11-10T09:30:00",
  "actualEndTime": null,
  "durationMinutes": null
}
```

### 2. Xác nhận trả xe
```http
POST /api/TestDrives/{testId}/return
Authorization: Bearer {token}
Content-Type: application/json

{
  "actualEndTime": "2024-11-10T10:45:00",
  "feedback": "Khách hàng rất hài lòng với trải nghiệm"
}
```

**Response:**
```json
{
  "testId": 1,
  "status": "Completed",
  "actualStartTime": "2024-11-10T09:30:00",
  "actualEndTime": "2024-11-10T10:45:00",
  "durationMinutes": 75
}
```

## 🎨 Giao diện Frontend

### TestDriveDetail Page - Các nút hành động:

#### Khi trạng thái = Confirmed và chưa bắt đầu:
- ✅ **Bắt đầu lái thử (Giao xe)** - Button màu xanh primary
- ❌ **Hủy lịch** - Button màu vàng warning

#### Khi đã bắt đầu (có ActualStartTime) nhưng chưa trả:
- ✅ **Xác nhận trả xe** - Button màu xanh primary
- ℹ️ Hiển thị thông báo: "Đang trong quá trình lái thử..."

#### Khi đã hoàn thành (Completed):
- 🛒 **Tạo đơn hàng** - Nút chuyển sang tạo order

### Hiển thị thông tin thời gian:

```
📅 Thông tin lịch hẹn
- Ngày: Thứ Bảy, 10 tháng 11 năm 2024
- Giờ: 09:00
- Thời lượng dự kiến: 60 phút

⏱️ Thời gian thực tế
- 🚗 Thời gian bắt đầu (giao xe): 10/11/2024 09:30:00
- 🏁 Thời gian kết thúc (trả xe): 10/11/2024 10:45:00
- ⌛ Thời gian sử dụng thực tế: 75 phút (1 giờ 15 phút)
```

## 🚀 Frontend Usage

### Sử dụng API trong component:

```javascript
import { dealerAPI } from '@/utils/api/services/dealer.api.js';

// Bắt đầu lái thử
const handleStartTestDrive = async (testId) => {
  const result = await dealerAPI.startTestDrive(testId, new Date());
  if (result.success) {
    console.log('Started:', result.data);
  }
};

// Xác nhận trả xe
const handleReturnTestDrive = async (testId, feedback) => {
  const result = await dealerAPI.returnTestDrive(testId, new Date(), feedback);
  if (result.success) {
    console.log('Returned:', result.data);
    console.log('Duration:', result.data.durationMinutes, 'minutes');
  }
};
```

## 📊 Business Logic

### Validation Rules:

1. **Bắt đầu lái thử:**
   - Trạng thái phải là `Confirmed`
   - Chưa có `ActualStartTime`

2. **Xác nhận trả xe:**
   - Phải đã có `ActualStartTime`
   - Chưa có `ActualEndTime`
   - `ActualEndTime` phải sau `ActualStartTime`

3. **Tự động:**
   - Khi trả xe, tự động tính `DurationMinutes = (ActualEndTime - ActualStartTime)`
   - Tự động chuyển status sang `Completed`

## 🔐 Authorization

Tất cả các endpoint yêu cầu role:
- `DealerStaff`
- `DealerManager`
- `EVMStaff`
- `Admin`

## 📝 Notes

- Thời gian được lưu dưới dạng UTC trong database
- Frontend hiển thị theo múi giờ Việt Nam (vi-VN)
- Duration được tính bằng phút và hiển thị cả dạng "giờ phút" nếu >= 60 phút
- Feedback có thể được thêm khi trả xe hoặc sau đó

## 🐛 Troubleshooting

### Database không có cột mới?
```bash
# Chạy migration SQL script
# Xem file: backend/EVDealer.BE.DAL/Migrations/AddTestDriveTimingFields.sql
```

### API trả về 400 Bad Request?
- Kiểm tra trạng thái hiện tại của test drive
- Đảm bảo đã bắt đầu trước khi trả xe
- Kiểm tra thời gian trả xe phải sau thời gian bắt đầu

### Frontend không hiển thị nút?
- Kiểm tra `testDrive.status`
- Kiểm tra `testDrive.actualStartTime` và `testDrive.actualEndTime`
- Reload lại data sau khi thực hiện action

## ✅ Testing Checklist

- [ ] Tạo test drive mới
- [ ] Xác nhận lịch (Pending → Confirmed)
- [ ] Bắt đầu lái thử (ghi nhận ActualStartTime)
- [ ] Xác nhận trả xe (ghi nhận ActualEndTime và DurationMinutes)
- [ ] Kiểm tra hiển thị thời gian trên UI
- [ ] Kiểm tra tính toán duration chính xác
- [ ] Kiểm tra validation khi trả xe trước khi bắt đầu
- [ ] Kiểm tra không thể bắt đầu 2 lần
- [ ] Kiểm tra không thể trả xe 2 lần
