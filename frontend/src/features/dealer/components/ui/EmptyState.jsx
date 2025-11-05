import React from 'react';
import Button from './Button';

/**
 * EmptyState - Modern component hiển thị khi không có dữ liệu
 * @param {ReactNode} icon - Icon element (Lucide icon hoặc emoji)
 * @param {string} title - Tiêu đề
 * @param {string} description - Mô tả (thay vì message)
 * @param {ReactNode|object} action - Button element hoặc { label, onClick } cho action button (optional)
 */
const EmptyState = ({ icon = '📭', title, description, message, action, className = '' }) => {
  return (
    <div className={`text-center py-24 mt-8 ${className}`}>
      <div className="inline-block mb-8 animate-bounce">
        {typeof icon === 'string' ? (
          <div className="text-8xl drop-shadow-2xl">{icon}</div>
        ) : (
          <div className="text-gray-400 dark:text-gray-600">{icon}</div>
        )}
      </div>
      
      <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">
        {description || message}
      </p>
      
      {action && (
        <div className="flex justify-center">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button variant="gradient" onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;