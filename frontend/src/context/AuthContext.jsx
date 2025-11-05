// File: src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // BẠN CẦN CÀI THƯ VIỆN NÀY: npm install jwt-decode

// 1. Tạo Context để chia sẻ trạng thái
const AuthContext = createContext(null);

// 2. Tạo Provider Component - "Nhà cung cấp" trạng thái
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State lưu thông tin user: { username, role }
  const [loading, setLoading] = useState(true); // State để biết đang kiểm tra token hay không

  // Ghi chú: Logic này sẽ tự động chạy MỘT LẦN khi ứng dụng tải lại (F5)
  useEffect(() => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        // Kiểm tra xem token có còn hạn không
        if (decodedToken.exp * 1000 > Date.now()) {
            // Lấy thông tin role và username từ token của Backend .NET
            const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const username = decodedToken.sub; // 'sub' là key chuẩn cho username
            
            if (role && username) {
                setUser({ username, role }); // Khôi phục lại trạng thái đăng nhập
            }
        } else {
            // Nếu token hết hạn, xóa nó đi
            localStorage.removeItem('jwtToken');
        }
      }
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      localStorage.removeItem('jwtToken'); // Xóa token lỗi
    } finally {
        setLoading(false); // Đánh dấu đã kiểm tra xong
    }
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

  // Hàm để gọi khi đăng nhập thành công từ API
  const login = (apiResponse) => {
    const { token } = apiResponse;
    localStorage.setItem('jwtToken', token);
    
    try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const username = decodedToken.sub;
        setUser({ username, role });
    } catch (error) {
        console.error("Lỗi giải mã token sau khi đăng nhập:", error);
    }
  };

  // Hàm để đăng xuất
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    window.location.href = '/landing'; // Chuyển về trang landing sau khi logout
  };

  // Giá trị mà Provider sẽ cung cấp cho toàn bộ ứng dụng
  const authContextValue = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo custom hook để các component con dễ dàng sử dụng
export const useAuth = () => {
  return useContext(AuthContext);
};