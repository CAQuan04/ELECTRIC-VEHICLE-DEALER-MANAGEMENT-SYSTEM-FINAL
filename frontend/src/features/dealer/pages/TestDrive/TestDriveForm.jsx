import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Button, 
  Card 
} from '../../components'; // Giả sử import từ components

// Component con cho Input (để tái sử dụng)
const FormInput = ({ label, name, type = 'text', ...props }) => (
  <div className="form-group">
    <label 
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
      {...props}
    />
  </div>
);

// Component con cho Select (để tái sử dụng)
const FormSelect = ({ label, name, children, ...props }) => (
  <div className="form-group">
    <label 
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
      {...props}
    >
      {children}
    </select>
  </div>
);

// Component con cho Textarea (để tái sử dụng)
const FormTextarea = ({ label, name, ...props }) => (
  <div className="form-group">
    <label 
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows="4"
      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
      {...props}
    />
  </div>
);


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
      navigate('/dealer/test-drives'); // Sửa: Dùng /dealer/test-drives thay vì /dealer/test-drive
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
    <PageContainer>
      <PageHeader
        title="📝 Đăng ký lái thử mới"
        actions={
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cột trái: Thông tin khách hàng */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-4">
              Thông tin khách hàng
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormInput
                label="Tên khách hàng *"
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
              />
              <FormInput
                label="Số điện thoại *"
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                placeholder="0901234567"
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </Card>

          {/* Cột phải: Thông tin lái thử */}
          <Card className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-4">
              Thông tin lái thử
            </h3>

            <div className="space-y-4">
              <FormSelect 
                label="Chọn xe *" 
                name="vehicle" 
                value={formData.vehicle} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Chọn xe --</option>
                <option value="model3">Model 3</option>
                <option value="modelY">Model Y</option>
                <option value="modelS">Model S</option>
                <option value="modelX">Model X</option>
              </FormSelect>

              <FormInput
                label="Ngày *"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />

              <FormInput
                label="Giờ *"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          {/* Ghi chú (Full width) */}
          <Card className="lg:col-span-3">
            <FormTextarea
              label="Ghi chú"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Yêu cầu đặc biệt hoặc ghi chú..."
            />
          </Card>

        </div>

        {/* Nút Action */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            Đăng ký
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default TestDriveForm;