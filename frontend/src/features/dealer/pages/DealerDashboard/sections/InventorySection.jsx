import React from 'react';
import { Car } from 'lucide-react';

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

export default InventorySection;
