/**
 * DEALER MOCK DATA
 * Tập trung tất cả mock data cho dealer module
 * Sẽ được thay thế bằng API calls trong production
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
    { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Tesla Model 3', status: 'Đang xử lý', date: '2 giờ trước' },
    { id: 2, customer: 'Trần Thị B', vehicle: 'Tesla Model Y', status: 'Hoàn thành', date: '1 ngày trước' },
    { id: 3, customer: 'Lê Văn C', vehicle: 'Tesla Model S', status: 'Chờ duyệt', date: '2 ngày trước' },
    { id: 4, customer: 'Phạm Thị D', vehicle: 'Tesla Model X', status: 'Đang giao', date: '3 ngày trước' }
  ],
  inventory: [
    { model: 'Model 3', available: 12, reserved: 3, total: 15 },
    { model: 'Model Y', available: 8, reserved: 2, total: 10 },
    { model: 'Model S', available: 5, reserved: 1, total: 6 },
    { model: 'Model X', available: 3, reserved: 0, total: 3 }
  ]
};

// ==================== VEHICLES ====================
export const MOCK_VEHICLES = [
  { id: 1, name: 'Tesla Model 3', price: '1,500,000,000', status: 'available', stock: 15 },
  { id: 2, name: 'Tesla Model Y', price: '1,800,000,000', status: 'available', stock: 12 },
  { id: 3, name: 'Tesla Model S', price: '2,500,000,000', status: 'limited', stock: 8 }
];

export const MOCK_VEHICLE_DETAIL = {
  id: 1,
  name: 'Tesla Model 3 Long Range',
  price: '1,500,000,000',
  description: 'Xe điện thông minh với tầm hoạt động 580km',
  specs: {
    range: '580 km',
    acceleration: '3.1s (0-100km/h)',
    topSpeed: '261 km/h',
    battery: '82 kWh'
  },
  features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Heated Seats'],
  images: ['/img/model3-1.jpg', '/img/model3-2.jpg'],
  stock: 15,
  status: 'available'
};

export const MOCK_COMPARE_VEHICLES = [
  { id: 1, name: 'Model 3', price: '1.5 tỷ', range: '580 km', acceleration: '3.1s' },
  { id: 2, name: 'Model Y', price: '1.8 tỷ', range: '525 km', acceleration: '3.5s' },
  { id: 3, name: 'Model S', price: '2.5 tỷ', range: '652 km', acceleration: '2.1s' }
];

// ==================== INVENTORY ====================
export const MOCK_INVENTORY = [
  { id: 1, model: 'Model 3', vin: 'VIN123456', color: 'Trắng', status: 'available', location: 'Kho A' },
  { id: 2, model: 'Model Y', vin: 'VIN789012', color: 'Đen', status: 'reserved', location: 'Kho B' },
  { id: 3, model: 'Model S', vin: 'VIN345678', color: 'Xanh', status: 'available', location: 'Kho A' }
];

export const MOCK_STOCK_DETAIL = {
  id: 1,
  model: 'Tesla Model 3 Long Range',
  vin: 'VIN123456789',
  color: 'Pearl White Multi-Coat',
  interior: 'Black Premium',
  status: 'available',
  location: 'Kho A - Vị trí A-15',
  arrivalDate: '2024-01-10',
  features: ['Autopilot', 'Premium Audio', 'Glass Roof'],
  price: '1,500,000,000',
  warranty: '4 năm / 80,000 km'
};

// ==================== CUSTOMERS ====================
export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', phone: '0901234567', status: 'active', totalOrders: 2, totalSpent: '3 tỷ' },
  { id: 2, name: 'Trần Thị B', email: 'b@email.com', phone: '0907654321', status: 'active', totalOrders: 1, totalSpent: '1.8 tỷ' },
  { id: 3, name: 'Lê Văn C', email: 'c@email.com', phone: '0909876543', status: 'potential', totalOrders: 0, totalSpent: '0' }
];

export const MOCK_CUSTOMER_DETAIL = {
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '0901234567',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  dateJoined: '2023-06-15',
  status: 'VIP',
  orders: [
    { id: 'ORD-001', vehicle: 'Model 3', date: '2023-07-01', amount: '1.5 tỷ', status: 'delivered' },
    { id: 'ORD-002', vehicle: 'Model Y', date: '2024-01-10', amount: '1.8 tỷ', status: 'processing' }
  ],
  testDrives: [
    { id: 'TD-001', vehicle: 'Model S', date: '2023-06-20', status: 'completed' }
  ],
  notes: 'Khách hàng tiềm năng cao, quan tâm đến Model S'
};

// ==================== TEST DRIVES ====================
export const MOCK_TEST_DRIVES = [
  { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', date: '2024-01-20', time: '10:00', status: 'confirmed' },
  { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', date: '2024-01-20', time: '14:00', status: 'pending' },
  { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', date: '2024-01-21', time: '09:00', status: 'confirmed' }
];

export const MOCK_TEST_DRIVE_APPOINTMENTS = [
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    phone: '0901234567',
    vehicle: 'Tesla Model 3',
    date: '2024-01-20',
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    notes: 'Khách quan tâm mua xe trong tháng'
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    phone: '0907654321',
    vehicle: 'Tesla Model Y',
    date: '2024-01-20',
    time: '14:00',
    duration: 45,
    status: 'pending',
    notes: ''
  },
  {
    id: 3,
    customer: 'Lê Văn C',
    phone: '0909876543',
    vehicle: 'Tesla Model S',
    date: '2024-01-21',
    time: '09:00',
    duration: 90,
    status: 'confirmed',
    notes: 'VIP customer - cần staff senior'
  }
];

export const MOCK_TEST_DRIVE_DETAIL = { 
  id: 1,
  customer: 'Nguyễn Văn A',
  phone: '0901234567',
  email: 'nguyenvana@email.com',
  vehicle: 'Tesla Model 3 Long Range',
  date: '2024-01-20',
  time: '10:00',
  duration: 60,
  status: 'confirmed',
  route: 'Showroom → Đường Nguyễn Văn Linh → Quận 7 → Showroom',
  staff: 'Trần Văn B',
  notes: 'Khách quan tâm mua xe trong tháng. Đã test drive Model Y trước đó.',
  feedback: null
};

// ==================== SALES ====================
export const MOCK_QUOTATIONS = [
  { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', price: '1.5 tỷ', validUntil: '2024-02-01', status: 'active' },
  { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', price: '1.8 tỷ', validUntil: '2024-02-05', status: 'active' }
];

export const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: '1.5 tỷ', status: 'processing', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Trần Thị B', vehicle: 'Model Y', amount: '1.8 tỷ', status: 'confirmed', date: '2024-01-14' }
];

export const MOCK_PAYMENTS = [
  { id: 'PAY-001', order: 'ORD-001', amount: '500 triệu', method: 'bank_transfer', status: 'completed', date: '2024-01-15' },
  { id: 'PAY-002', order: 'ORD-002', amount: '1.8 tỷ', method: 'cash', status: 'pending', date: '2024-01-14' }
];

// ==================== PURCHASE ====================
export const MOCK_PURCHASE_REQUESTS = [
  { id: 'PR-001', vehicle: 'Model 3', quantity: 10, supplier: 'Tesla Factory', status: 'pending', date: '2024-01-10' },
  { id: 'PR-002', vehicle: 'Model Y', quantity: 5, supplier: 'Tesla Factory', status: 'approved', date: '2024-01-08' }
];

// ==================== REPORTS ====================
export const MOCK_SALES_REPORT = {
  period: 'Tháng 1/2024',
  totalRevenue: '11.3 tỷ',
  totalOrders: 47,
  averageOrderValue: '240 triệu',
  topVehicles: [
    { model: 'Model 3', sales: 20, revenue: '30 tỷ' },
    { model: 'Model Y', sales: 15, revenue: '27 tỷ' },
    { model: 'Model S', sales: 8, revenue: '20 tỷ' },
    { model: 'Model X', sales: 4, revenue: '12 tỷ' }
  ],
  salesByMonth: [
    { month: 'T1', sales: 47, revenue: '11.3 tỷ' },
    { month: 'T2', sales: 52, revenue: '12.5 tỷ' },
    { month: 'T3', sales: 45, revenue: '10.8 tỷ' }
  ]
};

export const MOCK_CUSTOMER_DEBT = [
  { customer: 'Nguyễn Văn A', order: 'ORD-001', total: '1.5 tỷ', paid: '500 triệu', debt: '1 tỷ', dueDate: '2024-02-15' },
  { customer: 'Trần Thị B', order: 'ORD-002', total: '1.8 tỷ', paid: '0', debt: '1.8 tỷ', dueDate: '2024-02-20' }
];

export const MOCK_SUPPLIER_DEBT = [
  { supplier: 'Tesla Factory', invoice: 'INV-001', total: '50 tỷ', paid: '30 tỷ', debt: '20 tỷ', dueDate: '2024-02-28' },
  { supplier: 'Parts Supplier', invoice: 'INV-002', total: '5 tỷ', paid: '5 tỷ', debt: '0', dueDate: '2024-01-31' }
];

// ==================== PROMOTIONS ====================
export const MOCK_PROMOTIONS = [
  { id: 1, name: 'Giảm giá Tết 2024', discount: '10%', validFrom: '2024-01-20', validTo: '2024-02-20', status: 'active' },
  { id: 2, name: 'Ưu đãi khách VIP', discount: '15%', validFrom: '2024-01-01', validTo: '2024-12-31', status: 'active' }
];

export const MOCK_PROMOTION_DETAIL = {
  id: 1,
  name: 'Giảm giá Tết Nguyên Đán 2024',
  description: 'Chương trình khuyến mãi đặc biệt dịp Tết',
  discount: '10%',
  discountType: 'percentage',
  validFrom: '2024-01-20',
  validTo: '2024-02-20',
  status: 'active',
  applicableVehicles: ['Model 3', 'Model Y'],
  conditions: 'Áp dụng cho khách hàng mua xe trong tháng 1',
  maxDiscount: '150 triệu',
  usedCount: 12,
  totalRevenue: '18 tỷ'
};

// ==================== STAFF ====================
export const MOCK_STAFF = [
  { id: 1, name: 'Trần Văn B', role: 'Sales Manager', email: 'tranvanb@dealer.com', phone: '0902345678', status: 'active' },
  { id: 2, name: 'Lê Thị C', role: 'Sales Consultant', email: 'lethic@dealer.com', phone: '0903456789', status: 'active' },
  { id: 3, name: 'Phạm Văn D', role: 'Test Drive Specialist', email: 'phamvand@dealer.com', phone: '0904567890', status: 'active' }
];

// ==================== REPORTS SECTION DATA ====================
export const MOCK_SALES_PERFORMANCE = [
  { month: 'T1', sales: 47, target: 50, revenue: 11.3 },
  { month: 'T2', sales: 52, target: 50, revenue: 12.5 },
  { month: 'T3', sales: 45, target: 50, revenue: 10.8 },
  { month: 'T4', sales: 58, target: 55, revenue: 13.9 },
  { month: 'T5', sales: 62, target: 60, revenue: 14.8 },
  { month: 'T6', sales: 55, target: 60, revenue: 13.2 }
];

export const MOCK_AR_DATA = [
  { customer: 'Nguyễn Văn A', invoice: 'INV-001', amount: 1500000000, paid: 500000000, remaining: 1000000000, dueDate: '2024-02-15', status: 'overdue' },
  { customer: 'Trần Thị B', invoice: 'INV-002', amount: 1800000000, paid: 1800000000, remaining: 0, dueDate: '2024-01-30', status: 'paid' },
  { customer: 'Lê Văn C', invoice: 'INV-003', amount: 2500000000, paid: 1000000000, remaining: 1500000000, dueDate: '2024-02-28', status: 'pending' }
];

export const MOCK_AP_DATA = [
  { supplier: 'Tesla Inc.', invoice: 'TINV-001', amount: 50000000000, paid: 30000000000, remaining: 20000000000, dueDate: '2024-02-20', status: 'pending' },
  { supplier: 'Parts Supplier Ltd.', invoice: 'PINV-001', amount: 5000000000, paid: 5000000000, remaining: 0, dueDate: '2024-01-25', status: 'paid' }
];
