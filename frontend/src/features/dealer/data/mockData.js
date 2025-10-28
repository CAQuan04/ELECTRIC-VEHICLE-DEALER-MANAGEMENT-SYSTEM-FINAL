/**
 * Centralized Mock Data for Dealer Module
 * Tất cả mock data được tập trung tại đây để dễ quản lý
 */

// ==================== DASHBOARD ====================
export const MOCK_DASHBOARD_DATA = {
  dealer: { 
    vehicles: 47, 
    orders: 13, 
    customers: 156, 
    revenue: 11.3 
  },
  performance: { 
    monthlySales: 13, 
    quarterTarget: 85, 
    customerSatisfaction: 4.7, 
    deliveryTime: 5 
  },
  recentOrders: [
    { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', status: 'Hoàn thành', date: '2025-10-20' },
    { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', status: 'Đang xử lý', date: '2025-10-22' }
  ]
};

// ==================== VEHICLES ====================
export const MOCK_VEHICLES = [
  { id: 1, name: 'Model 3', variant: 'Standard Range', price: 1200000000, stock: 15, status: 'Sẵn sàng' },
  { id: 2, name: 'Model Y', variant: 'Long Range', price: 1800000000, stock: 10, status: 'Sẵn sàng' },
  { id: 3, name: 'Model S', variant: 'Plaid', price: 3800000000, stock: 5, status: 'Sẵn sàng' },
  { id: 4, name: 'Model X', variant: 'Performance', price: 4200000000, stock: 3, status: 'Đặt trước' }
];

export const MOCK_VEHICLE_DETAIL = {
  id: 1,
  name: 'Model 3',
  variant: 'Standard Range',
  price: 1200000000,
  specs: {
    range: 423,
    acceleration: '5.8s',
    topSpeed: 225,
    seating: 5
  },
  features: ['Autopilot', 'Premium Audio', 'Heated Seats'],
  colors: ['White', 'Black', 'Blue', 'Red'],
  stock: 15
};

// ==================== INVENTORY ====================
export const MOCK_INVENTORY = [
  { id: 1, model: 'Model 3', total: 15, available: 12, reserved: 3, color: 'White', status: 'Sẵn sàng' },
  { id: 2, model: 'Model Y', total: 10, available: 8, reserved: 2, color: 'Black', status: 'Sẵn sàng' },
  { id: 3, model: 'Model S', total: 6, available: 5, reserved: 1, color: 'Red', status: 'Sẵn sàng' },
  { id: 4, model: 'Model X', total: 3, available: 3, reserved: 0, color: 'Blue', status: 'Sẵn sàng' }
];

export const MOCK_STOCK_DETAIL = {
  id: 1,
  model: 'Model 3',
  total: 15,
  available: 12,
  reserved: 3,
  color: 'White',
  status: 'Sẵn sàng',
  location: 'Kho Hà Nội',
  lastUpdated: '2025-10-25'
};

// ==================== CUSTOMERS ====================
export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', email: 'nguyenvana@email.com', status: 'VIP' },
  { id: 2, name: 'Trần Thị B', phone: '0923456789', email: 'tranthib@email.com', status: 'Thường' },
  { id: 3, name: 'Lê Văn C', phone: '0934567890', email: 'levanc@email.com', status: 'VIP' },
  { id: 4, name: 'Phạm Thị D', phone: '0945678901', email: 'phamthid@email.com', status: 'Thường' }
];

export const MOCK_CUSTOMER_DETAIL = {
  id: 1,
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  email: 'nguyenvana@email.com',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  status: 'VIP',
  totalOrders: 2,
  totalSpent: 2400000000,
  joinDate: '2024-01-15',
  createdDate: '15/01/2024',
  purchaseHistory: [
    { id: 1, vehicle: 'Model 3', date: '15/03/2024', amount: 1200000000 },
    { id: 2, vehicle: 'Model Y', date: '20/08/2024', amount: 1200000000 }
  ],
  testDriveHistory: [
    { id: 1, vehicle: 'Model 3', date: '10/03/2024', status: 'Hoàn thành' },
    { id: 2, vehicle: 'Model Y', date: '15/08/2024', status: 'Hoàn thành' },
    { id: 3, vehicle: 'Model S', date: '25/10/2024', status: 'Đã xác nhận' }
  ]
};

// ==================== TEST DRIVES ====================
export const MOCK_TEST_DRIVES = [
  { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', date: '2025-10-26', time: '09:00', status: 'Đã xác nhận' },
  { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', date: '2025-10-27', time: '10:30', status: 'Chờ xác nhận' },
  { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', date: '2025-10-28', time: '14:00', status: 'Đã xác nhận' },
  { id: 4, customer: 'Phạm Thị D', vehicle: 'Model X', date: '2025-10-29', time: '16:00', status: 'Hoàn thành' }
];

export const MOCK_TEST_DRIVE_APPOINTMENTS = [
  { id: 1, date: '2025-10-26', time: '09:00', customer: 'Nguyễn Văn A', vehicle: 'Model 3', status: 'Đã xác nhận' },
  { id: 2, date: '2025-10-26', time: '10:30', customer: 'Trần Thị B', vehicle: 'Model Y', status: 'Chờ xác nhận' },
  { id: 3, date: '2025-10-27', time: '14:00', customer: 'Lê Văn C', vehicle: 'Model S', status: 'Đã xác nhận' },
  { id: 4, date: '2025-10-28', time: '16:00', customer: 'Phạm Thị D', vehicle: 'Model X', status: 'Đã xác nhận' },
  { id: 5, date: '2025-10-29', time: '11:00', customer: 'Võ Văn E', vehicle: 'Model 3', status: 'Chờ xác nhận' },
  { id: 6, date: '2025-10-30', time: '15:00', customer: 'Hoàng Thị F', vehicle: 'Model Y', status: 'Hoàn thành' },
  { id: 7, date: '2025-11-05', time: '09:00', customer: 'Khách A', vehicle: 'Model 3', status: 'Đã xác nhận' },
  { id: 8, date: '2025-11-05', time: '10:00', customer: 'Khách B', vehicle: 'Model Y', status: 'Đã xác nhận' },
  { id: 9, date: '2025-11-05', time: '11:00', customer: 'Khách C', vehicle: 'Model S', status: 'Chờ xác nhận' }
];

export const MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS = [
  {
    id: 1,
    time: '09:00',
    duration: 60,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    customerEmail: 'nguyenvana@email.com',
    vehicleModel: 'Model 3 Long Range',
    vehicleColor: 'Đỏ',
    status: 'confirmed',
    statusText: 'Đã xác nhận',
    notes: 'Khách hàng quan tâm đến tính năng tự lái',
    salesRepName: 'Phạm Văn E',
    createdAt: '2024-10-25T10:30:00'
  },
  {
    id: 2,
    time: '10:30',
    duration: 60,
    customerName: 'Trần Thị B',
    customerPhone: '0923456789',
    customerEmail: 'tranthib@email.com',
    vehicleModel: 'Model Y Performance',
    vehicleColor: 'Trắng',
    status: 'pending',
    statusText: 'Chờ xác nhận',
    notes: '',
    salesRepName: 'Lê Thị F',
    createdAt: '2024-10-26T14:20:00'
  },
  {
    id: 3,
    time: '14:00',
    duration: 90,
    customerName: 'Lê Văn C',
    customerPhone: '0934567890',
    customerEmail: 'levanc@email.com',
    vehicleModel: 'Model S Plaid',
    vehicleColor: 'Đen',
    status: 'confirmed',
    statusText: 'Đã xác nhận',
    notes: 'Khách hàng đã lái thử Model 3 trước đây',
    salesRepName: 'Phạm Văn E',
    createdAt: '2024-10-27T09:15:00'
  },
  {
    id: 4,
    time: '16:00',
    duration: 60,
    customerName: 'Phạm Thị D',
    customerPhone: '0945678901',
    customerEmail: 'phamthid@email.com',
    vehicleModel: 'Model X',
    vehicleColor: 'Xanh Navy',
    status: 'confirmed',
    statusText: 'Đã xác nhận',
    notes: '',
    salesRepName: 'Nguyễn Văn G',
    createdAt: '2024-10-27T16:45:00'
  }
];

// ==================== SALES ====================
export const MOCK_QUOTATIONS = [
  { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: 1200000000, status: 'Đã gửi', date: '2025-10-20' },
  { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', amount: 1800000000, status: 'Chờ phản hồi', date: '2025-10-22' }
];

export const MOCK_ORDERS = [
  { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: 1200000000, status: 'Hoàn thành', date: '2025-09-15' },
  { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', amount: 1800000000, status: 'Đang xử lý', date: '2025-10-10' }
];

export const MOCK_PAYMENTS = [
  { id: 1, order: 'ORD-001', customer: 'Nguyễn Văn A', amount: 1200000000, method: 'Chuyển khoản', status: 'Hoàn thành', date: '2025-09-20' },
  { id: 2, order: 'ORD-002', customer: 'Trần Thị B', amount: 900000000, method: 'Tiền mặt', status: 'Đã thanh toán', date: '2025-10-15' }
];

// ==================== PURCHASE ====================
export const MOCK_PURCHASE_REQUESTS = [
  { id: 1, vehicle: 'Model 3', quantity: 10, requestedBy: 'Dealer HN', status: 'Đã duyệt', date: '2025-10-01' },
  { id: 2, vehicle: 'Model Y', quantity: 5, requestedBy: 'Dealer HCM', status: 'Chờ duyệt', date: '2025-10-20' }
];

// ==================== REPORTS ====================
export const MOCK_SALES_REPORT = {
  totalRevenue: 11300000000,
  totalOrders: 13,
  averageOrderValue: 869230769,
  monthlySales: [
    { month: 'T1', revenue: 800000000 },
    { month: 'T2', revenue: 900000000 },
    { month: 'T3', revenue: 1100000000 },
    { month: 'T4', revenue: 950000000 },
    { month: 'T5', revenue: 1000000000 },
    { month: 'T6', revenue: 1050000000 },
    { month: 'T7', revenue: 900000000 },
    { month: 'T8', revenue: 1100000000 },
    { month: 'T9', revenue: 1200000000 },
    { month: 'T10', revenue: 1300000000 }
  ]
};

export const MOCK_CUSTOMER_DEBT = [
  { id: 1, customer: 'Nguyễn Văn A', totalDebt: 300000000, dueDate: '2025-11-30', status: 'Chưa thanh toán' },
  { id: 2, customer: 'Trần Thị B', totalDebt: 500000000, dueDate: '2025-12-15', status: 'Quá hạn' }
];

export const MOCK_SUPPLIER_DEBT = [
  { id: 1, supplier: 'Tesla Inc.', totalDebt: 5000000000, dueDate: '2025-11-30', status: 'Chưa thanh toán' },
  { id: 2, supplier: 'Parts Supplier', totalDebt: 2000000000, dueDate: '2025-12-15', status: 'Đã thanh toán' }
];

// Mock data for sales performance (used in ReportsSection)
export const MOCK_SALES_PERFORMANCE_RAW = [
  { month: 'T1', revenue: 65 },
  { month: 'T2', revenue: 72 },
  { month: 'T3', revenue: 68 },
  { month: 'T4', revenue: 89 },
  { month: 'T5', revenue: 94 },
  { month: 'T6', revenue: 87 },
  { month: 'T7', revenue: 76 },
  { month: 'T8', revenue: 82 },
  { month: 'T9', revenue: 95 },
  { month: 'T10', revenue: 88 },
  { month: 'T11', revenue: 92 },
  { month: 'T12', revenue: 847 }
];

export const MOCK_SALES_PERFORMANCE = MOCK_SALES_PERFORMANCE_RAW.slice(0, 10);

// Mock AR data (Accounts Receivable - Công nợ khách hàng)
export const MOCK_AR_DATA = [
  { name: 'KH A', amount: 120, status: 'Chưa TT', overdue: false },
  { name: 'KH B', amount: 85, status: 'Chưa TT', overdue: true },
  { name: 'KH C', amount: 200, status: 'Đã TT 50%', overdue: false },
  { name: 'KH D', amount: 150, status: 'Chưa TT', overdue: true },
  { name: 'KH E', amount: 95, status: 'Đã TT', overdue: false }
];

// Mock AP data (Accounts Payable - Công nợ nhà cung cấp)
export const MOCK_AP_DATA = [
  { name: 'NCC X', amount: 500, status: 'Chưa TT', overdue: false },
  { name: 'NCC Y', amount: 320, status: 'Đã TT 70%', overdue: false },
  { name: 'NCC Z', amount: 180, status: 'Chưa TT', overdue: true },
  { name: 'NCC W', amount: 450, status: 'Đã TT', overdue: false },
  { name: 'NCC K', amount: 270, status: 'Chưa TT', overdue: true }
];

// ==================== PROMOTIONS ====================
export const MOCK_PROMOTIONS = [
  { id: 1, name: 'Giảm giá Model 3', discount: 10, startDate: '2025-11-01', endDate: '2025-11-30', status: 'Đang áp dụng' },
  { id: 2, name: 'Ưu đãi Model Y', discount: 15, startDate: '2025-12-01', endDate: '2025-12-31', status: 'Sắp diễn ra' }
];

export const MOCK_PROMOTION_DETAIL = {
  id: 1,
  name: 'Giảm giá Model 3',
  description: 'Giảm 10% cho tất cả phiên bản Model 3',
  discount: 10,
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  status: 'Đang áp dụng',
  applicableModels: ['Model 3 Standard', 'Model 3 Long Range', 'Model 3 Performance'],
  terms: 'Áp dụng cho khách hàng đặt cọc từ 100 triệu'
};

// ==================== STAFF ====================
export const MOCK_STAFF = [
  { id: 1, name: 'Phạm Văn E', role: 'Sales', email: 'phamvane@dealer.com', status: 'Active' },
  { id: 2, name: 'Lê Thị F', role: 'Sales', email: 'lethif@dealer.com', status: 'Active' },
  { id: 3, name: 'Nguyễn Văn G', role: 'Manager', email: 'nguyenvang@dealer.com', status: 'Active' }
];

// ==================== EXPORT ALL ====================
export default {
  // Dashboard
  MOCK_DASHBOARD_DATA,
  
  // Vehicles
  MOCK_VEHICLES,
  MOCK_VEHICLE_DETAIL,
  
  // Inventory
  MOCK_INVENTORY,
  MOCK_STOCK_DETAIL,
  
  // Customers
  MOCK_CUSTOMERS,
  MOCK_CUSTOMER_DETAIL,
  
  // Test Drives
  MOCK_TEST_DRIVES,
  MOCK_TEST_DRIVE_APPOINTMENTS,
  MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS,
  
  // Sales
  MOCK_QUOTATIONS,
  MOCK_ORDERS,
  MOCK_PAYMENTS,
  
  // Purchase
  MOCK_PURCHASE_REQUESTS,
  
  // Reports
  MOCK_SALES_REPORT,
  MOCK_CUSTOMER_DEBT,
  MOCK_SUPPLIER_DEBT,
  MOCK_SALES_PERFORMANCE_RAW,
  MOCK_SALES_PERFORMANCE,
  MOCK_AR_DATA,
  MOCK_AP_DATA,
  
  // Promotions
  MOCK_PROMOTIONS,
  MOCK_PROMOTION_DETAIL,
  
  // Staff
  MOCK_STAFF
};
