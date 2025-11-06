import React from 'react';
import { useNotification } from './useNotification';
import ModalNotification from './ModalNotification';
import ModalConfirm from './ModalConfirm';

const NotificationProvider = ({ children }) => {
  const { notifications, confirms, showNotification, closeNotification, showConfirm } = useNotification();

  // Expose functions to window for global access
  React.useEffect(() => {
    window.showModalNotification = showNotification;
    window.showModalConfirm = showConfirm;

    return () => {
      delete window.showModalNotification;
      delete window.showModalConfirm;
    };
  }, [showNotification, showConfirm]);

  return (
    <>
      {children}

      {/* Render all notifications */}
      {notifications.map((notification) => (
        <ModalNotification
          key={notification.id}
          isOpen={notification.isOpen}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => closeNotification(notification.id)}
        />
      ))}

      {/* Render all confirms */}
      {confirms.map((confirm) => (
        <ModalConfirm
          key={confirm.id}
          isOpen={confirm.isOpen}
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          type={confirm.type}
          onConfirm={confirm.onConfirm}
          onClose={confirm.onClose}
        />
      ))}
    </>
  );
};

export default NotificationProvider;
