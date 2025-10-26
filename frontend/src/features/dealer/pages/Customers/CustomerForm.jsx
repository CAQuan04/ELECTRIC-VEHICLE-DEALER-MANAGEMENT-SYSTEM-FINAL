import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import provincesData from '@/assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '@/assets/tinh-xa-sapnhap-main/wards.json';
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
    city: '', // Mã tỉnh/thành phố (province_id)
    ward: '', // Mã xã/phường (ward_id)
    notes: ''
  });

  const [availableWards, setAvailableWards] = useState([]);

  
  useEffect(() => {
    if (isEditMode) {
      const loadOldData = async () => {
        try {
          startLoading('Đang tải dữ liệu cũ...');
          await new Promise(resolve => setTimeout(resolve, 800));
          setFormData({
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0901234567',
            address: '123 Đường ABC',
            city: '01', // Mã Hà Nội
            ward: '00070', // Mã Phường Hoàn Kiếm
            notes: 'Khách hàng cũ, đã mua Model X.'
          });
        } finally {
          stopLoading();
        }
      };
      loadOldData();
    }
  }, [isEditMode, customerId]);

  // LỌC DỮ LIỆU XÃ/PHƯỜNG DỰA TRÊN THÀNH PHỐ ĐÃ CHỌN
  useEffect(() => {
    if (formData.city) {
      // Lọc wardsData để chỉ lấy xã/phường thuộc province_id đã chọn
      const filtered = wardsData.filter(ward => ward.province_id === formData.city);
      setAvailableWards(filtered);
    } else {
      setAvailableWards([]);
    }
  }, [formData.city]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading(isEditMode ? 'Đang cập nhật...' : 'Đang tạo khách hàng...');
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
    
    // Nếu thay đổi thành phố, reset xã/phường
    if (name === 'city') {
        setFormData(prev => ({
            ...prev,
            city: value,
            ward: '', // Reset xã/phường khi tỉnh/thành phố thay đổi
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    // Page Container: đảm bảo nền chung hỗ trợ Light/Dark Mode
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Nút Quay Lại (Giữ nguyên style hiện đại) */}
      <button 
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-6 flex items-center transition duration-150" 
        onClick={() => navigate(-1)}
      >
        <span className="mr-2">&larr;</span> Quay lại
      </button>

      {/* Header */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? '✏️ Cập nhật khách hàng' : '➕ Thêm khách hàng mới'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isEditMode ? `ID: ${customerId}` : 'Điền thông tin cơ bản và địa chỉ của khách hàng mới.'}
        </p>
      </div>

      {/* FORM CONTAINER */}
      <form 
        onSubmit={handleSubmit} 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        
        {/* CỘT 1 (THÔNG TIN LIÊN HỆ) */}
        <FormSection 
          title="Thông tin liên hệ" 
          description="Họ tên, Email và Số điện thoại là bắt buộc."
          className="lg:col-span-1"
        >
          <InputGroup label="Họ và tên" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Nguyễn Văn A" />
          <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
          <InputGroup label="Số điện thoại" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="0901234567" />
        </FormSection>

        {/* CỘT 2 (ĐỊA CHỈ & VỊ TRÍ) - Cập nhật thêm Xã/Phường */}
        <FormSection 
          title="Địa chỉ" 
          description="Chọn thành phố và xã/phường/thị trấn trước khi nhập địa chỉ chi tiết."
          className="lg:col-span-1"
        >
          {/* Select Input cho Thành phố */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thành phố *</label>
            <select 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-500 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
            >
              <option value="" className="bg-white dark:bg-gray-700">-- Chọn thành phố --</option>
              {provincesData.map(province => (
                <option key={province.id} value={province.id} className="bg-white dark:bg-gray-700">
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Input cho Xã/Phường */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xã/Phường/Thị trấn *</label>
            <select 
              name="ward" 
              value={formData.ward} 
              onChange={handleChange} 
              required
              disabled={!formData.city} // Vô hiệu hóa nếu chưa chọn Thành phố
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-500 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500 disabled:dark:text-gray-500"
            >
              <option value="" className="bg-white dark:bg-gray-700">-- Chọn xã/phường --</option>
              {availableWards.map(ward => (
                <option key={ward.id} value={ward.id} className="bg-white dark:bg-gray-700">
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <InputGroup 
            label="Địa chỉ chi tiết (Số nhà, Tên đường)" 
            name="address" 
            type="text" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="123 Đường ABC" 
          />
        </FormSection>

        {/* CỘT 3 */}
        <FormSection 
          title="Ghi chú" 
          description="Thông tin bổ sung về sở thích hoặc lịch sử liên lạc."
          className="lg:col-span-1 flex flex-col justify-between"
        >
          <div className="flex-grow">
            <label className="block text-2sm font-medium text-gray-700 dark:text-gray-600 mb-1 sr-only">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="6"
              placeholder="Thông tin bổ sung về khách hàng..."
              className="w-full p-3 border border-gray-300 dark:border-gray-200 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-600 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          {/* Form Actions (Nút bấm) */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button 
              type="button" 
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm"
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/50"
            >
              {isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </FormSection>
      </form>
    </div>
  );
};

// Component InputGroup (Giữ nguyên)
const InputGroup = ({ label, name, type, value, onChange, required, placeholder, className = '' }) => (
  <div className={`col-span-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    />
  </div>
);

// Wrapper cho mỗi Section trong Form (Giữ nguyên)
const FormSection = ({ title, description, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}>
    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h2>
    <p className="text-sm text-gray-500 dark:text-gray-700 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">{description}</p>
    
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default CustomerForm;