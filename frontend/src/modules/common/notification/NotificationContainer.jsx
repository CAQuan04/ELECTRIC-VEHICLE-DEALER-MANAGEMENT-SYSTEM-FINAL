import React, { useState, useEffect, useCallback } from 'react';
import './NotificationContainer.css';

const Notification = ({ id, type, title, message, duration, onRemove }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__content">
        <div className="notification__title">{title}</div>
        {message && <div className="notification__message">{message}</div>}
      </div>
      <button 
        className="notification__close"
        onClick={() => onRemove(id)}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 2000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Expose methods globally
  useEffect(() => {
    window.showNotification = addNotification;
    window.clearNotifications = clearAll;
    
    return () => {
      delete window.showNotification;
      delete window.clearNotifications;
    };
  }, [addNotification, clearAll]);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;