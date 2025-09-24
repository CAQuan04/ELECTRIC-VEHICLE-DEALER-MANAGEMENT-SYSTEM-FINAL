# Role-Based Authentication System

## Overview
Hệ thống đã được cập nhật để hỗ trợ điều hướng dựa trên quyền người dùng sau khi đăng nhập thành công.

## Role Types
1. **Customer** (mặc định) - Người dùng thông thường
2. **Dealer** - Đại lý
3. **EVM** - Hãng xe (Admin)

## Role Assignment Logic (Mock Implementation)
Role được xác định dựa trên email domain:

- `@dealer.` hoặc `dealer@` → **Dealer Role**
- `@evm.` hoặc `admin@` hoặc `evm@` → **EVM Role** 
- Tất cả email khác → **Customer Role**

## Routing After Login
- **Dealer**: Redirect to `/dealer` (Dealer Dashboard)
- **EVM**: Redirect to `/evm` (EVM Dashboard) 
- **Customer**: Stays on current page (Landing page)

## Test Accounts
Để test hệ thống, sử dụng các email sau:

### Dealer Account
- Email: `dealer@example.com` hoặc bất kỳ email có chứa `@dealer.`
- Sau login → Redirect to Dealer Dashboard

### EVM Account  
- Email: `admin@example.com` hoặc `evm@company.com`
- Sau login → Redirect to EVM Dashboard

### Customer Account
- Email: `user@gmail.com` hoặc bất kỳ email thông thường
- Sau login → Ở lại trang Landing

## Implementation Details

### Files Modified:
1. **googleAuth.js**: Added role determination and redirect logic
2. **facebookAuth.js**: Added role determination and redirect logic  
3. **Landing.jsx**: Updated to use redirect functions after successful login
4. **App.jsx**: Already has routes configured for `/dealer` and `/evm`

### Key Functions:
- `getUserRole(email)`: Determines role based on email
- `redirectUserBasedOnRole(role)`: Handles routing after login

## Next Steps
- Replace mock role assignment with real API call to backend
- Add role-based permission checks throughout the application
- Implement protected routes that require authentication
- Add role-based menu items and access controls