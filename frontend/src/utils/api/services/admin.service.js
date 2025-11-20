/**
 * Admin API Service
 * Handles all admin-related API calls by connecting to the real backend
 */
import apiClient from '../apiClient'; // Ghi chú: Import apiClient mà chúng ta vừa tạo

export class AdminService {
  
  // === User Management (Đã tích hợp API thật) ===

  static async getAllUsers(filters = {}) {
    // Ghi chú: Sử dụng apiClient để gọi GET /Users (baseURL đã có /api)
    // Chúng ta sẽ xử lý filters sau nếu cần, tạm thời lấy tất cả.
    return await apiClient.get('/Users');
  }
  
  static async getUserById(userId) {
    return await apiClient.get(`/Users/${userId}`);
  }
  
  static async createUser(userData) {
    // Ghi chú: Gửi dữ liệu userData (khớp với UserCreateDto) đến API
    return await apiClient.post('/Users', userData);
  }
  
  static async updateUser(userId, updateData) {
    // Ghi chú: updateData phải khớp với UserUpdateDto
    return await apiClient.put(`/Users/${userId}`, updateData);
  }
  
  // Ghi chú: API của bạn dùng PATCH cho việc thay đổi trạng thái, không phải DELETE
  static async changeUserStatus(userId, statusData) {
    // statusData sẽ là object dạng { status: 'Active' } hoặc { status: 'Inactive' }
    return await apiClient.patch(`/Users/${userId}/status`, statusData);
  }

  // === CÁC API PHỤ TRỢ CẦN THIẾT CHO FORM ===

  static async getAllRoles() {
    // Ghi chú: API này chưa có trong Controller của bạn, cần phải tạo
    return await apiClient.get('/Roles');
  }

  static async getAllDealersBasic() {
    // Ghi chú: API này cũng cần được tạo để lấy danh sách đại lý gọn nhẹ
    return await apiClient.get('/Dealers/basic'); // Ví dụ một endpoint mới
  }
  
  // === Các chức năng khác (giữ lại cấu trúc, sẽ tích hợp sau) ===
  
  // Analytics
  static async getDashboardAnalytics(userId) {
    // TODO: Sẽ tích hợp API phân tích ở đây
    // return await apiClient.get(`/api/analytics/dashboard`);
    return { success: true, data: {} }; // Trả về dữ liệu giả tạm thời
  }
  
  // Reports
  static async exportData(dataType, filters = {}) {
    // TODO: Sẽ tích hợp API xuất dữ liệu ở đây
    return { success: true, data: [] };
  }
  
  // System Management
  static async getSystemStats() {
    // TODO: Tích hợp API lấy thống kê hệ thống
    return { success: true, data: {} };
  }
  
  // Vehicle Management (sẽ dùng trong chức năng quản lý xe)
  static async getAllVehicles(filters = {}) {
    return await apiClient.get('/admin/vehicles', { params: filters });
  }
  // === PHẦN BỔ SUNG: CÁC HÀM CUNG CẤP DỮ LIỆU CHO DROPDOWN ===
  
  static async getAllRoles() {
    // Ghi chú: Gọi đến API GET /Roles mà chúng ta đã tạo ở Backend.
    return await apiClient.get('/Roles');
  }
 static async getAllRoles() {
    // Ghi chú: Gọi đến API GET /Roles mà chúng ta vừa tạo ở Backend.
    return await apiClient.get('/Roles');
  }

  static async getAllDealersBasic() {
    // Ghi chú: Gọi đến API GET /Dealers/basic để lấy danh sách đại lý gọn nhẹ.
    return await apiClient.get('/Dealers/basic');
  }
  static async getAllDealersBasic() {
    // Ghi chú: Gọi đến API GET /Dealers/basic để lấy danh sách đại lý gọn nhẹ.
    return await apiClient.get('/Dealers/basic');
  }
}

export default AdminService;