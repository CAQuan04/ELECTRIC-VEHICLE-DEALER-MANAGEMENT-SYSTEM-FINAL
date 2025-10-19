import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const isEditMode = !!customerId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading(isEditMode ? 'Đang cập nhật...' : 'Đang tạo khách hàng...');
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(isEditMode ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
      navigate('/dealer/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
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
    <div className="customer-form-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>{isEditMode ? '✏️ Cập nhật khách hàng' : '➕ Thêm khách hàng mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-row">
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="0901234567"
            />
          </div>

          <div className="form-group">
            <label>Thành phố *</label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">-- Chọn thành phố --</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Đường ABC"
          />
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Thông tin bổ sung về khách hàng..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
