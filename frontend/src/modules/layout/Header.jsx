import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthComponent from '@modules/auth/AuthComponent';
import { USER_ROLES } from '@utils';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate(); // Hook điều hướng
  
  const { user: currentUser, logout } = useAuth();
  const userRole = currentUser?.role;

  // Hàm xử lý điều hướng Dashboard thông minh
  const handleDashboardNavigation = () => {
    setIsUserMenuOpen(false);

    if (!currentUser) {
      navigate('/'); 
      return;
    }

    // Logic định tuyến dựa trên Role
    // Dealer: Cần dealerId trong URL nếu có
    if (userRole === USER_ROLES.DEALER || userRole === 'DealerManager' || userRole === 'DealerStaff') {
      if (currentUser.dealerId) {
        navigate(`/${currentUser.dealerId}/dealer-dashboard`);
      } else {
        navigate('/dealer-dashboard');
      }
    } 
    // Admin
    else if (userRole === USER_ROLES.EVM_ADMIN || userRole === 'Admin') {
      navigate('/evm-dashboard');
    } 
    // Staff (EVM Staff)
    else if (userRole === USER_ROLES.STAFF || userRole === 'EVMStaff') {
      navigate('/staff-dashboard');
    } 
    // Customer
    else if (userRole === USER_ROLES.CUSTOMER || userRole === 'Customer') {
      navigate('/customer-dashboard');
    } 
    // Fallback
    else {
      navigate('/');
    }
  };

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
    // Dealer Menu
    if (userRole === USER_ROLES.DEALER || userRole === 'DealerManager') {
      // Tự động thêm prefix dealerId vào các link nếu có
      const prefix = currentUser?.dealerId ? `/${currentUser.dealerId}` : '';
      
      baseMenuItems.push({
        id: 6,
        title: 'Business',
        submenu: [
          { name: 'Dealer Dashboard', path: `${prefix}/dealer-dashboard` },
          { name: 'Inventory', path: `${prefix}/dealer/inventory` },
          { name: 'Orders', path: `${prefix}/dealer/orders` },
          { name: 'Customer Management', path: `${prefix}/dealer/customers` }
        ]
      });
    } 
    // Admin Menu
    else if (userRole === USER_ROLES.EVM_ADMIN || userRole === 'Admin') {
      baseMenuItems.push({
        id: 6,
        title: 'Admin',
        submenu: [
          { name: 'EVM Dashboard', path: '/evm-dashboard' },
          { name: 'Reports', path: '/admin/reports' },
          { name: 'Dealer Management', path: '/admin/dealers' },
          { name: 'System Overview', path: '/admin/system' }
        ]
      });
    }
    // Staff Menu
    else if (userRole === USER_ROLES.STAFF || userRole === 'EVMStaff') {
      baseMenuItems.push({
        id: 6,
        title: 'Work',
        submenu: [
          { name: 'Staff Dashboard', path: '/staff-dashboard' },
          { name: 'Inventory', path: '/staff/inventory' },
          { name: 'Catalog', path: '/staff/catalog' }
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
    logout();
    setIsUserMenuOpen(false);
    navigate('/'); // Quay về trang chủ sau khi logout
  };

  const isActivePage = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="tesla-header">
        <div className="tesla-header__container">
          {/* Left: Logo */}
          <Link to="/" className="tesla-header__logo">
            <Logo size={40} className="tesla-logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="tesla-header__nav desktop-nav">
          {menuItems.map((item) => (
            <div key={item.id} className="nav-item">
              <Link 
                to={item.submenu && item.submenu.length > 0 ? item.submenu[0].path : `/${item.title.toLowerCase()}`}
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
                  {(userRole === USER_ROLES.DEALER || userRole === 'DealerManager') && '🏢'}
                  {(userRole === USER_ROLES.CUSTOMER || userRole === 'Customer') && '👤'}
                  {(userRole === USER_ROLES.EVM_ADMIN || userRole === 'Admin') && '⚡'}
                  {(userRole === USER_ROLES.STAFF || userRole === 'EVMStaff') && '💼'}
                  {currentUser.name || currentUser.username}
                </span>
                <span className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-menu-header">
                    <div className="user-avatar">
                      {(userRole === USER_ROLES.DEALER || userRole === 'DealerManager') && '🏢'}
                      {(userRole === USER_ROLES.CUSTOMER || userRole === 'Customer') && '👤'}
                      {(userRole === USER_ROLES.EVM_ADMIN || userRole === 'Admin') && '⚡'}
                      {(userRole === USER_ROLES.STAFF || userRole === 'EVMStaff') && '💼'}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{currentUser.name || currentUser.username}</div>
                      <div className="user-role">{userRole}</div>
                    </div>
                  </div>
                  
                  <div className="user-menu-divider"></div>
                  
                  <div className="user-menu-items">
                    <button className="user-menu-item" onClick={handleDashboardNavigation}>
                      <span className="menu-icon">📊</span>
                      <span>Dashboard</span>
                    </button>
                    
                    {userRole === USER_ROLES.CUSTOMER && (
                      <>
                        <button className="user-menu-item" onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/customer-dashboard?section=vehicles');
                        }}>
                          <span className="menu-icon">🚗</span>
                          <span>Xe của tôi</span>
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