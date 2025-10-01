import React, { useState } from 'react';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Mock customer data
  const [customers] = useState([
    {
      id: 'CUS001',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0901234567',
      address: 'Hà Nội',
      totalPurchases: 2850000000,
      lastVisit: '2024-01-15',
      status: 'VIP',
      preferredContact: 'phone',
      notes: 'Khách hàng ưu tiên, quan tâm đến xe điện cao cấp'
    },
    {
      id: 'CUS002',
      name: 'Trần Thị Bình',
      email: 'binh.tran@email.com',
      phone: '0907654321',
      address: 'TP.HCM',
      totalPurchases: 1200000000,
      lastVisit: '2024-01-10',
      status: 'Regular',
      preferredContact: 'email',
      notes: 'Quan tâm đến xe gia đình'
    },
    {
      id: 'CUS003',
      name: 'Lê Minh Cường',
      email: 'cuong.le@email.com',
      phone: '0912345678',
      address: 'Đà Nẵng',
      totalPurchases: 0,
      lastVisit: '2024-01-12',
      status: 'Potential',
      preferredContact: 'phone',
      notes: 'Khách hàng tiềm năng, đang tham khảo Model 3'
    }
  ]);

  // Mock test drive data
  const [testDrives] = useState([
    {
      id: 'TD001',
      customerId: 'CUS001',
      customerName: 'Nguyễn Văn An',
      vehicle: 'Tesla Model S',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00',
      status: 'confirmed',
      staff: 'Nguyễn Văn Đức',
      notes: 'Khách yêu cầu test drive tại showroom'
    },
    {
      id: 'TD002',
      customerId: 'CUS003',
      customerName: 'Lê Minh Cường',
      vehicle: 'Tesla Model 3',
      scheduledDate: '2024-01-18',
      scheduledTime: '14:30',
      status: 'pending',
      staff: 'Trần Thị Mai',
      notes: 'Lần đầu lái xe điện'
    },
    {
      id: 'TD003',
      customerId: 'CUS002',
      customerName: 'Trần Thị Bình',
      vehicle: 'Tesla Model Y',
      scheduledDate: '2024-01-16',
      scheduledTime: '09:00',
      status: 'completed',
      staff: 'Lê Văn Hùng',
      notes: 'Khách hàng hài lòng với trải nghiệm'
    }
  ]);

  // Mock feedback data
  const [feedbacks] = useState([
    {
      id: 'FB001',
      customerId: 'CUS001',
      customerName: 'Nguyễn Văn An',
      type: 'service',
      rating: 5,
      title: 'Dịch vụ tuyệt vời',
      content: 'Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Rất hài lòng với dịch vụ.',
      date: '2024-01-14',
      status: 'resolved',
      response: 'Cảm ơn anh đã tin tưởng và sử dụng dịch vụ của chúng tôi!'
    },
    {
      id: 'FB002',
      customerId: 'CUS002',
      customerName: 'Trần Thị Bình',
      type: 'product',
      rating: 4,
      title: 'Xe chạy êm nhưng giá hơi cao',
      content: 'Xe rất tốt, tiết kiệm năng lượng nhưng giá thành còn cao so với thu nhập.',
      date: '2024-01-12',
      status: 'pending',
      response: ''
    },
    {
      id: 'FB003',
      customerId: 'CUS003',
      customerName: 'Lê Minh Cường',
      type: 'complaint',
      rating: 2,
      title: 'Thời gian chờ tư vấn quá lâu',
      content: 'Đã chờ hơn 30 phút mới có nhân viên tư vấn. Mong cải thiện dịch vụ.',
      date: '2024-01-10',
      status: 'investigating',
      response: 'Chúng tôi xin lỗi về sự bất tiện này và sẽ cải thiện quy trình phục vụ.'
    }
  ]);

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
      VIP: '#8b5cf6',
      Regular: '#10b981',
      Potential: '#f59e0b',
      confirmed: '#10b981',
      pending: '#f59e0b',
      completed: '#6b7280',
      cancelled: '#ef4444',
      resolved: '#10b981',
      investigating: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  // Tab components
  const CustomersTab = () => (
    <div className="customers-section">
      <div className="section-header">
        <h3>Danh Sách Khách Hàng</h3>
        <div className="filters">
          <select className="status-filter">
            <option value="">Tất cả khách hàng</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Thường</option>
            <option value="Potential">Tiềm năng</option>
          </select>
          <button 
            className="btn-add-customer"
            onClick={() => openModal('addCustomer')}
          >
            + Thêm Khách Hàng
          </button>
        </div>
      </div>

      <div className="customers-grid">
        {customers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-header">
              <span className="customer-id">{customer.id}</span>
              <span 
                className="customer-status"
                style={{ backgroundColor: getStatusColor(customer.status) }}
              >
                {customer.status}
              </span>
            </div>
            
            <div className="customer-info">
              <h4>{customer.name}</h4>
              <p>📞 {customer.phone}</p>
              <p>📧 {customer.email}</p>
              <p>📍 {customer.address}</p>
            </div>

            <div className="customer-stats">
              <div className="stat-row">
                <span>Tổng mua:</span>
                <span className="amount">{formatCurrency(customer.totalPurchases)}</span>
              </div>
              <div className="stat-row">
                <span>Lần cuối:</span>
                <span>{customer.lastVisit}</span>
              </div>
            </div>

            <div className="customer-notes">
              <p>{customer.notes}</p>
            </div>

            <div className="customer-actions">
              <button className="btn-view">Xem</button>
              <button className="btn-edit">Sửa</button>
              <button className="btn-contact">Liên hệ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TestDrivesTab = () => (
    <div className="test-drives-section">
      <div className="section-header">
        <h3>Lịch Lái Thử</h3>
        <div className="filters">
          <select className="status-filter">
            <option value="">Tất cả lịch hẹn</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <button 
            className="btn-schedule"
            onClick={() => openModal('scheduleTestDrive')}
          >
            + Đặt Lịch Lái Thử
          </button>
        </div>
      </div>

      <div className="test-drives-grid">
        {testDrives.map(testDrive => (
          <div key={testDrive.id} className="test-drive-card">
            <div className="test-drive-header">
              <span className="test-drive-id">{testDrive.id}</span>
              <span 
                className="test-drive-status"
                style={{ backgroundColor: getStatusColor(testDrive.status) }}
              >
                {testDrive.status === 'confirmed' ? 'Đã xác nhận' :
                 testDrive.status === 'pending' ? 'Chờ xác nhận' :
                 testDrive.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
              </span>
            </div>

            <div className="test-drive-info">
              <h4>{testDrive.customerName}</h4>
              <p>🚗 {testDrive.vehicle}</p>
              <p>📅 {testDrive.scheduledDate} - {testDrive.scheduledTime}</p>
              <p>👤 NV phụ trách: {testDrive.staff}</p>
            </div>

            <div className="test-drive-notes">
              <p>{testDrive.notes}</p>
            </div>

            <div className="test-drive-actions">
              <button className="btn-view">Chi tiết</button>
              <button className="btn-edit">Chỉnh sửa</button>
              {testDrive.status === 'pending' && (
                <button className="btn-confirm">Xác nhận</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FeedbackTab = () => (
    <div className="feedback-section">
      <div className="section-header">
        <h3>Phản Hồi & Khiếu Nại</h3>
        <div className="filters">
          <select className="status-filter">
            <option value="">Tất cả phản hồi</option>
            <option value="service">Dịch vụ</option>
            <option value="product">Sản phẩm</option>
            <option value="complaint">Khiếu nại</option>
          </select>
          <select className="status-filter">
            <option value="">Tình trạng</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="pending">Chờ xử lý</option>
            <option value="investigating">Đang điều tra</option>
          </select>
        </div>
      </div>

      <div className="feedback-grid">
        {feedbacks.map(feedback => (
          <div key={feedback.id} className="feedback-card">
            <div className="feedback-header">
              <span className="feedback-id">{feedback.id}</span>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < feedback.rating ? 'filled' : ''}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="feedback-info">
              <h4>{feedback.title}</h4>
              <p className="customer-name">Khách hàng: {feedback.customerName}</p>
              <p className="feedback-type">
                Loại: {feedback.type === 'service' ? 'Dịch vụ' : 
                      feedback.type === 'product' ? 'Sản phẩm' : 'Khiếu nại'}
              </p>
              <p className="feedback-date">Ngày: {feedback.date}</p>
            </div>

            <div className="feedback-content">
              <p>{feedback.content}</p>
            </div>

            {feedback.response && (
              <div className="feedback-response">
                <strong>Phản hồi:</strong>
                <p>{feedback.response}</p>
              </div>
            )}

            <div className="feedback-status">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(feedback.status) }}
              >
                {feedback.status === 'resolved' ? 'Đã giải quyết' :
                 feedback.status === 'pending' ? 'Chờ xử lý' : 'Đang điều tra'}
              </span>
            </div>

            <div className="feedback-actions">
              <button className="btn-view">Chi tiết</button>
              <button className="btn-respond">Phản hồi</button>
              {feedback.status !== 'resolved' && (
                <button className="btn-resolve">Đánh dấu giải quyết</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="customer-management">
      <div className="customer-header">
        <h2>Quản Lý Khách Hàng</h2>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{customers.length}</span>
            <span className="stat-label">Tổng khách hàng</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{testDrives.filter(td => td.status === 'pending').length}</span>
            <span className="stat-label">Lịch chờ xác nhận</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{feedbacks.filter(fb => fb.status === 'pending').length}</span>
            <span className="stat-label">Phản hồi chờ xử lý</span>
          </div>
        </div>
      </div>

      <div className="customer-tabs">
        <button 
          className={`customer-tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Khách Hàng
        </button>
        <button 
          className={`customer-tab ${activeTab === 'testdrives' ? 'active' : ''}`}
          onClick={() => setActiveTab('testdrives')}
        >
          🚗 Lái Thử
        </button>
        <button 
          className={`customer-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          💬 Phản Hồi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'testdrives' && <TestDrivesTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
      </div>

      {/* Modal placeholder */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === 'addCustomer' ? 'Thêm Khách Hàng Mới' :
                 modalType === 'scheduleTestDrive' ? 'Đặt Lịch Lái Thử' : 'Modal'}
              </h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>Chức năng đang được phát triển...</p>
              <p>Modal cho: {modalType}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;