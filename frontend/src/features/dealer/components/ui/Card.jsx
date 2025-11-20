import React from 'react';

/**
 * Card - Modern glassmorphism card component
 * @param {React.ReactNode} children - Nội dung card
 * @param {boolean} hover - Enable hover effect
 * @param {string} className - Additional classes
 */
const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90
      backdrop-blur-xl rounded-3xl p-8 
      border border-gray-200 dark:border-gray-700/50
      shadow-xl dark:shadow-emerald-500/5
      transition-all duration-500
      ${hover ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:border-cyan-400 dark:hover:border-emerald-500' : ''}
      ${className}
    `}>
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-emerald-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;