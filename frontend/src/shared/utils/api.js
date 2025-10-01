import axios from 'axios';

// Frontend-only mock API layer (no real backend). Replace with real endpoints later.
const api = axios.create();

// In-memory mock data
let vehicles = [
  { id: 1, model: 'EV Sedan', variant: 'Premium', color: 'White', price: 35000 },
  { id: 2, model: 'EV SUV', variant: 'Standard', color: 'Blue', price: 42000 }
];
let orders = [
  { id: 1, code: 'ORD001', customerName: 'Nguyen Van A', vehicleModel: 'EV Sedan', status: 'Pending' }
];
let customers = [
  { id: 1, name: 'Nguyen Van A', phone: '0900000001', email: 'a@example.com' },
  { id: 2, name: 'Tran Thi B', phone: '0900000002', email: 'b@example.com' }
];
let inventory = [
  { id: 1, vehicleModel: 'EV Sedan', dealerName: 'Dealer HN', quantity: 5 },
  { id: 2, vehicleModel: 'EV SUV', dealerName: 'Dealer HCM', quantity: 8 }
];
let dealers = [
  { id: 1, name: 'Dealer HN', region: 'Miền Bắc', target: 100 },
  { id: 2, name: 'Dealer HCM', region: 'Miền Nam', target: 150 }
];

// Dashboard mock data
let dealerStats = {
  dealerName: 'EV Dealer Hà Nội',
  sales: { revenue: '847', vehicles: 34, avgPrice: '24.9', targetCompletion: 78 },
  inventory: { total: 156, model3: 89, modelY: 45, modelS: 22 },
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
  ],
  leads: [
    { id: 1, name: 'Trần Thị B', interest: 'Model Y', budget: '1.2B' },
    { id: 2, name: 'Lê Văn C', interest: 'Model 3', budget: '900M' },
    { id: 3, name: 'Phạm Thị D', interest: 'Model S', budget: '2.5B' }
  ]
};

let evmStats = {
  system: { dealers: 45, sales: 1247, inventory: 2156, revenue: '89.2' },
  performance: { targetAchievement: '94.5', customerSatisfaction: '4.8', deliveryTime: '3.2', uptime: '99.1' },
  activities: [
    { id: 1, icon: '✅', title: 'Hệ thống EVM cập nhật phiên bản 2.1', time: '30 phút trước', status: 'success' },
    { id: 2, icon: '📊', title: 'Báo cáo tháng 12 đã hoàn thành', time: '1 giờ trước', status: 'success' },
    { id: 3, icon: '🏪', title: 'Đại lý Hà Nội mở thêm showroom mới', time: '2 giờ trước', status: 'info' },
    { id: 4, icon: '🎯', title: 'Hoàn thành 95% mục tiêu Q4', time: '1 ngày trước', status: 'success' },
    { id: 5, icon: '⚠️', title: 'Cảnh báo tồn kho thấp tại 3 đại lý', time: '2 ngày trước', status: 'warning' }
  ],
  monthlyPerformance: [
    { month: 'T1', performance: 92 },
    { month: 'T2', performance: 89 },
    { month: 'T3', performance: 95 },
    { month: 'T4', performance: 88 },
    { month: 'T5', performance: 93 },
    { month: 'T6', performance: 96 },
    { month: 'T7', performance: 91 },
    { month: 'T8', performance: 94 },
    { month: 'T9', performance: 97 },
    { month: 'T10', performance: 95 },
    { month: 'T11', performance: 98 },
    { month: 'T12', performance: 99 }
  ],
  topDealers: [
    { id: 1, name: 'EV Dealer Hà Nội', sales: 234, revenue: '23.4' },
    { id: 2, name: 'EV Dealer TPHCM', sales: 187, revenue: '18.7' },
    { id: 3, name: 'EV Dealer Đà Nẵng', sales: 156, revenue: '15.6' }
  ]
};

let reportStats = {
  reports: { totalRevenue: '156.8', totalVehiclesSold: 2847, avgRevenuePerVehicle: '55.1', kpiCompletion: 87 },
  analytics: { potentialCustomers: '45,678', conversionRate: '12.8', avgRating: '4.7', totalReports: '1,247' },
  recentReportActivities: [
    { id: 1, icon: '📋', title: 'Báo cáo doanh số tháng 12/2024', time: '2 giờ trước', status: 'success' },
    { id: 2, icon: '📊', title: 'Phân tích xu hướng thị trường Q4', time: '1 ngày trước', status: 'success' },
    { id: 3, icon: '📈', title: 'Báo cáo hiệu suất đại lý', time: '2 ngày trước', status: 'info' },
    { id: 4, icon: '💹', title: 'Dự báo doanh thu Q1/2025', time: '3 ngày trước', status: 'success' },
    { id: 5, icon: '📉', title: 'Cảnh báo: Giảm 5% lượng truy cập', time: '1 tuần trước', status: 'warning' }
  ],
  monthlyReports: [
    { month: 'T1', reports: 45 },
    { month: 'T2', reports: 52 },
    { month: 'T3', reports: 48 },
    { month: 'T4', reports: 67 },
    { month: 'T5', reports: 73 },
    { month: 'T6', reports: 69 },
    { month: 'T7', reports: 58 },
    { month: 'T8', reports: 61 },
    { month: 'T9', reports: 74 },
    { month: 'T10', reports: 68 },
    { month: 'T11', reports: 71 },
    { month: 'T12', reports: 89 }
  ],
  quickReports: [
    { id: 1, title: 'Doanh số hôm nay', data: '23 xe bán - ₫2.3B doanh thu' },
    { id: 2, title: 'Top dealer tuần', data: 'Hà Nội - 45 xe bán' },
    { id: 3, title: 'Inventory alert', data: '12 models cần bổ sung' }
  ]
};

api.interceptors.request.use(config => {
  // Simple routing based on URL
  const { url, method } = config;

  function ok(data) {
    return Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config });
  }
  function notFound() { return Promise.resolve({ data: { message: 'Not Found'}, status:404, statusText:'Not Found', headers:{}, config}); }

  if (method === 'get') {
    switch (url) {
      case '/vehicles': return ok(vehicles);
      case '/orders': return ok(orders);
      case '/customers': return ok(customers);
      case '/inventory': return ok(inventory);
      case '/dealers': return ok(dealers);
      case '/reports/sales': return ok({ total: 1000, byDealer: [{ dealer:'Dealer HN', value:400 }, { dealer:'Dealer HCM', value:600 }] });
      case '/reports/inventory': return ok({ items: inventory.length });
      case '/reports/forecast': return ok({ message: 'AI forecast placeholder', demandIndex: 1.2 });
      
      // Dashboard endpoints
      case '/api/dealer/stats': return ok(dealerStats);
      case '/api/evm/stats': return ok(evmStats);
      case '/api/reports/stats': return ok(reportStats);
      
      default: return notFound();
    }
  }
  return config;
});

export default api;

// Dashboard API functions
export const dashboardAPI = {
  getDealerStats: () => api.get('/api/dealer/stats'),
  getEvmStats: () => api.get('/api/evm/stats'),
  getReportStats: () => api.get('/api/reports/stats')
};
