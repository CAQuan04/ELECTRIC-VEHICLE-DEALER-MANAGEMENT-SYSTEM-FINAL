// File: src/modules/auth/AuthComponent.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import context mới
import apiClient from '../../utils/api/client'; // Import API client
import { useNavigate } from 'react-router-dom';
import './AuthComponent.css';

const AuthComponent = () => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout từ context
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

  // Nếu đã đăng nhập, chỉ hiển thị thông tin user và nút logout
  if (user) {
    return (
      <div className="user-menu">
        <button className="user-btn" onClick={logout} title={`Đăng xuất (${user.role})`}>
          <span className="user-name">{user.username}</span>
        </button>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị nút Login và Modal khi được mở
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Gọi API Backend thật
            const response = await apiClient.post('/Auth/login', {
                username: loginForm.username.trim(),
                password: loginForm.password,
            });

            // Nếu thành công, gọi hàm login từ context để lưu trạng thái
            login(response);

            // Chuyển hướng người dùng dựa trên vai trò
            const role = response.role;
            if (role === 'Admin' || role === 'EVMStaff') {
                navigate('/evm-dashboard');
            } else if (role === 'DealerManager' || role === 'DealerStaff') {
                navigate('/dealer-dashboard');
            } else {
                navigate('/customer-dashboard');
            }
            
            onClose(); // Đóng modal
        } catch (err) {
            // Xử lý lỗi trả về từ API
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                            />
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            />
                            <i className="bx bxs-lock-alt"></i>
                        </div>
                        
                        {error && <p className="error-message" style={{color: 'red', textAlign: 'center', marginTop: '10px'}}>{error}</p>}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Login'}
                        </button>

                         <div className="test-accounts">
                            <details>
                                <summary>📝 Test Accounts</summary>
                                <div className="test-list">
                                    <div><strong>Admin:</strong> admin / 12345</div>
                                    <div><strong>Admin:</strong> TestEVMStaff / 123456</div>
                                    <div><strong>Admin:</strong> TestDealerStaff / 12345</div>
                                    <div><strong>Admin:</strong> TestDealerManager / 12346</div>
                                    
                                </div>
                            </details>
                        </div>
                    </form>
                </div>
                <button className="auth-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
}

export default AuthComponent;