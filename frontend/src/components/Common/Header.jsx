import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthComponent from '../Auth/AuthComponent';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  const menuItems = [
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };

  const handleMenuItemClick = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
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
          <AuthComponent />
          
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