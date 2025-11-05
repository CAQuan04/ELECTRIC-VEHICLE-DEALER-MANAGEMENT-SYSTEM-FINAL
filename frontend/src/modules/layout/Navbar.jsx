// File: src/modules/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import hook xác thực
import './Navbar.css';

const Navbar = () => {
  // Ghi chú: Lấy thông tin người dùng và hàm logout từ context.
  // Component này sẽ tự động cập nhật khi trạng thái đăng nhập thay đổi.
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">⚡ EV Manager</div>
      <div className="navbar-menu">
        <Link to="/vehicles">Vehicle</Link>
        <Link to="/charging">Charging</Link>
        <Link to="/shop">Shop</Link>
      </div>

      {/* Ghi chú: Hiển thị thông tin người dùng và nút logout nếu đã đăng nhập */}
      <div className="navbar-user-section">
        {user ? (
          <>
            <span className="navbar-username">Chào, {user.username}!</span>
            <button onClick={logout} className="navbar-logout-btn">Đăng xuất</button>
          </>
        ) : (
          <Link to="/landing" className="navbar-login-btn">Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;