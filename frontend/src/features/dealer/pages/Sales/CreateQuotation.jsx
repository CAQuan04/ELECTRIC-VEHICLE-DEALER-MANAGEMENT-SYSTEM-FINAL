import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
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
  Card,
  InfoRow
} from '../../components';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ShoppingCart, Printer, Edit, FileText } from 'lucide-react';
import QuotationDocument from './QuotationDocument';

// ... (Giữ nguyên các options constant như interiorTrimOptions, batteryPolicyOptions, v.v.) ...
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
  interiorTrim: { 'Vải nỉ & Nhựa nhám': 0, 'Da thật': 20000000, 'Da cao cấp & Gỗ': 100000000, 'Da cao cấp & carbon fiber': 75000000 },
  extendedWarranty: { 'không': 0, '1 năm': 30000000, '2 năm': 50000000, '3 năm': 80000000 }
};

const registrationOptions = [
  { value: 'tự đăng ký', label: 'Tự đăng ký' },
  { value: 'trọn gói', label: 'Dịch vụ trọn gói đăng ký ra biển cho xe' }
];

const interiorTrimOptions = [
  { value: 'Vải nỉ & Nhựa nhám', label: 'Ghế nỉ và ốp nhựa nhám (Mặc định)' },
  { value: 'Da thật', label: 'Ốp da thật (20 triệu)' },
  { value: 'Da cao cấp & Gỗ', label: 'Ghế da cao cấp và nội thất ốp gỗ, vân gỗ (100 triệu)' },
  { value: 'Da cao cấp & carbon fiber', label: 'Ghế da cao cấp và nội thất ốp carbon fiber (75 triệu)' }
];

const warrantyOptions = [
  { value: 'không', label: 'Không' },
  { value: '1 năm', label: 'Bảo hành mở rộng 1 năm (30 triệu)' },
  { value: '2 năm', label: 'Bảo hành mở rộng 2 năm (50 triệu)' },
  { value: '3 năm', label: 'Bảo hành mở rộng 3 năm (80 triệu)' }
];
const batteryPolicyOptions = [
  { value: 'thuê pin', label: 'Thuê pin (Đã trừ 200 triệu vào giá xe)' },
  { value: 'mua pin', label: 'Mua pin (Bao gồm giá pin)' }
];

const CreateQuotation = () => {
  const navigate = useNavigate();
  const { quotationId } = useParams();
  const isEditMode = !!quotationId;
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();
  // Lấy dealerId, đảm bảo không phải undefined
  const dealerId = user?.dealerId;

  const [formData, setFormData] = useState({
    customerId: '', 
    customerName: '',
    customerPhone: '',
    customerEmail: '', 
    vehicleId: '',
    configId: 0, 
    basePrice: 0,
    discount: 0,
    quantity: 1, 
    voucherCode: '',
    voucherDiscount: 0,
    paymentMethod: 'financing',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    batteryPolicy: 'thuê pin',
    notes: ''
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState({
    registration: 'tự đăng ký',
    interiorTrim: 'Vải nỉ & Nhựa nhám',
    extendedWarranty: 'không'
  });

  const [isCustomerSectionOpen, setIsCustomerSectionOpen] = useState(true);
  const [isVehicleSectionOpen, setIsVehicleSectionOpen] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);

useEffect(() => {
    // 🛑 FIX LỖI 400: Chặn tuyệt đối nếu chưa có dealerId
    if (!dealerId) {
      return; 
    }

    const loadPrerequisites = async () => {
      setIsDataLoading(true);
      try {
        // Gọi song song
        const [customerResult, inventoryResult] = await Promise.all([
          dealerAPI.getCustomers(), 
          dealerAPI.getInventory(dealerId)
        ]);

        // Xử lý Customers
        if (customerResult.success && customerResult.data) {
          // Backend có thể trả về: { items: [...] } hoặc [...] trực tiếp
          const rawData = customerResult.data;
          const customerList = Array.isArray(rawData) ? rawData : (rawData.items || rawData.data || []);
          setCustomers(customerList);
        } else {
          console.error('Lỗi tải khách hàng:', customerResult);
        }

        // Xử lý Inventory
        if (inventoryResult.success && inventoryResult.data) {
           const inventoryList = Array.isArray(inventoryResult.data) 
            ? inventoryResult.data 
            : (inventoryResult.data.items || inventoryResult.data.data || []);
           
           // Lọc xe có sẵn
           const filteredInventory = inventoryList.filter(v => (v.quantity || 0) > 0);
           setInventory(filteredInventory);
        }
        // Load Quotation data for Edit mode
        if (isEditMode) {
            const quotationResult = await dealerAPI.getQuotationById(quotationId);
            if (quotationResult.success && quotationResult.data) {
                const data = quotationResult.data;
                setFormData({
                    customerId: data.customerId,
                    customerName: data.customerName || '',
                    customerPhone: data.customerPhone || '',
                    customerEmail: data.customerEmail || '',
                    vehicleId: data.vehicleId,
                    basePrice: data.basePrice || 0,
                    configId: data.configId || 0,
                    quantity: data.quantity || 1,
                    discount: data.discount || 0,
                    voucherCode: data.voucherCode || '',
                    voucherDiscount: data.voucherDiscount || 0,
                    paymentMethod: data.paymentMethod || 'financing',
                    validUntil: data.validUntil ? data.validUntil.split('T')[0] : '',
                    batteryPolicy: data.batteryPolicy || 'thuê pin',
                    notes: data.notes || ''
                });
            }
        }

      } catch (error) {
        console.error('🚨 Lỗi không mong muốn trong loadPrerequisites:', error);
        notifications.error('Lỗi', 'Không thể tải dữ liệu ban đầu.');
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadPrerequisites();
  }, [isEditMode, quotationId, dealerId]); // dealerId thay đổi (từ null -> có giá trị) sẽ trigger lại useEffect

  // Tự động điền thông tin khi chọn khách hàng
  const handleCustomerChange = (customerId) => {
    const selected = customers.find(c => (c.customerId || c.id) == customerId); 
    if (selected) {
      console.log('Selected customer:', selected);
      setFormData(prev => ({
        ...prev,
        customerId: selected.customerId || selected.id, 
        customerName: selected.fullName || '', 
        customerPhone: selected.phone || '',       
        customerAddress: selected.address || '',   
        customerEmail: selected.email || '',       
        idDocumentNumber: selected.idDocumentNumber || '' 
      }));
    }
  };

  const handleVehicleChange = (vehicleId) => {
    const selected = inventory.find(v => (v.vehicleId || v.id) == vehicleId);
    if (selected) {
        setFormData(prev => ({
            ...prev,
            vehicleId: selected.vehicleId || selected.id,
            basePrice: selected.price || selected.basePrice || 0,
            configId: selected.configId || 0 
        }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setSelectedServices(prev => ({ ...prev, [name]: value }));
  };

  const toggleOption = (option) => {
    if (selectedOptions.find(o => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter(o => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleApplyVoucher = () => {
    if (formData.voucherCode.toUpperCase() === 'SALE50') {
      notifications.success('Thành công', 'Áp dụng voucher thành công! Giảm 50 triệu.');
      setFormData(prev => ({ ...prev, voucherDiscount: 50000000 }));
    } else {
      notifications.error('Lỗi', 'Mã voucher không hợp lệ.');
      setFormData(prev => ({ ...prev, voucherDiscount: 0 }));
    }
  };

  // Tính toán giá chi tiết
  const priceBreakdown = useMemo(() => {
    const basePrice = parseInt(formData.basePrice) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    const vehicleTotal = basePrice * quantity;

    const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);

    const serviceRegistrationCost = servicePrices.registration[selectedServices.registration] || 0;
    const serviceInteriorCost = servicePrices.interiorTrim[selectedServices.interiorTrim] || 0;
    const serviceWarrantyCost = servicePrices.extendedWarranty[selectedServices.extendedWarranty] || 0;
    const servicesTotal = serviceRegistrationCost + serviceInteriorCost + serviceWarrantyCost;

    const subtotal = vehicleTotal + optionsTotal + servicesTotal;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form...

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: parseInt(formData.customerId) || 0,
        validUntil: formData.validUntil,
        items: [
            {
                vehicleId: parseInt(formData.vehicleId) || 0,
                configId: parseInt(formData.configId) || 0,
                quantity: parseInt(formData.quantity) || 1,
                unitPrice: parseFloat(formData.basePrice) || 0.01 
            }
        ],
      };

      console.log('Sending payload:', payload);

      let result;
      if (isEditMode) {
        console.warn("Edit mode not fully supported by provided API spec");
      } else {
        result = await dealerAPI.createQuotation(payload);
      }

      if (result.success) {
        notifications.success('Thành công', 'Tạo báo giá thành công!');
        navigate('/dealer/quotations');
      } else {
        notifications.error('Lỗi', result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerOptions = customers.map(c => ({
    label: `${c.fullName || 'N/A'} - ${c.phone || 'N/A'}`,
    value: c.customerId || c.id
  }));

  const vehicleOptions = inventory.map(v => {
    const vehicleId = v.vehicleId || v.id;
    const vehicleName = v.vehicleName || `${v.brand || ''} ${v.model || 'N/A'}`.trim();
    const configName = v.configName || v.color || '';
    const quantity = v.quantity || 0;
    const basePrice = v.basePrice || v.price || 0;
    const priceText = basePrice > 0 ? ` - ${(basePrice / 1000000).toFixed(0)}tr` : '';
    const configText = configName ? ` (${configName})` : '';
    return {
      label: `${vehicleName}${configText} - SL: ${quantity}${priceText}`,
      value: vehicleId
    };
  });

  const paymentOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'financing', label: 'Trả góp' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
  ];

  const isLoading = isDataLoading || isSubmitting;
  const formatCurrency = (amount) => {
    return `${(amount / 1000000).toLocaleString('vi-VN')} triệu`;
  };
  
  return (
     <PageContainer>
      <PageHeader
        title={isEditMode ? 'Sửa báo giá' : 'Tạo báo giá mới'}
        subtitle={isEditMode ? `Đang chỉnh sửa Báo giá ID: ${quotationId}` : 'Tạo báo giá chi tiết cho khách hàng'}
        icon={isEditMode ? <Edit className="w-16 h-16" /> : <FileText className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/quotations')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CỘT TRÁI (COL-SPAN-2) */}
          <div className="lg:col-span-2 space-y-6">

            <InfoSection
              title="1. Thông tin khách hàng"
              icon="👤"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              isCollapsible={true}
              isOpen={isCustomerSectionOpen}
              onToggle={() => setIsCustomerSectionOpen(!isCustomerSectionOpen)}
            >
              {isCustomerSectionOpen && (
                <div className="space-y-4 mt-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="customer-search" className="dark:text-gray-300">Chọn khách hàng</Label>
                    <Select
                      id="customer-search"
                      options={customerOptions}
                      onChange={(e) => handleCustomerChange(e.target.value)} // Gọi hàm tự động điền
                      placeholder={isDataLoading ? "Đang tải khách..." : "-- Chọn khách hàng có sẵn --"}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup className="mb-0">
                      <Label>Tên khách hàng</Label>
                      <Input value={formData.customerName} readOnly disabled className="bg-gray-100" /> 
                    </FormGroup>
                    <FormGroup className="mb-0">
                      <Label>Số điện thoại</Label>
                      <Input value={formData.customerPhone} readOnly disabled className="bg-gray-100" />
                    </FormGroup>
                  </div>
                   <FormGroup className="mb-0">
                    <Label>Email</Label>
                    <Input value={formData.customerEmail} readOnly disabled className="bg-gray-100" />
                  </FormGroup>
                </div>
              )}
            </InfoSection>

            <InfoSection
              title="2. Thông tin xe"
              icon="🚗"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                     <FormGroup className="mb-0">
                        <Label htmlFor="quantity" className="dark:text-gray-300">Số lượng</Label>
                        <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        disabled={isLoading}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                        />
                    </FormGroup>
                  </div>
                </div>
              )}
            </InfoSection>

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
              </div>
            </InfoSection>

            {/* Thẻ Tính tiền */}
            <Card className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                💵 Tổng cộng
              </h3>
              <div className="space-y-3">
                <InfoRow label="Giá xe" value={formatCurrency(priceBreakdown.basePrice * (parseInt(formData.quantity) || 1))} />
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

        <ActionBar align="right" className="mt-8 p-2.5">
          <div className="flex items-center mr-auto">
            <input
              id="sendEmail"
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label
              htmlFor="sendEmail"
              className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Gửi PDF cho khách hàng ngay
            </label>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/quotations')}
            disabled={isLoading}
          >
            Hủy
          </Button>

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
                    href={url} 
                    download={`BaoGia_${formData.customerName || 'KhachHang'}.pdf`}
                    className={`${buttonClasses} ${disabledClasses}`}
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
            {isSubmitting
              ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...')
              : (isEditMode ? 'Lưu thay đổi' : 'Tạo báo giá')
            }
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default CreateQuotation;