// Role-based access control utilities
export const USER_ROLES = {
  DEALER: 'dealer',
  CUSTOMER: 'customer', 
  EVM_ADMIN: 'evm_admin',
  GUEST: 'guest'
};

export const DASHBOARD_ROUTES = {
  [USER_ROLES.DEALER]: '/dealer-dashboard',
  [USER_ROLES.CUSTOMER]: '/customer-dashboard', 
  [USER_ROLES.EVM_ADMIN]: '/evm-dashboard',
  [USER_ROLES.GUEST]: '/landing'
};

// Mock user data - Replace with real authentication
let currentUser = null; // No default user - require login

export const AuthService = {
  getCurrentUser: () => {
    // Check localStorage first
    const savedUser = localStorage.getItem('user');
    if (savedUser && !currentUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        currentUser = null;
      }
    }
    return currentUser;
  },
  
  setCurrentUser: (user) => {
    currentUser = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  
  getUserRole: () => currentUser?.role || USER_ROLES.GUEST,
  
  hasRole: (role) => currentUser?.role === role,
  
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
      dealerId: 'DL001',
      permissions: ['view_sales', 'manage_inventory', 'view_customers', 'create_offers']
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
  }
};

export default AuthService;