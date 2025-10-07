// API Service Wrappers for Each Role
import CompleteMockAPI from './completeMockAPI.js';

// ==================== ADMIN API SERVICE ====================
export class AdminAPIService {
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
}

// ==================== DEALER API SERVICE ====================
export class DealerAPIService {
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
  
  // Inventory
  static async getVehicleInventory(filters = {}) {
    return await CompleteMockAPI.getAllVehicles(filters);
  }
  
  // Analytics
  static async getDashboardAnalytics(dealerId) {
    return await CompleteMockAPI.getDashboardAnalytics('dealer', dealerId);
  }
  
  // Sales Reports
  static async getSalesReport(dealerId, period = 'month') {
    const ordersResult = await CompleteMockAPI.getAllOrders({ dealerId });
    if (!ordersResult.success) return ordersResult;
    
    const orders = ordersResult.data;
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const periodOrders = orders.filter(order => 
      new Date(order.orderDate) >= startDate
    );
    
    return {
      success: true,
      data: {
        period,
        totalOrders: periodOrders.length,
        totalRevenue: periodOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: periodOrders.length > 0 
          ? periodOrders.reduce((sum, order) => sum + order.totalAmount, 0) / periodOrders.length 
          : 0,
        deliveredOrders: periodOrders.filter(o => o.status === 'delivered').length,
        pendingOrders: periodOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
        orders: periodOrders
      }
    };
  }
}

// ==================== CUSTOMER API SERVICE ====================
export class CustomerAPIService {
  // Profile Management
  static async getProfile(customerId) {
    return await CompleteMockAPI.getUserById(customerId);
  }
  
  static async updateProfile(customerId, profileData) {
    return await CompleteMockAPI.updateUser(customerId, profileData);
  }
  
  // Order Management
  static async getMyOrders(customerId) {
    return await CompleteMockAPI.getAllOrders({ customerId });
  }
  
  static async getOrderById(orderId) {
    return await CompleteMockAPI.getOrderById(orderId);
  }
  
  static async createOrder(customerId, orderData) {
    return await CompleteMockAPI.createOrder({
      ...orderData,
      customerId
    });
  }
  
  // Vehicle Catalog
  static async getVehicleCatalog(filters = {}) {
    return await CompleteMockAPI.getAllVehicles(filters);
  }
  
  static async getVehicleDetails(vehicleId) {
    return await CompleteMockAPI.getVehicleById(vehicleId);
  }
  
  // Analytics
  static async getDashboardAnalytics(customerId) {
    return await CompleteMockAPI.getDashboardAnalytics('customer', customerId);
  }
  
  // Financing
  static async calculateFinancing(vehiclePrice, downPayment, termMonths, interestRate) {
    await CompleteMockAPI.delay();
    
    const loanAmount = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - loanAmount;
    
    return {
      success: true,
      data: {
        vehiclePrice,
        downPayment,
        loanAmount,
        termMonths,
        interestRate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        aprEffective: ((totalPayment / loanAmount) - 1) * (12 / termMonths) * 100
      }
    };
  }
  
  // Loyalty Program
  static async getLoyaltyStatus(customerId) {
    const profileResult = await CompleteMockAPI.getUserById(customerId);
    if (!profileResult.success) return profileResult;
    
    const profile = profileResult.data;
    const loyaltyPoints = profile.customerInfo?.loyaltyPoints || 0;
    const membershipLevel = profile.customerInfo?.membershipLevel || 'Bronze';
    
    // Calculate rewards based on membership level
    const rewardTiers = {
      'Bronze': { pointsRequired: 0, discount: 0.05, benefits: ['Basic Support'] },
      'Silver': { pointsRequired: 500, discount: 0.10, benefits: ['Priority Support', 'Free Consultation'] },
      'Gold': { pointsRequired: 1500, discount: 0.15, benefits: ['Priority Support', 'Free Consultation', 'Extended Warranty'] },
      'Platinum': { pointsRequired: 4000, discount: 0.20, benefits: ['VIP Support', 'Free Services', 'Exclusive Events'] },
      'Diamond': { pointsRequired: 8000, discount: 0.25, benefits: ['VIP Support', 'Premium Services', 'Exclusive Events', 'Personal Assistant'] }
    };
    
    const currentTier = rewardTiers[membershipLevel];
    const nextTierLevel = Object.keys(rewardTiers)[Object.keys(rewardTiers).indexOf(membershipLevel) + 1];
    const nextTier = nextTierLevel ? rewardTiers[nextTierLevel] : null;
    
    return {
      success: true,
      data: {
        currentLevel: membershipLevel,
        currentPoints: loyaltyPoints,
        currentTier,
        nextTier,
        pointsToNextLevel: nextTier ? Math.max(0, nextTier.pointsRequired - loyaltyPoints) : 0,
        availableRewards: [
          { name: 'Service Discount', points: 100, description: '5% off next service' },
          { name: 'Accessory Voucher', points: 250, description: '500k VND voucher for accessories' },
          { name: 'Premium Wash', points: 50, description: 'Free premium car wash' },
          { name: 'Extended Warranty', points: 1000, description: '1 year extended warranty' }
        ]
      }
    };
  }
}

// ==================== AUTHENTICATION SERVICE ====================
export class AuthAPIService {
  static async login(username, password) {
    return await CompleteMockAPI.login(username, password);
  }
  
  static async logout() {
    return await CompleteMockAPI.logout();
  }
  
  static async refreshToken(token) {
    return await CompleteMockAPI.refreshToken(token);
  }
  
  static async resetPassword(email) {
    await CompleteMockAPI.delay();
    
    const user = Object.values(CompleteMockAPI.users).find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        error: 'Email không tồn tại trong hệ thống'
      };
    }
    
    return {
      success: true,
      message: 'Link reset mật khẩu đã được gửi về email của bạn'
    };
  }
  
  static async changePassword(userId, oldPassword, newPassword) {
    await CompleteMockAPI.delay();
    
    // In real app, verify old password against hash
    return {
      success: true,
      message: 'Đổi mật khẩu thành công'
    };
  }
  
  static async updateProfile(userId, profileData) {
    return await CompleteMockAPI.updateUser(userId, profileData);
  }
}

// ==================== SHARED/UTILITY SERVICE ====================
export class UtilityAPIService {
  static formatCurrency = CompleteMockAPI.formatCurrency;
  static formatDate = CompleteMockAPI.formatDate;
  static generateId = CompleteMockAPI.generateId;
  
  static async uploadFile(file, folder = 'general') {
    await CompleteMockAPI.delay(1000);
    
    // Simulate file upload
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `/uploads/${folder}/${fileName}`;
    
    return {
      success: true,
      data: {
        fileName,
        filePath,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      }
    };
  }
  
  static async sendNotification(userId, message, type = 'info') {
    await CompleteMockAPI.delay(200);
    
    return {
      success: true,
      data: {
        notificationId: CompleteMockAPI.generateId('NOTIF'),
        userId,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
      }
    };
  }
  
  static async getNotifications(userId, limit = 10) {
    await CompleteMockAPI.delay();
    
    // Mock notifications
    const notifications = [
      {
        id: 'notif_1',
        message: 'Đơn hàng của bạn đã được xác nhận',
        type: 'success',
        timestamp: '2025-10-05T08:00:00Z',
        read: false
      },
      {
        id: 'notif_2',
        message: 'Bảo dưỡng định kỳ sắp đến hạn',
        type: 'warning',
        timestamp: '2025-10-04T15:30:00Z',
        read: true
      },
      {
        id: 'notif_3',
        message: 'Có phiên bản phần mềm mới',
        type: 'info',
        timestamp: '2025-10-03T10:15:00Z',
        read: true
      }
    ];
    
    return {
      success: true,
      data: notifications.slice(0, limit)
    };
  }
}

// Export default object with all services
export default {
  Admin: AdminAPIService,
  Dealer: DealerAPIService,
  Customer: CustomerAPIService,
  Auth: AuthAPIService,
  Utility: UtilityAPIService,
  Core: CompleteMockAPI
};