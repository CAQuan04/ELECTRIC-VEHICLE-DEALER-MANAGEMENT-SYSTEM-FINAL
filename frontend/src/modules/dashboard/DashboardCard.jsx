import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ 
  title, 
  icon, 
  children, 
  actions = [],
  className = '',
  ...props 
}) => {
  return (
    <div className={`dashboard-card ${className}`} {...props}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-icon">{icon}</div>
      </div>
      <div className="card-content">
        {children}
      </div>
      {actions.length > 0 && (
        <div className="quick-actions">
          {actions.map((action, index) => (
            <button 
              key={index}
              className={`action-btn ${action.variant || ''}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['', 'secondary', 'success']),
    disabled: PropTypes.bool
  })),
  className: PropTypes.string
};

export default DashboardCard;