import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/utils/auth';
import { CustomerMockAPI } from '../services/customerMockAPI';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = AuthService.getCurrentUser();

  // Fetch customer data from Mock API
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get customer ID from currentUser or use default
        const customerId = currentUser?.id || 'customer_001';
        
        const response = await CustomerMockAPI.getAllCustomerData(customerId);
        
        if (response.success) {
          setCustomerData(response.data);
        } else {
          setError(response.error || 'Không thể tải dữ liệu');
        }
      } catch (err) {
        setError('Lỗi kết nối: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [currentUser]);

  // Check URL parameters to set active section
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  return (
    <div className="customer-dashboard">
      <div className="hero-section">
        <h1>Chào mừng, {currentUser?.name || 'Khách hàng'}!</h1>
        <p>Giao diện khách hàng - Quản lý thông tin Tesla của bạn</p>
      </div>

      <div className="nav-pills">
        <button 
          className={activeSection === 'overview' ? 'nav-pill active' : 'nav-pill'}
          onClick={() => setActiveSection('overview')}
        >
          🏠 Tổng quan
        </button>
        <button 
          className={activeSection === 'vehicles' ? 'nav-pill active' : 'nav-pill'}
          onClick={() => setActiveSection('vehicles')}
        >
          🚗 Xe của tôi
        </button>
        <button 
          className={activeSection === 'services' ? 'nav-pill active' : 'nav-pill'}
          onClick={() => setActiveSection('services')}
        >
          🔧 Dịch vụ
        </button>
        <button 
          className={activeSection === 'financing' ? 'nav-pill active' : 'nav-pill'}
          onClick={() => setActiveSection('financing')}
        >
          💳 Quản lý trả góp
        </button>
      </div>

      <div className="customer-content">
        {loading && (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <h3>❌ Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        )}

        {!loading && !error && customerData && (
          <>
            {activeSection === 'overview' && (
              <div className="overview-section">
                <h2>📊 Tổng quan tài khoản</h2>
                <div className="customer-stats">
                  <div className="stat-card">
                    <h3>{customerData.overview.totalVehicles}</h3>
                    <p>Xe sở hữu</p>
                  </div>
                  <div className="stat-card">
                    <h3>{customerData.overview.pendingServices}</h3>
                    <p>Dịch vụ đang chờ</p>
                  </div>
                  <div className="stat-card">
                    <h3>{CustomerMockAPI.formatCurrency(customerData.overview.remainingLoanAmount)}</h3>
                    <p>Nợ còn lại</p>
                  </div>
                  <div className="stat-card">
                    <h3>{CustomerMockAPI.formatCurrency(customerData.overview.monthlyPayment)}</h3>
                    <p>Trả góp hàng tháng</p>
                  </div>
                </div>
                
                <div className="overview-details">
                  <div className="detail-card">
                    <h4>💳 Thông tin tài chính</h4>
                    <p>Điểm tín dụng: <strong>{customerData.overview.creditScore}</strong></p>
                    <p>Hạng thành viên: <strong>{customerData.overview.membershipLevel}</strong></p>
                    <p>Kỳ thanh toán tiếp theo: <strong>{CustomerMockAPI.formatDate(customerData.overview.nextPaymentDate)}</strong></p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'vehicles' && (
              <div className="vehicles-section">
                <h2>🚗 Xe của tôi</h2>
                <div className="vehicles-grid">
                  {customerData.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-card">
                      <div className="vehicle-header">
                        <h3>{vehicle.model}</h3>
                        <span className={`vehicle-status ${vehicle.status}`}>
                          {vehicle.status === 'active' ? '✅ Hoạt động' : '⚠️ Bảo trì'}
                        </span>
                      </div>
                      <div className="vehicle-details">
                        <p><strong>Năm sản xuất:</strong> {vehicle.year}</p>
                        <p><strong>Màu sắc:</strong> {vehicle.color}</p>
                        <p><strong>VIN:</strong> {vehicle.vin}</p>
                        <p><strong>Số km đã đi:</strong> {vehicle.mileage.toLocaleString()} km</p>
                        <p><strong>Pin:</strong> {vehicle.batteryLevel}% ({vehicle.range} km)</p>
                        <p><strong>Bảo dưỡng cuối:</strong> {CustomerMockAPI.formatDate(vehicle.lastService)}</p>
                        <p><strong>Bảo dưỡng tiếp theo:</strong> {CustomerMockAPI.formatDate(vehicle.nextService)}</p>
                        <p><strong>Bảo hiểm hết hạn:</strong> {CustomerMockAPI.formatDate(vehicle.insuranceExpiry)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'services' && (
              <div className="services-section">
                <h2>🔧 Dịch vụ</h2>
                <div className="services-list">
                  {customerData.services.map(service => (
                    <div key={service.id} className="service-card">
                      <div className="service-header">
                        <h4>{service.serviceType}</h4>
                        <span className={`service-status ${service.status}`}>
                          {service.status === 'scheduled' && '📅 Đã lên lịch'}
                          {service.status === 'completed' && '✅ Hoàn thành'}
                          {service.status === 'pending' && '⏳ Chờ xác nhận'}
                        </span>
                      </div>
                      <div className="service-details">
                        <p><strong>Xe:</strong> {service.vehicleModel}</p>
                        <p><strong>Ngày:</strong> {CustomerMockAPI.formatDate(service.scheduledDate)}</p>
                        <p><strong>Mô tả:</strong> {service.description}</p>
                        <p><strong>Chi phí dự kiến:</strong> {CustomerMockAPI.formatCurrency(service.estimatedCost)}</p>
                        <p><strong>Trung tâm:</strong> {service.serviceCenter}</p>
                        <p><strong>Kỹ thuật viên:</strong> {service.technician}</p>
                        {service.completedDate && (
                          <p><strong>Hoàn thành:</strong> {CustomerMockAPI.formatDate(service.completedDate)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'financing' && (
              <div className="financing-section">
                <h2>💳 Quản lý trả góp</h2>
                <div className="financing-content">
                  <div className="financing-overview">
                    <h3>Thông tin khoản vay</h3>
                    <div className="loan-info-cards">
                      {customerData.financing.loans.map(loan => (
                        <div key={loan.id} className="loan-card">
                          <h4>Khoản vay {loan.vehicleModel}</h4>
                          <p className="loan-amount">Số tiền: {CustomerMockAPI.formatCurrency(loan.loanAmount)}</p>
                          <p className="loan-remaining">Còn lại: {CustomerMockAPI.formatCurrency(loan.remainingAmount)}</p>
                          <p className="monthly-payment">Trả hàng tháng: {CustomerMockAPI.formatCurrency(loan.monthlyPayment)}</p>
                          <p className="loan-rate">Lãi suất: {loan.interestRate}%/năm</p>
                          <p className="remaining-months">Còn: {loan.remainingMonths} tháng</p>
                          <p className="next-payment">Kỳ thanh toán tiếp theo: {CustomerMockAPI.formatDate(loan.nextPaymentDate)}</p>
                          <p className="bank">Ngân hàng: {loan.bankName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="payment-history">
                    <h3>Lịch sử thanh toán</h3>
                    <div className="payment-table">
                      <div className="payment-row header">
                        <span>Ngày</span>
                        <span>Xe</span>
                        <span>Số tiền</span>
                        <span>Trạng thái</span>
                        <span>Phương thức</span>
                      </div>
                      {customerData.paymentHistory.slice(0, 10).map(payment => (
                        <div key={payment.id} className="payment-row">
                          <span>{payment.paymentDate ? CustomerMockAPI.formatDate(payment.paymentDate) : CustomerMockAPI.formatDate(payment.dueDate)}</span>
                          <span>{payment.vehicleModel}</span>
                          <span>{CustomerMockAPI.formatCurrency(payment.amount)}</span>
                          <span className={`status ${payment.status}`}>
                            {payment.status === 'paid' && '✅ Đã thanh toán'}
                            {payment.status === 'pending' && '⏳ Sắp đến hạn'}
                          </span>
                          <span>{payment.paymentMethod || 'Chưa thanh toán'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;