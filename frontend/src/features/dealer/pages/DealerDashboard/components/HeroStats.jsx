import React from 'react';

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

export default HeroStats;
