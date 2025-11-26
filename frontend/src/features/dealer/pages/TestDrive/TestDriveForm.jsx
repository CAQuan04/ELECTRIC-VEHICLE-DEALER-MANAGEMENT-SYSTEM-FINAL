import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { AuthService } from '@utils';
import { notifications } from '@utils/notifications';
import { useAuth } from '@/context/AuthContext';
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
import { Calendar, User, Car, FileText, Clock, ChevronDown, X } from 'lucide-react';

// --- CUSTOM TIME PICKER COMPONENT ---
const CustomTimePicker = ({ value, onChange, disabled, availableSlots = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Chuyển đổi 24h (14:30) -> 12h (02, 30, PM)
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '08', minute: '00', period: 'AM' };
    const [h, m] = timeStr.split(':');
    let hourInt = parseInt(h, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';

    if (hourInt > 12) hourInt -= 12;
    if (hourInt === 0) hourInt = 12;

    return {
      hour: hourInt.toString().padStart(2, '0'),
      minute: m,
      period
    };
  };

  const [selection, setSelection] = useState(parseTime(value));

  useEffect(() => {
    if (value) setSelection(parseTime(value));
  }, [value]);

  // Xử lý click outside để đóng popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type, val) => {
    const newSelection = { ...selection, [type]: val };
    setSelection(newSelection);

    // Convert ngược lại 12h -> 24h để trả về form
    let h = parseInt(newSelection.hour, 10);
    if (newSelection.period === 'PM' && h !== 12) h += 12;
    if (newSelection.period === 'AM' && h === 12) h = 0;

    const timeString = `${h.toString().padStart(2, '0')}:${newSelection.minute}`;
    onChange({ target: { name: 'time', value: timeString } });
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // Hoặc step 5, 10, 15, 30 tùy nhu cầu

  // Kiểm tra xem giờ hiện tại có nằm trong danh sách availableSlots không
  const isAvailable = availableSlots.length === 0 || availableSlots.includes(value);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 rounded-xl border dark:bg-slate-800 
          flex items-center justify-between cursor-pointer transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-blue-500'}
          ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
          ${!isAvailable && value ? 'border-orange-300 ring-orange-500/20 text-orange-600' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <span className={`text-2xl font-medium ${value ? 'dark:text-white' : 'text-gray-500'}`}>
            {value ? `${selection.hour}:${selection.minute} ${selection.period}` : '-- : -- --'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Picker */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex h-48 gap-1">
            {/* Hours Column */}
            <div className="flex-1 flex flex-col overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-rose-200 dark:scrollbar-thumb-rose-700">
              {hours.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleSelect('hour', h)}
                  className={`
                    py-2 px-1 text-center text-lg font-medium rounded-lg transition-colors
                    ${selection.hour === h
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px dark:bg-gray-700 my-2"></div>

            {/* Minutes Column */}
            <div className="flex-1 flex flex-col overflow-hidden hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              {minutes.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelect('minute', m)}
                  className={`
                    py-2 px-1 text-center text-sm font-medium rounded-lg transition-colors
                    ${selection.minute === m
                      ? 'bg-indigo-400 text-white shadow-md'
                      : 'dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-700'}
                  `}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px bg-gray-100 dark:bg-gray-700 my-2"></div>

            {/* Period Column */}
            <div className="w-16 flex flex-col gap-1">
              {['AM', 'PM'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelect('period', p)}
                  className={`
                    flex-1 flex items-center justify-center text-xs font-bold rounded-lg transition-colors
                    ${selection.period === p
                      ? 'dark:bg-rose-500 text-white shadow-md'
                      : 'dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t dark:border-gray-700 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-rose-600 font-medium hover:text-white px-3 py-2"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
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
  const { user } = useAuth();
  const dealerId = user?.dealerId;
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
        dealerAPI.getCustomers({ Page: 1, Size: 100 }),
        dealerAPI.getVehicles({ Page: 1, Size: 100 })
      ]);

      if (customerResult?.success) setCustomers(customerResult.data.items || []);
      if (vehicleResult?.success) setVehicles(vehicleResult.data.items || []);

    } catch (error) {
      console.error('❌ Error loading prerequisites:', error);
      notifications.error('Lỗi tải dữ liệu', 'Không thể tải dữ liệu danh mục');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Hàm check Availability cập nhật
  const checkAvailability = async () => {
    // Reset state trước khi check
    setIsCheckingAvailability(true);
    setAvailableSlots([]);
    setHasCheckedAvailability(false); // Reset cờ đã check

    try {
      const result = await dealerAPI.checkTestDriveAvailability({
        vehicleId: parseInt(formData.vehicleId),
        date: formData.date
      });

      if (result?.success) {
        const slots = result.data.slots || [];
        setAvailableSlots(slots);
        setHasCheckedAvailability(true); // Đánh dấu là đã check xong

        // Case 1: Đã kín lịch (slots rỗng)
        if (slots.length === 0) {
          notifications.warning('Thông báo', 'Ngày này đã kín lịch lái thử, vui lòng chọn ngày khác!');
          // Optional: Clear giờ đang chọn nếu có
          setFormData(prev => ({ ...prev, time: '' }));
        }
        // Case 2: Giờ đang chọn không còn hợp lệ
        else if (formData.time && !slots.includes(formData.time)) {
          notifications.warning('Thay đổi lịch', 'Khung giờ bạn chọn đã bị trùng, vui lòng chọn lại theo gợi ý.');
          setFormData(prev => ({ ...prev, time: '' }));
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date') {
      setHasCheckedAvailability(false);
      setAvailableSlots([]);
      setFormData(prev => ({ ...prev, [name]: value, time: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

    setHasCheckedAvailability(false);
    setAvailableSlots([]);

    if (selected) {
      setFormData(prev => ({
        ...prev,
        vehicleId: selected.vehicleId,
        vehicleName: selected.model || selected.name,
        time: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, vehicleId: vehicleId, time: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = 'Vui lòng nhập tên khách hàng.';
    // ... các validate cũ giữ nguyên ...

    // --> THÊM MỚI: Validate logic trùng lịch
    if (hasCheckedAvailability && availableSlots.length === 0) {
      newErrors.date = 'Ngày này đã kín lịch, không thể đăng ký.';
    } else if (hasCheckedAvailability && availableSlots.length > 0 && formData.time) {
      // Kiểm tra xem giờ nhập tay có nằm trong list server cho phép không
      if (!availableSlots.includes(formData.time)) {
        newErrors.time = 'Khung giờ này đã có người đặt hoặc không hợp lệ.';
      }
    }

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

      const localDateTimeString = `${formData.date}T${formData.time}:00`;
      const dateObj = new Date(localDateTimeString);
      const isoSchedule = dateObj.toISOString();
      const testDriveData = {
        customerId: parseInt(formData.customerId), // Đảm bảo là số nguyên
        vehicleId: parseInt(formData.vehicleId),   // Đảm bảo là số nguyên
        dealerId: parseInt(dealerId),              // Đảm bảo là số nguyên
        scheduleDatetime: isoSchedule,             // Format: "2025-11-26T07:58:16.166Z"
        status: 'pending',                         // Trạng thái mặc định
      };
      console.log('📤 Payload gửi đi:', testDriveData);
      const result = await dealerAPI.createTestDrive(testDriveData);
      if (result.success) {
        notifications.success('Thành công', 'Đăng ký lái thử thành công!');
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

  // UI Helpers
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
        onBack={() => navigate(`/${dealerId}/dealer/test-drives`)}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <InfoSection
              title="1. Thông tin khách hàng"
              icon={<User className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label>Tìm khách hàng (Nếu có)</Label>
                  <Select
                    value={formData.customerId}
                    options={customerOptions}
                    onChange={handleCustomerChange}
                    placeholder={isDataLoading ? "Đang tải..." : "-- Chọn khách hàng có sẵn --"}
                    disabled={isLoading}
                  />
                </FormGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup className="mb-0">
                    <Label required>Tên khách hàng</Label>
                    <Input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      error={errors.customerName}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label required>Số điện thoại</Label>
                    <Input
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      error={errors.customerPhone}
                      disabled={isLoading}
                    />
                  </FormGroup>
                </div>
                <FormGroup className="mb-0">
                  <Label>Email</Label>
                  <Input
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>

            {/* Vehicle */}
            <InfoSection
              title="2. Thông tin xe"
              icon={<Car className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <FormGroup className="mb-0">
                <Label required>Chọn xe</Label>
                <Select
                  name="vehicleId"
                  value={formData.vehicleId}
                  options={vehicleOptions}
                  onChange={handleVehicleChange}
                  placeholder={isDataLoading ? "Đang tải..." : "-- Chọn xe --"}
                  error={errors.vehicleId}
                  disabled={isLoading}
                />
              </FormGroup>
            </InfoSection>

            {/* Notes */}
            <InfoSection
              title="3. Ghi chú"
              icon={<FileText className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <FormGroup className="mb-0">
                <Label>Ghi chú đặc biệt</Label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  disabled={isLoading}
                />
              </FormGroup>
            </InfoSection>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Schedule */}
            <InfoSection
              title="4. Lịch hẹn"
              icon={<Calendar className="w-5 h-5" />}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label required>Ngày</Label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </FormGroup>

                {/* ✨ REPLACED: Dropdown -> CustomTimePicker
                  
                  Nếu có availableSlots, sẽ hiển thị gợi ý hoặc cảnh báo nếu chọn giờ khác.
                */}
                <FormGroup className="mb-0">
                  <Label required>Giờ hẹn</Label>
                  {isCheckingAvailability ? (
                    <div className="text-center py-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-dashed">
                      <div className="animate-spin text-2xl mb-2 text-blue-600">⚙️</div>
                      <p className="text-sm text-gray-500">Đang kiểm tra lịch trống...</p>
                    </div>
                  ) : (
                    <>
                      <CustomTimePicker
                        value={formData.time}
                        onChange={handleChange}
                        // Disable luôn nếu đã check mà không có slot nào
                        disabled={isLoading || !formData.date || (hasCheckedAvailability && availableSlots.length === 0)}
                        availableSlots={availableSlots}
                      />

                      {/* CASE 1: CÓ SLOT TRỐNG --> HIỆN GỢI Ý (Code cũ) */}
                      {availableSlots.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600 animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                              ✅ Khung giờ khả dụng (Đã tính thời gian chờ 10p):
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                            {availableSlots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, time: slot }));
                                  setErrors(prev => ({ ...prev, time: null }));
                                }}
                                className={`
                  px-3 py-1.5 text-sm rounded-md border transition-all duration-200
                  ${formData.time === slot
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:text-blue-500'}
                `}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CASE 2: KÍN LỊCH (SLOT RỖNG) --> HIỆN CẢNH BÁO ĐỎ (Thêm mới) */}
                      {hasCheckedAvailability && availableSlots.length === 0 && (
                        <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <div className="text-red-500 mt-0.5">🚫</div>
                          <div>
                            <h4 className="text-sm font-bold text-red-800 dark:text-red-300">Đã kín lịch</h4>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Ngày {new Date(formData.date).toLocaleDateString('vi-VN')} không còn khung giờ trống cho xe này.
                              Vui lòng chọn ngày khác.
                            </p>
                          </div>
                        </div>
                      )}

                      {errors.time && <p className="mt-1 text-sm text-red-500 font-medium">⚠️ {errors.time}</p>}
                    </>
                  )}
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label>Thời lượng</Label>
                  <Select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    options={durationOptions}
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>

            {/* Summary */}
            {formData.vehicleId && formData.date && formData.time && (
              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-300">
                <h3 className="text-xl font-bold mb-4 text-rose-900">📋 Tóm tắt</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white-600">Khách hàng:</span>
                    <span className="font-bold text-xl">{formData.customerName || '---'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white-600">Xe:</span>
                    <span className="font-bold text-lg text-cyan-200">{formData.vehicleName || '---'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white-600">Thời gian:</span>
                    <span className="font-bold text-lg text-white-600">
                      {formData.time} - {new Date(formData.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <ActionBar align="right" className="mt-8 mb-12">
          <Button variant="ghost" onClick={() => navigate('/dealer/test-drives')} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient" disabled={isLoading}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận lịch hẹn'}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default TestDriveForm;