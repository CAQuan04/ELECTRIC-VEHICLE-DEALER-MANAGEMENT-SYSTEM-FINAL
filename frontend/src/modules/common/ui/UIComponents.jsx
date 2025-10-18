// Shared UI Components
import React from 'react';
import './UIComponents.css';

// Loading Spinner Component (Message-based)
export const MessageSpinner = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className="loading-section">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

// Deprecated: Keep old name for backward compatibility (will be removed in future)
export const LoadingSpinner = MessageSpinner;

// Error Message Component
export const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-section">
    <h3>❌ Có lỗi xảy ra</h3>
    <p>{error}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        Thử lại
      </button>
    )}
  </div>
);

// Stat Card Component
export const StatCard = ({ value, label, icon, className = '' }) => (
  <div className={`stat-card ${className}`}>
    {icon && <div className="stat-icon">{icon}</div>}
    <h3>{value}</h3>
    <p>{label}</p>
  </div>
);

// Dashboard Hero Section
export const DashboardHero = ({ title, subtitle, userName }) => (
  <div className="hero-section">
    <h1>{title.replace('{name}', userName || 'Người dùng')}</h1>
    <p>{subtitle}</p>
  </div>
);

// Navigation Pills Component
export const NavigationPills = ({ sections, activeSection, onSectionChange }) => (
  <div className="nav-pills">
    {sections.map(section => (
      <button 
        key={section.key}
        className={activeSection === section.key ? 'nav-pill active' : 'nav-pill'}
        onClick={() => onSectionChange(section.key)}
      >
        {section.icon} {section.label}
      </button>
    ))}
  </div>
);

// Data Table Component
export const DataTable = ({ headers, data, className = '' }) => (
  <div className={`data-table ${className}`}>
    <div className="table-row header">
      {headers.map((header, index) => (
        <span key={index}>{header}</span>
      ))}
    </div>
    {data.map((row, index) => (
      <div key={index} className="table-row">
        {row.map((cell, cellIndex) => (
          <span key={cellIndex} className={cell.className || ''}>{cell.value || cell}</span>
        ))}
      </div>
    ))}
  </div>
);

// Section Container
export const DashboardSection = ({ title, children, className = '' }) => (
  <div className={`dashboard-section ${className}`}>
    <h2>{title}</h2>
    {children}
  </div>
);

// Card Container
export const Card = ({ title, children, className = '', headerAction }) => (
  <div className={`card ${className}`}>
    {title && (
      <div className="card-header">
        <h4>{title}</h4>
        {headerAction}
      </div>
    )}
    <div className="card-content">
      {children}
    </div>
  </div>
);

// Status Badge Component
export const StatusBadge = ({ status, children }) => (
  <span className={`status-badge status-${status}`}>
    {children}
  </span>
);

// Grid Layout Component
export const Grid = ({ children, columns = 'auto-fit', minWidth = '300px', gap = '2rem', className = '' }) => (
  <div 
    className={`grid ${className}`}
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`,
      gap: gap
    }}
  >
    {children}
  </div>
);