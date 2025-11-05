// File: src/utils/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7213/api', // DÙNG HTTPS
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor để tự động thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Đổi tên key thành 'jwtToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi 401 (token hết hạn)
apiClient.interceptors.response.use(
  (response) => response.data, // Chỉ trả về phần data của response
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken'); // Xóa token hết hạn
      localStorage.removeItem('user'); // Dọn dẹp user cũ nếu có
      // Tải lại trang, AuthContext sẽ tự động chuyển hướng về trang landing
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

export default apiClient;