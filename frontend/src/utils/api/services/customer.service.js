/**
 * Customer API Service
 * Handles all customer-related API calls
 */
import { CompleteMockAPI } from '../database';

export class CustomerService {
  // Profile Management
  static async getMyProfile(userId) {
    return await CompleteMockAPI.getUserById(userId);
  }
  
  static async updateMyProfile(userId, profileData) {
    return await CompleteMockAPI.updateUser(userId, profileData);
  }
  
  // Order Management
  static async getMyOrders(userId) {
    return await CompleteMockAPI.getAllOrders({ customerId: userId });
  }
  
  static async createOrder(userId, orderData) {
    return await CompleteMockAPI.createOrder({
      ...orderData,
      customerId: userId,
      status: 'pending'
    });
  }
  
  static async getOrderById(orderId) {
    return await CompleteMockAPI.getOrderById(orderId);
  }
  
  static async cancelOrder(orderId) {
    return await CompleteMockAPI.updateOrderStatus(orderId, 'cancelled', 'Cancelled by customer');
  }
  
  // Vehicle Browsing
  static async getAllVehicles(filters = {}) {
    return await CompleteMockAPI.getAllVehicles(filters);
  }
  
  static async getVehicleById(vehicleId) {
    return await CompleteMockAPI.getVehicleById(vehicleId);
  }
  
  static async searchVehicles(searchQuery) {
    return await CompleteMockAPI.searchVehicles(searchQuery);
  }
  
  // Test Drive
  static async scheduleTestDrive(userId, testDriveData) {
    return await CompleteMockAPI.scheduleTestDrive({
      ...testDriveData,
      customerId: userId,
      status: 'scheduled'
    });
  }
  
  static async getMyTestDrives(userId) {
    return await CompleteMockAPI.getTestDrives({ customerId: userId });
  }
  
  static async cancelTestDrive(testDriveId) {
    return await CompleteMockAPI.cancelTestDrive(testDriveId);
  }
  
  // Dealers
  static async getNearbyDealers(location) {
    return await CompleteMockAPI.getNearbyDealers(location);
  }
  
  static async getDealerById(dealerId) {
    return await CompleteMockAPI.getDealerById(dealerId);
  }
  
  // Wishlist
  static async addToWishlist(userId, vehicleId) {
    const userResult = await CompleteMockAPI.getUserById(userId);
    if (userResult.success) {
      const wishlist = userResult.data.customerInfo?.wishlist || [];
      if (!wishlist.includes(vehicleId)) {
        wishlist.push(vehicleId);
        return await CompleteMockAPI.updateUser(userId, {
          customerInfo: {
            ...userResult.data.customerInfo,
            wishlist
          }
        });
      }
    }
    return userResult;
  }
  
  static async removeFromWishlist(userId, vehicleId) {
    const userResult = await CompleteMockAPI.getUserById(userId);
    if (userResult.success) {
      const wishlist = userResult.data.customerInfo?.wishlist || [];
      const updatedWishlist = wishlist.filter(id => id !== vehicleId);
      return await CompleteMockAPI.updateUser(userId, {
        customerInfo: {
          ...userResult.data.customerInfo,
          wishlist: updatedWishlist
        }
      });
    }
    return userResult;
  }
  
  static async getWishlist(userId) {
    const userResult = await CompleteMockAPI.getUserById(userId);
    if (userResult.success) {
      const wishlistIds = userResult.data.customerInfo?.wishlist || [];
      const vehicles = [];
      for (const id of wishlistIds) {
        const vehicleResult = await CompleteMockAPI.getVehicleById(id);
        if (vehicleResult.success) {
          vehicles.push(vehicleResult.data);
        }
      }
      return {
        success: true,
        data: vehicles
      };
    }
    return userResult;
  }
}

export default CustomerService;
