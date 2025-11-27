import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-black/20 transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export default Card;