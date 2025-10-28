/**
 * Dealer Real API Service
 * Kết nối với backend thật
 */
import apiClient from '../client';

export class DealerAPI {
  // ==================== DASHBOARD ====================
  /**
   * Lấy dữ liệu dashboard
   * GET /dealer/dashboard
   */
  static async getDashboard() {
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

  // ==================== VEHICLES ====================
  /**
   * Lấy danh sách xe
   * GET /dealer/vehicles?page=1&limit=10&search=...
   */
  static async getVehicles(params = {}) {
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
   * Lấy chi tiết xe
   * GET /dealer/vehicles/:id
   */
  static async getVehicleById(id) {
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
   * Cập nhật tồn kho
   * PUT /dealer/vehicles/:id/inventory
   */
  static async updateInventory(id, quantity) {
    try {
      const response = await apiClient.put(`/dealer/vehicles/${id}/inventory`, {
        quantity
      });
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

  // ==================== ORDERS ====================
  /**
   * Lấy danh sách đơn hàng
   * GET /dealer/orders?status=...&page=1&limit=10
   */
  static async getOrders(params = {}) {
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
   * Lấy chi tiết đơn hàng
   * GET /dealer/orders/:id
   */
  static async getOrderById(id) {
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
   * Cập nhật trạng thái đơn hàng
   * PUT /dealer/orders/:id/status
   */
  static async updateOrderStatus(id, status, note = '') {
    try {
      const response = await apiClient.put(`/dealer/orders/${id}/status`, {
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
   * Tạo đơn hàng mới
   * POST /dealer/orders
   */
  static async createOrder(orderData) {
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

  // ==================== CUSTOMERS ====================
  /**
   * Lấy danh sách khách hàng
   * GET /dealer/customers?page=1&limit=10
   */
  static async getCustomers(params = {}) {
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
   * Lấy chi tiết khách hàng
   * GET /dealer/customers/:id
   */
  static async getCustomerById(id) {
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

  // ==================== TEST DRIVES ====================
  /**
   * Lấy danh sách lịch lái thử
   * GET /dealer/test-drives?date=...&status=...
   */
  static async getTestDrives(params = {}) {
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
   * Cập nhật trạng thái lái thử
   * PUT /dealer/test-drives/:id/status
   */
  static async updateTestDriveStatus(id, status, note = '') {
    try {
      const response = await apiClient.put(`/dealer/test-drives/${id}/status`, {
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

  // ==================== ANALYTICS ====================
  /**
   * Lấy báo cáo doanh số
   * GET /dealer/analytics/sales?period=month&year=2024
   */
  static async getSalesReport(params = {}) {
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
   * Lấy thống kê hiệu suất
   * GET /dealer/analytics/performance
   */
  static async getPerformanceStats() {
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
   * Lấy danh sách khuyến mãi
   * GET /dealer/promotions
   */
  static async getPromotions(params = {}) {
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
   * Tạo khuyến mãi mới
   * POST /dealer/promotions
   */
  static async createPromotion(promotionData) {
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
   * Cập nhật khuyến mãi
   * PUT /dealer/promotions/:id
   */
  static async updatePromotion(id, promotionData) {
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
   * Xóa khuyến mãi
   * DELETE /dealer/promotions/:id
   */
  static async deletePromotion(id) {
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
}

export default DealerAPI;
