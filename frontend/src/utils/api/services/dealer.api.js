import apiClient from '../client';

/**
 * Dealer API Service
 * Provides methods for dealer-related operations including:
 * - Vehicle management
 * - Inventory management
 * - Customer management
 * - Test drive scheduling
 * - Order management
 * - Analytics and reports
 */
class DealerAPI {
  
  // ==================== DASHBOARD ====================
  
  /**
   * Get dealer dashboard data
   * GET /dealer/dashboard
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboard() {
    try {
      const response = await apiClient.get('/dealer/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy dữ liệu dashboard'
      };
    }
  }

  // ==================== VEHICLE MANAGEMENT ====================

  /**
   * Get all vehicles available for dealer
   * GET /dealer/vehicles?page=1&limit=10&search=...
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of vehicles
   */
  async getVehicles(params = {}) {
    try {
      const response = await apiClient.get('/dealer/vehicles', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách xe'
      };
    }
  }

  /**
   * Get vehicle details by ID
   * GET /dealer/vehicles/:id
   * @param {string|number} id - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   */
  async getVehicleById(id) {
    try {
      const response = await apiClient.get(`/dealer/vehicles/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin xe'
      };
    }
  }

  /**
   * Search vehicles
   * GET /dealer/vehicles/search?query=...&filters=...
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchVehicles(query, filters = {}) {
    return apiClient.get('/dealer/vehicles/search', { 
      params: { query, ...filters } 
    });
  }

  /**
   * Compare multiple vehicles
   * POST /dealer/vehicles/compare
   * @param {Array<string|number>} vehicleIds - Array of vehicle IDs to compare
   * @returns {Promise<Object>} Comparison data
   */
  async compareVehicles(vehicleIds) {
    return apiClient.post('/dealer/vehicles/compare', { vehicleIds });
  }

  // ==================== INVENTORY MANAGEMENT ====================

  /**
   * Get dealer's inventory
   * GET /dealer/inventory?filters=...
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Inventory list
   */
  async getInventory(filters = {}) {
    // Sửa lại hàm này để trả về chuẩn success/data
    try {
      const response = await apiClient.get('/dealer/inventory', { params: filters });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy kho hàng'
      };
    }
  }

  /**
   * Get stock details by ID
   * GET /dealer/inventory/:id
   * @param {string|number} stockId - Stock ID
   * @returns {Promise<Object>} Stock details
   */
  async getStockById(stockId) {
    // Sửa lại hàm này để trả về chuẩn success/data
    try {
      const response = await apiClient.get(`/dealer/inventory/${stockId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy chi tiết kho'
      };
    }
  }

  /**
   * Request stock from EVM
   * POST /dealer/inventory/request
   * @param {Object} requestData - Stock request data
   * @returns {Promise<Object>} Request result
   */
  async requestStock(requestData) {
    // Sửa lại hàm này để trả về chuẩn success/data
    try {
      const response = await apiClient.post('/dealer/inventory/request', requestData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi yêu cầu nhập kho'
      };
    }
  }

  /**
   * Update stock information
   * PUT /dealer/inventory/:id
   * @param {string|number} stockId - Stock ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated stock
   */
  async updateStock(stockId, updateData) {
    return apiClient.put(`/dealer/inventory/${stockId}`, updateData);
  }

  /**
   * Update vehicle inventory quantity
   * PUT /dealer/vehicles/:id/inventory
   * @param {string|number} id - Vehicle ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Update result
   */
  async updateInventory(id, quantity) {
    try {
      const response = await apiClient.put(`/dealer/vehicles/${id}/inventory`, { quantity });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật tồn kho'
      };
    }
  }

  /**
   * Get inventory statistics
   * GET /dealer/inventory/stats
   * @returns {Promise<Object>} Inventory stats
   */
  async getInventoryStats() {
    return apiClient.get('/dealer/inventory/stats');
  }

  // ==================== CUSTOMER MANAGEMENT ====================

  /**
   * Get all customers
   * GET /dealer/customers?page=1&limit=10
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Customer list
   */
  async getCustomers(params = {}) {
    try {
      const response = await apiClient.get('/dealer/customers', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách khách hàng'
      };
    }
  }

  /**
   * Get customer details by ID
   * GET /dealer/customers/:id
   * @param {string|number} id - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomerById(id) {
    try {
      const response = await apiClient.get(`/dealer/customers/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin khách hàng'
      };
    }
  }

  /**
   * Create new customer
   * POST /dealer/customers
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    return apiClient.post('/dealer/customers', customerData);
  }

  /**
   * Update customer information
   * PUT /dealer/customers/:id
   * @param {string|number} customerId - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise<Object>} Updated customer
   */
  async updateCustomer(customerId, customerData) {
    return apiClient.put(`/dealer/customers/${customerId}`, customerData);
  }

  /**
   * Delete customer
   * DELETE /dealer/customers/:id
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteCustomer(customerId) {
    return apiClient.delete(`/dealer/customers/${customerId}`);
  }

  /**
   * Get customer purchase history
   * GET /dealer/customers/:id/purchases
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Object>} Purchase history
   */
  async getCustomerPurchaseHistory(customerId) {
    return apiClient.get(`/dealer/customers/${customerId}/purchases`);
  }

  // ==================== TEST DRIVE MANAGEMENT ====================

  /**
   * Get all test drive appointments
   * GET /dealer/test-drives?date=...&status=...
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Test drive list
   */
  async getTestDrives(params = {}) {
    try {
      const response = await apiClient.get('/dealer/test-drives', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy lịch lái thử'
      };
    }
  }

  /**
   * Get test drive details by ID
   * GET /dealer/test-drives/:id
   * @param {string|number} testDriveId - Test drive ID
   * @returns {Promise<Object>} Test drive details
   */
  async getTestDriveById(testDriveId) {
    return apiClient.get(`/dealer/test-drives/${testDriveId}`);
  }

  /**
   * Create test drive appointment
   * POST /dealer/test-drives
   * @param {Object} testDriveData - Test drive data
   * @returns {Promise<Object>} Created test drive
   */
  async createTestDrive(testDriveData) {
    return apiClient.post('/dealer/test-drives', testDriveData);
  }

  /**
   * Update test drive status
   * PUT /dealer/test-drives/:id
   * @param {string|number} testDriveId - Test drive ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated test drive
   */
  async updateTestDrive(testDriveId, updateData) {
    return apiClient.put(`/dealer/test-drives/${testDriveId}`, updateData);
  }

  /**
   * Update test drive status
   * PUT /dealer/test-drives/:id/status
   * @param {string|number} id - Test drive ID
   * @param {string} status - New status
   * @param {string} note - Optional note
   * @returns {Promise<Object>} Update result
   */
  async updateTestDriveStatus(id, status, note = '') {
    try {
      const response = await apiClient.put(`/dealer/test-drives/${id}/status`, { status, note });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái'
      };
    }
  }

  /**
   * Cancel test drive
   * POST /dealer/test-drives/:id/cancel
   * @param {string|number} testDriveId - Test drive ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelTestDrive(testDriveId, reason) {
    return apiClient.post(`/dealer/test-drives/${testDriveId}/cancel`, { reason });
  }

  /**
   * Get test drive calendar
   * GET /dealer/test-drives/calendar?startDate=...&endDate=...
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Calendar events
   */
  async getTestDriveCalendar(startDate, endDate) {
    return apiClient.get('/dealer/test-drives/calendar', { 
      params: { startDate, endDate } 
    });
  }

  // ==================== ORDER MANAGEMENT ====================

  /**
   * Get all orders
   * GET /dealer/orders?status=...&page=1&limit=10
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Order list
   */
  async getOrders(params = {}) {
    try {
      const response = await apiClient.get('/dealer/orders', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng'
      };
    }
  }

  /**
   * Get order details by ID
   * GET /dealer/orders/:id
   * @param {string|number} id - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/dealer/orders/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin đơn hàng'
      };
    }
  }

  /**
   * Create new order
   * POST /dealer/orders
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/dealer/orders', orderData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo đơn hàng'
      };
    }
  }

  /**
   * Update order status
   * PUT /dealer/orders/:id
   * @param {string|number} orderId - Order ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated order
   */
  async updateOrder(orderId, updateData) {
    return apiClient.put(`/dealer/orders/${orderId}`, updateData);
  }

  /**
   * Update order status
   * PUT /dealer/orders/:id/status
   * @param {string|number} id - Order ID
   * @param {string} status - New status
   * @param {string} note - Optional note
   * @returns {Promise<Object>} Update result
   */
  async updateOrderStatus(id, status, note = '') {
    try {
      const response = await apiClient.put(`/dealer/orders/${id}/status`, { status, note });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái'
      };
    }
  }

  /**
   * Cancel order
   * POST /dealer/orders/:id/cancel
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelOrder(orderId, reason) {
    return apiClient.post(`/dealer/orders/${orderId}/cancel`, { reason });
  }

  // === START: PHẦN MỚI THÊM ===

  // ==================== QUOTATION MANAGEMENT ====================
  // (Cần cho CreateQuotation.jsx và QuotationList.jsx)
  
  /**
   * Get all quotations
   * GET /dealer/quotations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Quotation list
   */
  async getQuotations(params = {}) {
    try {
      const response = await apiClient.get('/dealer/quotations', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách báo giá'
      };
    }
  }

  /**
   * Create new quotation
   * POST /dealer/quotations
   * @param {Object} quotationData - Quotation data
   * @returns {Promise<Object>} Created quotation
   */
  async createQuotation(quotationData) {
    try {
      const response = await apiClient.post('/dealer/quotations', quotationData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo báo giá'
      };
    }
  }
  // --- Get quotation details (CHO UC4) ---
  /**
   * Get quotation details by ID
   * GET /dealer/quotations/:id
   * @param {string|number} id - Quotation ID
   * @returns {Promise<Object>} Quotation details
   */
  async getQuotationById(id) {
    try {
      const response = await apiClient.get(`/dealer/quotations/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin báo giá'
      };
    }
  }

  // --- Update quotation (CHO UC4) ---
  /**
   * Update existing quotation
   * PUT /dealer/quotations/:id
   * @param {string|number} id - Quotation ID
   * @param {Object} quotationData - Updated quotation data
   * @returns {Promise<Object>} Updated quotation
   */
  async updateQuotation(id, quotationData) {
    try {
      const response = await apiClient.put(`/dealer/quotations/${id}`, quotationData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật báo giá'
      };
    }
  }
  // ==================== PAYMENT MANAGEMENT ====================
  // (Cần cho PaymentForm.jsx và PaymentList.jsx)

  /**
   * Get all payments
   * GET /dealer/payments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Payment list
   */
  async getPayments(params = {}) {
    try {
      const response = await apiClient.get('/dealer/payments', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách thanh toán'
      };
    }
  }
  
  /**
   * Process payment for order
   * (ĐÃ DI CHUYỂN TỪ ORDER MANAGEMENT SANG ĐÂY)
   * POST /dealer/orders/:id/payment
   * @param {string|number} orderId - Order ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(orderId, paymentData) {
    // Sửa lại hàm này để trả về chuẩn success/data
    try {
      const response = await apiClient.post(`/dealer/orders/${orderId}/payment`, paymentData);
       return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xử lý thanh toán'
      };
    }
  }

  // === END: PHẦN MỚI THÊM ===

  // ==================== ANALYTICS & REPORTS ====================

  /**
   * Get dealer dashboard statistics
   * GET /dealer/analytics/dashboard
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats(dateRange = {}) {
    return apiClient.get('/dealer/analytics/dashboard', { params: dateRange });
  }

  /**
   * Get sales report
   * GET /dealer/analytics/sales?period=month&year=2024
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales report data
   */
  async getSalesReport(params = {}) {
    try {
      const response = await apiClient.get('/dealer/analytics/sales', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy báo cáo'
      };
    }
  }

  /**
   * Get inventory report
   * GET /dealer/analytics/inventory
   * @returns {Promise<Object>} Inventory report
   */
  async getInventoryReport() {
    return apiClient.get('/dealer/analytics/inventory');
  }

  /**
   * Get customer insights
   * GET /dealer/analytics/customers
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Customer insights data
   */
  async getCustomerInsights(filters = {}) {
    return apiClient.get('/dealer/analytics/customers', { params: filters });
  }

  /**
   * Get test drive analytics
   * GET /dealer/analytics/test-drives
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Object>} Test drive analytics
   */
  async getTestDriveAnalytics(dateRange = {}) {
    return apiClient.get('/dealer/analytics/test-drives', { params: dateRange });
  }

  /**
   * Get performance statistics
   * GET /dealer/analytics/performance
   * @returns {Promise<Object>} Performance stats
   */
  async getPerformanceStats() {
    try {
      const response = await apiClient.get('/dealer/analytics/performance');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thống kê'
      };
    }
  }

  // ==================== PROMOTIONS ====================

  /**
   * Get all promotions
   * GET /dealer/promotions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Promotion list
   */
  async getPromotions(params = {}) {
    try {
      const response = await apiClient.get('/dealer/promotions', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy khuyến mãi'
      };
    }
  }

  /**
   * Create new promotion
   * POST /dealer/promotions
   * @param {Object} promotionData - Promotion data
   * @returns {Promise<Object>} Created promotion
   */
  async createPromotion(promotionData) {
    try {
      const response = await apiClient.post('/dealer/promotions', promotionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo khuyến mãi'
      };
    }
  }

  /**
   * Update promotion
   * PUT /dealer/promotions/:id
   * @param {string|number} id - Promotion ID
   * @param {Object} promotionData - Updated promotion data
   * @returns {Promise<Object>} Updated promotion
   */
  async updatePromotion(id, promotionData) {
    try {
      const response = await apiClient.put(`/dealer/promotions/${id}`, promotionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật khuyến mãi'
      };
    }
  }

  /**
   * Delete promotion
   * DELETE /dealer/promotions/:id
   * @param {string|number} id - Promotion ID
   * @returns {Promise<Object>} Delete result
   */
  async deletePromotion(id) {
    try {
      const response = await apiClient.delete(`/dealer/promotions/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa khuyến mãi'
      };
    }
  }

  // ==================== DEALER PROFILE ====================

  /**
   * Get dealer profile information
   * GET /dealer/profile
   * @returns {Promise<Object>} Dealer profile
   */
  async getDealerProfile() {
    return apiClient.get('/dealer/profile');
  }

  /**
   * Update dealer profile
   * PUT /dealer/profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Updated profile
   */
  async updateDealerProfile(profileData) {
    return apiClient.put('/dealer/profile', profileData);
  }

  /**
   * Get dealer shop information
   * GET /dealer/shop
   * @returns {Promise<Object>} Shop information
   */
  async getShopInfo() {
    return apiClient.get('/dealer/shop');
  }

  /**
   * Update shop information
   * PUT /dealer/shop
   * @param {Object} shopData - Shop data
   * @returns {Promise<Object>} Updated shop info
   */
  async updateShopInfo(shopData) {
    return apiClient.put('/dealer/shop', shopData);
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Get dealer notifications
   * GET /dealer/notifications
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Notification list
   */
  async getNotifications(filters = {}) {
    return apiClient.get('/dealer/notifications', { params: filters });
  }

  /**
   * Mark notification as read
   * PUT /dealer/notifications/:id/read
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise<Object>} Update result
   */
  async markNotificationRead(notificationId) {
    return apiClient.put(`/dealer/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * PUT /dealer/notifications/read-all
   * @returns {Promise<Object>} Update result
   */
  async markAllNotificationsRead() {
    return apiClient.put('/dealer/notifications/read-all');
  }

// ==================== DEBT & REPORTS MANAGEMENT ====================
// (UC 1.D.2 - Báo cáo công nợ khách hàng / nhà cung cấp)

/**
 * Get customer debt report (Accounts Receivable)
 * GET /dealer/reports/customer-debt?status=...
 * @param {Object} params - Query parameters (status, customerId, etc.)
 * @returns {Promise<Object>} Customer debt report
 */
async getCustomerDebtReport(params = {}) {
  try {
    const response = await apiClient.get('/dealer/reports/customer-debt', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi lấy báo cáo công nợ khách hàng'
    };
  }
}

/**
 * Get supplier debt report (Accounts Payable)
 * GET /dealer/reports/supplier-debt?status=...
 * @param {Object} params - Query parameters (status, supplierId, etc.)
 * @returns {Promise<Object>} Supplier debt report
 */
async getSupplierDebtReport(params = {}) {
  try {
    const response = await apiClient.get('/dealer/reports/supplier-debt', { params });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi lấy báo cáo công nợ nhà cung cấp'
    };
  }
}

/**
 * Get aging report (phân tích tuổi nợ)
 * GET /dealer/reports/aging?entityType=CUSTOMER|SUPPLIER
 * @param {string} entityType - CUSTOMER or SUPPLIER
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Aging report with buckets (0-30, 31-60, 61-90, >90 days)
 */
async getAgingReport(entityType, params = {}) {
  try {
    const response = await apiClient.get('/dealer/reports/aging', { 
      params: { entityType, ...params } 
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi lấy báo cáo phân tích tuổi nợ'
    };
  }
}

/**
 * Send debt reminder to customer
 * POST /dealer/debts/:debtId/remind
 * @param {string|number} debtId - Debt ID
 * @returns {Promise<Object>} Reminder result
 */
async sendDebtReminder(debtId) {
  try {
    const response = await apiClient.post(`/dealer/debts/${debtId}/remind`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi gửi nhắc nợ'
    };
  }
}

/**
 * Send bulk debt reminders
 * POST /dealer/debts/remind-bulk
 * @param {Object} filters - Filter criteria for bulk reminders
 * @returns {Promise<Object>} Bulk reminder result
 */
async sendBulkDebtReminders(filters = {}) {
  try {
    const response = await apiClient.post('/dealer/debts/remind-bulk', filters);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi gửi nhắc nợ hàng loạt'
    };
  }
}

/**
 * Calculate outstanding balance for a customer
 * GET /dealer/customers/:customerId/outstanding
 * @param {string|number} customerId - Customer ID
 * @returns {Promise<Object>} Outstanding balance
 */
async calculateCustomerOutstanding(customerId) {
  try {
    const response = await apiClient.get(`/dealer/customers/${customerId}/outstanding`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi tính công nợ khách hàng'
    };
  }
}

/**
 * Export debt report
 * GET /dealer/reports/debt/export?format=pdf|excel&type=customer|supplier
 * @param {string} format - Export format (pdf or excel)
 * @param {string} type - Report type (customer or supplier)
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Export result with file URL
 */
async exportDebtReport(format, type, params = {}) {
  try {
    const response = await apiClient.get('/dealer/reports/debt/export', { 
      params: { format, type, ...params },
      responseType: 'blob'
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi khi xuất báo cáo'
    };
  }
}}

// Export singleton instance
export const dealerAPI = new DealerAPI();
export default DealerAPI;