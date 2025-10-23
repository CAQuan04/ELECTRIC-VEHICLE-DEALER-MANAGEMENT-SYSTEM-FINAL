import React from 'react';

/**
 * PageContainer - Container chính cho tất cả các trang dealer
 * Sử dụng CSS variables từ theme-variables.css
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      theme-page min-h-screen p-4 md:p-8
      ${className}
    `}>
      {children}
    </div>
  );
};

export default PageContainer;
