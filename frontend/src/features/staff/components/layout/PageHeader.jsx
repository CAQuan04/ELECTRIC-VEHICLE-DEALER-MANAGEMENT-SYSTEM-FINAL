import React from 'react';

/**
 * PageHeader - Header component cho pages
 * @param {string} title - Tiêu đề trang
 * @param {string} subtitle - Mô tả ngắn (optional)
 * @param {React.ReactNode} actions - Các button/actions bên phải (optional)
 */
const PageHeader = ({ title, subtitle, actions, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {title}
        </h1>
        {subtitle && <p className="dark:text-gray-400 text-gray-600 text-lg">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex gap-3 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
