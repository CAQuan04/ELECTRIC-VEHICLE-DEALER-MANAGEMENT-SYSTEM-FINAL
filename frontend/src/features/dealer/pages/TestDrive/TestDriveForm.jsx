import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { AuthService } from '@utils';
import { notifications } from '@utils/notifications';
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
  ActionBar,
  Card
} from '../../components';
import { Calendar, User, Car, FileText } from 'lucide-react';

const TestDriveForm = () => {
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleId: '',
    vehicleName: '',
    scheduleDatetime: '',
    date: '',
    time: '',
    duration: '60',
    notes: ''
  });

  useEffect(() => {
    loadPrerequisites();
  }, []);

  useEffect(() => {
    if (formData.vehicleId && formData.date) {
      checkAvailability();
    }
  }, [formData.vehicleId, formData.date]);

  const loadPrerequisites = async () => {
    setIsDataLoading(true);
    try {
      console.log('🔄 Starting to load customers and vehicles...');
      
      const [customerResult, vehicleResult] = await Promise.all([
        dealerAPI.getCustomers({ Page: 1, Size: 100 }),
        dealerAPI.getVehicles({ Page: 1, Size: 100 })
      ]);
      
      // Debug: Log full response structure
      console.log('📦 Customer Result:', JSON.stringify(customerResult, null, 2));
      console.log('📦 Vehicle Result:', JSON.stringify(vehicleResult, null, 2));
      
      // Handle customers with proper error checking
      if (customerResult && customerResult.success && customerResult.data) {
        // Backend returns PagedResult: { items: [], pagination: {} }
        const customerList = customerResult.data.items || [];
        console.log('👥 Customer List length:', customerList.length);
        console.log('👥 First customer:', customerList[0]);
        setCustomers(customerList);
      } else {
        const errorMsg = customerResult?.message || 'Không thể tải danh sách khách hàng';
        console.error('❌ Customer load failed. Result structure:', customerResult);
        console.warn('⚠️ Failed to load customers:', errorMsg);
        notifications.error('Lỗi', errorMsg);
      }
      
      // Handle vehicles with proper error checking
      if (vehicleResult && vehicleResult.success && vehicleResult.data) {
        // Backend returns PagedResult: { items: [], pagination: {} }
        const vehicleList = vehicleResult.data.items || [];
        console.log('🚙 Vehicle List length:', vehicleList.length);
        console.log('🚙 First vehicle:', vehicleList[0]);
        setVehicles(vehicleList);
      } else {
        const errorMsg = vehicleResult?.message || 'Không thể tải danh sách xe';
        console.error('❌ Vehicle load failed. Result structure:', vehicleResult);
        console.warn('⚠️ Failed to load vehicles:', errorMsg);
        notifications.error('Lỗi', errorMsg);
      }

    } catch (error) {
      console.error('❌ Error loading prerequisites:', error);
      notifications.error('Lỗi tải dữ liệu', 'Không thể tải dữ liệu');
    } finally {
      setIsDataLoading(false);
    }
  };

  const checkAvailability = async () => {
    setIsCheckingAvailability(true);
    setHasCheckedAvailability(false);
    try {
      console.log('🔍 Checking availability for:', { vehicleId: formData.vehicleId, date: formData.date });
      const result = await dealerAPI.checkTestDriveAvailability(
        formData.vehicleId,
        formData.date
      );
      
      console.log('✅ Availability result:', result);
      if (result.success && result.data) {
        const slots = result.data.availableSlots || [];
        console.log('📅 Available slots:', slots);
        setAvailableSlots(slots);
        setHasCheckedAvailability(true);
      } else {
        console.log('⚠️ No data in result');
        setAvailableSlots([]);
        setHasCheckedAvailability(true);
      }
    } catch (error) {
      console.error('❌ Error checking availability:', error);
      setAvailableSlots([]);
      setHasCheckedAvailability(true);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset availability when date changes
    if (name === 'date') {
      setHasCheckedAvailability(false);
      setAvailableSlots([]);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e) => {
    const customerId = parseInt(e.target.value);
    const selected = customers.find(c => c.customerId === customerId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        customerId: selected.customerId,
        customerName: selected.fullName || selected.name,
        customerPhone: selected.phone,
        customerEmail: selected.email || '',
      }));
    }
  };

  const handleVehicleChange = (e) => {
    const vehicleId = parseInt(e.target.value);
    const selected = vehicles.find(v => v.vehicleId === vehicleId);
    console.log('🚗 Selected vehicle:', selected);
    
    // Reset availability when vehicle changes
    setHasCheckedAvailability(false);
    setAvailableSlots([]);
    
    if (selected) {
      setFormData(prev => ({
        ...prev,
        vehicleId: selected.vehicleId,
        vehicleName: selected.model || selected.name,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleId,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = 'Vui lòng nhập tên khách hàng.';
    if (!formData.customerPhone) newErrors.customerPhone = 'Vui lòng nhập số điện thoại.';
    if (!formData.vehicleId) newErrors.vehicleId = 'Vui lòng chọn xe.';
    if (!formData.date) newErrors.date = 'Vui lòng chọn ngày.';
    if (!formData.time) newErrors.time = 'Vui lòng chọn giờ.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const dealerId = currentUser?.dealerId;
      
      if (!dealerId) {
        notifications.error('Lỗi', 'Không tìm thấy thông tin đại lý');
        setIsSubmitting(false);
        return;
      }
      
      const scheduleDatetime = `${formData.date}T${formData.time}:00`;
      
      const testDriveData = {
        customerId: parseInt(formData.customerId),
        vehicleId: parseInt(formData.vehicleId),
        dealerId: parseInt(dealerId),
        scheduleDatetime,
        status: 'Pending'
      };

      const result = await dealerAPI.createTestDrive(testDriveData);
      if (result.success) {
        notifications.success('Thành công', 'Đăng ký lái thử thành công! Thông báo xác nhận đã được gửi đến khách hàng.');
        navigate(`/${dealerId}/dealer/test-drives`);
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error creating test drive:', error);
      notifications.error('Lỗi đăng ký lái thử', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerOptions = customers.map(c => ({
    label: `${c.fullName || c.name} - ${c.phone}`,
    value: c.customerId
  }));

  const vehicleOptions = vehicles.map(v => ({
    label: `${v.model || v.name} - ${v.brand || ''} ${v.color || ''}`.trim(),
    value: v.vehicleId
  }));

  const durationOptions = [
    { value: '30', label: '30 phút' },
    { value: '60', label: '1 giờ' },
    { value: '90', label: '1.5 giờ' },
    { value: '120', label: '2 giờ' }
  ];

  const isLoading = isDataLoading || isSubmitting;

  return (
    <PageContainer>
      <PageHeader
        title="Đăng ký lái thử mới"
        subtitle="Đặt lịch hẹn lái thử xe điện cho khách hàng"
        icon={<FileText className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/test-drives')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <InfoSection 
              title="1. Thông tin khách hàng" 
              icon={<User className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="customer-search">Tìm khách hàng (Nếu có)</Label>
                  <Select
                    id="customer-search"
                    value={formData.customerId}
                    options={customerOptions}
                    onChange={handleCustomerChange}
                    placeholder={isDataLoading ? "\u0110ang t\u1ea3i kh\u00e1ch..." : "-- Ch\u1ecdn kh\u00e1ch h\u00e0ng c\u00f3 s\u1eb5n --"}
                    disabled={isLoading}
                  />
                </FormGroup>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="customerName" required>Tên khách hàng</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      error={errors.customerName}
                      disabled={isLoading}
                      placeholder="Nguyễn Văn A"
                    />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label htmlFor="customerPhone" required>Số điện thoại</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      error={errors.customerPhone}
                      disabled={isLoading}
                      placeholder="0901234567"
                    />
                  </FormGroup>
                </div>
                
                <FormGroup className="mb-0">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="email@example.com"
                  />
                </FormGroup>
              </div>
            </InfoSection>

            <InfoSection 
              title="2. Thông tin xe" 
              icon={<Car className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="vehicleId" required>Chọn xe</Label>
                  <Select
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    options={vehicleOptions}
                    onChange={handleVehicleChange}
                    placeholder={isDataLoading ? "\u0110ang t\u1ea3i xe..." : "-- Ch\u1ecdn xe --"}
                    error={errors.vehicleId}
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>

            <InfoSection 
              title="3. Ghi chú" 
              icon={<FileText className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <FormGroup className="mb-0">
                <Label htmlFor="notes">Ghi chú đặc biệt</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Yêu cầu đặc biệt hoặc ghi chú..."
                  disabled={isLoading}
                />
              </FormGroup>
            </InfoSection>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <InfoSection 
              title="4. Lịch hẹn" 
              icon={<Calendar className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="date" required>Ngày</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </FormGroup>
                
                <FormGroup className="mb-0">
                  <Label htmlFor="time" required>Giờ</Label>
                  {isCheckingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin text-2xl mb-2">⚙️</div>
                      <p className="text-sm text-gray-500">Đang kiểm tra khả dụng...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <Select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      error={errors.time}
                      disabled={isLoading}
                      options={availableSlots.map(slot => ({
                        value: slot,
                        label: slot
                      }))}
                      placeholder="-- Chọn giờ --"
                    />
                  ) : hasCheckedAvailability && formData.vehicleId && formData.date ? (
                    <div className="text-center py-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        ⚠️ Không có khung giờ trống cho ngày này
                      </p>
                    </div>
                  ) : (
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      error={errors.time}
                      disabled={isLoading}
                    />
                  )}
                </FormGroup>
                
                <FormGroup className="mb-0">
                  <Label htmlFor="duration">Thời lượng</Label>
                  <Select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    options={durationOptions}
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>

            {formData.vehicleId && formData.date && formData.time && (
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/20 dark:to-emerald-600/10 border-2 border-emerald-300 dark:border-emerald-500">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  📋 Tóm tắt
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Khách hàng:</span>
                    <span className="font-bold">{formData.customerName || 'Chưa nhập'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Xe:</span>
                    <span className="font-bold">{formData.vehicleName || 'Chưa chọn'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày:</span>
                    <span className="font-bold">
                      {formData.date ? new Date(formData.date).toLocaleDateString('vi-VN') : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Giờ:</span>
                    <span className="font-bold">{formData.time || 'Chưa chọn'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thời lượng:</span>
                    <span className="font-bold">{formData.duration} phút</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <ActionBar align="right" className="mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/test-drives')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký lái thử'}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default TestDriveForm;