import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthService, USER_ROLES } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role;

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logging out from dashboard navbar...'); // Debug log
    AuthService.logout();
    setIsUserMenuOpen(false);
    console.log('Current user after logout:', AuthService.getCurrentUser()); // Debug log
    // Force complete page reload to clear all state
    window.location.replace('/');
  };

  // Get dashboard-specific navigation based on role
  const getDashboardNav = () => {
    switch (userRole) {
      case USER_ROLES.DEALER:
        return [
          { path: '/dealer-dashboard', label: 'Dashboard', icon: '🏢' },
          { path: '/inventory', label: 'Kho xe', icon: '📦' },
          { path: '/customers', label: 'Khách hàng', icon: '👥' },
          { path: '/sales/orders', label: 'Đơn hàng', icon: '📋' }
        ];
      case USER_ROLES.CUSTOMER:
        return [
          { path: '/customer-dashboard', label: 'Dashboard', icon: '👤' },
          { path: '/vehicles', label: 'Xe', icon: '🚗' },
          { path: '/shop', label: 'Shop', icon: '🛒' },
          { path: '/charging', label: 'Sạc', icon: '⚡' }
        ];
      case USER_ROLES.EVM_ADMIN:
        return [
          { path: '/evm-dashboard', label: 'Dashboard', icon: '⚡' },
          { path: '/admin/dealers', label: 'Đại lý', icon: '🏪' },
          { path: '/reports', label: 'Báo cáo', icon: '📊' },
          { path: '/inventory', label: 'Kho', icon: '📦' }
        ];
      default:
        return [];
    }
  };

  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        {/* Logo/Brand */}
        <Link to="/" className="dashboard-navbar__brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">EVM Dashboard</span>
        </Link>

        {/* Navigation Links */}
        <div className="dashboard-navbar__nav">
          {getDashboardNav().map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className={`nav-link ${isActivePage(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="dashboard-navbar__user">
          {currentUser && (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <span className={`role-indicator ${userRole}`}>
                  {userRole === USER_ROLES.DEALER && '🏢'}
                  {userRole === USER_ROLES.CUSTOMER && '👤'}
                  {userRole === USER_ROLES.EVM_ADMIN && '⚡'}
                  <span className="user-name">{currentUser.name}</span>
                </span>
                <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-menu-header">
                    <div className="user-avatar">
                      {userRole === USER_ROLES.DEALER && '🏢'}
                      {userRole === USER_ROLES.CUSTOMER && '👤'}
                      {userRole === USER_ROLES.EVM_ADMIN && '⚡'}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{currentUser.name}</div>
                      <div className="user-role">{userRole}</div>
                    </div>
                  </div>
                  
                  <div className="user-menu-divider"></div>
                  
                  <div className="user-menu-items">
                    <button className="user-menu-item" onClick={() => {
                      setIsUserMenuOpen(false);
                      if (userRole === USER_ROLES.CUSTOMER) {
                        window.location.href = '/customer-dashboard';
                      } else if (userRole === USER_ROLES.DEALER) {
                        window.location.href = '/dealer-dashboard';
                      } else if (userRole === USER_ROLES.EVM_ADMIN) {
                        window.location.href = '/evm-dashboard';
                      }
                    }}>
                      <span className="menu-icon">👤</span>
                      <span>Thông tin tài khoản</span>
                    </button>
                    
                    {userRole === USER_ROLES.CUSTOMER && (
                      <>
                        <button className="user-menu-item" onClick={() => {
                          setIsUserMenuOpen(false);
                          window.location.href = '/customer-dashboard?section=vehicles';
                        }}>
                          <span className="menu-icon">🚗</span>
                          <span>Xe của tôi</span>
                        </button>
                        
                        <button className="user-menu-item" onClick={() => {
                          setIsUserMenuOpen(false);
                          window.location.href = '/customer-dashboard?section=financing';
                        }}>
                          <span className="menu-icon">💳</span>
                          <span>Quản lý trả góp</span>
                        </button>
                      </>
                    )}
                    
                    <div className="user-menu-divider"></div>
                    
                    <button className="user-menu-item logout" onClick={handleLogout}>
                      <span className="menu-icon">🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Dropdown Overlay */}
              {isUserMenuOpen && (
                <div className="user-menu-overlay" onClick={toggleUserMenu}></div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;