import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { handleGoogleAccessTokenLogin, redirectUserBasedOnRole } from '../../utils/googleAuth';
import { handleFacebookLoginSuccess, handleFacebookLoginError, redirectUserBasedOnRole as redirectUserBasedOnRoleFB } from '../../utils/facebookAuth';
import { AuthNotifications } from '../../utils/notifications';
import apiClient from '../../utils/api/client';
import './AuthComponent.css';

const AuthComponent = () => {
  const { user, logout, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  console.log('🎨 AuthComponent render - user:', user, 'loading:', loading);
  
  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

  // Nếu đã đăng nhập, chỉ hiển thị thông tin user và nút logout
  if (user) {
    console.log('✅ User đã đăng nhập, hiển thị user menu');
    return (
      <div className="user-menu">
        <button className="user-btn" onClick={logout} title={`Đăng xuất (${user.role})`}>
          <span className="user-name">{user.username}</span>
        </button>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị nút Login và Modal khi được mở
  console.log('ℹ️ User chưa đăng nhập, hiển thị login button');
  return (
    <>
      <button className="login-btn" onClick={toggleLogin}>Login</button>
      {isLoginOpen && <LoginModal onClose={toggleLogin} />}
    </>
  );
};

// Component Modal Đăng nhập
const LoginModal = ({ onClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isAdvancedRegister, setIsAdvancedRegister] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);
        
        console.log('🔐 Đang đăng nhập với:', {
            username: loginForm.username.trim(),
            password: '***'
        });
        
        try {
            // Gọi API Backend thật
            const response = await apiClient.post('/Auth/login', {
                username: loginForm.username.trim(),
                password: loginForm.password,
            });

            console.log('✅ API response:', response);

            // Nếu thành công, gọi hàm login từ context để lưu trạng thái
            login(response);

            // Chuyển hướng người dùng dựa trên vai trò
            const role = response.role;
            console.log('🚀 Chuyển hướng dựa trên role:', role);
            
            if (role === 'Admin') {
                console.log('➡️ Navigate to /evm-dashboard');
                navigate('/evm-dashboard');
            } else if (role === 'EVMStaff') {
                console.log('➡️ Navigate to /staff-dashboard');
                navigate('/staff-dashboard');
            } else if (role === 'DealerManager' || role === 'DealerStaff') {
                console.log('➡️ Navigate to /dealer-dashboard');
                navigate('/dealer-dashboard');
            } else {
                console.log('➡️ Navigate to /customer-dashboard');
                navigate('/customer-dashboard');
            }
            
            onClose(); // Đóng modal
        } catch (err) {
            console.error('❌ Lỗi đăng nhập:', err);
            // Xử lý lỗi trả về từ API
            if (err.response && err.response.data && err.response.data.message) {
                setLoginError(err.response.data.message);
            } else if (err.message) {
                setLoginError(err.message);
            } else {
                setLoginError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMockRegister = (e) => {
        e.preventDefault();
        if (isAdvancedRegister) {
            navigate('/register-advanced');
        } else {
            AuthNotifications.registerSuccess();
            onClose();
        }
    };

    // Google Login
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userData = await handleGoogleAccessTokenLogin(tokenResponse.access_token);
                login(userData);
                AuthNotifications.googleLoginSuccess(userData.username);
                onClose();
                
                setTimeout(() => {
                    redirectUserBasedOnRole(userData.role);
                }, 1500);
            } catch (error) {
                console.error('Google login error:', error);
                setLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
    });

  return (
    <div className="auth-overlay" onClick={onClose}>
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
                  
                  <strong>🏢 Dealer Manager & Staff:</strong>
                  <div>TestDealerStaff / 12345</div>
                  <div>TestDealerManager / 12346</div>
                </div>
              </details>
            </div>
            
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#" className="google-icon" onClick={(e) => {
                e.preventDefault();
                googleLogin();
              }}>
              </a>
              <a href="#" className="facebook-icon" onClick={async (e) => {
                e.preventDefault();
                try {
                  const userData = await handleFacebookLoginSuccess();
                  login(userData);
                  AuthNotifications.facebookLoginSuccess(userData.username || userData.name);
                  onClose();
                  
                  setTimeout(() => {
                    redirectUserBasedOnRoleFB(userData.role);
                  }, 1500);
                } catch (error) {
                  handleFacebookLoginError(error);
                  setLoginError('Đăng nhập Facebook thất bại. Vui lòng thử lại.');
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
                googleLogin();
              }}>
              </a>
              <a href="#" className="facebook-icon" onClick={async (e) => {
                e.preventDefault();
                try {
                  const userData = await handleFacebookLoginSuccess();
                  login(userData);
                  AuthNotifications.facebookLoginSuccess(userData.username || userData.name);
                  onClose();
                  
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

        <button className="auth-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AuthComponent; 
