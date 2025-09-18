import React from 'react';

const Navbar = () => {
  return (
    <header className="navbar" style={styles.nav}>
      <h1 style={styles.title}>EVM Dealer Management</h1>
      <div>/* User / Role / Notifications placeholder */</div>
    </header>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#0d47a1', color: '#fff' },
  title: { fontSize: '1.1rem', margin: 0 }
};

export default Navbar;
