import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../../utils/auth';

const RoleGuard = ({ children, requiredRole, fallback = '/landing' }) => {
  const currentUser = AuthService.getCurrentUser();

  // Không có user → chuyển hướng về trang landing
  if (!currentUser) {
    console.warn('No user logged in, redirecting to landing page');
    return <Navigate to="/landing" replace />;
  }

  // Cho phép requiredRole là string hoặc array
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userRole = currentUser?.role;

  const hasAccess = roles.includes(userRole);

  if (!hasAccess) {
    console.warn(`Access denied. Required roles: [${roles.join(', ')}], User role: ${userRole}`);
    return <Navigate to={fallback} replace />;
  }

  return children;
};

// Guards cụ thể
export const DealerGuard = ({ children }) => (
  <RoleGuard requiredRole="dealer" fallback="/access-denied">
    {children}
  </RoleGuard>
);

export const DealerShopGuard = ({ children, shopId }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser || currentUser.role !== 'dealer') {
    console.warn('User is not a dealer, redirecting to access denied');
    return <Navigate to="/access-denied" replace />;
  }

  const userShopId = currentUser.dealerShopId;

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

// ✅ Cho phép admin và staff cùng truy cập
export const AdminGuard = ({ children }) => (
  <RoleGuard requiredRole={['evm_admin', 'staff']} fallback="/access-denied">
    {children}
  </RoleGuard>
);

export const StaffGuard = ({ children }) => (
  <RoleGuard requiredRole="staff" fallback="/access-denied">
    {children}
  </RoleGuard>
);

// Access Denied Page
export const AccessDenied = () => (
  <div className="dashboard-container">
    <div className="error-message">
      <h2>🚫 Truy cập bị từ chối</h2>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <p>Vui lòng đăng nhập với tài khoản phù hợp.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => (window.location.href = '/landing')}>Về trang chủ</button>
        <button
          onClick={() => (window.location.href = '/auth')}
          style={{ marginLeft: '10px' }}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  </div>
);

export default RoleGuard;
