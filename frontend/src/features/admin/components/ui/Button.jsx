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
    primary: 'dark:bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-500 dark:hover:to-emerald-600 dark:shadow-emerald-500/30 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 font-bold',
    secondary: 'dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 dark:hover:border-emerald-500/50 bg-gray-100 hover:bg-cyan-50 text-gray-900 border border-gray-300 hover:border-cyan-500 hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/30 hover:shadow-2xl hover:scale-105 font-bold',
    ghost: 'dark:bg-transparent dark:hover:bg-white/10 dark:text-white dark:hover:text-emerald-400 bg-transparent hover:bg-cyan-50 text-gray-900 hover:text-cyan-600',
    gradient: 'dark:bg-gradient-to-r dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800 dark:hover:from-emerald-500 dark:hover:via-emerald-600 dark:hover:to-emerald-700 bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 font-bold'
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
