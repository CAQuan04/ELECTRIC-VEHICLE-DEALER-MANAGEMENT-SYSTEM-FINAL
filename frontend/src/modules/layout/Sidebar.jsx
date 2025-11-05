import React, { useMemo, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService, USER_ROLES } from "../../utils/auth";
import { useSidebar } from "../../contexts/SidebarContext";
import { useNotifications } from "../../hooks/useNotifications";
import Logo from "../../components/common/Logo";
import { FiUsers, FiMenu, FiX, FiPlus, FiShoppingCart, FiBarChart2, FiHome, FiTruck, FiPackage, FiChevronLeft, FiChevronRight, FiSettings, FiLogOut, FiFileText, FiCalendar, FiDollarSign } from "react-icons/fi";
import { RiGroupLine, RiMoonLine, RiSunLine, RiCarLine, RiDashboardLine } from "react-icons/ri";

/* ==== SVG Icons (size up: w-6 h-6) ==== */
const icons = {
  dashboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path
        d="M3 13h8V3H3v10zm10 8h8V3h-8v18zm-10 0h8v-6H3v6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  car: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path
        d="M3 13l2-5h14l2 5M5 18h14m-9 0v2m4-2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warehouse: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path
        d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  report: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path d="M3 3h18v18H3V3z" />
      <path d="M8 17v-6m4 6v-3m4 3v-8" />
    </svg>
  ),
  home: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-6 h-6 stroke-[1.8]"
      stroke="currentColor"
    >
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  ),
};

/* ==== Sidebar (Icon-only modern style with expand/collapse) ==== */
const Sidebar = ({ isOpen = false, onClose }) => {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const { isExpanded, toggleSidebar } = useSidebar(); // Sử dụng context
  const { notifications, loading: notificationsLoading, markAsRead } = useNotifications(); // Lấy notifications thực tế
  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/landing');
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
    };

    if (showUserMenu || showCreateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showCreateMenu]);

  // Create menu items theo role
  const createMenuItems = useMemo(() => {
    switch (userRole) {
      case USER_ROLES.DEALER:
        return [
          { label: 'Tạo Đơn Hàng', icon: FiShoppingCart, path: '/dealer/orders/new' },
          { label: 'Thêm Khách Hàng', icon: FiUsers, path: '/dealer/customers/new' },
          { label: 'Đặt Lịch Test Drive', icon: FiCalendar, path: '/dealer/test-drives/new' },
          { label: 'Nhập Kho', icon: FiPackage, path: '/dealer/inventory/import' }
        ];
      
      case USER_ROLES.CUSTOMER:
        return [
          { label: 'Đặt Lịch Test Drive', icon: FiCalendar, path: '/test-drive/book' },
          { label: 'Tạo Đơn Hàng', icon: FiShoppingCart, path: '/orders/new' }
        ];
      
      case USER_ROLES.EVM_ADMIN:
        return [
          { label: 'Thêm Đại Lý', icon: RiGroupLine, path: '/admin/dealers/new' },
          { label: 'Thêm Xe Mới', icon: RiCarLine, path: '/admin/catalog/new' },
          { label: 'Tạo Người Dùng', icon: FiUsers, path: '/admin/users/new' },
          { label: 'Nhập Kho Tổng', icon: FiTruck, path: '/admin/inventory/import' },
          { label: 'Tạo Báo Cáo', icon: FiFileText, path: '/reports/new' }
        ];
      
      default:
        return [];
    }
  }, [userRole]);

  const menuItems = useMemo(() => {
    // Base menu items không có notifications
    const baseMenuItems = (() => {
      switch (userRole) {
        case USER_ROLES.DEALER:
          return [
            { path: '/dealer-dashboard', icon: RiDashboardLine, label: 'Dashboard' },
            { path: '/dealer/vehicles', icon: RiCarLine, label: 'Catalog Xe' },
            { path: '/dealer/inventory', icon: FiPackage, label: 'Quản Lý Kho' },
            { path: '/dealer/customers', icon: FiUsers, label: 'Khách Hàng' },
            { path: '/dealer/orders', icon: FiShoppingCart, label: 'Đơn Hàng' },
            { path: '/landing', icon: FiHome, label: 'Trang Chủ' }
          ];

        case USER_ROLES.CUSTOMER:
          return [
            { path: '/customer-dashboard', icon: RiDashboardLine, label: 'Dashboard' },
            { path: '/vehicles', icon: RiCarLine, label: 'Khám Phá Xe' },
            { path: '/shop', icon: FiShoppingCart, label: 'Cửa Hàng' },
            { path: '/landing', icon: FiHome, label: 'Trang Chủ' }
          ];

        case USER_ROLES.EVM_ADMIN:
          return [
            { path: "/evm-dashboard", icon: RiDashboardLine, label: "EVM Dashboard" },
            { path: "/reports", icon: FiBarChart2, label: "Reports" },
            { path: "/admin/dealers", icon: RiGroupLine, label: "Đại Lý" },
            { path: "/admin/catalog", icon: RiCarLine, label: "Catalog Xe" },
            { path: "/admin/inventory", icon: FiTruck, label: "Tổng Kho" },
            { path: "/admin/users", icon: FiUsers, label: "Người Dùng" },
            { path: "/landing", icon: FiHome, label: "Trang Chủ" },
          ];
        default:
          return [{ path: "/landing", icon: FiHome, label: "Trang Chủ" }];
      }
    })();

    // Thêm notifications count từ API vào mỗi menu item
    return baseMenuItems.map(item => ({
      ...item,
      notifications: notifications[item.path] || 0
    }));
  }, [userRole, notifications]);

  const handleItemClick = () => {
    onClose && onClose();
    setIsMobileMenuOpen(false);
  };

  const handleMenuItemClick = (path) => {
    // Đánh dấu đã đọc nếu có notifications
    if (notifications[path] > 0) {
      markAsRead(path);
    }
    handleItemClick();
  };

  // Don't render sidebar if no user
  if (!currentUser) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg hover:bg-slate-700 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? (
          <FiX size={24} className="text-white" />
        ) : (
          <FiMenu size={24} className="text-white" />
        )}
      </button>

      {/* Icon-only Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 border-r border-slate-700/50",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "w-[250px]" : "w-20", // 250px khi mở rộng
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        ].join(" ")}
      >
        <div className="flex flex-col h-full justify-between py-6">
          {/* Logo & Title */}
          <div className={`flex items-center px-4 mb-8 ${isExpanded ? 'justify-start gap-3' : 'justify-center'} transition-all duration-300`}>
            <Logo size={40} />
            {isExpanded && (
              <div className="overflow-hidden">
                <div className="font-extrabold text-xl leading-6 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap">
                  EV Management
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
                  Admin Console
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-8 bg-slate-800 border-2 border-indigo-500/50 rounded-full p-1.5 shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 hover:scale-110 hover:border-indigo-400 z-50 group"
            aria-label={isExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
          >
            {isExpanded ? (
              <FiChevronLeft size={16} className="text-indigo-400 group-hover:text-indigo-300" />
            ) : (
              <FiChevronRight size={16} className="text-indigo-400 group-hover:text-indigo-300" />
            )}
          </button>

          {/* Menu Items */}
          <div className="flex-1 space-y-2 px-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.path} className="relative">
                <NavLink
                  to={item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                  end
                  className={({ isActive }) =>
                    [
                      "w-full p-3 flex items-center rounded-xl",
                      "group relative transition-all duration-200",
                      isExpanded ? "gap-6 pl-6" : "justify-center",
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/30"
                        : "hover:bg-slate-800/50"
                    ].join(" ")
                  }
                  aria-label={item.label}
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <item.icon
                          size={24}
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-indigo-400"
                          }
                        />
                        {item.notifications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                            {item.notifications}
                          </span>
                        )}
                      </div>
                      
                      {/* Label - hiển thị khi expanded */}
                      {isExpanded && (
                        <span className={`text-[15px] font-semibold whitespace-nowrap ${
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}>
                          {item.label}
                        </span>
                      )}
                      
                      {/* Tooltip - chỉ hiển thị khi collapsed */}
                      {!isExpanded && (
                        <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl">
                          {item.label}
                          <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-3 px-2">
            {/* User Info with Dropdown */}
            {currentUser?.username && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`w-full flex items-center group hover:bg-slate-800/50 rounded-xl p-2 transition-all duration-200 ${isExpanded ? 'gap-3' : 'justify-center'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex-shrink-0 ring-2 ring-indigo-400/30">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  
                  {isExpanded && (
                    <div className="overflow-hidden flex-1 text-left">
                      <div className="text-[15px] font-semibold text-white whitespace-nowrap truncate">
                        {currentUser.username}
                      </div>
                      <div className="text-xs text-slate-400 whitespace-nowrap">
                        {userRole}
                      </div>
                    </div>
                  )}
                  
                  {/* Tooltip khi collapsed */}
                  {!isExpanded && (
                    <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50">
                      {currentUser.username}
                      <br />
                      <span className="text-xs text-slate-300">{userRole}</span>
                      <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className={`absolute ${isExpanded ? 'bottom-full left-0 right-0' : 'bottom-0 left-full ml-3'} mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[200px]`}>
                    <div className="py-2">
                      {/* Config Account */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left group"
                      >
                        <FiSettings size={18} className="text-slate-400 group-hover:text-indigo-400" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                          Cấu hình tài khoản
                        </span>
                      </button>

                      {/* Divider */}
                      <div className="border-t border-slate-700 my-1"></div>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left group"
                      >
                        <FiLogOut size={18} className="text-slate-400 group-hover:text-red-400" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-red-400">
                          Đăng xuất
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-full p-3 flex items-center hover:bg-slate-800/50 rounded-xl group relative transition-all duration-200 ${
                isExpanded ? 'gap-3 justify-start' : 'justify-center'
              }`}
              aria-label="Toggle Dark Mode"
            >
              <div className="flex-shrink-0">
                {isDarkMode ? (
                  <RiSunLine size={24} className="text-slate-400 group-hover:text-amber-400" />
                ) : (
                  <RiMoonLine size={24} className="text-slate-400 group-hover:text-indigo-400" />
                )}
              </div>
              
              {isExpanded && (
                <span className="text-[15px] font-semibold text-slate-300 group-hover:text-white whitespace-nowrap">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
              
              {!isExpanded && (
                <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                </span>
              )}
            </button>

            {/* Create New Button */}
            <div className="relative" ref={createMenuRef}>
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className={`flex items-center bg-gradient-to-r from-indigo-300 to-purple-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 group relative transform hover:scale-105 ${
                  isExpanded ? 'w-full p-3 gap-3 justify-center' : 'w-12 h-12 mx-auto justify-center'
                }`}
                aria-label="Create New"
              >
                <FiPlus size={24} className="flex-shrink-0" />
                
                {isExpanded && (
                  <span className="text-[15px] font-bold whitespace-nowrap">
                    Create New
                  </span>
                )}
                
                {!isExpanded && (
                  <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50">
                    Create New
                    <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                  </span>
                )}
              </button>

              {/* Dropdown Create Menu */}
              {showCreateMenu && createMenuItems.length > 0 && (
                <div className={`absolute ${isExpanded ? 'bottom-full left-0 right-0' : 'bottom-0 left-full ml-3'} mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[220px]`}>
                  <div className="py-2">
                    {createMenuItems.map((item, index) => (
                      <div key={index}>
                        <button
                          onClick={() => {
                            setShowCreateMenu(false);
                            navigate(item.path);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left group"
                        >
                          <item.icon size={18} className="text-slate-400 group-hover:text-indigo-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                            {item.label}
                          </span>
                        </button>
                        {index < createMenuItems.length - 1 && (
                          <div className="border-t border-slate-700/50 mx-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
