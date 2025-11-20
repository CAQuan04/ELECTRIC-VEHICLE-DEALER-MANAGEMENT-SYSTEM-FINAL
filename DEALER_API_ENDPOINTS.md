# 📚 DEALER API ENDPOINTS DOCUMENTATION

> **Tài liệu đầy đủ về API endpoints cho hệ thống Dealer EVM**  
> **Phiên bản:** 1.0  
> **Cập nhật:** November 6, 2025

---

## 📋 MỤC LỤC

1. [Dashboard](#1-dashboard)
2. [Vehicle Management](#2-vehicle-management)
3. [Inventory Management](#3-inventory-management)
4. [Customer Management](#4-customer-management)
5. [Test Drive Management](#5-test-drive-management)
6. [User/Staff Management](#6-userstaff-management)
7. [Dealer Management](#7-dealer-management)
8. [Order Management](#8-order-management)
9. [Quotation Management](#9-quotation-management)
10. [Payment Management](#10-payment-management)
11. [Reports & Analytics](#11-reports--analytics)
12. [Promotion Management](#12-promotion-management)
13. [Dealer Profile](#13-dealer-profile)
14. [Notifications](#14-notifications)
15. [Feedback & Complaint Management](#15-feedback--complaint-management)

---

## 1. DASHBOARD

### 1.1 Get Dashboard Statistics
**Use Case:** UC 1.a.1 - Dashboard Overview  
**Method:** `GET`  
**Endpoint:** `/Dashboard/stats`  
**Auth Required:** Yes  
**Params:** None

**Response:**
```json
{
  "totalSales": 50000000000,
  "totalOrders": 125,
  "totalCustomers": 450,
  "totalTestDrives": 89,
  "recentOrders": [...],
  "salesTrend": {...}
}
```

**Use Case Description:**
- Actor: Dealer Manager, Staff
- Goal: Xem tổng quan hoạt động kinh doanh
- Includes: Doanh số, đơn hàng, khách hàng, lịch lái thử

---

## 2. VEHICLE MANAGEMENT

### 2.1 Get All Vehicles
**Use Case:** UC 1.a.2 - Xem danh sách xe  
**Method:** `GET`  
**Endpoint:** `/Vehicles`  
**Auth Required:** Yes

**Query Parameters:**
- `Search` (string): Tìm kiếm theo tên/model
- `Brand` (string): Lọc theo hãng
- `Model` (string): Lọc theo model
- `MinPrice` (number): Giá tối thiểu
- `MaxPrice` (number): Giá tối đa
- `Page` (number): Trang hiện tại
- `Size` (number): Số items mỗi trang

**Response:**
```json
{
  "items": [
    {
      "vehicleId": 1,
      "name": "Model 3",
      "brand": "Tesla",
      "price": 1200000000,
      "year": 2024,
      "color": "White",
      "range": 602,
      "topSpeed": 261,
      "acceleration": "3.1s",
      "horsepower": 480,
      "batteryCapacity": 82,
      "seats": 5,
      "drivetrain": "AWD"
    }
  ],
  "totalCount": 50,
  "pageNumber": 1,
  "pageSize": 10
}
```

### 2.2 Get Vehicle By ID
**Use Case:** UC 1.a.3 - Xem chi tiết xe  
**Method:** `GET`  
**Endpoint:** `/Vehicles/{vehicleId}`  
**Auth Required:** Yes

**Response:**
```json
{
  "vehicleId": 1,
  "name": "Model 3",
  "description": "Electric sedan...",
  "specifications": {...},
  "images": [...],
  "availability": "In Stock"
}
```

### 2.3 Search Vehicles
**Use Case:** UC 1.a.4 - Tìm kiếm xe  
**Method:** `GET`  
**Endpoint:** `/Vehicles?Search={query}`  
**Auth Required:** Yes

**Query Parameters:**
- `Search` (string): Từ khóa tìm kiếm
- `Brand` (string): Lọc theo hãng
- `Model` (string): Lọc theo model

### 2.4 Compare Vehicles
**Use Case:** UC 1.a.5 - So sánh xe  
**Method:** `POST`  
**Endpoint:** `/Vehicles/compare`  
**Auth Required:** Yes

**Request Body:**
```json
[1, 2, 3]
```

**Response:**
```json
[
  {
    "vehicleId": 1,
    "name": "Model 3",
    "price": 1200000000,
    "range": 602,
    "topSpeed": 261,
    ...
  }
]
```

### 2.5 Get Vehicle Configurations
**Use Case:** UC 1.a.6 - Xem cấu hình xe  
**Method:** `GET`  
**Endpoint:** `/Vehicles/{vehicleId}/configs`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "configId": 1,
    "name": "Standard Range",
    "price": 1200000000,
    "features": [...]
  }
]
```

---

## 3. INVENTORY MANAGEMENT

### 3.1 Get Inventory List
**Use Case:** UC 1.d.1 - Xem tồn kho  
**Method:** `GET`  
**Endpoint:** `/dealer/inventory`  
**Auth Required:** Yes

**Query Parameters:**
- `vehicleId` (number): Lọc theo xe
- `status` (string): Trạng thái (Available, Reserved, Sold)

**Response:**
```json
[
  {
    "stockId": 1,
    "vehicleId": 1,
    "vehicleName": "Model 3",
    "quantity": 5,
    "status": "Available",
    "location": "Warehouse A"
  }
]
```

### 3.2 Get Stock Details
**Use Case:** UC 1.d.2 - Xem chi tiết kho  
**Method:** `GET`  
**Endpoint:** `/dealer/inventory/{stockId}`  
**Auth Required:** Yes

### 3.3 Request Stock Distribution
**Use Case:** UC 1.d.3 - Yêu cầu nhập kho  
**Method:** `POST`  
**Endpoint:** `/Inventory/distributions`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "vehicleId": 1,
  "configId": 1,
  "quantity": 10,
  "fromLocation": "Main Warehouse",
  "toDealerId": 5,
  "scheduledDate": "2025-12-01T00:00:00Z"
}
```

### 3.4 Update Stock
**Use Case:** UC 1.d.4 - Cập nhật tồn kho  
**Method:** `POST`  
**Endpoint:** `/Inventory/stock`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "vehicleId": 1,
  "configId": 1,
  "quantity": 5,
  "locationType": "Dealer",
  "locationId": 5
}
```

### 3.5 Confirm Distribution
**Use Case:** UC 1.d.5 - Xác nhận phân phối  
**Method:** `POST`  
**Endpoint:** `/Inventory/distributions/{id}/confirm`  
**Auth Required:** Yes

### 3.6 Get Inventory Statistics
**Use Case:** UC 1.d.6 - Thống kê tồn kho  
**Method:** `GET`  
**Endpoint:** `/dealer/inventory/stats`  
**Auth Required:** Yes

**Response:**
```json
{
  "totalStock": 150,
  "availableStock": 120,
  "reservedStock": 25,
  "soldStock": 5,
  "lowStockItems": [...]
}
```

---

## 4. CUSTOMER MANAGEMENT

### 4.1 Get All Customers (Paged)
**Use Case:** UC 1.c.1 - Quản lý khách hàng  
**Method:** `GET`  
**Endpoint:** `/Customers/paged`  
**Auth Required:** Yes

**Query Parameters:**
- `Search` (string): Tìm theo tên/email
- `Phone` (string): Tìm theo SĐT
- `Page` (number): Trang
- `Size` (number): Kích thước trang

**Response:**
```json
{
  "items": [
    {
      "customerId": 1,
      "fullName": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "nguyenvana@email.com",
      "address": "123 Main St, HCM",
      "idDocumentNumber": "001234567890",
      "createdDate": "2025-01-01T00:00:00Z"
    }
  ],
  "totalCount": 450,
  "pageNumber": 1,
  "pageSize": 20
}
```

### 4.2 Get Customer By ID
**Use Case:** UC 1.c.2 - Xem chi tiết khách hàng  
**Method:** `GET`  
**Endpoint:** `/Customers/{customerId}`  
**Auth Required:** Yes

### 4.3 Create Customer
**Use Case:** UC 1.c.3 - Tạo khách hàng mới  
**Method:** `POST`  
**Endpoint:** `/Customers`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "fullName": "Trần Thị B",
  "phone": "0912345678",
  "email": "tranthib@email.com",
  "address": "456 Street, HCM",
  "idDocumentNumber": "001234567891"
}
```

### 4.4 Update Customer
**Use Case:** UC 1.c.3 - Cập nhật khách hàng  
**Method:** `PUT`  
**Endpoint:** `/Customers/{customerId}`  
**Auth Required:** Yes

**Request Body:** (same as Create)

### 4.5 Delete Customer
**Use Case:** UC 1.c.3 - Xóa khách hàng  
**Method:** `DELETE`  
**Endpoint:** `/Customers/{customerId}`  
**Auth Required:** Yes

### 4.6 Get Customer Purchase History
**Use Case:** UC 1.c.5 - Xem lịch sử mua hàng  
**Method:** `GET`  
**Endpoint:** `/dealer/customers/{customerId}/purchases`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "orderId": 1,
    "vehicleName": "Model 3",
    "purchaseDate": "2025-10-15T00:00:00Z",
    "totalAmount": 1200000000,
    "status": "Completed"
  }
]
```

---

## 5. TEST DRIVE MANAGEMENT

### 5.1 Get Test Drives By Dealer
**Use Case:** UC 1.c.2 - Quản lý lịch lái thử  
**Method:** `GET`  
**Endpoint:** `/TestDrives/by-dealer/{dealerId}`  
**Auth Required:** Yes

**Query Parameters:**
- `Status` (string): Pending, Confirmed, Completed, Cancelled
- `FromDate` (datetime): Từ ngày
- `ToDate` (datetime): Đến ngày
- `Page` (number): Trang
- `Size` (number): Kích thước

**Response:**
```json
{
  "items": [
    {
      "testDriveId": 1,
      "customerId": 5,
      "customerName": "Nguyễn Văn A",
      "vehicleId": 1,
      "vehicleName": "Model 3",
      "dealerId": 1,
      "scheduleDatetime": "2025-11-10T14:00:00Z",
      "status": "Confirmed",
      "createdAt": "2025-11-05T00:00:00Z"
    }
  ],
  "totalCount": 89,
  "pageNumber": 1,
  "pageSize": 10
}
```

### 5.2 Get Test Drive By ID
**Use Case:** UC 1.c.2.1 - Xem chi tiết lái thử  
**Method:** `GET`  
**Endpoint:** `/TestDrives/{testId}`  
**Auth Required:** Yes

### 5.3 Create Test Drive
**Use Case:** UC 1.c.2.2 - Tạo lịch lái thử  
**Method:** `POST`  
**Endpoint:** `/TestDrives`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "customerId": 5,
  "vehicleId": 1,
  "dealerId": 1,
  "scheduleDatetime": "2025-11-15T10:00:00Z",
  "status": "Pending"
}
```

### 5.4 Get Test Drives By Customer
**Use Case:** UC 1.c.2.3 - Xem lịch của khách  
**Method:** `GET`  
**Endpoint:** `/TestDrives/by-customer/{customerId}`  
**Auth Required:** Yes

### 5.5 Update Test Drive Status
**Use Case:** UC 1.c.2.4 - Cập nhật trạng thái  
**Method:** `PUT`  
**Endpoint:** `/TestDrives/{testId}/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "Completed",
  "feedback": "Customer loved the car!"
}
```

### 5.6 Cancel Test Drive
**Use Case:** UC 1.c.2.5 - Hủy lịch lái thử  
**Method:** `PUT`  
**Endpoint:** `/TestDrives/{testId}/cancel`  
**Auth Required:** Yes

**Request Body:**
```json
"Customer changed schedule"
```

### 5.7 Get Test Drive Statuses
**Use Case:** UC 1.c.2.6 - Lấy danh sách trạng thái  
**Method:** `GET`  
**Endpoint:** `/TestDrives/statuses`  
**Auth Required:** Yes

**Response:**
```json
["Pending", "Confirmed", "Completed", "Cancelled", "NoShow"]
```

---

## 6. USER/STAFF MANAGEMENT

### 6.1 Get All Users
**Use Case:** UC 1.e.1 - Quản lý nhân viên  
**Method:** `GET`  
**Endpoint:** `/Users`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "userId": 1,
    "username": "staff001",
    "fullName": "Nguyễn Văn C",
    "email": "staff001@dealer.com",
    "phoneNumber": "0901234567",
    "roleId": 2,
    "roleName": "Sales Staff",
    "dealerId": 1,
    "dealerName": "EV Dealer HCM",
    "status": "Active",
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

### 6.2 Get User By ID
**Use Case:** UC 1.e.2 - Xem chi tiết nhân viên  
**Method:** `GET`  
**Endpoint:** `/Users/{id}`  
**Auth Required:** Yes

### 6.3 Create User
**Use Case:** UC 1.e.3 - Tạo nhân viên mới  
**Method:** `POST`  
**Endpoint:** `/Users`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "username": "staff002",
  "password": "SecurePass123!",
  "fullName": "Trần Thị D",
  "email": "staff002@dealer.com",
  "phoneNumber": "0912345678",
  "dateOfBirth": "1995-05-15",
  "roleId": 2,
  "dealerId": 1
}
```

### 6.4 Update User
**Use Case:** UC 1.e.4 - Cập nhật nhân viên  
**Method:** `PUT`  
**Endpoint:** `/Users/{id}`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "roleId": 3,
  "dealerId": 1,
  "fullName": "Trần Thị D Updated",
  "email": "newemail@dealer.com",
  "phoneNumber": "0999999999",
  "dateOfBirth": "1995-05-15"
}
```

### 6.5 Update User Status
**Use Case:** UC 1.e.5 - Kích hoạt/Vô hiệu hóa  
**Method:** `PATCH`  
**Endpoint:** `/Users/{id}/status`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "status": "Inactive"
}
```

**Status Values:** `Active`, `Inactive`

---

## 7. DEALER MANAGEMENT

### 7.1 Get Dealer Contracts
**Use Case:** UC 1.b.1 - Quản lý hợp đồng  
**Method:** `GET`  
**Endpoint:** `/manage/dealers/{dealerId}/contracts`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "contractId": 1,
    "dealerId": 1,
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "terms": "Annual contract...",
    "status": "Active"
  }
]
```

### 7.2 Create Dealer Contract
**Use Case:** UC 1.b.1.1 - Tạo hợp đồng  
**Method:** `POST`  
**Endpoint:** `/manage/dealers/{dealerId}/contracts`  
**Auth Required:** Yes (EVM Staff only)

**Request Body:**
```json
{
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z",
  "terms": "Contract terms...",
  "status": "Active"
}
```

### 7.3 Get Dealer Targets
**Use Case:** UC 1.b.2 - Quản lý mục tiêu  
**Method:** `GET`  
**Endpoint:** `/manage/dealers/{dealerId}/targets`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "targetId": 1,
    "dealerId": 1,
    "periodStart": "2025-01-01T00:00:00Z",
    "periodEnd": "2025-03-31T23:59:59Z",
    "salesTarget": 50,
    "actualSales": 45,
    "status": "In Progress"
  }
]
```

### 7.4 Set Dealer Target
**Use Case:** UC 1.b.2.1 - Đặt mục tiêu  
**Method:** `POST`  
**Endpoint:** `/manage/dealers/{dealerId}/targets`  
**Auth Required:** Yes (EVM Staff only)

**Request Body:**
```json
{
  "periodStart": "2025-04-01T00:00:00Z",
  "periodEnd": "2025-06-30T23:59:59Z",
  "salesTarget": 60
}
```

### 7.5 Get Dealer Performance
**Use Case:** UC 1.b.2.2 - Xem hiệu suất  
**Method:** `GET`  
**Endpoint:** `/manage/dealers/{dealerId}/performance`  
**Auth Required:** Yes

**Query Parameters:**
- `startDate` (datetime)
- `endDate` (datetime)

**Response:**
```json
{
  "totalSales": 45,
  "targetSales": 50,
  "achievementRate": 90.0,
  "revenue": 54000000000,
  "topSellingVehicles": [...],
  "monthlyTrend": [...]
}
```

### 7.6 Get All Dealers (Paged)
**Use Case:** UC 1.b.0 - Xem danh sách đại lý  
**Method:** `GET`  
**Endpoint:** `/Dealers/paged`  
**Auth Required:** Yes

**Query Parameters:**
- `Search` (string)
- `Phone` (string)
- `Page` (number)
- `Size` (number)

### 7.7 Get Dealer By ID
**Method:** `GET`  
**Endpoint:** `/Dealers/{dealerId}`  
**Auth Required:** Yes

### 7.8 Create Dealer
**Use Case:** UC 1.b.0.1 - Tạo đại lý mới  
**Method:** `POST`  
**Endpoint:** `/Dealers`  
**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "name": "EV Dealer Da Nang",
  "address": "123 Le Duan, Da Nang",
  "phone": "0236123456"
}
```

### 7.9 Update Dealer
**Method:** `PUT`  
**Endpoint:** `/Dealers/{dealerId}`  
**Auth Required:** Yes (Admin only)

### 7.10 Delete Dealer
**Method:** `DELETE`  
**Endpoint:** `/Dealers/{dealerId}`  
**Auth Required:** Yes (Admin only)

---

## 8. ORDER MANAGEMENT

### 8.1 Get All Orders
**Use Case:** UC 1.f.1 - Quản lý đơn hàng  
**Method:** `GET`  
**Endpoint:** `/dealer/orders`  
**Auth Required:** Yes

**Query Parameters:**
- `status` (string): Pending, Confirmed, Processing, Completed, Cancelled
- `page` (number)
- `limit` (number)

**Response:**
```json
{
  "orders": [
    {
      "orderId": 1,
      "customerName": "Nguyễn Văn A",
      "vehicleName": "Model 3",
      "totalAmount": 1200000000,
      "status": "Confirmed",
      "orderDate": "2025-11-01T00:00:00Z"
    }
  ],
  "total": 125,
  "page": 1,
  "limit": 10
}
```

### 8.2 Get Order By ID
**Use Case:** UC 1.f.2 - Xem chi tiết đơn hàng  
**Method:** `GET`  
**Endpoint:** `/dealer/orders/{id}`  
**Auth Required:** Yes

### 8.3 Create Order
**Use Case:** UC 1.f.3 - Tạo đơn hàng  
**Method:** `POST`  
**Endpoint:** `/dealer/orders`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "customerId": 5,
  "vehicleId": 1,
  "configId": 1,
  "quantity": 1,
  "promotionId": null,
  "notes": "Customer wants red color"
}
```

### 8.4 Update Order
**Use Case:** UC 1.f.4 - Cập nhật đơn hàng  
**Method:** `PUT`  
**Endpoint:** `/dealer/orders/{id}`  
**Auth Required:** Yes

### 8.5 Update Order Status
**Use Case:** UC 1.f.5 - Cập nhật trạng thái  
**Method:** `PUT`  
**Endpoint:** `/dealer/orders/{id}/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "Processing",
  "note": "Order confirmed and processing"
}
```

### 8.6 Cancel Order
**Use Case:** UC 1.f.6 - Hủy đơn hàng  
**Method:** `POST`  
**Endpoint:** `/dealer/orders/{id}/cancel`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

---

## 9. QUOTATION MANAGEMENT

### 9.1 Get All Quotations
**Use Case:** UC 1.g.1 - Quản lý báo giá  
**Method:** `GET`  
**Endpoint:** `/dealer/quotations`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "quotationId": 1,
    "customerName": "Nguyễn Văn A",
    "vehicleName": "Model 3",
    "quotedPrice": 1150000000,
    "validUntil": "2025-12-31T23:59:59Z",
    "status": "Sent"
  }
]
```

### 9.2 Get Quotation By ID
**Use Case:** UC 1.g.2 - Xem chi tiết báo giá  
**Method:** `GET`  
**Endpoint:** `/dealer/quotations/{id}`  
**Auth Required:** Yes

### 9.3 Create Quotation
**Use Case:** UC 1.g.3 - Tạo báo giá  
**Method:** `POST`  
**Endpoint:** `/dealer/quotations`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "customerId": 5,
  "vehicleId": 1,
  "configId": 1,
  "quotedPrice": 1150000000,
  "validUntil": "2025-12-31T23:59:59Z",
  "notes": "Special discount for loyal customer"
}
```

### 9.4 Update Quotation
**Use Case:** UC 1.g.4 - Cập nhật báo giá  
**Method:** `PUT`  
**Endpoint:** `/dealer/quotations/{id}`  
**Auth Required:** Yes

---

## 10. PAYMENT MANAGEMENT

### 10.1 Get All Payments
**Use Case:** UC 1.h.1 - Quản lý thanh toán  
**Method:** `GET`  
**Endpoint:** `/dealer/payments`  
**Auth Required:** Yes

**Response:**
```json
[
  {
    "paymentId": 1,
    "orderId": 1,
    "amount": 1200000000,
    "method": "Bank Transfer",
    "status": "Completed",
    "paymentDate": "2025-11-05T10:30:00Z"
  }
]
```

### 10.2 Process Payment
**Use Case:** UC 1.h.2 - Xử lý thanh toán  
**Method:** `POST`  
**Endpoint:** `/dealer/orders/{orderId}/payment`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "amount": 1200000000,
  "method": "Bank Transfer",
  "transactionId": "TXN123456789",
  "notes": "Full payment"
}
```

---

## 11. REPORTS & ANALYTICS

### 11.1 Get Dashboard Stats
**Use Case:** UC 1.i.1 - Dashboard Analytics  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/dashboard`  
**Auth Required:** Yes

**Query Parameters:**
- `startDate` (datetime)
- `endDate` (datetime)

**Response:**
```json
{
  "totalRevenue": 54000000000,
  "totalOrders": 125,
  "completedOrders": 100,
  "totalCustomers": 450,
  "newCustomers": 50,
  "testDrives": 89,
  "conversionRate": 56.2
}
```

### 11.2 Get Sales Report
**Use Case:** UC 1.i.2 - Báo cáo doanh số  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/sales`  
**Auth Required:** Yes

**Query Parameters:**
- `period` (string): day, week, month, year
- `year` (number): 2024, 2025

**Response:**
```json
{
  "period": "month",
  "year": 2025,
  "data": [
    {
      "month": 1,
      "revenue": 4500000000,
      "orders": 10,
      "growth": 12.5
    }
  ]
}
```

### 11.3 Get Inventory Report
**Use Case:** UC 1.i.3 - Báo cáo tồn kho  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/inventory`  
**Auth Required:** Yes

**Response:**
```json
{
  "totalStock": 150,
  "stockValue": 180000000000,
  "turnoverRate": 0.8,
  "slowMovingItems": [...],
  "outOfStockItems": [...]
}
```

### 11.4 Get Customer Insights
**Use Case:** UC 1.i.4 - Phân tích khách hàng  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/customers`  
**Auth Required:** Yes

**Response:**
```json
{
  "totalCustomers": 450,
  "newCustomers": 50,
  "returningCustomers": 80,
  "topCustomers": [...],
  "customerSegments": {...}
}
```

### 11.5 Get Test Drive Analytics
**Use Case:** UC 1.i.5 - Phân tích lái thử  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/test-drives`  
**Auth Required:** Yes

**Response:**
```json
{
  "totalTestDrives": 89,
  "completedTestDrives": 75,
  "conversionRate": 56.2,
  "popularVehicles": [...]
}
```

### 11.6 Get Performance Stats
**Use Case:** UC 1.i.6 - Thống kê hiệu suất  
**Method:** `GET`  
**Endpoint:** `/dealer/analytics/performance`  
**Auth Required:** Yes

### 11.7 Get Customer Debt Report (AR)
**Use Case:** UC 1.j.1 - Báo cáo công nợ KH  
**Method:** `GET`  
**Endpoint:** `/dealer/reports/customer-debt`  
**Auth Required:** Yes

**Query Parameters:**
- `status` (string): Pending, Overdue, Paid
- `customerId` (number)

**Response:**
```json
[
  {
    "debtId": 1,
    "customerId": 5,
    "customerName": "Nguyễn Văn A",
    "totalDebt": 500000000,
    "paidAmount": 200000000,
    "remainingAmount": 300000000,
    "dueDate": "2025-12-31T00:00:00Z",
    "status": "Pending",
    "daysOverdue": 0
  }
]
```

### 11.8 Get Supplier Debt Report (AP)
**Use Case:** UC 1.j.2 - Báo cáo công nợ NCC  
**Method:** `GET`  
**Endpoint:** `/dealer/reports/supplier-debt`  
**Auth Required:** Yes

### 11.9 Get Aging Report
**Use Case:** UC 1.j.3 - Phân tích tuổi nợ  
**Method:** `GET`  
**Endpoint:** `/dealer/reports/aging`  
**Auth Required:** Yes

**Query Parameters:**
- `entityType` (string): CUSTOMER or SUPPLIER

**Response:**
```json
{
  "entityType": "CUSTOMER",
  "buckets": {
    "0-30days": {
      "count": 15,
      "amount": 500000000
    },
    "31-60days": {
      "count": 8,
      "amount": 300000000
    },
    "61-90days": {
      "count": 3,
      "amount": 150000000
    },
    "over90days": {
      "count": 2,
      "amount": 100000000
    }
  },
  "totalAmount": 1050000000
}
```

### 11.10 Send Debt Reminder
**Use Case:** UC 1.j.4 - Gửi nhắc nợ  
**Method:** `POST`  
**Endpoint:** `/dealer/debts/{debtId}/remind`  
**Auth Required:** Yes

### 11.11 Send Bulk Debt Reminders
**Use Case:** UC 1.j.5 - Gửi nhắc nợ hàng loạt  
**Method:** `POST`  
**Endpoint:** `/dealer/debts/remind-bulk`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "Overdue",
  "daysOverdue": 30
}
```

### 11.12 Calculate Customer Outstanding
**Use Case:** UC 1.j.6 - Tính công nợ KH  
**Method:** `GET`  
**Endpoint:** `/dealer/customers/{customerId}/outstanding`  
**Auth Required:** Yes

**Response:**
```json
{
  "customerId": 5,
  "totalDebt": 500000000,
  "paidAmount": 200000000,
  "remainingAmount": 300000000,
  "overdueAmount": 100000000
}
```

### 11.13 Export Debt Report
**Use Case:** UC 1.j.7 - Xuất báo cáo công nợ  
**Method:** `GET`  
**Endpoint:** `/dealer/reports/debt/export`  
**Auth Required:** Yes

**Query Parameters:**
- `format` (string): pdf or excel
- `type` (string): customer or supplier

**Response:** File download (blob)

---

## 12. PROMOTION MANAGEMENT

### 12.1 Get All Promotions
**Use Case:** UC 1.b.3 - Quản lý khuyến mãi  
**Method:** `GET`  
**Endpoint:** `/Promotions`  
**Auth Required:** Yes

**Query Parameters:**
- `Status` (string): Active, Inactive, Expired
- `StartDate` (datetime)
- `EndDate` (datetime)

**Response:**
```json
[
  {
    "promoId": 1,
    "name": "Year End Sale 2025",
    "description": "10% discount on all vehicles",
    "discountType": "Percentage",
    "discountValue": 10,
    "condition": "Minimum purchase 1 vehicle",
    "startDate": "2025-11-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "status": "Active"
  }
]
```

**Discount Types:**
- `Percentage`: Giảm theo %
- `FixedAmount`: Giảm số tiền cố định
- `Gift`: Tặng quà
- `Bundle`: Combo sản phẩm

### 12.2 Get Promotion By ID
**Use Case:** UC 1.b.3.1 - Xem chi tiết KM  
**Method:** `GET`  
**Endpoint:** `/Promotions/{id}`  
**Auth Required:** Yes

### 12.3 Get Active Promotions
**Use Case:** UC 1.b.3.2 - Lấy KM đang hiệu lực  
**Method:** `GET`  
**Endpoint:** `/Promotions/active`  
**Auth Required:** Yes

**Response:** Danh sách các promotion có status=Active và trong khoảng startDate-endDate hiện tại

### 12.4 Create Promotion
**Use Case:** UC 1.b.3.3 - Tạo khuyến mãi  
**Method:** `POST`  
**Endpoint:** `/Promotions`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "name": "Flash Sale Model 3",
  "description": "Limited time 15% discount",
  "discountType": "Percentage",
  "discountValue": 15,
  "condition": "Only for Model 3, first 10 customers",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-15T23:59:59Z",
  "status": "Active"
}
```

### 12.5 Update Promotion
**Use Case:** UC 1.b.3.4 - Cập nhật khuyến mãi  
**Method:** `PUT`  
**Endpoint:** `/Promotions/{id}`  
**Auth Required:** Yes (Manager only)

### 12.6 Update Promotion Status
**Use Case:** UC 1.b.3.5 - Kích hoạt/Tạm dừng  
**Method:** `PATCH`  
**Endpoint:** `/Promotions/{id}/status`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "status": "Inactive"
}
```

**Status Values:** `Active`, `Inactive`, `Expired`

### 12.7 Delete Promotion
**Use Case:** UC 1.b.3.6 - Xóa khuyến mãi  
**Method:** `DELETE`  
**Endpoint:** `/Promotions/{id}`  
**Auth Required:** Yes (Manager only)

### 12.8 Validate Promotion
**Use Case:** UC 1.b.3.7 - Kiểm tra điều kiện KM  
**Method:** `POST`  
**Endpoint:** `/Promotions/{id}/validate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "orderId": 1,
  "customerId": 5,
  "vehicleId": 1,
  "quantity": 1,
  "totalAmount": 1200000000
}
```

**Response:**
```json
{
  "isValid": true,
  "message": "Promotion can be applied",
  "discountAmount": 120000000
}
```

### 12.9 Apply Promotion To Order
**Use Case:** UC 1.b.3.8 - Áp dụng KM cho đơn  
**Method:** `POST`  
**Endpoint:** `/Promotions/{id}/apply`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "orderId": 1
}
```

**Response:**
```json
{
  "orderId": 1,
  "promotionId": 1,
  "originalAmount": 1200000000,
  "discountAmount": 120000000,
  "finalAmount": 1080000000
}
```

### 12.10 Get Promotion Statistics
**Use Case:** UC 1.b.3.9 - Thống kê khuyến mãi  
**Method:** `GET`  
**Endpoint:** `/Promotions/statistics`  
**Auth Required:** Yes

**Response:**
```json
{
  "totalPromotions": 15,
  "activePromotions": 5,
  "expiredPromotions": 8,
  "totalDiscountGiven": 500000000,
  "ordersWithPromotion": 45,
  "conversionRate": 36.0
}
```

---

## 13. DEALER PROFILE

### 13.1 Get Dealer Profile
**Use Case:** UC 1.k.1 - Xem thông tin đại lý  
**Method:** `GET`  
**Endpoint:** `/dealer/profile`  
**Auth Required:** Yes

**Response:**
```json
{
  "dealerId": 1,
  "name": "EV Dealer HCM",
  "address": "123 Main St, HCM",
  "phone": "0281234567",
  "email": "contact@evdealer.com",
  "manager": "Nguyễn Văn Manager",
  "established": "2020-01-01T00:00:00Z"
}
```

### 13.2 Update Dealer Profile
**Use Case:** UC 1.k.2 - Cập nhật thông tin  
**Method:** `PUT`  
**Endpoint:** `/dealer/profile`  
**Auth Required:** Yes (Manager only)

**Request Body:**
```json
{
  "name": "EV Dealer HCM - Updated",
  "address": "456 New Address, HCM",
  "phone": "0287654321",
  "email": "newemail@evdealer.com"
}
```

### 13.3 Get Shop Information
**Use Case:** UC 1.k.3 - Xem thông tin shop  
**Method:** `GET`  
**Endpoint:** `/dealer/shop`  
**Auth Required:** Yes

**Response:**
```json
{
  "shopId": 1,
  "dealerId": 1,
  "openingHours": "Mon-Fri: 8AM-6PM, Sat: 8AM-5PM",
  "services": ["Sales", "Test Drive", "Maintenance"],
  "facilities": ["Showroom", "Service Center", "Parking"]
}
```

### 13.4 Update Shop Information
**Use Case:** UC 1.k.4 - Cập nhật shop  
**Method:** `PUT`  
**Endpoint:** `/dealer/shop`  
**Auth Required:** Yes (Manager only)

---

## 14. NOTIFICATIONS

### 14.1 Get Notifications
**Use Case:** UC 1.l.1 - Xem thông báo  
**Method:** `GET`  
**Endpoint:** `/dealer/notifications`  
**Auth Required:** Yes

**Query Parameters:**
- `isRead` (boolean): true/false
- `type` (string): Order, TestDrive, Inventory, Promotion

**Response:**
```json
[
  {
    "notificationId": 1,
    "title": "New Order #125",
    "message": "Customer Nguyễn Văn A placed new order",
    "type": "Order",
    "isRead": false,
    "createdAt": "2025-11-06T10:30:00Z",
    "link": "/dealer/orders/125"
  }
]
```

### 14.2 Mark Notification Read
**Use Case:** UC 1.l.2 - Đánh dấu đã đọc  
**Method:** `PUT`  
**Endpoint:** `/dealer/notifications/{id}/read`  
**Auth Required:** Yes

### 14.3 Mark All Notifications Read
**Use Case:** UC 1.l.3 - Đánh dấu tất cả  
**Method:** `PUT`  
**Endpoint:** `/dealer/notifications/read-all`  
**Auth Required:** Yes

---

## 15. FEEDBACK & COMPLAINT MANAGEMENT

### 15.1 Get All Feedbacks
**Use Case:** UC 1.c.4 - Quản lý phản hồi  
**Method:** `GET`  
**Endpoint:** `/Feedbacks`  
**Auth Required:** Yes

**Query Parameters:**
- `CustomerId` (number): Lọc theo khách hàng
- `Type` (string): Feedback, Complaint, Suggestion
- `Status` (string): Pending, InProgress, Resolved
- `StartDate` (datetime)
- `EndDate` (datetime)

**Response:**
```json
[
  {
    "feedbackId": 1,
    "customerId": 5,
    "customerName": "Nguyễn Văn A",
    "type": "Complaint",
    "subject": "Vehicle delivery delay",
    "content": "My Model 3 was supposed to arrive...",
    "status": "InProgress",
    "priority": "High",
    "createdDate": "2025-11-01T00:00:00Z",
    "resolvedDate": null,
    "assignedTo": "staff001"
  }
]
```

**Feedback Types:**
- `Feedback`: Phản hồi chung
- `Complaint`: Khiếu nại
- `Suggestion`: Đề xuất

**Status Values:**
- `Pending`: Chờ xử lý
- `InProgress`: Đang xử lý
- `Resolved`: Đã giải quyết

**Priority Levels:**
- `Low`: Thấp
- `Medium`: Trung bình
- `High`: Cao
- `Critical`: Khẩn cấp

### 15.2 Get Feedback By ID
**Use Case:** UC 1.c.4.1 - Xem chi tiết phản hồi  
**Method:** `GET`  
**Endpoint:** `/Feedbacks/{id}`  
**Auth Required:** Yes

**Response:**
```json
{
  "feedbackId": 1,
  "customerId": 5,
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "customerEmail": "nguyenvana@email.com",
  "type": "Complaint",
  "subject": "Vehicle delivery delay",
  "content": "My Model 3 was supposed to arrive on Nov 1...",
  "status": "InProgress",
  "priority": "High",
  "createdDate": "2025-11-01T10:00:00Z",
  "resolvedDate": null,
  "assignedTo": "staff001",
  "assignedToName": "Nguyễn Văn C",
  "notes": "Contacted customer, investigating with logistics",
  "timeline": [
    {
      "date": "2025-11-01T10:00:00Z",
      "action": "Feedback created",
      "by": "System"
    },
    {
      "date": "2025-11-01T11:30:00Z",
      "action": "Assigned to staff001",
      "by": "Manager"
    },
    {
      "date": "2025-11-02T09:00:00Z",
      "action": "Status changed to InProgress",
      "by": "staff001"
    }
  ]
}
```

### 15.3 Create Feedback
**Use Case:** UC 1.c.4.2 - Tạo phản hồi  
**Method:** `POST`  
**Endpoint:** `/Feedbacks`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "customerId": 5,
  "type": "Feedback",
  "subject": "Great service experience",
  "content": "I'm very satisfied with the test drive service...",
  "priority": "Low"
}
```

### 15.4 Update Feedback
**Use Case:** UC 1.c.4.3 - Cập nhật phản hồi  
**Method:** `PUT`  
**Endpoint:** `/Feedbacks/{id}`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "Resolved",
  "note": "Issue resolved, vehicle delivered on Nov 5"
}
```

### 15.5 Update Feedback Status
**Use Case:** UC 1.c.4.4 - Cập nhật trạng thái  
**Method:** `PATCH`  
**Endpoint:** `/Feedbacks/{id}/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "Resolved",
  "note": "Customer satisfied with resolution"
}
```

### 15.6 Delete Feedback
**Use Case:** UC 1.c.4.5 - Xóa phản hồi  
**Method:** `DELETE`  
**Endpoint:** `/Feedbacks/{id}`  
**Auth Required:** Yes (Manager only)

### 15.7 Get Feedback Statistics
**Use Case:** UC 1.c.4.6 - Thống kê phản hồi  
**Method:** `GET`  
**Endpoint:** `/Feedbacks/statistics`  
**Auth Required:** Yes

**Response:**
```json
{
  "total": 150,
  "pending": 20,
  "inProgress": 35,
  "resolved": 95,
  "byType": {
    "Feedback": 80,
    "Complaint": 50,
    "Suggestion": 20
  },
  "byPriority": {
    "Low": 60,
    "Medium": 50,
    "High": 30,
    "Critical": 10
  },
  "averageResolutionTime": 2.5,
  "satisfactionRate": 85.5
}
```

### 15.8 Notify Customer About Feedback
**Use Case:** UC 1.c.4.7 - Thông báo khách hàng  
**Method:** `POST`  
**Endpoint:** `/Feedbacks/{id}/notify`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Notification sent to customer via email and SMS",
  "sentAt": "2025-11-06T14:30:00Z"
}
```

**Notification Content:**
- Email với chi tiết resolution
- SMS với link tracking
- In-app notification (nếu có mobile app)

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Headers
Tất cả API đều yêu cầu authentication token trong header:

```http
Authorization: Bearer {jwt_token}
```

### Roles & Permissions

| Role | Permissions |
|------|------------|
| **Dealer Manager** | Full access to dealer operations, manage staff, view reports |
| **Sales Staff** | Create orders, manage customers, test drives, view inventory |
| **Service Staff** | Handle feedback/complaints, update test drive status |
| **EVM Admin** | Manage dealers, set targets, view all analytics |

### Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 📊 DATA MODELS

### Customer
```json
{
  "customerId": number,
  "fullName": string,
  "phone": string,
  "email": string,
  "address": string,
  "idDocumentNumber": string,
  "createdDate": datetime
}
```

### Vehicle
```json
{
  "vehicleId": number,
  "name": string,
  "brand": string,
  "price": number,
  "year": number,
  "color": string,
  "range": number (km),
  "topSpeed": number (km/h),
  "acceleration": string (e.g. "3.1s"),
  "horsepower": number,
  "batteryCapacity": number (kWh),
  "seats": number,
  "drivetrain": string
}
```

### Order
```json
{
  "orderId": number,
  "customerId": number,
  "vehicleId": number,
  "configId": number,
  "quantity": number,
  "totalAmount": number,
  "promotionId": number | null,
  "status": string,
  "orderDate": datetime,
  "notes": string
}
```

### Promotion
```json
{
  "promoId": number,
  "name": string,
  "description": string,
  "discountType": "Percentage" | "FixedAmount" | "Gift" | "Bundle",
  "discountValue": number,
  "condition": string,
  "startDate": datetime,
  "endDate": datetime,
  "status": "Active" | "Inactive" | "Expired"
}
```

### Feedback
```json
{
  "feedbackId": number,
  "customerId": number,
  "type": "Feedback" | "Complaint" | "Suggestion",
  "subject": string,
  "content": string,
  "status": "Pending" | "InProgress" | "Resolved",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "createdDate": datetime,
  "resolvedDate": datetime | null,
  "assignedTo": string,
  "notes": string
}
```

---

## 🔄 PAGINATION PATTERN

Tất cả API list đều hỗ trợ pagination:

**Request:**
```http
GET /Customers/paged?Page=1&Size=20
```

**Response:**
```json
{
  "items": [...],
  "totalCount": 450,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 23
}
```

---

## 🔍 FILTERING PATTERN

Các API list hỗ trợ multiple filters:

**Example:**
```http
GET /Feedbacks?Type=Complaint&Status=Pending&Priority=High&StartDate=2025-11-01&EndDate=2025-11-30
```

---

## 📅 DATE FORMAT

Tất cả datetime sử dụng ISO 8601 format:
```
2025-11-06T14:30:00Z
```

---

## 💰 CURRENCY FORMAT

Tất cả số tiền sử dụng VND (Vietnamese Dong) với kiểu number (không format):
```json
{
  "price": 1200000000
}
```

Frontend sẽ format hiển thị: `1.2 tỷ VNĐ`

---

## 📝 NOTES FOR BACKEND TEAM

### Endpoints cần implement:

1. ✅ **Đã có backend:**
   - Dashboard stats
   - Vehicles (CRUD + compare)
   - Customers (CRUD + paged)
   - Test Drives (CRUD + by dealer/customer)
   - Users (CRUD + status)
   - Dealers (CRUD + contracts + targets)
   - Promotions (CRUD + validate + apply)
   - Feedbacks (CRUD + statistics + notify)

2. ⚠️ **Cần xác nhận:**
   - Inventory management endpoints
   - Order management endpoints
   - Quotation endpoints
   - Payment processing
   - Analytics & Reports endpoints
   - Debt management (AR/AP)
   - Notification system

3. 🔧 **Suggestions:**
   - Thêm WebSocket cho real-time notifications
   - Implement rate limiting
   - Add caching cho dashboard stats
   - File upload cho vehicle images
   - Export report to PDF/Excel

---

## 📞 SUPPORT

Nếu có thắc mắc về API, liên hệ:
- **Frontend Team Lead:** [Your Name]
- **Backend Team Lead:** [Backend Lead]
- **Documentation:** This file

---

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Total Endpoints:** 100+
