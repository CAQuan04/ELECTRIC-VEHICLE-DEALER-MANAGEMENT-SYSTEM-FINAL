import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleAccessTokenLogin, redirectUserBasedOnRole } from '../utils/googleAuth';
import { handleFacebookLoginSuccess, handleFacebookLoginError, redirectUserBasedOnRole as redirectUserBasedOnRoleFB } from '../utils/facebookAuth';
import { AuthService } from '../utils/auth';
import { AuthNotifications } from '../utils/notifications';
import './AuthComponent.css';

const AuthComponent = ({ onUserChange }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        AuthService.setCurrentUser(userData); // Sync with AuthService
        if (onUserChange) {
          onUserChange(userData);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        AuthService.setCurrentUser(null); // Clear AuthService
      }
    } else {
      // No saved user, ensure AuthService is also clear
      AuthService.setCurrentUser(null);
    }
  }, [onUserChange]);

  // Mock user accounts for testing
  const mockUsers = [
    { username: 'dealer01', password: 'dealer123', role: 'dealer', name: 'Dealer User', email: 'dealer@company.com' },
    { username: 'admin01', password: 'admin123', role: 'evm_admin', name: 'EVM Admin', email: 'admin@evm.com' },
    { username: 'customer01', password: 'customer123', role: 'customer', name: 'Customer User', email: 'customer@gmail.com' },
    { username: 'dealer02', password: 'password', role: 'dealer', name: 'Dealer Manager', email: 'manager@dealer.com' },
    { username: 'evm01', password: 'password', role: 'evm_admin', name: 'EVM Director', email: 'director@evm.com' },
    { username: 'user01', password: 'password', role: 'customer', name: 'Regular User', email: 'user@example.com' }
  ];

  // Handle mock login
  const handleMockLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      const userData = {
        id: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: 'mock'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      AuthService.setCurrentUser(userData); // Update AuthService
      if (onUserChange) {
        onUserChange(userData);
      }
      alert(`Chào mừng ${user.name}! Đăng nhập thành công với role: ${user.role}`);
      toggleLogin();
      
      setTimeout(() => {
        redirectUserBasedOnRole(user.role);
      }, 1000);
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  // Handle mock register
  const handleMockRegister = (e) => {
    e.preventDefault();
    const userData = {
      id: registerForm.username,
      name: registerForm.username,
      email: registerForm.email,
      role: 'customer',
      provider: 'mock'
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    AuthService.setCurrentUser(userData); // Update AuthService
    if (onUserChange) {
      onUserChange(userData);
    }
    AuthNotifications.registerSuccess(registerForm.username);
    toggleLogin();
  };

  // Google OAuth hook
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await handleGoogleAccessTokenLogin(tokenResponse);
        if (result.success) {
          setCurrentUser(result.user);
          AuthService.setCurrentUser(result.user); // Update AuthService
          if (onUserChange) {
            onUserChange(result.user);
          }
          AuthNotifications.googleLoginSuccess(result.user.name);
          toggleLogin();
          
          setTimeout(() => {
            redirectUserBasedOnRole(result.user.role);
          }, 1500);
        } else {
          AuthNotifications.loginError(result.error);
        }
      } catch (error) {
        console.error('Google login error:', error);
        AuthNotifications.socialLoginError('Google', error.message);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    }
  });

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    AuthService.setCurrentUser(null); // Update AuthService
    if (onUserChange) {
      onUserChange(null);
    }
    AuthNotifications.logoutSuccess();
    window.location.href = '/';
  };

  return (
    <>
      {currentUser ? (
        <div className="user-menu">
          <button className="user-btn" onClick={handleLogout} title={`Đăng xuất (${currentUser.role})`}>
            <span className="user-name">{currentUser.name}</span>
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={toggleLogin}>
          Login
        </button>
      )}

      {isLoginOpen && (
        <div className="auth-overlay" onClick={toggleLogin}>
          <div className={`auth-container ${isRegisterMode ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="form-box login">
              <form action="#" onSubmit={handleMockLogin}>
                <h1>Login</h1>
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    required 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                <div className="forgot-link">
                  <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" className="auth-btn">Login</button>
                
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'left' }}>
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#4A90E2' }}>📝 Test Accounts</summary>
                    <div style={{ marginTop: '5px', lineHeight: '1.4' }}>
                      <strong>Dealer:</strong> dealer01 / dealer123<br/>
                      <strong>EVM:</strong> admin01 / admin123<br/>
                      <strong>Customer:</strong> customer01 / customer123
                    </div>
                  </details>
                </div>
                
                <p>or login with social platforms</p>
                <div className="social-icons">
                  <a href="#" className="google-icon" onClick={(e) => {
                    e.preventDefault();
                    login();
                  }}>
                  </a>
                  <a href="#" className="facebook-icon" onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const userData = await handleFacebookLoginSuccess();
                      setCurrentUser(userData);
                      if (onUserChange) {
                        onUserChange(userData);
                      }
                      AuthNotifications.facebookLoginSuccess(userData.name);
                      toggleLogin();
                      
                      setTimeout(() => {
                        redirectUserBasedOnRoleFB(userData.role);
                      }, 1500);
                    } catch (error) {
                      handleFacebookLoginError(error);
                    }
                  }}>
                  </a>
                </div>
              </form>
            </div>

            <div className="form-box register">
              <form action="#" onSubmit={handleMockRegister}>
                <h1>Registration</h1>
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    required 
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  />
                  <i className="bx bxs-user"></i>
                </div>
                <div className="input-box">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  />
                  <i className="bx bxs-envelope"></i>
                </div>
                <div className="input-box">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                <button type="submit" className="auth-btn">Register</button>
                <p>or register with social platforms</p>
                <div className="social-icons">
                  <a href="#" className="google-icon" onClick={(e) => {
                    e.preventDefault();
                    login();
                  }}>
                  </a>
                  <a href="#" className="facebook-icon" onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const userData = await handleFacebookLoginSuccess();
                      setCurrentUser(userData);
                      if (onUserChange) {
                        onUserChange(userData);
                      }
                      AuthNotifications.facebookLoginSuccess(userData.name);
                      toggleLogin();
                      
                      setTimeout(() => {
                        redirectUserBasedOnRoleFB(userData.role);
                      }, 1500);
                    } catch (error) {
                      handleFacebookLoginError(error);
                    }
                  }}>
                  </a>
                </div>
              </form>
            </div>

            <div className="toggle-box">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Don't have an account?</p>
                <button className="auth-btn register-btn" onClick={() => setIsRegisterMode(true)}>
                  Register
                </button>
              </div>

              <div className="toggle-panel toggle-right">
                <h1>Hello, Welcome!</h1>
                <p>Already have an account?</p>
                <button className="auth-btn login-btn" onClick={() => setIsRegisterMode(false)}>
                  Login
                </button>
              </div>
            </div>

            <button className="auth-close" onClick={toggleLogin}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthComponent; 
