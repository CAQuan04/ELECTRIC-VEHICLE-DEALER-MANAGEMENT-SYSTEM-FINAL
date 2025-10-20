// Shared components and utilities exports
export { default as Header } from './components/Header.jsx';
export { default as Footer } from './components/Footer.jsx';
export { default as Sidebar } from './layout/Sidebar.jsx';
export { default as Navbar } from './layout/Navbar.jsx';
export { DealerGuard, CustomerGuard, AdminGuard, AccessDenied, StaffGuard } from './auth/RoleGuard.jsx';
export { AuthService } from './utils/auth.js';
export { default as VehicleList } from './components/Catalog/VehicleList.jsx';