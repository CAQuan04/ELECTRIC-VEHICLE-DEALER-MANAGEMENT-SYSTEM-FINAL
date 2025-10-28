import React from 'react';

/**
 * Button - Styled button với variants
 * @param {string} variant - primary, secondary, danger, ghost
 * @param {string} size - sm, md, lg
 * @param {React.ReactNode} children - Nội dung button
 * @param {React.ReactNode} icon - Icon (optional)
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'dark:bg-gradient-to-r dark:from-cyan-600 dark:to-rose-400 dark:hover:from-emerald-500 dark:hover:to-emerald-600 dark:shadow-emerald-500/30 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 font-bold',
    secondary: 'dark:bg-rose-600 dark:hover:bg-slate-200 dark:text-gray-200 dark:border-white/20 dark:hover:border-emerald-500/50 bg-sky-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 hover:border-cyan-400 hover:shadow-lg',
    danger: 'dark:bg-gradient-to-r dark:from-red-600 dark:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/30 hover:shadow-2xl hover:scale-105 font-bold',
    ghost: 'dark:bg-transparent dark:hover:bg-white/10 dark:text-gray-200 dark:hover:text-emerald-400 bg-transparent hover:bg-cyan-50 text-gray-700 hover:text-cyan-600',
    outline: 'dark:bg-transparent dark:border-gray-600 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:border-emerald-500 dark:hover:text-emerald-400 bg-transparent border border-gray-300 text-gray-700 hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-700',
    gradient: 'dark:bg-gradient-to-r dark:from-sky-600 dark:via-emerald-700 dark:to-green-700 dark:hover:from-emerald-500 dark:hover:via-emerald-600 dark:hover:to-green-600 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 font-bold'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
