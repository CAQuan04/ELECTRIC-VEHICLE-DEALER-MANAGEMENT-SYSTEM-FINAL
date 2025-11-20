import React, { useState, useEffect, useMemo } from 'react';
// SỬA: Thêm useLocation (hoặc useSearchParams)
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
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
  Card,
  InfoRow
} from '../../components'; 
import { ShoppingCart } from 'lucide-react';

const CreateOrder = () => {
  const navigate = useNavigate();
  // SỬA: Lấy quotationId từ URL ?quotationId=...
  const [searchParams] = useSearchParams();
  const quotationId = searchParams.get('quotationId');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // State để lưu báo giá gốc
  const [quotation, setQuotation] = useState(null); 

  // State chỉ cho các trường MỚI của đơn hàng
  const [formData, setFormData] = useState({
    downPayment: 0,
    deliveryAddress: '',
    estimatedDelivery: new Date().toISOString().split('T')[0],
  });

  // Tải dữ liệu BÁO GIÁ GỐC
  useEffect(() => {
    if (!quotationId) {
      notifications.error('Lỗi', 'Không tìm thấy báo giá. Vui lòng quay lại danh sách.');
      navigate('/dealer/quotations');
      return;
    }

    const loadQuotation = async () => {
      setIsLoading(true);
      try {
        const result = await dealerAPI.getQuotationById(quotationId);
        if (result.success && result.data) {
          setQuotation(result.data);
          // Tự động điền địa chỉ nếu khách hàng đã có
          setFormData(prev => ({
            ...prev,
            deliveryAddress: result.data.customerAddress || '' 
          }));
        } else {
          throw new Error(result.message || 'Không thể tải báo giá');
        }
      } catch (error) {
        console.error('Error loading quotation:', error);
        notifications.error('Lỗi', error.message);
        navigate('/dealer/quotations');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotation();
  }, [quotationId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.downPayment <= 0) newErrors.downPayment = 'Tiền đặt cọc phải lớn hơn 0.';
    if (!formData.deliveryAddress) newErrors.deliveryAddress = 'Vui lòng nhập địa chỉ giao.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        quotationId: quotationId, // Gửi ID báo giá gốc
        ...formData, // Gửi các trường mới
        // Back-end sẽ tự động sao chép phần còn lại từ báo giá
      };

      const result = await dealerAPI.createOrder(orderData);
      
      if (result.success) {
        notifications.success('Thành công', 'Tạo đơn hàng thành công!');
        navigate('/dealer/orders');
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi tạo đơn hàng: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'financing', label: 'Trả góp' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
  ];

  const formatCurrency = (amount) => {
    return `${(amount / 1000000).toLocaleString('vi-VN')} triệu`;
  };

  if (isLoading || !quotation) {
    // Hiển thị loading...
    return <PageContainer><div>Đang tải dữ liệu báo giá...</div></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Chuyển đổi Báo giá"
        subtitle={`Tạo đơn hàng từ Báo giá #${quotationId}`}
        icon={<ShoppingCart className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/quotations')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI (COL-SPAN-2): Thông tin READ-ONLY */}
          <div className="lg:col-span-2 space-y-6">
            <InfoSection title="Thông tin khách hàng (Từ báo giá)" icon="👤" className="bg-slate-50 dark:bg-slate-800">
              <InfoRow label="Tên khách hàng" value={quotation.customerName} />
              <InfoRow label="Số điện thoại" value={quotation.customerPhone} />
              <InfoRow label="Email" value={quotation.customerEmail} />
            </InfoSection>

            <InfoSection title="Cấu hình xe (Từ báo giá)" icon="🚗" className="bg-slate-50 dark:bg-slate-800">
              <InfoRow label="Dòng xe" value={quotation.vehicleName || 'N/A'} />
              <InfoRow label="Chính sách pin" value={quotation.batteryPolicy} />
              {/* Hiển thị các tùy chọn đã chọn */}
              {quotation.additionalOptions?.map(opt => (
                <InfoRow key={opt.id} label={`Tùy chọn: ${opt.name}`} value={`+ ${formatCurrency(opt.price)}`} />
              ))}
              {/* Hiển thị các dịch vụ đã chọn */}
              {Object.entries(quotation.additionalServices).map(([key, value]) => (
                <InfoRow key={key} label={`Dịch vụ: ${value}`} value="" />
              ))}
            </InfoSection>

            {/* Thẻ Tổng tiền (READ-ONLY) */}
            <Card className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                💵 Tổng cộng (Từ báo giá)
              </h3>
              <div className="space-y-3">
                <InfoRow 
                  label="Tổng trước thuế" 
                  value={formatCurrency(quotation.priceBreakdown.taxableAmount)} 
                  className="font-bold border-t pt-3"
                />
                <InfoRow 
                  label="Thuế & Phí" 
                  value={`+ ${formatCurrency(quotation.priceBreakdown.vat + quotation.priceBreakdown.registrationFee)}`}
                />
                <div className="border-t-2 border-slate-300 dark:border-slate-500 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">TỔNG CUỐI:</span>
                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(quotation.priceBreakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI (COL-SPAN-1): Thông tin MỚI (EDITABLE) */}
          <div className="lg:col-span-1 space-y-6">
            <InfoSection 
              title="Thông tin Đơn hàng" 
              icon="💳"
              className="bg-slate-50 dark:bg-slate-800 border-cyan-200 dark:border-cyan-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="downPayment" required className="dark:text-gray-300">Tiền đặt cọc (VNĐ)</Label>
                  <Input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    value={formData.downPayment}
                    onChange={handleChange}
                    error={errors.downPayment}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>
                
                <FormGroup className="mb-0">
                  <Label htmlFor="paymentMethod" required className="dark:text-gray-300">Phương thức thanh toán</Label>
                  <Select
                    id="paymentMethod"
                    name="paymentMethod"
                    // Ghi đè PTTT từ báo giá nếu muốn
                    value={formData.paymentMethod || quotation.paymentMethod} 
                    onChange={handleChange}
                    options={paymentOptions}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label htmlFor="deliveryAddress" required className="dark:text-gray-300">Địa chỉ giao xe</Label>
                  <Textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    error={errors.deliveryAddress}
                    disabled={isLoading}
                    rows={3}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label htmlFor="estimatedDelivery" className="dark:text-gray-300">Ngày giao dự kiến</Label>
                  <Input
                    id="estimatedDelivery"
                    name="estimatedDelivery"
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                  />
                </FormGroup>
              </div>
            </InfoSection>
          </div>
        </div>
        
        <ActionBar align="right" className="mt-8 p-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/quotations')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isSubmitting ? 'Đang tạo...' : 'Xác nhận Tạo Đơn hàng'}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default CreateOrder;