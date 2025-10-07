import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/utils/auth';
import { usePageLoading } from '../../../shared/components/LoadingHOC';
import '../../../shared/components/GlobalLoading.css';
import '../styles/EvmDashboard.css';

const EvmDashboard = () => {
  const { startLoading, stopLoading, isLoading } = usePageLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      try {
        startLoading('Đang tải dữ liệu hệ thống...');
        // Mock data
        const mockData = {
          system: {
            dealers: 24,
            sales: 157,
            inventory: 1284,
            revenue: 185.7
          },
          performance: {
            uptime: 99.8,
            customerSatisfaction: 4.8,
            deliveryTime: 7,
            targetAchievement: 112
          },
          activities: [
            { id: 1, title: 'Dealer DL001 tạo đơn hàng mới', time: '10 phút trước', icon: '📋' },
            { id: 2, title: 'Hệ thống backup hoàn thành', time: '1 giờ trước', icon: '💾' },
            { id: 3, title: 'Dealer DL005 cập nhật kho', time: '2 giờ trước', icon: '📦' },
            { id: 4, title: 'Khách hàng mới đăng ký', time: '3 giờ trước', icon: '👤' }
          ]
        };
        setDashboardData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load EVM dashboard data');
        console.error('EVM Dashboard error:', err);
      } finally {
        stopLoading();
      }
    };

    loadDashboardData();
  }, []);

  if (error) {
    return (
      <div className="evm-dashboard">
        <div className="error-container">
          <h2>⚠️ Lỗi hệ thống</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="evm-dashboard">
      {/* Hero Section */}
      <div className="evm-hero">
        <div className="hero-content">
          <h1>⚡ EVM Admin Center</h1>
          <p>Chào mừng {currentUser?.name} - Quản lý toàn bộ hệ thống EVM</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.system.dealers}</span>
              <span className="stat-label">Đại lý hoạt động</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.system.sales}</span>
              <span className="stat-label">Xe bán/tháng</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{dashboardData.performance.uptime}%</span>
              <span className="stat-label">Uptime hệ thống</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="evm-nav">
        <button 
          className={`nav-pill ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <span className="pill-icon">📊</span>
          <span>Tổng quan</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'dealers' ? 'active' : ''}`}
          onClick={() => setActiveSection('dealers')}
        >
          <span className="pill-icon">🏢</span>
          <span>Quản lý đại lý</span>
        </button>
        <button 
          className={`nav-pill ${activeSection === 'system' ? 'active' : ''}`}
          onClick={() => setActiveSection('system')}
        >
          <span className="pill-icon">⚙️</span>
          <span>Hệ thống</span>
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
          {/* System Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">🏢</span>
                <span className="stat-title">Đại lý hoạt động</span>
              </div>
              <div className="stat-value">{dashboardData.system.dealers}</div>
              <div className="stat-change positive">+3 tháng này</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">🚗</span>
                <span className="stat-title">Xe bán tháng này</span>
              </div>
              <div className="stat-value">{dashboardData.system.sales}</div>
              <div className="stat-change positive">+8.7% so với tháng trước</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">📦</span>
                <span className="stat-title">Tồn kho toàn hệ thống</span>
              </div>
              <div className="stat-value">{dashboardData.system.inventory.toLocaleString()}</div>
              <div className="stat-change negative">-2.1% so với tháng trước</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">💰</span>
                <span className="stat-title">Doanh thu tổng</span>
              </div>
              <div className="stat-value">{dashboardData.system.revenue}B VND</div>
              <div className="stat-change positive">+15.3% so với tháng trước</div>
            </div>
          </div>

          {/* Performance Cards */}
          <div className="performance-grid">
            <div className="performance-card">
              <h3>⚡ Hiệu suất hệ thống</h3>
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">{dashboardData.performance.uptime}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Hài lòng khách hàng</span>
                  <span className="metric-value">{dashboardData.performance.customerSatisfaction}/5</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Thời gian giao hàng</span>
                  <span className="metric-value">{dashboardData.performance.deliveryTime} ngày</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Hoàn thành mục tiêu</span>
                  <span className="metric-value">{dashboardData.performance.targetAchievement}%</span>
                </div>
              </div>
            </div>

            <div className="activity-card">
              <h3>🔔 Hoạt động gần đây</h3>
              <div className="activity-list">
                {dashboardData.activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <span className="activity-icon">{activity.icon}</span>
                    <div className="activity-content">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-time">{activity.time}</span>
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
              <button className="action-btn">
                <span className="action-icon">🏢</span>
                <span className="action-text">Quản lý đại lý</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span className="action-text">Báo cáo hệ thống</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">👥</span>
                <span className="action-text">Quản lý users</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Cấu hình hệ thống</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">🔧</span>
                <span className="action-text">Bảo trì hệ thống</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📈</span>
                <span className="action-text">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'dealers' && (
        <div className="section-content">
          <div className="section-header">
            <h2>🏢 Quản lý đại lý</h2>
            <button className="add-btn">+ Thêm đại lý mới</button>
          </div>
          <div className="placeholder-content">
            <p>Tính năng quản lý đại lý đang được phát triển...</p>
          </div>
        </div>
      )}

      {activeSection === 'system' && (
        <div className="section-content">
          <div className="section-header">
            <h2>⚙️ Cấu hình hệ thống</h2>
          </div>
          <div className="placeholder-content">
            <p>Tính năng cấu hình hệ thống đang được phát triển...</p>
          </div>
        </div>
      )}

      {activeSection === 'reports' && (
        <div className="section-content">
          <div className="section-header">
            <h2>📈 Báo cáo và phân tích</h2>
          </div>
          <div className="placeholder-content">
            <p>Tính năng báo cáo đang được phát triển...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvmDashboard;