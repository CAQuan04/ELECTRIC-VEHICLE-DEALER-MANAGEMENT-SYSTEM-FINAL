/**
 * Firebase Facebook Login Component Example
 * Demonstrates how to use Firebase Facebook Authentication
 */

import React, { useState, useEffect } from 'react';
import { 
  signInWithFacebook,
  signOutFromFacebook,
  handleFacebookLoginError,
  onAuthStateChange,
  getCurrentUser,
  isLoggedInWithFacebook,
  redirectUserBasedOnRole
} from '@utils';

const FirebaseFacebookLoginExample = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      console.log('Auth state changed:', currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle Facebook login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await signInWithFacebook();
      console.log('✅ Login successful:', userData);
      
      // Optionally redirect based on role
      // redirectUserBasedOnRole(userData.role);
      
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err);
      handleFacebookLoginError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signOutFromFacebook();
      console.log('✅ Logout successful');
      setUser(null);
    } catch (err) {
      console.error('❌ Logout failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔥 Firebase Facebook Authentication</h2>
      
      {/* User Info Display */}
      {user ? (
        <div style={{ 
          border: '2px solid #4267B2', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f0f2f5'
        }}>
          <h3>✅ Logged In</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%',
                  border: '2px solid #4267B2'
                }}
              />
            )}
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Provider:</strong> {user.provider}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      ) : (
        <div style={{ 
          border: '2px dashed #ccc', 
          borderRadius: '8px', 
          padding: '40px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Bạn chưa đăng nhập
          </p>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: '#4267B2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Facebook'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Lỗi:</strong> {error.message || 'Đã xảy ra lỗi'}
        </div>
      )}

      {/* Info Box */}
      <div style={{
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #bee5eb'
      }}>
        <h4>📝 Thông tin:</h4>
        <ul style={{ marginLeft: '20px' }}>
          <li>✅ Sử dụng Firebase Authentication</li>
          <li>✅ Tự động phát hiện role dựa trên email</li>
          <li>✅ Lưu thông tin user vào localStorage</li>
          <li>✅ Hỗ trợ auth state listener</li>
          <li>✅ Xử lý lỗi tiếng Việt</li>
        </ul>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '30px' }}>
        <h3>📄 Code Example:</h3>
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          overflow: 'auto',
          fontSize: '14px'
        }}>
{`import { 
  signInWithFacebook,
  signOutFromFacebook 
} from '@utils';

// Login
const userData = await signInWithFacebook();

// Logout  
await signOutFromFacebook();`}
        </pre>
      </div>
    </div>
  );
};

export default FirebaseFacebookLoginExample;
