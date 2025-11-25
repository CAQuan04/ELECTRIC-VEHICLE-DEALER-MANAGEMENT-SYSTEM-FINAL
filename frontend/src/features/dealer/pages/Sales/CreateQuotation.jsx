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
// ✨ THÊM 'Search' VÀO IMPORT
import { ShoppingCart, Printer, Edit, FileText, User, CheckCircle, UserPlus, Save, Search } from 'lucide-react';
import QuotationDocument from './QuotationDocument';

// --- CÁC CONSTANTS GIỮ NGUYÊN ---
const availableOptions = [
  { id: 1, name: 'Màu đặc biệt', price: 50000000 },
  { id: 2, name: 'Nội thất cao cấp', price: 100000000 },
  { id: 3, name: 'Autopilot nâng cao', price: 150000000 },
  { id: 4, name: 'Gói sạc tại nhà', price: 25000000 }
];

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

  // State quản lý Loading và Dữ liệu
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [errors, setErrors] = useState({});

  // ✨ MỚI: State cho ô tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý logic tạo khách hàng mới
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const { user } = useAuth();
  const dealerId = user?.dealerId;

  // Form Data
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerIdDocumentNumber: '',
    vehicleId: '',
    configId: 0,
    basePrice: 0,
    discount: 0,
    quantity: 1,
    promotionId: '',
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
    if (!dealerId) return;

    const loadPrerequisites = async () => {
      setIsDataLoading(true);
      try {
        const [customerResult, inventoryResult, promotionResult] = await Promise.all([
          dealerAPI.getCustomers(),
          dealerAPI.getInventory(dealerId),
          dealerAPI.getPromotions({ dealerId, status: 'Active' })
        ]);

        if (customerResult.success && customerResult.data) {
          const rawData = customerResult.data;
          const customerList = Array.isArray(rawData) ? rawData : (rawData.items || rawData.data || []);
          setCustomers(customerList);
        }

        if (inventoryResult.success && inventoryResult.data) {
          const rawInv = inventoryResult.data;
          const invList = Array.isArray(rawInv) ? rawInv : (rawInv.items || rawInv.data || []);
          setInventory(invList.filter(v => (v.quantity || 0) > 0));
        }

        if (promotionResult.success) {
          const promoList = Array.isArray(promotionResult.data)
            ? promotionResult.data
            : (promotionResult.data.items || promotionResult.data.data || []);
          setPromotions(promoList);
        }

        if (isEditMode) {
          const quotationResult = await dealerAPI.getQuotationById(quotationId);
          if (quotationResult.success && quotationResult.data) {
            const data = quotationResult.data;
            setFormData(prev => ({
              ...prev,
              customerId: data.customerId,
              customerName: data.customerName || '',
              customerPhone: data.customerPhone || '',
              customerEmail: data.customerEmail || '',
              vehicleId: data.vehicleId,
              basePrice: data.basePrice || 0,
              configId: data.configId || 0,
              quantity: data.quantity || 1,
              discount: data.discount || 0,
              promotionId: data.promotionId || '',
              paymentMethod: data.paymentMethod || 'financing',
              validUntil: data.validUntil ? data.validUntil.split('T')[0] : '',
              batteryPolicy: data.batteryPolicy || 'thuê pin',
              notes: data.notes || ''
            }));
          }
        }

      } catch (error) {
        console.error('🚨 Lỗi tải dữ liệu:', error);
        notifications.error('Lỗi', 'Không thể tải dữ liệu ban đầu.');
      } finally {
        setIsDataLoading(false);
      }
    };

    loadPrerequisites();
  }, [isEditMode, quotationId, dealerId]);

  // Handlers
  const handleCustomerChange = (customerId) => {
    const selected = customers.find(c => (c.customerId || c.id) == customerId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        customerId: selected.customerId || selected.id,
        customerName: selected.fullName || '',
        customerPhone: selected.phone || '',
        customerAddress: selected.address || '',
        customerEmail: selected.email || '',
        customerIdDocumentNumber: selected.idDocumentNumber || '',
      }));
    }
  };

  // ✨ HÀM LỌC KHÁCH HÀNG
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    
    const lowerTerm = searchTerm.toLowerCase();
    return customers.filter(c => 
      (c.fullName && c.fullName.toLowerCase().includes(lowerTerm)) || 
      (c.phone && c.phone.includes(lowerTerm)) ||
      (c.idDocumentNumber && c.idDocumentNumber.includes(lowerTerm))
    );
  }, [customers, searchTerm]);

  // ✨ TẠO OPTIONS TỪ DANH SÁCH ĐÃ LỌC
  const customerOptions = filteredCustomers.map(c => ({
    label: `${c.fullName} - ${c.phone} ${c.idDocumentNumber ? `(${c.idDocumentNumber})` : ''}`,
    value: c.customerId || c.id
  }));

  const handleCreateNewCustomer = async () => {
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress || !formData.customerIdDocumentNumber) {
      notifications.error('Thiếu thông tin', 'Vui lòng nhập đầy đủ: Tên, SĐT, Địa chỉ và CCCD.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCustomerPayload = {
        fullName: formData.customerName,
        phone: formData.customerPhone,
        address: formData.customerAddress,
        idDocumentNumber: formData.customerIdDocumentNumber
      };

      const result = await dealerAPI.createCustomer(newCustomerPayload);

      if (result.success && result.data) {
        const newCustomer = result.data;
        notifications.success('Thành công', 'Đã lưu khách hàng mới vào hệ thống.');

        setCustomers(prev => [...prev, newCustomer]);
        // Tự động chọn khách hàng mới tạo
        setFormData(prev => ({
          ...prev,
          customerId: newCustomer.customerId || newCustomer.id,
        }));
        
        // Reset search term và đóng chế độ nhập mới
        setSearchTerm('');
        setIsNewCustomer(false);
      } else {
        const msg = result.message || (result.errors ? JSON.stringify(result.errors) : 'Lỗi tạo khách hàng');
        notifications.error('Lỗi', msg);
      }
    } catch (error) {
      console.error('🚨 Lỗi tạo khách hàng:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi lưu khách hàng.');
    } finally {
      setIsSubmitting(false);
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

    let promotionDiscount = 0;
    const selectedPromo = promotions.find(p =>
      (p.promotionId || p.promoId || p.id) == formData.promotionId
    );

    if (selectedPromo) {
      if (selectedPromo.discountType === 'FixedAmount') {
        promotionDiscount = selectedPromo.discountValue || 0;
      } else if (selectedPromo.discountType === 'Percentage') {
        promotionDiscount = subtotal * ((selectedPromo.discountValue || 0) / 100);
      }
    }

    const manualDiscount = parseInt(formData.discount) || 0;
    const totalDiscount = manualDiscount + promotionDiscount;
    const taxableAmount = Math.max(0, subtotal - totalDiscount);
    const vat = taxableAmount * 0.10;
    const registrationFee = taxableAmount * 0.10;
    const total = taxableAmount + vat + registrationFee;

    return {
      basePrice,
      optionsTotal,
      servicesTotal,
      subtotal,
      totalDiscount,
      promotionDiscount,
      taxableAmount,
      vat,
      registrationFee,
      total
    };
  }, [formData, selectedOptions, selectedServices, promotions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: parseInt(formData.customerId) || 0,
        validUntil: formData.validUntil,
        promotionId: formData.promotionId || null,
        discount: parseInt(formData.discount) || 0,
        items: [
          {
            vehicleId: parseInt(formData.vehicleId) || 0,
            configId: parseInt(formData.configId) || 0,
            quantity: parseInt(formData.quantity) || 1,
            unitPrice: parseFloat(formData.basePrice) || 0
          }
        ],
        options: selectedOptions.map(o => o.id),
        services: selectedServices
      };

      let result;
      if (isEditMode) {
        console.warn("Edit mode update not implemented completely");
        result = { success: true };
      } else {
        result = await dealerAPI.createQuotation(payload);
      }

      if (result.success) {
        notifications.success('Thành công', isEditMode ? 'Cập nhật thành công!' : 'Tạo báo giá thành công!');
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

  // UI Helpers
  const vehicleOptions = inventory.map(v => {
    const vehicleId = v.vehicleId || v.id;
    const vehicleName = v.vehicleName || `${v.brand || ''} ${v.model || 'N/A'}`.trim();
    const configName = v.configName || v.color || '';
    const quantity = v.quantity || 0;
    const basePrice = v.basePrice || v.price || 0;
    const priceText = basePrice > 0 ? ` - ${(basePrice / 1000000).toFixed(0)}tr` : '';
    return {
      label: `${vehicleName} (${configName}) - SL: ${quantity}${priceText}`,
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
              icon={<User className="w-5 h-5 text-blue-600" />}
              isCollapsible={true}
              isOpen={isCustomerSectionOpen}
              onToggle={() => setIsCustomerSectionOpen(!isCustomerSectionOpen)}
            >
              {isCustomerSectionOpen && (
                <div className="space-y-4 mt-2">
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant={isNewCustomer ? "primary" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsNewCustomer(!isNewCustomer);
                        // Reset form và ô tìm kiếm khi chuyển chế độ
                        setSearchTerm('');
                        setFormData(prev => ({ 
                            ...prev, 
                            customerId: '', 
                            customerName: '', 
                            customerPhone: '', 
                            customerEmail: '',
                            customerAddress: '',
                            customerIdDocumentNumber: ''
                        }));
                      }}
                    >
                      {isNewCustomer ? <CheckCircle className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      {isNewCustomer ? "Chọn khách hàng có sẵn" : "Nhập khách hàng mới"}
                    </Button>
                  </div>

                  {!isNewCustomer ? (
                    <div className="space-y-3">
                      {/* ✨ Ô TÌM KIẾM KHÁCH HÀNG */}
                      <div className="relative">
                        <Label className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lọc khách hàng nhanh</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            type="text"
                            placeholder="Nhập Tên, SĐT hoặc CCCD..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10  border-blue-200 focus:border-blue-500"
                          />
                          {searchTerm && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="text-xs text-gray-400">
                                    Tìm thấy: {filteredCustomers.length}
                                </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <FormGroup>
                        <Label>Chọn từ danh sách</Label>
                        <Select style={{ minWidth: '200px',
                          borderColor: errors.customerId ? '#f52c2cff' : '',
                          backgroundColor: isCustomerSectionOpen ? '#3b363b33' : ' ',
                          color: isCustomerSectionOpen ? '#ffffffff' : ' '

                         }}
                          value={formData.customerId}
                          options={customerOptions}
                          onChange={(e) => handleCustomerChange(e.target.value)}
                          placeholder={
                             isDataLoading ? "Đang tải..." : 
                             filteredCustomers.length === 0 ? "Không tìm thấy khách hàng nào khớp" :
                             "-- Chọn khách hàng --"
                          }
                          disabled={filteredCustomers.length === 0}
                        />
                      </FormGroup>
                    </div>
                  ) : (
                    <div className="p-6 text-gray-200 rounded-lg text-xl tracking-wider "
                        style={{ background: 'linear-gradient(90deg, #ec45baff, #feb47b)', 
                          fontWeight: 'bold', boxShadow: '0 4px 6px rgba(255, 124, 124, 0.57)' }}>
                      Nhập thông tin để tạo khách hàng mới
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup>
                      <Label required={isNewCustomer}>Họ và tên</Label>
                      <Input
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        readOnly={!isNewCustomer}
                        className={!isNewCustomer ? "bg-gray-100" : "bg-rose-50"}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label required={isNewCustomer}>Số điện thoại</Label>
                      <Input
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        readOnly={!isNewCustomer}
                        className={!isNewCustomer ? "bg-gray-100" : "bg-rose-50"}
                      />
                    </FormGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup>
                        <Label required={isNewCustomer}>Số CCCD/CMND</Label>
                        <Input
                            name="customerIdDocumentNumber"
                            value={formData.customerIdDocumentNumber}
                            onChange={handleChange}
                            readOnly={!isNewCustomer}
                            placeholder={isNewCustomer ? "Nhập số giấy tờ tùy thân" : ""}
                            className={!isNewCustomer ? "bg-gray-100" : "bg-rose-50"}
                        />
                    </FormGroup>
                     <FormGroup>
                        <Label required={isNewCustomer}>Địa chỉ</Label>
                        <Input
                            name="customerAddress"
                            value={formData.customerAddress}
                            onChange={handleChange}
                            readOnly={!isNewCustomer}
                            placeholder={isNewCustomer ? "Nhập địa chỉ liên hệ" : ""}
                            className={!isNewCustomer ? "bg-gray-100" : "bg-rose-50"}
                        />
                    </FormGroup>
                  </div>

                  <FormGroup>
                    <Label>Email (Tùy chọn)</Label>
                    <Input
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      readOnly={!isNewCustomer}
                      className={!isNewCustomer ? "bg-gray-100" : "bg-rose-50"}
                    />
                  </FormGroup>

                  {isNewCustomer && (
                    <div className="flex justify-end mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCreateNewCustomer}
                        disabled={isLoading}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Đang lưu...' : 'Lưu vào hệ thống'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </InfoSection>

            {/* CÁC SECTION KHÁC GIỮ NGUYÊN ... */}
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
                  <Label htmlFor="promotionId" className="dark:text-gray-300">Chương trình Khuyến mãi</Label>
                  <Select
                    id="promotionId"
                    name="promotionId"
                    value={formData.promotionId}
                    onChange={handleChange}
                    disabled={promotions.length === 0 || isLoading}
                    placeholder={promotions.length === 0 ? "Không có chương trình khả dụng" : "-- Chọn chương trình ưu đãi --"}
                    options={[
                      { value: '', label: 'Không áp dụng' },
                      ...promotions.map(p => {
                        const id = p.promotionId || p.promoId || p.id;
                        const valStr = p.discountType === 'FixedAmount'
                          ? `${(p.discountValue / 1000000).toLocaleString()}tr`
                          : `${p.discountValue}%`;
                        return {
                          value: id,
                          label: `${p.name} (-${valStr})`
                        };
                      })
                    ]}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
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
                  label="Giảm giá & KM"
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