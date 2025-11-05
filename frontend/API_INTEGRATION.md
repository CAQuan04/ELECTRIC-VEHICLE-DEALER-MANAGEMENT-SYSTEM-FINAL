# Hướng dẫn sử dụng API Backend

## Cấu hình API

API backend được cấu hình trong file `.env`:

```
VITE_API_BASE_URL=https://localhost:7152/api
```

## Sử dụng API trong Frontend

### 1. Import API Service

```javascript
import { AuthAPI, UsersAPI, VehiclesAPI, DealersAPI, CustomersAPI } from '@utils';
// hoặc
import { AuthAPI } from '../../services/api';
```

### 2. Authentication API

#### Login
```javascript
try {
  const response = await AuthAPI.login(username, password);
  
  if (response.isSuccess) {
    // Lưu token
    localStorage.setItem('accessToken', response.token);
    
    // Lưu thông tin user
    const userData = {
      username: response.username,
      role: response.role,
      token: response.token
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }
} catch (error) {
  console.error('Login error:', error);
}
```

#### Response Structure (LoginResponseDto)
```javascript
{
  isSuccess: boolean,
  message: string,
  token: string,
  username: string,
  role: string
}
```

### 3. Users API

```javascript
// Lấy tất cả users
const users = await UsersAPI.getAll();

// Lấy user theo ID
const user = await UsersAPI.getById(userId);

// Tạo user mới
const newUser = await UsersAPI.create({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123'
});

// Cập nhật user
const updatedUser = await UsersAPI.update(userId, {
  email: 'newemail@example.com'
});

// Xóa user
await UsersAPI.delete(userId);
```

### 4. Authorization với Token

Token được tự động thêm vào header của mỗi request:

```javascript
// Token được lấy từ localStorage.getItem('accessToken')
// và thêm vào header: Authorization: Bearer {token}
```

### 5. Error Handling

```javascript
try {
  const response = await AuthAPI.login(username, password);
  // Handle success
} catch (error) {
  // Error message từ API hoặc network error
  console.error('Error:', error.message);
  
  // Hiển thị thông báo lỗi cho user
  AuthNotifications.loginError(error.message);
}
```

## Cấu trúc Backend API

### Endpoints

- **POST** `/api/Auth/login` - Đăng nhập
  - Request Body: `{ username: string, password: string }`
  - Response: `LoginResponseDto`

- **GET** `/api/Auth/hash/{password}` - Hash password (testing)
  - Response: Hashed password string

- **GET** `/api/Users` - Lấy danh sách users
- **GET** `/api/Users/{id}` - Lấy user theo ID
- **POST** `/api/Users` - Tạo user mới
- **PUT** `/api/Users/{id}` - Cập nhật user
- **DELETE** `/api/Users/{id}` - Xóa user

- **GET** `/api/Vehicles` - Lấy danh sách vehicles
- **GET** `/api/Vehicles/{id}` - Lấy vehicle theo ID

- **GET** `/api/Dealers` - Lấy danh sách dealers
- **GET** `/api/Dealers/{id}` - Lấy dealer theo ID

- **GET** `/api/Customers` - Lấy danh sách customers
- **GET** `/api/Customers/{id}` - Lấy customer theo ID

## Chạy Backend

1. Mở solution `backend/EVDealer.BE.sln` trong Visual Studio
2. Đảm bảo connection string trong `appsettings.json` đúng:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=EVDealerDBTest05;User Id=sa;Password=12345;Encrypt=False;"
     }
   }
   ```
3. Chạy project `EVDealer.BE.API`
4. Backend sẽ chạy tại `https://localhost:7152`

## Testing

### Test Login với Postman/Thunder Client

```http
POST https://localhost:7152/api/Auth/login
Content-Type: application/json

{
  "username": "admin01",
  "password": "admin123"
}
```

### Test với Frontend

Sử dụng các tài khoản test trong AuthComponent:
- manager01 / manager123 (Dealer Manager)
- staff01 / staff123 (Dealer Staff)
- admin01 / admin123 (EVM Admin)
- customer01 / customer123 (Customer)

## Lưu ý

1. **CORS**: Backend cần cấu hình CORS để cho phép frontend gọi API
2. **HTTPS**: Backend chạy trên HTTPS, cần trust certificate trong development
3. **Token**: Token được lưu trong localStorage và tự động gửi kèm mọi request
4. **Error Handling**: Tất cả API calls đều được wrap trong try-catch
5. **Loading State**: UI hiển thị loading state khi đang gọi API
