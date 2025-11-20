import React from 'react';
import { ClipboardList } from 'lucide-react';

const getStatusClasses = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-emerald-500/20 text-emerald-400';
    case 'Đang xử lý': return 'bg-blue-500/20 text-blue-400';
    case 'Chờ duyệt': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-purple-500/20 text-purple-400'; // Đang giao
  }
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

export default RecentOrdersList;
