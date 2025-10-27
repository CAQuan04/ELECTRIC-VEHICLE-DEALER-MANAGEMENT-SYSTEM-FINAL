import React from 'react';

/**
 * Badge - Status badge component
 * @param {string} variant - success, warning, info, danger, purple
 * @param {React.ReactNode} children - Nội dung badge
 */
const Badge = ({ variant = 'info', children, className = '' }) => {
  const variantClasses = {
    success: 'dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 dark:shadow-emerald-500/30 bg-emerald-100 text-emerald-800 border-emerald-400 shadow-emerald-500/20 font-semibold',
    warning: 'dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/40 dark:shadow-yellow-500/30 bg-yellow-100 text-yellow-800 border-yellow-400 shadow-yellow-500/20 font-semibold',
    info: 'dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 dark:shadow-blue-500/30 bg-cyan-100 text-cyan-800 border-cyan-400 shadow-cyan-500/20 font-semibold',
    danger: 'dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40 dark:shadow-red-500/30 bg-red-100 text-red-800 border-red-400 shadow-red-500/20 font-semibold',
    purple: 'dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40 dark:shadow-purple-500/30 bg-purple-100 text-purple-800 border-purple-400 shadow-purple-500/20 font-semibold',
    gray: 'dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/40 bg-gray-100 text-gray-800 border-gray-400 font-semibold'
  };
  
  return (
    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border shadow-md ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
