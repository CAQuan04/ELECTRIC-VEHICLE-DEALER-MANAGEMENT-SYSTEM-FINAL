import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">⚡ EV Manager</div>
      <div className="navbar-menu">
        <Link to="/vehicles">Vehicle</Link>
        <Link to="/charging">Charging</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/information">Info</Link>
        <Link to="/discover">Discover</Link>
      </div>
    </nav>
  );
};

export default Navbar;