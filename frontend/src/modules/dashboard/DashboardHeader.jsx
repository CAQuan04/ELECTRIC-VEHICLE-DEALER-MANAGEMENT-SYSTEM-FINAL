import React from 'react';
import PropTypes from 'prop-types';

const DashboardHeader = ({ title, subtitle, userName = "User", actions = [] }) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="welcome-section">
          <h1>Welcome back, {userName}!</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          <h2>{title}</h2>
        </div>
        {actions.length > 0 && (
          <div className="header-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`action-btn ${action.className || ''}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <span className="btn-icon">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  userName: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.node,
      className: PropTypes.string,
      disabled: PropTypes.bool
    })
  )
};

export default DashboardHeader;