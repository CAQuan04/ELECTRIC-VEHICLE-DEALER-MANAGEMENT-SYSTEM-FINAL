import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/utils/auth';
import './SalesManagement.css';

const SalesManagement = () => {
  const [activeSection, setActiveSection] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock data
  const mockVehicles = [
    { id: 1, model: 'Model S', price: 2800000000, availability: 'available' },
    { id: 2, model: 'Model 3', price: 1200000000, availability: 'available' },
    { id: 3, model: 'Model Y', price: 1800000000, availability: 'low_stock' },
    { id: 4, model: 'Cybertruck', price: 2200000000, availability: 'pre_order' }
  ];

  const mockQuotes = [
    {
      id: 'QT001',
      customerName: 'Nguyễn Văn A',
      vehicleModel: 'Model 3',
      basePrice: 1200000000,
      discount: 50000000,
      finalPrice: 1150000000,
      status: 'pending',
      createdDate: '2024-01-15',
      validUntil: '2024-02-15',
      paymentMethod: 'cash'
    },
    {
      id: 'QT002', 
      customerName: 'Trần Thị B',
      vehicleModel: 'Model Y',
      basePrice: 1800000000,
      discount: 30000000,
      finalPrice: 1770000000,
      status: 'approved',
      createdDate: '2024-01-18',
      validUntil: '2024-02-18',
      paymentMethod: 'installment'
    }
  ];

  const mockOrders = [
    {
      id: 'ORD001',
      quoteId: 'QT002',
      customerName: 'Trần Thị B',
      vehicleModel: 'Model Y',
      totalAmount: 1770000000,
      status: 'confirmed',
      orderDate: '2024-01-20',
      estimatedDelivery: '2024-03-15',
      paymentStatus: 'partial_paid'
    }
  ];

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    setQuotes(mockQuotes);
    setOrders(mockOrders);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      confirmed: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      partial_paid: '#f59e0b',
      paid: '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      confirmed: 'Đã xác nhận',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
      partial_paid: 'Trả một phần',
      paid: 'Đã thanh toán'
    };
    return texts[status] || status;
  };

  // Quote Creation Component
  const QuoteCreator = () => {
    const [formData, setFormData] = useState({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleId: '',
      basePrice: 0,
      discount: 0,
      paymentMethod: 'cash',
      notes: ''
    });

    const handleVehicleSelect = (vehicle) => {
      setFormData({
        ...formData,
        vehicleId: vehicle.id,
        basePrice: vehicle.price
      });
      setSelectedVehicle(vehicle);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newQuote = {
        id: `QT${String(quotes.length + 1).padStart(3, '0')}`,
        ...formData,
        vehicleModel: selectedVehicle?.model,
        finalPrice: formData.basePrice - formData.discount,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setQuotes([...quotes, newQuote]);
      setShowCreateModal(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleId: '',
        basePrice: 0,
        discount: 0,
        paymentMethod: 'cash',
        notes: ''
      });
      setSelectedVehicle(null);
    };

    return (
      <div className="quote-creator">
        <h3>📋 Tạo Báo Giá Mới</h3>
        <form onSubmit={handleSubmit} className="quote-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên khách hàng *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phương thức thanh toán</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="cash">Trả thẳng</option>
                <option value="installment">Trả góp</option>
              </select>
            </div>
          </div>

          <div className="vehicle-selection">
            <label>Chọn xe *</label>
            <div className="vehicle-grid">
              {mockVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`vehicle-option ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <h4>{vehicle.model}</h4>
                  <p>{formatCurrency(vehicle.price)}</p>
                  <span className={`status ${vehicle.availability}`}>
                    {vehicle.availability === 'available' ? 'Có sẵn' : 
                     vehicle.availability === 'low_stock' ? 'Sắp hết' : 'Đặt trước'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {selectedVehicle && (
            <div className="pricing-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Giá gốc</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    readOnly
                    className="readonly"
                  />
                </div>
                <div className="form-group">
                  <label>Chiết khấu (VND)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    min="0"
                    max={formData.basePrice * 0.2}
                  />
                </div>
              </div>
              <div className="final-price">
                <strong>Giá cuối cùng: {formatCurrency(formData.basePrice - formData.discount)}</strong>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
              placeholder="Ghi chú thêm về báo giá..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-create" disabled={!selectedVehicle}>
              Tạo Báo Giá
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="sales-management">
      <div className="sales-header">
        <h2>💼 Quản Lý Bán Hàng</h2>
        <button 
          className="btn-create-new"
          onClick={() => setShowCreateModal(true)}
        >
          + Tạo Báo Giá Mới
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="sales-tabs">
        <button 
          className={`sales-tab ${activeSection === 'quotes' ? 'active' : ''}`}
          onClick={() => setActiveSection('quotes')}
        >
          📋 Báo Giá ({quotes.length})
        </button>
        <button 
          className={`sales-tab ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          🛒 Đơn Hàng ({orders.length})
        </button>
        <button 
          className={`sales-tab ${activeSection === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveSection('contracts')}
        >
          📝 Hợp Đồng ({contracts.length})
        </button>
        <button 
          className={`sales-tab ${activeSection === 'promotions' ? 'active' : ''}`}
          onClick={() => setActiveSection('promotions')}
        >
          🎁 Khuyến Mãi
        </button>
        <button 
          className={`sales-tab ${activeSection === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveSection('delivery')}
        >
          🚚 Theo Dõi Giao Xe
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === 'quotes' && (
        <div className="quotes-section">
          <div className="section-header">
            <h3>📋 Danh Sách Báo Giá</h3>
            <div className="filters">
              <select className="status-filter">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          <div className="quotes-grid">
            {quotes.map(quote => (
              <div key={quote.id} className="quote-card">
                <div className="quote-header">
                  <div className="quote-id">#{quote.id}</div>
                  <div 
                    className="quote-status"
                    style={{ backgroundColor: getStatusColor(quote.status) }}
                  >
                    {getStatusText(quote.status)}
                  </div>
                </div>

                <div className="quote-customer">
                  <h4>{quote.customerName}</h4>
                  <p>{quote.vehicleModel}</p>
                </div>

                <div className="quote-pricing">
                  <div className="price-row">
                    <span>Giá gốc:</span>
                    <span>{formatCurrency(quote.basePrice)}</span>
                  </div>
                  <div className="price-row">
                    <span>Chiết khấu:</span>
                    <span className="discount">-{formatCurrency(quote.discount)}</span>
                  </div>
                  <div className="price-row final">
                    <span>Tổng cộng:</span>
                    <span className="final-price">{formatCurrency(quote.finalPrice)}</span>
                  </div>
                </div>

                <div className="quote-dates">
                  <small>Tạo: {quote.createdDate}</small>
                  <small>Hết hạn: {quote.validUntil}</small>
                </div>

                <div className="quote-actions">
                  <button className="btn-view">👁️ Xem</button>
                  <button className="btn-edit">✏️ Sửa</button>
                  {quote.status === 'approved' && (
                    <button className="btn-order">🛒 Tạo Đơn</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'orders' && (
        <div className="orders-section">
          <h3>🛒 Quản Lý Đơn Hàng</h3>
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">#{order.id}</div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="order-info">
                  <h4>{order.customerName}</h4>
                  <p>{order.vehicleModel}</p>
                  <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
                </div>

                <div className="order-timeline">
                  <div className="timeline-item">
                    <span>Đặt hàng:</span>
                    <span>{order.orderDate}</span>
                  </div>
                  <div className="timeline-item">
                    <span>Dự kiến giao:</span>
                    <span>{order.estimatedDelivery}</span>
                  </div>
                </div>

                <div className="payment-status">
                  <span 
                    className="payment-badge"
                    style={{ backgroundColor: getStatusColor(order.paymentStatus) }}
                  >
                    {getStatusText(order.paymentStatus)}
                  </span>
                </div>

                <div className="order-actions">
                  <button className="btn-view">👁️ Chi Tiết</button>
                  <button className="btn-track">📍 Theo Dõi</button>
                  <button className="btn-invoice">🧾 Hóa Đơn</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'contracts' && (
        <div className="contracts-section">
          <h3>📝 Quản Lý Hợp Đồng</h3>
          <div className="coming-soon">
            <p>🚧 Chức năng quản lý hợp đồng đang được phát triển...</p>
            <ul>
              <li>📋 Tạo hợp đồng từ đơn hàng đã xác nhận</li>
              <li>✍️ Ký điện tử và quản lý chữ ký</li>
              <li>📁 Lưu trữ và tra cứu hợp đồng</li>
              <li>📊 Báo cáo trạng thái hợp đồng</li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === 'promotions' && (
        <div className="promotions-section">
          <h3>🎁 Quản Lý Khuyến Mãi</h3>
          <div className="coming-soon">
            <p>🚧 Chức năng quản lý khuyến mãi đang được phát triển...</p>
            <ul>
              <li>🎯 Tạo và quản lý chương trình khuyến mãi</li>
              <li>💰 Thiết lập mức chiết khấu theo từng mẫu xe</li>
              <li>📅 Quản lý thời gian hiệu lực</li>
              <li>👥 Áp dụng khuyến mãi cho khách hàng VIP</li>
            </ul>
          </div>
        </div>
      )}

      {activeSection === 'delivery' && (
        <div className="delivery-section">
          <h3>🚚 Theo Dõi Giao Xe</h3>
          <div className="coming-soon">
            <p>🚧 Chức năng theo dõi giao xe đang được phát triển...</p>
            <ul>
              <li>📦 Đặt xe từ hãng theo nhu cầu</li>
              <li>🚛 Theo dõi vận chuyển từ nhà máy</li>
              <li>📍 Cập nhật tình trạng giao xe cho khách</li>
              <li>📱 Thông báo tự động cho khách hàng</li>
            </ul>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <QuoteCreator />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;