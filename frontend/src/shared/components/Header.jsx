import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthComponent from '../auth/AuthComponent';
import { AuthService, USER_ROLES } from '../utils/auth';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role;

  const getMenuItems = () => {
    const baseMenuItems = [
      {
        id: 1,
        title: 'Vehicles',
        submenu: [
          { name: 'Model S', path: '/vehicles/model-s' },
          { name: 'Model 3', path: '/vehicles/model-3' },
          { name: 'Model X', path: '/vehicles/model-x' },
          { name: 'Model Y', path: '/vehicles/model-y' },
          { name: 'Cybertruck', path: '/vehicles/cybertruck' }
        ]
      },
      {
        id: 2,
        title: 'Charging',
        submenu: [
          { name: 'Home Charging', path: '/charging/home' },
          { name: 'Supercharger', path: '/charging/supercharger' },
          { name: 'Destination Charging', path: '/charging/destination' },
          { name: 'Mobile Charging', path: '/charging/mobile' }
        ]
      },
      {
        id: 3,
        title: 'Discover',
        submenu: [
          { name: 'Demo Drive', path: '/discover/demo-drive' },
          { name: 'Compare', path: '/discover/compare' },
          { name: 'Trade-In', path: '/discover/trade-in' },
          { name: 'Careers', path: '/discover/careers' },
          { name: 'Events', path: '/discover/events' },
          { name: 'Find Us', path: '/discover/find-us' }
        ]
      },
      {
        id: 4,
        title: 'Shop',
        submenu: [
          { name: 'Accessories', path: '/shop/accessories' },
          { name: 'Apparel', path: '/shop/apparel' },
          { name: 'Lifestyle', path: '/shop/lifestyle' },
          { name: 'Charging', path: '/shop/charging' },
          { name: 'Vehicle Accessories', path: '/shop/vehicle-accessories' }
        ]
      },
      {
        id: 5,
        title: 'Information',
        submenu: [
          { name: 'About Tesla', path: '/information/about' },
          { name: 'Investor Relations', path: '/information/investors' },
          { name: 'Blog', path: '/information/blog' },
          { name: 'Careers', path: '/information/careers' },
          { name: 'News', path: '/information/news' },
          { name: 'Locations', path: '/information/locations' }
        ]
      }
    ];

    // Add role-specific menu items
    if (userRole === USER_ROLES.DEALER) {
      baseMenuItems.push({
        id: 6,
        title: 'Business',
        submenu: [
          { name: 'Dealer Dashboard', path: '/dealer-dashboard' },
          { name: 'Inventory', path: '/inventory' },
          { name: 'Orders', path: '/sales/orders' },
          { name: 'Customer Management', path: '/customers' }
        ]
      });
    } else if (userRole === USER_ROLES.EVM_ADMIN) {
      baseMenuItems.push({
        id: 6,
        title: 'Admin',
        submenu: [
          { name: 'EVM Dashboard', path: '/evm-dashboard' },
          { name: 'Reports', path: '/reports' },
          { name: 'Dealer Management', path: '/admin/dealers' },
          { name: 'System Overview', path: '/admin/system' }
        ]
      });
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };

  const handleMenuItemClick = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...'); // Debug log
    AuthService.logout();
    setIsUserMenuOpen(false);
    console.log('Current user after logout:', AuthService.getCurrentUser()); // Debug log
    // Force complete page reload to clear all state
    window.location.replace('/');
  };

  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="tesla-header">
        <div className="tesla-header__container">
          {/* Logo */}
          <Link to="/" className="tesla-header__logo">
            <img 
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1780138/logoTesla.svg" 
              alt="Tesla" 
              className="tesla-logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="tesla-header__nav desktop-nav">
          {menuItems.map((item) => (
            <div key={item.id} className="nav-item">
              <Link 
                to={`/${item.title.toLowerCase()}`}
                className={`nav-link ${isActivePage(`/${item.title.toLowerCase()}`) ? 'active' : ''}`}
              >
                {item.title}
              </Link>
              <div className="submenu">
                {item.submenu.map((subItem, index) => (
                  <Link key={index} to={subItem.path} className="submenu-item">
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right Side - Auth & Menu */}
        <div className="tesla-header__right">
          {/* User Role Badge with Dropdown */}
          {currentUser ? (
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
                  {currentUser.name}
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
          ) : (
            <AuthComponent />
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="tesla-header__menu-btn mobile-only"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`menu-bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`menu-bar ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`menu-bar ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`tesla-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {menuItems.map((item) => (
            <div key={item.id} className="mobile-menu-item">
              <button 
                className="mobile-menu-title"
                onClick={() => handleMenuItemClick(item.id)}
              >
                {item.title}
                <span className={`arrow ${activeSubmenu === item.id ? 'active' : ''}`}>›</span>
              </button>
              <div className={`mobile-submenu ${activeSubmenu === item.id ? 'open' : ''}`}>
                {item.submenu.map((subItem, index) => (
                  <Link 
                    key={index} 
                    to={subItem.path} 
                    className="mobile-submenu-item"
                    onClick={toggleMenu}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;