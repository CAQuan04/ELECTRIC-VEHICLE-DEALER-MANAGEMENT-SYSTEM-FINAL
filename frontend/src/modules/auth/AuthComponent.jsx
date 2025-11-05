import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleAccessTokenLogin, redirectUserBasedOnRole } from '../../utils/googleAuth';
import { handleFacebookLoginSuccess, handleFacebookLoginError, redirectUserBasedOnRole as redirectUserBasedOnRoleFB } from '../../utils/facebookAuth';
import { AuthService } from '../../utils/auth';
import { AuthNotifications } from '../../utils/notifications';
import { AuthAPI } from '../../services/api';
import './AuthComponent.css';

const AuthComponent = ({ onUserChange }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isAdvancedRegister, setIsAdvancedRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

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

  // Multi-step registration handlers
  // Map role từ Backend sang Frontend
  const mapRoleToFrontend = (backendRole) => {
    // Backend roles: Admin, EVMStaff, DealerManager, DealerStaff, Customer
    // Frontend roles: evm_admin, dealer, customer
    const roleMap = {
      'Admin': 'evm_admin',
      'EVMStaff': 'evm_admin',
      'DealerManager': 'dealer',
      'DealerStaff': 'dealer',
      'Customer': 'customer'
    };
    return roleMap[backendRole] || 'customer';
  };

  // Handle login with API
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      // Call API login
      const response = await AuthAPI.login(loginForm.username, loginForm.password);
      
      if (response.isSuccess) {
        // Store token
        localStorage.setItem('accessToken', response.token);
        
        // Map role từ BE sang FE
        const frontendRole = mapRoleToFrontend(response.role);
        
        // Create user data object
        const userData = {
          id: response.username,
          name: response.username, // Backend doesn't return name, use username
          username: response.username,
          role: frontendRole, // Use mapped role
          backendRole: response.role, // Keep original role for reference
          dealerRole: response.role === 'DealerManager' ? 'dealer_manager' : 
                     response.role === 'DealerStaff' ? 'dealer_staff' : null,
          provider: 'backend-api',
          token: response.token
        };
        
        // Save user data
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        AuthService.setCurrentUser(userData);
        
        if (onUserChange) {
          onUserChange(userData);
        }
        
        // Show success notification
        AuthNotifications.loginSuccess(userData.name, response.role);
        
        // Close login modal
        toggleLogin();
        
        // Redirect based on role
        setTimeout(() => {
          redirectUserBasedOnRole(frontendRole);
        }, 1000);
      } else {
        // Login failed
        setLoginError(response.message || 'Đăng nhập thất bại');
        AuthNotifications.loginError(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Không thể kết nối đến server. Vui lòng thử lại sau.';
      setLoginError(errorMessage);
      AuthNotifications.loginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock user accounts for testing (kept for reference)
  const mockUsers = [
 
    { username: 'Dstaff01', password: 'staff123', role: 'dealer', dealerRole: 'dealer_staff', name: 'Nguyễn Văn Staff', email: 'staff@tesladealers.com', dealerId: 'DEALER_HN001', dealerName: 'Tesla Hà Nội Center' },
    { username: 'manager01', password: 'manager123', role: 'dealer', dealerRole: 'dealer_manager', name: 'Lê Văn Manager', email: 'manager@tesladealers.com', dealerId: 'DEALER_HN001', dealerName: 'Tesla Hà Nội Center' },
    { username: 'dealer01', password: 'dealer123', role: 'dealer', dealerRole: 'dealer_staff', name: 'Dealer User', email: 'dealer@company.com' },
    { username: 'admin01', password: 'admin123', role: 'evm_admin', name: 'EVM Admin', email: 'admin@evm.com' },
    { username: 'customer01', password: 'customer123', role: 'customer', name: 'Customer User', email: 'customer@gmail.com' },
    { username: 'evm01', password: 'password', role: 'evm_admin', name: 'EVM Director', email: 'director@evm.com' },
    { username: 'user01', password: 'password', role: 'customer', name: 'Regular User', email: 'user@example.com' },
    { username: 'staff01', password: 'staff123', role: 'staff', name: 'Regular Staff', email: 'staff@example.com' }
  ];

  // Handle mock login (kept for fallback/testing)
  const handleMockLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      const userData = {
        id: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        dealerRole: user.dealerRole || null,       // Add dealer role
        dealerId: user.dealerId || null,           // Add dealer ID
        dealerName: user.dealerName || null,       // Add dealer name
        provider: 'mock'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      AuthService.setCurrentUser(userData); // Update AuthService
      if (onUserChange) {
        onUserChange(userData);
      }
      
      // Show role-specific message
      const roleDisplay = user.dealerRole === 'dealer_staff' ? 'Nhân Viên Bán Hàng' :
                          user.dealerRole === 'dealer_manager' ? 'Quản Lý Đại Lý' :
                          user.role === 'evm_admin' ? 'EVM Admin' : 'Customer';
      
      alert(`Chào mừng ${user.name}!\nĐăng nhập thành công với quyền: ${roleDisplay}`);
      toggleLogin();
      
      setTimeout(() => {
        redirectUserBasedOnRole(user.role);
      }, 1000);
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
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

  // Handle mock register
  const handleMockRegister = (e) => {
    e.preventDefault();
    
    if (isAdvancedRegister) {
      // Redirect to existing multi-step registration
      window.location.href = '/register';
      return;
    }

    // Simple registration
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
            
            {/* Login Form */}
            <div className="form-box login">
              <form action="#" onSubmit={handleLogin}>
                <h1>Login</h1>
                
                {loginError && (
                  <div className="error-message" style={{
                    color: '#ff4444',
                    backgroundColor: '#ffeeee',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px'
                  }}>
                    {loginError}
                  </div>
                )}
                
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    required 
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <i className="bx bxs-lock-alt"></i>
                </div>
                <div className="forgot-link">
                  <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" className="auth-btn" disabled={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Login'}
                </button>
                
                <div className="test-accounts">
                  <details>
                    <summary>📝 Test Accounts (Backend API)</summary>
                    <div className="test-list">
                      
                        <strong>🔧 Admin/EVM Staff:</strong>
                        <div>admin / 12345</div>
                        <div>TestEVMStaff / 123456</div>
                      
                      
                        <strong>🏢 Dealer:</strong>
                        <div>TestDealerStaff / 12345</div>
                        <div>TestDealerManager / 12346</div>
                      
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

            {/* Register Form */}
            <div className="form-box register">
              <form action="#" onSubmit={handleMockRegister}>
                <h1>Registration</h1>
                
                {/* Registration Mode Toggle */}
                <div className="register-mode-toggle">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={isAdvancedRegister}
                      onChange={(e) => setIsAdvancedRegister(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {isAdvancedRegister ? 'Nâng cao' : 'Cơ bản'}
                    </span>
                  </label>
                </div>

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
                
                <button type="submit" className="auth-btn">
                  {isAdvancedRegister ? 'Đến trang nâng cao' : 'Register'}
                </button>
                
                {isAdvancedRegister && (
                  <p className="advanced-note">
                    🚀 Đăng ký với email & khảo sát
                  </p>
                )}
                
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

            {/* Toggle Box */}
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
