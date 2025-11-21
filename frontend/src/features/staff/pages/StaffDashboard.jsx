// StaffDashboard.jsx — Reskinned to EVM style with Lucide Icons
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@utils";
import { usePageLoading } from "@modules/loading";
import "@modules/loading/GlobalLoading.css";

// Import các icon từ lucide-react để giống phong cách ảnh bạn gửi
import { 
  Car, 
  ClipboardList, 
  Users, 
  Banknote, 
  TrendingUp, 
  Clock, 
  ThumbsUp, 
  Calendar,
  Package
} from "lucide-react";

/* =======================
   MOCK DATA
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
};

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
   Small reusable components
   ======================= */

const RecentOrdersList = ({ orders }) => (
  <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 shadow-xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-500/20 rounded-lg">
        <ClipboardList className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-100">
        Đơn hàng gần đây
      </h3>
    </div>
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800 hover:bg-slate-900/60 transition group"
        >
          <div className="flex-1">
            <div className="font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
              {order.customer}
            </div>
            <div className="text-sm text-slate-400 font-medium flex items-center gap-2 mt-1">
              <Car className="w-3.5 h-3.5 text-slate-500" />
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
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {order.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* =======================
   Overview Section
   ======================= */

const HeroStats = ({ stats }) => (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {stats.map((s, i) => (
      <div
        key={i}
        className="rounded-2xl border border-slate-800 bg-white/5 p-5 text-center shadow-[0_12px_40px_rgba(14,165,233,.06)] hover:bg-white/10 transition"
      >
        <div className="text-3xl md:text-4xl font-extrabold text-slate-50">
          {s.value}
        </div>
        <div className="text-slate-400 text-base mt-1 font-medium">{s.label}</div>
      </div>
    ))}
  </div>
);

const OverviewSection = ({ dashboardData }) => {
  const { dealer, performance } = dashboardData;

  // Cấu hình icon và màu sắc cho từng thẻ thống kê
  const overviewStatsConfig = [
    {
      icon: <Car className="w-8 h-8 text-sky-400" />,
      bgIcon: "bg-sky-500/10",
      title: "Xe có sẵn",
      value: dealer.vehicles,
      change: "+5 xe trong tuần",
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-purple-400" />,
      bgIcon: "bg-purple-500/10",
      title: "Đơn hàng",
      value: dealer.orders,
      change: "+18% so với tháng trước",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-400" />,
      bgIcon: "bg-orange-500/10",
      title: "Khách hàng",
      value: dealer.customers,
      change: "+12 khách mới",
    },
    {
      icon: <Banknote className="w-8 h-8 text-emerald-400" />,
      bgIcon: "bg-emerald-500/10",
      title: "Doanh thu",
      value: `${dealer.revenue} tỷ`,
      change: "+25% so với tháng trước",
    },
  ];

  const performanceMetrics = [
    { 
      label: "Bán hàng tháng này", 
      value: performance.monthlySales,
      icon: <Calendar className="w-5 h-5 text-slate-400" /> 
    },
    { 
      label: "Mục tiêu quý", 
      value: `${performance.quarterTarget}%`,
      icon: <TrendingUp className="w-5 h-5 text-sky-400" /> 
    },
    {
      label: "Hài lòng khách hàng",
      value: `${performance.customerSatisfaction}/5`,
      icon: <ThumbsUp className="w-5 h-5 text-yellow-400" />
    },
    { 
      label: "Thời gian giao xe", 
      value: `${performance.deliveryTime} ngày`,
      icon: <Package className="w-5 h-5 text-emerald-400" /> 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStatsConfig.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 bg-slate-900/40 border border-slate-800 shadow-xl hover:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${stat.bgIcon}`}>
                {stat.icon}
              </div>
              <span className="text-lg font-bold text-slate-200">
                {stat.title}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-100 mb-2 pl-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400 font-medium pl-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Performance & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance Card */}
        <div className="rounded-2xl p-6 bg-slate-900/40 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">
              Hiệu suất kinh doanh
            </h3>
          </div>
          
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-slate-950/30 rounded-xl border border-slate-800 hover:bg-slate-900/50 transition"
              >
                <div className="flex items-center gap-3">
                  {metric.icon}
                  <span className="text-slate-300 font-semibold">
                    {metric.label}
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-slate-100">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrdersList orders={dashboardData.recentOrders} />
      </div>
    </div>
  );
};

/* =======================
   Main Dashboard
   ======================= */

const UserLogo = ({ size = 44 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className="rounded-xl shadow-lg"
    aria-hidden
  >
    <defs>
      <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="64" height="64" fill="url(#userGrad)" />
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
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("bg-slate-950");
    return () => {};
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      startLoading("Đang tải dữ liệu nhân viên...");
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

  const HERO_STATS = [
    { label: "Đơn hàng hôm nay", value: 24 },
    { label: "Khách hàng đang phục vụ", value: 112 },
    { label: "Doanh thu tháng", value: "85.6M VND" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-[0_30px_80px_rgba(2,6,23,.6)] mb-6">
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-sky-700/10 blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="p-1 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700/50">
               <UserLogo size={52} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight">
                Staff Portal
              </h1>
              <p className="text-slate-400 text-base md:text-lg mt-1 font-medium">
                Chào mừng, {currentUser?.name ?? "Nhân viên"}
              </p>
            </div>
          </div>
          <HeroStats stats={HERO_STATS} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
          <OverviewSection dashboardData={dashboardData} navigate={navigate} />
      </div>
    </div>
  );
};

export default StaffDashboard;