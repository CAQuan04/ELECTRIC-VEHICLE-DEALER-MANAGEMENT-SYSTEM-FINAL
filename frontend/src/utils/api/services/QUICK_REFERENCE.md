# Quick Reference - Backend API Endpoints

## 🚀 Vehicle Endpoints

```javascript
// Get all vehicles
GET /api/Vehicles
Query: Search, Brand, Model, MinPrice, MaxPrice, Page, Size

// Get vehicle by ID
GET /api/Vehicles/{vehicleId}

// Compare vehicles
POST /api/Vehicles/compare
Body: [1, 2, 3] // Array of vehicle IDs

// Get vehicle configurations
GET /api/Vehicles/{vehicleId}/configs
```

---

## 👥 Customer Endpoints

```javascript
// Get customers (paged)
GET /api/Customers/paged
Query: Search, Phone, Page, Size

// Get customer by ID
GET /api/Customers/{customerId}

// Create customer
POST /api/Customers
Body: {fullName, phone, address, idDocumentNumber}

// Update customer
PUT /api/Customers/{customerId}
Body: {fullName, phone, address, idDocumentNumber}

// Delete customer
DELETE /api/Customers/{customerId}

// Get customer by phone
GET /api/Customers/by-phone/{phone}
```

---

## 🚗 Test Drive Endpoints

```javascript
// Get test drives by dealer
GET /api/TestDrives/by-dealer/{dealerId}
Query: Status, FromDate, ToDate, Page, Size

// Get test drives by customer
GET /api/TestDrives/by-customer/{customerId}
Query: Status, FromDate, ToDate, Page, Size

// Get test drive by ID
GET /api/TestDrives/{testId}

// Create test drive
POST /api/TestDrives
Body: {customerId, vehicleId, dealerId, scheduleDatetime, status}

// Update test drive status
PUT /api/TestDrives/{testId}/status
Body: {status, feedback}

// Cancel test drive
PUT /api/TestDrives/{testId}/cancel
Body: "Cancellation reason" // Raw string

// Get available statuses
GET /api/TestDrives/statuses
```

---

## 📦 Inventory Endpoints

```javascript
// Update stock
POST /api/Inventory/stock
Body: {vehicleId, configId, quantity, locationType, locationId}

// Create distribution
POST /api/Inventory/distributions
Body: {vehicleId, configId, quantity, fromLocation, toDealerId, scheduledDate}

// Confirm distribution
POST /api/Inventory/distributions/{id}/confirm
```

---

## 🏢 Dealer Endpoints

```javascript
// Get dealers (paged)
GET /api/Dealers/paged
Query: Search, Phone, Page, Size

// Get dealer by ID
GET /api/Dealers/{dealerId}

// Create dealer
POST /api/Dealers
Body: {name, address, phone}

// Update dealer
PUT /api/Dealers/{dealerId}
Body: {name, address, phone}

// Delete dealer
DELETE /api/Dealers/{dealerId}

// Get dealer by phone
GET /api/Dealers/by-phone/{phone}

// Get dealer by name
GET /api/Dealers/by-name/{name}
```

---

## 📊 Dealer Management Endpoints

```javascript
// Get dealer contracts
GET /api/manage/dealers/{dealerId}/contracts

// Create dealer contract
POST /api/manage/dealers/{dealerId}/contracts
Body: {startDate, endDate, terms, status}

// Get dealer targets
GET /api/manage/dealers/{dealerId}/targets

// Set dealer target
POST /api/manage/dealers/{dealerId}/targets
Body: {periodStart, periodEnd, salesTarget}

// Get dealer performance
GET /api/manage/dealers/{dealerId}/performance
Query: startDate, endDate
```

---

## 📈 Dashboard Endpoints

```javascript
// Get dashboard stats
GET /api/Dashboard/stats

// Get user info
GET /api/Dashboard/user-info
```

---

## 📊 Analytics Endpoints

```javascript
// Get sales by dealer
GET /api/Analytics/sales-by-dealer
Query: startDate, endDate

// Get inventory turnover
GET /api/Analytics/inventory-turnover
Query: startDate, endDate

// Get demand forecasts
GET /api/Analytics/demand-forecasts

// Run demand forecast
POST /api/Analytics/run-demand-forecast
```

---

## 💰 Pricing Endpoints

```javascript
// Set wholesale price
POST /api/pricing/wholesale-prices
Body: {productId, dealerId, price, validFrom, validTo}

// Create promotion policy
POST /api/pricing/promotion-policies
Body: {dealerId, description, discountPercent, conditions, startDate, endDate}

// Get applicable price
GET /api/pricing/dealers/{dealerId}/vehicles/{vehicleId}/applicable-price
```

---

## 🔐 Auth Endpoints

```javascript
// Login
POST /api/Auth/login
Body: {username, password}

// Hash password (dev only)
GET /api/Auth/hash/{password}
```

---

## 👤 User Management Endpoints

```javascript
// Get all users
GET /api/Users

// Create user
POST /api/Users
Body: {username, password, fullName, email, phoneNumber, dateOfBirth, roleId, dealerId}

// Get user by ID
GET /api/Users/{id}

// Update user
PUT /api/Users/{id}
Body: {roleId, dealerId, fullName, email, phoneNumber, dateOfBirth}

// Update user status
PATCH /api/Users/{id}/status
Body: {status}
```

---

## 📋 Supply Planning Endpoints

```javascript
// Get distribution suggestions
GET /api/planning/distribution-suggestions

// Run suggestion generator
POST /api/planning/run-suggestion-generator

// Get production report
GET /api/planning/production-report
Query: periodStart
```

---

## 🔧 Admin Vehicle Endpoints

```javascript
// Get all vehicles (admin)
GET /api/admin/vehicles

// Create vehicle
POST /api/admin/vehicles
Body: {model, brand, year, basePrice, imageUrl}

// Update vehicle
PUT /api/admin/vehicles/{vehicleId}
Body: {model, brand, year, basePrice, imageUrl}

// Delete vehicle
DELETE /api/admin/vehicles/{vehicleId}

// Update vehicle status
PUT /api/admin/vehicles/{vehicleId}/status

// Create vehicle config
POST /api/admin/vehicles/{vehicleId}/configs
Body: {color, batteryKwh, rangeKm}

// Update vehicle config
PUT /api/admin/vehicles/{vehicleId}/configs/{configId}
Body: {color, batteryKwh, rangeKm}

// Delete vehicle config
DELETE /api/admin/vehicles/{vehicleId}/configs/{configId}

// Update config status
PUT /api/admin/vehicles/{vehicleId}/configs/{configId}/status
```

---

## 📝 Usage Examples

### Get Vehicles with Filters
```javascript
import { dealerAPI } from '@/utils/api/services/dealer.api';

const result = await dealerAPI.getVehicles({
  Search: 'Tesla',
  Brand: 'Tesla',
  MinPrice: 30000,
  MaxPrice: 100000,
  Page: 1,
  Size: 10
});

if (result.success) {
  console.log(result.data);
}
```

### Create Test Drive
```javascript
const result = await dealerAPI.createTestDrive({
  customerId: 1,
  vehicleId: 5,
  dealerId: 3,
  scheduleDatetime: '2025-11-15T10:00:00',
  status: 'Scheduled'
});

if (result.success) {
  notifications.success('Đặt lịch lái thử thành công!');
}
```

### Get Test Drives for Dealer
```javascript
const dealerId = getCurrentDealerId(); // From auth context
const result = await dealerAPI.getTestDrives(dealerId, {
  Status: 'Pending',
  FromDate: '2025-11-01',
  ToDate: '2025-11-30',
  Page: 1,
  Size: 20
});
```

### Update Stock
```javascript
const result = await dealerAPI.updateStock({
  vehicleId: 1,
  configId: 2,
  quantity: 10,
  locationType: 'Dealer',
  locationId: 3
});
```

### Create Customer
```javascript
const result = await dealerAPI.createCustomer({
  fullName: 'Nguyễn Văn A',
  phone: '0123456789',
  address: '123 Đường ABC, TP.HCM',
  idDocumentNumber: '001234567890'
});
```

---

## 🎯 Parameter Naming Convention

**Important:** Backend uses **PascalCase** for query parameters!

| Frontend (Old) | Backend (Correct) |
|----------------|-------------------|
| page | Page |
| size/limit | Size |
| search | Search |
| brand | Brand |
| model | Model |
| status | Status |
| startDate | startDate (lowercase!) |
| endDate | endDate (lowercase!) |

---

## 🔒 Authentication

All endpoints require JWT Bearer token:
```
Authorization: Bearer {your_token_here}
```

Token is automatically added by `apiClient` from localStorage.

---

## ⚠️ Common Pitfalls

1. **Forgot dealerId for test drives**
   ```javascript
   // ❌ Wrong
   getTestDrives({ Status: 'Pending' })
   
   // ✅ Correct
   getTestDrives(dealerId, { Status: 'Pending' })
   ```

2. **Wrong parameter case**
   ```javascript
   // ❌ Wrong
   getVehicles({ page: 1, size: 10 })
   
   // ✅ Correct
   getVehicles({ Page: 1, Size: 10 })
   ```

3. **Cancel test drive body format**
   ```javascript
   // ❌ Wrong
   cancelTestDrive(id, { reason: 'Busy' })
   
   // ✅ Correct
   cancelTestDrive(id, 'Busy') // Raw string
   ```

4. **Update stock without stockId**
   ```javascript
   // ❌ Wrong
   updateStock(stockId, { quantity: 10 })
   
   // ✅ Correct
   updateStock({ vehicleId: 1, configId: 1, quantity: 10, locationType: 'Dealer', locationId: 3 })
   ```

---

## 📚 Response Format

All `dealerAPI` methods return:
```javascript
{
  success: true/false,
  data: {...},           // When success = true
  message: "Error msg"   // When success = false
}
```

Always check `success` before using `data`:
```javascript
const result = await dealerAPI.getVehicles();
if (result.success) {
  // Use result.data
} else {
  // Show result.message
}
```
