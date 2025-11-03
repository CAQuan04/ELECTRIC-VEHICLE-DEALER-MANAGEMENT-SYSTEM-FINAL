/**
 * DEALER ROLE PERMISSIONS CONFIGURATION
 * Định nghĩa chi tiết quyền truy cập cho Dealer Staff và Dealer Manager
 * Dựa trên Use Case Analysis từ requirement document
 */

// ==================== ROLE DEFINITIONS ====================

export const DEALER_ROLES = {
  STAFF: 'dealer_staff',        // Nhân viên bán hàng
  MANAGER: 'dealer_manager',    // Quản lý đại lý
};

// ==================== PERMISSION MODULES ====================

export const PERMISSION_MODULES = {
  // 1.a - Truy vấn thông tin xe
  VEHICLE_QUERY: {
    VIEW_CATALOG: 'vehicle.view_catalog',           // UC 1.a.1 - Xem danh mục xe
    VIEW_DETAIL: 'vehicle.view_detail',             // UC 1.a.1 - Xem chi tiết xe
    COMPARE: 'vehicle.compare',                     // UC 1.a.2 - So sánh xe
  },

  // 1.b - Quản lý bán hàng
  SALES: {
    CREATE_QUOTATION: 'sales.create_quotation',     // UC 1.b.1 - Tạo báo giá
    VIEW_QUOTATION: 'sales.view_quotation',         // UC 1.b.1 - Xem báo giá
    EDIT_QUOTATION: 'sales.edit_quotation',         // UC 1.b.1 - Sửa báo giá
    DELETE_QUOTATION: 'sales.delete_quotation',     // UC 1.b.1 - Xóa báo giá
    
    CREATE_ORDER: 'sales.create_order',             // UC 1.b.2 - Tạo đơn hàng
    VIEW_ORDER: 'sales.view_order',                 // UC 1.b.2 - Xem đơn hàng
    APPROVE_ORDER: 'sales.approve_order',           // UC 1.b.2 - Duyệt đơn hàng (Manager only)
    
    MANAGE_PROMOTION: 'sales.manage_promotion',     // UC 1.b.3 - Quản lý khuyến mãi (Manager only)
    APPLY_PROMOTION: 'sales.apply_promotion',       // UC 1.b.3 - Áp dụng khuyến mãi
    
    TRACK_DELIVERY: 'sales.track_delivery',         // UC 1.b.5 - Theo dõi giao xe
    UPDATE_DELIVERY_STATUS: 'sales.update_delivery_status', // UC 1.b.5 - Cập nhật trạng thái giao xe
    
    CREATE_PAYMENT: 'sales.create_payment',         // UC 1.b.6 - Tạo phiếu thanh toán
    VIEW_PAYMENT: 'sales.view_payment',             // UC 1.b.6 - Xem thanh toán
    CREATE_INSTALLMENT: 'sales.create_installment', // UC 1.b.6 - Tạo kế hoạch trả góp
  },

  // 1.b.4 - Quản lý mua hàng (Procurement)
  PURCHASE: {
    CREATE_REQUEST: 'purchase.create_request',      // UC 1.b.4 - Tạo yêu cầu đặt xe
    VIEW_REQUEST: 'purchase.view_request',          // UC 1.b.4 - Xem yêu cầu
    APPROVE_REQUEST: 'purchase.approve_request',    // UC 1.b.4 - Duyệt yêu cầu (Manager only)
    TRACK_ORDER: 'purchase.track_order',            // UC 1.b.4 - Theo dõi đơn đặt hàng
  },

  // 1.c - Quản lý khách hàng
  CUSTOMER: {
    CREATE_PROFILE: 'customer.create_profile',      // UC 1.c.1 - Tạo hồ sơ khách hàng
    VIEW_PROFILE: 'customer.view_profile',          // UC 1.c.1 - Xem hồ sơ khách hàng
    EDIT_PROFILE: 'customer.edit_profile',          // UC 1.c.1 - Sửa hồ sơ khách hàng
    DELETE_PROFILE: 'customer.delete_profile',      // UC 1.c.1 - Xóa khách hàng (Manager only)
    
    SCHEDULE_TEST_DRIVE: 'customer.schedule_test_drive',  // UC 1.c.2 - Đặt lịch lái thử
    VIEW_TEST_DRIVE: 'customer.view_test_drive',          // UC 1.c.2 - Xem lịch lái thử
    UPDATE_TEST_DRIVE: 'customer.update_test_drive',      // UC 1.c.2 - Cập nhật lịch lái thử
    CANCEL_TEST_DRIVE: 'customer.cancel_test_drive',      // UC 1.c.2 - Hủy lịch lái thử
    
    VIEW_FEEDBACK: 'customer.view_feedback',        // UC 1.c.3 - Xem phản hồi
    HANDLE_COMPLAINT: 'customer.handle_complaint',  // UC 1.c.3 - Xử lý khiếu nại
    ASSIGN_COMPLAINT: 'customer.assign_complaint',  // UC 1.c.3 - Phân công xử lý (Manager only)
  },

  // 1.d - Báo cáo
  REPORTS: {
    VIEW_SALES_PERFORMANCE: 'reports.view_sales_performance',  // UC 1.d.1 - Báo cáo doanh số
    EXPORT_SALES_REPORT: 'reports.export_sales_report',        // UC 1.d.1 - Xuất báo cáo doanh số
    
    VIEW_CUSTOMER_DEBT: 'reports.view_customer_debt',          // UC 1.d.2 - Báo cáo công nợ khách
    VIEW_SUPPLIER_DEBT: 'reports.view_supplier_debt',          // UC 1.d.2 - Báo cáo công nợ hãng
    EXPORT_DEBT_REPORT: 'reports.export_debt_report',          // UC 1.d.2 - Xuất báo cáo công nợ
  },

  // Quản lý nhân viên (Manager only)
  STAFF: {
    VIEW_STAFF: 'staff.view_staff',                 // Xem danh sách nhân viên
    CREATE_STAFF: 'staff.create_staff',             // Thêm nhân viên
    EDIT_STAFF: 'staff.edit_staff',                 // Sửa thông tin nhân viên
    DELETE_STAFF: 'staff.delete_staff',             // Xóa nhân viên
    ASSIGN_TARGET: 'staff.assign_target',           // Gán chỉ ti표 doanh số
  },
};

// ==================== ROLE PERMISSIONS MAPPING ====================

/**
 * Quyền của Dealer Staff
 * - Xem thông tin xe, so sánh
 * - Tạo báo giá, đơn hàng (chờ duyệt)
 * - Quản lý khách hàng cơ bản
 * - Đặt lịch lái thử
 * - Xem phản hồi, xử lý khiếu nại
 * - Tạo yêu cầu đặt xe (chờ duyệt)
 * - Theo dõi giao xe, thanh toán
 */
export const DEALER_STAFF_PERMISSIONS = [
  // Vehicle Query
  PERMISSION_MODULES.VEHICLE_QUERY.VIEW_CATALOG,
  PERMISSION_MODULES.VEHICLE_QUERY.VIEW_DETAIL,
  PERMISSION_MODULES.VEHICLE_QUERY.COMPARE,

  // Sales (Bán hàng)
  PERMISSION_MODULES.SALES.CREATE_QUOTATION,
  PERMISSION_MODULES.SALES.VIEW_QUOTATION,
  PERMISSION_MODULES.SALES.EDIT_QUOTATION,
  PERMISSION_MODULES.SALES.CREATE_ORDER,
  PERMISSION_MODULES.SALES.VIEW_ORDER,
  PERMISSION_MODULES.SALES.APPLY_PROMOTION,      // Áp dụng khuyến mãi có sẵn
  PERMISSION_MODULES.SALES.TRACK_DELIVERY,
  PERMISSION_MODULES.SALES.UPDATE_DELIVERY_STATUS,
  PERMISSION_MODULES.SALES.CREATE_PAYMENT,
  PERMISSION_MODULES.SALES.VIEW_PAYMENT,
  PERMISSION_MODULES.SALES.CREATE_INSTALLMENT,

  // Purchase (Đặt hàng từ hãng)
  PERMISSION_MODULES.PURCHASE.CREATE_REQUEST,
  PERMISSION_MODULES.PURCHASE.VIEW_REQUEST,
  PERMISSION_MODULES.PURCHASE.TRACK_ORDER,

  // Customer Management
  PERMISSION_MODULES.CUSTOMER.CREATE_PROFILE,
  PERMISSION_MODULES.CUSTOMER.VIEW_PROFILE,
  PERMISSION_MODULES.CUSTOMER.EDIT_PROFILE,
  PERMISSION_MODULES.CUSTOMER.SCHEDULE_TEST_DRIVE,
  PERMISSION_MODULES.CUSTOMER.VIEW_TEST_DRIVE,
  PERMISSION_MODULES.CUSTOMER.UPDATE_TEST_DRIVE,
  PERMISSION_MODULES.CUSTOMER.CANCEL_TEST_DRIVE,
  PERMISSION_MODULES.CUSTOMER.VIEW_FEEDBACK,
  PERMISSION_MODULES.CUSTOMER.HANDLE_COMPLAINT,

  // Reports (Chỉ xem)
  PERMISSION_MODULES.REPORTS.VIEW_SALES_PERFORMANCE,
];

/**
 * Quyền của Dealer Manager
 * - Tất cả quyền của Staff
 * - Duyệt đơn hàng, hợp đồng
 * - Quản lý khuyến mãi
 * - Duyệt yêu cầu đặt xe
 * - Xóa khách hàng
 * - Phân công xử lý khiếu nại
 * - Xem tất cả báo cáo
 * - Quản lý nhân viên
 */
export const DEALER_MANAGER_PERMISSIONS = [
  // Tất cả quyền của Staff
  ...DEALER_STAFF_PERMISSIONS,

  // Additional Sales Permissions
  PERMISSION_MODULES.SALES.DELETE_QUOTATION,
  PERMISSION_MODULES.SALES.APPROVE_ORDER,        // Duyệt đơn hàng
  PERMISSION_MODULES.SALES.MANAGE_PROMOTION,     // Quản lý khuyến mãi

  // Additional Purchase Permissions
  PERMISSION_MODULES.PURCHASE.APPROVE_REQUEST,   // Duyệt yêu cầu đặt xe

  // Additional Customer Permissions
  PERMISSION_MODULES.CUSTOMER.DELETE_PROFILE,    // Xóa khách hàng
  PERMISSION_MODULES.CUSTOMER.ASSIGN_COMPLAINT,  // Phân công xử lý khiếu nại

  // Additional Reports Permissions
  PERMISSION_MODULES.REPORTS.EXPORT_SALES_REPORT,
  PERMISSION_MODULES.REPORTS.VIEW_CUSTOMER_DEBT,
  PERMISSION_MODULES.REPORTS.VIEW_SUPPLIER_DEBT,
  PERMISSION_MODULES.REPORTS.EXPORT_DEBT_REPORT,

  // Staff Management (Manager only)
  PERMISSION_MODULES.STAFF.VIEW_STAFF,
  PERMISSION_MODULES.STAFF.CREATE_STAFF,
  PERMISSION_MODULES.STAFF.EDIT_STAFF,
  PERMISSION_MODULES.STAFF.DELETE_STAFF,
  PERMISSION_MODULES.STAFF.ASSIGN_TARGET,
];

// ==================== PERMISSION CHECKER ====================

/**
 * Lấy danh sách permissions theo role
 */
export const getPermissionsByRole = (role) => {
  switch (role) {
    case DEALER_ROLES.STAFF:
      return DEALER_STAFF_PERMISSIONS;
    case DEALER_ROLES.MANAGER:
      return DEALER_MANAGER_PERMISSIONS;
    default:
      return [];
  }
};

/**
 * Kiểm tra user có permission không
 */
export const hasPermission = (userRole, requiredPermission) => {
  const userPermissions = getPermissionsByRole(userRole);
  return userPermissions.includes(requiredPermission);
};

/**
 * Kiểm tra user có bất kỳ permission nào trong danh sách
 */
export const hasAnyPermission = (userRole, requiredPermissions) => {
  const userPermissions = getPermissionsByRole(userRole);
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

/**
 * Kiểm tra user có tất cả permissions trong danh sách
 */
export const hasAllPermissions = (userRole, requiredPermissions) => {
  const userPermissions = getPermissionsByRole(userRole);
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

// ==================== FEATURE FLAGS ====================

/**
 * Feature visibility theo role
 */
export const FEATURE_ACCESS = {
  // Vehicles
  VIEW_VEHICLE_CATALOG: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  COMPARE_VEHICLES: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],

  // Sales
  CREATE_QUOTATION: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  APPROVE_ORDER: [DEALER_ROLES.MANAGER],
  MANAGE_PROMOTIONS: [DEALER_ROLES.MANAGER],

  // Purchase
  CREATE_PURCHASE_REQUEST: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  APPROVE_PURCHASE_REQUEST: [DEALER_ROLES.MANAGER],

  // Customer
  MANAGE_CUSTOMERS: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  DELETE_CUSTOMER: [DEALER_ROLES.MANAGER],

  // Test Drive
  SCHEDULE_TEST_DRIVE: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  HANDLE_COMPLAINTS: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  ASSIGN_COMPLAINTS: [DEALER_ROLES.MANAGER],

  // Reports
  VIEW_SALES_REPORTS: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
  VIEW_DEBT_REPORTS: [DEALER_ROLES.MANAGER],
  EXPORT_REPORTS: [DEALER_ROLES.MANAGER],

  // Staff Management
  MANAGE_STAFF: [DEALER_ROLES.MANAGER],
};

/**
 * Kiểm tra feature có accessible với role không
 */
export const canAccessFeature = (userRole, feature) => {
  const allowedRoles = FEATURE_ACCESS[feature] || [];
  return allowedRoles.includes(userRole);
};

export default {
  DEALER_ROLES,
  PERMISSION_MODULES,
  DEALER_STAFF_PERMISSIONS,
  DEALER_MANAGER_PERMISSIONS,
  getPermissionsByRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessFeature,
};
