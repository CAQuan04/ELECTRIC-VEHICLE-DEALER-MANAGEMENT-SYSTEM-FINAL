import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/utils/auth';
import '../styles/DealerDashboard.css';

const DealerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Mock data for dealer
        const mockData = {
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
        setDashboardData(mockData);
      } catch (err) {
        console.error('Dealer Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dealer-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu đại lý...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dealer-dashboard">
      {/* Hero Section */}
      <div className="dealer-hero">
        <div className="hero-content">
          <h1>🏢 Dealer Dashboard</h1>
          <p>Chào mừng {currentUser?.name} - Quản lý kinh doanh và bán hàng</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.dealer.vehicles}</span>
              <span className="stat-label">Xe có sẵn</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.dealer.orders}</span>
              <span className="stat-label">Đơn hàng tháng này</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.performance.quarterTarget}%</span>
              <span className="stat-label">Hoàn thành mục tiêu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="dealer-nav">
        <button 
          className={`nav-pill ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <span className="pill-icon">📊</span>
          <span>Tổng quan</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveSection('inventory')}
        >
          <span className="pill-icon">🚗</span>
          <span>Kho xe</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          <span className="pill-icon">📋</span>
          <span>Đơn hàng</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveSection('customers')}
        >
          <span className="pill-icon">👥</span>
          <span>Khách hàng</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveSection('reports')}
        >
          <span className="pill-icon">📈</span>
          <span>Báo cáo</span>
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="section-content">
          {/* Business Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">🚗</span>
                <span className="stat-title">Xe có sẵn</span>
              </div>
              <div className="stat-value">{dashboardData.dealer.vehicles}</div>
              <div className="stat-change positive">+5 xe trong tuần</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">📋</span>
                <span className="stat-title">Đơn hàng tháng này</span>
              </div>
              <div className="stat-value">{dashboardData.dealer.orders}</div>
              <div className="stat-change positive">+18% so với tháng trước</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">👥</span>
                <span className="stat-title">Khách hàng</span>
              </div>
              <div className="stat-value">{dashboardData.dealer.customers}</div>
              <div className="stat-change positive">+12 khách mới</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">💰</span>
                <span className="stat-title">Doanh thu</span>
              </div>
              <div className="stat-value">{dashboardData.dealer.revenue} tỷ</div>
              <div className="stat-change positive">+25% so với tháng trước</div>
            </div>
          </div>

          {/* Performance and Recent Orders */}
          <div className="performance-grid">
            <div className="performance-card">
              <h3>📈 Hiệu suất kinh doanh</h3>
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-label">Bán hàng tháng này</span>
                  <span className="metric-value">{dashboardData.performance.monthlySales}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Mục tiêu quý</span>
                  <span className="metric-value">{dashboardData.performance.quarterTarget}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Hài lòng khách hàng</span>
                  <span className="metric-value">{dashboardData.performance.customerSatisfaction}/5</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Thời gian giao xe</span>
                  <span className="metric-value">{dashboardData.performance.deliveryTime} ngày</span>
                </div>
              </div>
            </div>

            <div className="orders-card">
              <h3>📋 Đơn hàng gần đây</h3>
              <div className="orders-list">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <div className="order-customer">{order.customer}</div>
                      <div className="order-vehicle">{order.vehicle}</div>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                      <span className="order-date">{order.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>🚀 Thao tác nhanh</h3>
            <div className="action-grid">
              <button className="action-btn" onClick={() => setActiveSection('orders')}>
                <span className="action-icon">📋</span>
                <span className="action-text">Tạo đơn hàng mới</span>
              </button>
              <button className="action-btn" onClick={() => setActiveSection('customers')}>
                <span className="action-icon">📅</span>
                <span className="action-text">Đặt lịch lái thử</span>
              </button>
              <button className="action-btn" onClick={() => setActiveSection('inventory')}>
                <span className="action-icon">📦</span>
                <span className="action-text">Cập nhật kho</span>
              </button>
              <button className="action-btn" onClick={() => setActiveSection('reports')}>
                <span className="action-icon">📊</span>
                <span className="action-text">Xem báo cáo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'inventory' && (
        <div className="section-content">
          <div className="section-header">
            <h2>🚗 Quản lý kho xe</h2>
            <button className="add-btn">+ Nhập xe mới</button>
          </div>
          <div className="inventory-grid">
            {dashboardData.inventory.map((item, index) => (
              <div key={index} className="inventory-card">
                <h4>{item.model}</h4>
                <div className="inventory-stats">
                  <div className="inventory-stat">
                    <span className="stat-label">Có sẵn</span>
                    <span className="stat-value available">{item.available}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Đã đặt</span>
                    <span className="stat-value reserved">{item.reserved}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Tổng</span>
                    <span className="stat-value total">{item.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'orders' && (
        <div className="section-content">
          <div className="section-header">
            <h2>📋 Quản lý đơn hàng</h2>
            <button className="add-btn">+ Tạo đơn mới</button>
          </div>
          <div className="placeholder-content">
            <p>Tính năng quản lý đơn hàng đang được phát triển...</p>
          </div>
        </div>
      )}

      {activeSection === 'customers' && (
        <div className="section-content">
          <div className="section-header">
            <h2>👥 Quản lý khách hàng</h2>
            <button className="add-btn">+ Thêm khách hàng</button>
          </div>
          <div className="placeholder-content">
            <p>Tính năng quản lý khách hàng đang được phát triển...</p>
          </div>
        </div>
      )}

      {activeSection === 'reports' && (
        <div className="section-content">
          <div className="section-header">
            <h2>📈 Báo cáo kinh doanh</h2>
            <button className="add-btn">📊 Xuất báo cáo</button>
          </div>
          <div className="placeholder-content">
            <p>Tính năng báo cáo đang được phát triển...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerDashboard;