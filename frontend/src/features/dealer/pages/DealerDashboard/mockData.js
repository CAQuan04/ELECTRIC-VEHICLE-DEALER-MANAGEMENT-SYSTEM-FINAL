/**
 * Mock Data for Dealer Dashboard
 * Used as fallback when API calls fail
 */

export const mockOrders = [
  {
    id: 1,
    orderId: 'ORD001',
    customerName: 'Nguyễn Văn A',
    vehicleName: 'Tesla Model 3',
    totalAmount: 1200000000,
    status: 'pending',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    orderId: 'ORD002',
    customerName: 'Trần Thị B',
    vehicleName: 'Tesla Model Y',
    totalAmount: 1500000000,
    status: 'processing',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    orderId: 'ORD003',
    customerName: 'Lê Văn C',
    vehicleName: 'Tesla Model S',
    totalAmount: 2800000000,
    status: 'completed',
    priority: 'low',
    createdAt: new Date().toISOString()
  }
];

export const mockCustomers = [
  {
    id: 1,
    customerId: 'CUS001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    orderCount: 8,
    totalSpent: 12500000000,
    tier: 'VIP'
  },
  {
    id: 2,
    customerId: 'CUS002',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0902345678',
    orderCount: 5,
    totalSpent: 8200000000,
    tier: 'Gold'
  },
  {
    id: 3,
    customerId: 'CUS003',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0903456789',
    orderCount: 3,
    totalSpent: 5100000000,
    tier: 'Silver'
  }
];

export const mockDashboardData = (currentUser) => ({
  dealer: {
    name: currentUser?.shopName || 'Đại lý',
    vehicles: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  },
  performance: {
    monthlySales: 0,
    quarterTarget: 0,
    customerSatisfaction: 0,
    deliveryTime: 0
  },
  recentOrders: [],
  inventory: []
});

export const mockOrderStats = {
  pending: 12,
  processing: 28,
  completed: 156,
  cancelled: 5
};

export const mockCustomerStats = {
  total: 342,
  vip: 48,
  newThisMonth: 23,
  potential: 67
};
