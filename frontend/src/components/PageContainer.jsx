import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <div className="container mx-auto p-6">
      {children}
    </div>
  );
};

export default PageContainer;
