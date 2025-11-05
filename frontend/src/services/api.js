// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7213/api';

/**
 * Base API call function with error handling
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  const token = localStorage.getItem('accessToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const AuthAPI = {
  /**
   * Login with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{isSuccess: boolean, message: string, token: string, username: string, role: string}>}
   */
  login: async (username, password) => {
    return apiCall('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Hash password (for testing purposes)
   * @param {string} password 
   * @returns {Promise<string>}
   */
  hashPassword: async (password) => {
    return apiCall(`/Auth/hash/${encodeURIComponent(password)}`, {
      method: 'GET',
    });
  },
};

/**
 * Users API
 */
export const UsersAPI = {
  /**
   * Get all users
   */
  getAll: async () => {
    return apiCall('/Users', {
      method: 'GET',
    });
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    return apiCall(`/Users/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create new user
   */
  create: async (userData) => {
    return apiCall('/Users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user
   */
  update: async (id, userData) => {
    return apiCall(`/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete user
   */
  delete: async (id) => {
    return apiCall(`/Users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Vehicles API
 */
export const VehiclesAPI = {
  getAll: async () => {
    return apiCall('/Vehicles', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/Vehicles/${id}`, {
      method: 'GET',
    });
  },
};

/**
 * Dealers API
 */
export const DealersAPI = {
  getAll: async () => {
    return apiCall('/Dealers', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/Dealers/${id}`, {
      method: 'GET',
    });
  },
};

/**
 * Customers API
 */
export const CustomersAPI = {
  getAll: async () => {
    return apiCall('/Customers', {
      method: 'GET',
    });
  },

  getById: async (id) => {
    return apiCall(`/Customers/${id}`, {
      method: 'GET',
    });
  },
};

// Export API base URL for reference
export { API_BASE_URL };
