import React from 'react';
import './LoadingPage.css';

const LoadingPage = ({ 
  message = "Loading...", 
  showLogo = true, 
  variant = "default" // "default", "minimal", "full-screen"
}) => {
  return (
    <div className={`loading-page ${variant}`}>
      <div className="loading-content">
        {showLogo && (
          <div className="loading-logo">
            <div className="tesla-logo">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path
                  d="M30 35h40M25 45h50M20 55h60M35 65h30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="charging-lines"
                />
                <circle cx="50" cy="50" r="15" fill="currentColor" className="center-dot"/>
              </svg>
            </div>
            <h2 className="brand-name">EVM</h2>
          </div>
        )}
        
        <div className="loading-animation">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>
        
        <div className="loading-text">
          <p className="main-message">{message}</p>
          <div className="dots-animation">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

// Variant cho loading inline (không full screen)
export const LoadingSpinner = ({ size = "medium", color = "primary" }) => {
  return (
    <div className={`inline-loading ${size}`}>
      <div className={`simple-spinner ${color}`}>
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
};

// Variant cho loading button
export const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading} className={`btn ${props.className || ''} ${loading ? 'loading' : ''}`}>
      {loading && (
        <span className="btn-spinner">
          <div className="btn-spinner-circle"></div>
        </span>
      )}
      <span className={loading ? 'btn-text-hidden' : ''}>{children}</span>
    </button>
  );
};

export default LoadingPage;