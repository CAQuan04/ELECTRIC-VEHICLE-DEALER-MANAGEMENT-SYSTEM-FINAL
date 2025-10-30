import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';

// Import các UI Component chuẩn
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
  Card,
  InfoRow
} from '../../components';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ShoppingCart, ChevronDown, Printer } from 'lucide-react';
import QuotationDocument from './QuotationDocument';
// --- DỮ LIỆU CẤU HÌNH (Nên lấy từ API nếu có) ---

// Các tùy chọn xe
const mockInventory = [
  { id: 'veh1', model: 'Model Y', color: 'Trắng', available: 5, price: 1500000000 },
  { id: 'veh2', model: 'Model 3', color: 'Đen', available: 2, price: 1200000000 }
];
const availableOptions = [
  { id: 1, name: 'Màu đặc biệt', price: 50000000 },
  { id: 2, name: 'Nội thất cao cấp', price: 100000000 },
  { id: 3, name: 'Autopilot nâng cao', price: 150000000 },
  { id: 4, name: 'Gói sạc tại nhà', price: 25000000 }
];

// Các dịch vụ bổ sung
const servicePrices = {
  registration: { 'tự đăng ký': 0, 'trọn gói': 20000000 },
  interiorTrim: { 'gỗ tiêu chuẩn': 0, 'nhôm': 60000000, 'carbon': 75000000 },
  extendedWarranty: { 'không': 0, '1 năm': 30000000, '3 năm': 80000000 }
};

const registrationOptions = [
  { value: 'tự đăng ký', label: 'Tự đăng ký' },
  { value: 'trọn gói', label: 'Dịch vụ trọn gói (Đã bao gồm phí)' }
];

const interiorTrimOptions = [
  { value: 'gỗ tiêu chuẩn', label: 'Gỗ tiêu chuẩn (Mặc định)' },
  { value: 'nhôm', label: 'Ốp nhôm (60 triệu)' },
  { value: 'carbon', label: 'Ốp Carbon (75 triệu)' }
];

const warrantyOptions = [
  { value: 'không', label: 'Không' },
  { value: '1 năm', label: 'Bảo hành mở rộng 1 năm (30 triệu)' },
  { value: '3 năm', label: 'Bảo hành mở rộng 3 năm (80 triệu)' }
];
const batteryPolicyOptions = [
  { value: 'thuê pin', label: 'Thuê pin (Đã trừ 200 triệu vào giá xe)' },
  { value: 'mua pin', label: 'Mua pin (Bao gồm giá pin)' }
];
// ------------------------------------------------

const CreateOrder = () => {
  const navigate = useNavigate();

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleId: '',
    basePrice: 0,
    discount: 0,
    voucherCode: '',
    voucherDiscount: 0,
    paymentMethod: 'financing', // Giữ lại (Điều kiện thanh toán)
    validUntil: new Date().toISOString().split('T')[0], // THÊM: Ngày hết hạn
    batteryPolicy: 'thuê pin', // THÊM: Chính sách pin
    notes: ''
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  // --- THÊM STATE DỊCH VỤ ---
  const [selectedServices, setSelectedServices] = useState({
    registration: 'tự đăng ký',
    interiorTrim: 'gỗ tiêu chuẩn',
    extendedWarranty: 'không'
  });
  //-----------------------
  const [isCustomerSectionOpen, setIsCustomerSectionOpen] = useState(true);
  const [isVehicleSectionOpen, setIsVehicleSectionOpen] = useState(true);
  // Tải dữ liệu (Khách hàng & Xe trong kho)
  useEffect(() => {
    const loadPrerequisites = async () => {
      setIsDataLoading(true);
      try {
        const [customerResult, inventoryResult] = await Promise.all([
          dealerAPI.getCustomers(),
          dealerAPI.getInventory()
        ]);

        if (customerResult.success && customerResult.data) {
          const customerList = Array.isArray(customerResult.data) ? customerResult.data : customerResult.data.data || [];
          setCustomers(customerList);
        }

        if (inventoryResult.success && inventoryResult.data) {
          const inventoryList = Array.isArray(inventoryResult.data) ? inventoryResult.data : inventoryResult.data.data || [];
          setInventory(inventoryList.filter(v => v.available > 0));
        }

      } catch (error) {
        console.error('Error loading prerequisites:', error);
        alert('Lỗi: không thể tải dữ liệu khách hàng hoặc kho xe.');
      } finally {
        setIsDataLoading(false);
      }
    };

    loadPrerequisites();
  }, []);

  // Xử lý logic nghiệp vụ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- THÊM HÀM XỬ LÝ DỊCH VỤ ---
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setSelectedServices(prev => ({ ...prev, [name]: value }));
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
    const selected = inventory.find(v => v.id === vehicleId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        vehicleId: selected.id,
        basePrice: selected.price || 0,
      }));
    }
  };

  const toggleOption = (option) => {
    if (selectedOptions.find(o => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(o => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // --- THÊM HÀM ÁP DỤNG VOUCHER (MOCK) ---
  const handleApplyVoucher = () => {
    if (formData.voucherCode.toUpperCase() === 'SALE50') {
      alert('Áp dụng voucher thành công! Giảm 50 triệu.');
      setFormData(prev => ({ ...prev, voucherDiscount: 50000000 }));
    } else {
      alert('Mã voucher không hợp lệ.');
      setFormData(prev => ({ ...prev, voucherDiscount: 0 }));
    }
  };

  // --- CẬP NHẬT HÀM TÍNH TOÁN CHI TIẾT ---
  const priceBreakdown = useMemo(() => {
    const basePrice = parseInt(formData.basePrice) || 0;
    const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);

    const serviceRegistrationCost = servicePrices.registration[selectedServices.registration] || 0;
    const serviceInteriorCost = servicePrices.interiorTrim[selectedServices.interiorTrim] || 0;
    const serviceWarrantyCost = servicePrices.extendedWarranty[selectedServices.extendedWarranty] || 0;
    const servicesTotal = serviceRegistrationCost + serviceInteriorCost + serviceWarrantyCost;

    const subtotal = basePrice + optionsTotal + servicesTotal;

    const manualDiscount = parseInt(formData.discount) || 0;
    const voucherDiscount = parseInt(formData.voucherDiscount) || 0;
    const totalDiscount = manualDiscount + voucherDiscount;

    const taxableAmount = subtotal - totalDiscount;

    // Tính thuế
    const vat = taxableAmount * 0.10; // 10% VAT (Giả định)
    const registrationFee = taxableAmount * 0.10; // 10% Phí trước bạ (Giả định)

    const total = taxableAmount + vat + registrationFee;

    return {
      basePrice,
      optionsTotal,
      servicesTotal,
      subtotal,
      totalDiscount,
      taxableAmount,
      vat,
      registrationFee,
      total
    };
  }, [formData, selectedOptions, selectedServices]);
  // ---------------------------------------

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = 'Vui lòng nhập tên khách hàng.';
    if (!formData.customerPhone) newErrors.customerPhone = 'Vui lòng nhập SĐT khách hàng.';
    if (!formData.vehicleId) newErrors.vehicleId = 'Vui lòng chọn xe từ kho.';
    if (!formData.validUntil) newErrors.validUntil = 'Vui lòng chọn ngày hiệu lực cho báo giá.';
    if (!formData.batteryPolicy) newErrors.batteryPolicy = 'Vui lòng chọn chính sách pin.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // --- CẬP NHẬT DỮ LIỆU GỬI ĐI ---
      const orderData = {
        ...formData,
        additionalOptions: selectedOptions,
        additionalServices: selectedServices,
        priceBreakdown: priceBreakdown // Gửi toàn bộ cấu trúc giá
      };

      const result = await dealerAPI.createQuotation(quotationData);
      // -----------------------------

      if (result.success) {
        alert('Tạo báo giá thành công!');
        navigate('/dealer/quotations');
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Có lỗi xảy ra khi tạo báo giá: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerOptions = customers.map(c => ({
    label: `${c.name} - ${c.phone}`,
    value: c.id
  }));

  const vehicleOptions = inventory.map(v => ({
    label: `${v.model} - ${v.color} (SL: ${v.available})`,
    value: v.id
  }));

  const paymentOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'financing', label: 'Trả góp' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
  ];

  const isLoading = isDataLoading || isSubmitting;

  // Helper định dạng tiền
  const formatCurrency = (amount) => {
    return `${(amount / 1000000).toLocaleString('vi-VN')} triệu`;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tạo đơn báo giá mới"
        subtitle="Tạo đơn báo giá xe cho khách hàng từ kho có sẵn"
        icon={<ShoppingCart className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/orders')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CỘT TRÁI (COL-SPAN-2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* SỬA 1: Dùng InfoSection cho mục 1 */}
            <InfoSection
              title="1. Thông tin khách hàng"
              icon="👤"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              // Thêm props để điều khiển ẩn/hiện
              isCollapsible={true}
              isOpen={isCustomerSectionOpen}
              onToggle={() => setIsCustomerSectionOpen(!isCustomerSectionOpen)}
            >
              {/* Nội dung chỉ render khi mở */}
              {isCustomerSectionOpen && (
                <div className="space-y-4 mt-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="customer-search" className="dark:text-gray-300">Tìm khách hàng (Nếu có)</Label>
                    <Select
                      id="customer-search"
                      options={customerOptions}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      placeholder={isDataLoading ? "Đang tải khách..." : "-- Chọn khách hàng có sẵn --"}
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup className="mb-0">
                      <Label htmlFor="customerName" required className="dark:text-gray-300">Tên khách hàng</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        error={errors.customerName}
                        disabled={isLoading}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                      />
                    </FormGroup>
                    <FormGroup className="mb-0">
                      <Label htmlFor="customerPhone" required className="dark:text-gray-300">Số điện thoại</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        error={errors.customerPhone}
                        disabled={isLoading}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                      />
                    </FormGroup>
                  </div>
                  <FormGroup className="mb-0">
                    <Label htmlFor="customerEmail" className="dark:text-gray-300">Email</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    />
                  </FormGroup>
                </div>
              )}
            </InfoSection>

            {/* SỬA 2: Dùng InfoSection cho mục 2 */}
            <InfoSection
              title="2. Thông tin xe"
              icon="🚗"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              // Thêm props để điều khiển ẩn/hiện
              isCollapsible={true}
              isOpen={isVehicleSectionOpen}
              onToggle={() => setIsVehicleSectionOpen(!isVehicleSectionOpen)}
            >
              {isVehicleSectionOpen && (
                <div className="space-y-4 mt-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="vehicleId" required className="dark:text-gray-300">Chọn xe từ kho</Label>
                    <Select
                      id="vehicleId"
                      name="vehicleId"
                      options={vehicleOptions}
                      onChange={(e) => handleVehicleChange(e.target.value)}
                      placeholder={isDataLoading ? "Đang tải kho..." : "-- Chọn xe có sẵn --"}
                      error={errors.vehicleId}
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label htmlFor="basePrice" className="dark:text-gray-300">Giá xe (VNĐ)</Label>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      value={formData.basePrice}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    />
                  </FormGroup>
                </div>
              )}
            </InfoSection>

            {/* Khối 3: Tùy chọn bổ sung (Options) */}
            <InfoSection
              title="3. Tùy chọn bổ sung (Options)"
              icon="⚙️"
              className="bg-slate-50 dark:bg-slate-800 border-cyan-200 dark:border-cyan-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => !isLoading && toggleOption(option)}
                    className={`
                      group relative overflow-hidden p-6 rounded-2xl border-2 cursor-pointer
                      transition-all duration-300
                      ${selectedOptions.find(o => o.id === option.id)
                        ? 'border-cyan-500 dark:bg-cyan-500/20'
                        : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800/50'
                      }
                      hover:scale-105 hover:shadow-xl
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="relative z-10">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {option.name}
                      </h4>
                      <p className="text-cyan-600 dark:text-cyan-400 font-bold">
                        +{formatCurrency(option.price)}
                      </p>
                    </div>
                    {selectedOptions.find(o => o.id === option.id) && (
                      <div className="absolute top-4 right-4 text-2xl">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </InfoSection>

            {/* Khối 4: Dịch vụ bổ sung (Services) */}
            <InfoSection
              title="4. Dịch vụ bổ sung (Services)"
              icon="🛠️"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="registration" className="dark:text-gray-300">Đăng ký xe</Label>
                  <Select
                    id="registration"
                    name="registration"
                    value={selectedServices.registration}
                    onChange={handleServiceChange}
                    options={registrationOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label htmlFor="interiorTrim" className="dark:text-gray-300">Ốp nội thất</Label>
                  <Select
                    id="interiorTrim"
                    name="interiorTrim"
                    value={selectedServices.interiorTrim}
                    onChange={handleServiceChange}
                    options={interiorTrimOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label htmlFor="extendedWarranty" className="dark:text-gray-300">Gói bảo hành</Label>
                  <Select
                    id="extendedWarranty"
                    name="extendedWarranty"
                    value={selectedServices.extendedWarranty}
                    onChange={handleServiceChange}
                    options={warrantyOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>
              </div>
            </InfoSection>

          </div>

          {/* CỘT PHẢI (COL-SPAN-1) */}
          <div className="lg:col-span-1 space-y-6">
            <InfoSection
              title="5. Điều khoản Báo giá"
              icon="💳"
              className="bg-slate-50 dark:bg-slate-800 border-cyan-200 dark:border-cyan-700"
            >
              <div className="space-y-4">

                {/* XÓA: "Tiền đặt cọc" */}

                <FormGroup className="mb-0">
                  <Label htmlFor="discount" className="dark:text-gray-300">Giảm giá trực tiếp (VNĐ)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>
                <FormGroup className="mb-0">
                  <Label htmlFor="voucherCode" className="dark:text-gray-300">Mã Voucher</Label>
                  <div className="flex gap-2">
                    <Input
                      id="voucherCode"
                      name="voucherCode"
                      value={formData.voucherCode}
                      onChange={handleChange}
                      placeholder="SALE50"
                      disabled={isLoading}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                    />
                    <Button type="button" variant="primary" onClick={handleApplyVoucher} disabled={isLoading}>
                      Áp dụng
                    </Button>
                  </div>
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label htmlFor="paymentMethod" required className="dark:text-gray-300">Phương thức thanh toán</Label>
                  <Select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    options={paymentOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>

                {/* THÊM: Chính sách pin (Use Case Bước 6) */}
                <FormGroup className="mb-0">
                  <Label htmlFor="batteryPolicy" required className="dark:text-gray-300">Chính sách pin</Label>
                  <Select
                    id="batteryPolicy"
                    name="batteryPolicy"
                    value={formData.batteryPolicy}
                    onChange={handleChange}
                    options={batteryPolicyOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>

                {/* THÊM: Ngày hết hạn (Use Case Bước 11) */}
                <FormGroup className="mb-0">
                  <Label htmlFor="validUntil" required className="dark:text-gray-300">Báo giá có hiệu lực đến</Label>
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleChange}
                    error={errors.validUntil}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>

                {/* XÓA: "Địa chỉ giao xe" và "Ngày giao dự kiến" */}

              </div>
            </InfoSection>

            {/* Thẻ Tính tiền */}
            <Card className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                💵 Tổng cộng
              </h3>
              <div className="space-y-3">
                <InfoRow label="Giá xe" value={formatCurrency(priceBreakdown.basePrice)} />
                <InfoRow label="Phí tùy chọn" value={`+ ${formatCurrency(priceBreakdown.optionsTotal)}`} />
                <InfoRow label="Phí dịch vụ" value={`+ ${formatCurrency(priceBreakdown.servicesTotal)}`} />

                <InfoRow
                  label="Tổng phụ (Subtotal)"
                  value={formatCurrency(priceBreakdown.subtotal)}
                  className="font-bold border-t pt-3"
                />
                <InfoRow
                  label="Giảm giá & Voucher"
                  value={`- ${formatCurrency(priceBreakdown.totalDiscount)}`}
                  className="text-red-600 dark:text-red-400"
                />

                <InfoRow
                  label="Tổng trước thuế"
                  value={formatCurrency(priceBreakdown.taxableAmount)}
                  className="font-bold border-t pt-3"
                />
                <InfoRow
                  label="Thuế VAT (10%)"
                  value={`+ ${formatCurrency(priceBreakdown.vat)}`}
                />
                <InfoRow
                  label="Phí trước bạ (10%)"
                  value={`+ ${formatCurrency(priceBreakdown.registrationFee)}`}
                />

                <div className="border-t-2 border-slate-300 dark:border-slate-500 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">TỔNG CUỐI:</span>
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(priceBreakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* SỬA 3: Thêm padding 'mt-8' cho ActionBar */}
        <ActionBar align="right" className="mt-8 p-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/quotations')}
            disabled={isLoading}
          >
            Hủy
          </Button>

          {/* --- NÚT PDF MỚI --- */}
          {/* Lưu ý: PDFDownloadLink chỉ render khi có đủ dữ liệu. 
            Nếu validUntil chưa có, nó sẽ báo lỗi.
          */}
         {/* --- NÚT PDF MỚI (ĐÃ SỬA) --- */}
          {formData.validUntil && (
            <PDFDownloadLink
              document={
                <QuotationDocument 
                  formData={formData} 
                  priceBreakdown={priceBreakdown} 
                  selectedOptions={selectedOptions}
                  selectedServices={selectedServices}
                />
              }
              fileName={`BaoGia_${formData.customerName || 'KhachHang'}.pdf`}
            >
              {({ blob, url, loading, error }) => {
                // Chúng ta phải render một thẻ <a> thật
                // và tự style nó cho giống <Button variant="outline">
                
                // (Tôi lấy các class này từ file Button.jsx của bạn,
                // và đã đổi 'emerald' thành 'rose' như bạn yêu cầu)
                const buttonClasses = `
                  font-semibold rounded-xl transition-all duration-300 
                  flex items-center justify-center gap-2 
                  px-6 py-3 text-base 
                  dark:bg-transparent dark:border-gray-600 dark:text-gray-200 
                  dark:hover:bg-white/10 dark:hover:border-rose-500 dark:hover:text-rose-400 
                  bg-transparent border border-gray-300 text-gray-700 
                  hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-700
                `;
                
                const disabledClasses = (loading || isLoading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : '';

                return (
                  <a
                    href={url} // Quan trọng: Phải gán URL từ thư viện
                    download={`BaoGia_${formData.customerName || 'KhachHang'}.pdf`}
                    className={`${buttonClasses} ${disabledClasses}`}
                    // Vô hiệu hóa link nếu đang loading
                    onClick={(e) => (loading || isLoading) && e.preventDefault()}
                  >
                    <Printer className="w-4 h-4" />
                    <span>{loading ? 'Đang tạo...' : 'Xuất PDF'}</span>
                  </a>
                );
              }}
            </PDFDownloadLink>
          )}

          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo báo giá'}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default CreateOrder;