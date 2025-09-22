import axios from 'axios';

// Resolve API base URL from Vite environment (production-ready config)
const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Helper function to decode JWT token from Google
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Helper function to handle Google OAuth with access token (for useGoogleLogin hook)
export const handleGoogleAccessTokenLogin = async (tokenResponse) => {
  if (import.meta.env.DEV) {
    console.log('Google Access Token Login:', tokenResponse);
  }
  
  try {
    // Get user info from Google API using access token
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    });
    
    const userInfo = userInfoResponse.data;
    
    if (import.meta.env.DEV) {
      console.log('Google user info:', userInfo);
    }
    
    // Fallback: Create local session with Google user info
    const fallbackUser = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      emailVerified: userInfo.verified_email,
      provider: 'google'
    };
    
    localStorage.setItem('user', JSON.stringify(fallbackUser));
    localStorage.setItem('accessToken', tokenResponse.access_token);
    localStorage.removeItem('refreshToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.access_token}`;
    
    return { 
      success: true, 
      user: fallbackUser, 
      accessToken: tokenResponse.access_token 
    };
    
  } catch (error) {
    console.error('Google access token login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Authentication failed' 
    };
  }
};

// Helper function to handle Google login success (for JWT tokens from GoogleLogin component)
export const handleGoogleLoginSuccess = async (credentialResponse) => {
  if (import.meta.env.DEV) {
    console.log('Google Login Success:', credentialResponse);
  }
  
  try {
    const decodedToken = decodeJWT(credentialResponse.credential);
    
    if (!decodedToken) {
      throw new Error('Failed to decode token');
    }

    const fallbackUser = {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
      provider: 'google'
    };
    
    localStorage.setItem('user', JSON.stringify(fallbackUser));
    localStorage.setItem('accessToken', credentialResponse.credential);
    localStorage.removeItem('refreshToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${credentialResponse.credential}`;
    return { success: true, user: fallbackUser, accessToken: credentialResponse.credential };
    
  } catch (error) {
    console.error('Google login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Authentication failed' 
    };
  }
};

// Helper function to handle Google login error
export const handleGoogleLoginError = () => {
  console.error('Google Login Failed');
  return { success: false, error: 'Google authentication failed' };
};

// Helper function to logout
export const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  window.location.href = '/login';
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper function to get access token
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Initialize auth on app start
export const initializeAuth = () => {
  const token = getAccessToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};