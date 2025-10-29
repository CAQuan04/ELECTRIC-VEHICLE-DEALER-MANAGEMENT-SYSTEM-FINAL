import React from 'react';

/**
 * StatCard - Modern card hiển thị số liệu thống kê
 * @param {string} icon - Emoji icon
 * @param {string} title - Tiêu đề
 * @param {string|number} value - Giá trị
 * @param {string} change - Thay đổi (optional)
 * @param {string} trend - up, down, neutral (optional)
 */
const StatCard = ({ icon, title, value, change, trend = 'up', className = '' }) => {
  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <div className={`
      group relative overflow-hidden
      bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90
      backdrop-blur-xl rounded-3xl p-8 
      border border-gray-200 dark:border-gray-700/50
      shadow-xl dark:shadow-emerald-500/5
      transition-all duration-500
      hover:scale-105 hover:shadow-2xl
      hover:border-cyan-400 dark:hover:border-emerald-500
      ${className}
    `}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-emerald-500/5 dark:to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-emerald-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            {icon}
          </span>
          <span className="text-lg font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </span>
        </div>
        
        {/* Value */}
        <div className="mb-4">
          <div className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
            {value}
          </div>
        </div>
        
        {/* Change indicator */}
        {change && (
          <div className={`flex items-center gap-2 text-sm font-bold ${trendColors[trend]}`}>
            <span className="text-xl">{trendIcons[trend]}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;