import React from 'react';

const Badge = ({ variant = 'info', children, className = '' }) => {
  const variantClasses = {
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-600/10 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-500/20 dark:to-yellow-600/10 text-yellow-800 dark:text-yellow-300 border-yellow-400 dark:border-yellow-500/40 shadow-lg shadow-yellow-500/30 dark:shadow-yellow-500/20',
    danger: 'bg-gradient-to-r from-rose-100 to-rose-50 dark:from-rose-500/20 dark:to-rose-600/10 text-rose-800 dark:text-rose-300 border-rose-400 dark:border-rose-500/40 shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20',
    info: 'bg-gradient-to-r from-cyan-100 to-blue-50 dark:from-blue-500/20 dark:to-cyan-600/10 text-cyan-800 dark:text-cyan-300 border-cyan-400 dark:border-blue-500/40 shadow-lg shadow-cyan-500/30 dark:shadow-blue-500/20',
  };
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${variantClasses[variant] || variantClasses.info} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;