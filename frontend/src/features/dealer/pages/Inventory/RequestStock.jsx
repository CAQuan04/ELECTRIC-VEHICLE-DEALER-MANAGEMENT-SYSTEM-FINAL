import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const RequestStock = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    model: '',
    quantity: 1,
    color: '',
    priority: 'normal',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang gửi yêu cầu...');
      // TODO: Call API to submit stock request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Yêu cầu nhập xe đã được gửi thành công!');
      navigate('/dealer/inventory');
    } catch (error) {
      console.error('Error submitting request:', error);
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
    <div className="request-stock-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📝 Yêu cầu nhập xe mới</h1>
        <p>Điền thông tin để yêu cầu nhập xe vào kho</p>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>Dòng xe *</label>
          <select 
            name="model" 
            value={formData.model} 
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn dòng xe --</option>
            <option value="model3">Model 3</option>
            <option value="modelY">Model Y</option>
            <option value="modelS">Model S</option>
            <option value="modelX">Model X</option>
          </select>
        </div>

        <div className="form-group">
          <label>Màu sắc *</label>
          <select 
            name="color" 
            value={formData.color} 
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn màu --</option>
            <option value="white">Pearl White</option>
            <option value="black">Solid Black</option>
            <option value="blue">Deep Blue Metallic</option>
            <option value="red">Red Multi-Coat</option>
            <option value="silver">Midnight Silver Metallic</option>
          </select>
        </div>

        <div className="form-group">
          <label>Số lượng *</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Mức độ ưu tiên *</label>
          <select 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
            required
          >
            <option value="normal">Bình thường</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea 
            name="notes" 
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Thêm ghi chú nếu cần..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestStock;
