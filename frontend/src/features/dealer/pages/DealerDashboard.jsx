import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@utils';
import { usePageLoading } from '@modules/loading';
import '@modules/loading/GlobalLoading.css';
import {
  BarChart3,
  Car,
  ClipboardList,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  ShoppingCart,
  UserPlus,
  Rocket,
  Package,
  TrendingUpIcon,
  Construction,
  Shield,
  Settings
} from 'lucide-react';

// Import role guards
import { ForManager, ForStaff, useDealerRole } from '../components/auth/DealerRoleGuard';

// Import PageContainer for theme support
import PageContainer from '../components/layout/PageContainer';
import ReportsSection from '../components/ReportsSection';
import BentoMenu from '../components/BentoMenu';

// Import mock data
import { MOCK_DASHBOARD_DATA } from '../data/mockData';

const NAV_SECTIONS = [
  { id: 'overview', icon: BarChart3, label: 'Tổng quan' },
  { id: 'inventory', icon: Car, label: 'Kho xe' },
  { id: 'orders', icon: ClipboardList, label: 'Đơn hàng' },
  { id: 'customers', icon: Users, label: 'Khách hàng' },
  { id: 'reports', icon: TrendingUp, label: 'Báo cáo' }
];

const getStatusClasses = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-emerald-500/20 text-emerald-400';
    case 'Đang xử lý': return 'bg-blue-500/20 text-blue-400';
    case 'Chờ duyệt': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-purple-500/20 text-purple-400'; // Đang giao
  }
};

// --- REUSABLE UI COMPONENTS ---

const ModuleCard = ({ icon, title, description, tag, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-cyan-500 dark:hover:border-emerald-500/50 hover:bg-cyan-50/50 dark:hover:bg-white/10 hover:shadow-cyan-500/20 dark:hover:shadow-emerald-500/20 hover:shadow-2xl dark:hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex gap-4 shadow-lg backdrop-blur-sm"
  >
    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="flex-1">
      <h5 className="text-lg font-bold mb-2 dark:text-white text-gray-900">{title}</h5>
      <p className="text-sm dark:text-gray-400 text-gray-600 mb-3 line-clamp-2">{description}</p>
      <span className="inline-block px-3 py-1.5 text-xs font-bold dark:bg-emerald-500/20 bg-cyan-100 dark:text-emerald-300 text-cyan-800 rounded-full border dark:border-emerald-500/40 border-cyan-400 shadow-md dark:shadow-emerald-500/30 shadow-cyan-500/20">
        {tag}
      </span>
    </div>
  </div>
);

const HeroStats = ({ dashboardData }) => {
  const { dealer, performance } = dashboardData;
  const stats = [
    { value: dealer.vehicles, label: 'Xe có sẵn' },
    { value: dealer.orders, label: 'Đơn hàng tháng này' },
    { value: `${performance.quarterTarget}%`, label: 'Hoàn thành mục tiêu' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="group flex flex-col items-center p-6 dark:bg-gradient-to-br dark:from-emerald-600/20 dark:to-emerald-800/20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl backdrop-blur-xl shadow-xl border dark:border-emerald-500/30 border-cyan-500/30 hover:scale-105 transition-all duration-300 dark:hover:shadow-emerald-500/30 hover:shadow-cyan-500/30 dark:hover:shadow-2xl hover:shadow-2xl">
          <span className="stat-value text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</span>
          <span className="text-sm md:text-base dark:text-gray-200 text-gray-800 font-semibold">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

const QuickActions = ({ navigate }) => {
  // Staff actions - basic operations
  const staffActions = [
    { icon: FileText, label: 'Tạo báo giá', color: 'emerald', path: '/dealer/quotations/create' },
    { icon: Calendar, label: 'Đặt lịch lái thử', color: 'blue', path: '/dealer/test-drives/new' },
    { icon: ShoppingCart, label: 'Tạo đơn hàng', color: 'purple', path: '/dealer/orders/create' },
    { icon: UserPlus, label: 'Thêm khách hàng', color: 'pink', path: '/dealer/customers/new' }
  ];

  // Manager-only actions - advanced operations
  const managerActions = [
    { icon: Settings, label: 'Quản lý nhân viên', color: 'indigo', path: '/dealer/staff' },
    { icon: TrendingUp, label: 'Phân tích doanh thu', color: 'orange', path: '/dealer/reports/sales-performance' },
    { icon: Shield, label: 'Phê duyệt đơn hàng', color: 'red', path: '/dealer/orders' },
    { icon: Package, label: 'Quản lý kho', color: 'teal', path: '/dealer/inventory' }
  ];

  const colorMap = {
    emerald: 'dark:from-emerald-600 dark:to-emerald-700 from-emerald-500 to-emerald-600 dark:hover:shadow-emerald-500/50 hover:shadow-emerald-500/60',
    blue: 'dark:from-blue-600 dark:to-blue-700 from-blue-500 to-blue-600 dark:hover:shadow-blue-500/50 hover:shadow-blue-500/60',
    purple: 'dark:from-purple-600 dark:to-purple-700 from-purple-500 to-purple-600 dark:hover:shadow-purple-500/50 hover:shadow-purple-500/60',
    pink: 'dark:from-pink-600 dark:to-pink-700 from-pink-500 to-pink-600 dark:hover:shadow-pink-500/50 hover:shadow-pink-500/60',
    indigo: 'dark:from-indigo-400 dark:to-indigo-500 from-indigo-300 to-indigo-400 dark:hover:shadow-indigo-300/50 hover:shadow-indigo-300/60',
    orange: 'dark:from-orange-600 dark:to-orange-700 from-orange-500 to-orange-600 dark:hover:shadow-orange-500/50 hover:shadow-orange-500/60',
    red: 'dark:from-red-600 dark:to-red-700 from-red-500 to-red-600 dark:hover:shadow-red-500/50 hover:shadow-red-500/60',
    teal: 'dark:from-teal-600 dark:to-teal-700 from-teal-500 to-teal-600 dark:hover:shadow-teal-500/50 hover:shadow-teal-500/60',
  };

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6 dark:text-white text-gray-900 flex items-center gap-2">
        <Rocket className="w-6 h-6" /> Thao tác nhanh
      </h3>
      
      {/* Staff Actions - Available for all dealer users */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">📋 Thao tác cơ bản</span>
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full">
            Tất cả nhân viên
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {staffActions.map((action, idx) => {
            const IconComponent = action.icon;
            return (
              <button
                key={idx}
                className={`group flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${colorMap[action.color]} rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-white font-bold border border-white/20`}
                onClick={() => navigate(action.path)}
              >
                <IconComponent className="w-10 h-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold text-base drop-shadow-lg">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manager Actions - Only for managers */}
      <ForManager>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">👔 Thao tác quản lý</span>
            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Chỉ Quản lý
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {managerActions.map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={idx}
                  className={`group flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${colorMap[action.color]} rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-white font-bold border border-white/20`}
                  onClick={() => navigate(action.path)}
                >
                  <IconComponent className="w-10 h-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-bold text-base drop-shadow-lg">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ForManager>
    </div>
  );
};

const RecentOrdersList = ({ orders }) => (
  <div className="bg-cyan dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300">
    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <ClipboardList className="w-6 h-6" /> Đơn hàng gần đây
    </h3>
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-cyan-50 dark:hover:bg-emerald-500/10 hover:border-cyan-500/30 dark:hover:border-emerald-500/30 border border-transparent transition-all duration-300 cursor-pointer hover:scale-[1.02]">
          <div className="flex-1">
            <div className="font-bold dark:text-white text-gray-900">{order.customer}</div>
            <div className="text-sm dark:text-gray-400 text-gray-600 font-medium">{order.vehicle}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusClasses(order.status)}`}>
              {order.status}
            </span>
            <span className="text-xs dark:text-gray-500 text-gray-500 font-semibold">{order.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- SECTIONS RENDERING ---

const OverviewSection = ({ dashboardData, navigate }) => {
  const { dealer, performance } = dashboardData;

  // Basic stats - visible to all
  const basicStatsConfig = [
    { icon: Car, title: 'Xe có sẵn', value: dealer.vehicles, change: '+5 xe trong tuần' },
    { icon: ClipboardList, title: 'Đơn hàng', value: dealer.orders, change: '+18% so với tháng trước' },
  ];

  // Manager-only stats - sensitive business data
  const managerStatsConfig = [
    { icon: Users, title: 'Khách hàng', value: dealer.customers, change: '+12 khách mới' },
    { icon: TrendingUp, title: 'Doanh thu', value: `${dealer.revenue} tỷ`, change: '+25% so với tháng trước' }
  ];

  const performanceMetrics = [
    { label: 'Bán hàng tháng này', value: performance.monthlySales },
    { label: 'Mục tiêu quý', value: `${performance.quarterTarget}%` },
    { label: 'Hài lòng khách hàng', value: `${performance.customerSatisfaction}/5` },
    { label: 'Thời gian giao xe', value: `${performance.deliveryTime} ngày` }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Basic Stats - All users */}
        {basicStatsConfig.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="group dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-emerald-500/50 hover:bg-cyan-50/50 dark:hover:bg-white/10 hover:shadow-cyan-500/20 dark:hover:shadow-emerald-500/20 hover:shadow-2xl dark:hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 dark:text-sky-400 text-cyan-600" />
                <span className="text-lg font-bold dark:text-gray-300 text-gray-700">{stat.title}</span>
              </div>
              <div className="stat-value text-4xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-sm font-semibold dark:text-white-400">{stat.change}</div>
            </div>
          );
        })}

        {/* Manager-Only Stats */}
        <ForManager>
          {managerStatsConfig.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="group dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-500/30 dark:border-red-500/30 hover:border-red-500 dark:hover:border-red-500/70 hover:bg-red-50/50 dark:hover:bg-red-500/10 hover:shadow-red-500/30 dark:hover:shadow-red-500/30 hover:shadow-2xl dark:hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg relative">
                <div className="absolute top-2 right-2">
                  <Shield className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 text-red-600 dark:text-red-400" />
                  <span className="text-lg font-bold dark:text-gray-300 text-gray-700">{stat.title}</span>
                </div>
                <div className="stat-value text-4xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-red-600 dark:text-red-400">{stat.change}</div>
              </div>
            );
          })}
        </ForManager>

        {/* Staff sees placeholder for locked stats */}
        <ForStaff>
          {managerStatsConfig.map((stat, idx) => (
            <div key={idx} className="group dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-300">Chỉ Quản lý</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4 blur-sm">
                <Users className="w-8 h-8" />
                <span className="text-lg font-bold">{stat.title}</span>
              </div>
              <div className="stat-value text-4xl font-extrabold mb-2 blur-sm">***</div>
            </div>
          ))}
        </ForStaff>
      </div>

      {/* Performance & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cyan dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUpIcon className="w-6 h-6" /> Hiệu suất kinh doanh
          </h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-rose-500/30 dark:bg-white/5 rounded-xl hover:bg-cyan-100/50 dark:hover:bg-emerald-500/10 transition-all duration-300 border border-transparent hover:border-cyan-500/30 dark:hover:border-emerald-500/30">
                <span className="dark:text-gray-300 text-gray-700 font-semibold">{metric.label}</span>
                <span className="metric-value text-2xl font-extrabold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
        <RecentOrdersList orders={dashboardData.recentOrders} />
      </div>

      <QuickActions navigate={navigate} />

      {/* Feature Modules - Bento Grid Style */}
      <div className="mt-12">
        <h3 className="text-3xl font-extrabold mb-8 bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <Package className="w-8 h-8 dark:text-emerald-400 text-cyan-600" /> Các chức năng chính
        </h3>
        <BentoMenu onModuleClick={(path) => navigate(path)} />
      </div>
    </div>
  );
};

const InventorySection = ({ inventory }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-3xl font-extrabold dark:text-white text-gray-900 flex items-center gap-2">
        <Car className="w-8 h-8" /> Quản lý kho xe
      </h2>
      <button className="px-6 py-3 bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 from-cyan-500 to-blue-600 hover:scale-105 rounded-xl font-bold text-white shadow-lg dark:hover:shadow-emerald-500/50 hover:shadow-cyan-500/50 transition-all duration-300 border border-white/20">
        + Nhập xe mới
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {inventory.map((item, idx) => (
        <div key={idx} className="group bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg hover:scale-105 hover:border-cyan-500 dark:hover:border-emerald-500/50 hover:shadow-cyan-500/20 dark:hover:shadow-emerald-500/20 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300">
          <h4 className="text-2xl font-extrabold mb-6">{item.model}</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 dark:bg-emerald-500/20 bg-emerald-50 rounded-lg border dark:border-emerald-500/30 border-emerald-200 dark:hover:bg-emerald-500/30 hover:bg-emerald-100 transition-colors">
              <span className="text-sm dark:text-gray-300 text-gray-700 font-semibold">Có sẵn</span>
              <span className="metric-value text-2xl font-extrabold dark:text-emerald-400 text-emerald-600">{item.available}</span>
            </div>
            <div className="flex justify-between items-center p-3 dark:bg-yellow-500/20 bg-yellow-50 rounded-lg border dark:border-yellow-500/30 border-yellow-200 dark:hover:bg-yellow-500/30 hover:bg-yellow-100 transition-colors">
              <span className="text-sm dark:text-gray-300 text-gray-700 font-semibold">Đã đặt</span>
              <span className="metric-value text-2xl font-extrabold dark:text-yellow-400 text-yellow-600">{item.reserved}</span>
            </div>
            <div className="flex justify-between items-center p-3 dark:bg-blue-500/20 bg-blue-50 rounded-lg border dark:border-blue-500/30 border-blue-200 dark:hover:bg-blue-500/30 hover:bg-blue-100 transition-colors">
              <span className="text-sm dark:text-gray-300 text-gray-700 font-semibold">Tổng</span>
              <span className="metric-value text-2xl font-extrabold dark:text-blue-400 text-blue-600">{item.total}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlaceholderSection = ({ activeSection, setActiveSection }) => {
  let title = '';
  let IconComponent = Construction;
  
  switch (activeSection) {
    case 'orders': 
      title = 'Quản lý đơn hàng';
      IconComponent = ClipboardList;
      break;
    case 'customers': 
      title = 'Quản lý khách hàng';
      IconComponent = Users;
      break;
    default: 
      title = 'Tính năng đang phát triển';
      IconComponent = Construction;
  }

  return (
    <div className="text-center py-20 dark:bg-gradient-to-br dark:from-gray-900/50 dark:to-gray-800/50 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border-2 border-dashed dark:border-emerald-500/30 border-cyan-300 shadow-lg dark:shadow-emerald-500/20 shadow-cyan-500/20 backdrop-blur-sm transition-all duration-300">
      <div className="mb-4 flex justify-center">
        <Construction className="w-16 h-16 animate-bounce drop-shadow-lg dark:text-emerald-400 text-cyan-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 flex items-center justify-center gap-2">
        <IconComponent className="w-6 h-6" /> {title}
      </h2>
      <p className="dark:text-gray-400 text-gray-600 font-medium">Tính năng đang được phát triển...</p>
      <button 
        className="mt-6 px-8 py-3 dark:bg-emerald-600 dark:hover:bg-emerald-700 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold shadow-lg dark:shadow-emerald-500/50 shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
        onClick={() => setActiveSection('overview')}
      >
        ← Quay lại tổng quan
      </button>
    </div>
  );
};


// --- MAIN COMPONENT ---

const DealerDashboard = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const currentUser = AuthService.getCurrentUser();
  const { dealerRole, isManager, isStaff } = useDealerRole();

  const loadDashboardData = useCallback(async () => {
    try {
      startLoading('Đang tải dữ liệu đại lý...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setDashboardData(MOCK_DASHBOARD_DATA);
    } catch (err) {
      console.error('Dealer Dashboard error:', err);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (!dashboardData) return null; // Global loading handles the visual feedback

  const { dealer, inventory } = dashboardData;

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection dashboardData={dashboardData} navigate={navigate} />;
      case 'inventory':
        return <InventorySection inventory={inventory} />;
      case 'reports':
        // Manager-only section
        if (!isManager) {
          return (
            <div className="text-center py-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border-2 border-red-300 dark:border-red-500/30 shadow-lg">
              <Shield className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-4">
                Quyền truy cập bị hạn chế
              </h2>
              <p className="text-red-600 dark:text-red-300 font-medium mb-6">
                Chỉ Quản lý Đại Lý mới có quyền xem báo cáo
              </p>
              <button 
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => setActiveSection('overview')}
              >
                ← Quay lại tổng quan
              </button>
            </div>
          );
        }
        return <ReportsSection />;
      case 'orders':
      case 'customers':
        return <PlaceholderSection activeSection={activeSection} setActiveSection={setActiveSection} />;
      default:
        return <PlaceholderSection activeSection="overview" setActiveSection={setActiveSection} />;
    }
  };

  return (
    <PageContainer>
      
      {/* Hero Section - Redesigned with theme support */}
      <div className="relative overflow-hidden dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-800/90 dark:to-emerald-900/80 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-3xl p-6 md:p-12 mb-8 shadow-2xl dark:shadow-emerald-500/20 shadow-cyan-500/30 border dark:border-emerald-500/30 border-cyan-400/50 backdrop-blur-xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white dark:bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 dark:bg-emerald-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/30 dark:bg-emerald-500/20 rounded-2xl backdrop-blur-sm border border-white/50 dark:border-emerald-400/30 shadow-lg">
              <span className="text-4xl md:text-5xl">🏢</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl">
                Dealer Dashboard
              </h1>
              <div className="h-1 w-32 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 bg-gradient-to-r from-white to-cyan-200 rounded-full mt-2 shadow-lg"></div>
            </div>
          </div>
          
          <p className="text-base md:text-lg lg:text-xl text-white/95 mb-4 font-medium drop-shadow-md">
            Chào mừng <span className="font-bold text-yellow-200 dark:text-emerald-300 px-2 py-1 bg-white/20 dark:bg-emerald-500/20 rounded-lg backdrop-blur-sm">{currentUser?.name || 'Quản lý'}</span>
            {dealerRole && (
              <span className={`ml-3 px-3 py-1.5 text-sm font-bold rounded-full border shadow-lg ${
                isManager 
                  ? 'bg-red-500/30 text-red-100 border-red-300/50' 
                  : 'bg-blue-500/30 text-blue-100 border-blue-300/50'
              }`}>
                {isManager ? '👔 Quản lý' : '🧑‍💼 Nhân viên'}
              </span>
            )}
          </p>
          
          {/* Shop Information */}
          {currentUser?.dealerShopId && (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-md border border-white/60 dark:border-emerald-400/40 shadow-lg">
                <span className="text-2xl">🏪</span>
                <div className="flex flex-col">
                  <span className="text-sm text-white/80 font-medium">Cửa hàng</span>
                  <span className="text-white font-bold">{currentUser?.shopName || currentUser?.dealerShopId}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-md border border-white/60 dark:border-emerald-400/40 shadow-lg">
                <span className="text-xl">🆔</span>
                <div className="flex flex-col">
                  <span className="text-sm text-white/80 font-medium">Mã cửa hàng</span>
                  <span className="text-white font-bold font-mono">{currentUser?.dealerShopId}</span>
                </div>
              </div>
            </div>
          )}
          
          <HeroStats dashboardData={dashboardData} />
        </div>
      </div>

      {/* Navigation Pills - Enhanced with theme support */}
      <div className="flex flex-wrap gap-3 mb-8">
        {NAV_SECTIONS.map((section) => {
          const IconComponent = section.icon;
          
          // Reports section is manager-only
          if (section.id === 'reports' && !isManager) {
            return (
              <div
                key={section.id}
                className="relative flex items-center gap-2 px-6 py-3 rounded-full font-bold border border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                title="Chỉ Quản lý mới có quyền truy cập"
              >
                <Shield className="w-4 h-4" />
                <IconComponent className="w-5 h-5" />
                <span>{section.label}</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  🔒
                </span>
              </div>
            );
          }
          
          return (
            <button
              key={section.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border ${
                activeSection === section.id
                  ? 'dark:bg-gradient-to-r dark:from-fuchsia-400 dark:to-fuchsia-500 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg dark:shadow-emerald-500/50 shadow-cyan-500/50 scale-105 dark:border-emerald-400/50 border-cyan-400/50'
                  : 'dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-white/10 border-gray-300 dark:border-white/10 hover:scale-105 hover:border-cyan-500/50 dark:hover:border-emerald-500/30 hover:shadow-cyan-500/20 dark:hover:shadow-emerald-500/20 shadow-md'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <IconComponent className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Section */}
      {renderActiveSection()}

    </PageContainer>
  );
};

export default DealerDashboard;