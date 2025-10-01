import React, { useState, useEffect } from 'react';
import DashboardCard from '../../../shared/components/DashboardCard';
import StatsGrid from '../../../shared/components/StatsGrid';
import ActivityList from '../../../shared/components/ActivityList';
import DashboardHeader from '../../../shared/components/DashboardHeader';
import ActionButton from '../../../shared/components/ActionButton';
import { dashboardAPI } from '../../../shared/utils/api-simple';
import '../../../styles/Dashboard.css';

const ReportDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading reports dashboard data...');
        setLoading(true);
        const response = await dashboardAPI.getReportStats();
        console.log('Reports API Response:', response);
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Reports Dashboard API error:', err);
        setError('Failed to load reports data');
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
          <p>Đang tải dữ liệu báo cáo...</p>
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
          <p>Dữ liệu báo cáo không khả dụng</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  // Data for stats grid từ API
  const salesReportStats = [
    {
      icon: '💰',
      value: `₫${dashboardData.reports?.totalRevenue || 0}B`,
      label: 'Tổng doanh thu',
      change: '+18.2%'
    },
    {
      icon: '🚗',
      value: dashboardData.reports?.totalVehiclesSold || 0,
      label: 'Tổng xe bán',
      change: '+15.7%'
    },
    {
      icon: '📈',
      value: `₫${dashboardData.reports?.avgRevenuePerVehicle || 0}M`,
      label: 'Doanh thu TB/xe',
      change: '+2.3%'
    },
    {
      icon: '🎯',
      value: `${dashboardData.reports?.kpiCompletion || 0}%`,
      label: 'Hoàn thành KPI',
      change: '+12.1%'
    }
  ];

  const analyticsStats = [
    {
      icon: '👥',
      value: dashboardData.analytics?.potentialCustomers || '0',
      label: 'Khách hàng tiềm năng',
      change: '+24.5%'
    },
    {
      icon: '🔄',
      value: `${dashboardData.analytics?.conversionRate || 0}%`,
      label: 'Tỉ lệ chuyển đổi',
      change: '+1.8%'
    },
    {
      icon: '⭐',
      value: `${dashboardData.analytics?.avgRating || 0}/5`,
      label: 'Đánh giá trung bình',
      change: '+0.3%'
    },
    {
      icon: '📊',
      value: dashboardData.analytics?.totalReports || '0',
      label: 'Tổng báo cáo',
      change: '+28.9%'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <DashboardHeader 
        title="Reports & Analytics Dashboard"
        subtitle="Theo dõi báo cáo và phân tích dữ liệu toàn hệ thống"
      />

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <ActionButton icon="📋" text="Tạo Báo Cáo" />
        <ActionButton icon="📊" text="Xem Analytics" />
        <ActionButton icon="📥" text="Xuất Dữ Liệu" />
        <ActionButton icon="⚙️" text="Cài Đặt Báo Cáo" />
      </div>

      <div className="dashboard-grid">
        {/* Sales Report Stats */}
        <DashboardCard 
          title="💰 Thống Kê Doanh Thu"
          className="sales-report-card"
          actions={[
            { label: 'Chi tiết', onClick: () => console.log('View sales report details') },
            { label: 'Xuất báo cáo', onClick: () => console.log('Export sales report') }
          ]}
        >
          <StatsGrid stats={salesReportStats} />
        </DashboardCard>

        {/* Analytics Stats */}
        <DashboardCard 
          title="📈 Thống Kê Phân Tích"
          className="analytics-card"
          actions={[
            { label: 'Xem chi tiết', onClick: () => console.log('View analytics details') }
          ]}
        >
          <StatsGrid stats={analyticsStats} />
        </DashboardCard>

        {/* Recent Report Activities */}
        <DashboardCard 
          title="🔔 Hoạt Động Báo Cáo Gần Đây"
          className="report-activities-card"
          actions={[
            { label: 'Xem tất cả', onClick: () => console.log('View all report activities') }
          ]}
        >
          <ActivityList activities={dashboardData.recentReportActivities || []} />
        </DashboardCard>

        {/* Monthly Reports Chart */}
        <DashboardCard 
          title="📊 Báo Cáo Theo Tháng"
          className="chart-card"
        >
          <div className="chart-placeholder">
            <h3>Số lượng báo cáo 12 tháng gần nhất</h3>
            <div className="chart-data">
              {(dashboardData.monthlyReports || []).map((month, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar" style={{height: `${month.reports * 2}%`}}></div>
                  <span>{month.month}</span>
                  <small>{month.reports}</small>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default ReportDashboard;