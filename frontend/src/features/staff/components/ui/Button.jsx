import React from 'react';

const Button = ({ variant = 'primary', size = 'md', children, icon, className = '', onClick, ...props }) => {
  const baseClasses = 'font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer';
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 text-white shadow-lg shadow-cyan-500/30 dark:shadow-blue-500/30 hover:shadow-xl hover:scale-105 active:scale-95 border border-transparent',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-cyan-600 dark:hover:text-cyan-400 active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:scale-105 active:scale-95 border border-transparent',
  };
  const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size]} ${className}`} onClick={onClick} {...props}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;