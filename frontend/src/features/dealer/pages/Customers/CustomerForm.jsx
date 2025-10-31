import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';

// 1. Import các component UI chuẩn
import {
  PageContainer,
  PageHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  InfoSection,
  ActionBar
} from '../../components'; 
import { UserPlus, Edit } from 'lucide-react';

// 2. Import dữ liệu địa chỉ (giữ nguyên)
import provincesData from '@/assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '@/assets/tinh-xa-sapnhap-main/wards.json';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!customerId;

  // 3. Thay thế usePageLoading
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  
  // 4. Cập nhật useEffect để gọi API thật
  useEffect(() => {
    if (isEditMode && customerId) {
      const loadCustomer = async () => {
        setIsDataLoading(true);
        try {
          // Gọi API thật
          const response = await dealerAPI.getCustomerById(customerId);
          // API trả về response.data (dựa theo file dealer.api.js)
          setFormData(response.data); 
          
          // Kích hoạt bộ lọc xã/phường cho dữ liệu cũ
          if (response.data.city) {
            const filtered = wardsData.filter(ward => ward.province_id === response.data.city);
            setAvailableWards(filtered);
          }
        } catch (error) {
          console.error('Error loading customer:', error);
          alert('Lỗi: ' + (error.response?.data?.message || error.message));
          navigate('/dealer/customers');
        } finally {
          setIsDataLoading(false);
        }
      };
      loadCustomer();
    }
  }, [isEditMode, customerId, navigate]);

  // 5. Logic lọc xã/phường (giữ nguyên)
  useEffect(() => {
    if (formData.city) {
      const filtered = wardsData.filter(ward => ward.province_id === formData.city);
      setAvailableWards(filtered);
    } else {
      setAvailableWards([]);
    }
  }, [formData.city]);


  // 6. Cập nhật handleSubmit để gọi API thật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // (Thêm validate nếu cần)

    try {
      if (isEditMode) {
        // Gọi API Update (không trả về .success)
        await dealerAPI.updateCustomer(customerId, formData);
      } else {
        // Gọi API Create (không trả về .success)
        await dealerAPI.createCustomer(formData);
      }
      
      alert(isEditMode ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!');
      navigate('/dealer/customers');

    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Logic handleChange (giữ nguyên)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
        setFormData(prev => ({
            ...prev,
            city: value,
            ward: '', // Reset xã/phường
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const isLoading = isDataLoading || isSubmitting;

  // 8. Chuyển đổi data cho component <Select>
  const provinceOptions = provincesData.map(p => ({ 
    label: p.name, 
    value: p.id 
  }));
  
  const wardOptions = availableWards.map(w => ({ 
    label: w.name, 
    value: w.id 
  }));

  // 9. Render giao diện mới
  return (
    <PageContainer>
      <PageHeader
        title={isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
        subtitle={isEditMode ? `Đang chỉnh sửa hồ sơ ID: ${customerId}` : 'Điền thông tin cơ bản và địa chỉ'}
        icon={isEditMode ? <Edit className="w-16 h-16" /> : <UserPlus className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/customers')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI & GIỮA (Form chính) */}
          <div className="lg:col-span-2 space-y-6">
            <InfoSection 
              title="1. Thông tin liên hệ" 
              icon="👤"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="name" required className="dark:text-gray-300">Họ và tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nguyễn Văn A"
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label htmlFor="phone" required className="dark:text-gray-300">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0901234567"
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    />
                  </FormGroup>
                </div>
                <FormGroup className="mb-0">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>
              </div>
            </InfoSection>

            <InfoSection 
              title="2. Địa chỉ" 
              icon="📍"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="city" required className="dark:text-gray-300">Tỉnh/Thành phố</Label>
                    <Select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      options={provinceOptions}
                      placeholder="-- Chọn Tỉnh/Thành --"
                      required
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label htmlFor="ward" required className="dark:text-gray-300">Xã/Phường</Label>
                    <Select
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      options={wardOptions}
                      placeholder="-- Chọn Xã/Phường --"
                      required
                      disabled={isLoading || !formData.city} // Vô hiệu hóa khi loading hoặc chưa chọn Tỉnh
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormGroup>
                </div>
                <FormGroup className="mb-0">
                  <Label htmlFor="address" className="dark:text-gray-300">Địa chỉ chi tiết (Số nhà, Tên đường)</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Đường ABC"
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>
              </div>
            </InfoSection>
          </div>
          
          {/* CỘT PHẢI (Ghi chú) */}
          <div className="lg:col-span-1 space-y-6">
            <InfoSection 
              title="3. Ghi chú" 
              icon="📝"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full"
            >
              <FormGroup className="mb-0 h-full">
                <Label htmlFor="notes" className="dark:text-gray-300 sr-only">Ghi chú</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={10} // Tăng chiều cao
                  placeholder="Thông tin bổ sung về khách hàng..."
                  disabled={isLoading}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 h-full"
                />
              </FormGroup>
            </InfoSection>
          </div>
        </div>
        
        {/* Nút bấm */}
        <ActionBar align="right" className="mt-8 p-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/customers')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isSubmitting 
              ? (isEditMode ? 'Đang cập nhật...' : 'Đang lưu...') 
              : (isEditMode ? 'Cập nhật' : 'Lưu khách hàng')
            }
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default CustomerForm;