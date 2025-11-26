import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  UserPlus,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  User,
  Lock,
  Calendar,
  Building,
  Shield
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
  InfoSection,
  ActionBar
} from '../../components';

const StaffForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  const { staffId } = useParams();
  const { startLoading, stopLoading } = usePageLoading();
  
  const isEditMode = !!staffId;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    roleId: 2, // Default to Sales
    dealerId: null,
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role options - convert to Select component format
  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Dealer Manager' },
    { id: 3, name: 'Sales Executive' },
    { id: 4, name: 'Technician' },
    { id: 5, name: 'Customer Service' },
    { id: 6, name: 'Finance' },
    { id: 7, name: 'Support' }
  ];

  // Convert roles to options format for Select component
  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  // Status options for Select component
  const statusOptions = [
    { value: 'Active', label: 'Đang làm việc' },
    { value: 'Inactive', label: 'Nghỉ việc' }
  ];

  useEffect(() => {
    if (isEditMode) {
      loadStaffData();
    }
  }, [staffId]);

  const loadStaffData = async () => {
    try {
      startLoading('Đang tải thông tin nhân viên...');
      
      const result = await dealerAPI.getUserById(staffId);
      
      if (result.success && result.data) {
        const userData = result.data;
        setFormData({
          username: userData.username || '',
          password: '', // Don't load password
          fullName: userData.fullName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
          roleId: userData.roleId || 2,
          dealerId: userData.dealerId || null,
          status: userData.status || 'Active'
        });
      } else {
        notifications.error('Lỗi', result.message || 'Không thể tải thông tin nhân viên');
        navigate(dealerId ? `/${dealerId}/dealer/staff` : '/dealer/staff');
      }
    } catch (error) {
      console.error('Error loading staff data:', error);
      notifications.error('Lỗi', 'Không thể tải thông tin nhân viên');
      navigate(dealerId ? `/${dealerId}/dealer/staff` : '/dealer/staff');
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
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Password validation (only for create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu không được để trống';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 65) {
        newErrors.dateOfBirth = 'Nhân viên phải từ 18 đến 65 tuổi';
      }
    }

    // Role validation
    if (!formData.roleId) {
      newErrors.roleId = 'Vui lòng chọn chức vụ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notifications.warning('Validation', 'Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading(isEditMode ? 'Đang cập nhật nhân viên...' : 'Đang tạo nhân viên mới...');

      // Prepare data
      const submitData = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth || null,
        roleId: parseInt(formData.roleId),
        dealerId: formData.dealerId ? parseInt(formData.dealerId) : null
      };

      // Add password only for create mode
      if (!isEditMode) {
        submitData.password = formData.password;
      }

      let result;
      if (isEditMode) {
        result = await dealerAPI.updateUser(staffId, submitData);
      } else {
        result = await dealerAPI.createUser(submitData);
      }

      if (result.success) {
        notifications.success(
          'Thành công', 
          isEditMode ? 'Cập nhật nhân viên thành công' : 'Tạo nhân viên mới thành công'
        );
        navigate(dealerId ? `/${dealerId}/dealer/staff` : '/dealer/staff');
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      notifications.error('Lỗi', 'Không thể lưu thông tin nhân viên');
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handleCancel = () => {
    navigate(dealerId ? `/${dealerId}/dealer/staff` : '/dealer/staff');
  };

  return (
    <PageContainer>
      <PageHeader
        title={isEditMode ? '✏️ Chỉnh sửa nhân viên' : '➕ Thêm nhân viên mới'}
        description={isEditMode ? 'Cập nhật thông tin nhân viên' : 'Tạo tài khoản nhân viên mới'}
        onBack={() => navigate(dealerId ? `/${dealerId}/dealer/staff` : '/dealer/staff')}
      />

      <form onSubmit={handleSubmit}>
        {/* Account Information */}
        <InfoSection title="🔐 Thông tin tài khoản" icon={<Shield size={20} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormGroup error={errors.username}>
              <Label required icon={<User size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                Tên đăng nhập
              </Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isEditMode}
                placeholder="Nhập tên đăng nhập"
                error={!!errors.username}
              />
              {errors.username && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.username}</span>}
            </FormGroup>

            {!isEditMode && (
              <FormGroup error={errors.password}>
                <Label required icon={<Lock size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  error={!!errors.password}
                />
                {errors.password && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.password}</span>}
              </FormGroup>
            )}

            <FormGroup error={errors.roleId}>
              <Label required icon={<Shield size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                Chức vụ
              </Label>
              <Select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                options={roleOptions}
                placeholder="-- Chọn chức vụ --"
                error={!!errors.roleId}
              />
              {errors.roleId && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.roleId}</span>}
            </FormGroup>

            {isEditMode && (
              <FormGroup>
                <Label icon={<Shield size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Trạng thái
                </Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </FormGroup>
            )}
          </div>
        </InfoSection>

        {/* Personal Information */}
        <InfoSection title="👤 Thông tin cá nhân" icon={<User size={20} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <FormGroup error={errors.fullName}>
              <Label required icon={<User size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                Họ và tên
              </Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
                error={!!errors.fullName}
              />
              {errors.fullName && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.fullName}</span>}
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <FormGroup error={errors.email}>
                <Label required icon={<Mail size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@dealer.com"
                  error={!!errors.email}
                />
                {errors.email && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.email}</span>}
              </FormGroup>

              <FormGroup error={errors.phoneNumber}>
                <Label required icon={<Phone size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Số điện thoại
                </Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0901234567"
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.phoneNumber}</span>}
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <FormGroup error={errors.dateOfBirth}>
                <Label icon={<Calendar size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Ngày sinh
                </Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  error={!!errors.dateOfBirth}
                />
                {errors.dateOfBirth && <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>{errors.dateOfBirth}</span>}
              </FormGroup>

              <FormGroup>
                <Label icon={<Building size={16} />} style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
                  Mã đại lý
                </Label>
                <Input
                  type="number"
                  name="dealerId"
                  value={formData.dealerId || ''}
                  onChange={handleChange}
                  placeholder="Nhập mã đại lý (nếu có)"
                />
              </FormGroup>
            </div>
          </div>
        </InfoSection>

        {/* Form Actions */}
        <ActionBar>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            icon={<X size={18} />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? null : (isEditMode ? <Save size={18} /> : <UserPlus size={18} />)}
          >
            {isSubmitting ? '⏳ Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default StaffForm;
