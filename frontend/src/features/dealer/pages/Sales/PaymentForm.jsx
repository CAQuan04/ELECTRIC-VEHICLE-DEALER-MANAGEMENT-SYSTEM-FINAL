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
import { CreditCard } from 'lucide-react';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    orderId: '',
    orderInfo: null,
    amount: 0,
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    notes: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsDataLoading(true);
    try {
      const result = await dealerAPI.getOrders({ status: 'processing,pending' });
      if (result.success && result.data) {
        const orderList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setOrders(orderList);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Lỗi: không thể tải danh sách đơn hàng.');
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderChange = (orderId) => {
    const selected = orders.find(o => o.id === orderId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        orderId: selected.id,
        orderInfo: selected
      }));
    }
  };

  const calculateRemainingAmount = () => {
    if (!formData.orderInfo) return 0;
    const totalAmount = formData.orderInfo.totalAmount || 0;
    const paidAmount = formData.orderInfo.paidAmount || 0;
    return totalAmount - paidAmount;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = 'Vui lòng chọn đơn hàng.';
    if (formData.amount <= 0) newErrors.amount = 'Số tiền phải lớn hơn 0.';
    
    const remaining = calculateRemainingAmount();
    if (formData.amount > remaining) {
      newErrors.amount = `Số tiền không được vượt quá số còn lại: ${(remaining / 1000000).toLocaleString('vi-VN')} triệu VNĐ`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const paymentData = {
        orderId: formData.orderId,
        amount: formData.amount,
        paymentType: formData.paymentType,
        paymentMethod: formData.paymentMethod,
        transactionReference: formData.transactionReference,
        notes: formData.notes,
        paymentDate: new Date().toISOString()
      };

      const result = await dealerAPI.processPayment(formData.orderId, paymentData);
      if (result.success) {
        alert('Ghi nhận thanh toán thành công!');
        navigate('/dealer/payments');
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Có lỗi xảy ra khi ghi nhận thanh toán: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderOptions = orders.map(o => ({
    label: `ORD-${String(o.id).padStart(4, '0')} - ${o.customerName} - ${o.vehicle}`,
    value: o.id
  }));

  const paymentTypeOptions = [
    { value: 'deposit', label: 'Đặt cọc' },
    { value: 'installment', label: 'Trả góp' },
    { value: 'full', label: 'Toàn bộ' },
    { value: 'final', label: 'Thanh toán cuối' }
  ];

  const paymentMethodOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
    { value: 'credit_card', label: 'Thẻ tín dụng' },
    { value: 'financing', label: 'Tài chính' }
  ];

  const isLoading = isDataLoading || isSubmitting;

  return (
    <PageContainer>
      <PageHeader
        title="💳 Ghi nhận thanh toán"
        subtitle="Ghi nhận thanh toán từ khách hàng"
        icon={<CreditCard className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/payments')}
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <InfoSection 
              title="1. Thông tin đơn hàng" 
              icon="📋"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <FormGroup className="mb-0">
                  <Label htmlFor="orderId" required>Chọn đơn hàng</Label>
                  <Select
                    id="orderId"
                    name="orderId"
                    options={orderOptions}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    placeholder={isDataLoading ? "Đang tải đơn hàng..." : "-- Chọn đơn hàng --"}
                    error={errors.orderId}
                    disabled={isLoading}
                  />
                </FormGroup>

                {formData.orderInfo && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-500/30">
                    <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                      Thông tin đơn hàng
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Khách hàng:</span>
                        <span className="font-bold">{formData.orderInfo.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Xe:</span>
                        <span className="font-bold">{formData.orderInfo.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tổng giá trị:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {((formData.orderInfo.totalAmount || 0) / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Đã thanh toán:</span>
                        <span className="font-bold">
                          {((formData.orderInfo.paidAmount || 0) / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                        </span>
                      </div>
                      <div className="border-t-2 border-emerald-200 dark:border-emerald-500/30 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">Còn lại:</span>
                          <span className="text-xl font-black text-red-600 dark:text-red-400">
                            {(calculateRemainingAmount() / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </InfoSection>

            <InfoSection 
              title="2. Thông tin thanh toán" 
              icon="💰"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup className="mb-0">
                    <Label htmlFor="amount" required>Số tiền (VNĐ)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      error={errors.amount}
                      placeholder="240000000"
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Label htmlFor="paymentType" required>Loại thanh toán</Label>
                    <Select
                      id="paymentType"
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      options={paymentTypeOptions}
                      disabled={isLoading}
                    />
                  </FormGroup>
                </div>

                <FormGroup className="mb-0">
                  <Label htmlFor="paymentMethod" required>Phương thức thanh toán</Label>
                  <Select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    options={paymentMethodOptions}
                    disabled={isLoading}
                  />
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label htmlFor="transactionReference">Mã giao dịch</Label>
                  <Input
                    id="transactionReference"
                    name="transactionReference"
                    value={formData.transactionReference}
                    onChange={handleChange}
                    placeholder="TXN123456"
                    disabled={isLoading}
                  />
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Thông tin bổ sung về thanh toán..."
                    disabled={isLoading}
                  />
                </FormGroup>
              </div>
            </InfoSection>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/20 dark:to-emerald-600/10 border-2 border-emerald-300 dark:border-emerald-500">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                💵 Tóm tắt thanh toán
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Số tiền thanh toán:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(formData.amount / 1000000).toLocaleString('vi-VN')} triệu
                  </span>
                </div>
                {formData.orderInfo && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Còn lại sau khi thanh toán:</span>
                      <span className="font-bold text-red-600">
                        {((calculateRemainingAmount() - formData.amount) / 1000000).toLocaleString('vi-VN')} triệu
                      </span>
                    </div>
                  </>
                )}
                <div className="border-t-2 border-emerald-300 dark:border-emerald-500 pt-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ngày ghi nhận</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {formData.paymentMethod === 'bank_transfer' && (
              <Card className="bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-300 dark:border-blue-500/30">
                <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  🏦 Thông tin chuyển khoản
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Ngân hàng:</strong> Vietcombank
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Số tài khoản:</strong> 1234567890
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Chủ tài khoản:</strong> Tesla Dealer VN
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Nội dung:</strong> ORD-{String(formData.orderId).padStart(4, '0')}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <ActionBar align="right" className="mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/payments')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isSubmitting ? 'Đang ghi nhận...' : 'Ghi nhận thanh toán'}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default PaymentForm;