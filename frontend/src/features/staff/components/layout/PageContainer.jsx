import React from 'react';

const PageContainer = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8 font-sans transition-colors duration-300">
    {children}
  </div>
);

export default PageContainer;