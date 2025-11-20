# Fix DealerId Parsing - Tóm tắt Thay đổi

## 🐛 Vấn đề

Token từ backend có `dealerId: '2'` nhưng khi parse ra thì `dealerId` bị mất (undefined).

### Log từ Console:
```
🔓 Token decoded: {
  dealerId: '2',  ← Token CÓ dealerId
  userId: '2',
  role: 'DealerStaff',
  ...
}

📋 Parsed claims: {
  role: 'DealerStaff',
  username: 'TestDealerStaff', 
  userId: '2',
  dealerShopId: undefined,
  // dealerId: THIẾU! ❌
}

👤 Current User dealerId: undefined  ← Bị mất dealerId
```

## ✅ Giải pháp

Đã cập nhật 3 files để parse và lưu `dealerId` từ JWT token:

### 1. **AuthContext.jsx** (2 chỗ)

#### Chỗ 1: useEffect - Khôi phục user từ token khi reload
```javascript
// TRƯỚC (Line ~45):
const dealerShopId = decodedToken.dealerShopId;
console.log('📋 Parsed claims:', { role, username, userId, dealerShopId });

// SAU:
const dealerShopId = decodedToken.dealerShopId;
const dealerId = decodedToken.dealerId; // ✨ Thêm dealerId
console.log('📋 Parsed claims:', { role, username, userId, dealerShopId, dealerId });

const userData = { 
  username, 
  role,
  userId,
  dealerShopId,
  dealerId, // ✨ Thêm vào userData
  name: username
};
```

#### Chỗ 2: login function - Parse dealerId khi đăng nhập
```javascript
// TRƯỚC (Line ~105):
const dealerShopId = decodedToken.dealerShopId;

const userData = { 
  username, 
  role,
  userId,
  dealerShopId,
  name: username
};

// SAU:
const dealerShopId = decodedToken.dealerShopId;
const dealerId = decodedToken.dealerId; // ✨ Thêm dealerId

const userData = { 
  username, 
  role,
  userId,
  dealerShopId,
  dealerId, // ✨ Thêm vào userData
  name: username
};
```

### 2. **utils/auth.js**

#### getCurrentUser() function
```javascript
// TRƯỚC (Line ~22-35):
export const AuthService = {
  getCurrentUser: () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && !currentUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        currentUser = null;
      }
    }
    return currentUser;
  },

// SAU:
export const AuthService = {
  getCurrentUser: () => {
    // Try to get user from JWT token first ✨
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const { jwtDecode } = require('jwt-decode');
        const decodedToken = jwtDecode(token);
        
        // Check if token is still valid
        if (decodedToken.exp * 1000 > Date.now()) {
          const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                          decodedToken.sub || 
                          decodedToken.name || 
                          'User';
          const userId = decodedToken.userId;
          const dealerShopId = decodedToken.dealerShopId;
          const dealerId = decodedToken.dealerId; // ✨ Parse dealerId
          
          return {
            username,
            role,
            userId,
            dealerShopId,
            dealerId, // ✨ Trả về dealerId
            name: username
          };
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    
    // Fallback: Check localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser && !currentUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        currentUser = null;
      }
    }
    return currentUser;
  },
```

### 3. **shared/utils/auth.js**

Cập nhật tương tự như `utils/auth.js` - Parse dealerId từ JWT token trong `getCurrentUser()`.

## 🎯 Kết quả mong đợi

Sau khi fix, console log sẽ hiển thị:

```javascript
✅ Tìm thấy token, đang giải mã...
🔓 Token decoded: {
  dealerId: '2',
  userId: '2',
  role: 'DealerStaff',
  ...
}

📋 Parsed claims: {
  role: 'DealerStaff',
  username: 'TestDealerStaff',
  userId: '2',
  dealerShopId: undefined,
  dealerId: '2'  ✅ CÓ dealerId rồi!
}

👤 Khôi phục user: {
  username: 'TestDealerStaff',
  role: 'DealerStaff',
  userId: '2',
  dealerShopId: undefined,
  dealerId: '2',  ✅ CÓ dealerId rồi!
  name: 'TestDealerStaff'
}

📍 DealerId from URL: undefined
👤 Current User dealerId: 2  ✅ Có dealerId!
```

## 🔄 Flow hoàn chỉnh

1. **User đăng nhập** → Backend trả về JWT token với `dealerId: '2'`
2. **AuthContext.login()** → Parse token, lưu dealerId vào user state
3. **AuthContext redirect** → Chuyển đến `/${dealerId}/dealer-dashboard` = `/2/dealer-dashboard`
4. **DealerDashboard render** → useParams() lấy dealerId = '2' từ URL
5. **Hiển thị thông tin** → Tên đại lý + Role dựa trên dealerId

## 📊 Cấu trúc User Object mới

```javascript
{
  username: "TestDealerStaff",
  role: "DealerStaff",          // Role ID của user
  userId: "2",
  dealerShopId: undefined,       // Shop ID (nếu có)
  dealerId: "2",                 // ✨ ID của đại lý (QUAN TRỌNG!)
  name: "TestDealerStaff"
}
```

## 🧪 Test Cases

### Test 1: Đăng nhập mới
1. Login với user có `dealerId: '2'` trong token
2. Kiểm tra `user.dealerId = 2`
3. Kiểm tra redirect đến `/2/dealer-dashboard`

### Test 2: Reload trang (F5)
1. Đã login trước đó với `dealerId: '2'`
2. F5 reload trang
3. Kiểm tra token được parse lại
4. Kiểm tra `user.dealerId = 2` vẫn còn

### Test 3: Hiển thị dashboard
1. Vào `/2/dealer-dashboard`
2. Kiểm tra console log: `📍 DealerId from URL: 2`
3. Kiểm tra console log: `👤 Current User dealerId: 2`
4. Kiểm tra UI hiển thị tên đại lý và role

### Test 4: Navigation
1. Click menu "Catalog Xe" trong sidebar
2. Kiểm tra URL: `/2/dealer/vehicles`
3. Kiểm tra DealerGuard cho phép truy cập

## 🔒 Security Check

**DealerGuard** sẽ kiểm tra:
```javascript
// URL: /2/dealer-dashboard
// User dealerId: 2
// ✅ Khớp → Cho phép truy cập

// URL: /3/dealer-dashboard
// User dealerId: 2
// ❌ Không khớp → Redirect /access-denied
```

## 📝 Checklist

- ✅ Parse dealerId từ token trong AuthContext useEffect
- ✅ Parse dealerId từ token trong AuthContext login()
- ✅ Parse dealerId trong AuthService.getCurrentUser() (utils/auth.js)
- ✅ Parse dealerId trong AuthService.getCurrentUser() (shared/utils/auth.js)
- ✅ User object có dealerId property
- ✅ Sidebar sử dụng dealerId để tạo menu paths
- ✅ DealerDashboard lấy dealerId từ useParams()
- ✅ DealerGuard validate dealerId từ URL

## 🚀 Triển khai

Sau khi cập nhật code:

1. **Clear cache:** `localStorage.clear()` nếu cần
2. **Logout:** Đăng xuất user hiện tại
3. **Login lại:** Đăng nhập với user có dealerId trong token
4. **Kiểm tra:** Console log và URL

## 🐛 Troubleshooting

### Vấn đề: dealerId vẫn undefined
**Giải pháp:**
- Kiểm tra backend có trả dealerId trong token không
- Console log `decodedToken` để xem structure
- Đảm bảo key chính xác: `decodedToken.dealerId`

### Vấn đề: URL không có dealerId
**Giải pháp:**
- Kiểm tra `user.dealerId` có giá trị không
- Kiểm tra getDefaultDashboard() logic
- Kiểm tra AuthComponent redirect logic

### Vấn đề: DealerGuard block
**Giải pháp:**
- Kiểm tra dealerId trong URL vs user.dealerId
- Console log để debug: `🔒 DealerGuard: URL dealerId = ... , User dealerId = ...`

## 📚 Files liên quan

- ✅ `frontend/src/context/AuthContext.jsx`
- ✅ `frontend/src/utils/auth.js`
- ✅ `frontend/src/shared/utils/auth.js`
- ✅ `frontend/src/modules/auth/RoleGuard.jsx` (DealerGuard)
- ✅ `frontend/src/modules/layout/Sidebar.jsx`
- ✅ `frontend/src/features/dealer/pages/DealerDashboard.jsx`
- ✅ `frontend/src/App.jsx`
