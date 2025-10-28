import React from 'react';

/**
 * PageContainer - Container chính cho tất cả các trang dealer
 * Cung cấp padding responsive
 * Note: Background gradient được handle bởi AppLayout
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      min-h-screen p-4 md:p-8 transition-colors duration-300
      dark:text-white text-gray-900
      ${className}
    `}>
      {children}
    </div>
  );
};

export default PageContainer;
