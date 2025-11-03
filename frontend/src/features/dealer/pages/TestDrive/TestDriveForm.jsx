import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
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
import { Calendar } from 'lucide-react';

const TestDriveForm = () => {
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
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
      const [customerResult, vehicleResult] = await Promise.all([
        dealerAPI.getCustomers(),
        dealerAPI.getVehicles({ available: true })
      ]);

      if (customerResult.success && customerResult.data) {
        const customerList = Array.isArray(customerResult.data) ? customerResult.data : customerResult.data.data || [];
        setCustomers(customerList);
      }
      
      if (vehicleResult.success && vehicleResult.data) {
        const vehicleList = Array.isArray(vehicleResult.data) ? vehicleResult.data : vehicleResult.data.data || [];
        setVehicles(vehicleList);
      }

    } catch (error) {
      console.error('Error loading prerequisites:', error);
      alert('Lỗi: không thể tải dữ liệu');
    } finally {
      setIsDataLoading(false);
    }
  };

  const checkAvailability = async () => {
    setIsCheckingAvailability(true);
    try {
      const result = await dealerAPI.checkTestDriveAvailability(
        formData.vehicleId,
        formData.date
      );
      
      if (result.success && result.data) {
        setAvailableSlots(result.data.availableSlots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableSlots([]);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const selected = customers.find(c => c.id === customerId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        customerId: selected.id,
        customerName: selected.name,
        customerPhone: selected.phone,
        customerEmail: selected.email,
      }));
    }
  };

  const handleVehicleChange = (vehicleId) => {
    const selected = vehicles.find(v => v.id === vehicleId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        vehicleId: selected.id,
        vehicleName: selected.model || selected.name,
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
      const scheduleDatetime = `${formData.date}T${formData.time}:00`;
      
      const testDriveData = {
        customerId: formData.customerId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        vehicleId: formData.vehicleId,
        scheduleDatetime,
        duration: parseInt(formData.duration),
        notes: formData.notes
      };

      const result = await dealerAPI.createTestDrive(testDriveData);
      if (result.success) {
        alert('Đăng ký lái thử thành công! Thông báo xác nhận đã được gửi đến khách hàng.');
        navigate('/dealer/test-drives');
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error creating test drive:', error);
      alert('Có lỗi xảy ra khi đăng ký lái thử: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerOptions = customers.map(c => ({
    label: `${c.name} - ${c.phone}`,
    value: c.id
  }));

  const vehicleOptions = vehicles.map(v => ({
    label: `${v.model || v.name} - ${v.color || ''}`,
    value: v.id
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
        title="📝 Đăng ký lái thử mới"
        subtitle="Đặt lịch hẹn lái thử xe điện cho khách hàng"
        icon={<Calendar className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/test-drives')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <InfoSection 
              title="1. Thông tin khách hàng" 
              icon="👤"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="customer-search">Tìm khách hàng (Nếu có)</Label>
                  <Select
                    id="customer-search"
                    options={customerOptions}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    placeholder={isDataLoading ? "Đang tải khách..." : "-- Chọn khách hàng có sẵn --"}
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
              icon="🚗"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="vehicleId" required>Chọn xe</Label>
                  <Select
                    id="vehicleId"
                    name="vehicleId"
                    options={vehicleOptions}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    placeholder={isDataLoading ? "Đang tải xe..." : "-- Chọn xe --"}
                    error={errors.vehicleId}
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>

            <InfoSection 
              title="3. Ghi chú" 
              icon="📝"
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
              icon="📅"
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
                  ) : formData.vehicleId && formData.date ? (
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