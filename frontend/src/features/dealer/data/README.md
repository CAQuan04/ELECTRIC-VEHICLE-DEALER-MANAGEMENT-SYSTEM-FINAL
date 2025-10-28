# Dealer Mock Data - Hướng Dẫn Sử Dụng

## 📁 File mockData.js

File này chứa **TẤT CẢ** mock data cho dealer module, giúp:
- ✅ Dễ quản lý và cập nhật data
- ✅ Tránh duplicate code
- ✅ Dễ migrate sang real API sau này
- ✅ Type consistency across components

## 🎯 Cách Sử Dụng

### 1. Import Mock Data

```javascript
// Import một mock data
import { MOCK_VEHICLES } from '../data/mockData';

// Import nhiều mock data
import { 
  MOCK_VEHICLES, 
  MOCK_CUSTOMERS,
  MOCK_TEST_DRIVES 
} from '../data/mockData';
```

### 2. Sử Dụng Trong Component

```javascript
import React, { useState, useEffect } from 'react';
import { MOCK_VEHICLES } from '../../data/mockData';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // TODO: Replace with real API call
      // const response = await vehicleAPI.getAll();
      // setVehicles(response.data);
      
      setVehicles(MOCK_VEHICLES);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!vehicles) return <div>No data</div>;

  return (
    <div>
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))}
    </div>
  );
};
```

## 📦 Available Mock Data

### Dashboard
- `MOCK_DASHBOARD_DATA` - Dashboard metrics và overview data

### Vehicles
- `MOCK_VEHICLES` - Danh sách xe
- `MOCK_VEHICLE_DETAIL` - Chi tiết một xe
- `MOCK_COMPARE_VEHICLES` - Dữ liệu so sánh xe

### Inventory
- `MOCK_INVENTORY` - Danh sách tồn kho
- `MOCK_STOCK_DETAIL` - Chi tiết một stock item

### Customers
- `MOCK_CUSTOMERS` - Danh sách khách hàng
- `MOCK_CUSTOMER_DETAIL` - Chi tiết khách hàng

### Test Drives
- `MOCK_TEST_DRIVES` - Danh sách lịch lái thử
- `MOCK_TEST_DRIVE_APPOINTMENTS` - Lịch hẹn chi tiết
- `MOCK_TEST_DRIVE_DETAIL` - Chi tiết một cuộc hẹn

### Sales
- `MOCK_QUOTATIONS` - Danh sách báo giá
- `MOCK_ORDERS` - Danh sách đơn hàng
- `MOCK_PAYMENTS` - Danh sách thanh toán

### Purchase
- `MOCK_PURCHASE_REQUESTS` - Danh sách yêu cầu mua hàng

### Reports
- `MOCK_SALES_REPORT` - Báo cáo bán hàng
- `MOCK_CUSTOMER_DEBT` - Công nợ khách hàng (AR)
- `MOCK_SUPPLIER_DEBT` - Công nợ nhà cung cấp (AP)
- `MOCK_SALES_PERFORMANCE` - Hiệu suất bán hàng
- `MOCK_AR_DATA` - Accounts Receivable data
- `MOCK_AP_DATA` - Accounts Payable data

### Promotions
- `MOCK_PROMOTIONS` - Danh sách khuyến mãi
- `MOCK_PROMOTION_DETAIL` - Chi tiết khuyến mãi

### Staff
- `MOCK_STAFF` - Danh sách nhân viên

## 🔄 Migration từ Local Mock Data

### Before (❌ Cũ)
```javascript
const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Mock data nằm trong component
    const mockVehicles = [
      { id: 1, name: 'Model 3', price: '1.5 tỷ' },
      { id: 2, name: 'Model Y', price: '1.8 tỷ' }
    ];
    setVehicles(mockVehicles);
  }, []);

  return <div>...</div>;
};
```

### After (✅ Mới)
```javascript
import { MOCK_VEHICLES } from '../../data/mockData';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      // TODO: Replace with API call
      setVehicles(MOCK_VEHICLES);
    } finally {
      setLoading(false);
    }
  };

  return <div>...</div>;
};
```

## 🚀 Next Steps - Migrate to Real API

### 1. Create API Service

```javascript
// src/features/dealer/api/vehicleAPI.js
import { apiClient } from '@utils/api';

export const vehicleAPI = {
  getAll: () => apiClient.get('/vehicles'),
  getById: (id) => apiClient.get(`/vehicles/${id}`),
  create: (data) => apiClient.post('/vehicles', data),
  update: (id, data) => apiClient.put(`/vehicles/${id}`, data),
  delete: (id) => apiClient.delete(`/vehicles/${id}`)
};
```

### 2. Replace Mock Data với API Call

```javascript
import { vehicleAPI } from '../../api/vehicleAPI';
// import { MOCK_VEHICLES } from '../../data/mockData'; // Comment out

const loadVehicles = async () => {
  try {
    setLoading(true);
    
    // ✅ Real API call
    const response = await vehicleAPI.getAll();
    setVehicles(response.data);
    
    // ❌ Mock data (remove or comment)
    // setVehicles(MOCK_VEHICLES);
  } catch (error) {
    console.error('Error loading vehicles:', error);
    // Fallback to mock data if API fails (optional)
    // setVehicles(MOCK_VEHICLES);
  } finally {
    setLoading(false);
  }
};
```

## 📝 Best Practices

### 1. Always Use Proper Initial State
```javascript
// ❌ BAD - Có thể gây crash khi render
const [vehicles, setVehicles] = useState([]);

// ✅ GOOD - Null check trước khi render
const [vehicles, setVehicles] = useState(null);

// Render
if (!vehicles) return <LoadingSkeleton />;
```

### 2. Add Loading và Error States
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Loading
if (loading) return <LoadingSkeleton />;

// Error
if (error) return <ErrorMessage error={error} />;

// Empty
if (!data || data.length === 0) return <EmptyState />;

// Success
return <DataList data={data} />;
```

### 3. Always Comment TODO for API Migration
```javascript
// TODO: Replace with real API call
// const response = await vehicleAPI.getAll();
// setVehicles(response.data);
setVehicles(MOCK_VEHICLES);
```

### 4. Use Async/Await Pattern
```javascript
const loadData = async () => {
  try {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    setData(MOCK_DATA);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testing

### Test với Mock Data
```javascript
import { MOCK_VEHICLES } from '../data/mockData';

describe('VehicleList', () => {
  it('should render vehicle list', () => {
    render(<VehicleList vehicles={MOCK_VEHICLES} />);
    expect(screen.getByText('Model 3')).toBeInTheDocument();
  });
});
```

## 🎨 UI States Checklist

- [ ] **Loading State** - Hiển thị skeleton hoặc spinner
- [ ] **Empty State** - Hiển thị khi không có data
- [ ] **Error State** - Hiển thị khi có lỗi
- [ ] **Success State** - Hiển thị data bình thường
- [ ] **Retry Mechanism** - Cho phép user retry khi lỗi

## 📚 Related Files

- `mockData.js` - Tất cả mock data
- `CODE_QUALITY_REPORT.md` - Báo cáo quality và progress
- `REFACTOR_CHECKLIST.js` - Checklist chi tiết từng file

## 🆘 Troubleshooting

### Issue: Import không hoạt động
```javascript
// ❌ Sai đường dẫn
import { MOCK_VEHICLES } from '../mockData';

// ✅ Đúng đường dẫn
import { MOCK_VEHICLES } from '../../data/mockData';
```

### Issue: Data không hiển thị
1. Check console.log để debug
2. Kiểm tra initial state (null vs [])
3. Kiểm tra conditional rendering
4. Kiểm tra mock data structure

### Issue: Type mismatch
1. Xem structure của mock data
2. Đảm bảo component expect đúng type
3. Thêm PropTypes hoặc TypeScript

---

**Happy Coding! 🚀**
