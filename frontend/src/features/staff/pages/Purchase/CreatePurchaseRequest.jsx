import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const CreatePurchaseRequest = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    vehicle: '',
    quantity: 1,
    priority: 'normal',
    reason: '',
    estimatedCost: 0,
    requestedBy: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang tạo yêu cầu...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Tạo yêu cầu mua hàng thành công!');
      navigate('/dealer/purchase');
    } catch (error) {
      console.error('Error creating purchase request:', error);
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
    <div className="create-purchase-request-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📝 Tạo yêu cầu mua hàng</h1>
      </div>

      <form onSubmit={handleSubmit} className="purchase-request-form">
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

        <div className="form-row">
          <div className="form-group">
            <label>Số lượng *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Ưu tiên *</label>
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="normal">Bình thường</option>
              <option value="high">Cao</option>
              <option value="urgent">Khẩn cấp</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Lý do yêu cầu *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Giải thích lý do cần mua hàng..."
          />
        </div>

        <div className="form-group">
          <label>Chi phí dự kiến</label>
          <input
            type="number"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleChange}
            placeholder="6000000000"
          />
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Thông tin bổ sung..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Tạo yêu cầu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseRequest;
