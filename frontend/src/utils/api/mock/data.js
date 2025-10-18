/**
 * Mock Data - Centralized Mock Database
 * Contains all mock data for EVM system
 */

// ==================== DEALER MOCK DATA ====================
export const dealerMockData = {
  stats: {
    dealerName: 'EV Dealer Hà Nội',
    sales: { 
      revenue: '847', 
      vehicles: 34, 
      avgPrice: '24.9', 
      targetCompletion: 78 
    },
    inventory: { 
      total: 156, 
      model3: 89, 
      modelY: 45, 
      modelS: 22 
    },
    recentActivities: [
      { id: 1, icon: '✅', title: 'Đơn hàng #DH001 hoàn thành', time: '10 phút trước', status: 'success' },
      { id: 2, icon: '📞', title: 'Cuộc gọi tư vấn với khách hàng Nguyễn Văn A', time: '25 phút trước', status: 'pending' },
      { id: 3, icon: '🚗', title: 'Test drive Model 3 được đặt lịch', time: '1 giờ trước', status: 'info' },
      { id: 4, icon: '📊', title: 'Báo cáo doanh số tuần được tạo', time: '2 giờ trước', status: 'success' },
      { id: 5, icon: '🔧', title: 'Xe Model Y #VIN789 cần bảo trì', time: '3 giờ trước', status: 'warning' }
    ],
    monthlyRevenue: [
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
    ]
  }
};

// ==================== VEHICLES ====================
export const vehiclesMockData = [
  { id: 1, model: 'EV Sedan', variant: 'Premium', color: 'White', price: 35000 },
  { id: 2, model: 'EV SUV', variant: 'Standard', color: 'Blue', price: 42000 }
];

// ==================== ORDERS ====================
export const ordersMockData = [
  { id: 1, code: 'ORD001', customerName: 'Nguyen Van A', vehicleModel: 'EV Sedan', status: 'Pending' }
];

// ==================== CUSTOMERS ====================
export const customersMockData = [
  { id: 1, name: 'Nguyen Van A', phone: '0900000001', email: 'a@example.com' },
  { id: 2, name: 'Tran Thi B', phone: '0900000002', email: 'b@example.com' }
];

// ==================== INVENTORY ====================
export const inventoryMockData = [
  { id: 1, vehicleModel: 'EV Sedan', dealerName: 'Dealer HN', quantity: 5 },
  { id: 2, vehicleModel: 'EV SUV', dealerName: 'Dealer HCM', quantity: 8 }
];

// ==================== DEALERS ====================
export const dealersMockData = [
  { id: 1, name: 'Dealer HN', region: 'Miền Bắc', target: 100 },
  { id: 2, name: 'Dealer HCM', region: 'Miền Nam', target: 150 }
];

// ==================== API UTILITIES ====================
export const apiDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const apiResponse = {
  success: (data) => ({ success: true, data }),
  error: (message) => ({ success: false, error: message })
};
