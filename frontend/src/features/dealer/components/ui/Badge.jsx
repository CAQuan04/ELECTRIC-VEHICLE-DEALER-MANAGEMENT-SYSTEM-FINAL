import React from 'react';

/**
 * Badge - Modern status badge component with enhanced dark mode
 * @param {string} variant - success, warning, info, danger, purple, gray
 * @param {React.ReactNode} children - Nội dung badge
 */
const Badge = ({ variant = 'info', children, className = '' }) => {
  const variantClasses = {
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-600/10 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-500/20 dark:to-yellow-600/10 text-yellow-800 dark:text-yellow-300 border-yellow-400 dark:border-yellow-500/40 shadow-lg shadow-yellow-500/30 dark:shadow-yellow-500/20',
    info: 'bg-gradient-to-r from-cyan-100 to-blue-50 dark:from-blue-500/20 dark:to-cyan-600/10 text-cyan-800 dark:text-cyan-300 border-cyan-400 dark:border-blue-500/40 shadow-lg shadow-cyan-500/30 dark:shadow-blue-500/20',
    danger: 'bg-gradient-to-r from-red-100 to-red-50 dark:from-red-500/20 dark:to-red-600/10 text-red-800 dark:text-red-300 border-red-400 dark:border-red-500/40 shadow-lg shadow-red-500/30 dark:shadow-red-500/20',
    purple: 'bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-600/10 text-purple-800 dark:text-purple-300 border-purple-400 dark:border-purple-500/40 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20',
    gray: 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-500/20 dark:to-gray-600/10 text-gray-800 dark:text-gray-300 border-gray-400 dark:border-gray-500/40 shadow-lg shadow-gray-500/30 dark:shadow-gray-500/20'
  };
  
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;