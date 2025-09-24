import React from 'react';
import '../styles/Dashboard.css';

const CustomerDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Customer Dashboard</h1>
        <p className="dashboard-subtitle">Quản lý thông tin cá nhân, đơn hàng và dịch vụ</p>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Thông tin cá nhân</h3>
            <div className="card-icon">👤</div>
          </div>
          <div className="card-content">
            <div style={{marginBottom: '15px'}}>
              <strong>Họ tên:</strong> Nguyễn Văn A<br/>
              <strong>Email:</strong> customer@example.com<br/>
              <strong>Điện thoại:</strong> 0123-456-789<br/>
              <strong>Địa chỉ:</strong> 123 Đường ABC, TP.HCM
            </div>
          </div>
          <div className="quick-actions">
            <button className="action-btn">Cập nhật thông tin</button>
            <button className="action-btn secondary">Đổi mật khẩu</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Đơn hàng & Mua sắm</h3>
            <div className="card-icon">🛒</div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Xe đã mua</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1</div>
              <div className="stat-label">Đang xử lý</div>
            </div>
          </div>
          <div className="quick-actions">
            <button className="action-btn">Lịch sử mua hàng</button>
            <button className="action-btn success">Mua xe mới</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Dịch vụ & Bảo hành</h3>
            <div className="card-icon">🔧</div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Lần bảo dưỡng</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">18</div>
              <div className="stat-label">Tháng bảo hành còn</div>
            </div>
          </div>
          <div className="quick-actions">
            <button className="action-btn">Đặt lịch bảo dưỡng</button>
            <button className="action-btn secondary">Lịch sử dịch vụ</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Hỗ trợ khách hàng</h3>
            <div className="card-icon">💬</div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Yêu cầu hỗ trợ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Hotline</div>
            </div>
          </div>
          <div className="quick-actions">
            <button className="action-btn">Gửi yêu cầu</button>
            <button className="action-btn success">Chat với tư vấn</button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3 className="card-title" style={{marginBottom: '20px'}}>Hoạt động gần đây</h3>
        <ul className="activity-list">
          <li className="activity-item">
            <div className="activity-icon">🚗</div>
            <div className="activity-content">
              <div className="activity-title">Đặt lịch lái thử Tesla Model Y</div>
              <div className="activity-time">Hôm nay, 14:30</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-icon">🔧</div>
            <div className="activity-content">
              <div className="activity-title">Hoàn thành bảo dưỡng định kỳ Tesla Model 3</div>
              <div className="activity-time">3 ngày trước</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-title">Thanh toán đợt 3 cho đơn hàng #TM2024001</div>
              <div className="activity-time">1 tuần trước</div>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-icon">📞</div>
            <div className="activity-content">
              <div className="activity-title">Liên hệ tư vấn về gói bảo hiểm mở rộng</div>
              <div className="activity-time">2 tuần trước</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerDashboard;