import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">EV Management</div>
      <ul className="sidebar-menu">
        <li><Link to="/dealer">🏢 Dealer Dashboard</Link></li>
        <li><Link to="/evm">⚡ EVM Dashboard</Link></li>
        <li><Link to="/reports">📊 Reports & Analytics</Link></li>
        <li><Link to="/catalog">🚗 Vehicle Catalog</Link></li>
        <li><Link to="/inventory">📦 Inventory</Link></li>
        <li><Link to="/customers">👥 Customers</Link></li>
        <li><Link to="/sales/orders">🛒 Sales Orders</Link></li>
        <li><Link to="/admin/dealers">🏪 Dealer Management</Link></li>
        <li><Link to="/">🏠 Home</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;