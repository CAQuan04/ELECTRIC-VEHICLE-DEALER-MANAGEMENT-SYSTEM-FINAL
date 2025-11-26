import React from 'react';

const EmptyState = ({ icon = '📭', title, description, action, className = '' }) => (
  <div className={`text-center py-16 ${className}`}>
    <div className="inline-block mb-6 animate-bounce text-6xl opacity-80">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">{description}</p>
    {action && <div className="flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;