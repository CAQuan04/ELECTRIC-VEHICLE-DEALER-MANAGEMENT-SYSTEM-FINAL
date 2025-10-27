import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../../utils/auth';

const RoleGuard = ({ children, requiredRole, fallback = '/landing' }) => {
  const currentUser = AuthService.getCurrentUser();
  
  // If no user is logged in, redirect to landing page
  if (!currentUser) {
    console.warn('No user logged in, redirecting to landing page');
    return <Navigate to="/landing" replace />;
  }
  
  const hasAccess = AuthService.hasRole(requiredRole);

  if (!hasAccess) {
    console.warn(`Access denied. Required role: ${requiredRole}, User role: ${currentUser?.role}`);
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export const DealerGuard = ({ children }) => (
  <RoleGuard requiredRole="dealer" fallback="/access-denied">
    {children}
  </RoleGuard>
);

// Guard để kiểm tra dealer có quyền truy cập cửa hàng cụ thể
export const DealerShopGuard = ({ children, shopId }) => {
  const currentUser = AuthService.getCurrentUser();
  
  // Kiểm tra user có phải dealer không
  if (!currentUser || currentUser.role !== 'dealer') {
    console.warn('User is not a dealer, redirecting to access denied');
    return <Navigate to="/access-denied" replace />;
  }
  
  // Nếu không truyền shopId, lấy shopId từ URL hoặc user profile
  const userShopId = currentUser.dealerShopId;
  
  // Nếu có shopId cụ thể, kiểm tra quyền truy cập
  if (shopId && shopId !== userShopId) {
    console.warn(`Dealer ${currentUser.dealerId} attempted to access shop ${shopId}, but belongs to ${userShopId}`);
    return <Navigate to="/access-denied" replace />;
  }
  
  return children;
};

export const CustomerGuard = ({ children }) => (
  <RoleGuard requiredRole="customer" fallback="/access-denied">
    {children}
  </RoleGuard>
);

export const AdminGuard = ({ children }) => (
  <RoleGuard requiredRole="evm_admin" fallback="/access-denied">
    {children}
  </RoleGuard>
);

export const StaffGuard = ({ children }) => (
  <RoleGuard requiredRole="staff" fallback="/access-denied">
    {children}
  </RoleGuard>
);

// Access Denied page
export const AccessDenied = () => (
  <div className="dashboard-container">
    <div className="error-message">
      <h2>🚫 Truy cập bị từ chối</h2>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <p>Vui lòng đăng nhập với tài khoản phù hợp.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/landing'}>
          Về trang chủ
        </button>
        <button onClick={() => window.location.href = '/auth'} style={{ marginLeft: '10px' }}>
          Đăng nhập
        </button>
      </div>
    </div>
  </div>
);

export default RoleGuard;