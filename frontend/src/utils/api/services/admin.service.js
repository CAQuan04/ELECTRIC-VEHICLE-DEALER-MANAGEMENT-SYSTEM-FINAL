/**
 * Admin API Service
 * Handles all admin-related API calls
 */
import { CompleteMockAPI } from '../database';

export class AdminService {
  // User Management
  static async getAllUsers(filters = {}) {
    return await CompleteMockAPI.getAllUsers(filters);
  }
  
  static async getUserById(userId) {
    return await CompleteMockAPI.getUserById(userId);
  }
  
  static async createUser(userData) {
    return await CompleteMockAPI.createUser(userData);
  }
  
  static async updateUser(userId, updateData) {
    return await CompleteMockAPI.updateUser(userId, updateData);
  }
  
  static async deleteUser(userId) {
    return await CompleteMockAPI.deleteUser(userId);
  }
  
  static async bulkCreateUsers(usersData) {
    return await CompleteMockAPI.bulkCreateUsers(usersData);
  }
  
  // Analytics
  static async getDashboardAnalytics(userId) {
    return await CompleteMockAPI.getDashboardAnalytics('admin', userId);
  }
  
  // Reports
  static async exportData(dataType, filters = {}) {
    return await CompleteMockAPI.exportData(dataType, filters);
  }
  
  // System Management
  static async getSystemStats() {
    const [usersResult, ordersResult, vehiclesResult] = await Promise.all([
      CompleteMockAPI.getAllUsers(),
      CompleteMockAPI.getAllOrders(),
      CompleteMockAPI.getAllVehicles()
    ]);
    
    return {
      success: true,
      data: {
        totalUsers: usersResult.data?.users?.length || 0,
        totalOrders: ordersResult.data?.length || 0,
        totalVehicleModels: vehiclesResult.data?.length || 0,
        activeUsers: usersResult.data?.users?.filter(u => u.isActive)?.length || 0,
        completedOrders: ordersResult.data?.filter(o => o.status === 'delivered')?.length || 0,
        revenue: ordersResult.data?.reduce((sum, order) => sum + order.totalAmount, 0) || 0
      }
    };
  }
  
  // Dealer Management
  static async getAllDealers() {
    const usersResult = await CompleteMockAPI.getAllUsers({ role: 'dealer' });
    return usersResult;
  }
  
  // Vehicle Management
  static async getAllVehicles(filters = {}) {
    return await CompleteMockAPI.getAllVehicles(filters);
  }
  
  static async createVehicle(vehicleData) {
    return await CompleteMockAPI.createVehicle(vehicleData);
  }
  
  static async updateVehicle(vehicleId, updateData) {
    return await CompleteMockAPI.updateVehicle(vehicleId, updateData);
  }
  
  static async deleteVehicle(vehicleId) {
    return await CompleteMockAPI.deleteVehicle(vehicleId);
  }
}

export default AdminService;
