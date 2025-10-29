import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicle: '',
    color: '',
    interior: '',
    basePrice: 0,
    downPayment: 0,
    paymentMethod: 'financing',
    deliveryAddress: '',
    estimatedDelivery: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang tạo đơn hàng...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Tạo đơn hàng thành công!');
      navigate('/dealer/sales/orders');
    } catch (error) {
      console.error('Error creating order:', error);
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
    <div className="create-order-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📝 Tạo đơn hàng mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <h3>Thông tin khách hàng</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tên khách hàng *</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
        </div>

        <h3>Thông tin xe</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Dòng xe *</label>
            <select name="vehicle" value={formData.vehicle} onChange={handleChange} required>
              <option value="">-- Chọn xe --</option>
              <option value="model3">Model 3</option>
              <option value="modelY">Model Y</option>
              <option value="modelS">Model S</option>
              <option value="modelX">Model X</option>
            </select>
          </div>
          <div className="form-group">
            <label>Màu sắc *</label>
            <select name="color" value={formData.color} onChange={handleChange} required>
              <option value="">-- Chọn màu --</option>
              <option value="white">Pearl White</option>
              <option value="black">Solid Black</option>
              <option value="blue">Deep Blue Metallic</option>
              <option value="red">Red Multi-Coat</option>
            </select>
          </div>
        </div>

        <h3>Thanh toán</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Giá cơ bản *</label>
            <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Đặt cọc *</label>
            <input type="number" name="downPayment" value={formData.downPayment} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Phương thức thanh toán *</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="cash">Tiền mặt</option>
            <option value="financing">Trả góp</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
        </div>

        <h3>Giao nhận</h3>
        <div className="form-group">
          <label>Địa chỉ giao xe *</label>
          <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required rows="3" />
        </div>

        <div className="form-group">
          <label>Ngày giao dự kiến</label>
          <input type="date" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Hủy</button>
          <button type="submit" className="btn-primary">Tạo đơn hàng</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
