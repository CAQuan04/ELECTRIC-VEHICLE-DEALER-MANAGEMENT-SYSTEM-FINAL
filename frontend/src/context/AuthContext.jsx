// File: src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // BẠN CẦN CÀI THƯ VIỆN NÀY: npm install jwt-decode
import apiClient from '../utils/api/client';

// 1. Tạo Context để chia sẻ trạng thái
const AuthContext = createContext(null);

// 2. Tạo Provider Component - "Nhà cung cấp" trạng thái
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State lưu thông tin user: { username, role, dealerShopId, userId }
  const [loading, setLoading] = useState(true); // State để biết đang kiểm tra token hay không

  // Ghi chú: Logic này sẽ tự động chạy MỘT LẦN khi ứng dụng tải lại (F5)
  useEffect(() => {
    console.log('🔄 AuthProvider: Kiểm tra token trong localStorage...');
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
        console.log('ℹ️ Không có token, user chưa đăng nhập');
        setLoading(false);
        return;
      }
      
      console.log('✅ Tìm thấy token, đang giải mã...');
      const decodedToken = jwtDecode(token);
      console.log('🔓 Token decoded:', decodedToken);
      
      // Kiểm tra xem token có còn hạn không
      if (decodedToken.exp * 1000 > Date.now()) {
          console.log('✅ Token còn hạn');
          
          // Lấy thông tin từ token của Backend .NET
          const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          // Backend .NET có thể dùng nhiều key khác nhau cho username
          const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                          decodedToken.sub || 
                          decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                          decodedToken.unique_name ||
                          decodedToken.name ||
                          'User';
          const userId = decodedToken.userId || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
          const dealerShopId = decodedToken.dealerShopId;
          
          console.log('📋 Parsed claims:', { role, username, userId, dealerShopId });
          
          if (role) {
              const userData = { 
                username, 
                role,
                userId,
                dealerShopId,
                name: username
              };
              console.log('👤 Khôi phục user:', userData);
              setUser(userData);
          } else {
              console.warn('⚠️ Token không có đủ thông tin role');
          }
      } else {
          console.log('⏰ Token đã hết hạn, xóa token');
          localStorage.removeItem('jwtToken');
      }
    } catch (error) {
      console.error("❌ Lỗi khi giải mã token:", error);
      localStorage.removeItem('jwtToken');
    } finally {
        console.log('✅ Hoàn tất kiểm tra token, setLoading(false)');
        setLoading(false);
    }
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

  // Hàm để gọi khi đăng nhập thành công từ API
  const login = (apiResponse) => {
    console.log('🔐 Login called with response:', apiResponse);
    
    const { token } = apiResponse;
    
    if (!token) {
      console.error('❌ Không tìm thấy token trong response:', apiResponse);
      return;
    }
    
    localStorage.setItem('jwtToken', token);
    console.log('✅ Token đã lưu vào localStorage');
    
    try {
        const decodedToken = jwtDecode(token);
        console.log('🔓 Decoded token:', decodedToken);
        
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        // Backend .NET có thể dùng nhiều key khác nhau cho username
        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                        decodedToken.sub || 
                        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                        decodedToken.unique_name ||
                        decodedToken.name ||
                        apiResponse.username || // Lấy từ response nếu có
                        'User';
        const userId = decodedToken.userId || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const dealerShopId = decodedToken.dealerShopId;
        
        const userData = { 
          username, 
          role,
          userId,
          dealerShopId,
          name: username
        };
        
        console.log('👤 User data được set:', userData);
        setUser(userData);
    } catch (error) {
        console.error("❌ Lỗi giải mã token sau khi đăng nhập:", error);
    }
  };

  // Hàm để đăng xuất
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user'); // Xóa user cũ nếu có
    setUser(null);
    window.location.href = '/landing'; // Chuyển về trang landing sau khi logout
  };

  // Các hàm tiện ích tương thích với AuthService cũ
  const getUserRole = () => user?.role || 'guest';
  
  const hasRole = (role) => user?.role === role;
  
  const canAccessDashboard = (dashboardType) => {
    const userRole = user?.role;
    switch (dashboardType) {
      case 'dealer':
        return userRole === 'DealerManager' || userRole === 'DealerStaff';
      case 'customer':
        return userRole === 'Customer';
      case 'evm':
      case 'admin':
        return userRole === 'Admin' || userRole === 'EVMStaff';
      default:
        return false;
    }
  };

  const canAccessDealerShop = (shopId) => {
    if (user?.role !== 'DealerManager' && user?.role !== 'DealerStaff') {
      return false;
    }
    return user?.dealerShopId === shopId;
  };

  const getDealerShopId = () => user?.dealerShopId || null;

  const getDefaultDashboard = () => {
    const role = user?.role;
    if (role === 'Admin' || role === 'EVMStaff') return '/evm-dashboard';
    if (role === 'DealerManager' || role === 'DealerStaff') return '/dealer-dashboard';
    if (role === 'Customer') return '/customer-dashboard';
    return '/landing';
  };

  // Giá trị mà Provider sẽ cung cấp cho toàn bộ ứng dụng
  const authContextValue = { 
    user, 
    loading, 
    login, 
    logout,
    getUserRole,
    hasRole,
    canAccessDashboard,
    canAccessDealerShop,
    getDealerShopId,
    getDefaultDashboard
  };

  // Hiển thị loading screen trong khi kiểm tra token
  if (loading) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '4px solid #1e293b',
              borderTop: '4px solid #06b6d4',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Đang kiểm tra phiên đăng nhập...</p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo custom hook để các component con dễ dàng sử dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error(
      'useAuth phải được sử dụng bên trong AuthProvider. ' +
      'Hãy đảm bảo component của bạn được wrap trong <AuthProvider>.'
    );
  }
  
  return context;
};