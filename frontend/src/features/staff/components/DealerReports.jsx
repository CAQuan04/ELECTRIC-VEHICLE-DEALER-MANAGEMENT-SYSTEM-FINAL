import React, { useState } from 'react';
import './DealerReports.css';

const DealerReports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('this_month');

  // Mock sales data by staff
  const [salesReports] = useState([
    {
      staffId: 'STAFF001',
      staffName: 'Nguyễn Văn Đức',
      position: 'Tư vấn bán hàng',
      totalSales: 4,
      totalRevenue: 3200000000,
      topVehicle: 'Tesla Model 3',
      avgDealValue: 800000000,
      conversionRate: 75,
      thisMonth: {
        sales: 2,
        revenue: 1600000000,
        meetings: 12,
        conversion: 80
      },
      lastMonth: {
        sales: 2,
        revenue: 1600000000,
        meetings: 10,
        conversion: 70
      }
    },
    {
      staffId: 'STAFF002',
      staffName: 'Trần Thị Mai',
      position: 'Tư vấn bán hàng',
      totalSales: 3,
      totalRevenue: 2700000000,
      topVehicle: 'Tesla Model Y',
      avgDealValue: 900000000,
      conversionRate: 60,
      thisMonth: {
        sales: 1,
        revenue: 900000000,
        meetings: 8,
        conversion: 65
      },
      lastMonth: {
        sales: 2,
        revenue: 1800000000,
        meetings: 12,
        conversion: 55
      }
    },
    {
      staffId: 'STAFF003',
      staffName: 'Lê Văn Hùng',
      position: 'Trưởng phòng bán hàng',
      totalSales: 6,
      totalRevenue: 5400000000,
      topVehicle: 'Tesla Model S',
      avgDealValue: 900000000,
      conversionRate: 85,
      thisMonth: {
        sales: 3,
        revenue: 2700000000,
        meetings: 15,
        conversion: 90
      },
      lastMonth: {
        sales: 3,
        revenue: 2700000000,
        meetings: 18,
        conversion: 80
      }
    }
  ]);

  // Mock debt tracking data
  const [debtReports] = useState([
    {
      customerId: 'CUS001',
      customerName: 'Nguyễn Văn An',
      phone: '0901234567',
      orderId: 'ORD001',
      vehicle: 'Tesla Model S',
      totalAmount: 2850000000,
      paidAmount: 1425000000,
      remainingDebt: 1425000000,
      installmentPlan: 'monthly',
      monthlyPayment: 71250000,
      nextPaymentDate: '2024-02-15',
      daysOverdue: 0,
      status: 'current',
      riskLevel: 'low'
    },
    {
      customerId: 'CUS004',
      customerName: 'Phạm Thị Lan',
      phone: '0908765432',
      orderId: 'ORD004',
      vehicle: 'Tesla Model 3',
      totalAmount: 1200000000,
      paidAmount: 360000000,
      remainingDebt: 840000000,
      installmentPlan: 'monthly',
      monthlyPayment: 42000000,
      nextPaymentDate: '2024-01-25',
      daysOverdue: 5,
      status: 'overdue',
      riskLevel: 'medium'
    },
    {
      customerId: 'CUS005',
      customerName: 'Võ Minh Tuấn',
      phone: '0913456789',
      orderId: 'ORD005',
      vehicle: 'Tesla Model Y',
      totalAmount: 1500000000,
      paidAmount: 225000000,
      remainingDebt: 1275000000,
      installmentPlan: 'monthly',
      monthlyPayment: 53125000,
      nextPaymentDate: '2024-01-20',
      daysOverdue: 15,
      status: 'high_risk',
      riskLevel: 'high'
    }
  ]);

  // Mock performance metrics
  const [performanceMetrics] = useState({
    totalRevenue: 11300000000,
    totalSales: 13,
    avgDealValue: 869230769,
    conversionRate: 72,
    topSellingVehicle: 'Tesla Model 3',
    totalDebt: 3540000000,
    overdueDebt: 840000000,
    onTimePaymentRate: 78,
    riskCustomers: 2,
    monthlyGrowth: 15.5
  });

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      current: '#10b981',
      overdue: '#f59e0b',
      high_risk: '#ef4444',
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Tab components
  const SalesReportsTab = () => (
    <div className="sales-reports-section">
      <div className="section-header">
        <h3>Báo Cáo Bán Hàng Theo Nhân Viên</h3>
        <div className="filters">
          <select 
            className="date-filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_quarter">Quý này</option>
            <option value="this_year">Năm này</option>
            <option value="custom">Tùy chọn</option>
          </select>
          <button className="btn-export">📊 Xuất báo cáo</button>
        </div>
      </div>

      <div className="performance-overview">
        <div className="metric-card">
          <span className="metric-number">{formatCurrency(performanceMetrics.totalRevenue)}</span>
          <span className="metric-label">Tổng doanh thu</span>
          <span className="metric-growth positive">+{performanceMetrics.monthlyGrowth}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-number">{performanceMetrics.totalSales}</span>
          <span className="metric-label">Tổng đơn hàng</span>
          <span className="metric-growth positive">+12%</span>
        </div>
        <div className="metric-card">
          <span className="metric-number">{formatCurrency(performanceMetrics.avgDealValue)}</span>
          <span className="metric-label">Giá trị TB/đơn</span>
          <span className="metric-growth positive">+8%</span>
        </div>
        <div className="metric-card">
          <span className="metric-number">{performanceMetrics.conversionRate}%</span>
          <span className="metric-label">Tỷ lệ chốt</span>
          <span className="metric-growth positive">+5%</span>
        </div>
      </div>

      <div className="staff-reports-grid">
        {salesReports.map(staff => (
          <div key={staff.staffId} className="staff-report-card">
            <div className="staff-header">
              <div className="staff-info">
                <h4>{staff.staffName}</h4>
                <p>{staff.position}</p>
                <span className="staff-id">{staff.staffId}</span>
              </div>
              <div className="staff-stats">
                <div className="stat-item">
                  <span className="stat-value">{staff.totalSales}</span>
                  <span className="stat-label">Đơn hàng</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{staff.conversionRate}%</span>
                  <span className="stat-label">Tỷ lệ chốt</span>
                </div>
              </div>
            </div>

            <div className="staff-performance">
              <div className="performance-row">
                <span>Doanh thu:</span>
                <span className="amount">{formatCurrency(staff.totalRevenue)}</span>
              </div>
              <div className="performance-row">
                <span>TB/đơn hàng:</span>
                <span className="amount">{formatCurrency(staff.avgDealValue)}</span>
              </div>
              <div className="performance-row">
                <span>Xe bán chạy:</span>
                <span>{staff.topVehicle}</span>
              </div>
            </div>

            <div className="monthly-comparison">
              <h5>So sánh tháng</h5>
              <div className="comparison-grid">
                <div className="comparison-item">
                  <span className="comparison-label">Tháng này</span>
                  <span className="comparison-sales">{staff.thisMonth.sales} đơn</span>
                  <span className="comparison-revenue">{formatCurrency(staff.thisMonth.revenue)}</span>
                  <span className="comparison-conversion">{staff.thisMonth.conversion}% chốt</span>
                </div>
                <div className="comparison-item">
                  <span className="comparison-label">Tháng trước</span>
                  <span className="comparison-sales">{staff.lastMonth.sales} đơn</span>
                  <span className="comparison-revenue">{formatCurrency(staff.lastMonth.revenue)}</span>
                  <span className="comparison-conversion">{staff.lastMonth.conversion}% chốt</span>
                </div>
              </div>
              <div className="growth-indicator">
                <span className="growth-label">Tăng trưởng:</span>
                <span className={`growth-value ${staff.thisMonth.sales >= staff.lastMonth.sales ? 'positive' : 'negative'}`}>
                  {calculateGrowth(staff.thisMonth.sales, staff.lastMonth.sales)}%
                </span>
              </div>
            </div>

            <div className="staff-actions">
              <button className="btn-detail">Chi tiết</button>
              <button className="btn-contact">Liên hệ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DebtTrackingTab = () => (
    <div className="debt-tracking-section">
      <div className="section-header">
        <h3>Theo Dõi Công Nợ</h3>
        <div className="filters">
          <select className="status-filter">
            <option value="">Tất cả trạng thái</option>
            <option value="current">Đúng hạn</option>
            <option value="overdue">Quá hạn</option>
            <option value="high_risk">Rủi ro cao</option>
          </select>
          <select className="risk-filter">
            <option value="">Tất cả mức rủi ro</option>
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
          <button className="btn-export">📊 Xuất báo cáo</button>
        </div>
      </div>

      <div className="debt-overview">
        <div className="debt-metric-card">
          <span className="debt-number">{formatCurrency(performanceMetrics.totalDebt)}</span>
          <span className="debt-label">Tổng công nợ</span>
        </div>
        <div className="debt-metric-card warning">
          <span className="debt-number">{formatCurrency(performanceMetrics.overdueDebt)}</span>
          <span className="debt-label">Nợ quá hạn</span>
        </div>
        <div className="debt-metric-card">
          <span className="debt-number">{performanceMetrics.onTimePaymentRate}%</span>
          <span className="debt-label">Tỷ lệ trả đúng hạn</span>
        </div>
        <div className="debt-metric-card danger">
          <span className="debt-number">{performanceMetrics.riskCustomers}</span>
          <span className="debt-label">Khách hàng rủi ro</span>
        </div>
      </div>

      <div className="debt-reports-grid">
        {debtReports.map(debt => (
          <div key={debt.customerId} className="debt-report-card">
            <div className="debt-header">
              <div className="debt-customer">
                <h4>{debt.customerName}</h4>
                <p>📞 {debt.phone}</p>
                <p>🚗 {debt.vehicle}</p>
              </div>
              <div className="debt-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(debt.status) }}
                >
                  {debt.status === 'current' ? 'Đúng hạn' :
                   debt.status === 'overdue' ? 'Quá hạn' : 'Rủi ro cao'}
                </span>
                <span 
                  className="risk-badge"
                  style={{ backgroundColor: getStatusColor(debt.riskLevel) }}
                >
                  {debt.riskLevel === 'low' ? 'Rủi ro thấp' :
                   debt.riskLevel === 'medium' ? 'Rủi ro TB' : 'Rủi ro cao'}
                </span>
              </div>
            </div>

            <div className="debt-details">
              <div className="debt-amounts">
                <div className="amount-row">
                  <span>Tổng giá trị:</span>
                  <span className="total-amount">{formatCurrency(debt.totalAmount)}</span>
                </div>
                <div className="amount-row">
                  <span>Đã thanh toán:</span>
                  <span className="paid-amount">{formatCurrency(debt.paidAmount)}</span>
                </div>
                <div className="amount-row">
                  <span>Còn nợ:</span>
                  <span className="remaining-debt">{formatCurrency(debt.remainingDebt)}</span>
                </div>
              </div>

              <div className="payment-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(debt.paidAmount / debt.totalAmount) * 100}%`,
                      backgroundColor: debt.status === 'current' ? '#10b981' : 
                                     debt.status === 'overdue' ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {((debt.paidAmount / debt.totalAmount) * 100).toFixed(1)}% đã thanh toán
                </span>
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-row">
                <span>Trả góp hàng tháng:</span>
                <span className="monthly-payment">{formatCurrency(debt.monthlyPayment)}</span>
              </div>
              <div className="payment-row">
                <span>Kỳ thanh toán tiếp:</span>
                <span>{debt.nextPaymentDate}</span>
              </div>
              {debt.daysOverdue > 0 && (
                <div className="payment-row overdue">
                  <span>Số ngày quá hạn:</span>
                  <span className="overdue-days">{debt.daysOverdue} ngày</span>
                </div>
              )}
            </div>

            <div className="debt-actions">
              <button className="btn-view">Chi tiết</button>
              <button className="btn-contact">Liên hệ</button>
              <button className="btn-payment">Ghi nhận TT</button>
              {debt.status !== 'current' && (
                <button className="btn-reminder">Nhắc nhở</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="analytics-section">
      <div className="coming-soon">
        <h3>Phân Tích Nâng Cao</h3>
        <p>Chức năng phân tích nâng cao đang được phát triển...</p>
        <ul>
          <li>📈 Biểu đồ xu hướng bán hàng theo thời gian</li>
          <li>📊 Phân tích hiệu suất bán hàng theo sản phẩm</li>
          <li>👥 Phân tích hành vi khách hàng</li>
          <li>💰 Dự báo doanh thu và công nợ</li>
          <li>📋 Dashboard tương tác với biểu đồ</li>
          <li>📱 Báo cáo tự động qua email/SMS</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="dealer-reports">
      <div className="reports-header">
        <h2>Báo Cáo & Phân Tích</h2>
        <div className="header-actions">
          <button className="btn-schedule-report">📅 Lên lịch báo cáo</button>
          <button className="btn-export-all">📊 Xuất tất cả</button>
        </div>
      </div>

      <div className="reports-tabs">
        <button 
          className={`reports-tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          💼 Báo Cáo Bán Hàng
        </button>
        <button 
          className={`reports-tab ${activeTab === 'debt' ? 'active' : ''}`}
          onClick={() => setActiveTab('debt')}
        >
          💳 Theo Dõi Công Nợ
        </button>
        <button 
          className={`reports-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Phân Tích
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'sales' && <SalesReportsTab />}
        {activeTab === 'debt' && <DebtTrackingTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default DealerReports;