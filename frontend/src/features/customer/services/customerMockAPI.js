// Mock API service for Customer Dashboard
export class CustomerMockAPI {
  // Simulate API delay
  static delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock data for customer overview
  static async getCustomerOverview(customerId) {
    await this.delay();
    return {
      success: true,
      data: {
        customerId,
        totalVehicles: 2,
        pendingServices: 1,
        totalLoanAmount: 3000000000, // 3 tỷ VND
        remainingLoanAmount: 2300000000, // 2.3 tỷ VND
        monthlyPayment: 60000000, // 60 triệu VND
        nextPaymentDate: '2024-10-15',
        creditScore: 750,
        membershipLevel: 'Premium'
      }
    };
  }

  // Mock data for customer vehicles
  static async getCustomerVehicles(customerId) {
    await this.delay();
    return {
      success: true,
      data: [
        {
          id: 1,
          model: 'Tesla Model 3',
          year: 2023,
          color: 'Pearl White',
          vin: 'TESLA2023M3001',
          purchaseDate: '2023-05-15',
          mileage: 15420,
          batteryLevel: 87,
          range: 423,
          lastService: '2024-08-15',
          nextService: '2024-11-15',
          insuranceExpiry: '2024-12-31',
          status: 'active'
        },
        {
          id: 2,
          model: 'Tesla Model Y',
          year: 2024,
          color: 'Midnight Silver',
          vin: 'TESLA2024MY002',
          purchaseDate: '2024-01-20',
          mileage: 8950,
          batteryLevel: 92,
          range: 456,
          lastService: '2024-09-10',
          nextService: '2024-12-10',
          insuranceExpiry: '2025-01-20',
          status: 'active'
        }
      ]
    };
  }

  // Mock data for customer services
  static async getCustomerServices(customerId) {
    await this.delay();
    return {
      success: true,
      data: [
        {
          id: 1,
          vehicleId: 1,
          vehicleModel: 'Tesla Model 3',
          serviceType: 'Bảo dưỡng định kỳ',
          scheduledDate: '2024-10-25',
          status: 'scheduled',
          description: 'Kiểm tra tổng thể, thay lọc cabin, kiểm tra phanh',
          estimatedCost: 2500000,
          serviceCenter: 'Tesla Service Center Hà Nội',
          technician: 'Nguyễn Văn A'
        },
        {
          id: 2,
          vehicleId: 2,
          vehicleModel: 'Tesla Model Y',
          serviceType: 'Sửa chữa',
          scheduledDate: '2024-09-30',
          status: 'completed',
          description: 'Cập nhật phần mềm, kiểm tra hệ thống Autopilot',
          estimatedCost: 0,
          actualCost: 0,
          serviceCenter: 'Tesla Service Center TP.HCM',
          technician: 'Trần Thị B',
          completedDate: '2024-09-30'
        },
        {
          id: 3,
          vehicleId: 1,
          vehicleModel: 'Tesla Model 3',
          serviceType: 'Kiểm tra an toàn',
          scheduledDate: '2024-11-15',
          status: 'pending',
          description: 'Kiểm tra hệ thống an toàn, đăng kiểm định kỳ',
          estimatedCost: 1500000,
          serviceCenter: 'Tesla Service Center Hà Nội',
          technician: 'Lê Văn C'
        }
      ]
    };
  }

  // Mock data for financing information
  static async getFinancingInfo(customerId) {
    await this.delay();
    return {
      success: true,
      data: {
        loans: [
          {
            id: 1,
            vehicleId: 1,
            vehicleModel: 'Tesla Model 3',
            loanAmount: 1200000000, // 1.2 tỷ VND
            remainingAmount: 800000000, // 800 triệu VND
            monthlyPayment: 25000000, // 25 triệu VND
            interestRate: 6.5,
            loanTerm: 60, // 5 năm
            remainingMonths: 32,
            nextPaymentDate: '2024-10-15',
            startDate: '2023-05-15',
            bankName: 'Vietcombank',
            status: 'active'
          },
          {
            id: 2,
            vehicleId: 2,
            vehicleModel: 'Tesla Model Y',
            loanAmount: 1800000000, // 1.8 tỷ VND
            remainingAmount: 1500000000, // 1.5 tỷ VND
            monthlyPayment: 35000000, // 35 triệu VND
            interestRate: 7.0,
            loanTerm: 60, // 5 năm
            remainingMonths: 51,
            nextPaymentDate: '2024-10-20',
            startDate: '2024-01-20',
            bankName: 'BIDV',
            status: 'active'
          }
        ]
      }
    };
  }

  // Mock data for payment history
  static async getPaymentHistory(customerId) {
    await this.delay();
    return {
      success: true,
      data: [
        {
          id: 1,
          loanId: 1,
          vehicleModel: 'Tesla Model 3',
          amount: 25000000,
          paymentDate: '2024-09-15',
          dueDate: '2024-09-15',
          status: 'paid',
          paymentMethod: 'Chuyển khoản',
          transactionId: 'TXN240915001'
        },
        {
          id: 2,
          loanId: 2,
          vehicleModel: 'Tesla Model Y',
          amount: 35000000,
          paymentDate: '2024-09-20',
          dueDate: '2024-09-20',
          status: 'paid',
          paymentMethod: 'Chuyển khoản',
          transactionId: 'TXN240920001'
        },
        {
          id: 3,
          loanId: 1,
          vehicleModel: 'Tesla Model 3',
          amount: 25000000,
          paymentDate: null,
          dueDate: '2024-10-15',
          status: 'pending',
          paymentMethod: null,
          transactionId: null
        },
        {
          id: 4,
          loanId: 2,
          vehicleModel: 'Tesla Model Y',
          amount: 35000000,
          paymentDate: null,
          dueDate: '2024-10-20',
          status: 'pending',
          paymentMethod: null,
          transactionId: null
        },
        {
          id: 5,
          loanId: 1,
          vehicleModel: 'Tesla Model 3',
          amount: 25000000,
          paymentDate: '2024-08-15',
          dueDate: '2024-08-15',
          status: 'paid',
          paymentMethod: 'Chuyển khoản',
          transactionId: 'TXN240815001'
        },
        {
          id: 6,
          loanId: 2,
          vehicleModel: 'Tesla Model Y',
          amount: 35000000,
          paymentDate: '2024-08-20',
          dueDate: '2024-08-20',
          status: 'paid',
          paymentMethod: 'Chuyển khoản',
          transactionId: 'TXN240820001'
        }
      ]
    };
  }

  // Utility method to format currency
  static formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Utility method to format date
  static formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  // Method to get all customer data at once
  static async getAllCustomerData(customerId) {
    try {
      const [overview, vehicles, services, financing, paymentHistory] = await Promise.all([
        this.getCustomerOverview(customerId),
        this.getCustomerVehicles(customerId),
        this.getCustomerServices(customerId),
        this.getFinancingInfo(customerId),
        this.getPaymentHistory(customerId)
      ]);

      return {
        success: true,
        data: {
          overview: overview.data,
          vehicles: vehicles.data,
          services: services.data,
          financing: financing.data,
          paymentHistory: paymentHistory.data
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}