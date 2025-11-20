import { useState, useCallback } from 'react';
import ModalNotification from './ModalNotification';
import ModalConfirm from './ModalConfirm';

let notificationQueue = [];
let confirmQueue = [];

// Hook để quản lý notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [confirms, setConfirms] = useState([]);

  const showNotification = useCallback((type, title, message, duration = 2000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      isOpen: true,
    };

    setNotifications((prev) => [...prev, notification]);

    return id;
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, options = {}) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      const confirm = {
        id,
        title,
        message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        type: options.type || 'warning',
        isOpen: true,
        onConfirm: async () => {
          try {
            if (onConfirm) {
              await onConfirm();
            }
            resolve(true);
          } catch (error) {
            console.error('Confirm action error:', error);
            resolve(false);
          }
        },
        onClose: () => {
          setConfirms((prev) => prev.filter((c) => c.id !== id));
          resolve(false);
        },
      };

      setConfirms((prev) => [...prev, confirm]);
    });
  }, []);

  return {
    notifications,
    confirms,
    showNotification,
    closeNotification,
    showConfirm,
  };
};

// Notification service object
export const notifications = {
  success: (title, message, duration) => {
    if (window.showModalNotification) {
      return window.showModalNotification('success', title, message, duration);
    }
    console.warn('Notification system not initialized');
    return null;
  },

  error: (title, message, duration) => {
    if (window.showModalNotification) {
      return window.showModalNotification('error', title, message, duration);
    }
    console.warn('Notification system not initialized');
    return null;
  },

  warning: (title, message, duration) => {
    if (window.showModalNotification) {
      return window.showModalNotification('warning', title, message, duration);
    }
    console.warn('Notification system not initialized');
    return null;
  },

  info: (title, message, duration) => {
    if (window.showModalNotification) {
      return window.showModalNotification('info', title, message, duration);
    }
    console.warn('Notification system not initialized');
    return null;
  },

  confirm: async (title, message, onConfirm, options) => {
    if (window.showModalConfirm) {
      return window.showModalConfirm(title, message, onConfirm, options);
    }
    console.warn('Confirm system not initialized');
    // Fallback to browser confirm
    if (window.confirm(`${title}\n\n${message}`)) {
      if (onConfirm) {
        await onConfirm();
      }
      return true;
    }
    return false;
  },
};

// Export default
export default {
  useNotification,
  notifications,
};
