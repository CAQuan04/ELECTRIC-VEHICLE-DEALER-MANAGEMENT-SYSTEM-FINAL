import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/dealer', label: 'Dealer Dashboard' },
    { to: '/evm', label: 'EVM Dashboard' },
    { to: '/catalog', label: 'Danh mục xe' },
    { to: '/sales/orders', label: 'Đơn hàng' },
    { to: '/customers', label: 'Khách hàng' },
    { to: '/inventory', label: 'Tồn kho' },
    { to: '/reports', label: 'Báo cáo' },
    { to: '/admin/dealers', label: 'Đại lý' }
  ];
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>EVM</h2>
      <nav>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} style={styles.link} className={({isActive})=> isActive ? 'active' : ''}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: { width: '220px', background: '#102027', color: '#fff', padding: '1rem', height: '100vh', boxSizing: 'border-box', position: 'fixed', left: 0, top: 0 },
  logo: { marginTop: 0 },
  link: { display: 'block', color: '#eceff1', textDecoration: 'none', padding: '0.5rem 0', fontSize: '0.9rem' }
};

export default Sidebar;
