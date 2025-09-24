import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/Common/DashboardCard';
import StatsGrid from '../components/Common/StatsGrid';
import ActivityList from '../components/Common/ActivityList';
import DashboardHeader from '../components/Common/DashboardHeader';
import ActionButton from '../components/Common/ActionButton';
import { dashboardAPI } from '../services/api-simple';
import '../styles/Dashboard.css';

const EvmDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getEvmStats();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load EVM dashboard data');
        console.error('EVM Dashboard API error:', err);
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
          <p>Đang tải dữ liệu hệ thống...</p>
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

  // Data for stats grid từ API
  const systemStats = [
    {
      icon: '🏢',
      value: dashboardData.system.dealers,
      label: 'Đại lý hoạt động',
      change: '+3.2%'
    },
    {
      icon: '🚗',
      value: dashboardData.system.sales,
      label: 'Xe bán/tháng',
      change: '+8.7%'
    },
    {
      icon: '📦',
      value: dashboardData.system.inventory,
      label: 'Xe tồn kho',
      change: '-2.1%'
    },
    {
      icon: '💰',
      value: `₫${dashboardData.system.revenue}B`,
      label: 'Doanh thu tổng',
      change: '+15.3%'
    }
  ];

  const performanceStats = [
    {
      icon: '⚡',
      value: `${dashboardData.performance.uptime}%`,
      label: 'Uptime hệ thống',
      change: '+0.1%'
    },
    {
      icon: '👥',
      value: dashboardData.performance.customerSatisfaction,
      label: 'Điểm hài lòng',
      change: '+12.5%'
    },
    {
      icon: '🔄',
      value: `${dashboardData.performance.deliveryTime} ngày`,
      label: 'Thời gian giao hàng',
      change: '+18.9%'
    },
    {
      icon: '📊',
      value: `${dashboardData.performance.targetAchievement}%`,
      label: 'Hoàn thành mục tiêu',
      change: '+7.6%'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <DashboardHeader 
        title="EVM System Dashboard"
        subtitle="Quản lý hệ thống và giám sát hoạt động toàn hệ thống"
      />

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <ActionButton icon="🏢" text="Quản Lý Đại Lý" />
        <ActionButton icon="📊" text="Báo Cáo Hệ Thống" />
        <ActionButton icon="⚙️" text="Cài Đặt" />
        <ActionButton icon="🔧" text="Bảo Trì" />
      </div>

      <div className="dashboard-grid">
        {/* System Stats */}
        <DashboardCard 
          title="🏢 Thống Kê Hệ Thống"
          className="system-card"
          actions={[
            { label: 'Chi tiết', onClick: () => console.log('View system details') },
            { label: 'Báo cáo', onClick: () => console.log('System report') }
          ]}
        >
          <StatsGrid stats={systemStats} />
        </DashboardCard>

        {/* Performance Stats */}
        <DashboardCard 
          title="⚡ Hiệu Suất Hệ Thống"
          className="performance-card"
          actions={[
            { label: 'Theo dõi', onClick: () => console.log('Monitor performance') }
          ]}
        >
          <StatsGrid stats={performanceStats} />
        </DashboardCard>

        {/* System Activities */}
        <DashboardCard 
          title="🔔 Hoạt Động Hệ Thống"
          className="system-activities-card"
          actions={[
            { label: 'Xem logs', onClick: () => console.log('View system logs') }
          ]}
        >
          <ActivityList activities={dashboardData.activities} />
        </DashboardCard>

        {/* Monthly Performance Chart */}
        <DashboardCard 
          title="📈 Hiệu Suất Theo Tháng"
          className="chart-card"
        >
          <div className="chart-placeholder">
            <h3>Hiệu suất hệ thống 12 tháng gần nhất</h3>
            <div className="chart-data">
              {dashboardData.monthlyPerformance.map((month, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar" style={{height: `${month.performance}%`}}></div>
                  <span>{month.month}</span>
                  <small>{month.performance}%</small>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default EvmDashboard;