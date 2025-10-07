// Complete Mock API for EVM System - All Roles and Functions
export class CompleteMockAPI {
  // Simulate API delay
  static delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

  // ==================== USER MANAGEMENT ====================
  
  // Complete user database with all roles
  static users = {
    // ADMIN USERS
    'admin_001': {
      id: 'admin_001',
      username: 'admin.system',
      email: 'admin@evm.com',
      name: 'Nguyễn Văn Admin',
      role: 'admin',
      phone: '+84 901 000 001',
      avatar: '/avatars/admin1.jpg',
      permissions: ['all'],
      createdAt: '2022-01-01',
      isActive: true,
      lastLogin: '2025-10-05T08:00:00Z'
    },
    'admin_002': {
      id: 'admin_002',
      username: 'admin.manager',
      email: 'manager@evm.com',
      name: 'Trần Thị Manager',
      role: 'admin',
      phone: '+84 901 000 002',
      avatar: '/avatars/admin2.jpg',
      permissions: ['user_management', 'dealer_management', 'reports'],
      createdAt: '2022-01-15',
      isActive: true,
      lastLogin: '2025-10-05T07:30:00Z'
    },

    // DEALER USERS
    'dealer_001': {
      id: 'dealer_001',
      username: 'dealer.hanoi',
      email: 'hanoi@tesladealers.com',
      name: 'Lê Văn Hùng',
      role: 'dealer',
      phone: '+84 902 000 001',
      avatar: '/avatars/dealer1.jpg',
      dealerInfo: {
        dealerId: 'DEALER_HN001',
        dealerName: 'Tesla Hà Nội Center',
        location: 'Hà Nội',
        address: '123 Cầu Giấy, Hà Nội',
        territory: 'Miền Bắc',
        salesTarget: 50000000000, // 50 tỷ VND
        currentSales: 35000000000, // 35 tỷ VND
        commission: 0.03, // 3%
        rating: 4.8
      },
      createdAt: '2022-03-01',
      isActive: true,
      lastLogin: '2025-10-05T09:15:00Z'
    },
    'dealer_002': {
      id: 'dealer_002',
      username: 'dealer.hcm',
      email: 'hcm@tesladealers.com',
      name: 'Phạm Thị Lan',
      role: 'dealer',
      phone: '+84 902 000 002',
      avatar: '/avatars/dealer2.jpg',
      dealerInfo: {
        dealerId: 'DEALER_HCM001',
        dealerName: 'Tesla TP.HCM Center',
        location: 'TP.HCM',
        address: '456 Nguyễn Huệ, Q.1, TP.HCM',
        territory: 'Miền Nam',
        salesTarget: 80000000000, // 80 tỷ VND
        currentSales: 65000000000, // 65 tỷ VND
        commission: 0.035, // 3.5%
        rating: 4.9
      },
      createdAt: '2022-03-15',
      isActive: true,
      lastLogin: '2025-10-05T08:45:00Z'
    },
    'dealer_003': {
      id: 'dealer_003',
      username: 'dealer.danang',
      email: 'danang@tesladealers.com',
      name: 'Hoàng Minh Đức',
      role: 'dealer',
      phone: '+84 902 000 003',
      avatar: '/avatars/dealer3.jpg',
      dealerInfo: {
        dealerId: 'DEALER_DN001',
        dealerName: 'Tesla Đà Nẵng Center',
        location: 'Đà Nẵng',
        address: '789 Hàn River, Đà Nẵng',
        territory: 'Miền Trung',
        salesTarget: 30000000000, // 30 tỷ VND
        currentSales: 22000000000, // 22 tỷ VND
        commission: 0.025, // 2.5%
        rating: 4.7
      },
      createdAt: '2022-04-01',
      isActive: true,
      lastLogin: '2025-10-04T16:30:00Z'
    },

    // CUSTOMER USERS
    'customer_001': {
      id: 'customer_001',
      username: 'customer.an',
      email: 'nguyenvanan@email.com',
      name: 'Nguyễn Văn An',
      role: 'customer',
      phone: '+84 903 000 001',
      avatar: '/avatars/customer1.jpg',
      customerInfo: {
        customerId: 'CUST_001',
        membershipLevel: 'Gold',
        joinDate: '2023-03-15',
        loyaltyPoints: 2450,
        totalSpent: 2500000000, // 2.5 tỷ VND
        creditScore: 750,
        preferredDealer: 'DEALER_HN001',
        addresses: [
          {
            type: 'home',
            address: '123 Hoàng Hoa Thám, Ba Đình, Hà Nội',
            isDefault: true
          },
          {
            type: 'work',
            address: '456 Láng Hạ, Đống Đa, Hà Nội',
            isDefault: false
          }
        ]
      },
      createdAt: '2023-03-15',
      isActive: true,
      lastLogin: '2025-10-05T10:00:00Z'
    },
    'customer_002': {
      id: 'customer_002',
      username: 'customer.binh',
      email: 'tranthibinh@email.com',
      name: 'Trần Thị Bình',
      role: 'customer',
      phone: '+84 903 000 002',
      avatar: '/avatars/customer2.jpg',
      customerInfo: {
        customerId: 'CUST_002',
        membershipLevel: 'Diamond',
        joinDate: '2022-01-10',
        loyaltyPoints: 8750,
        totalSpent: 8500000000, // 8.5 tỷ VND
        creditScore: 850,
        preferredDealer: 'DEALER_HCM001',
        addresses: [
          {
            type: 'home',
            address: '789 Điện Biên Phủ, Q.3, TP.HCM',
            isDefault: true
          }
        ]
      },
      createdAt: '2022-01-10',
      isActive: true,
      lastLogin: '2025-10-05T09:30:00Z'
    },
    'customer_003': {
      id: 'customer_003',
      username: 'customer.chau',
      email: 'leminhchau@email.com',
      name: 'Lê Minh Châu',
      role: 'customer',
      phone: '+84 903 000 003',
      avatar: '/avatars/customer3.jpg',
      customerInfo: {
        customerId: 'CUST_003',
        membershipLevel: 'Platinum',
        joinDate: '2022-08-20',
        loyaltyPoints: 5230,
        totalSpent: 5000000000, // 5 tỷ VND
        creditScore: 800,
        preferredDealer: 'DEALER_DN001',
        addresses: [
          {
            type: 'home',
            address: '321 Trần Phú, Hải Châu, Đà Nẵng',
            isDefault: true
          }
        ]
      },
      createdAt: '2022-08-20',
      isActive: true,
      lastLogin: '2025-10-05T08:15:00Z'
    },
    'customer_004': {
      id: 'customer_004',
      username: 'customer.duc',
      email: 'phamvanduc@email.com',
      name: 'Phạm Văn Đức',
      role: 'customer',
      phone: '+84 903 000 004',
      avatar: '/avatars/customer4.jpg',
      customerInfo: {
        customerId: 'CUST_004',
        membershipLevel: 'Silver',
        joinDate: '2024-02-05',
        loyaltyPoints: 980,
        totalSpent: 1200000000, // 1.2 tỷ VND
        creditScore: 700,
        preferredDealer: 'DEALER_HN001',
        addresses: [
          {
            type: 'home',
            address: '654 Giải Phóng, Hai Bà Trưng, Hà Nội',
            isDefault: true
          }
        ]
      },
      createdAt: '2024-02-05',
      isActive: true,
      lastLogin: '2025-10-04T19:45:00Z'
    },
    'customer_005': {
      id: 'customer_005',
      username: 'customer.e',
      email: 'hoangthie@email.com',
      name: 'Hoàng Thị Ê',
      role: 'customer',
      phone: '+84 903 000 005',
      avatar: '/avatars/customer5.jpg',
      customerInfo: {
        customerId: 'CUST_005',
        membershipLevel: 'Bronze',
        joinDate: '2024-07-15',
        loyaltyPoints: 340,
        totalSpent: 800000000, // 800 triệu VND
        creditScore: 650,
        preferredDealer: 'DEALER_HCM001',
        addresses: [
          {
            type: 'home',
            address: '987 Cộng Hòa, Tân Bình, TP.HCM',
            isDefault: true
          }
        ]
      },
      createdAt: '2024-07-15',
      isActive: true,
      lastLogin: '2025-10-05T07:20:00Z'
    }
  };

  // ==================== VEHICLE CATALOG ====================
  
  static vehicleModels = {
    'model_3_standard': {
      id: 'model_3_standard',
      name: 'Tesla Model 3',
      variant: 'Standard Range Plus',
      category: 'sedan',
      price: 1200000000, // 1.2 tỷ VND
      currency: 'VND',
      specifications: {
        range: 423,
        acceleration: '5.8s (0-100km/h)',
        topSpeed: 225,
        drivetrain: 'RWD',
        seating: 5,
        cargo: 425, // liters
        chargingTime: '31 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Autopilot', 'Premium Audio', 'Heated Seats'],
      colors: ['Pearl White', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      images: ['/vehicles/model3_1.jpg', '/vehicles/model3_2.jpg'],
      availability: 'in_stock',
      estimatedDelivery: '2-4 weeks'
    },
    'model_3_performance': {
      id: 'model_3_performance',
      name: 'Tesla Model 3',
      variant: 'Performance',
      category: 'sedan',
      price: 1800000000, // 1.8 tỷ VND
      currency: 'VND',
      specifications: {
        range: 567,
        acceleration: '3.1s (0-100km/h)',
        topSpeed: 261,
        drivetrain: 'AWD',
        seating: 5,
        cargo: 425, // liters
        chargingTime: '31 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Autopilot Enhanced', 'Premium Audio', 'Heated Seats', 'Track Mode'],
      colors: ['Pearl White', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      images: ['/vehicles/model3_perf_1.jpg', '/vehicles/model3_perf_2.jpg'],
      availability: 'in_stock',
      estimatedDelivery: '3-5 weeks'
    },
    'model_y_long_range': {
      id: 'model_y_long_range',
      name: 'Tesla Model Y',
      variant: 'Long Range',
      category: 'suv',
      price: 2200000000, // 2.2 tỷ VND
      currency: 'VND',
      specifications: {
        range: 456,
        acceleration: '4.8s (0-100km/h)',
        topSpeed: 217,
        drivetrain: 'AWD',
        seating: 7,
        cargo: 854, // liters
        chargingTime: '27 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Autopilot Enhanced', 'Premium Audio', 'Heated Seats', 'Third Row'],
      colors: ['Pearl White', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      images: ['/vehicles/modely_lr_1.jpg', '/vehicles/modely_lr_2.jpg'],
      availability: 'pre_order',
      estimatedDelivery: '6-8 weeks'
    },
    'model_y_performance': {
      id: 'model_y_performance',
      name: 'Tesla Model Y',
      variant: 'Performance',
      category: 'suv',
      price: 2800000000, // 2.8 tỷ VND
      currency: 'VND',
      specifications: {
        range: 514,
        acceleration: '3.5s (0-100km/h)',
        topSpeed: 250,
        drivetrain: 'AWD',
        seating: 5,
        cargo: 854, // liters
        chargingTime: '27 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Full Self-Driving', 'Premium Audio', 'Heated/Cooled Seats', 'Performance Wheels'],
      colors: ['Pearl White', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      images: ['/vehicles/modely_perf_1.jpg', '/vehicles/modely_perf_2.jpg'],
      availability: 'limited',
      estimatedDelivery: '8-12 weeks'
    },
    'model_s_plaid': {
      id: 'model_s_plaid',
      name: 'Tesla Model S',
      variant: 'Plaid',
      category: 'luxury_sedan',
      price: 3800000000, // 3.8 tỷ VND
      currency: 'VND',
      specifications: {
        range: 628,
        acceleration: '1.99s (0-100km/h)',
        topSpeed: 322,
        drivetrain: 'AWD',
        seating: 5,
        cargo: 793, // liters
        chargingTime: '40 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Full Self-Driving', 'Premium Audio', 'Heated/Cooled Seats', 'HEPA Filter', 'Premium Connectivity'],
      colors: ['Pearl White', 'Midnight Silver', 'Deep Blue', 'Red Multi-Coat'],
      images: ['/vehicles/models_plaid_1.jpg', '/vehicles/models_plaid_2.jpg'],
      availability: 'premium_order',
      estimatedDelivery: '12-16 weeks'
    },
    'cybertruck_foundation': {
      id: 'cybertruck_foundation',
      name: 'Tesla Cybertruck',
      variant: 'Foundation Series',
      category: 'pickup_truck',
      price: 4500000000, // 4.5 tỷ VND
      currency: 'VND',
      specifications: {
        range: 547,
        acceleration: '2.6s (0-100km/h)',
        topSpeed: 209,
        drivetrain: 'AWD',
        seating: 6,
        cargo: 1897, // liters
        towingCapacity: 4990, // kg
        chargingTime: '45 mins (10-80%)',
        warranty: '4 years / 80,000 km'
      },
      features: ['Full Self-Driving', 'Premium Audio', 'Air Suspension', 'Power Tonneau Cover', 'Off-Road Package'],
      colors: ['Stainless Steel'],
      images: ['/vehicles/cybertruck_1.jpg', '/vehicles/cybertruck_2.jpg'],
      availability: 'exclusive_order',
      estimatedDelivery: '20-24 weeks'
    }
  };

  // ==================== ORDERS AND SALES ====================
  
  static orders = {
    'ORDER_001': {
      id: 'ORDER_001',
      orderNumber: 'ORD-2025-001',
      customerId: 'customer_001',
      dealerId: 'dealer_001',
      vehicleId: 'model_3_standard',
      status: 'delivered',
      orderDate: '2023-03-20',
      deliveryDate: '2023-05-15',
      totalAmount: 1200000000,
      downPayment: 240000000, // 20%
      financingAmount: 960000000,
      paymentMethod: 'financing',
      deliveryAddress: '123 Hoàng Hoa Thám, Ba Đình, Hà Nội',
      configurations: {
        color: 'Pearl White',
        interior: 'Black',
        wheels: 'Standard',
        autopilot: 'Basic'
      },
      timeline: [
        { status: 'ordered', date: '2023-03-20', note: 'Đơn hàng được tạo' },
        { status: 'confirmed', date: '2023-03-21', note: 'Xác nhận đơn hàng' },
        { status: 'production', date: '2023-04-01', note: 'Bắt đầu sản xuất' },
        { status: 'shipped', date: '2023-05-10', note: 'Xe được vận chuyển' },
        { status: 'delivered', date: '2023-05-15', note: 'Giao xe thành công' }
      ]
    },
    'ORDER_002': {
      id: 'ORDER_002',
      orderNumber: 'ORD-2025-002',
      customerId: 'customer_002',
      dealerId: 'dealer_002',
      vehicleId: 'model_s_plaid',
      status: 'production',
      orderDate: '2025-09-15',
      estimatedDelivery: '2025-12-15',
      totalAmount: 3800000000,
      downPayment: 1140000000, // 30%
      financingAmount: 2660000000,
      paymentMethod: 'financing',
      deliveryAddress: '789 Điện Biên Phủ, Q.3, TP.HCM',
      configurations: {
        color: 'Red Multi-Coat',
        interior: 'Cream',
        wheels: 'Premium',
        autopilot: 'Full Self-Driving'
      },
      timeline: [
        { status: 'ordered', date: '2025-09-15', note: 'Đơn hàng được tạo' },
        { status: 'confirmed', date: '2025-09-16', note: 'Xác nhận đơn hàng' },
        { status: 'production', date: '2025-10-01', note: 'Bắt đầu sản xuất' }
      ]
    }
  };

  // ==================== AUTHENTICATION ====================
  
  static async login(username, password) {
    await this.delay();
    
    const user = Object.values(this.users).find(u => 
      u.username === username || u.email === username
    );
    
    if (!user) {
      return {
        success: false,
        error: 'Tài khoản không tồn tại'
      };
    }
    
    if (!user.isActive) {
      return {
        success: false,
        error: 'Tài khoản đã bị khóa'
      };
    }
    
    // Simple password check (in real app, use proper hashing)
    const validPasswords = {
      'admin_001': 'admin123',
      'admin_002': 'manager123',
      'dealer_001': 'dealer123',
      'dealer_002': 'dealer123',
      'dealer_003': 'dealer123',
      'customer_001': 'customer123',
      'customer_002': 'customer123',
      'customer_003': 'customer123',
      'customer_004': 'customer123',
      'customer_005': 'customer123'
    };
    
    if (validPasswords[user.id] !== password) {
      return {
        success: false,
        error: 'Mật khẩu không đúng'
      };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          permissions: user.permissions || [],
          ...((user.role === 'customer' && user.customerInfo) ? { customerInfo: user.customerInfo } : {}),
          ...((user.role === 'dealer' && user.dealerInfo) ? { dealerInfo: user.dealerInfo } : {})
        },
        token: `jwt_token_${user.id}_${Date.now()}`,
        expiresIn: 86400 // 24 hours
      }
    };
  }
  
  static async logout() {
    await this.delay(100);
    return { success: true };
  }
  
  static async refreshToken(token) {
    await this.delay(200);
    return {
      success: true,
      data: {
        token: `refreshed_${token}`,
        expiresIn: 86400
      }
    };
  }

  // ==================== USER MANAGEMENT (ADMIN) ====================
  
  static async getAllUsers(filters = {}) {
    await this.delay();
    
    let filteredUsers = Object.values(this.users);
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: {
        users: filteredUsers,
        total: filteredUsers.length,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: filteredUsers.length
        }
      }
    };
  }
  
  static async getUserById(userId) {
    await this.delay();
    
    const user = this.users[userId];
    if (!user) {
      return {
        success: false,
        error: 'Người dùng không tồn tại'
      };
    }
    
    return {
      success: true,
      data: user
    };
  }
  
  static async createUser(userData) {
    await this.delay();
    
    const newId = `${userData.role}_${String(Date.now()).slice(-3)}`;
    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };
    
    this.users[newId] = newUser;
    
    return {
      success: true,
      data: newUser
    };
  }
  
  static async updateUser(userId, updateData) {
    await this.delay();
    
    if (!this.users[userId]) {
      return {
        success: false,
        error: 'Người dùng không tồn tại'
      };
    }
    
    this.users[userId] = {
      ...this.users[userId],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.users[userId]
    };
  }
  
  static async deleteUser(userId) {
    await this.delay();
    
    if (!this.users[userId]) {
      return {
        success: false,
        error: 'Người dùng không tồn tại'
      };
    }
    
    delete this.users[userId];
    
    return {
      success: true,
      message: 'Xóa người dùng thành công'
    };
  }

  // ==================== VEHICLE MANAGEMENT ====================
  
  static async getAllVehicles(filters = {}) {
    await this.delay();
    
    let vehicles = Object.values(this.vehicleModels);
    
    if (filters.category) {
      vehicles = vehicles.filter(v => v.category === filters.category);
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      vehicles = vehicles.filter(v => v.price >= min && v.price <= max);
    }
    
    if (filters.availability) {
      vehicles = vehicles.filter(v => v.availability === filters.availability);
    }
    
    return {
      success: true,
      data: vehicles
    };
  }
  
  static async getVehicleById(vehicleId) {
    await this.delay();
    
    const vehicle = this.vehicleModels[vehicleId];
    if (!vehicle) {
      return {
        success: false,
        error: 'Xe không tồn tại'
      };
    }
    
    return {
      success: true,
      data: vehicle
    };
  }

  // ==================== ORDER MANAGEMENT ====================
  
  static async getAllOrders(filters = {}) {
    await this.delay();
    
    let orders = Object.values(this.orders);
    
    if (filters.customerId) {
      orders = orders.filter(o => o.customerId === filters.customerId);
    }
    
    if (filters.dealerId) {
      orders = orders.filter(o => o.dealerId === filters.dealerId);
    }
    
    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      orders = orders.filter(o => {
        const orderDate = new Date(o.orderDate);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
    }
    
    return {
      success: true,
      data: orders
    };
  }
  
  static async getOrderById(orderId) {
    await this.delay();
    
    const order = this.orders[orderId];
    if (!order) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }
    
    return {
      success: true,
      data: order
    };
  }
  
  static async createOrder(orderData) {
    await this.delay();
    
    const newOrderId = `ORDER_${String(Date.now()).slice(-3)}`;
    const newOrder = {
      id: newOrderId,
      orderNumber: `ORD-2025-${String(Date.now()).slice(-3)}`,
      ...orderData,
      status: 'ordered',
      orderDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          status: 'ordered',
          date: new Date().toISOString().split('T')[0],
          note: 'Đơn hàng được tạo'
        }
      ]
    };
    
    this.orders[newOrderId] = newOrder;
    
    return {
      success: true,
      data: newOrder
    };
  }
  
  static async updateOrderStatus(orderId, status, note = '') {
    await this.delay();
    
    const order = this.orders[orderId];
    if (!order) {
      return {
        success: false,
        error: 'Đơn hàng không tồn tại'
      };
    }
    
    order.status = status;
    order.timeline.push({
      status,
      date: new Date().toISOString().split('T')[0],
      note: note || `Cập nhật trạng thái: ${status}`
    });
    
    return {
      success: true,
      data: order
    };
  }

  // ==================== ANALYTICS AND REPORTS ====================
  
  static async getDashboardAnalytics(role, userId) {
    await this.delay();
    
    const analytics = {
      admin: {
        totalUsers: Object.keys(this.users).length,
        totalCustomers: Object.values(this.users).filter(u => u.role === 'customer').length,
        totalDealers: Object.values(this.users).filter(u => u.role === 'dealer').length,
        totalOrders: Object.keys(this.orders).length,
        totalRevenue: Object.values(this.orders).reduce((sum, order) => sum + order.totalAmount, 0),
        monthlyGrowth: 15.5,
        activeUsers: Object.values(this.users).filter(u => u.isActive).length,
        vehiclesSold: Object.values(this.orders).filter(o => o.status === 'delivered').length,
        avgOrderValue: Object.values(this.orders).reduce((sum, order) => sum + order.totalAmount, 0) / Object.keys(this.orders).length,
        topDealers: Object.values(this.users)
          .filter(u => u.role === 'dealer')
          .sort((a, b) => (b.dealerInfo?.currentSales || 0) - (a.dealerInfo?.currentSales || 0))
          .slice(0, 5),
        recentOrders: Object.values(this.orders).slice(-10)
      },
      dealer: {
        dealerInfo: this.users[userId]?.dealerInfo,
        myOrders: Object.values(this.orders).filter(o => o.dealerId === userId),
        salesTarget: this.users[userId]?.dealerInfo?.salesTarget || 0,
        currentSales: this.users[userId]?.dealerInfo?.currentSales || 0,
        commission: this.users[userId]?.dealerInfo?.commission || 0,
        monthlyTarget: (this.users[userId]?.dealerInfo?.salesTarget || 0) / 12,
        completionRate: ((this.users[userId]?.dealerInfo?.currentSales || 0) / (this.users[userId]?.dealerInfo?.salesTarget || 1)) * 100,
        activeCustomers: Object.values(this.users).filter(u => 
          u.role === 'customer' && u.customerInfo?.preferredDealer === this.users[userId]?.dealerInfo?.dealerId
        ).length
      },
      customer: {
        profile: this.users[userId]?.customerInfo,
        myOrders: Object.values(this.orders).filter(o => o.customerId === userId),
        totalSpent: this.users[userId]?.customerInfo?.totalSpent || 0,
        loyaltyPoints: this.users[userId]?.customerInfo?.loyaltyPoints || 0,
        membershipLevel: this.users[userId]?.customerInfo?.membershipLevel || 'Bronze',
        creditScore: this.users[userId]?.customerInfo?.creditScore || 650,
        vehicleCount: Object.values(this.orders).filter(o => o.customerId === userId && o.status === 'delivered').length
      }
    };
    
    return {
      success: true,
      data: analytics[role] || {}
    };
  }

  // ==================== UTILITY METHODS ====================
  
  static formatCurrency(amount, currency = 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  static formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
  
  static generateId(prefix = 'ID') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // ==================== BULK OPERATIONS ====================
  
  static async bulkCreateUsers(usersData) {
    await this.delay(1000);
    
    const results = [];
    for (const userData of usersData) {
      try {
        const result = await this.createUser(userData);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          userData
        });
      }
    }
    
    return {
      success: true,
      data: results
    };
  }
  
  static async exportData(dataType, filters = {}) {
    await this.delay(1500);
    
    let data = [];
    switch (dataType) {
      case 'users':
        data = Object.values(this.users);
        break;
      case 'orders':
        data = Object.values(this.orders);
        break;
      case 'vehicles':
        data = Object.values(this.vehicleModels);
        break;
      default:
        return {
          success: false,
          error: 'Loại dữ liệu không hợp lệ'
        };
    }
    
    return {
      success: true,
      data: {
        exportData: data,
        fileName: `${dataType}_export_${new Date().toISOString().split('T')[0]}.json`,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Export cho sử dụng global
window.CompleteMockAPI = CompleteMockAPI;
export default CompleteMockAPI;