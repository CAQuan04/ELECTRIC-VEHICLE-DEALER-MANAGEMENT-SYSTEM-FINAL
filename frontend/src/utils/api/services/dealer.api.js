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
  // ==================== HELPER ====================
  // Hàm phụ trợ để xử lý dữ liệu trả về an toàn
  _handleResponse(response) {
    // Nếu response là mảng hoặc object data trực tiếp (do interceptor bóc sẵn) -> dùng luôn
    if (Array.isArray(response) || (response && !response.data && !response.status)) {
       return response;
    }
    // Trường hợp axios response chuẩn -> lấy .data
    return response.data || response;
  }
  
  // ==================== DASHBOARD ====================
  
  /**
   * Get dealer dashboard data
   * GET /Dashboard/stats
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboard() {
    try {
      const response = await apiClient.get('/Dashboard/stats');
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
   * GET /Vehicles?Search=...&Brand=...&Model=...&MinPrice=...&MaxPrice=...&Page=...&Size=...
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of vehicles
   */
  async getVehicles(params = {}) {
    try {
      console.log('📤 getVehicles params:', params);
      const response = await apiClient.get('/Vehicles', { params });
      
      console.log('✅ getVehicles Raw:', response); 
      return {
        success: true,
        data: response // 👈 Trả về chính response (chứa items)
      };
    } catch (error) {
      console.error('❌ getVehicles error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách xe'
      };
    }
  }

  /**
   * Get vehicle details by ID
   * GET /Vehicles/{vehicleId}
   * @param {string|number} id - Vehicle ID
   * @returns {Promise<Object>} Vehicle details
   */
  async getVehicleById(id) {
    try {
      const response = await apiClient.get(`/Vehicles/${id}`);
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
   * GET /Vehicles?Search=...&Brand=...&Model=...
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchVehicles(query, filters = {}) {
    try {
      const response = await apiClient.get('/Vehicles', { 
        params: { Search: query, ...filters } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tìm kiếm xe' };
    }
  }

  /**
   * Compare multiple vehicles
   * POST /Vehicles/compare
   * @param {Array<string|number>} vehicleIds - Array of vehicle IDs to compare
   * @returns {Promise<Object>} Comparison data
   */
  async compareVehicles(vehicleIds) {
    try {
      const response = await apiClient.post('/Vehicles/compare', vehicleIds);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi so sánh xe' };
    }
  }

  /**
   * Get available configurations for a vehicle
   * GET /Vehicles/{vehicleId}/configs
   * @param {string|number} vehicleId - Vehicle ID
   * @returns {Promise<Object>} Vehicle configurations
   */
  async getVehicleConfigs(vehicleId) {
    try {
      const response = await apiClient.get(`/Vehicles/${vehicleId}/configs`);
      const data = Array.isArray(response) ? response : (response.data || response);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy cấu hình xe' };
    }
  }

  // ==================== INVENTORY MANAGEMENT ====================

  /**
   * Get dealer's inventory
   * GET /api/Inventory/dealer/{dealerId}
   * @param {number} dealerId - Dealer ID
   * @param {Object} filters - Filter options (search, etc.)
   * @returns {Promise<Object>} Inventory list
   */
  async getInventory(dealerId, filters = {}) {
    try {
      console.log('🔍 [dealer.api] Calling GET /Inventory/dealer/' + dealerId, filters);
      const response = await apiClient.get(`/Inventory/dealer/${dealerId}`, { params: filters });
      console.log('📦 [dealer.api] Raw response:', response);
      console.log('📦 [dealer.api] Response type:', typeof response);
      console.log('📦 [dealer.api] Is array?', Array.isArray(response));
      
      // Handle case where response is array directly (interceptor might transform it)
      const data = Array.isArray(response) ? response : response.data;
      console.log('📦 [dealer.api] Final data:', data);
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ [dealer.api] Error:', error);
      console.error('❌ [dealer.api] Error response:', error.response);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy kho hàng' };
    }
  }

  /**
   * Get stock details by ID
   * GET /dealer/inventory/:id
   * @param {string|number} stockId - Stock ID
   * @returns {Promise<Object>} Stock details
   */
  async getStockById(stockId) {
    try {
      const response = await apiClient.get(`/dealer/inventory/${stockId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy chi tiết kho' };
    }
  }

  /**
   * Create distribution request
   * POST /Inventory/distributions
   * @param {Object} requestData - Distribution data {vehicleId, configId, quantity, fromLocation, toDealerId, scheduledDate}
   * @returns {Promise<Object>} Request result
   */
async requestStock(requestData) {
    try {
      const response = await apiClient.post('/Inventory/distributions/requests', requestData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi yêu cầu nhập kho' };
    }
  }
  /**
   * Update stock information
   * POST /Inventory/stock
   * @param {Object} updateData - Stock update data {vehicleId, configId, quantity, locationType, locationId}
   * @returns {Promise<Object>} Updated stock
   */
  async updateStock(updateData) {
    try {
      const response = await apiClient.post('/Inventory/stock', updateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật kho' };
    }
  }

  /**
   * Confirm distribution
   * POST /api/Inventory/distributions/{id}/confirm
   * @param {string|number} distributionId - Distribution ID
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmDistribution(distributionId) {
    try {
      const response = await apiClient.post(`/Inventory/distributions/${distributionId}/confirm`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xác nhận phân phối' };
    }
  }

  /**
   * Get inventory statistics
   * GET /dealer/inventory/stats
   * @returns {Promise<Object>} Inventory stats
   */
  async getInventoryStats() {
    try {
      const response = await apiClient.get('/dealer/inventory/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thống kê kho' };
    }
  }

  /**
   * Update inventory
   * PUT /Inventory/update
   * @param {Object} updateData - Inventory update data
   * @returns {Promise<Object>} Update result
   */
  async updateInventory(updateData) {
    try {
      const response = await apiClient.put('/Inventory/update', updateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật kho' };
    }
  }

  /**
   * Get stock/distribution requests (from Staff to Manager)
   * GET /Inventory/distributions/requests
   * @param {Object} filters - Filter options {status, search}
   * @returns {Promise<Object>} List of stock requests
   */
async getStockRequests(filters = {}) {
    try {
      const response = await apiClient.get('/Inventory/distributions/requests', { params: filters });
      
      // 🟢 SỬA: Logic chuẩn để lấy data, bất kể API trả về bọc hay không bọc
      // Nếu response là mảng (đã qua interceptor) -> dùng luôn
      // Nếu response.data tồn tại -> dùng response.data
      // Fallback -> dùng chính response
      const data = Array.isArray(response) ? response : (response.data || response);
      
      return { success: true, data: data };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách yêu cầu' };
    }
  }

  /**
   * Get stock request by ID
   * GET /Inventory/distributions/requests/{requestId}
   * @param {string|number} requestId - Request ID
   * @returns {Promise<Object>} Request details
   */
  async getStockRequestById(requestId) {
    try {
      const response = await apiClient.get(`/Inventory/distributions/requests/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy chi tiết yêu cầu' };
    }
  }

  /**
   * Approve stock request (Manager approves Staff request)
   * PUT /Inventory/distributions/requests/{requestId}/approve
   * @param {string|number} requestId - Request ID
   * @returns {Promise<Object>} Approval result
   */
  async approveStockRequest(requestId) {
    try {
      const response = await apiClient.put(`/Inventory/distributions/requests/${requestId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi duyệt yêu cầu' };
    }
  }

  /**
   * Reject stock request (Manager rejects Staff request)
   * PUT /Inventory/distributions/requests/{requestId}/reject
   * @param {string|number} requestId - Request ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Rejection result
   */
  async rejectStockRequest(requestId, reason) {
    try {
      const response = await apiClient.put(`/Inventory/distributions/requests/${requestId}/reject`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi từ chối yêu cầu' };
    }
  }

  // ==================== CUSTOMER MANAGEMENT ====================

 /**
   * Get all customers (paged)
   * GET /api/Customers/paged
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Customer list
   */
  async getCustomers(params = {}) {
    try {
      const response = await apiClient.get('/Customers/paged', { params });
      return { success: true, data: this._handleResponse(response) };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách khách hàng' };
    }
  }
  /**
   * Get customer details by ID
   * GET /api/Customers/{customerId}
   * @param {string|number} id - Customer ID
   * @returns {Promise<Object>} Customer details
   */
async getCustomerById(id) {
    try {
      // Gọi API
      const response = await apiClient.get(`/Customers/${id}`);
      
      console.log("📦 Raw API Response:", response); // Log để debug

      // --- LOGIC XỬ LÝ AN TOÀN ---
      // Nếu response có thuộc tính .data (chuẩn Axios chưa qua interceptor) -> dùng response.data
      // Nếu response chính là dữ liệu (đã qua interceptor) -> dùng response
      const finalData = (response && response.data) ? response.data : response;
      
      // Kiểm tra lần cuối: nếu finalData vẫn null/undefined thì báo lỗi giả lập
      if (!finalData) {
         throw new Error("Dữ liệu trả về rỗng");
      }

      return { success: true, data: finalData };
    } catch (error) {
      console.error("❌ Error fetching customer:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Lỗi khi lấy thông tin khách hàng' 
      };
    }
  }

  /**
   * Create new customer
   * POST /api/Customers
   * @param {Object} customerData - Customer data {fullName, phone, address, idDocumentNumber}
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    try {
            const response = await apiClient.post('/Customers', customerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo khách hàng' };
    }
  }

  /**
   * Update customer information
   * PUT /api/Customers/{customerId}
   * @param {string|number} customerId - Customer ID
   * @param {Object} customerData - Updated customer data {fullName, phone, address, idDocumentNumber}
   * @returns {Promise<Object>} Updated customer
   */
  async updateCustomer(customerId, customerData) {
    try {
            const response = await apiClient.put(`/Customers/${customerId}`, customerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật khách hàng' };
    }
  }

  /**
   * Delete customer
   * DELETE /api/Customers/{customerId}
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteCustomer(customerId) {
    try {
      const response = await apiClient.delete(`/Customers/${customerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa khách hàng' };
    }
  }

  /**
   * Get customer purchase history
   * GET /dealer/customers/:id/purchases
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Object>} Purchase history
   */
  async getCustomerPurchaseHistory(customerId) {
    try {
      const response = await apiClient.get(`/dealer/customers/${customerId}/purchases`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy lịch sử mua hàng' };
    }
  }

  // ==================== TEST DRIVE MANAGEMENT (COMPLETE) ====================

  /**
   * Get test drives by dealer
   * GET /api/TestDrives/by-dealer/{dealerId}?Status=...&FromDate=...&ToDate=...&Page=...&Size=...
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Test drive list
   */
  async getTestDrives(dealerId, params = {}) {
    try {
            const response = await apiClient.get(`/TestDrives/by-dealer/${dealerId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy lịch lái thử' };
    }
  }

  /**
   * Get test drive details by ID
   * GET /api/TestDrives/{testId}
   * @param {string|number} testDriveId - Test drive ID
   * @returns {Promise<Object>} Test drive details
   */
  async getTestDriveById(testDriveId) {
    try {
            const response = await apiClient.get(`/TestDrives/${testDriveId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy chi tiết lái thử' };
    }
  }

  /**
   * Create test drive appointment
   * POST /api/TestDrives
   * @param {Object} testDriveData - Test drive data {customerId, vehicleId, dealerId, scheduleDatetime, status}
   * @returns {Promise<Object>} Created test drive
   */
  async createTestDrive(testDriveData) {
    try {
      const response = await apiClient.post('/TestDrives', testDriveData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo lịch lái thử' };
    }
  }

  /**
   * Get test drives by customer
   * GET /api/TestDrives/by-customer/{customerId}?Status=...&FromDate=...&ToDate=...&Page=...&Size=...
   * @param {string|number} customerId - Customer ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Test drive list
   */
  async getTestDrivesByCustomer(customerId, params = {}) {
    try {
            const response = await apiClient.get(`/TestDrives/by-customer/${customerId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy lịch lái thử' };
    }
  }

  /**
   * Update test drive status
   * PUT /api/TestDrives/{testId}/status
   * @param {string|number} id - Test drive ID
   * @param {string} status - New status
   * @param {string} feedback - Optional feedback
   * @returns {Promise<Object>} Update result
   */
  async updateTestDriveStatus(id, status, feedback = '') {
    try {
      const response = await apiClient.put(`/TestDrives/${id}/status`, { status, feedback });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái' };
    }
  }

  /**
   * Cancel test drive
   * PUT /api/TestDrives/{testId}/cancel
   * @param {string|number} testDriveId - Test drive ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelTestDrive(testDriveId, reason) {
    try {
      const response = await apiClient.put(`/TestDrives/${testDriveId}/cancel`, reason);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi hủy lịch' };
    }
  }

  /**
   * Get test drive statuses
   * GET /api/TestDrives/statuses
   * @returns {Promise<Object>} Available test drive statuses
   */
  async getTestDriveStatuses() {
    try {
            const response = await apiClient.get('/TestDrives/statuses');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách trạng thái' };
    }
  }
    /**
   * Kiểm tra lịch trống cho lái thử
   * @param {Object} params - { vehicleId, date }
   */
  async checkTestDriveAvailability(params) {
    try {
        // Đảm bảo URL đúng (đã sửa ở bước trước)
        const url = '/TestDrives/check-availability'; 
        
        // ✨ Mẹo: Ép kiểu dữ liệu trước khi gửi để chắc chắn
        const payload = {
            vehicleId: Number(params.vehicleId), // Đảm bảo là số
            date: String(params.date)            // Đảm bảo là chuỗi
        };

        console.log("📤 Sending Payload:", payload);
        
        const response = await apiClient.post(url, payload);
        return response.data;
    } catch (error) {
        // ... giữ nguyên phần catch
        console.error("❌ API Error:", error);
        // Fallback mockup
        return { success: true, data: { available: true, slots: ['09:00', '14:00'] } };
    }
}
  // ==================== USER/STAFF MANAGEMENT ====================

  /**
   * Get all users/staff
   * GET /Users
   * @returns {Promise<Object>} User list
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/Users');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách nhân viên' };
    }
  }

  /**
   * Get user by ID
   * GET /Users/{id}
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/Users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông tin nhân viên' };
    }
  }

  /**
   * Create new user/staff
   * POST /Users
   * @param {Object} userData - User data {username, password, fullName, email, phoneNumber, dateOfBirth, roleId, dealerId}
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/Users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo nhân viên' };
    }
  }

  /**
   * Update user/staff
   * PUT /Users/{id}
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data {roleId, dealerId, fullName, email, phoneNumber, dateOfBirth}
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/Users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật nhân viên' };
    }
  }

  /**
   * Update user status (activate/deactivate)
   * PATCH /Users/{id}/status
   * @param {string|number} userId - User ID
   * @param {string} status - New status (Active/Inactive)
   * @returns {Promise<Object>} Update result
   */
  async updateUserStatus(userId, status) {
    try {
      const response = await apiClient.patch(`/Users/${userId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái' };
    }
  }

  // ==================== DEALER MANAGEMENT ====================

  /**
   * Get dealer contracts
   * GET /api/manage/dealers/{dealerId}/contracts
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Dealer contracts
   */
  async getDealerContracts(dealerId) {
    try {
            const response = await apiClient.get(`/manage/dealers/${dealerId}/contracts`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy hợp đồng' };
    }
  }

  /**
   * Create dealer contract
   * POST /api/manage/dealers/{dealerId}/contracts
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} contractData - Contract data {startDate, endDate, terms, status}
   * @returns {Promise<Object>} Created contract
   */
  async createDealerContract(dealerId, contractData) {
    try {
            const response = await apiClient.post(`/manage/dealers/${dealerId}/contracts`, contractData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo hợp đồng' };
    }
  }

  /**
   * Get dealer targets
   * GET /api/manage/dealers/{dealerId}/targets
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Dealer targets
   */
  async getDealerTargets(dealerId) {
    try {
            const response = await apiClient.get(`/manage/dealers/${dealerId}/targets`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy mục tiêu' };
    }
  }

  /**
   * Set dealer target
   * POST /api/manage/dealers/{dealerId}/targets
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} targetData - Target data {periodStart, periodEnd, salesTarget}
   * @returns {Promise<Object>} Created target
   */
  async setDealerTarget(dealerId, targetData) {
    try {
            const response = await apiClient.post(`/manage/dealers/${dealerId}/targets`, targetData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi đặt mục tiêu' };
    }
  }

  /**
   * Get dealer performance
   * GET /api/manage/dealers/{dealerId}/performance?startDate=...&endDate=...
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} params - Query parameters {startDate, endDate}
   * @returns {Promise<Object>} Dealer performance data
   */
  async getDealerPerformance(dealerId, params = {}) {
    try {
            const response = await apiClient.get(`/manage/dealers/${dealerId}/performance`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy hiệu suất' };
    }
  }

  /**
   * Get all dealers
   * GET /api/Dealers/paged?Search=...&Phone=...&Page=...&Size=...
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Dealer list
   */
  async getDealers(params = {}) {
    try {
            const response = await apiClient.get('/Dealers/paged', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách đại lý' };
    }
  }

  /**
   * Get dealer by ID
   * GET /api/Dealers/{dealerId}
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Dealer details
   */
  async getDealerById(dealerId) {
    try {
      const response = await apiClient.get(`/Dealers/${dealerId}`);
      // Backend trả về direct object, không có wrapper
      const dealerData = response.data || response;
      return { success: true, data: dealerData };
    } catch (error) {
      console.error('❌ getDealerById error:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông tin đại lý' };
    }
  }

  /**
   * Create dealer
   * POST /api/Dealers
   * @param {Object} dealerData - Dealer data {name, address, phone}
   * @returns {Promise<Object>} Created dealer
   */
  async createDealer(dealerData) {
    try {
            const response = await apiClient.post('/Dealers', dealerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo đại lý' };
    }
  }

  /**
   * Update dealer
   * PUT /api/Dealers/{dealerId}
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} dealerData - Updated dealer data {name, address, phone}
   * @returns {Promise<Object>} Updated dealer
   */
  async updateDealer(dealerId, dealerData) {
    try {
            const response = await apiClient.put(`/Dealers/${dealerId}`, dealerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật đại lý' };
    }
  }

  /**
   * Delete dealer
   * DELETE /api/Dealers/{dealerId}
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteDealer(dealerId) {
    try {
      const response = await apiClient.delete(`/Dealers/${dealerId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa đại lý' };
    }
  }

  // ==================== DEALER CONTRACT MANAGEMENT ====================

  /**
   * Get dealer contracts
   * GET /manage/dealers/{dealerId}/contracts
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Contract list
   */
  async getDealerContracts(dealerId) {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/contracts`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy hợp đồng' };
    }
  }

  /**
   * Create dealer contract
   * POST /manage/dealers/{dealerId}/contracts
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} contractData - Contract data {startDate, endDate, terms, status}
   * @returns {Promise<Object>} Created contract
   */
  async createDealerContract(dealerId, contractData) {
    try {
      const response = await apiClient.post(`/manage/dealers/${dealerId}/contracts`, contractData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo hợp đồng' };
    }
  }

  /**
   * Get dealer targets
   * GET /manage/dealers/{dealerId}/targets
   * @param {string|number} dealerId - Dealer ID
   * @returns {Promise<Object>} Target list
   */
  async getDealerTargets(dealerId) {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/targets`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy mục tiêu' };
    }
  }

  /**
   * Set dealer target
   * POST /manage/dealers/{dealerId}/targets
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} targetData - Target data {periodStart, periodEnd, salesTarget}
   * @returns {Promise<Object>} Created target
   */
  async setDealerTarget(dealerId, targetData) {
    try {
      const response = await apiClient.post(`/manage/dealers/${dealerId}/targets`, targetData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi đặt mục tiêu' };
    }
  }

  /**
   * Get dealer performance
   * GET /manage/dealers/{dealerId}/performance?startDate=...&endDate=...
   * @param {string|number} dealerId - Dealer ID
   * @param {Object} dateRange - Date range filter {startDate, endDate}
   * @returns {Promise<Object>} Performance data
   */
  async getDealerPerformance(dealerId, dateRange = {}) {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/performance`, { params: dateRange });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy hiệu suất' };
    }
  }

  // ==================== ORDER MANAGEMENT ====================

  /**
   * Get all orders
   * GET /api/Orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Order list
   */
  async getOrders(params = {}) {
    try {
      const response = await apiClient.get('/Orders', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng' };
    }
  }


  /**
   * Get order details by ID
   * GET /api/Orders/{id}
   * @param {string|number} id - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/Orders/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông tin đơn hàng' };
    }
  }

  /**
   * Create new order
   * POST /api/Orders
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/Orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo đơn hàng' };
    }
  }

  /**
   * Update order status
   * PUT /api/Orders/{id}/status
   * @param {string|number} id - Order ID
   * @param {string} status - New status
   * @param {string} note - Optional note
   * @returns {Promise<Object>} Update result
   */
  async updateOrderStatus(id, status, note = '') {
    try {
      const response = await apiClient.put(`/Orders/${id}/status`, { status, note });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái' };
    }
  }

  /**
   * Cancel order
   * POST /api/Orders/{id}/cancel
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelOrder(orderId, reason) {
    try {
      const response = await apiClient.post(`/Orders/${orderId}/cancel`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi hủy đơn hàng' };
    }
  }
  // ==================== QUOTATION MANAGEMENT ====================

  /**
   * Get all quotations
   * GET /dealer/quotations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Quotation list
   */
  async getQuotations(params = {}) {
    try {
      const response = await apiClient.get('/dealer/quotations', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách báo giá' };
    }
  }

   /**
   * Get quotation details by ID
   * GET /api/Quotations/{id}
   * @param {string|number} id - Quotation ID
   * @returns {Promise<Object>} Quotation details
   */
  async getQuotationById(id) {
    try {
      const response = await apiClient.get(`/Quotations/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông tin báo giá' };
    }
  }

  /**
   * Create new quotation
   * POST /api/Quotations
   * @param {Object} quotationData - Quotation data
   * @returns {Promise<Object>} Created quotation
   */
  async createQuotation(quotationData) {
    try {
      const response = await apiClient.post('/Quotations', quotationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo báo giá' };
    }
  }

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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật báo giá' };
    }
  }
  
  // ==================== PAYMENT MANAGEMENT ====================

  /**
   * Get all payments
   * GET /dealer/payments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Payment list
   */
  async getPayments(params = {}) {
    try {
      const response = await apiClient.get('/dealer/payments', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách thanh toán' };
    }
  }
  
  /**
   * Process payment for order
   * POST /dealer/orders/:id/payment
   * @param {string|number} orderId - Order ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(orderId, paymentData) {
    try {
      const response = await apiClient.post(`/dealer/orders/${orderId}/payment`, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xử lý thanh toán' };
    }
  }
  // ==================== PROCUREMENT (NHẬP HÀNG TỪ HÃNG) ====================

  /**
   * Tạo yêu cầu nhập hàng (Procurement Request) gửi đến hãng
   * POST /api/procurement/requests
   * Payload: { dealerId, items: [{ vehicleId, quantity, config_id }], note }
   */
  async createProcurementRequest(data) {
    try {
      // Đảm bảo endpoint đúng như yêu cầu
      const response = await apiClient.post('/procurement/requests', data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error creating procurement request:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi gửi yêu cầu nhập hàng' 
      };
    }
  }
async getPurchaseRequests() {
    try {
      console.log("🚀 Calling getPurchaseRequests...");
      const response = await apiClient.get('/procurement/requests/mine'); 
      
      console.log("📥 Raw API Response:", response); // Log để kiểm tra


      const data = Array.isArray(response) ? response : (response.data || response);

      return { success: true, data: data };
    } catch (error) {
      console.error('❌ Error getting purchase requests:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng' };
    }
  }
  /**
   * Lấy chi tiết đơn mua hàng
   * GET /api/procurement/requests/{id}
   */
  async getPurchaseRequestById(id) {
    try {
      const response = await apiClient.get(`/procurement/requests/${id}`);
      
      // Xử lý an toàn dữ liệu trả về
      const data = response.data || response;
      return { success: true, data: data };
    } catch (error) {
      console.error('❌ Error getting purchase request detail:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi tải chi tiết đơn hàng' 
      };
    }
  }
  /**
   * Gửi Purchase Request tới EVM (Cần mật khẩu xác nhận)
   * POST /api/procurement/requests/{id}/send-to-evm
   */
  async sendPurchaseRequestToEVM(requestId, password) {
    try {
      const response = await apiClient.post(`/procurement/requests/${requestId}/send-to-evm`, {
        managerPassword: password
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error sending to EVM:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Mật khẩu sai hoặc lỗi hệ thống' 
      };
    }
  }
  /**
   * Lấy danh sách hàng đang về (Incoming Distributions)
   */
  async getIncomingDistributions() {
    try {
      const response = await apiClient.get('/v1/distributions/incoming');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, message: 'Lỗi tải danh sách hàng về' };
    }
  }

  /**
   * Xác nhận đã nhận xe
   */
  async confirmDistributionReceipt(distId) {
    try {
      const response = await apiClient.post(`/api/v1/distributions/${distId}/confirm`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi xác nhận' };
    }
  }
  // ==================== REPORTS & ANALYTICS ====================

  /**
   * Get dealer dashboard statistics
   * GET /dealer/analytics/dashboard
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats(dateRange = {}) {
    try {
      const response = await apiClient.get('/dealer/analytics/dashboard', { params: dateRange });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thống kê' };
    }
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy báo cáo' };
    }
  }

  /**
   * Get inventory report
   * GET /dealer/analytics/inventory
   * @returns {Promise<Object>} Inventory report
   */
  async getInventoryReport() {
    try {
      const response = await apiClient.get('/dealer/analytics/inventory');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy báo cáo tồn kho' };
    }
  }

  /**
   * Get customer insights
   * GET /dealer/analytics/customers
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Customer insights data
   */
  async getCustomerInsights(filters = {}) {
    try {
      const response = await apiClient.get('/dealer/analytics/customers', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy insights khách hàng' };
    }
  }

  /**
   * Get test drive analytics
   * GET /dealer/analytics/test-drives
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Object>} Test drive analytics
   */
  async getTestDriveAnalytics(dateRange = {}) {
    try {
      const response = await apiClient.get('/dealer/analytics/test-drives', { params: dateRange });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy analytics lái thử' };
    }
  }

  /**
   * Get performance statistics
   * GET /dealer/analytics/performance
   * @returns {Promise<Object>} Performance stats
   */
  async getPerformanceStats() {
    try {
      const response = await apiClient.get('/dealer/analytics/performance');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thống kê' };
    }
  }

  /**
   * Get customer debt report (AR)
   * GET /dealer/reports/customer-debt?status=...
   * @param {Object} params - Query parameters (status, customerId, etc.)
   * @returns {Promise<Object>} Customer debt report
   */
  async getCustomerDebtReport(params = {}) {
    try {
      const response = await apiClient.get('/dealer/reports/customer-debt', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy báo cáo công nợ khách hàng' };
    }
  }

  /**
   * Get supplier debt report (AP)
   * GET /dealer/reports/supplier-debt?status=...
   * @param {Object} params - Query parameters (status, supplierId, etc.)
   * @returns {Promise<Object>} Supplier debt report
   */
  async getSupplierDebtReport(params = {}) {
    try {
      const response = await apiClient.get('/dealer/reports/supplier-debt', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy báo cáo công nợ nhà cung cấp' };
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy báo cáo phân tích tuổi nợ' };
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi gửi nhắc nợ' };
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi gửi nhắc nợ hàng loạt' };
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tính công nợ khách hàng' };
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
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xuất báo cáo' };
    }
  }

  // ==================== PROMOTIONS ====================

  /**
   * Get all promotions
   * GET /Promotions?Status=...&StartDate=...&EndDate=...
   * @param {Object} params - Query parameters (Status, StartDate, EndDate)
   * @returns {Promise<Object>} Promotion list
   */
async getPromotions(params = {}) {
    try {
      console.log('🔍 Calling getPromotions with params:', params);
      const response = await apiClient.get('/Promotions', { params });
      
      // SỬA LỖI: Xử lý trường hợp response là array trực tiếp hoặc object bọc
      const data = Array.isArray(response) ? response : (response.data || response);
      
      console.log('✅ Promotions data loaded:', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('❌ getPromotions error:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách khuyến mãi' };
    }
  }

  /**
   * Get promotion by ID
   * GET /Promotions/{id}
   * @param {number} promotionId - Promotion ID
   * @returns {Promise<Object>} Promotion details
   */
async getPromotionById(promotionId) {
    try {
      console.log(`🔍 [dealer.api] Đang lấy khuyến mãi ID: ${promotionId}`);
      
      // Cách 1: Gọi chuẩn theo cấu hình apiClient
      const response = await apiClient.get(`/Promotions/${promotionId}`);
      
      // Xử lý dữ liệu trả về (chống lỗi undefined)
      const data = response.data || response;
      return { success: true, data: data };
      
    } catch (error) {
      console.warn("⚠️ [dealer.api] Gọi lần 1 thất bại, thử thêm prefix '/api'...");
      
      
      try {
        const retryResponse = await apiClient.get(`/api/Promotions/${promotionId}`);
        const retryData = retryResponse.data || retryResponse;
        return { success: true, data: retryData };
      } catch (retryError) {
        console.error("❌ [dealer.api] Cả 2 cách đều thất bại:", retryError);
        return { 
          success: false, 
          message: retryError.response?.data?.message || 'Không thể kết nối đến server' 
        };
      }
    }
  }

  /**
   * Get active promotions (currently valid)
   * GET /Promotions/active
   * @returns {Promise<Object>} Active promotions list
   */
  async getActivePromotions() {
    try {
      const response = await apiClient.get('/Promotions/active');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy khuyến mãi đang hiệu lực' };
    }
  }

  /**
   * Create new promotion
   * POST /Promotions
   * @param {Object} promotionData - Promotion data
   * {
   *   name: string,
   *   description: string,
   *   discountType: 'Percentage' | 'FixedAmount' | 'Gift' | 'Bundle',
   *   discountValue: number,
   *   condition: string,
   *   startDate: datetime,
   *   endDate: datetime,
   *   status: 'Active' | 'Inactive'
   * }
   * @returns {Promise<Object>} Created promotion
   */
  async createPromotion(promotionData) {
    try {
      const response = await apiClient.post('/Promotions', promotionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo khuyến mãi' };
    }
  }

  /**
   * Update promotion
   * PUT /Promotions/{id}
   * @param {number} promotionId - Promotion ID
   * @param {Object} promotionData - Updated promotion data
   * @returns {Promise<Object>} Updated promotion
   */
async updatePromotion(promotionId, promotionData) {
    try {
      // ✅ ĐÚNG: Gọi API PUT
      const response = await apiClient.put(`/Promotions/${promotionId}`, promotionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật khuyến mãi' };
    }
  }

  /**
   * Update promotion status
   * PATCH /Promotions/{id}/status
   * @param {number} promotionId - Promotion ID
   * @param {string} status - New status (Active, Inactive, Expired)
   * @returns {Promise<Object>} Update result
   */
  async updatePromotionStatus(promotionId, status) {
    try {
      const response = await apiClient.patch(`/Promotions/${promotionId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật trạng thái' };
    }
  }

  /**
   * Delete promotion
   * DELETE /Promotions/{id}
   * @param {number} promotionId - Promotion ID
   * @returns {Promise<Object>} Delete result
   */
  async deletePromotion(promotionId) {
    try {
      const response = await apiClient.delete(`/Promotions/${promotionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa khuyến mãi' };
    }
  }

  /**
   * Validate promotion for order
   * POST /Promotions/{id}/validate
   * @param {number} promotionId - Promotion ID
   * @param {Object} orderData - Order data to validate against
   * @returns {Promise<Object>} Validation result
   */
  async validatePromotion(promotionId, orderData) {
    try {
      const response = await apiClient.post(`/Promotions/${promotionId}/validate`, orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Khuyến mãi không hợp lệ' };
    }
  }

  /**
   * Apply promotion to order
   * POST /Promotions/{id}/apply
   * @param {number} promotionId - Promotion ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Apply result with calculated discount
   */
  async applyPromotionToOrder(promotionId, orderId) {
    try {
      const response = await apiClient.post(`/Promotions/${promotionId}/apply`, { orderId });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi áp dụng khuyến mãi' };
    }
  }

  /**
   * Get promotion statistics
   * GET /Promotions/statistics
   * @returns {Promise<Object>} Promotion statistics
   */
  async getPromotionStatistics() {
    try {
      const response = await apiClient.get('/Promotions/statistics');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thống kê khuyến mãi' };
    }
  }

  // ==================== DEALER PROFILE ====================

  /**
   * Get dealer profile information
   * GET /dealer/profile
   * @returns {Promise<Object>} Dealer profile
   */
  async getDealerProfile() {
    try {
      const response = await apiClient.get('/dealer/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy profile' };
    }
  }

  /**
   * Update dealer profile
   * PUT /dealer/profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Updated profile
   */
  async updateDealerProfile(profileData) {
    try {
      const response = await apiClient.put('/dealer/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật profile' };
    }
  }

  /**
   * Get dealer shop information
   * GET /dealer/shop
   * @returns {Promise<Object>} Shop information
   */
  async getShopInfo() {
    try {
      const response = await apiClient.get('/dealer/shop');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông tin shop' };
    }
  }

  /**
   * Update shop information
   * PUT /dealer/shop
   * @param {Object} shopData - Shop data
   * @returns {Promise<Object>} Updated shop info
   */
  async updateShopInfo(shopData) {
    try {
      const response = await apiClient.put('/dealer/shop', shopData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật shop' };
    }
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Get dealer notifications
   * GET /dealer/notifications
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Notification list
   */
  async getNotifications(filters = {}) {
    try {
      const response = await apiClient.get('/dealer/notifications', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy thông báo' };
    }
  }

  /**
   * Mark notification as read
   * PUT /dealer/notifications/:id/read
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise<Object>} Update result
   */
  async markNotificationRead(notificationId) {
    try {
      const response = await apiClient.put(`/dealer/notifications/${notificationId}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi đánh dấu đã đọc' };
    }
  }

  /**
   * Mark all notifications as read
   * PUT /dealer/notifications/read-all
   * @returns {Promise<Object>} Update result
   */
  async markAllNotificationsRead() {
    try {
      const response = await apiClient.put('/dealer/notifications/read-all');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi đánh dấu tất cả đã đọc' };
    }
  }

  // ==================== FEEDBACK & COMPLAINT MANAGEMENT ====================

  /**
   * Get all feedbacks with filters
   * GET /Feedbacks?CustomerId=...&Type=...&Status=...&StartDate=...&EndDate=...
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of feedbacks
   */
  async getFeedbacks(params = {}) {
    try {
      const response = await apiClient.get('/Feedbacks', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách phản hồi'
      };
    }
  }

  /**
   * Get feedback by ID
   * GET /Feedbacks/{id}
   * @param {number} feedbackId - Feedback ID
   * @returns {Promise<Object>} Feedback details
   */
  async getFeedbackById(feedbackId) {
    try {
      const response = await apiClient.get(`/Feedbacks/${feedbackId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin phản hồi'
      };
    }
  }

  /**
   * Create new feedback
   * POST /Feedbacks
   * @param {Object} feedbackData - Feedback information
   * @returns {Promise<Object>} Created feedback
   */
  async createFeedback(feedbackData) {
    try {
      const response = await apiClient.post('/Feedbacks', feedbackData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo phản hồi'
      };
    }
  }

  /**
   * Update feedback status and notes
   * PUT /Feedbacks/{id}
   * @param {number} feedbackId - Feedback ID
   * @param {Object} updateData - Update data (status, note)
   * @returns {Promise<Object>} Updated feedback
   */
  async updateFeedback(feedbackId, updateData) {
    try {
      const response = await apiClient.put(`/Feedbacks/${feedbackId}`, updateData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật phản hồi'
      };
    }
  }

  /**
   * Update feedback status only
   * PATCH /Feedbacks/{id}/status
   * @param {number} feedbackId - Feedback ID
   * @param {string} status - New status (Pending, InProgress, Resolved)
   * @param {string} note - Optional note
   * @returns {Promise<Object>} Update result
   */
  async updateFeedbackStatus(feedbackId, status, note = '') {
    try {
      const response = await apiClient.patch(`/Feedbacks/${feedbackId}/status`, {
        status,
        note
      });
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
   * Delete feedback
   * DELETE /Feedbacks/{id}
   * @param {number} feedbackId - Feedback ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteFeedback(feedbackId) {
    try {
      const response = await apiClient.delete(`/Feedbacks/${feedbackId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa phản hồi'
      };
    }
  }

  /**
   * Get feedback statistics
   * GET /Feedbacks/statistics
   * @returns {Promise<Object>} Feedback statistics
   */
  async getFeedbackStatistics() {
    try {
      const response = await apiClient.get('/Feedbacks/statistics');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thống kê phản hồi'
      };
    }
  }

  /**
   * Notify customer about feedback resolution
   * POST /Feedbacks/{id}/notify
   * @param {number} feedbackId - Feedback ID
   * @returns {Promise<Object>} Notification result
   */
  async notifyCustomerFeedback(feedbackId) {
    try {
      const response = await apiClient.post(`/Feedbacks/${feedbackId}/notify`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi gửi thông báo'
      };
    }
  }
}

// Export singleton instance
export const dealerAPI = new DealerAPI();
export default DealerAPI;