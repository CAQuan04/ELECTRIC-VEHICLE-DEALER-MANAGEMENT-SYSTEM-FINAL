import React from 'react';
import {
  Car,
  ClipboardList,
  Users,
  TrendingUp,
  TrendingUpIcon,
  Package,
  Rocket,
  Shield
} from 'lucide-react';
import { ForManager, ForStaff } from '../../../components/auth/DealerRoleGuard';
import QuickActions from '../components/QuickActions';
import RecentOrdersList from '../components/RecentOrdersList';
import BentoMenu from '../../../components/BentoMenu';

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

export default OverviewSection;
