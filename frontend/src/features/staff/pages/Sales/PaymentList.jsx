import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const PaymentList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      startLoading('Đang tải danh sách thanh toán...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayments = [
        { id: 1, orderId: 'ORD-0001', customer: 'Nguyễn Văn A', amount: 240000000, type: 'Đặt cọc', date: '2025-10-01', status: 'Hoàn thành', method: 'Chuyển khoản' },
        { id: 2, orderId: 'ORD-0002', customer: 'Trần Thị B', amount: 1500000000, type: 'Toàn bộ', date: '2025-09-25', status: 'Hoàn thành', method: 'Tiền mặt' },
        { id: 3, orderId: 'ORD-0003', customer: 'Lê Văn C', amount: 500000000, type: 'Đặt cọc', date: '2025-10-05', status: 'Chờ xử lý', method: 'Chuyển khoản' }
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="payment-list-page">
      <div className="page-header">
        <h1>💳 Quản lý thanh toán</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/sales/payments/new')}>
          + Ghi nhận thanh toán
        </button>
      </div>

      <div className="payment-table">
        <table>
          <thead>
            <tr>
              <th>Mã thanh toán</th>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Loại</th>
              <th>Phương thức</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td><strong>PAY-{String(payment.id).padStart(4, '0')}</strong></td>
                <td>{payment.orderId}</td>
                <td>{payment.customer}</td>
                <td>{(payment.amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ</td>
                <td>{payment.type}</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={payment.status === 'Hoàn thành' ? 'badge-success' : 'badge-warning'}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <button className="btn-link">Chi tiết</button>
                  <button className="btn-link">In hóa đơn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
