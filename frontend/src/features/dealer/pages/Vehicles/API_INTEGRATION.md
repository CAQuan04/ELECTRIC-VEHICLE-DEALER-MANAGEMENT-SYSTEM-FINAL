# API Integration Guide - Dealer Module

## 📋 Tổng quan

Tất cả API calls cho Dealer module đã được tập trung vào file `dealer.api.js` để dễ quản lý và bảo trì.

## 📁 File cấu trúc

```
frontend/src/utils/api/services/
└── dealer.api.js           # Tất cả API endpoints cho Dealer
```

## 🔗 API Endpoints đã tích hợp

### **VEHICLES** (Quản lý xe)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/vehicles` | `getVehicles(params)` | ✅ `/api/Vehicles` |
| GET | `/dealer/vehicles/:id` | `getVehicleById(id)` | ✅ `/api/Vehicles/{vehicleId}` |
| GET | `/dealer/vehicles/search` | `searchVehicles(query, filters)` | ⚠️ Cần kiểm tra |
| POST | `/Vehicles/compare` | `compareVehicles(vehicleIds)` | ✅ `/api/Vehicles/compare` |
| GET | `/Vehicles/:id/configs` | `getVehicleConfigs(vehicleId)` | ✅ `/api/Vehicles/{vehicleId}/configs` |

### **INVENTORY** (Quản lý kho)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/inventory` | `getInventory(filters)` | ⚠️ `/api/Inventory/stock` |
| GET | `/dealer/inventory/:id` | `getStockById(stockId)` | ⚠️ Cần kiểm tra |
| POST | `/dealer/inventory/request` | `requestStock(requestData)` | ⚠️ Cần kiểm tra |
| PUT | `/dealer/inventory/:id` | `updateStock(stockId, data)` | ⚠️ Cần kiểm tra |
| GET | `/dealer/inventory/stats` | `getInventoryStats()` | ⚠️ Cần kiểm tra |

### **CUSTOMERS** (Quản lý khách hàng)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/customers` | `getCustomers(params)` | ⚠️ Cần kiểm tra |
| GET | `/dealer/customers/:id` | `getCustomerById(id)` | ⚠️ Cần kiểm tra |
| POST | `/dealer/customers` | `createCustomer(data)` | ⚠️ Cần kiểm tra |
| PUT | `/dealer/customers/:id` | `updateCustomer(id, data)` | ⚠️ Cần kiểm tra |
| DELETE | `/dealer/customers/:id` | `deleteCustomer(id)` | ⚠️ Cần kiểm tra |

### **TEST DRIVES** (Lịch lái thử)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/test-drives` | `getTestDrives(params)` | ✅ `/api/TestDrives/by-dealer/{dealerId}` |
| GET | `/dealer/test-drives/:id` | `getTestDriveById(id)` | ✅ `/api/TestDrives/{testId}` |
| POST | `/dealer/test-drives` | `createTestDrive(data)` | ✅ `/api/TestDrives` |
| PUT | `/dealer/test-drives/:id/status` | `updateTestDriveStatus(id, status)` | ✅ `/api/TestDrives/{testId}/status` |
| PUT | `/dealer/test-drives/:id/cancel` | `cancelTestDrive(id)` | ✅ `/api/TestDrives/{testId}/cancel` |
| GET | `/dealer/test-drives/statuses` | `getTestDriveStatuses()` | ✅ `/api/TestDrives/statuses` |

### **ORDERS** (Quản lý đơn hàng)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/orders` | `getOrders(params)` | ⚠️ Cần kiểm tra |
| GET | `/dealer/orders/:id` | `getOrderById(id)` | ⚠️ Cần kiểm tra |
| POST | `/dealer/orders` | `createOrder(data)` | ⚠️ Cần kiểm tra |
| PUT | `/dealer/orders/:id` | `updateOrder(id, data)` | ⚠️ Cần kiểm tra |
| PUT | `/dealer/orders/:id/status` | `updateOrderStatus(id, status)` | ⚠️ Cần kiểm tra |

### **QUOTATIONS** (Báo giá)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/quotations` | `getQuotations(params)` | ⚠️ Cần kiểm tra |
| GET | `/dealer/quotations/:id` | `getQuotationById(id)` | ⚠️ Cần kiểm tra |
| POST | `/dealer/quotations` | `createQuotation(data)` | ⚠️ Cần kiểm tra |
| PUT | `/dealer/quotations/:id` | `updateQuotation(id, data)` | ⚠️ Cần kiểm tra |

### **ANALYTICS** (Báo cáo & Thống kê)
| Method | Endpoint | Function | Backend API |
|--------|----------|----------|-------------|
| GET | `/dealer/dashboard` | `getDashboard()` | ⚠️ Cần kiểm tra |
| GET | `/dealer/analytics/stats` | `getDashboardStats(dateRange)` | ⚠️ Cần kiểm tra |
| GET | `/dealer/analytics/sales` | `getSalesReport(params)` | ⚠️ Cần kiểm tra |

## 🔧 Cách sử dụng

### Import

```javascript
import { dealerAPI } from '@utils/api/services';
```

### Ví dụ sử dụng

```javascript
// Lấy danh sách xe
const result = await dealerAPI.getVehicles({ 
  page: 1, 
  limit: 10,
  brand: 'Tesla' 
});

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.message);
}

// So sánh xe
const compareResult = await dealerAPI.compareVehicles([1, 2, 3]);

// Lấy cấu hình xe
const configResult = await dealerAPI.getVehicleConfigs(vehicleId);
```

## ⚠️ Cần cập nhật

Các endpoints đánh dấu ⚠️ cần kiểm tra với backend để đảm bảo:
1. URL endpoint khớp với backend API
2. Request/Response format đúng
3. Authentication được xử lý đúng

## ✅ Đã hoàn thành

- ✅ Gộp vehicleApi.js vào dealer.api.js
- ✅ Cập nhật VehicleList.jsx sử dụng dealerAPI
- ✅ Cập nhật VehicleDetail.jsx sử dụng dealerAPI  
- ✅ Cập nhật CompareVehicles.jsx sử dụng dealerAPI
- ✅ Thêm error handling với notifications
- ✅ Thêm mock data fallback

## 📝 Notes

- Tất cả API calls đều trả về format: `{ success: boolean, data?: any, message?: string }`
- Error handling đã được tích hợp sẵn
- Hỗ trợ mock data fallback khi API lỗi
