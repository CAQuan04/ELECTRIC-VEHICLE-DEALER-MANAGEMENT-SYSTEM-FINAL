// File: src/modules/auth/RoleGuard.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn đúng

// Component Guard chung, kiểm tra vai trò người dùng
const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ RoleGuard check:', { user, loading, allowedRoles });

  if (loading) {
    console.log('⏳ RoleGuard: Đang loading...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#fff'
      }}>
        <div>Loading session...</div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ RoleGuard: Không có user, redirect to /landing');
    return <Navigate to="/landing" replace />;
  }
  
  // Kiểm tra xem vai trò của user có nằm trong danh sách được phép không
  const hasAccess = allowedRoles.includes(user.role);
  console.log('🔐 RoleGuard: hasAccess =', hasAccess, 'user.role =', user.role);

  if (!hasAccess) {
    console.log('🚫 RoleGuard: Không có quyền truy cập, redirect to /access-denied');
    return <Navigate to="/access-denied" replace />;
  }

  console.log('✅ RoleGuard: Cho phép truy cập');
  return children ? children : <Outlet />;
};

// ===================================================================================
// === CÁC GUARD CỤ THỂ - ĐÃ ĐƯỢC CẬP NHẬT THEO ÁNH XẠ MỚI ===

// Ghi chú: Guard này cho phép những người dùng có vai trò là "DealerManager" hoặc "DealerStaff"
// vì cả hai đều thuộc nhóm "dealer" theo yêu cầu của bạn.
export const DealerGuard = ({ children }) => (
  <RoleGuard allowedRoles={['DealerManager', 'DealerStaff']}>
    {children}
  </RoleGuard>
);

// Ghi chú: Guard này chỉ dành cho Customer (nếu có).
export const CustomerGuard = ({ children }) => (
  <RoleGuard allowedRoles={['Customer']}>
    {children}
  </RoleGuard>
);

// Ghi chú: Guard này cho phép cả "Admin" và "EVMStaff".
// Đây là Guard chính cho các chức năng quản lý của hãng.
export const AdminGuard = ({ children }) => (
  <RoleGuard allowedRoles={['Admin', 'EVMStaff']}>
    {children}
  </RoleGuard>
);

// Ghi chú: Guard này chỉ dành riêng cho EVMStaff (nếu có chức năng nào đó chỉ staff mới làm được).
export const StaffGuard = ({ children }) => (
  <RoleGuard allowedRoles={['Admin', 'EVMStaff']}>
    {children}
  </RoleGuard>
);
// ===================================================================================


// --- TRANG TỪ CHỐI TRUY CẬP ---
export const AccessDenied = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>🚫 Truy cập bị từ chối</h2>
    <p>Bạn không có quyền truy cập vào trang này.</p>
    <button onClick={() => (window.location.href = '/landing')}>Về trang chủ</button>
  </div>
);

// Tạm thời giữ nguyên DealerShopGuard
export const DealerShopGuard = ({ children }) => {
    console.log('🏪 DealerShopGuard: Cho phép truy cập');
    return children;
}

export default RoleGuard;