import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const StaffForm = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const isEditMode = !!staffId;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    salary: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading(isEditMode ? 'Đang cập nhật...' : 'Đang thêm nhân viên...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(isEditMode ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
      navigate('/dealer/staff');
    } catch (error) {
      console.error('Error saving staff:', error);
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
    <div className="staff-form-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>{isEditMode ? '✏️ Cập nhật nhân viên' : '➕ Thêm nhân viên mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="staff-form">
        <div className="form-row">
          <div className="form-group">
            <label>Họ và tên *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Chức vụ *</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">-- Chọn chức vụ --</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="sales_executive">Sales Executive</option>
              <option value="customer_service">Customer Service</option>
              <option value="technician">Technician</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngày vào làm *</label>
            <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Lương (VNĐ)</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="15000000" />
          </div>
        </div>

        <div className="form-group">
          <label>Ghi chú</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Hủy</button>
          <button type="submit" className="btn-primary">{isEditMode ? 'Cập nhật' : 'Thêm mới'}</button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
