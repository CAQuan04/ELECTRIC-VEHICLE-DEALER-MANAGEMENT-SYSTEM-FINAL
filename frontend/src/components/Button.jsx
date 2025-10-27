import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false }) => {
  const variantClass = variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500';
  return (
    <button 
      className={`px-4 py-2 rounded-lg text-white ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
