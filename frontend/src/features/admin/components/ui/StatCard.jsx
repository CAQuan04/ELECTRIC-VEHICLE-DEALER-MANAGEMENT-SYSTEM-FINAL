import React from 'react';

/**
 * StatCard - Card hiển thị số liệu thống kê
 * @param {string} icon - Emoji icon
 * @param {string} title - Tiêu đề
 * @param {string|number} value - Giá trị
 * @param {string} change - Thay đổi (optional)
 * @param {string} trend - up, down, neutral (optional)
 */
const StatCard = ({ icon, title, value, change, trend = 'up', className = '' }) => {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <div className={`group dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 dark:border-white/10 border-gray-200 border dark:hover:border-emerald-500/50 dark:hover:shadow-emerald-500/20 dark:hover:shadow-2xl hover:border-cyan-500 hover:shadow-cyan-500/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="text-lg font-medium dark:text-gray-300 text-gray-600">{title}</span>
      </div>
      <div className="stat-value text-4xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm font-semibold ${trendColors[trend]}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
