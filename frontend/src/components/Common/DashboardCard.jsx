import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, icon, children, actions = [], className = '' }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {icon && <div className="card-icon">{icon}</div>}
      </div>
      
      <div className="card-content">
        {children}
      </div>
      
      {actions.length > 0 && (
        <div className="card-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`action-btn ${action.className || ''}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon && <span className="action-icon">{action.icon}</span>}
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
  icon: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.node,
      className: PropTypes.string,
      disabled: PropTypes.bool
    })
  ),
  className: PropTypes.string
};

export default DashboardCard;