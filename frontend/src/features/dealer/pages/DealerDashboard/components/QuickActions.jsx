import React from 'react';
import {
  FileText,
  Calendar,
  ShoppingCart,
  UserPlus,
  Settings,
  TrendingUp,
  Shield,
  Package,
  Rocket
} from 'lucide-react';
import { ForManager } from '../../../components/auth/DealerRoleGuard';

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

export default QuickActions;
