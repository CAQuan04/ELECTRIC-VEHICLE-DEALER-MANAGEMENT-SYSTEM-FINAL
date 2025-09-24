import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/Common/DashboardCard';
import StatsGrid from '../components/Common/StatsGrid';
import ActivityList from '../components/Common/ActivityList';
import DashboardHeader from '../components/Common/DashboardHeader';
import ActionButton from '../components/Common/ActionButton';
import { dashboardAPI } from '../services/api-simple';
import '../styles/Dashboard.css';

const DealerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dealer dashboard data...');
        setLoading(true);
        const response = await dashboardAPI.getDealerStats();
        console.log('API Response:', response);
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Dashboard API error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Lỗi</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Không có dữ liệu</h2>
          <p>Dữ liệu dashboard không khả dụng</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  // Data for stats grid từ API
  const salesStats = [
    {
      icon: '💰',
      value: `₫${dashboardData.sales?.revenue || 0}M`,
      label: 'Doanh thu tháng',
      change: '+12.5%'
    },
    {
      icon: '🚗',
      value: dashboardData.sales?.vehicles || 0,
      label: 'Xe bán được',
      change: '+8.2%'
    },
    {
      icon: '📈',
      value: `₫${dashboardData.sales?.avgPrice || 0}M`,
      label: 'Doanh thu trung bình/xe',
      change: '+3.1%'
    },
    {
      icon: '🎯',
      value: `${dashboardData.sales?.targetCompletion || 0}%`,
      label: 'Hoàn thành mục tiêu',
      change: '+5.2%'
    }
  ];

  const inventoryStats = [
    {
      icon: '🏪',
      value: dashboardData.inventory?.total || 0,
      label: 'Tổng tồn kho',
      change: '-2.1%'
    },
    {
      icon: '⚡',
      value: dashboardData.inventory?.model3 || 0,
      label: 'Model 3',
      change: '+4.3%'
    },
    {
      icon: '🚙',
      value: dashboardData.inventory?.modelY || 0,
      label: 'Model Y',
      change: '-1.2%'
    },
    {
      icon: '🏎️',
      value: dashboardData.inventory?.modelS || 0,
      label: 'Model S',
      change: '+2.8%'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <DashboardHeader 
        title="Dashboard Đại Lý"
        subtitle={`Chào mừng quay trở lại, ${dashboardData.dealerName || 'Đại lý'}`}
      />

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <ActionButton icon="➕" text="Thêm Khách Hàng" />
        <ActionButton icon="🚗" text="Đăng Ký Xe Mới" />
        <ActionButton icon="📊" text="Xem Báo Cáo" />
        <ActionButton icon="📞" text="Liên Hệ Hỗ Trợ" />
      </div>

      <div className="dashboard-grid">
        {/* Sales Stats */}
        <DashboardCard 
          title="📈 Thống Kê Bán Hàng"
          className="sales-card"
          actions={[
            { label: 'Chi tiết', onClick: () => console.log('View sales details') },
            { label: 'Xuất báo cáo', onClick: () => console.log('Export sales report') }
          ]}
        >
          <StatsGrid stats={salesStats} />
        </DashboardCard>

        {/* Inventory Stats */}
        <DashboardCard 
          title="🏪 Thống Kê Tồn Kho"
          className="inventory-card"
          actions={[
            { label: 'Quản lý kho', onClick: () => console.log('Manage inventory') }
          ]}
        >
          <StatsGrid stats={inventoryStats} />
        </DashboardCard>

        {/* Recent Activities */}
        <DashboardCard 
          title="🔔 Hoạt Động Gần Đây"
          className="activities-card"
          actions={[
            { label: 'Xem tất cả', onClick: () => console.log('View all activities') }
          ]}
        >
          <ActivityList activities={dashboardData.recentActivities || []} />
        </DashboardCard>

        {/* Monthly Chart */}
        <DashboardCard 
          title="📊 Biểu Đồ Doanh Thu Theo Tháng"
          className="chart-card"
        >
          <div className="chart-placeholder">
            <h3>Doanh thu 12 tháng gần nhất</h3>
            <div className="chart-data">
              {(dashboardData.monthlyRevenue || []).map((month, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar" style={{height: `${month.revenue / 10}%`}}></div>
                  <span>{month.month}</span>
                  <small>₫{month.revenue}M</small>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DealerDashboard;