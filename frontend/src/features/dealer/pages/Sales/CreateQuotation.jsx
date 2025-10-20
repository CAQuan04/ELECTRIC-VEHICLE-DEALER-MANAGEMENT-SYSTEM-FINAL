import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const CreateQuotation = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    vehicle: '',
    basePrice: 0,
    discount: 0,
    additionalOptions: [],
    validUntil: '',
    notes: ''
  });

  const [selectedOptions, setSelectedOptions] = useState([]);

  const availableOptions = [
    { id: 1, name: 'Màu đặc biệt', price: 50000000 },
    { id: 2, name: 'Nội thất cao cấp', price: 100000000 },
    { id: 3, name: 'Autopilot nâng cao', price: 150000000 },
    { id: 4, name: 'Gói bảo dưỡng 5 năm', price: 80000000 }
  ];

  const calculateTotal = () => {
    const basePrice = parseInt(formData.basePrice) || 0;
    const discount = parseInt(formData.discount) || 0;
    const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return basePrice + optionsTotal - discount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading('Đang tạo báo giá...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Tạo báo giá thành công!');
      navigate('/dealer/sales/quotations');
    } catch (error) {
      console.error('Error creating quotation:', error);
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

  const toggleOption = (option) => {
    if (selectedOptions.find(o => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(o => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="create-quotation-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📝 Tạo báo giá mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="quotation-form">
        <h3>Thông tin khách hàng</h3>
        <div className="form-group">
          <label>Tên khách hàng *</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Thông tin xe</h3>
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

        <div className="form-group">
          <label>Giá cơ bản *</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            placeholder="1200000000"
          />
        </div>

        <div className="form-group">
          <label>Tùy chọn bổ sung</label>
          <div className="options-grid">
            {availableOptions.map(option => (
              <div 
                key={option.id}
                className={`option-card ${selectedOptions.find(o => o.id === option.id) ? 'selected' : ''}`}
                onClick={() => toggleOption(option)}
              >
                <h4>{option.name}</h4>
                <p>+{(option.price / 1000000).toLocaleString('vi-VN')} triệu VNĐ</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Giảm giá</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Hiệu lực đến *</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="quotation-summary">
          <h3>Tổng cộng: {(calculateTotal() / 1000000).toLocaleString('vi-VN')} triệu VNĐ</h3>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button type="submit" className="btn-primary">
            Tạo báo giá
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotation;
