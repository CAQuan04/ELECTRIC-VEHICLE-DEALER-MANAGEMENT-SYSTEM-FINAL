/**
 * Dealer API Service
 * Handles all dealer-related API calls
 */
import { CompleteMockAPI } from '../database';

export class DealerService {
  // Order Management
  static async getMyOrders(dealerId, filters = {}) {
    const ordersResult = await CompleteMockAPI.getAllOrders({
      ...filters,
      dealerId
    });
    return ordersResult;
  }
  
  static async createOrder(dealerId, orderData) {
    return await CompleteMockAPI.createOrder({
      ...orderData,
      dealerId
    });
  }
  
  static async updateOrderStatus(orderId, status, note) {
    return await CompleteMockAPI.updateOrderStatus(orderId, status, note);
  }
  
  // Customer Management
  static async getMyCustomers(dealerId) {
    const usersResult = await CompleteMockAPI.getAllUsers({ role: 'customer' });
    if (usersResult.success) {
      const myCustomers = usersResult.data.users.filter(
        customer => customer.customerInfo?.preferredDealer === dealerId
      );
      return {
        success: true,
        data: myCustomers
      };
    }
    return usersResult;
  }
  
  // Inventory Management
  static async getMyInventory(dealerId) {
    return await CompleteMockAPI.getInventory({ dealerId });
  }
  
  static async updateInventory(dealerId, vehicleId, quantity) {
    return await CompleteMockAPI.updateInventory(vehicleId, quantity);
  }
  
  // Analytics
  static async getDashboardAnalytics(dealerId) {
    return await CompleteMockAPI.getDashboardAnalytics('dealer', dealerId);
  }
  
  // Sales Management
  static async getSalesReport(dealerId, period = 'month') {
    return await CompleteMockAPI.getSalesReport(dealerId, period);
  }
  
  // Vehicle Catalog
  static async getAvailableVehicles() {
    return await CompleteMockAPI.getAllVehicles({ inStock: true });
  }
}

export default DealerService;
