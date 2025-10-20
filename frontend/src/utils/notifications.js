// Notification utility functions
export const showNotification = (title, message = '', type = 'info', duration = 5000) => {
  if (window.showNotification) {
    return window.showNotification({
      title,
      message,
      type,
      duration
    });
  } else {
    // Fallback to alert if notification system not loaded
    alert(`${title}${message ? '\n' + message : ''}`);
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