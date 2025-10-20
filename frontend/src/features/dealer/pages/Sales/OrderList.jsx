import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const OrderList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      startLoading('Đang tải danh sách đơn hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: 1200000000, date: '2025-10-01', status: 'Đang xử lý', deliveryDate: '2025-12-01' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', amount: 1500000000, date: '2025-09-25', status: 'Đã giao', deliveryDate: '2025-10-10' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', amount: 2800000000, date: '2025-10-05', status: 'Chờ duyệt', deliveryDate: '2025-12-15' }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      stopLoading();
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Chờ duyệt': 'badge-warning',
      'Đang xử lý': 'badge-info',
      'Đang giao': 'badge-primary',
      'Đã giao': 'badge-success',
      'Đã hủy': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  return (
    <div className="order-list-page">
      <div className="page-header">
        <h1>📋 Quản lý đơn hàng</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/sales/orders/new')}>
          + Tạo đơn hàng mới
        </button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Xe</th>
              <th>Giá trị</th>
              <th>Ngày đặt</th>
              <th>Ngày giao dự kiến</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><strong>ORD-{String(order.id).padStart(4, '0')}</strong></td>
                <td>{order.customer}</td>
                <td>{order.vehicle}</td>
                <td>{(order.amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ</td>
                <td>{order.date}</td>
                <td>{order.deliveryDate}</td>
                <td>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn-link">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
