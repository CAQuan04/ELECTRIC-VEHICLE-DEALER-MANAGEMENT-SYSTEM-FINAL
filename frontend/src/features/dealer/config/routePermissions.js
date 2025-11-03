/**
 * DEALER ROUTE PERMISSIONS CONFIGURATION
 * Định nghĩa quyền truy cập cho từng route/trang trong dealer module
 * Mapping giữa routes và permissions required
 */

import { DEALER_ROLES, PERMISSION_MODULES } from './permissions';

// ==================== ROUTE PERMISSIONS MAPPING ====================

/**
 * Định nghĩa permissions cần thiết cho mỗi route
 * Format: { path: string, permissions: string[], roles: string[] }
 */
export const DEALER_ROUTE_PERMISSIONS = {
  // ===== DASHBOARD =====
  DASHBOARD: {
    path: '/dealer',
    permissions: [], // Tất cả dealer đều truy cập được
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Dashboard',
    description: 'Trang tổng quan dealer'
  },

  // ===== VEHICLES (Xe) =====
  VEHICLES_LIST: {
    path: '/dealer/vehicles',
    permissions: [PERMISSION_MODULES.VEHICLE_QUERY.VIEW_CATALOG],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Danh sách xe',
    description: 'Xem danh mục xe có sẵn'
  },
  VEHICLE_DETAIL: {
    path: '/dealer/vehicles/:id',
    permissions: [PERMISSION_MODULES.VEHICLE_QUERY.VIEW_DETAIL],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết xe',
    description: 'Xem thông tin chi tiết xe'
  },
  VEHICLE_COMPARE: {
    path: '/dealer/vehicles/compare',
    permissions: [PERMISSION_MODULES.VEHICLE_QUERY.COMPARE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'So sánh xe',
    description: 'So sánh các dòng xe'
  },

  // ===== INVENTORY (Kho xe) =====
  INVENTORY: {
    path: '/dealer/inventory',
    permissions: [PERMISSION_MODULES.VEHICLE_QUERY.VIEW_CATALOG],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Quản lý kho',
    description: 'Xem tồn kho xe tại đại lý'
  },
  STOCK_DETAIL: {
    path: '/dealer/inventory/:id',
    permissions: [PERMISSION_MODULES.VEHICLE_QUERY.VIEW_DETAIL],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết tồn kho',
    description: 'Xem chi tiết lô xe trong kho'
  },

  // ===== CUSTOMERS (Khách hàng) =====
  CUSTOMERS_LIST: {
    path: '/dealer/customers',
    permissions: [PERMISSION_MODULES.CUSTOMER.VIEW_PROFILE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Danh sách khách hàng',
    description: 'Quản lý hồ sơ khách hàng'
  },
  CUSTOMER_DETAIL: {
    path: '/dealer/customers/:id',
    permissions: [PERMISSION_MODULES.CUSTOMER.VIEW_PROFILE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết khách hàng',
    description: 'Xem chi tiết thông tin khách hàng'
  },
  CUSTOMER_CREATE: {
    path: '/dealer/customers/new',
    permissions: [PERMISSION_MODULES.CUSTOMER.CREATE_PROFILE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Thêm khách hàng',
    description: 'Tạo hồ sơ khách hàng mới'
  },
  CUSTOMER_EDIT: {
    path: '/dealer/customers/:id/edit',
    permissions: [PERMISSION_MODULES.CUSTOMER.EDIT_PROFILE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Sửa khách hàng',
    description: 'Chỉnh sửa thông tin khách hàng'
  },

  // ===== TEST DRIVES (Lái thử) =====
  TEST_DRIVES_LIST: {
    path: '/dealer/test-drives',
    permissions: [PERMISSION_MODULES.CUSTOMER.VIEW_TEST_DRIVE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Quản lý lái thử',
    description: 'Xem danh sách lịch lái thử'
  },
  TEST_DRIVE_CALENDAR: {
    path: '/dealer/test-drives/calendar',
    permissions: [PERMISSION_MODULES.CUSTOMER.VIEW_TEST_DRIVE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Lịch lái thử',
    description: 'Xem lịch hẹn lái thử dạng calendar'
  },
  TEST_DRIVE_CREATE: {
    path: '/dealer/test-drives/new',
    permissions: [PERMISSION_MODULES.CUSTOMER.SCHEDULE_TEST_DRIVE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Đăng ký lái thử',
    description: 'Tạo lịch hẹn lái thử mới'
  },
  TEST_DRIVE_DETAIL: {
    path: '/dealer/test-drives/:id',
    permissions: [PERMISSION_MODULES.CUSTOMER.VIEW_TEST_DRIVE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết lịch lái thử',
    description: 'Xem chi tiết lịch hẹn lái thử'
  },

  // ===== QUOTATIONS (Báo giá) =====
  QUOTATIONS_LIST: {
    path: '/dealer/quotations',
    permissions: [PERMISSION_MODULES.SALES.VIEW_QUOTATION],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Quản lý báo giá',
    description: 'Xem danh sách báo giá'
  },
  QUOTATION_CREATE: {
    path: '/dealer/quotations/create',
    permissions: [PERMISSION_MODULES.SALES.CREATE_QUOTATION],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Tạo báo giá',
    description: 'Tạo báo giá mới cho khách hàng'
  },
  QUOTATION_DETAIL: {
    path: '/dealer/quotations/:id',
    permissions: [PERMISSION_MODULES.SALES.VIEW_QUOTATION],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết báo giá',
    description: 'Xem chi tiết báo giá'
  },
  QUOTATION_EDIT: {
    path: '/dealer/quotations/:id/edit',
    permissions: [PERMISSION_MODULES.SALES.EDIT_QUOTATION],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Sửa báo giá',
    description: 'Chỉnh sửa báo giá'
  },

  // ===== ORDERS (Đơn hàng) =====
  ORDERS_LIST: {
    path: '/dealer/orders',
    permissions: [PERMISSION_MODULES.SALES.VIEW_ORDER],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Quản lý đơn hàng',
    description: 'Xem danh sách đơn hàng'
  },
  ORDER_CREATE: {
    path: '/dealer/orders/create',
    permissions: [PERMISSION_MODULES.SALES.CREATE_ORDER],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Tạo đơn hàng',
    description: 'Tạo đơn hàng bán xe mới'
  },
  ORDER_DETAIL: {
    path: '/dealer/orders/:id',
    permissions: [PERMISSION_MODULES.SALES.VIEW_ORDER],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Chi tiết đơn hàng',
    description: 'Xem chi tiết đơn hàng'
  },

  // ===== PROMOTIONS (Khuyến mãi) - Manager Only =====
  PROMOTIONS_LIST: {
    path: '/dealer/promotions',
    permissions: [PERMISSION_MODULES.SALES.MANAGE_PROMOTION],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Quản lý khuyến mãi',
    description: 'Quản lý chương trình khuyến mãi (Manager)'
  },
  PROMOTION_CREATE: {
    path: '/dealer/promotions/create',
    permissions: [PERMISSION_MODULES.SALES.MANAGE_PROMOTION],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Tạo khuyến mãi',
    description: 'Tạo chương trình khuyến mãi mới (Manager)'
  },

  // ===== PURCHASE REQUESTS (Yêu cầu đặt xe từ hãng) =====
  PURCHASE_REQUESTS_LIST: {
    path: '/dealer/purchase-requests',
    permissions: [PERMISSION_MODULES.PURCHASE.VIEW_REQUEST],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Yêu cầu đặt xe',
    description: 'Xem danh sách yêu cầu đặt xe từ hãng'
  },
  PURCHASE_REQUEST_CREATE: {
    path: '/dealer/purchase-requests/create',
    permissions: [PERMISSION_MODULES.PURCHASE.CREATE_REQUEST],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Tạo yêu cầu đặt xe',
    description: 'Tạo yêu cầu đặt xe mới từ hãng'
  },

  // ===== PAYMENTS (Thanh toán) =====
  PAYMENTS_LIST: {
    path: '/dealer/payments',
    permissions: [PERMISSION_MODULES.SALES.VIEW_PAYMENT],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Quản lý thanh toán',
    description: 'Xem danh sách phiếu thanh toán'
  },
  PAYMENT_CREATE: {
    path: '/dealer/payments/create',
    permissions: [PERMISSION_MODULES.SALES.CREATE_PAYMENT],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Tạo phiếu thanh toán',
    description: 'Tạo phiếu thanh toán mới'
  },

  // ===== DELIVERY (Giao xe) =====
  DELIVERIES_LIST: {
    path: '/dealer/deliveries',
    permissions: [PERMISSION_MODULES.SALES.TRACK_DELIVERY],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Theo dõi giao xe',
    description: 'Xem danh sách lịch giao xe'
  },

  // ===== REPORTS (Báo cáo) =====
  REPORTS_SALES: {
    path: '/dealer/reports/sales',
    permissions: [PERMISSION_MODULES.REPORTS.VIEW_SALES_PERFORMANCE],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Báo cáo doanh số',
    description: 'Xem báo cáo hiệu suất bán hàng'
  },
  REPORTS_DEBT_CUSTOMER: {
    path: '/dealer/reports/debt/customer',
    permissions: [PERMISSION_MODULES.REPORTS.VIEW_CUSTOMER_DEBT],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Công nợ khách hàng',
    description: 'Báo cáo công nợ khách hàng (Manager)'
  },
  REPORTS_DEBT_SUPPLIER: {
    path: '/dealer/reports/debt/supplier',
    permissions: [PERMISSION_MODULES.REPORTS.VIEW_SUPPLIER_DEBT],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Công nợ nhà cung cấp',
    description: 'Báo cáo công nợ với hãng (Manager)'
  },

  // ===== STAFF MANAGEMENT (Quản lý nhân viên) - Manager Only =====
  STAFF_LIST: {
    path: '/dealer/staff',
    permissions: [PERMISSION_MODULES.STAFF.VIEW_STAFF],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Quản lý nhân viên',
    description: 'Xem danh sách nhân viên (Manager)'
  },
  STAFF_CREATE: {
    path: '/dealer/staff/create',
    permissions: [PERMISSION_MODULES.STAFF.CREATE_STAFF],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Thêm nhân viên',
    description: 'Thêm nhân viên mới (Manager)'
  },
  STAFF_EDIT: {
    path: '/dealer/staff/:id/edit',
    permissions: [PERMISSION_MODULES.STAFF.EDIT_STAFF],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Sửa nhân viên',
    description: 'Chỉnh sửa thông tin nhân viên (Manager)'
  },
  STAFF_TARGETS: {
    path: '/dealer/staff/targets',
    permissions: [PERMISSION_MODULES.STAFF.ASSIGN_TARGET],
    roles: [DEALER_ROLES.MANAGER],
    name: 'Gán chỉ tiêu',
    description: 'Gán chỉ tiêu doanh số cho nhân viên (Manager)'
  },

  // ===== SETTINGS & PROFILE =====
  PROFILE: {
    path: '/dealer/profile',
    permissions: [],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Thông tin cá nhân',
    description: 'Xem và chỉnh sửa thông tin cá nhân'
  },
  SETTINGS: {
    path: '/dealer/settings',
    permissions: [],
    roles: [DEALER_ROLES.STAFF, DEALER_ROLES.MANAGER],
    name: 'Cài đặt',
    description: 'Cài đặt hệ thống'
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Lấy tất cả routes mà user role có thể truy cập
 */
export const getAccessibleRoutes = (userRole) => {
  return Object.values(DEALER_ROUTE_PERMISSIONS).filter(route => 
    route.roles.includes(userRole)
  );
};

/**
 * Kiểm tra user có thể truy cập route không
 */
export const canAccessRoute = (userRole, routePath) => {
  const route = Object.values(DEALER_ROUTE_PERMISSIONS).find(r => r.path === routePath);
  if (!route) return false;
  return route.roles.includes(userRole);
};

/**
 * Lấy danh sách routes theo category cho navigation menu
 */
export const getRoutesByCategory = (userRole) => {
  const accessibleRoutes = getAccessibleRoutes(userRole);
  
  return {
    main: {
      title: 'Trang chính',
      routes: accessibleRoutes.filter(r => 
        r.path === '/dealer'
      )
    },
    sales: {
      title: 'Bán hàng',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/quotations') || 
        r.path.includes('/orders') || 
        r.path.includes('/payments')
      )
    },
    customers: {
      title: 'Khách hàng',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/customers') || 
        r.path.includes('/test-drives')
      )
    },
    inventory: {
      title: 'Kho & Xe',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/vehicles') || 
        r.path.includes('/inventory') || 
        r.path.includes('/purchase-requests')
      )
    },
    reports: {
      title: 'Báo cáo',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/reports')
      )
    },
    management: {
      title: 'Quản lý',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/staff') || 
        r.path.includes('/promotions')
      )
    },
    settings: {
      title: 'Cài đặt',
      routes: accessibleRoutes.filter(r => 
        r.path.includes('/profile') || 
        r.path.includes('/settings')
      )
    }
  };
};

/**
 * Tạo summary permissions cho UI hiển thị
 */
export const getPermissionsSummary = (userRole) => {
  const routes = getAccessibleRoutes(userRole);
  
  return {
    role: userRole,
    totalPages: routes.length,
    categories: getRoutesByCategory(userRole),
    accessiblePaths: routes.map(r => r.path),
    restrictedFeatures: Object.values(DEALER_ROUTE_PERMISSIONS)
      .filter(r => !r.roles.includes(userRole))
      .map(r => r.name)
  };
};

export default {
  DEALER_ROUTE_PERMISSIONS,
  getAccessibleRoutes,
  canAccessRoute,
  getRoutesByCategory,
  getPermissionsSummary,
};
