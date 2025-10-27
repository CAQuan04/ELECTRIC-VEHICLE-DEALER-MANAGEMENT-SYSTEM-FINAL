// StaffDashboard.jsx — Reskinned to EVM style (dark slate + blue), hero "Staff Portal"
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@utils";
import { usePageLoading } from "@modules/loading";
import "@modules/loading/GlobalLoading.css";
import InventoryManagement from "./InventoryManagement";
import PricingManagement from "./PricingManagement";
import ReportsSection from "../components/ReportsSection";
import InventoryTurnoverReport from "./InventoryTurnoverReport";

/* =======================
   MOCK / ORIGINAL DATA
   ======================= */
const MOCK_DASHBOARD_DATA = {
  dealer: { vehicles: 47, orders: 13, customers: 156, revenue: 11.3 },
  performance: {
    monthlySales: 13,
    quarterTarget: 85,
    customerSatisfaction: 4.7,
    deliveryTime: 5,
  },
  recentOrders: [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      vehicle: "Tesla Model 3",
      status: "Đang xử lý",
      date: "2 giờ trước",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      vehicle: "Tesla Model Y",
      status: "Hoàn thành",
      date: "1 ngày trước",
    },
    {
      id: 3,
      customer: "Lê Văn C",
      vehicle: "Tesla Model S",
      status: "Chờ duyệt",
      date: "2 ngày trước",
    },
    {
      id: 4,
      customer: "Phạm Thị D",
      vehicle: "Tesla Model X",
      status: "Đang giao",
      date: "3 ngày trước",
    },
  ],
  inventory: [
    { model: "Model 3", available: 12, reserved: 3, total: 15 },
    { model: "Model Y", available: 8, reserved: 2, total: 10 },
    { model: "Model S", available: 5, reserved: 1, total: 6 },
    { model: "Model X", available: 3, reserved: 0, total: 3 },
  ],
};

const NAV_SECTIONS = [
  { id: "overview", icon: "📊", label: "Tổng quan" },
  { id: "inventory", icon: "🚗", label: "Kho xe" },
  { id: "stock", icon: "🏭", label: "Tồn kho & Điều phối" },
  { id: "pricing", icon: "💵", label: "Giá sỉ & Khuyến mãi" },
  { id: "orders", icon: "📋", label: "Đơn hàng" },
  { id: "customers", icon: "👥", label: "Khách hàng" },
  { id: "inventory-report", icon: "📊", label: "Báo cáo tồn kho" },
  { id: "reports", icon: "📈", label: "Báo cáo" },
];

const getStatusClasses = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-emerald-500/20 text-emerald-300";
    case "Đang xử lý":
      return "bg-sky-500/20 text-sky-300";
    case "Chờ duyệt":
      return "bg-yellow-500/20 text-yellow-300";
    default:
      return "bg-purple-500/20 text-purple-300";
  }
};

/* =======================
   Small reusable components (kept from original)
   ======================= */

const ModuleCard = ({ icon, title, description, tag, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:scale-105 transition-all duration-250 flex gap-4 shadow-xl backdrop-blur-md"
  >
    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="flex-1">
      <h5 className="text-lg font-bold mb-2 text-slate-100">{title}</h5>
      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{description}</p>
      <span className="inline-block px-3 py-1.5 text-xs font-bold bg-slate-800 text-sky-300 rounded-full border border-slate-700 shadow-sm">
        {tag}
      </span>
    </div>
  </div>
);

const RecentOrdersList = ({ orders }) => (
  <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 shadow-xl">
    <h3 className="text-2xl font-bold mb-6 text-slate-100">
      📋 Đơn hàng gần đây
    </h3>
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800 hover:bg-slate-900/60 transition"
        >
          <div className="flex-1">
            <div className="font-bold text-slate-100">{order.customer}</div>
            <div className="text-sm text-slate-400 font-medium">
              {order.vehicle}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusClasses(
                order.status
              )}`}
            >
              {order.status}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {order.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* =======================
   Sections re-used from original StaffDashboard
   (OverviewSection and InventorySection lightly adjusted colors)
   ======================= */

const HeroStats = ({ stats }) => (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {stats.map((s, i) => (
      <div
        key={i}
        className="rounded-2xl border border-slate-800 bg-white/5 p-5 text-center shadow-[0_12px_40px_rgba(14,165,233,.06)]"
      >
        <div className="text-3xl md:text-4xl font-extrabold text-slate-50">
          {s.value}
        </div>
        <div className="text-slate-400 text-base mt-1">{s.label}</div>
      </div>
    ))}
  </div>
);

const OverviewSection = ({ dashboardData, navigate }) => {
  const { dealer, performance } = dashboardData;

  const overviewStatsConfig = [
    {
      icon: "🚗",
      title: "Xe có sẵn",
      value: dealer.vehicles,
      change: "+5 xe trong tuần",
    },
    {
      icon: "📋",
      title: "Đơn hàng",
      value: dealer.orders,
      change: "+18% so với tháng trước",
    },
    {
      icon: "👥",
      title: "Khách hàng",
      value: dealer.customers,
      change: "+12 khách mới",
    },
    {
      icon: "💰",
      title: "Doanh thu",
      value: `${dealer.revenue} tỷ`,
      change: "+25% so với tháng trước",
    },
  ];

  const performanceMetrics = [
    { label: "Bán hàng tháng này", value: performance.monthlySales },
    { label: "Mục tiêu quý", value: `${performance.quarterTarget}%` },
    {
      label: "Hài lòng khách hàng",
      value: `${performance.customerSatisfaction}/5`,
    },
    { label: "Thời gian giao xe", value: `${performance.deliveryTime} ngày` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStatsConfig.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 bg-slate-900/40 border border-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-lg font-bold text-slate-200">
                {stat.title}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-100 mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-slate-900/40 border border-slate-800 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-slate-100">
            📈 Hiệu suất kinh doanh
          </h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-slate-950/30 rounded-xl border border-slate-800"
              >
                <span className="text-slate-300 font-semibold">
                  {metric.label}
                </span>
                <span className="text-2xl font-extrabold text-slate-100">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <RecentOrdersList orders={dashboardData.recentOrders} />
      </div>
    </div>
  );
};

const InventorySection = ({ inventory }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-3xl font-extrabold text-slate-100">
        🚗 Quản lý kho xe
      </h2>
      <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl font-bold text-white shadow-lg">
        + Nhập xe mới
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {inventory.map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl p-6 bg-slate-900/40 border border-slate-800 shadow-xl"
        >
          <h4 className="text-2xl font-extrabold mb-6 text-slate-100">
            {item.model}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-950/30 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-300 font-semibold">
                Có sẵn
              </span>
              <span className="text-2xl font-extrabold text-sky-400">
                {item.available}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-950/30 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-300 font-semibold">
                Đã đặt
              </span>
              <span className="text-2xl font-extrabold text-amber-400">
                {item.reserved}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-950/30 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-300 font-semibold">Tổng</span>
              <span className="text-2xl font-extrabold text-sky-300">
                {item.total}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* =======================
   Main Staff Dashboard (reskinned)
   ======================= */

const UserLogo = ({ size = 44 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className="rounded-xl"
    aria-hidden
  >
    <defs>
      <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#userGrad)" />
    <path d="M32 20a6 6 0 100 12 6 6 0 000-12z" fill="white" opacity="0.95" />
    <path
      d="M20 44c0-6 6-10 12-10s12 4 12 10v2H20v-2z"
      fill="white"
      opacity="0.95"
    />
  </svg>
);

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();

  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const currentUser = AuthService.getCurrentUser();

  // Auto-enable dark mode globally for consistent style
  useEffect(() => {
    document.documentElement.classList.add("dark");
    // make body background consistent with EVM style
    document.body.classList.add("bg-slate-950");
    // cleanup not strictly needed but polite
    return () => {
      // don't remove dark on unmount to avoid flicker if other pages rely on it
    };
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      startLoading("Đang tải dữ liệu nhân viên...");
      // simulate API
      await new Promise((r) => setTimeout(r, 350));
      setDashboardData(MOCK_DASHBOARD_DATA);
    } catch (err) {
      console.error("Staff Dashboard error:", err);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (!dashboardData) return null;

  const { inventory } = dashboardData;

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection dashboardData={dashboardData} navigate={navigate} />
        );
      case "inventory":
        return <InventorySection inventory={inventory} />;
      case "stock":
        return <InventoryManagement />;
      case "reports":
        return <ReportsSection />;
      case "orders":
      case "customers":
        return (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100">
              Tính năng đang phát triển
            </h2>
            <p className="text-slate-300 mt-2">
              Phần này sẽ sớm được triển khai.
            </p>
          </div>
        );
      case "pricing":
        return <PricingManagement />;
      case "inventory-report":
        return <InventoryTurnoverReport />;

      default:
        return null;
    }
  };

  // Hero quick stats — you asked to keep these sample values
  const HERO_STATS = [
    { label: "Đơn hàng hôm nay", value: 24 },
    { label: "Khách hàng đang phục vụ", value: 112 },
    { label: "Doanh thu tháng", value: "85.6M VND" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 text-[15.5px] md:text-[16px] lg:text-[16.5px]">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-[0_30px_80px_rgba(2,6,23,.6)] mb-6">
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-sky-700/10 blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/3 p-2 shadow-sm flex items-center">
              <div className="text-sky-400">
                <UserLogo />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-100">
                Staff Portal
              </h1>
              <p className="text-slate-300 text-base md:text-lg mt-1">
                Chào mừng {currentUser?.name ?? "Nhân viên"} — quản lý nhiệm vụ
                và hỗ trợ khách hàng
              </p>
            </div>
          </div>

          {/* HERO STATS */}
          <HeroStats stats={HERO_STATS} />
        </div>
      </div>

      {/* NAV PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NAV_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold transition text-base",
              activeSection === section.id
                ? "bg-sky-600 text-white border-sky-600 shadow-[0_12px_30px_rgba(14,165,233,.25)]"
                : "bg-slate-900/30 border-slate-800 text-slate-200 hover:border-sky-500/50 hover:bg-sky-500/8",
            ].join(" ")}
          >
            <span className="text-lg">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-6">{renderActiveSection()}</div>
    </div>
  );
};

export default StaffDashboard;
