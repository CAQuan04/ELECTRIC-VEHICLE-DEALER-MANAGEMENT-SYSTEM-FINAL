import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@utils';
import { usePageLoading } from '@modules/loading';
import '@modules/loading/GlobalLoading.css';
import InventoryManagement from "./InventoryManagement";


// Import PageContainer for theme support
import PageContainer from '../components/layout/PageContainer';
import ReportsSection from '../components/ReportsSection';

// --- CONFIGURATION DATA (Move to a separate config file if the app grows) ---

// Mock data structure - Kept here for context, but should ideally be fetched from API
const MOCK_DASHBOARD_DATA = {
  dealer: { vehicles: 47, orders: 13, customers: 156, revenue: 11.3 },
  performance: { monthlySales: 13, quarterTarget: 85, customerSatisfaction: 4.7, deliveryTime: 5 },
  recentOrders: [
    { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Tesla Model 3', status: 'Đang xử lý', date: '2 giờ trước' },
    { id: 2, customer: 'Trần Thị B', vehicle: 'Tesla Model Y', status: 'Hoàn thành', date: '1 ngày trước' },
    { id: 3, customer: 'Lê Văn C', vehicle: 'Tesla Model S', status: 'Chờ duyệt', date: '2 ngày trước' },
    { id: 4, customer: 'Phạm Thị D', vehicle: 'Tesla Model X', status: 'Đang giao', date: '3 ngày trước' }
  ],
  inventory: [
    { model: 'Model 3', available: 12, reserved: 3, total: 15 },
    { model: 'Model Y', available: 8, reserved: 2, total: 10 },
    { model: 'Model S', available: 5, reserved: 1, total: 6 },
    { model: 'Model X', available: 3, reserved: 0, total: 3 }
  ]
};

const NAV_SECTIONS = [
  { id: 'overview', icon: '📊', label: 'Tổng quan' },
  { id: 'inventory', icon: '🚗', label: 'Kho xe' },
  { id: 'stock', icon: '🏭', label: 'Tồn kho & Điều phối' }, // ✅ Thêm dòng này
  { id: 'orders', icon: '📋', label: 'Đơn hàng' },
  { id: 'customers', icon: '👥', label: 'Khách hàng' },
  { id: 'reports', icon: '📈', label: 'Báo cáo' }
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
    className="group cursor-pointer dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 dark:hover:border-emerald-500/50 dark:hover:bg-white/10 dark:hover:shadow-emerald-500/20 dark:hover:shadow-2xl hover:border-cyan-500 hover:bg-cyan-50/50 hover:shadow-cyan-500/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex gap-4 shadow-lg backdrop-blur-sm"
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
  const actions = [
    { icon: '📋', label: 'Tạo báo giá', color: 'emerald', path: '/dealer/quotations/create' },
    { icon: '📅', label: 'Đặt lịch lái thử', color: 'blue', path: '/dealer/test-drives/new' },
    { icon: '🛒', label: 'Tạo đơn hàng', color: 'purple', path: '/dealer/orders/create' },
    { icon: '👤', label: 'Thêm khách hàng', color: 'pink', path: '/dealer/customers/new' }
  ];

  const colorMap = {
    emerald: 'dark:from-emerald-600 dark:to-emerald-700 from-emerald-500 to-emerald-600 dark:hover:shadow-emerald-500/50 hover:shadow-emerald-500/60',
    blue: 'dark:from-blue-600 dark:to-blue-700 from-blue-500 to-blue-600 dark:hover:shadow-blue-500/50 hover:shadow-blue-500/60',
    purple: 'dark:from-purple-600 dark:to-purple-700 from-purple-500 to-purple-600 dark:hover:shadow-purple-500/50 hover:shadow-purple-500/60',
    pink: 'dark:from-pink-600 dark:to-pink-700 from-pink-500 to-pink-600 dark:hover:shadow-pink-500/50 hover:shadow-pink-500/60',
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 dark:text-white text-gray-900">🚀 Thao tác nhanh</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`group flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${colorMap[action.color]} rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-white font-bold border border-white/20`}
            onClick={() => navigate(action.path)}
          >
            <span className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{action.icon}</span>
            <span className="font-bold text-base drop-shadow-lg">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const RecentOrdersList = ({ orders }) => (
  <div className="dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 border dark:border-white/10 border-gray-200 shadow-lg transition-all duration-300">
    <h3 className="text-2xl font-bold mb-6">📋 Đơn hàng gần đây</h3>
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="group flex items-center justify-between p-4 dark:bg-white/5 bg-gray-50 rounded-xl dark:hover:bg-emerald-500/10 hover:bg-cyan-50 dark:hover:border-emerald-500/30 hover:border-cyan-500/30 border border-transparent transition-all duration-300 cursor-pointer hover:scale-[1.02]">
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

  const overviewStatsConfig = [
    { icon: '🚗', title: 'Xe có sẵn', value: dealer.vehicles, change: '+5 xe trong tuần' },
    { icon: '📋', title: 'Đơn hàng', value: dealer.orders, change: '+18% so với tháng trước' },
    { icon: '👥', title: 'Khách hàng', value: dealer.customers, change: '+12 khách mới' },
    { icon: '💰', title: 'Doanh thu', value: `${dealer.revenue} tỷ`, change: '+25% so với tháng trước' }
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
        {overviewStatsConfig.map((stat, idx) => (
          <div key={idx} className="group dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 border dark:border-white/10 border-gray-200 dark:hover:border-emerald-500/50 dark:hover:bg-white/10 dark:hover:shadow-emerald-500/20 dark:hover:shadow-2xl hover:border-cyan-500 hover:bg-cyan-50/50 hover:shadow-cyan-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
              <span className="text-lg font-bold dark:text-gray-300 text-gray-700">{stat.title}</span>
            </div>
            <div className="stat-value text-4xl font-extrabold mb-2">{stat.value}</div>
            <div className="text-sm font-semibold dark:text-emerald-400 text-cyan-600">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Performance & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 border dark:border-white/10 border-gray-200 shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold mb-6">📈 Hiệu suất kinh doanh</h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="group flex justify-between items-center p-4 dark:bg-white/5 bg-gradient-to-r from-gray-50 to-cyan-50/30 rounded-xl dark:hover:bg-emerald-500/10 hover:bg-cyan-100/50 transition-all duration-300 border border-transparent dark:hover:border-emerald-500/30 hover:border-cyan-500/30">
                <span className="dark:text-gray-300 text-gray-700 font-semibold">{metric.label}</span>
                <span className="metric-value text-2xl font-extrabold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
        <RecentOrdersList orders={dashboardData.recentOrders} />
      </div>

      <QuickActions navigate={navigate} />

      {/* Feature Modules */}
      <div className="mt-12">
        <h3 className="text-3xl font-extrabold mb-8 bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 from-cyan-600 to-blue-600 bg-clip-text text-transparent">📦 Các chức năng chính</h3>

        {/* Quản lý thông tin xe */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold mb-6 flex items-center gap-3 border-l-4 dark:border-emerald-500 border-cyan-500 pl-4 dark:bg-emerald-500/10 bg-cyan-50 py-3 rounded-r-xl dark:text-white text-gray-900">
            🚗 Quản lý thông tin xe
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModuleCard icon="📋" title="Danh mục xe" description="Xem danh sách xe, cấu hình, giá bán" tag="UC 1.a.1" onClick={() => navigate('/dealer/vehicles')} />
            <ModuleCard icon="⚖️" title="So sánh xe" description="So sánh mẫu xe, tính năng" tag="UC 1.a.2" onClick={() => navigate('/dealer/vehicles/compare')} />
          </div>
        </div>

        {/* Quản lý bán hàng */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold mb-6 flex items-center gap-3 border-l-4 dark:border-purple-500 border-purple-600 pl-4 dark:bg-purple-500/10 bg-purple-50 py-3 rounded-r-xl dark:text-white text-gray-900">
            💼 Quản lý bán hàng
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModuleCard icon="💰" title="Quản lý báo giá" description="Tạo và quản lý báo giá cho khách hàng" tag="UC 1.b.1" onClick={() => navigate('/dealer/quotations')} />
            <ModuleCard icon="📄" title="Đơn hàng & Hợp đồng" description="Tạo đơn hàng và sinh hợp đồng" tag="UC 1.b.2" onClick={() => navigate('/dealer/orders')} />
            <ModuleCard icon="🎁" title="Khuyến mãi" description="Quản lý và áp dụng khuyến mãi" tag="UC 1.b.3" onClick={() => navigate('/dealer/promotions')} />
            <ModuleCard icon="🏭" title="Đặt xe từ hãng" description="Tạo yêu cầu mua hàng từ EVM" tag="UC 1.b.4" onClick={() => navigate('/dealer/purchase-requests')} />
            <ModuleCard icon="🚚" title="Theo dõi giao xe" description="Lên lịch và theo dõi giao xe" tag="UC 1.b.5" onClick={() => navigate('/dealer/deliveries')} />
            <ModuleCard icon="💳" title="Quản lý thanh toán" description="Xử lý thanh toán tiền mặt/trả góp" tag="UC 1.b.6" onClick={() => navigate('/dealer/payments')} />
          </div>
        </div>

        {/* Quản lý khách hàng */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold mb-6 flex items-center gap-3 border-l-4 dark:border-blue-500 border-blue-600 pl-4 dark:bg-blue-500/10 bg-blue-50 py-3 rounded-r-xl dark:text-white text-gray-900">
            👥 Quản lý khách hàng
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModuleCard icon="📇" title="Hồ sơ khách hàng" description="Tạo và quản lý thông tin khách hàng" tag="UC 1.c.1" onClick={() => navigate('/dealer/customers')} />
            <ModuleCard icon="🚙" title="Lịch hẹn lái thử" description="Đặt lịch và quản lý lái thử xe" tag="UC 1.c.2" onClick={() => navigate('/dealer/test-drives')} />
            <ModuleCard icon="💬" title="Phản hồi & Khiếu nại" description="Ghi nhận và xử lý phản hồi khách hàng" tag="UC 1.c.3" onClick={() => navigate('/dealer/feedback-complaints')} />
          </div>
        </div>

        {/* Báo cáo & Phân tích */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold mb-6 flex items-center gap-3 border-l-4 dark:border-pink-500 border-pink-600 pl-4 dark:bg-pink-500/10 bg-pink-50 py-3 rounded-r-xl dark:text-white text-gray-900">
            📊 Báo cáo & Phân tích
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModuleCard icon="📈" title="Doanh số nhân viên" description="Báo cáo doanh số theo nhân viên" tag="UC 1.d.1" onClick={() => navigate('/dealer/reports/sales-performance')} />
            <ModuleCard icon="💸" title="Công nợ khách hàng" description="Báo cáo công nợ và aging" tag="UC 1.d.2 (AR)" onClick={() => navigate('/dealer/reports/customer-debt')} />
            <ModuleCard icon="🏢" title="Công nợ nhà cung cấp" description="Báo cáo công nợ hãng" tag="UC 1.d.2 (AP)" onClick={() => navigate('/dealer/reports/supplier-debt')} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InventorySection = ({ inventory }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">🚗 Quản lý kho xe</h2>
      <button className="px-6 py-3 bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 from-cyan-500 to-blue-600 hover:scale-105 rounded-xl font-bold text-white shadow-lg dark:hover:shadow-emerald-500/50 hover:shadow-cyan-500/50 transition-all duration-300 border border-white/20">
        + Nhập xe mới
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {inventory.map((item, idx) => (
        <div key={idx} className="group dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 border dark:border-white/10 border-gray-200 shadow-lg hover:scale-105 dark:hover:border-emerald-500/50 hover:border-cyan-500 dark:hover:shadow-emerald-500/20 hover:shadow-cyan-500/20 dark:hover:shadow-2xl hover:shadow-2xl transition-all duration-300">
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
  switch (activeSection) {
    case 'orders': title = '📋 Quản lý đơn hàng'; break;
    case 'customers': title = '👥 Quản lý khách hàng'; break;
    default: title = 'Tính năng đang phát triển';
  }

  return (
    <div className="text-center py-20 dark:bg-gradient-to-br dark:from-gray-900/50 dark:to-gray-800/50 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border-2 border-dashed dark:border-emerald-500/30 border-cyan-300 shadow-lg dark:shadow-emerald-500/20 shadow-cyan-500/20 backdrop-blur-sm transition-all duration-300">
      <div className="text-6xl mb-4 animate-bounce drop-shadow-lg">🚧</div>
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">{title}</h2>
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
    case 'stock':
      return <InventoryManagement />; // ✅ Thêm dòng này
    case 'reports':
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
          <div className="absolute top-0 left-0 w-72 h-72 dark:bg-emerald-500 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 dark:bg-emerald-600 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 dark:bg-emerald-500/20 bg-white/30 rounded-2xl backdrop-blur-sm border dark:border-emerald-400/30 border-white/50 shadow-lg">
              <span className="text-4xl md:text-5xl">🏢</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl">
                Dealer Dashboard
              </h1>
              <div className="h-1 w-32 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-600 bg-gradient-to-r from-white to-cyan-200 rounded-full mt-2 shadow-lg"></div>
            </div>
          </div>
          
          <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 font-medium drop-shadow-md">
            Chào mừng <span className="font-bold dark:text-emerald-300 text-yellow-200 px-2 py-1 dark:bg-emerald-500/20 bg-white/20 rounded-lg backdrop-blur-sm">{currentUser?.name || 'Quản lý'}</span> - Quản lý kinh doanh và bán hàng
          </p>
          
          <HeroStats dashboardData={dashboardData} />
        </div>
      </div>

      {/* Navigation Pills - Enhanced with theme support */}
      <div className="flex flex-wrap gap-3 mb-8">
        {NAV_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border ${
              activeSection === section.id
                ? 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg dark:shadow-emerald-500/50 shadow-cyan-500/50 scale-105 dark:border-emerald-400/50 border-cyan-400/50'
                : 'dark:bg-white/5 bg-white dark:text-gray-300 text-gray-700 dark:hover:bg-white/10 hover:bg-cyan-50 dark:border-white/10 border-gray-300 hover:scale-105 dark:hover:border-emerald-500/30 hover:border-cyan-500/50 dark:hover:shadow-emerald-500/20 hover:shadow-cyan-500/20 shadow-md'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="text-xl">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Content Section */}
      {renderActiveSection()}

    </PageContainer>
    
  );
};

export default DealerDashboard;