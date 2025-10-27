import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    loadCustomerDetail();
  }, [customerId]);

  const loadCustomerDetail = async () => {
    try {
      startLoading('Đang tải thông tin khách hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCustomer = {
        id: customerId,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1',
        city: 'TP. Hồ Chí Minh',
        status: 'Tiềm năng',
        createdDate: '2025-09-01',
        purchaseHistory: [
          { id: 1, vehicle: 'Model 3', date: '2024-06-15', amount: 1200000000 }
        ],
        testDrives: [
          { id: 1, vehicle: 'Model Y', date: '2025-10-05', status: 'Hoàn thành' }
        ],
        notes: 'Khách hàng quan tâm đến Model Y'
      };
      
      setCustomer(mockCustomer);
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      stopLoading();
    }
  };

  if (!customer) return null;

  return (
    <div className="customer-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="customer-header">
        <div className="customer-info">
          <h1>{customer.name}</h1>
          <p className="customer-email">{customer.email}</p>
          <p className="customer-phone">{customer.phone}</p>
          <span className={`status-badge badge-${customer.status === 'Đã mua' ? 'success' : 'info'}`}>
            {customer.status}
          </span>
        </div>
        <div className="customer-actions">
          <button className="btn-primary" onClick={() => navigate(`/dealer/customers/${customerId}/edit`)}>
            ✏️ Chỉnh sửa
          </button>
          <button className="btn-secondary">
            📞 Gọi điện
          </button>
        </div>
      </div>

      <div className="customer-details">
        <div className="detail-section">
          <h3>Thông tin cơ bản</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Địa chỉ:</span>
              <span className="value">{customer.address}</span>
            </div>
            <div className="detail-item">
              <span className="label">Thành phố:</span>
              <span className="value">{customer.city}</span>
            </div>
            <div className="detail-item">
              <span className="label">Ngày tạo:</span>
              <span className="value">{customer.createdDate}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Lịch sử mua hàng</h3>
          {customer.purchaseHistory.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Xe</th>
                  <th>Ngày mua</th>
                  <th>Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {customer.purchaseHistory.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{purchase.vehicle}</td>
                    <td>{purchase.date}</td>
                    <td>{(purchase.amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">Chưa có lịch sử mua hàng</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Lịch sử lái thử</h3>
          {customer.testDrives.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Xe</th>
                  <th>Ngày lái thử</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {customer.testDrives.map(testDrive => (
                  <tr key={testDrive.id}>
                    <td>{testDrive.vehicle}</td>
                    <td>{testDrive.date}</td>
                    <td>
                      <span className="badge-success">{testDrive.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">Chưa có lịch sử lái thử</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Ghi chú</h3>
          <p>{customer.notes || 'Không có ghi chú'}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
