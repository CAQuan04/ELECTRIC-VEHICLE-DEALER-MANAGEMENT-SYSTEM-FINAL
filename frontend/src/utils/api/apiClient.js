import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7213', // <-- ĐỊA CHỈ BACKEND API CỦA BẠN
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm JWT Token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;