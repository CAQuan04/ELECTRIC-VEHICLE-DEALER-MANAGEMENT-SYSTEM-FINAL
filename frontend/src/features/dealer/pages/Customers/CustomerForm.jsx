import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';
import { useAuth } from '@/context/AuthContext';
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
  Loader,
  CreditCard // Icon cho CCCD
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

// Import dữ liệu địa chính
import provincesData from '@/assets/tinh-xa-sapnhap-main/provinces.json';
import wardsData from '@/assets/tinh-xa-sapnhap-main/wards.json';

const CustomerForm = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!customerId;

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const dealerId = user?.dealerId;

  // State form chính (chứa thông tin cá nhân)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idDocumentNumber: '', // Thêm trường CCCD
    notes: ''
  });

  // ✨ 1. STATE QUẢN LÝ ĐỊA CHỈ RIÊNG (Chuẩn theo CreateQuotation)
  const [addressParts, setAddressParts] = useState({
    provinceId: '',
    wardId: '',
    street: ''
  });

  // --- HELPER FUNCTIONS (Để tách địa chỉ khi Edit) ---
  const normalizeString = (str) => {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  };

  const cleanPlaceName = (name) => {
    const n = normalizeString(name);
    return n.replace(/^(tinh|thanh pho|tp|huyen|quan|thi xa|phuong|xa|thi tran)\s+/g, '').trim();
  };

  const findIdByName = (nameToFind, listData) => {
    if (!nameToFind) return '';
    const cleanTarget = cleanPlaceName(nameToFind);
    const foundItem = listData.find(item => cleanPlaceName(item.name) === cleanTarget);
    return foundItem ? foundItem.id : '';
  };

  // ✨ 2. LOGIC LỌC QUẬN/HUYỆN (WARDS) THEO TỈNH (Dùng useMemo chuẩn)
  const filteredWards = useMemo(() => {
    if (!addressParts.provinceId) return [];
    return wardsData.filter(w => w.province_id === addressParts.provinceId);
  }, [addressParts.provinceId]);

  // ✨ 3. HÀM GHÉP ĐỊA CHỈ ĐẦY ĐỦ
  const getFullAddress = () => {
    const province = provincesData.find(p => p.id === addressParts.provinceId);
    const ward = wardsData.find(w => w.id === addressParts.wardId);
    const street = addressParts.street ? addressParts.street.trim() : '';
    
    // Nếu chưa chọn đủ thì trả về null hoặc chuỗi rỗng tùy logic
    if (!province || !ward || !street) return null;

    // Format chuẩn: "Số nhà, Phường, Tỉnh"
    return `${street}, ${ward.name}, ${province.name}`;
  };

  // --- LOGIC LOAD DATA ĐỂ SỬA ---
  useEffect(() => {
    if (isEditMode && customerId) {
      const loadCustomer = async () => {
        setIsDataLoading(true);
        try {
          const response = await dealerAPI.getCustomerById(customerId);
          const apiData = (response && response.data) ? response.data : response;

          if (apiData) {
            // 1. Fill thông tin cơ bản
            setFormData({
              name: apiData.fullName || apiData.name || '',
              email: apiData.email || '',
              phone: apiData.phone || apiData.phoneNumber || '',
              idDocumentNumber: apiData.idDocumentNumber || '',
              notes: apiData.notes || ''
            });

            // 2. Xử lý địa chỉ (Reverse Parsing)
            const fullAddress = apiData.address || '';
            let detectedCityId = apiData.city || apiData.provinceId || '';
            let detectedWardId = apiData.ward || apiData.wardId || '';
            let detectedStreet = fullAddress;

            // Nếu backend chưa lưu ID, thử tách chuỗi
            if ((!detectedCityId || !detectedWardId) && fullAddress.includes(',')) {
              const parts = fullAddress.split(',').map(p => p.trim());
              
              if (parts.length >= 2) {
                // Lấy phần cuối làm Tỉnh
                const potentialCityName = parts[parts.length - 1];
                detectedCityId = findIdByName(potentialCityName, provincesData);

                if (detectedCityId) {
                  // Lấy phần áp chót làm Xã (trong list xã thuộc tỉnh đó)
                  const potentialWardName = parts[parts.length - 2];
                  const wardsOfProvince = wardsData.filter(w => String(w.province_id) === String(detectedCityId));
                  detectedWardId = findIdByName(potentialWardName, wardsOfProvince);

                  if (detectedWardId) {
                     // Phần còn lại là tên đường
                     const streetParts = parts.slice(0, parts.length - 2);
                     detectedStreet = streetParts.join(', ');
                  }
                }
              }
            } else if (detectedCityId && detectedWardId && fullAddress.includes(',')) {
               // Trường hợp backend CÓ lưu ID, ta chỉ cần cắt tên đường ra hiển thị cho đẹp
               // Giả sử format luôn là: "Street, Ward, City"
               const parts = fullAddress.split(',').map(p => p.trim());
               if(parts.length >= 3) {
                  const streetParts = parts.slice(0, parts.length - 2);
                  detectedStreet = streetParts.join(', ');
               }
            }

            // Set state địa chỉ
            setAddressParts({
              provinceId: detectedCityId,
              wardId: detectedWardId,
              street: detectedStreet
            });

          } else {
            notifications.error('Lỗi', 'Không tìm thấy dữ liệu khách hàng');
            navigate(`/${dealerId}/dealer/customers`);
          }
        } catch (error) {
          console.error('Error loading customer:', error);
          notifications.error('Lỗi tải dữ liệu', error.message);
        } finally {
          setIsDataLoading(false);
        }
      };
      loadCustomer();
    }
  }, [isEditMode, customerId, navigate, dealerId]);

  // Handle form change (cho các trường text cơ bản)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên quá ngắn';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập SĐT';
    else if (!/^[0-9]{10,11}$/.test(formData.phone)) newErrors.phone = 'SĐT không hợp lệ';
    
    // Validate địa chỉ theo parts
    if (!addressParts.provinceId) newErrors.city = 'Vui lòng chọn Tỉnh/Thành';
    if (!addressParts.wardId) newErrors.ward = 'Vui lòng chọn Xã/Phường';
    if (!addressParts.street.trim()) newErrors.street = 'Vui lòng nhập địa chỉ chi tiết';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      notifications.warning('Thiếu thông tin', 'Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);

    // Ghép địa chỉ
    const fullAddressString = getFullAddress();

    const payload = {
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      idDocumentNumber: formData.idDocumentNumber,
      
      // Quan trọng: Gửi chuỗi địa chỉ đầy đủ
      address: fullAddressString,
      
      // Gửi thêm ID để lần sau Edit dễ dàng hơn (nếu Backend hỗ trợ)
      city: addressParts.provinceId,
      ward: addressParts.wardId,
      
      notes: formData.notes
    };

    try {
      let response;
      if (isEditMode) {
        response = await dealerAPI.updateCustomer(customerId, payload);
      } else {
        response = await dealerAPI.createCustomer(payload);
      }

      const isSuccess = response?.success || (response?.id && !response?.error);
      if (isSuccess) {
        notifications.success('Thành công', isEditMode ? 'Đã cập nhật hồ sơ!' : 'Đã thêm khách hàng mới!');
        navigate(`/${dealerId}/dealer/customers`);
      } else {
        notifications.error('Lỗi', response?.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error('Error saving:', error);
      notifications.error('Lỗi hệ thống', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isDataLoading || isSubmitting;

  // Stats hiển thị
  const formStats = [
    {
      icon: isEditMode ? <Edit className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />,
      label: 'Chế độ',
      value: isEditMode ? 'Cập nhật' : 'Tạo mới',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
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
              {isEditMode ? <Edit className="w-10 h-10" /> : <UserPlus className="w-10 h-10" />}
              <span>{isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}</span>
            </div>
          }
          subtitle={isEditMode ? `ID: ${customerId}` : 'Nhập thông tin khách hàng mới vào hệ thống'}
          showBackButton
          onBack={() => navigate(`/${dealerId}/dealer/customers`)}
        />

        {/* Quick Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formStats.map((stat, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm flex items-center gap-4">
                <div className={stat.color}>{stat.icon}</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">{stat.label}</div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Thông tin liên hệ */}
              <InfoSection title="1. Thông tin cá nhân" icon={<UserPlus className="w-5 h-5" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                  <FormGroup className="mb-0">
                    <Label required>Họ và tên</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      disabled={isLoading}
                      error={errors.name}
                    />
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Label required>Số điện thoại</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      disabled={isLoading}
                      error={errors.phone}
                      icon={<Phone className="w-4 h-4 text-gray-400" />}
                    />
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Label>Số CCCD/CMND</Label>
                    <Input
                      name="idDocumentNumber"
                      value={formData.idDocumentNumber}
                      onChange={handleChange}
                      placeholder="0010xx..."
                      disabled={isLoading}
                      icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                    />
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      disabled={isLoading}
                      icon={<Mail className="w-4 h-4 text-gray-400" />}
                    />
                  </FormGroup>
                </div>
              </InfoSection>

              {/* 2. Địa chỉ liên hệ (Chuẩn theo CreateQuotation) */}
              <InfoSection title="2. Địa chỉ liên hệ" icon={<MapPin className="w-5 h-5" />}>
                <div className="space-y-4 p-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup className="mb-0">
                      <Label className="text-xs text-gray-500" required>Tỉnh / Thành phố</Label>
                      <Select
                        value={addressParts.provinceId}
                        onChange={(e) => setAddressParts(prev => ({ 
                          ...prev, 
                          provinceId: e.target.value, 
                          wardId: '' // Reset Ward
                        }))}
                        options={provincesData.map(p => ({ value: p.id, label: p.name }))}
                        placeholder="-- Chọn Tỉnh / Thành --"
                        disabled={isLoading}
                        error={errors.city}
                      />
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label className="text-xs text-gray-500" required>Phường / Xã / Thị trấn</Label>
                      <Select
                        value={addressParts.wardId}
                        onChange={(e) => setAddressParts(prev => ({ ...prev, wardId: e.target.value }))}
                        options={filteredWards.map(w => ({ value: w.id, label: w.name }))}
                        placeholder={addressParts.provinceId ? "-- Chọn Phường / Xã --" : "-- Chọn Tỉnh trước --"}
                        disabled={!addressParts.provinceId || isLoading}
                        error={errors.ward}
                      />
                    </FormGroup>
                  </div>

                  <FormGroup className="mb-0">
                    <Label className="text-xs text-gray-500" required>Số nhà, tên đường</Label>
                    <Input
                      value={addressParts.street}
                      onChange={(e) => setAddressParts(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Ví dụ: Số 10, Đường Nguyễn Huệ..."
                      disabled={isLoading}
                      error={errors.street}
                    />
                  </FormGroup>

                  {/* Preview Địa chỉ */}
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    Địa chỉ sẽ lưu: <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {getFullAddress() || '... (Vui lòng điền đủ thông tin)'}
                    </span>
                  </div>
                </div>
              </InfoSection>
            </div>

            {/* CỘT PHẢI: GHI CHÚ */}
            <div className="lg:col-span-1">
              <InfoSection title="3. Ghi chú bổ sung" icon={<FileText className="w-5 h-5" />}>
                <FormGroup className="mb-0">
                  <Label className="sr-only">Ghi chú</Label>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={12}
                    placeholder="Ghi chú thêm về khách hàng (nhu cầu, sở thích, thời gian rảnh...)"
                    disabled={isLoading}
                  />
                </FormGroup>
              </InfoSection>
            </div>

          </div>

          {/* ACTION BAR */}
          <ActionBar align="right">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/${dealerId}/dealer/customers`)}
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
                ? (isEditMode ? 'Đang cập nhật...' : 'Đang lưu...')
                : (isEditMode ? 'Lưu thay đổi' : 'Tạo khách hàng')
              }
            </Button>
          </ActionBar>
        </form>
      </PageContainer>
    </div>
  );
};

export default CustomerForm;