# 📋 BÁO CÁO TRIỂN KHAI HỆ THỐNG

## 🎯 TỔNG QUAN

Báo cáo này mô tả chi tiết việc kết nối và đồng bộ hóa Frontend (FE) và Backend (BE) cho các module:
1. **Test Drive Management** - Quản lý lịch lái thử
2. **Inventory & Purchase Management** - Quản lý kho và yêu cầu mua hàng

---

## 📊 1. TEST DRIVE MANAGEMENT

### ✅ Frontend Structure

#### Routes (App.jsx)
```jsx
// Routes với dealerId
/:dealerId/dealer/test-drives                    → TestDriveList (Tổng quan)
/:dealerId/dealer/test-drives/new                → TestDriveForm (Đăng ký mới)
/:dealerId/dealer/test-drives/calendar           → TestDriveCalendar (Lịch)
/:dealerId/dealer/test-drives/:id                → TestDriveDetail (Chi tiết)

// Routes không có dealerId (fallback)
/dealer/test-drives
/dealer/test-drives/new
/dealer/test-drives/calendar
/dealer/test-drives/:id
```

#### API Calls (dealer.api.js)
- `getTestDrives(dealerId, params)` → `GET /TestDrives/by-dealer/{dealerId}`
- `getTestDriveById(testDriveId)` → `GET /TestDrives/{testId}`
- `createTestDrive(testDriveData)` → `POST /TestDrives`
- `updateTestDriveStatus(id, status, feedback)` → `PUT /TestDrives/{testId}/status`
- `cancelTestDrive(testDriveId, reason)` → `PUT /TestDrives/{testId}/cancel`
- `getTestDriveStatuses()` → `GET /TestDrives/statuses`

### ✅ Backend Structure

#### Controller (TestDrivesController.cs)
- `GET /api/TestDrives/by-dealer/{dealerId}` ✅
- `GET /api/TestDrives/{testId}` ✅
- `POST /api/TestDrives` ✅
- `PUT /api/TestDrives/{testId}/status` ✅
- `PUT /api/TestDrives/{testId}/cancel` ✅
- `GET /api/TestDrives/statuses` ✅

#### DTOs
```csharp
TestDriveCreateDto {
    CustomerId, VehicleId, DealerId, ScheduleDatetime, Status
}
TestDriveUpdateStatusDto {
    Status, Feedback
}
TestDriveDto {
    TestId, CustomerId, CustomerName, VehicleId, VehicleModel, VehicleBrand,
    DealerId, DealerName, ScheduleDatetime, Status, Feedback
}
TestDriveQueryDto {
    Status, FromDate, ToDate, Page, Size
}
```

### ✅ Field Mapping (FE ↔ BE)

| Frontend Field | Backend Field | Ghi chú |
|---------------|---------------|---------|
| `testDriveId` / `testId` | `testId` | Primary key |
| `customerId` | `customerId` | FK to Customer |
| `customerName` | `customerName` | Derived from Customer |
| `vehicleId` | `vehicleId` | FK to Vehicle |
| `vehicleModel` / `vehicleName` | `vehicleModel` | Derived from Vehicle |
| `vehicleBrand` | `vehicleBrand` | Derived from Vehicle |
| `dealerId` | `dealerId` | FK to Dealer |
| `scheduleDatetime` | `scheduleDatetime` | DateTime |
| `status` | `status` | Enum: Pending, Confirmed, Completed, Cancelled |
| `feedback` | `feedback` | Optional string |

### ✅ Logic Flow
1. **TestDriveList** → Hiển thị tổng quan tất cả lịch lái thử
2. **Click vào mục** → Navigate đến `TestDriveDetail` (/:dealerId/dealer/test-drives/:id)
3. **Nhấn "Đăng ký mới"** → Navigate đến `TestDriveForm` (/:dealerId/dealer/test-drives/new)
4. **Form submit** → `POST /api/TestDrives` → Tạo lịch mới

---

## 📦 2. INVENTORY & PURCHASE MANAGEMENT

### 🎯 Business Logic Flow

```
STAFF → Tạo yêu cầu nhập xe (DistributionList/StockRequest)
   ↓
MANAGER → Xem & Duyệt yêu cầu (DistributionList)
   ↓
MANAGER → Tạo Purchase Request (PurchaseRequestList)
   ↓
XÁC NHẬN → RequestStockConfirmationModal (Password verification)
   ↓
GỬI → EVM/Hãng xe (Backend sends to EVM)
   ↓
NHẬN HÀNG → Xe vào kho (DealerInventory tăng quantity)
   ↓
BÁN HÀNG → Tự động giảm kho (Order creates → Inventory decreases)
```

### ✅ Frontend Structure

#### Pages
1. **DealerInventory.jsx** - Trang chính hiển thị kho xe
   - API: `getInventory(filters)` → `GET /dealer/inventory`
   - Hiển thị: Danh sách xe, số lượng, trạng thái
   - Actions: "Phiếu nhập hàng", "Yêu cầu mua hàng"

2. **DistributionList.jsx** - Danh sách yêu cầu nhập hàng từ Staff
   - API: `getStockRequests(filters)` → `GET /Inventory/distributions/requests`
   - Logic: Staff tạo → Manager duyệt

3. **DistributionRequestDetail.jsx** - Chi tiết yêu cầu
   - API: `getStockRequestById(requestId)` → `GET /Inventory/distributions/requests/{requestId}`
   - Actions: `approveStockRequest`, `rejectStockRequest`

4. **PurchaseRequestList.jsx** - Danh sách yêu cầu gửi EVM
   - Logic: Manager tạo Purchase Request sau khi duyệt Stock Request

5. **CreatePurchaseRequest.jsx** - Form tạo yêu cầu mua hàng
   - API: `requestStock(requestData)` → `POST /Inventory/distributions`
   - Modal: RequestStockConfirmationModal (xác nhận password)

### ✅ Backend Structure (CẦN BỔ SUNG)

#### Current Controllers
- **InventoryController.cs** ✅
  - `POST /api/Inventory/stock` ✅
  - `POST /api/Inventory/distributions` ✅
  - `POST /api/Inventory/distributions/{id}/confirm` ✅
  - `GET /api/Inventory/summary` ✅
  - `GET /api/Inventory/distributions/summary` ✅

- **PurchaseRequestsController.cs** ✅
  - `POST /api/procurement/requests` ✅
  - `GET /api/procurement/requests/mine` ✅
  - `GET /api/procurement/requests/pending` ✅
  - `PUT /api/procurement/requests/{requestId}/approve` ✅
  - `PUT /api/procurement/requests/{requestId}/reject` ✅

### 🔴 Missing Backend Endpoints

#### Cần tạo mới:

1. **GET /dealer/inventory** (hoặc /api/Inventory/dealer/{dealerId})
   - Trả về danh sách kho xe của dealer
   - Response: `List<DealerInventoryDto>`

2. **GET /dealer/inventory/{stockId}**
   - Chi tiết một item trong kho
   - Response: `DealerInventoryDetailDto`

3. **PUT /Inventory/update**
   - Cập nhật thông tin kho
   - Request: `UpdateInventoryDto`

4. **GET /Inventory/distributions/requests**
   - Danh sách yêu cầu nhập hàng từ Staff
   - Query params: `status`, `search`
   - Response: `List<StockRequestDto>`

5. **GET /Inventory/distributions/requests/{requestId}**
   - Chi tiết yêu cầu nhập hàng
   - Response: `StockRequestDetailDto`

6. **PUT /Inventory/distributions/requests/{requestId}/approve**
   - Manager duyệt yêu cầu
   - Response: `{ success: true, message: "Approved" }`

7. **PUT /Inventory/distributions/requests/{requestId}/reject**
   - Manager từ chối yêu cầu
   - Request: `{ reason: string }`
   - Response: `{ success: true, message: "Rejected" }`

### 📋 Required DTOs

```csharp
// Inventory DTOs
public class DealerInventoryDto {
    public int InventoryId { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; }
    public string Model { get; set; }
    public string Color { get; set; }
    public int Quantity { get; set; }
    public decimal BasePrice { get; set; }
    public string Status { get; set; } // Available, Reserved, Sold
}

// Stock Request DTOs
public class StockRequestDto {
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string VehicleName { get; set; }
    public string ConfigName { get; set; }
    public int Quantity { get; set; }
    public string RequestedBy { get; set; }
    public DateTime RequestDate { get; set; }
    public string Priority { get; set; } // Khẩn cấp, Cao, Bình thường
    public string Status { get; set; } // Pending, Approved, Rejected
    public string Reason { get; set; }
}

public class CreateStockRequestDto {
    public int VehicleId { get; set; }
    public int ConfigId { get; set; }
    public int Quantity { get; set; }
    public string Priority { get; set; }
    public string Reason { get; set; }
    public string Notes { get; set; }
}

public class UpdateInventoryDto {
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; }
}
```

---

## 🔧 Implementation Steps

### Phase 1: Backend Implementation ⏳

1. **Tạo DTOs** (trong `EVDealer.BE.Common/DTOs/`)
   - `DealerInventoryDto.cs`
   - `StockRequestDto.cs`
   - `CreateStockRequestDto.cs`

2. **Tạo/Cập nhật Repositories** (trong `EVDealer.BE.DAL/Repositories/`)
   - `IInventoryRepository.cs` và `InventoryRepository.cs`
   - Thêm methods: GetDealerInventory, GetStockRequests, etc.

3. **Tạo/Cập nhật Services** (trong `EVDealer.BE.Services/`)
   - `IInventoryService.cs` và `InventoryService.cs`
   - Implement business logic cho Stock Request flow

4. **Cập nhật Controllers**
   - `InventoryController.cs` - Thêm endpoints còn thiếu
   - Đảm bảo Authorization roles phù hợp

### Phase 2: Testing & Validation ⏳

1. Test tất cả endpoints với Postman/Swagger
2. Verify field mapping FE ↔ BE
3. Test flow: Staff → Manager → Purchase → EVM
4. Test inventory quantity updates

### Phase 3: Integration ⏳

1. Kết nối FE với BE endpoints mới
2. Test end-to-end flow
3. Fix bugs và optimize

---

## 📝 Notes & Best Practices

### Security
- Tất cả endpoints phải có `[Authorize]`
- Phân quyền: `DealerStaff` vs `DealerManager`
- RequestStockConfirmationModal cần verify password

### Business Rules
- **Kho chỉ thay đổi khi:**
  - Nhập từ hãng (Distribution confirmed)
  - Bán cho khách (Order completed)
- **KHÔNG thay đổi khi:**
  - Tạo báo giá (Quotation)
  - Tạo lái thử (Test Drive)
  - Đặt cọc (Reserved - chỉ đổi status)

### Error Handling
- Luôn dùng try-catch trong Controllers
- Trả về HTTP status codes chuẩn:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 404 Not Found
  - 500 Internal Server Error

### Code Quality
- Follow SOLID principles
- Clean Code practices
- Meaningful variable/method names
- Comments cho logic phức tạp

---

## ✅ Completed Tasks

- [x] Phân tích cấu trúc Frontend và API endpoints
- [x] Kiểm tra Backend TestDrive và mapping với FE
- [x] Cập nhật TestDrive routes trong App.jsx
- [x] Thêm missing API methods vào dealer.api.js
- [x] Tạo Implementation Summary document

## 🔄 Next Tasks

- [ ] Implement missing Backend DTOs
- [ ] Implement missing Backend Repository methods
- [ ] Implement missing Backend Service methods
- [ ] Implement missing Backend Controller endpoints
- [ ] Test all endpoints
- [ ] Verify end-to-end flow
- [ ] Update routing nếu cần

---

**Generated:** November 20, 2025  
**Version:** 1.0  
**Status:** In Progress
