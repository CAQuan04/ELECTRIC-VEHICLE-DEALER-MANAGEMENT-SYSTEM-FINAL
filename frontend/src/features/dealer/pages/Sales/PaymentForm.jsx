import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const PaymentForm = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    orderId: '',
    amount: 0,
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang ghi nhận thanh toán...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Ghi nhận thanh toán thành công!');
      navigate('/dealer/sales/payments');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      stopLoading();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="payment-form-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>💳 Ghi nhận thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Mã đơn hàng *</label>
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            placeholder="ORD-0001"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số tiền *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="240000000"
            />
          </div>

          <div className="form-group">
            <label>Loại thanh toán *</label>
            <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
              <option value="deposit">Đặt cọc</option>
              <option value="installment">Trả góp</option>
              <option value="full">Toàn bộ</option>
              <option value="final">Thanh toán cuối</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Phương thức thanh toán *</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="cash">Tiền mặt</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            <option value="credit_card">Thẻ tín dụng</option>
            <option value="financing">Tài chính</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mã giao dịch</label>
          <input
            type="text"
            name="transactionReference"
            value={formData.transactionReference}
            onChange={handleChange}
            placeholder="TXN123456"
          />
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Thông tin bổ sung về thanh toán..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Ghi nhận thanh toán
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
