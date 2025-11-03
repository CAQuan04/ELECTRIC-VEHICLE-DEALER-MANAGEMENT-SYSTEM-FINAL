import React from 'react';
import Button from './Button';

/**
 * EmptyState - Modern component hiển thị khi không có dữ liệu
 * @param {string} icon - Emoji icon
 * @param {string} title - Tiêu đề
 * @param {string} message - Thông điệp
 * @param {object} action - { label, onClick } cho action button (optional)
 */
const EmptyState = ({ icon = '📭', title, message, action, className = '' }) => {
  return (
    <div className={`text-center py-24 mt-8 ${className}`}>
      <div className="inline-block mb-8 animate-bounce">
        <div className="text-8xl drop-shadow-2xl">{icon}</div>
      </div>
      
      <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">
        {message}
      </p>
      
      {action && (
        <Button variant="gradient" onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;