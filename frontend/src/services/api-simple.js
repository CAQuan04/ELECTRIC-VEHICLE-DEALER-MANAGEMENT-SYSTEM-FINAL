// Simple mock API without axios interceptors

// Mock data
const dealerStats = {
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
  ]
};

const evmStats = {
  system: { dealers: 45, sales: 1247, inventory: 2156, revenue: '89.2' },
  performance: { targetAchievement: '94.5', customerSatisfaction: '4.8', deliveryTime: '3.2', uptime: '99.1' },
  activities: [
    { id: 1, icon: '✅', title: 'Hệ thống EVM cập nhật phiên bản 2.1', time: '30 phút trước', status: 'success' },
    { id: 2, icon: '📊', title: 'Báo cáo tháng 12 đã hoàn thành', time: '1 giờ trước', status: 'success' },
    { id: 3, icon: '🏪', title: 'Đại lý Hà Nội mở thêm showroom mới', time: '2 giờ trước', status: 'info' }
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
  ]
};

const reportStats = {
  reports: { totalRevenue: '156.8', totalVehiclesSold: 2847, avgRevenuePerVehicle: '55.1', kpiCompletion: 87 },
  analytics: { potentialCustomers: '45,678', conversionRate: '12.8', avgRating: '4.7', totalReports: '1,247' },
  recentReportActivities: [
    { id: 1, icon: '📋', title: 'Báo cáo doanh số tháng 12/2024', time: '2 giờ trước', status: 'success' },
    { id: 2, icon: '📊', title: 'Phân tích xu hướng thị trường Q4', time: '1 ngày trước', status: 'success' }
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
  ]
};

// Mock API functions with Promise
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardAPI = {
  getDealerStats: async () => {
    await mockDelay();
    return { data: dealerStats, status: 200 };
  },
  
  getEvmStats: async () => {
    await mockDelay();
    return { data: evmStats, status: 200 };
  },
  
  getReportStats: async () => {
    await mockDelay();
    return { data: reportStats, status: 200 };
  }
};

export default dashboardAPI;