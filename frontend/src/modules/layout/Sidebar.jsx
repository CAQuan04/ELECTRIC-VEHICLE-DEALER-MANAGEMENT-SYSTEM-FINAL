// File: src/modules/layout/Sidebar.jsx
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // SỬ DỤNG HOOK useAuth MỚI

// --- ĐỊNH NGHĨA CÁC BIỂU TƯỢNG (ICONS) ---
const icons = {
  dashboard: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zm-10 0h8v-6H3v6z" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
  car: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M3 13l2-5h14l2 5M5 18h14m-9 0v2m4-2v2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
  warehouse: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12h6v10" /></svg> ),
  users: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> ),
  report: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M3 3h18v18H3V3z" /><path d="M8 17v-6m4 6v-3m4 3v-8" /></svg> ),
  home: ( <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-[1.8]" stroke="currentColor"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" /></svg> ),
};

// --- COMPONENT LOGO ---
const Logo = ({ size = 40 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-lg">
    <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#0369a1" /></linearGradient></defs>
    <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#grad)" />
    <path d="M36 14 L26 34 h10 l-8 16 L44 30 h-10z" fill="white" opacity="0.95"/>
  </svg>
);

// --- COMPONENT SIDEBAR CHÍNH ---
const Sidebar = ({ isOpen = false, onClose }) => {
  // === THAY ĐỔI CỐT LÕI: SỬ DỤNG useAuth() ĐỂ LẤY THÔNG TIN USER ===
  const { user } = useAuth();
  const userRole = user?.role; // Lấy role từ user object: 'Admin', 'DealerManager', etc.

  // Ghi chú: useMemo sẽ tính toán lại danh sách menu mỗi khi vai trò của người dùng thay đổi.
  const menuItems = useMemo(() => {
    switch (userRole) {
      case 'DealerManager':
      case 'DealerStaff':
        return [
          { path: '/dealer-dashboard', icon: '🏢', label: 'Dashboard Đại Lý' },
          { path: '/dealer/vehicles', icon: '🚗', label: 'Catalog Xe' },
          { path: '/dealer/inventory', icon: '📦', label: 'Quản Lý Kho' },
          { path: '/dealer/customers', icon: '👥', label: 'Khách Hàng' },
          { path: '/dealer/orders', icon: '🛒', label: 'Đơn Hàng' },
          { path: "/landing", icon: icons.home, label: "Trang Công khai" },
        ];
      
      case 'Admin':
        return [
          { path: "/evm-dashboard", icon: icons.dashboard, label: "EVM Dashboard" },
          { path: "/reports", icon: icons.report, label: "Reports & Analytics" },
          { path: "/admin/dealers", icon: '🏢', label: "Quản lý Đại Lý" },
          { path: "/admin/users", icon: icons.users, label: "Quản lý Người Dùng" }, // Update this line
          { path: "/admin/catalog", icon: icons.car, label: "Quản lý Catalog Xe" },
          { path: "/admin/inventory", icon: icons.warehouse, label: "Quản lý Tổng Kho" },
          { path: "/landing", icon: icons.home, label: "Trang Công khai" },
        ];

      case 'EVMStaff':
        return [
          { path: "/staff-dasboard", icon: icons.dashboard, label: "Staff Dashboard" },
          { path: "/reports", icon: icons.report, label: "Reports & Analytics" },
          { path: "/landing", icon: icons.home, label: "Trang Công khai" },
        ];  

      default:
        // Menu mặc định cho người chưa đăng nhập hoặc vai trò không xác định
        return [{ path: "/landing", icon: icons.home, label: "Trang Chủ" }];
    }
  }, [userRole]);

  const handleItemClick = () => onClose && onClose();
  
  // Ghi chú: Nếu không có user (chưa đăng nhập), chúng ta sẽ không render Sidebar.
  // AppLayout sẽ chỉ hiển thị Header.
  if (!user) {
      return null;
  }

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50 w-[88vw] md:w-72 lg:w-80",
        "bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800",
        "shadow-[4px_0_30px_rgba(0,0,0,.5)] text-slate-200",
        "transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      ].join(" ")}
    >
      {/* Header của Sidebar */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Logo size={40} />
          <div>
            <div className="font-extrabold text-xl leading-5">EV Management</div>
            <div className="text-[12px] text-slate-400">Admin Console</div>
          </div>
        </div>

        {user?.username && (
          <div className="mt-3">
            <div className="text-xs text-slate-300">{user.username}</div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {userRole}
            </span>
          </div>
        )}
      </div>

      {/* Danh sách Menu */}
      <ul className="px-3 py-5 space-y-1.5">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={handleItemClick}
              end
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3",
                  "text-base font-semibold transition-all duration-200",
                  "hover:text-sky-300 hover:bg-sky-500/10",
                  isActive
                    ? "text-sky-300 bg-sky-500/15 border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,.2)]"
                    : "text-slate-300 border border-transparent",
                ].join(" ")
              }
            >
              {item.icon}
              <span className="text-xl">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;