// Role-based access control utilities
import { jwtDecode } from 'jwt-decode'; // ✨ Import at top

export const USER_ROLES = {
  DEALER: 'dealer',
  CUSTOMER: 'customer', 
  EVM_ADMIN: 'evm_admin',
  GUEST: 'guest',
  STAFF: 'staff'
};

export const DEALER_ROLES = {
  STAFF: 'dealer_staff',
  MANAGER: 'dealer_manager',
};

export const DASHBOARD_ROUTES = {
  [USER_ROLES.DEALER]: '/dealer-dashboard',
  [USER_ROLES.CUSTOMER]: '/customer-dashboard', 
  [USER_ROLES.EVM_ADMIN]: '/evm-dashboard',
  [USER_ROLES.GUEST]: '/landing',
  [USER_ROLES.STAFF]: '/staff-dashboard'
};

// Mock user data - Replace with real authentication
let currentUser = null; // No default user - require login
let cachedToken = null; // Cache token để tránh decode nhiều lần

export const AuthService = {
  getCurrentUser: () => {
    const token = localStorage.getItem('jwtToken');
    
    // Nếu có cache và token không đổi, trả về cache
    if (currentUser && cachedToken === token) {
      return currentUser;
    }
    
    // Reset nếu không có token
    if (!token) {
      currentUser = null;
      cachedToken = null;
      return null;
    }
    
    // Parse token nếu chưa có cache hoặc token đổi
    try {
      const decodedToken = jwtDecode(token);
      
      // Check if token is still valid
      if (decodedToken.exp * 1000 > Date.now()) {
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                        decodedToken.sub || 
                        decodedToken.name || 
                        'User';
        const userId = decodedToken.userId;
        const dealerShopId = decodedToken.dealerShopId;
        const dealerId = decodedToken.dealerId;
        
        currentUser = {
          username,
          role,
          userId,
          dealerShopId,
          dealerId,
          name: username
        };
        cachedToken = token; // Cache token
        return currentUser;
      } else {
        // Token hết hạn
        localStorage.removeItem('jwtToken');
        currentUser = null;
        cachedToken = null;
        return null;
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      currentUser = null;
      cachedToken = null;
      return null;
    }
  },
  
  setCurrentUser: (user) => {
    currentUser = user;
    cachedToken = localStorage.getItem('jwtToken'); // Update cache
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      cachedToken = null; // Clear cache khi logout
    }
  },
  
  getUserRole: () => currentUser?.role || USER_ROLES.GUEST,
  
  getDealerRole: () => currentUser?.dealerRole || null,
  
  hasRole: (role) => currentUser?.role === role,
  
  hasDealerRole: (dealerRole) => currentUser?.dealerRole === dealerRole,
  
  isDealerStaff: () => currentUser?.dealerRole === DEALER_ROLES.STAFF,
  
  isDealerManager: () => currentUser?.dealerRole === DEALER_ROLES.MANAGER,
  
  isDealer: () => currentUser?.role === USER_ROLES.DEALER,
  
  hasPermission: (permission) => currentUser?.permissions?.includes(permission),
  
  canAccessDashboard: (dashboardType) => {
    const userRole = currentUser?.role;
    switch (dashboardType) {
      case 'dealer':
        return userRole === USER_ROLES.DEALER;
      case 'customer':
        return userRole === USER_ROLES.CUSTOMER;
      case 'evm':
        return userRole === USER_ROLES.EVM_ADMIN;
      default:
        return false;
    }
  },
  
  getDefaultDashboard: () => {
    return DASHBOARD_ROUTES[currentUser?.role] || '/landing';
  },
  
  // Mock login functions for testing
  loginAsDealer: () => {
    const user = {
      id: 1,
      name: 'Nguyễn Văn Dealer',
      email: 'dealer@evm.com',
      role: USER_ROLES.DEALER,
      dealerRole: DEALER_ROLES.STAFF,
      dealerId: 'DL001',
      dealerName: 'Tesla Hà Nội Center',
      permissions: ['view_sales', 'manage_inventory', 'view_customers', 'create_offers']
    };
    AuthService.setCurrentUser(user);
  },
  
  loginAsDealerManager: () => {
    const user = {
      id: 2,
      name: 'Lê Văn Manager',
      email: 'manager@evm.com',
      role: USER_ROLES.DEALER,
      dealerRole: DEALER_ROLES.MANAGER,
      dealerId: 'DL001',
      dealerName: 'Tesla Hà Nội Center',
      permissions: ['view_sales', 'manage_inventory', 'view_customers', 'create_offers', 'approve_orders', 'manage_staff', 'view_reports']
    };
    AuthService.setCurrentUser(user);
  },
  
  loginAsCustomer: () => {
    const user = {
      id: 2,
      name: 'Trần Thị Customer',
      email: 'customer@gmail.com',
      role: USER_ROLES.CUSTOMER,
      customerId: 'CU001',
      permissions: ['view_orders', 'book_service', 'view_offers']
    };
    AuthService.setCurrentUser(user);
  },
  
  loginAsAdmin: () => {
    const user = {
      id: 3,
      name: 'Lê Admin EVM',
      email: 'admin@evm.com',
      role: USER_ROLES.EVM_ADMIN,
      permissions: ['manage_dealers', 'view_system', 'manage_reports', 'system_admin']
    };
    AuthService.setCurrentUser(user);
  },
  
  logout: () => {
    currentUser = null;
    localStorage.removeItem('user');
  },

  // Registration methods for MultiStepRegister
  registerBasic: async (basicData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!basicData.email || !basicData.password || !basicData.fullName) {
        return { success: false, error: 'Vui lòng điền đầy đủ thông tin' };
      }
      
      // Generate temp user ID
      const tempUserId = `temp_${Date.now()}`;
      
      // Store temp data in localStorage
      localStorage.setItem('tempRegistration', JSON.stringify({
        tempUserId,
        ...basicData,
        createdAt: new Date().toISOString()
      }));
      
      return { success: true, tempUserId };
    } catch (error) {
      return { success: false, error: 'Có lỗi xảy ra khi đăng ký' };
    }
  },

  verifyEmail: async (verificationData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification (accept any 6-digit code)
      const code = verificationData.verificationCode;
      if (!code || code.length !== 6) {
        return { success: false, error: 'Mã xác thực phải có 6 số' };
      }
      
      // Update temp data
      const tempData = JSON.parse(localStorage.getItem('tempRegistration') || '{}');
      tempData.emailVerified = true;
      tempData.verificationCode = code;
      localStorage.setItem('tempRegistration', JSON.stringify(tempData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Xác thực email thất bại' };
    }
  },

  updatePersonalInfo: async (personalData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update temp data
      const tempData = JSON.parse(localStorage.getItem('tempRegistration') || '{}');
      Object.assign(tempData, personalData);
      tempData.personalInfoCompleted = true;
      localStorage.setItem('tempRegistration', JSON.stringify(tempData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Cập nhật thông tin cá nhân thất bại' };
    }
  },

  completeSurvey: async (surveyData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get temp data and create final user
      const tempData = JSON.parse(localStorage.getItem('tempRegistration') || '{}');
      const finalUser = {
        id: `user_${Date.now()}`,
        username: tempData.fullName,
        fullName: tempData.fullName,
        email: tempData.email,
        role: 'customer',
        provider: 'registration',
        personalInfo: tempData,
        surveyData: surveyData,
        emailVerified: tempData.emailVerified,
        createdAt: new Date().toISOString()
      };
      
      // Clean up temp data
      localStorage.removeItem('tempRegistration');
      
      // Set as current user
      AuthService.setCurrentUser(finalUser);
      
      return { success: true, user: finalUser };
    } catch (error) {
      return { success: false, error: 'Hoàn tất khảo sát thất bại' };
    }
  },

  completeRegistration: async (data) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get temp data and create final user (without survey)
      const tempData = JSON.parse(localStorage.getItem('tempRegistration') || '{}');
      const finalUser = {
        id: `user_${Date.now()}`,
        username: tempData.fullName,
        fullName: tempData.fullName,
        email: tempData.email,
        role: 'customer',
        provider: 'registration',
        personalInfo: tempData,
        surveyData: { skipped: true },
        emailVerified: tempData.emailVerified,
        createdAt: new Date().toISOString()
      };
      
      // Clean up temp data
      localStorage.removeItem('tempRegistration');
      
      // Set as current user
      AuthService.setCurrentUser(finalUser);
      
      return { success: true, user: finalUser };
    } catch (error) {
      return { success: false, error: 'Hoàn tất đăng ký thất bại' };
    }
  }
};

export default AuthService;