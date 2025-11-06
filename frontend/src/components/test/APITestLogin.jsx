import React, { useState } from 'react';
import { AuthAPI } from '../../services/api';

/**
 * Component để test API login
 * Sử dụng cho testing và debugging
 */
const APITestLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await AuthAPI.login(username, password);
      setResult(response);
      
      if (response.isSuccess) {
        localStorage.setItem('accessToken', response.token);
        console.log('Login successful:', response);
      }
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { username: 'admin', password: '12345', role: 'Admin' },
    { username: 'TestEVMStaff', password: '123456', role: 'EVMStaff' },
    { username: 'TestDealerStaff', password: '12345', role: 'DealerStaff' },
    { username: 'TestDealerManager', password: '12346', role: 'DealerManager' },
  ];

  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🧪 API Login Test</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Test kết nối với Backend API
      </p>

      <form onSubmit={handleTest} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: loading ? '#999' : '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </form>

      {/* Test accounts */}
      <div style={{ marginTop: '20px' }}>
        <h4>📝 Test Accounts:</h4>
        <div style={{ fontSize: '13px', color: '#666' }}>
          {testAccounts.map((acc, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                border: '1px solid #e0e0e0'
              }}
              onClick={() => {
                setUsername(acc.username);
                setPassword(acc.password);
              }}
            >
              <strong>{acc.username}</strong> / {acc.password} ({acc.role})
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ef5350'
        }}>
          <strong>❌ Error:</strong>
          <pre style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
            {error}
          </pre>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: result.isSuccess ? '#e8f5e9' : '#ffebee',
          color: result.isSuccess ? '#2e7d32' : '#c62828',
          borderRadius: '4px',
          border: `1px solid ${result.isSuccess ? '#66bb6a' : '#ef5350'}`
        }}>
          <strong>{result.isSuccess ? '✅ Success' : '❌ Failed'}:</strong>
          <pre style={{
            margin: '10px 0 0 0',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderRadius: '4px',
        fontSize: '12px',
        border: '1px solid #ffeaa7'
      }}>
        <strong>⚠️ Lưu ý:</strong>
        <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
          <li>Backend phải đang chạy tại: https://localhost:7213</li>
          <li>Đảm bảo CORS đã được cấu hình trong backend</li>
          <li>Nếu gặp lỗi SSL, trust certificate của backend</li>
          <li>Kiểm tra console để xem chi tiết request/response</li>
        </ul>
      </div>
    </div>
  );
};

export default APITestLogin;
