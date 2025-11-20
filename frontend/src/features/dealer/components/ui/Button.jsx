import React from 'react';

/**
 * Button - Modern styled button với variants
 * @param {string} variant - primary, secondary, danger, ghost, outline, gradient
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
  const baseClasses = 'font-bold rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group';
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600 
      dark:from-rose-500 dark:to-cyan-600 
      hover:from-cyan-600 hover:to-blue-700 
      dark:hover:from-rose-600 dark:hover:to-cyan-700
      text-white shadow-xl hover:shadow-2xl 
      hover:scale-105 active:scale-95
      shadow-cyan-500/30 dark:shadow-emerald-500/30
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    secondary: `
      bg-gray-100 dark:bg-gray-700/50 
      hover:bg-gray-200 dark:hover:bg-gray-600/50
      text-gray-800 dark:text-gray-200
      border-2 border-gray-300 dark:border-gray-600
      hover:border-cyan-400 dark:hover:border-cyan-500
      shadow-lg hover:shadow-xl
      hover:scale-105 active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      hover:from-red-700 hover:to-red-800
      text-white shadow-xl hover:shadow-2xl 
      hover:scale-105 active:scale-95
      shadow-red-500/30
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    ghost: `
      bg-transparent 
      hover:bg-cyan-50 dark:hover:bg-emerald-500/10
      text-gray-700 dark:text-gray-300
      hover:text-cyan-600 dark:hover:text-cyan-400
      hover:scale-105 active:scale-95
    `,
    outline: `
      bg-transparent 
      border-2 border-gray-300 dark:border-gray-600
      hover:border-cyan-500 dark:hover:border-cyan-500
      text-gray-700 dark:text-gray-300
      hover:text-cyan-600 dark:hover:text-cyan-400
      hover:bg-cyan-50 dark:hover:bg-cyan-500/10
      shadow-lg hover:shadow-xl
      hover:scale-105 active:scale-95
    `,
    gradient: `
      bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600
      dark:from-slate-500 dark:via-cyan-700 dark:to-sky-800
      hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700
      dark:hover:from-emerald-600 dark:hover:via-emerald-700 dark:hover:to-green-700
      text-white shadow-xl hover:shadow-2xl
      hover:scale-105 active:scale-95
      shadow-purple-500/30 dark:shadow-emerald-500/30
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `
  };
  
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;