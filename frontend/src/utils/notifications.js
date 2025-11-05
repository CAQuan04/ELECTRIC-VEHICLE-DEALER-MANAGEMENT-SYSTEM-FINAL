// Notification utility functions
// Export notifications từ module mới
export { notifications } from '@modules/common/notification/useNotification';

// Giữ lại các function cũ để tương thích ngược
export const showNotification = (title, message = '', type = 'info', duration = 5000) => {
  // Wait for notification system to be ready
  const tryShowNotification = () => {
    if (window.showNotification) {
      return window.showNotification({
        title,
        message,
        type,
        duration
      });
    } else {
      // Retry after a short delay if notification system isn't ready yet
      setTimeout(() => {
        if (window.showNotification) {
          window.showNotification({
            title,
            message,
            type,
            duration
          });
        } else {
          // Last resort: create a custom notification manually
          createManualNotification(title, message, type, duration);
        }
      }, 100);
    }
  };
  
  return tryShowNotification();
};

// Manual notification creation as ultimate fallback
const createManualNotification = (title, message, type, duration) => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    border-left: 4px solid ${
      type === 'success' ? '#22c55e' :
      type === 'error' ? '#ef4444' :
      type === 'warning' ? '#f59e0b' : '#3b82f6'
    };
    min-height: 64px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Icon
  const icon = document.createElement('div');
  icon.className = 'notification__icon';
  icon.style.fontSize = '20px';
  icon.textContent = 
    type === 'success' ? '✅' :
    type === 'error' ? '❌' :
    type === 'warning' ? '⚠️' : 'ℹ️';
  
  // Content
  const content = document.createElement('div');
  content.className = 'notification__content';
  content.style.flex = '1';
  
  const titleEl = document.createElement('div');
  titleEl.className = 'notification__title';
  titleEl.style.cssText = 'font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 4px;';
  titleEl.textContent = title;
  
  content.appendChild(titleEl);
  
  if (message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'notification__message';
    messageEl.style.cssText = 'font-size: 13px; color: #6b7280; line-height: 1.4;';
    messageEl.textContent = message;
    content.appendChild(messageEl);
  }
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'notification__close';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
  `;
  closeBtn.textContent = '×';
  closeBtn.onclick = () => notification.remove();
  
  notification.appendChild(icon);
  notification.appendChild(content);
  notification.appendChild(closeBtn);
  
  document.body.appendChild(notification);
  
  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
};

// Convenience functions for different notification types
export const showSuccess = (title, message = '', duration = 5000) => {
  return showNotification(title, message, 'success', duration);
};

export const showError = (title, message = '', duration = 7000) => {
  return showNotification(title, message, 'error', duration);
};

export const showWarning = (title, message = '', duration = 6000) => {
  return showNotification(title, message, 'warning', duration);
};

export const showInfo = (title, message = '', duration = 5000) => {
  return showNotification(title, message, 'info', duration);
};

// Clear all notifications
export const clearAllNotifications = () => {
  if (window.clearNotifications) {
    window.clearNotifications();
  }
};

// Common notification messages for authentication
export const AuthNotifications = {
  loginSuccess: (userName, role) => showSuccess(
    `Chào mừng ${userName}!`, 
    `Đăng nhập thành công với role: ${role}`
  ),
  
  loginError: (error = 'Tên đăng nhập hoặc mật khẩu không đúng!') => showError(
    'Đăng nhập thất bại',
    error
  ),
  
  registerSuccess: (userName) => showSuccess(
    `Chào mừng ${userName}!`,
    'Đăng ký tài khoản thành công'
  ),
  
  logoutSuccess: () => showInfo(
    'Đăng xuất thành công!',
    'Hẹn gặp lại bạn!'
  ),
  
  googleLoginSuccess: (userName) => showSuccess(
    `Chào mừng ${userName}!`,
    'Đăng nhập Google thành công'
  ),
  
  facebookLoginSuccess: (userName) => showSuccess(
    `Chào mừng ${userName}!`,
    'Đăng nhập Facebook thành công'
  ),
  
  socialLoginError: (provider, error) => showError(
    `Lỗi đăng nhập ${provider}`,
    error
  ),

  info: (message, title = 'Thông báo') => showInfo(
    title,
    message
  )
};

export default {
  show: showNotification,
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  clear: clearAllNotifications,
  auth: AuthNotifications
};