import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7213/api', // Backend API base URL with /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm JWT Token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    console.log('🔐 Request interceptor - Token exists:', !!token);
    console.log('📍 Request URL:', config.baseURL + config.url);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.warn('⚠️ No JWT token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized - Token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;