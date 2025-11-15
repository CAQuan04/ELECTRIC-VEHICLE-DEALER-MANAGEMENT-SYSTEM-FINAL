# Hướng dẫn Routing theo DealerId

## 📋 Tổng quan

Hệ thống đã được cập nhật để hỗ trợ routing dựa trên `dealerId` cho các trang Dealer. URL sẽ có dạng:
- `/:dealerId/dealer-dashboard` - Dashboard của đại lý
- `/:dealerId/dealer/*` - Các trang con của đại lý

## 🔄 Các thay đổi chính

### 1. AuthContext.jsx
**Mục đích:** Xác định trang dashboard mặc định dựa trên role và dealerId

```javascript
const getDefaultDashboard = () => {
  const role = user?.role;
  const dealerId = user?.dealerId;
  
  if (role === 'Admin') return '/evm-dashboard';
  if (role === 'EVMStaff') return '/staff-dashboard';
  if ((role === 'DealerManager' || role === 'DealerStaff') && dealerId) {
    return `/${dealerId}/dealer-dashboard`; // ✨ Bao gồm dealerId trong URL
  }
  if (role === 'Customer') return '/customer-dashboard';
  return '/landing';
};
```

### 2. AuthComponent.jsx
**Mục đích:** Chuyển hướng sau khi đăng nhập với dealerId

```javascript
// Xử lý redirect cho Dealer
if (role === 'DealerManager' || role === 'DealerStaff') {
  if (dealerId) {
    navigate(`/${dealerId}/dealer-dashboard`); // ✨ Redirect với dealerId
  } else {
    navigate('/dealer-dashboard'); // Fallback nếu không có dealerId
  }
}
```

### 3. App.jsx
**Mục đích:** Định nghĩa các route với tham số dealerId động

```javascript
{/* Route chính với dealerId */}
<Route 
  path="/:dealerId/dealer-dashboard" 
  element={
    <DealerGuard>
      <DealerDashboard />
    </DealerGuard>
  } 
/>

{/* Fallback route không có dealerId */}
<Route 
  path="/dealer-dashboard" 
  element={
    <DealerGuard>
      <DealerDashboard />
    </DealerGuard>
  } 
/>
```

### 4. Sidebar.jsx
**Mục đích:** Tạo menu navigation động với dealerId

```javascript
// Lấy dealerId từ user context
const dealerId = user?.dealerId;

// Tạo basePath động
const basePath = dealerId ? `/${dealerId}/dealer` : '/dealer';

// Menu items
const menuItems = useMemo(() => {
  if (userRole === 'DealerManager' || userRole === 'DealerStaff') {
    return [
      { 
        path: `${dealerId ? `/${dealerId}` : ''}/dealer-dashboard`, 
        icon: RiHome4Line, 
        label: "Trang chủ" 
      },
      { path: `${basePath}/vehicles`, icon: RiCarLine, label: "Catalog Xe" },
      { path: `${basePath}/inventory`, icon: RiBox3Line, label: "Kho" },
      // ... các menu item khác
    ];
  }
  // ...
}, [userRole, notifications, user?.dealerId]); // ✨ Thêm dealerId vào dependencies
```

### 5. RoleGuard.jsx - DealerGuard
**Mục đích:** Kiểm tra dealerId trong URL khớp với user

```javascript
export const DealerGuard = ({ children }) => {
  const { user } = useAuth();
  const location = window.location;
  
  // Lấy dealerId từ URL
  const pathParts = location.pathname.split('/');
  const urlDealerId = pathParts[1];
  
  // Kiểm tra dealerId khớp
  if (urlDealerId && !isNaN(urlDealerId)) {
    const userDealerIdStr = user?.dealerId?.toString();
    if (urlDealerId !== userDealerIdStr) {
      return <Navigate to="/access-denied" replace />;
    }
  }
  
  return (
    <RoleGuard allowedRoles={['DealerManager', 'DealerStaff']}>
      {children}
    </RoleGuard>
  );
};
```

### 6. DealerDashboard.jsx
**Mục đích:** Sử dụng dealerId từ URL để hiển thị thông tin

```javascript
import { useNavigate, useParams } from 'react-router-dom';

const DealerDashboard = () => {
  const { dealerId } = useParams(); // ✨ Lấy dealerId từ URL
  const currentUser = AuthService.getCurrentUser();
  
  console.log('📍 DealerId from URL:', dealerId);
  console.log('👤 Current User dealerId:', currentUser?.dealerId);
  
  // Hiển thị thông tin dealer
  return (
    <div>
      {dealerId && (
        <div>Đại lý ID: {dealerId}</div>
      )}
      {dealer?.dealerName && (
        <div>Tên đại lý: {dealer.dealerName}</div>
      )}
    </div>
  );
};
```

## 🎯 Cấu trúc URL mới

### Dealer Routes với DealerId
```
/:dealerId/dealer-dashboard           # Dashboard chính
/:dealerId/dealer/vehicles            # Danh sách xe (đã sẵn sàng)
/:dealerId/dealer/inventory           # Kho xe (đã sẵn sàng)
/:dealerId/dealer/customers           # Khách hàng (đã sẵn sàng)
/:dealerId/dealer/test-drives         # Lái thử (đã sẵn sàng)
/:dealerId/dealer/orders              # Đơn hàng (đã sẵn sàng)
/:dealerId/dealer/quotations          # Báo giá (đã sẵn sàng)
/:dealerId/dealer/payments            # Thanh toán (đã sẵn sàng)
/:dealerId/dealer/reports/*           # Báo cáo (đã sẵn sàng)
/:dealerId/dealer/promotions          # Khuyến mãi (đã sẵn sàng)
/:dealerId/dealer/staff               # Nhân viên (đã sẵn sàng)
```

### Fallback Routes (không có dealerId)
```
/dealer-dashboard                      # Fallback cho dashboard
/dealer/vehicles                       # Fallback cho các trang con
/dealer/inventory
# ... các route khác tương tự
```

## 🔒 Bảo mật

### DealerGuard validation:
1. **Kiểm tra role:** User phải là `DealerManager` hoặc `DealerStaff`
2. **Kiểm tra dealerId:** DealerId trong URL phải khớp với `user.dealerId`
3. **Redirect nếu không khớp:** Chuyển đến `/access-denied`

```javascript
// Ví dụ:
// User có dealerId = 123
// ✅ Có thể truy cập: /123/dealer-dashboard
// ❌ Không thể truy cập: /456/dealer-dashboard → redirect /access-denied
```

## 📝 Cách sử dụng

### 1. Đăng nhập
```javascript
// Khi user đăng nhập thành công
const loginResponse = {
  user: {
    id: 1,
    name: "John Doe",
    role: "DealerManager",
    dealerId: 123,  // ← Quan trọng!
    dealerShopId: 5
  },
  token: "..."
};

// Hệ thống tự động redirect đến: /123/dealer-dashboard
```

### 2. Navigation trong component
```javascript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const SomeComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  
  const goToVehicles = () => {
    if (dealerId) {
      navigate(`/${dealerId}/dealer/vehicles`);
    } else {
      navigate('/dealer/vehicles'); // Fallback
    }
  };
  
  return <button onClick={goToVehicles}>Xem xe</button>;
};
```

### 3. Sử dụng trong Sidebar
```javascript
// Sidebar tự động tạo menu với dealerId
// Không cần làm gì thêm, chỉ cần đảm bảo user có dealerId
```

## 🧪 Testing

### Test cases:
1. **User có dealerId đăng nhập:**
   - ✅ Redirect đến `/:dealerId/dealer-dashboard`
   - ✅ Menu navigation có dealerId trong path
   - ✅ Click menu item chuyển đến `/:dealerId/dealer/*`

2. **User không có dealerId đăng nhập:**
   - ✅ Redirect đến `/dealer-dashboard` (fallback)
   - ✅ Menu navigation không có dealerId

3. **User cố truy cập dealerId khác:**
   - ✅ DealerGuard chặn và redirect `/access-denied`

4. **Admin/EVMStaff đăng nhập:**
   - ✅ Không sử dụng dealerId routing
   - ✅ Admin → `/evm-dashboard`
   - ✅ EVMStaff → `/staff-dashboard`

## 🎨 UI/UX Changes

### Dashboard hiển thị:
- **Dealer ID từ URL:** Hiển thị ID đại lý từ tham số URL
- **Dealer Name:** Hiển thị tên đại lý từ API data
- **Shop Info:** Hiển thị thông tin cửa hàng nếu có
- **User Role:** Hiển thị vai trò (Quản lý/Nhân viên)

### Ví dụ hiển thị:
```
🏢 Dealer Dashboard
Chào mừng John Doe 👔 Quản lý

🏢 Đại lý ID: 123
📍 Tên đại lý: ABC Motors
🏪 Cửa hàng: Chi nhánh Hà Nội
🆔 Mã cửa hàng: 5
```

## 🚀 Next Steps

### Đã hoàn thành:
- ✅ AuthContext: Cập nhật getDefaultDashboard với dealerId
- ✅ AuthComponent: Redirect với dealerId sau login
- ✅ App.jsx: Thêm route `/:dealerId/dealer-dashboard`
- ✅ Sidebar: Menu động với dealerId
- ✅ DealerGuard: Kiểm tra dealerId khớp
- ✅ DealerDashboard: Hiển thị thông tin dealer từ URL

### Cần kiểm tra:
- ⚠️ Test flow đăng nhập đầy đủ
- ⚠️ Kiểm tra tất cả các trang con (vehicles, inventory, etc.)
- ⚠️ Test DealerGuard validation với nhiều user khác nhau
- ⚠️ Test fallback routes khi không có dealerId

### Có thể mở rộng:
- 📌 Thêm breadcrumb hiển thị dealerId/dealer name
- 📌 Cache dealer info để giảm API calls
- 📌 Thêm loading state khi fetch dealer info
- 📌 Handle case dealer không tồn tại (404)

## 📚 Tài liệu liên quan
- `STAFF_MANAGEMENT_GUIDE.md` - Quản lý nhân viên
- `DEALER_API_ENDPOINTS.md` - API endpoints cho dealer
- `FRONTEND_STRUCTURE.md` - Cấu trúc frontend

## ⚙️ Configuration

### Environment Variables
Không cần thêm env variables mới.

### User Object Structure
```javascript
{
  id: number,
  name: string,
  email: string,
  role: "DealerManager" | "DealerStaff" | "Admin" | "EVMStaff" | "Customer",
  dealerId: number,        // ← Quan trọng cho routing!
  dealerShopId: number,    // Optional
  shopName: string         // Optional
}
```

## 🐛 Troubleshooting

### Issue 1: DealerId không hiển thị
**Nguyên nhân:** User object không có `dealerId`
**Giải pháp:** Kiểm tra API response khi đăng nhập, đảm bảo trả về `dealerId`

### Issue 2: Redirect sai trang
**Nguyên nhân:** Logic trong `getDefaultDashboard()` không đúng
**Giải pháp:** Kiểm tra console log để xem role và dealerId

### Issue 3: Menu không có dealerId
**Nguyên nhân:** useMemo dependencies thiếu `user?.dealerId`
**Giải pháp:** Đã fix, đảm bảo dependencies đầy đủ

### Issue 4: Access Denied khi truy cập
**Nguyên nhân:** DealerId trong URL không khớp với user
**Giải pháp:** Kiểm tra `user.dealerId` vs URL dealerId

## 📞 Support
Nếu có vấn đề, kiểm tra console logs:
```javascript
console.log('📍 DealerId from URL:', dealerId);
console.log('👤 Current User dealerId:', currentUser?.dealerId);
console.log('🔒 DealerGuard: URL dealerId =', urlDealerId, ', User dealerId =', user?.dealerId);
```
