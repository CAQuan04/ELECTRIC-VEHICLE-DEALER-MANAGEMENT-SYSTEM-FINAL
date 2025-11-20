// Utils - Barrel Export

// Authentication
export { AuthService, USER_ROLES, DASHBOARD_ROUTES } from './auth';
export { handleGoogleAccessTokenLogin, redirectUserBasedOnRole } from './googleAuth';

// Facebook Auth - Old SDK
export { handleFacebookLoginSuccess, handleFacebookLoginError } from './facebookAuth';

// API Services
export { AuthAPI, UsersAPI, VehiclesAPI, DealersAPI, CustomersAPI } from '../services/api';

// API - New Structure
export { 
  apiClient,
  CompleteMockAPI,
  AdminService, 
  DealerService, 
  CustomerService 
} from './api';

// API - Mock Data
export * from './api/mock/data';

// Notifications
export { AuthNotifications } from './notifications';

// Default export - apiClient
import { apiClient } from './api';
export default apiClient;
