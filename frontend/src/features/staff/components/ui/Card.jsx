import React from 'react';

/**
 * Card - Glassmorphism card component with theme support
 * @param {React.ReactNode} children - Nội dung card
 * @param {boolean} hover - Enable hover effect
 * @param {string} className - Additional classes
 */
const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div className={`
      dark:bg-white/5 bg-white backdrop-blur-sm rounded-2xl p-6 
      dark:border-white/10 border-gray-200 border
      shadow-lg dark:shadow-none
      dark:text-white text-gray-900
      transition-all duration-300
      ${hover ? 'group dark:hover:border-emerald-500/50 dark:hover:bg-white/10 dark:hover:shadow-emerald-500/20 dark:hover:shadow-2xl hover:border-cyan-500 hover:shadow-cyan-500/20 hover:shadow-2xl hover:scale-[1.02]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
