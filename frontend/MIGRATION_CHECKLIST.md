# 🔄 Migration Checklist - API Updates

## ✅ Completed Tasks

- [x] Updated `dealer.api.js` to match backend OpenAPI specification
- [x] Fixed all `/dealer/*` endpoints to use `/api/*` prefix
- [x] Updated Vehicle endpoints
- [x] Updated Customer endpoints
- [x] Updated TestDrive endpoints
- [x] Updated Inventory endpoints
- [x] Added Dealer Management endpoints
- [x] Created API documentation
- [x] Created quick reference guide

---

## 🚨 Breaking Changes - Action Required

### 1. TestDrive Components Need Updates

**Priority: HIGH** ⚠️

**Files to Check:**
```
frontend/src/modules/Dealer/TestDrives/
frontend/src/features/testdrives/
```

**Required Changes:**
```javascript
// BEFORE
const result = await dealerAPI.getTestDrives({ status: 'pending' });

// AFTER - Add dealerId parameter
const dealerId = getCurrentDealerId(); // Get from auth/context
const result = await dealerAPI.getTestDrives(dealerId, { Status: 'pending' });
```

**Parameter Changes:**
- `status` → `Status` (capitalize)
- `date` → `FromDate` / `ToDate`
- Add `dealerId` as first parameter

**Method Signature Changed:**
```javascript
// OLD
async getTestDrives(params = {})

// NEW
async getTestDrives(dealerId, params = {})
```

---

### 2. Customer Components Need Updates

**Priority: MEDIUM** ⚠️

**Files to Check:**
```
frontend/src/modules/Dealer/Customers/
frontend/src/features/customers/
```

**Required Changes:**
```javascript
// BEFORE
const result = await dealerAPI.getCustomers({ 
  page: 1, 
  limit: 10, 
  search: 'John' 
});

// AFTER - Capitalize parameter names
const result = await dealerAPI.getCustomers({ 
  Page: 1, 
  Size: 10, 
  Search: 'John' 
});
```

**Parameter Name Changes:**
- `page` → `Page`
- `limit` → `Size`
- `search` → `Search`
- `phone` → `Phone`

---

### 3. Inventory Components Need Updates

**Priority: HIGH** ⚠️

**Files to Check:**
```
frontend/src/modules/Dealer/Inventory/
frontend/src/features/inventory/
frontend/src/modules/Dealer/DealerDashboard/sections/InventorySection.jsx
```

**Required Changes:**

#### Update Stock Method
```javascript
// BEFORE
const result = await dealerAPI.updateStock(stockId, { quantity: 10 });

// AFTER - No stockId parameter
const result = await dealerAPI.updateStock({
  vehicleId: 1,
  configId: 1,
  quantity: 10,
  locationType: 'Dealer',
  locationId: dealerId
});
```

#### Request Stock Method
```javascript
// BEFORE
const result = await dealerAPI.requestStock({
  vehicleId: 1,
  quantity: 5
});

// AFTER - New required fields
const result = await dealerAPI.requestStock({
  vehicleId: 1,
  configId: 1,
  quantity: 5,
  fromLocation: 'Factory',
  toDealerId: dealerId,
  scheduledDate: '2025-11-15'
});
```

#### New Confirm Distribution Method
```javascript
// NEW METHOD AVAILABLE
const result = await dealerAPI.confirmDistribution(distributionId);
```

---

### 4. Vehicle Components - Already Updated ✅

**No action needed** - These were updated in previous migration:
- `VehicleList.jsx` ✅
- `VehicleDetail.jsx` ✅
- `CompareVehicles.jsx` ✅

But verify parameter names if using filters:
```javascript
// Correct parameter names
const result = await dealerAPI.getVehicles({
  Search: 'Tesla',
  Brand: 'Tesla',
  Model: 'Model 3',
  MinPrice: 30000,
  MaxPrice: 100000,
  Page: 1,
  Size: 10
});
```

---

### 5. Cancel TestDrive - Body Format Changed

**Priority: MEDIUM** ⚠️

**Files to Check:**
```
Any file calling cancelTestDrive()
```

**Required Changes:**
```javascript
// BEFORE
const result = await dealerAPI.cancelTestDrive(testDriveId, { reason: 'Busy' });

// AFTER - Send raw string, not object
const result = await dealerAPI.cancelTestDrive(testDriveId, 'Customer is busy');
```

**HTTP Method Changed:**
- `POST` → `PUT`

---

### 6. Update TestDrive Status - Parameter Renamed

**Priority: LOW** ⚠️

**Files to Check:**
```
Any file calling updateTestDriveStatus()
```

**Required Changes:**
```javascript
// BEFORE
const result = await dealerAPI.updateTestDriveStatus(id, 'Completed', 'Great experience');

// AFTER - note → feedback (same usage, just renamed)
const result = await dealerAPI.updateTestDriveStatus(id, 'Completed', 'Great experience');
```

**Backend Parameter:**
- `note` → `feedback`

---

## 📋 Component Files to Review

### Search for These Patterns:

```bash
# Search for dealerAPI usage
grep -r "dealerAPI\." frontend/src/

# Search for specific methods
grep -r "getTestDrives" frontend/src/
grep -r "getCustomers" frontend/src/
grep -r "updateStock" frontend/src/
grep -r "requestStock" frontend/src/
grep -r "cancelTestDrive" frontend/src/
```

### Likely Files:

```
frontend/src/modules/Dealer/DealerDashboard/
  ├── sections/InventorySection.jsx
  ├── sections/CustomersSection.jsx
  └── sections/OrdersSection.jsx

frontend/src/modules/Dealer/TestDrives/
  ├── TestDriveList.jsx
  ├── TestDriveDetail.jsx
  ├── CreateTestDrive.jsx
  └── TestDriveCalendar.jsx (if exists)

frontend/src/modules/Dealer/Customers/
  ├── CustomerList.jsx
  ├── CustomerDetail.jsx
  └── CreateCustomer.jsx

frontend/src/modules/Dealer/Inventory/
  ├── InventoryList.jsx
  ├── StockRequest.jsx
  └── StockManagement.jsx
```

---

## 🆕 New Features Available

### 1. Get Test Drives by Customer
```javascript
const customerId = 123;
const result = await dealerAPI.getTestDrivesByCustomer(customerId, {
  Status: 'Completed',
  FromDate: '2025-01-01',
  ToDate: '2025-11-30'
});
```

### 2. Get Test Drive Statuses
```javascript
const result = await dealerAPI.getTestDriveStatuses();
// Returns list of valid statuses
```

### 3. Dealer Management
```javascript
// Get dealer contracts
const contracts = await dealerAPI.getDealerContracts(dealerId);

// Create contract
const newContract = await dealerAPI.createDealerContract(dealerId, {
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  terms: 'Standard dealer terms',
  status: 'Active'
});

// Get dealer targets
const targets = await dealerAPI.getDealerTargets(dealerId);

// Set dealer target
const target = await dealerAPI.setDealerTarget(dealerId, {
  periodStart: '2025-01-01',
  periodEnd: '2025-12-31',
  salesTarget: 100
});

// Get dealer performance
const performance = await dealerAPI.getDealerPerformance(dealerId, {
  startDate: '2025-01-01',
  endDate: '2025-11-30'
});
```

### 4. Dealer CRUD Operations
```javascript
// Get all dealers
const dealers = await dealerAPI.getDealers({ Page: 1, Size: 10 });

// Get dealer by ID
const dealer = await dealerAPI.getDealerById(dealerId);

// Create dealer
const newDealer = await dealerAPI.createDealer({
  name: 'New Dealer',
  address: '123 Street',
  phone: '0123456789'
});

// Update dealer
const updated = await dealerAPI.updateDealer(dealerId, {
  name: 'Updated Name',
  address: '456 Street',
  phone: '0987654321'
});

// Delete dealer
const deleted = await dealerAPI.deleteDealer(dealerId);
```

### 5. Confirm Distribution
```javascript
const result = await dealerAPI.confirmDistribution(distributionId);
```

---

## ❌ Removed Methods

These methods no longer exist in `dealer.api.js`:

### TestDrive Related:
- ❌ `getTestDriveCalendar(startDate, endDate)` - Not in backend
- ❌ `checkTestDriveAvailability(vehicleId, date)` - Not in backend
- ❌ `updateTestDriveFeedback(testDriveId, feedback)` - Not in backend
- ❌ `updateTestDrive(testDriveId, updateData)` - Replaced with `updateTestDriveStatus()`

### Inventory Related:
- ❌ `updateInventory(id, quantity)` - Replaced with `updateStock()`
- ❌ `getStockById(stockId)` - Not in backend API

**Action Required:**
- Remove any code calling these methods
- Use `updateTestDriveStatus()` instead of `updateTestDrive()`
- Use `updateStock()` with full data instead of `updateInventory()`

---

## 🧪 Testing Tasks

### Unit Tests to Update:
```
tests/dealer.api.test.js (if exists)
```

### Manual Testing Checklist:

- [ ] **Vehicles**
  - [ ] List vehicles with filters
  - [ ] View vehicle details
  - [ ] Compare vehicles
  - [ ] View vehicle configurations

- [ ] **Customers**
  - [ ] List customers with pagination
  - [ ] Create new customer
  - [ ] View customer details
  - [ ] Update customer
  - [ ] Delete customer

- [ ] **Test Drives**
  - [ ] Get test drives for dealer (with dealerId)
  - [ ] Get test drives for customer
  - [ ] Create test drive appointment
  - [ ] Update test drive status
  - [ ] Cancel test drive
  - [ ] Get test drive statuses list

- [ ] **Inventory**
  - [ ] Update stock (new format)
  - [ ] Request distribution (new format)
  - [ ] Confirm distribution

- [ ] **Dealers**
  - [ ] List dealers
  - [ ] View dealer details
  - [ ] Create dealer
  - [ ] Update dealer
  - [ ] Delete dealer

- [ ] **Dealer Management**
  - [ ] Get dealer contracts
  - [ ] Create dealer contract
  - [ ] Get dealer targets
  - [ ] Set dealer target
  - [ ] Get dealer performance

---

## 🔍 Code Review Points

### 1. Check Query Parameter Names
```javascript
// ❌ Bad - Lowercase
getVehicles({ page: 1, size: 10, search: 'Tesla' })

// ✅ Good - PascalCase (except dates)
getVehicles({ Page: 1, Size: 10, Search: 'Tesla' })
```

### 2. Check dealerId Parameter
```javascript
// ❌ Bad - Missing dealerId
getTestDrives({ Status: 'Pending' })

// ✅ Good - Include dealerId
getTestDrives(dealerId, { Status: 'Pending' })
```

### 3. Check Error Handling
```javascript
// ✅ Good - Always check success
const result = await dealerAPI.getVehicles();
if (result.success) {
  setVehicles(result.data);
} else {
  notifications.error(result.message);
}
```

### 4. Check Data Structure
```javascript
// ✅ Good - Include all required fields
updateStock({
  vehicleId: 1,
  configId: 1,
  quantity: 10,
  locationType: 'Dealer',
  locationId: dealerId
});
```

---

## 📝 Documentation Updates Needed

- [ ] Update component props documentation
- [ ] Update API integration guides
- [ ] Update developer onboarding docs
- [ ] Add migration notes to CHANGELOG
- [ ] Update Postman/API testing collection

---

## 🚀 Deployment Checklist

- [ ] All components updated and tested locally
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] No console errors in browser
- [ ] API calls working with actual backend
- [ ] Error handling verified
- [ ] Loading states working
- [ ] Notifications displaying correctly
- [ ] Code reviewed by team
- [ ] QA testing completed
- [ ] Staging deployment successful
- [ ] Production deployment scheduled

---

## 📞 Support & Questions

**Issues with API updates?**
1. Check `API_UPDATE_SUMMARY.md` for detailed changes
2. Review `QUICK_REFERENCE.md` for endpoint usage examples
3. Check `API_INTEGRATION.md` for integration patterns
4. Contact backend team for API clarifications
5. Review OpenAPI specification provided

**Common Questions:**

**Q: Why do I need dealerId for test drives now?**
A: Backend endpoint changed from `/dealer/test-drives` to `/api/TestDrives/by-dealer/{dealerId}`, requiring the dealer ID as a path parameter.

**Q: Why are parameter names capitalized?**
A: Backend API uses PascalCase for query parameters (Page, Size, Search), but lowercase for some date parameters (startDate, endDate).

**Q: Can I still use old endpoints?**
A: No, old `/dealer/*` endpoints don't exist in backend. You must use `/api/*` endpoints.

**Q: What about methods not in backend?**
A: Methods without backend endpoints (like orders, quotations) are kept with placeholder endpoints. They'll work when backend implements them.

---

**Last Updated:** 2025-11-06
**Version:** 1.0.0
**Status:** ⚠️ Breaking Changes - Migration Required
