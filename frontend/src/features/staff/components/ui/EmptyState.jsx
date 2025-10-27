import React from 'react';
import Button from './Button';

/**
 * EmptyState - Component hiển thị khi không có dữ liệu
 * @param {string} icon - Emoji icon
 * @param {string} title - Tiêu đề
 * @param {string} message - Thông điệp
 * @param {object} action - { label, onClick } cho action button (optional)
 */
const EmptyState = ({ icon = '📭', title, message, action, className = '' }) => {
  return (
    <div className={`text-center py-20 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">{title}</h3>
      <p className="dark:text-gray-400 text-gray-600 mb-6">{message}</p>
      {action && (
        <Button variant="gradient" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
