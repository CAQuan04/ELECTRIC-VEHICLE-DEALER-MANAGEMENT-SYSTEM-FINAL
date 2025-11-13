import React, { useMemo, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService, USER_ROLES } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { useNotifications } from "../../hooks/useNotifications";
import Logo from "../../components/common/Logo";
import {
  FiUsers,
  FiMenu,
  FiX,
  FiPlus,
  FiShoppingCart,
  FiBarChart2,
  FiHome,
  FiTruck,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import {
  RiGroupLine,
  RiMoonLine,
  RiSunLine,
  RiCarLine,
  RiDashboardLine,
  RiFileTextLine,
  RiBrainLine,
  RiPriceTag3Line,
  RiFileChartLine,
} from "react-icons/ri";

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
  const { user, logout } = useAuth();
  const userRole = user?.role;
  const navigate = useNavigate();

  console.log("🎯 Sidebar render - user:", user, "role:", userRole);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isExpanded, toggleSidebar } = useSidebar(); // Sử dụng context
  const {
    notifications,
    loading: notificationsLoading,
    markAsRead,
  } = useNotifications(); // Lấy notifications thực tế
  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout(); // Dùng logout từ useAuth
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setShowCreateMenu(false);
      }
    };

    if (showUserMenu || showCreateMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu, showCreateMenu]);

  // Create menu items theo role
  const createMenuItems = useMemo(() => {
    const dealerId = user?.dealerId;
    
    // Xử lý cả role từ backend (DealerManager, DealerStaff) và role cũ (dealer)
    if (
      userRole === "DealerManager" ||
      userRole === "DealerStaff" ||
      userRole === USER_ROLES.DEALER
    ) {
      const basePath = dealerId ? `/${dealerId}/dealer` : '/dealer';
      return [
        {
          label: "Tạo Đơn Hàng",
          icon: FiShoppingCart,
          path: `${basePath}/orders/create`,
        },
        {
          label: "Thêm Khách Hàng",
          icon: FiUsers,
          path: `${basePath}/customers/new`,
        },
        {
          label: "Đặt Lịch Test Drive",
          icon: FiCalendar,
          path: `${basePath}/test-drives/new`,
        },
        {
          label: "Yêu Cầu Nhập Kho",
          icon: FiPackage,
          path: `${basePath}/inventory/request`,
        },
      ];
    }

    if (userRole === USER_ROLES.CUSTOMER || userRole === "Customer") {
      return [
        {
          label: "Đặt Lịch Test Drive",
          icon: FiCalendar,
          path: "/test-drive/book",
        },
        { label: "Tạo Đơn Hàng", icon: FiShoppingCart, path: "/orders/new" },
      ];
    }

    // Admin - có quyền quản lý đại lý
    if (userRole === "Admin" || userRole === USER_ROLES.EVM_ADMIN) {
      return [
        { label: "Thêm Đại Lý", icon: RiGroupLine, path: "/admin/dealers/new" },
        { label: "Thêm Xe Mới", icon: RiCarLine, path: "/admin/catalog/new" },
        // { label: 'Tạo Người Dùng', icon: FiUsers, path: '/admin/users/new' }, // TODO: Create UserManagement page
        // { label: 'Nhập Kho Tổng', icon: FiTruck, path: '/admin/inventory/import' }, // TODO: Create Inventory Management page
        { label: "Tạo Báo Cáo", icon: FiFileText, path: "/reports/new" },
      ];
    }

    // EVMStaff - không có quyền quản lý đại lý
    if (userRole === "EVMStaff" || userRole === USER_ROLES.STAFF) {
      return [
        { label: "Thêm Xe Mới", icon: RiCarLine, path: "/admin/catalog/new" },
        { label: "Tạo Báo Cáo", icon: FiFileText, path: "/reports/new" },
      ];
    }

    return [];
  }, [userRole, user?.dealerId]);

  const menuItems = useMemo(() => {
    const dealerId = user?.dealerId;
    
    // Base menu items không có notifications
    const baseMenuItems = (() => {
      // Xử lý Dealer roles (DealerManager và DealerStaff)
      if (
        userRole === "DealerManager" ||
        userRole === "DealerStaff" ||
        userRole === USER_ROLES.DEALER
      ) {
        const basePath = dealerId ? `/${dealerId}/dealer` : '/dealer';
        return [
          {
            path: `${dealerId ? `/${dealerId}` : ''}/dealer-dashboard`,
            icon: RiDashboardLine,
            label: "Dashboard",
          },
          { path: `${basePath}/vehicles`, icon: RiCarLine, label: "Catalog Xe" },
          { path: `${basePath}/inventory`, icon: FiPackage, label: "Quản Lý Kho" },
          { path: `${basePath}/customers`, icon: FiUsers, label: "Khách Hàng" },
          {
            path: `${basePath}/test-drives`,
            icon: FiCalendar,
            label: "Test Drive",
          },
          { path: `${basePath}/orders`, icon: FiShoppingCart, label: "Đơn Hàng" },
          { path: `${basePath}/quotations`, icon: FiFileText, label: "Báo Giá" },
          { path: `${basePath}/payments`, icon: FiDollarSign, label: "Thanh Toán" },
          {
            path: `${basePath}/reports/sales-performance`,
            icon: FiBarChart2,
            label: "Báo Cáo",
          },
          { path: `${basePath}/promotions`, icon: FiFileText, label: "Khuyến Mãi" },
          { path: `${basePath}/staff`, icon: FiUsers, label: "Nhân Viên" },
          { path: "/landing", icon: FiHome, label: "Trang Chủ" },
        ];
      }

      // Xử lý Customer role
      if (userRole === USER_ROLES.CUSTOMER || userRole === "Customer") {
        return [
          {
            path: "/customer-dashboard",
            icon: RiDashboardLine,
            label: "Dashboard",
          },
          { path: "/vehicles", icon: RiCarLine, label: "Khám Phá Xe" },
          { path: "/shop", icon: FiShoppingCart, label: "Cửa Hàng" },
          { path: "/landing", icon: FiHome, label: "Trang Chủ" },
        ];
      }

      // Xử lý Admin role - chỉ Admin
      if (userRole === "Admin" || userRole === USER_ROLES.EVM_ADMIN) {
        return [

          {
            path: "/evm-dashboard",
            icon: RiDashboardLine,
            label: "Admin Dashboard",
          },

          { path: "/admin/users", icon: FiUsers, label: "Người Dùng" },

          {
            path: "/admin/dealers",
            icon: RiGroupLine,
            label: "Quản lý Đại Lý",
          },

          {
            path: "/admin/catalog",
            icon: RiCarLine,
            label: "Quản lý danh mục xe",
          },

          {
            path: "/admin/contracts-kpi",
            icon: RiFileTextLine,
            label: "Hợp đồng & KPI Đại lý",
          },

          {
            path: "/admin/reports",
            icon: FiBarChart2,
            label: "Báo Cáo Doanh Thu",
          },

          {
            path: "/admin/ai-forecast",
            icon: RiBrainLine,
            label: "AI Dự báo Nhu cầu",
          },
          { path: "/landing", icon: FiHome, label: "Trang Chủ" },
        ];
      }

      // Xử lý EVMStaff role - chỉ Staff
      if (userRole === "EVMStaff" || userRole === USER_ROLES.STAFF) {
        return [
          {
            path: "/staff-dashboard",
            icon: RiDashboardLine,
            label: "Staff Dashboard",
          },
          { path: "/staff/catalog", icon: RiCarLine, label: "Danh mục xe" },
          { 
    path: "/staff/inventory", 
    icon: FiPackage, 
    label: "Tồn kho & Điều phối" 
  },
  { 
    path: "/staff/pricing", 
    icon: RiPriceTag3Line, 
    label: "Giá sỉ & Khuyến mãi" 
  },
  { 
    path: "/staff/reports", 
    icon: RiFileChartLine, 
    label: "Báo cáo tồn kho" 
  },
  { 
    path: "/staff/ai-forecast", 
    icon: RiBrainLine, 
    label: "Dự báo nhu cầu (AI)" 
  },
          { path: "/landing", icon: FiHome, label: "Trang Chủ" },
        ];
      }

      // Default cho guest hoặc role không xác định
      return [{ path: "/landing", icon: FiHome, label: "Trang Chủ" }];
    })();

    // Thêm notifications count từ API vào mỗi menu item
    return baseMenuItems.map((item) => ({
      ...item,
      notifications: notifications[item.path] || 0,
    }));
  }, [userRole, notifications, user?.dealerId]);

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
  if (!user) {
    console.log("❌ Sidebar: Không có user, không render");
    return null;
  }

  console.log("✅ Sidebar: Có user, đang render sidebar");

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
          isExpanded ? "w-[250px]" : "w-22", // 250px khi mở rộng
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex flex-col h-full justify-between py-6">
          {/* Logo & Title */}
          <div
            className={`flex items-center px-4 mb-8 ${
              isExpanded ? "justify-start gap-3" : "justify-center"
            } transition-all duration-300`}
          >
            <Logo size={50} />
            {isExpanded && (
              <div className="overflow-hidden">
                <div className="font-extrabold text-2xl leading-6 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap">
                  EV Management
                </div>
                <div className="text-sm text-slate-400 whitespace-nowrap mt-0.5">
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
              <FiChevronLeft
                size={16}
                className="text-indigo-400 group-hover:text-indigo-300"
              />
            ) : (
              <FiChevronRight
                size={16}
                className="text-indigo-400 group-hover:text-indigo-300"
              />
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
                        : "hover:bg-slate-800/50",
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
                        <span
                          className={`text-[15px] font-semibold whitespace-nowrap ${
                            isActive
                              ? "text-white"
                              : "text-slate-300 group-hover:text-white"
                          }`}
                        >
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
            {user?.username && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`w-full flex items-center group hover:bg-slate-800/50 rounded-xl p-2 transition-all duration-200 ${
                    isExpanded ? "gap-3" : "justify-center"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex-shrink-0 ring-2 ring-indigo-400/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  {isExpanded && (
                    <div className="overflow-hidden flex-1 text-left">
                      <div className="text-[15px] font-semibold text-white whitespace-nowrap truncate">
                        {user.username}
                      </div>
                      <div className="text-xs text-slate-400 whitespace-nowrap">
                        {userRole}
                      </div>
                    </div>
                  )}

                  {/* Tooltip khi collapsed */}
                  {!isExpanded && (
                    <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50">
                      {user.username}
                      <br />
                      <span className="text-xs text-slate-300">{userRole}</span>
                      <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className={`absolute ${
                      isExpanded
                        ? "bottom-full left-0 right-0"
                        : "bottom-0 left-full ml-3"
                    } mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[200px]`}
                  >
                    <div className="py-2">
                      {/* Config Account */}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowProfileModal(true);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left group"
                      >
                        <FiSettings
                          size={18}
                          className="text-slate-400 group-hover:text-indigo-400"
                        />
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
                        <FiLogOut
                          size={18}
                          className="text-slate-400 group-hover:text-red-400"
                        />
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
                isExpanded ? "gap-3 justify-start" : "justify-center"
              }`}
              aria-label="Toggle Dark Mode"
            >
              <div className="flex-shrink-0">
                {isDarkMode ? (
                  <RiSunLine
                    size={24}
                    className="text-slate-400 group-hover:text-amber-400"
                  />
                ) : (
                  <RiMoonLine
                    size={24}
                    className="text-slate-400 group-hover:text-indigo-400"
                  />
                )}
              </div>

              {isExpanded && (
                <span className="text-[15px] font-semibold text-slate-300 group-hover:text-white whitespace-nowrap">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}

              {!isExpanded && (
                <span className="absolute left-full ml-3 px-3 py-2 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                  <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></span>
                </span>
              )}
            </button>

            {/* Create New Button */}
            <div className="relative" ref={createMenuRef}>
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className={`flex items-center bg-gradient-to-r from-indigo-300 to-purple-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 group relative transform hover:scale-105 ${
                  isExpanded
                    ? "w-full p-3 gap-3 justify-center"
                    : "w-12 h-12 mx-auto justify-center"
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
                <div
                  className={`absolute ${
                    isExpanded
                      ? "bottom-full left-0 right-0"
                      : "bottom-0 left-full ml-3"
                  } mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[220px]`}
                >
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
                          <item.icon
                            size={18}
                            className="text-slate-400 group-hover:text-indigo-400 flex-shrink-0"
                          />
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Thông Tin Tài Khoản
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                      Quản lý thông tin cá nhân của bạn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors group"
                  aria-label="Đóng"
                >
                  <FiX
                    size={24}
                    className="text-white group-hover:rotate-90 transition-transform duration-300"
                  />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Thông tin cá nhân */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiUsers size={20} className="text-indigo-400" />
                    Thông Tin Cá Nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.name && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Họ và tên
                        </label>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-medium">
                          {user.name}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Tên đăng nhập
                      </label>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                        {user.username}
                      </div>
                    </div>
                    {user.email && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Email
                        </label>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                          {user.email}
                        </div>
                      </div>
                    )}
                    {user.phone && (
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Số điện thoại
                        </label>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                          {user.phone}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Vai trò
                      </label>
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          {userRole === "DealerManager"
                            ? "Quản Lý Đại Lý"
                            : userRole === "DealerStaff"
                            ? "Nhân Viên Đại Lý"
                            : userRole === "Admin"
                            ? "Quản Trị Viên"
                            : userRole === "EVMStaff"
                            ? "Nhân Viên EVM"
                            : userRole === "Customer"
                            ? "Khách Hàng"
                            : userRole === USER_ROLES.DEALER
                            ? "Đại Lý"
                            : userRole === USER_ROLES.CUSTOMER
                            ? "Khách Hàng"
                            : userRole === USER_ROLES.EVM_ADMIN
                            ? "Quản Trị Viên"
                            : userRole === USER_ROLES.STAFF
                            ? "Nhân Viên"
                            : userRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin Đại lý - chỉ hiện với DEALER */}
                {(userRole === "DealerManager" ||
                  userRole === "DealerStaff" ||
                  userRole === USER_ROLES.DEALER) &&
                  (user.dealerId || user.shopName || user.dealerShopId) && (
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <RiGroupLine size={20} className="text-indigo-400" />
                        Thông Tin Đại Lý
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.shopName && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-indigo-300 mb-2">
                              Tên cửa hàng
                            </label>
                            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white font-semibold">
                              🏪 {user.shopName}
                            </div>
                          </div>
                        )}
                        {user.dealerId && (
                          <div>
                            <label className="block text-sm font-medium text-indigo-300 mb-2">
                              Mã Đại Lý
                            </label>
                            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-indigo-300 font-mono font-semibold">
                              #{user.dealerId}
                            </div>
                          </div>
                        )}
                        {user.dealerShopId && (
                          <div>
                            <label className="block text-sm font-medium text-indigo-300 mb-2">
                              Mã Cửa Hàng
                            </label>
                            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-indigo-300 font-mono font-semibold">
                              #{user.dealerShopId}
                            </div>
                          </div>
                        )}
                        {user.address && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-indigo-300 mb-2">
                              Địa chỉ cửa hàng
                            </label>
                            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white">
                              📍 {user.address}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Thông tin Khách hàng - chỉ hiện với CUSTOMER */}
                {(userRole === "Customer" ||
                  userRole === USER_ROLES.CUSTOMER) &&
                  user.customerId && (
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiUsers size={20} className="text-purple-400" />
                        Thông Tin Khách Hàng
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">
                            Mã Khách Hàng
                          </label>
                          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-purple-300 font-mono font-semibold">
                            #{user.customerId}
                          </div>
                        </div>
                        {user.membershipTier && (
                          <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              Hạng thành viên
                            </label>
                            <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                ⭐ {user.membershipTier}
                              </span>
                            </div>
                          </div>
                        )}
                        {user.address && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-purple-300 mb-2">
                              Địa chỉ
                            </label>
                            <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white">
                              📍 {user.address}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Thông tin Nhân viên - chỉ hiện với STAFF */}
                {(userRole === "EVMStaff" || userRole === USER_ROLES.STAFF) &&
                  user.staffId && (
                    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FiUsers size={20} className="text-cyan-400" />
                        Thông Tin Nhân Viên
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-cyan-300 mb-2">
                            Mã Nhân Viên
                          </label>
                          <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-300 font-mono font-semibold">
                            #{user.staffId}
                          </div>
                        </div>
                        {user.department && (
                          <div>
                            <label className="block text-sm font-medium text-cyan-300 mb-2">
                              Phòng ban
                            </label>
                            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white">
                              🏢 {user.department}
                            </div>
                          </div>
                        )}
                        {user.position && (
                          <div>
                            <label className="block text-sm font-medium text-cyan-300 mb-2">
                              Chức vụ
                            </label>
                            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white">
                              👔 {user.position}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Quyền hạn */}
                {user.permissions && user.permissions.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiSettings size={20} className="text-indigo-400" />
                      Quyền Hạn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
                        >
                          ✓{" "}
                          {permission
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thống kê tài khoản */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiBarChart2 size={20} className="text-indigo-400" />
                    Thống Kê Hoạt Động
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {Object.values(notifications).reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Thông báo
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {menuItems.length}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Tính năng
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                        {createMenuItems.length}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Hành động
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  // TODO: Navigate to edit profile page
                  navigate("/profile/edit");
                }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/30"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
