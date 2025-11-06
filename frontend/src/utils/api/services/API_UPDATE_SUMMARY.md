# API Update Summary - dealer.api.js

## ✅ Updated to Match Backend OpenAPI Specification

Date: 2025-11-06

---

## 🔄 Major Changes

### 1. **Dashboard Endpoints**
| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `GET /dealer/dashboard` | `GET /api/Dashboard/stats` | ✅ Updated |

### 2. **Vehicle Management**
| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `GET /dealer/vehicles` | `GET /api/Vehicles` | ✅ Updated |
| `GET /dealer/vehicles/:id` | `GET /api/Vehicles/{vehicleId}` | ✅ Updated |
| `GET /dealer/vehicles/search` | `GET /api/Vehicles?Search=...` | ✅ Updated |
| `POST /Vehicles/compare` | `POST /api/Vehicles/compare` | ✅ Fixed prefix |
| `GET /Vehicles/{vehicleId}/configs` | `GET /api/Vehicles/{vehicleId}/configs` | ✅ Fixed prefix |

**Query Parameters Updated:**
- `page, limit, search` → `Page, Size, Search, Brand, Model, MinPrice, MaxPrice`

### 3. **Inventory Management**
| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `POST /dealer/inventory/request` | `POST /api/Inventory/distributions` | ✅ Updated |
| `PUT /dealer/inventory/:id` | `POST /api/Inventory/stock` | ✅ Updated |
| `PUT /dealer/vehicles/:id/inventory` | `POST /api/Inventory/distributions/{id}/confirm` | ✅ Replaced |

**Method Changes:**
- `updateStock()` - Now uses POST instead of PUT, removed `stockId` parameter
- `requestStock()` - Endpoint changed to `/api/Inventory/distributions`
- Added `confirmDistribution()` - New method for confirming distributions

### 4. **Customer Management**
| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `GET /dealer/customers` | `GET /api/Customers/paged` | ✅ Updated |
| `GET /dealer/customers/:id` | `GET /api/Customers/{customerId}` | ✅ Updated |
| `POST /dealer/customers` | `POST /api/Customers` | ✅ Updated |
| `PUT /dealer/customers/:id` | `PUT /api/Customers/{customerId}` | ✅ Updated |
| `DELETE /dealer/customers/:id` | `DELETE /api/Customers/{customerId}` | ✅ Updated |

**Query Parameters Updated:**
- `page, limit` → `Page, Size, Search, Phone`

### 5. **Test Drive Management**
| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `GET /dealer/test-drives` | `GET /api/TestDrives/by-dealer/{dealerId}` | ✅ Updated |
| `GET /dealer/test-drives/:id` | `GET /api/TestDrives/{testId}` | ✅ Updated |
| `POST /dealer/test-drives` | `POST /api/TestDrives` | ✅ Updated |
| `PUT /dealer/test-drives/:id/status` | `PUT /api/TestDrives/{testId}/status` | ✅ Updated |
| `POST /dealer/test-drives/:id/cancel` | `PUT /api/TestDrives/{testId}/cancel` | ✅ Updated (POST→PUT) |
| `GET /dealer/test-drives/calendar` | Removed (not in backend) | ❌ Removed |
| `GET /dealer/test-drives/availability` | Removed (not in backend) | ❌ Removed |
| `PUT /dealer/test-drives/:id/feedback` | Removed (not in backend) | ❌ Removed |

**New Methods Added:**
- `getTestDrivesByCustomer()` - `GET /api/TestDrives/by-customer/{customerId}`
- `getTestDriveStatuses()` - `GET /api/TestDrives/statuses`

**Parameter Changes:**
- `getTestDrives()` - Now requires `dealerId` parameter
- `updateTestDriveStatus()` - Changed `note` parameter to `feedback`
- `cancelTestDrive()` - Changed from POST to PUT, body format changed

**Query Parameters Updated:**
- `date, status` → `Status, FromDate, ToDate, Page, Size`

### 6. **Dealer Management (NEW)**
All new endpoints added to match backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/manage/dealers/{dealerId}/contracts` | GET | Get dealer contracts |
| `/api/manage/dealers/{dealerId}/contracts` | POST | Create dealer contract |
| `/api/manage/dealers/{dealerId}/targets` | GET | Get dealer targets |
| `/api/manage/dealers/{dealerId}/targets` | POST | Set dealer target |
| `/api/manage/dealers/{dealerId}/performance` | GET | Get dealer performance |
| `/api/Dealers/paged` | GET | Get all dealers |
| `/api/Dealers/{dealerId}` | GET | Get dealer by ID |
| `/api/Dealers` | POST | Create dealer |
| `/api/Dealers/{dealerId}` | PUT | Update dealer |
| `/api/Dealers/{dealerId}` | DELETE | Delete dealer |

**New Methods:**
- `getDealerContracts(dealerId)`
- `createDealerContract(dealerId, contractData)`
- `getDealerTargets(dealerId)`
- `setDealerTarget(dealerId, targetData)`
- `getDealerPerformance(dealerId, params)`
- `getDealers(params)`
- `getDealerById(dealerId)`
- `createDealer(dealerData)`
- `updateDealer(dealerId, dealerData)`
- `deleteDealer(dealerId)`

---

## 📋 Endpoints Not Yet Implemented (Not in Backend API)

The following methods remain in `dealer.api.js` but do NOT have corresponding backend endpoints. These use placeholder `/dealer/*` paths:

### Order Management
- `getOrders()` - `GET /dealer/orders`
- `getOrderById()` - `GET /dealer/orders/:id`
- `createOrder()` - `POST /dealer/orders`
- `updateOrder()` - `PUT /dealer/orders/:id`
- `updateOrderStatus()` - `PUT /dealer/orders/:id/status`
- `cancelOrder()` - `POST /dealer/orders/:id/cancel`

### Quotation Management
- `getQuotations()` - `GET /dealer/quotations`
- `getQuotationById()` - `GET /dealer/quotations/:id`
- `createQuotation()` - `POST /dealer/quotations`
- `updateQuotation()` - `PUT /dealer/quotations/:id`

### Payment Management
- `getPayments()` - `GET /dealer/payments`
- `processPayment()` - `POST /dealer/orders/:id/payment`

### Analytics & Reports
- `getDashboardStats()` - `GET /dealer/analytics/dashboard`
- `getSalesReport()` - `GET /dealer/analytics/sales`
- `getInventoryReport()` - `GET /dealer/analytics/inventory`
- `getCustomerInsights()` - `GET /dealer/analytics/customers`
- `getTestDriveAnalytics()` - `GET /dealer/analytics/test-drives`
- `getPerformanceStats()` - `GET /dealer/analytics/performance`

### Debt Management
- `getCustomerDebtReport()` - `GET /dealer/reports/customer-debt`
- `getSupplierDebtReport()` - `GET /dealer/reports/supplier-debt`
- `getAgingReport()` - `GET /dealer/reports/aging`
- `sendDebtReminder()` - `POST /dealer/debts/:debtId/remind`
- `sendBulkDebtReminders()` - `POST /dealer/debts/remind-bulk`
- `calculateCustomerOutstanding()` - `GET /dealer/customers/:customerId/outstanding`
- `exportDebtReport()` - `GET /dealer/reports/debt/export`

### Promotions
- `getPromotions()` - `GET /dealer/promotions`
- `createPromotion()` - `POST /dealer/promotions`
- `updatePromotion()` - `PUT /dealer/promotions/:id`
- `deletePromotion()` - `DELETE /dealer/promotions/:id`

### Dealer Profile
- `getDealerProfile()` - `GET /dealer/profile`
- `updateDealerProfile()` - `PUT /dealer/profile`
- `getShopInfo()` - `GET /dealer/shop`
- `updateShopInfo()` - `PUT /dealer/shop`

### Notifications
- `getNotifications()` - `GET /dealer/notifications`
- `markNotificationRead()` - `PUT /dealer/notifications/:id/read`
- `markAllNotificationsRead()` - `PUT /dealer/notifications/read-all`

### Customer Related
- `getCustomerPurchaseHistory()` - `GET /dealer/customers/:id/purchases`

### Inventory Related
- `getStockById()` - `GET /dealer/inventory/:id`
- `getInventoryStats()` - `GET /dealer/inventory/stats`

> **Note:** These methods should either:
> 1. Be removed if not needed
> 2. Have backend endpoints implemented
> 3. Be updated when backend APIs are ready

---

## 🎯 Backend Endpoints Available But Not Used

The following backend endpoints exist but are NOT yet implemented in `dealer.api.js`:

### Admin Vehicles
- `GET /api/admin/vehicles` - Get all vehicles (admin)
- `POST /api/admin/vehicles` - Create vehicle
- `PUT /api/admin/vehicles/{vehicleId}` - Update vehicle
- `DELETE /api/admin/vehicles/{vehicleId}` - Delete vehicle
- `PUT /api/admin/vehicles/{vehicleId}/status` - Update vehicle status
- `POST /api/admin/vehicles/{vehicleId}/configs` - Create vehicle config
- `PUT /api/admin/vehicles/{vehicleId}/configs/{configId}` - Update vehicle config
- `DELETE /api/admin/vehicles/{vehicleId}/configs/{configId}` - Delete vehicle config
- `PUT /api/admin/vehicles/{vehicleId}/configs/{configId}/status` - Update config status

### Analytics
- `GET /api/Analytics/sales-by-dealer` - Sales by dealer
- `GET /api/Analytics/inventory-turnover` - Inventory turnover
- `GET /api/Analytics/demand-forecasts` - Demand forecasts
- `POST /api/Analytics/run-demand-forecast` - Run demand forecast

### Auth
- `POST /api/Auth/login` - User login
- `GET /api/Auth/hash/{password}` - Hash password

### Pricing
- `POST /api/pricing/wholesale-prices` - Set wholesale price
- `POST /api/pricing/promotion-policies` - Create promotion policy
- `GET /api/pricing/dealers/{dealerId}/vehicles/{vehicleId}/applicable-price` - Get applicable price

### Supply Planning
- `GET /api/planning/distribution-suggestions` - Distribution suggestions
- `POST /api/planning/run-suggestion-generator` - Run suggestion generator
- `GET /api/planning/production-report` - Production report

### Users
- `GET /api/Users` - Get all users
- `POST /api/Users` - Create user
- `GET /api/Users/{id}` - Get user by ID
- `PUT /api/Users/{id}` - Update user
- `PATCH /api/Users/{id}/status` - Update user status

### Dashboard
- `GET /api/Dashboard/user-info` - Get user info

### Customers (Additional)
- `GET /api/Customers` - Get all customers (non-paged)
- `GET /api/Customers/by-phone/{phone}` - Get customer by phone

### Dealers (Additional)
- `GET /api/Dealers` - Get all dealers (non-paged)
- `GET /api/Dealers/by-phone/{phone}` - Get dealer by phone
- `GET /api/Dealers/by-name/{name}` - Get dealer by name

---

## 📝 DTO Schemas from Backend

### Key Data Transfer Objects:

**Vehicle:**
- `CreateVehicleDto`: {model, brand, year, basePrice, imageUrl}
- `UpdateVehicleDto`: {model, brand, year, basePrice, imageUrl}

**Customer:**
- `CustomerCreateDto`: {fullName, phone, address, idDocumentNumber}
- `CustomerUpdateDto`: {fullName, phone, address, idDocumentNumber}

**Dealer:**
- `DealerCreateDto`: {name, address, phone}
- `DealerUpdateDto`: {name, address, phone}

**TestDrive:**
- `TestDriveCreateDto`: {customerId, vehicleId, dealerId, scheduleDatetime, status}
- `TestDriveUpdateStatusDto`: {status, feedback}

**Inventory:**
- `UpdateStockDto`: {vehicleId, configId, quantity, locationType, locationId}
- `CreateDistributionDto`: {vehicleId, configId, quantity, fromLocation, toDealerId, scheduledDate}

**Dealer Management:**
- `CreateContractDto`: {startDate, endDate, terms, status}
- `SetTargetDto`: {periodStart, periodEnd, salesTarget}

**Pricing:**
- `SetWholesalePriceDto`: {productId, dealerId, price, validFrom, validTo}
- `CreatePromotionPolicyDto`: {dealerId, description, discountPercent, conditions, startDate, endDate}

---

## ⚠️ Breaking Changes

### 1. Test Drive Methods
```javascript
// OLD
getTestDrives(params) // No dealerId required

// NEW
getTestDrives(dealerId, params) // dealerId is required
```

### 2. Inventory Methods
```javascript
// OLD
updateStock(stockId, updateData) // 2 parameters

// NEW
updateStock(updateData) // 1 parameter, no stockId
```

### 3. Cancel Test Drive
```javascript
// OLD - POST with object
cancelTestDrive(testDriveId, reason) 
// Sent: POST /dealer/test-drives/:id/cancel
// Body: { reason: "..." }

// NEW - PUT with string
cancelTestDrive(testDriveId, reason)
// Sent: PUT /api/TestDrives/{testId}/cancel
// Body: "..." (raw string)
```

### 4. Update Test Drive Status
```javascript
// OLD
updateTestDriveStatus(id, status, note)

// NEW
updateTestDriveStatus(id, status, feedback)
// Parameter renamed: note → feedback
```

---

## 🔧 Migration Guide for Components

### Components Using Vehicle APIs
✅ **No changes needed** - Already updated in previous migration:
- `VehicleList.jsx`
- `VehicleDetail.jsx`
- `CompareVehicles.jsx`

### Components That Need Updates:

#### 1. **TestDrive Components**
Update all components calling test drive APIs:
```javascript
// OLD
const result = await dealerAPI.getTestDrives({ status: 'pending' });

// NEW - Add dealerId
const dealerId = getCurrentDealerId(); // Get from auth context
const result = await dealerAPI.getTestDrives(dealerId, { Status: 'pending' });
```

#### 2. **Customer Components**
Update query parameter names:
```javascript
// OLD
const result = await dealerAPI.getCustomers({ page: 1, limit: 10, search: 'John' });

// NEW - Capitalize parameter names
const result = await dealerAPI.getCustomers({ Page: 1, Size: 10, Search: 'John' });
```

#### 3. **Inventory Components**
Update stock update calls:
```javascript
// OLD
const result = await dealerAPI.updateStock(stockId, { quantity: 10 });

// NEW - No stockId parameter
const result = await dealerAPI.updateStock({ 
  vehicleId: 1, 
  configId: 1, 
  quantity: 10,
  locationType: 'Dealer',
  locationId: dealerId
});
```

---

## ✅ Testing Checklist

- [ ] Test vehicle listing with new query parameters
- [ ] Test vehicle detail page
- [ ] Test vehicle comparison
- [ ] Test vehicle configurations
- [ ] Test customer CRUD operations
- [ ] Test test drive management with dealerId
- [ ] Test inventory stock updates
- [ ] Test inventory distribution requests
- [ ] Test dealer management endpoints
- [ ] Verify all error handling still works
- [ ] Check notification system integration

---

## 📚 References

- Backend OpenAPI Specification: Provided on 2025-11-06
- Previous API Documentation: `API_INTEGRATION.md`
- Base API Client: `frontend/src/utils/api/client.js`

---

## 🚀 Next Steps

1. **Remove unused methods** - Clean up methods without backend endpoints
2. **Implement missing endpoints** - Either in frontend or request backend implementation
3. **Update components** - Apply breaking changes to all affected components
4. **Add admin APIs** - Create separate `admin.api.js` for admin vehicle endpoints
5. **Add auth APIs** - Create `auth.api.js` for authentication
6. **Add analytics APIs** - Create `analytics.api.js` for reporting features
7. **Testing** - Comprehensive testing with actual backend
8. **Documentation** - Update component documentation with new API usage

---

**Status:** ✅ Core APIs Updated | ⚠️ Components Need Migration | 🔄 Testing Required
