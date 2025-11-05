import React from 'react';
import APITestLogin from '../components/test/APITestLogin';

const APITestPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>
          🔧 API Testing Dashboard
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Test các API endpoints của backend
        </p>
        
        <APITestLogin />
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ marginTop: '20px' }}>📚 Hướng dẫn:</h3>
          <ol style={{ lineHeight: '1.8', color: '#555' }}>
            <li>Đảm bảo backend đang chạy tại <code>https://localhost:7213</code></li>
            <li>Click vào một test account để tự động điền username/password</li>
            <li>Click "Test Login" để gửi request đến backend</li>
            <li>Xem kết quả response từ API</li>
            <li>Kiểm tra browser console để xem chi tiết request/response</li>
          </ol>

          <h3 style={{ marginTop: '20px' }}>🔍 Kiểm tra:</h3>
          <ul style={{ lineHeight: '1.8', color: '#555' }}>
            <li>Network tab trong DevTools để xem HTTP requests</li>
            <li>Console tab để xem logs và errors</li>
            <li>localStorage để xem token được lưu</li>
          </ul>

          <h3 style={{ marginTop: '20px' }}>🚀 Backend Endpoints:</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            <div>POST /api/Auth/login - Đăng nhập</div>
            <div>GET /api/Users - Danh sách users</div>
            <div>GET /api/Vehicles - Danh sách vehicles</div>
            <div>GET /api/Dealers - Danh sách dealers</div>
            <div>GET /api/Customers - Danh sách customers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestPage;
