import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';

// Import Lucide icons
import {
  UserPlus,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

// Import components
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

// Import địa chỉ data
import provincesData from '@/assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '@/assets/tinh-xa-sapnhap-main/wards.json';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!customerId;

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    ward: '',
    notes: ''
  });

  const [availableWards, setAvailableWards] = useState([]);

  // Load customer data for edit mode
  useEffect(() => {
    if (isEditMode && customerId) {
      const loadCustomer = async () => {
        setIsDataLoading(true);
        try {
          const response = await dealerAPI.getCustomerById(customerId);
          if (response.success) {
            setFormData(response.data);

            if (response.data.city) {
              const filtered = wardsData.filter(
                ward => ward.province_id === response.data.city
              );
              setAvailableWards(filtered);
            }
          } else {
            alert('Lỗi: ' + response.message);
            navigate('/dealer/customers');
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

  // Filter wards when city changes
  useEffect(() => {
    if (formData.city) {
      const filtered = wardsData.filter(
        ward => ward.province_id === formData.city
      );
      setAvailableWards(filtered);
    } else {
      setAvailableWards([]);
    }
  }, [formData.city]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.city) {
      newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.ward) {
      newErrors.ward = 'Vui lòng chọn xã/phường';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (isEditMode) {
        response = await dealerAPI.updateCustomer(customerId, formData);
        if (response.success) {
          alert('✅ Cập nhật khách hàng thành công!');
          navigate('/dealer/customers');
        } else {
          alert('❌ Lỗi: ' + response.message);
        }
      } else {
        response = await dealerAPI.createCustomer(formData);
        if (response.success) {
          alert('✅ Thêm khách hàng thành công!');
          navigate('/dealer/customers');
        } else {
          alert('❌ Lỗi: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('❌ Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        city: value,
        ward: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isLoading = isDataLoading || isSubmitting;

  // Convert data for Select components
  const provinceOptions = provincesData.map(p => ({
    label: p.name,
    value: p.id
  }));

  const wardOptions = availableWards.map(w => ({
    label: w.name,
    value: w.id
  }));

  // Quick stats for form
  const formStats = [
    {
      icon: isEditMode ? <Edit className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />,
      label: 'Chế độ',
      value: isEditMode ? 'Cập nhật' : 'Tạo mới',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      label: 'Trường bắt buộc',
      value: '5',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: isLoading ? <Loader className="w-8 h-8 animate-spin" /> : <CheckCircle className="w-8 h-8" />,
      label: 'Trạng thái',
      value: isLoading ? 'Đang xử lý...' : 'Sẵn sàng',
      color: isLoading ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <PageContainer>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <Edit className="w-10 h-10" />
              ) : (
                <UserPlus className="w-10 h-10" />
              )}
              <span>{isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}</span>
            </div>
          }
          subtitle={
            isEditMode
              ? `Đang chỉnh sửa hồ sơ ID: ${customerId}`
              : 'Điền thông tin cơ bản và địa chỉ để tạo hồ sơ khách hàng mới'
          }
          showBackButton
          onBack={() => navigate('/dealer/customers')}
        />

        {/* Quick Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg dark:shadow-emerald-500/5 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {stat.label}
                    </div>
                    <div className={`text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <InfoSection
                title="1. Thông tin liên hệ"
                icon={<UserPlus className="w-6 h-6" />}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup className="mb-0">
                      <Label htmlFor="name" required>
                        Họ và tên
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        disabled={isLoading}
                        error={errors.name}
                      />
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label htmlFor="phone" required>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Số điện thoại
                        </div>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0901234567"
                        disabled={isLoading}
                        error={errors.phone}
                      />
                    </FormGroup>
                  </div>

                  <FormGroup className="mb-0">
                    <Label htmlFor="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      disabled={isLoading}
                      error={errors.email}
                    />
                  </FormGroup>
                </div>
              </InfoSection>

              {/* Address Information */}
              <InfoSection
                title="2. Địa chỉ"
                icon={<MapPin className="w-6 h-6" />}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup className="mb-0">
                      <Label htmlFor="city" required>
                        Tỉnh/Thành phố
                      </Label>
                      <Select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        options={provinceOptions}
                        placeholder="-- Chọn Tỉnh/Thành --"
                        disabled={isLoading}
                        error={errors.city}
                      />
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label htmlFor="ward" required>
                        Xã/Phường
                      </Label>
                      <Select
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        options={wardOptions}
                        placeholder="-- Chọn Xã/Phường --"
                        disabled={isLoading || !formData.city}
                        error={errors.ward}
                      />
                    </FormGroup>
                  </div>

                  <FormGroup className="mb-0">
                    <Label htmlFor="address">
                      Địa chỉ chi tiết (Số nhà, Tên đường)
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Đường ABC"
                      disabled={isLoading}
                    />
                  </FormGroup>
                </div>
              </InfoSection>
            </div>

            {/* Notes Section - 1 column */}
            <div className="lg:col-span-1">
              <InfoSection
                title="3. Ghi chú"
                icon={<FileText className="w-6 h-6" />}
              >
                <FormGroup className="mb-0">
                  <Label htmlFor="notes" className="sr-only">
                    Ghi chú
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={16}
                    placeholder="Thông tin bổ sung về khách hàng...&#10;&#10;Ví dụ:&#10;- Quan tâm đến Model Y&#10;- Ngân sách: 1.5 tỷ&#10;- Thời gian dự kiến mua: Q2/2025"
                    disabled={isLoading}
                  />
                </FormGroup>
              </InfoSection>
            </div>
          </div>

          {/* Action Bar */}
          <ActionBar align="right">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/dealer/customers')}
              disabled={isLoading}
              icon={<X className="w-5 h-5" />}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading}
              icon={isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Đang cập nhật...'
                  : 'Đang lưu...'
                : isEditMode
                ? 'Cập nhật'
                : 'Lưu khách hàng'}
            </Button>
          </ActionBar>
        </form>
      </PageContainer>
    </div>
  );
};

export default CustomerForm;