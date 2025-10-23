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
    up: 'dark:text-emerald-400 text-emerald-600',
    down: 'dark:text-red-400 text-red-600',
    neutral: 'dark:text-gray-400 text-gray-600'
  };

  return (
    <div className={`theme-card group rounded-2xl p-6 border hover:scale-[1.02] ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="text-lg font-medium theme-text-secondary">{title}</span>
      </div>
      <div className="theme-text-primary text-4xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm font-semibold ${trendColors[trend]}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
