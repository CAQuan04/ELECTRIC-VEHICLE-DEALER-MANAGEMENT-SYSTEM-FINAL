import React from 'react';
import PropTypes from 'prop-types';

const ActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  icon, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'action-button';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const loadingClass = loading ? `${baseClass}--loading` : '';
  const disabledClass = disabled ? `${baseClass}--disabled` : '';
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button-spinner"></span>}
      {icon && !loading && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default ActionButton;