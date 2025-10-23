import React from 'react';

/**
 * Card - Glassmorphism card component with centralized theme
 * @param {React.ReactNode} children - Nội dung card
 * @param {boolean} hover - Enable hover effect
 * @param {string} className - Additional classes
 */
const Card = ({ children, hover = false, className = '' }) => {
  return (
    <div className={`
      theme-card rounded-2xl p-6 border backdrop-blur-sm
      ${hover ? 'cursor-pointer hover:scale-[1.02]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
