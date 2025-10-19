import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const TestDriveForm = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicle: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang đăng ký lái thử...');
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Đăng ký lái thử thành công!');
      navigate('/dealer/test-drive');
    } catch (error) {
      console.error('Error creating test drive:', error);
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
    <div className="test-drive-form-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📝 Đăng ký lái thử mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="test-drive-form">
        <h3>Thông tin khách hàng</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Tên khách hàng *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              placeholder="0901234567"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <h3>Thông tin lái thử</h3>
        <div className="form-group">
          <label>Chọn xe *</label>
          <select name="vehicle" value={formData.vehicle} onChange={handleChange} required>
            <option value="">-- Chọn xe --</option>
            <option value="model3">Model 3</option>
            <option value="modelY">Model Y</option>
            <option value="modelS">Model S</option>
            <option value="modelX">Model X</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngày *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Giờ *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Yêu cầu đặc biệt hoặc ghi chú..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestDriveForm;
