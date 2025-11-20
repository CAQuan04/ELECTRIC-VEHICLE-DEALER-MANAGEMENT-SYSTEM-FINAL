import React from 'react';

/**
 * PageContainer - Container chính cho tất cả các trang dealer
 * Sử dụng CSS variables từ theme-variables.css
 * Full-width layout để tận dụng toàn bộ không gian màn hình
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 w-full bg-gray-50 dark:bg-gray-900 min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
