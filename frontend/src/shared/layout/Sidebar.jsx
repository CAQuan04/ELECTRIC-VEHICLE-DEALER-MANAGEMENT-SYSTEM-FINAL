import React from 'react';
import { Link } from 'react-router-dom';
import { AuthService, USER_ROLES } from '../utils/auth';
import './Sidebar.css';

const Sidebar = () => {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role;

  const getMenuItems = () => {
    switch (userRole) {
      case USER_ROLES.DEALER:
        return [
          { path: '/dealer-dashboard', icon: '🏢', label: 'Dashboard Đại Lý' },
          { path: '/catalog', icon: '🚗', label: 'Catalog Xe' },
          { path: '/inventory', icon: '📦', label: 'Quản Lý Kho' },
          { path: '/customers', icon: '👥', label: 'Khách Hàng' },
          { path: '/sales/orders', icon: '🛒', label: 'Đơn Hàng' },
          { path: '/', icon: '🏠', label: 'Trang Chủ' }
        ];

      case USER_ROLES.CUSTOMER:
        return [
          { path: '/customer-dashboard', icon: '👤', label: 'Dashboard Cá Nhân' },
          { path: '/vehicles', icon: '🚗', label: 'Khám Phá Xe' },
          { path: '/shop', icon: '🛒', label: 'Cửa Hàng' },
          { path: '/charging', icon: '⚡', label: 'Trạm Sạc' },
          { path: '/information', icon: 'ℹ️', label: 'Thông Tin' },
          { path: '/', icon: '🏠', label: 'Trang Chủ' }
        ];

      case USER_ROLES.EVM_ADMIN:
        return [
          { path: '/evm-dashboard', icon: '⚡', label: 'EVM Dashboard' },
          { path: '/reports', icon: '📊', label: 'Reports & Analytics' },
          { path: '/admin/dealers', icon: '🏪', label: 'Quản Lý Đại Lý' },
          { path: '/catalog', icon: '🚗', label: 'Vehicle Catalog' },
          { path: '/inventory', icon: '📦', label: 'Tổng Kho' },
          { path: '/customers', icon: '👥', label: 'Tất Cả Khách Hàng' },
          { path: '/', icon: '🏠', label: 'Trang Chủ' }
        ];

      default:
        return [
          { path: '/', icon: '🏠', label: 'Trang Chủ' },
          { path: '/auth-test', icon: '🔐', label: 'Đăng Nhập' }
        ];
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        EV Management
        {currentUser?.name && (
          <div className="user-info">
            <small>{currentUser.name}</small>
            <small className={`role-badge ${userRole}`}>{userRole}</small>
          </div>
        )}
      </div>
      <ul className="sidebar-menu">
        {getMenuItems().map((item, index) => (
          <li key={index}>
            <Link to={item.path}>
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
        
        {/* Role Switcher for Testing */}
        {process.env.NODE_ENV === 'development' && (
          <li className="role-switcher">
            <hr />
            <small>🔧 Test Roles:</small>
            <button onClick={() => {
              AuthService.loginAsDealer();
              window.location.reload();
            }}>Dealer</button>
            <button onClick={() => {
              AuthService.loginAsCustomer();
              window.location.reload();
            }}>Customer</button>
            <button onClick={() => {
              AuthService.loginAsAdmin();
              window.location.reload();
            }}>Admin</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;