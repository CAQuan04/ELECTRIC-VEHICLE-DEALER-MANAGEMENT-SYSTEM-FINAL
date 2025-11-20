import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js'; // Giữ nguyên API import
import { usePageLoading } from '@modules/loading';

// 1. CHUẨN HÓA IMPORTS (Giống hệt CustomerList.jsx)
// Giả định rằng các component này đều được export từ file index của components
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
} from '../../components'; // Sửa: Dùng import chuẩn của dự án

// Import Modal xác nhận (đường dẫn này là giả định, hãy kiểm tra lại)
import RequestStockConfirmationModal from '@/features/dealer/components/RequestStockConfirmationModal.jsx';

const CreatePurchaseRequest = () => {
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    priority: 'Bình thường',
    reason: '',
    notes: '',
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);

  // Tải danh sách xe
  useEffect(() => {
    const fetchVehicles = async () => {
      startLoading('Đang tải danh sách xe...');
      try {
        const result = await dealerAPI.getVehicles();
        if (result && result.success && result.data) {
          // Backend returns PagedResult: { items: [], pagination: {} }
          const vehicleList = result.data.items || [];
          setVehicles(vehicleList);
        } else {
          const errorMsg = result?.message || 'Không thể tải danh sách xe';
          console.error('Lỗi khi tải danh sách xe:', errorMsg);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách xe:', error.message || error);
      } finally {
        stopLoading();
      }
    };
    
    fetchVehicles();
  }, [startLoading, stopLoading]);

  // Xử lý Form (Logic giữ nguyên)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = 'Vui lòng chọn xe.';
    if (formData.quantity < 1) newErrors.quantity = 'Số lượng phải lớn hơn 0.';
    if (!formData.reason) newErrors.reason = 'Vui lòng nhập lý do.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirming(true);
    }
  };

  // Xử lý API (Logic giữ nguyên)
  const handleFinalSubmit = async (password) => {
    startLoading('Đang gửi yêu cầu...');
    try {
      const requestData = {
        productId: formData.productId,
        quantity: parseInt(formData.quantity, 10),
        notes: `Lý do: ${formData.reason}. Ghi chú: ${formData.notes}`,
        priority: formData.priority,
      };
      await dealerAPI.requestStock(requestData);
      stopLoading();
      setIsConfirming(false);
      alert('Tạo yêu cầu mua hàng thành công!');
      navigate('/dealer/purchase-requests');
    } catch (error) {
      stopLoading();
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  // 4. Render
  const vehicleOptions = vehicles.map((v) => ({
    label: `${v.brand || ''} ${v.model || 'N/A'}`,
    value: v.vehicleId,
  }));
  
  const selectedVehicle = vehicles.find(v => v.vehicleId === formData.productId);

  // 2. SỬ DỤNG PAGE CONTAINER LÀM GỐC (Giống CustomerList)
  return (
    <PageContainer>
      {/* 3. SỬ DỤNG PAGEHEADER (Giống CustomerList) */}
      <PageHeader
        title="📝 Tạo Yêu cầu Mua hàng"
        subtitle="Gửi yêu cầu nhập xe mới đến EVM"
        // Thêm nút "Quay lại" vào đây cho nhất quán
        actions={
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/purchase-requests')}
            disabled={isLoading}
          >
            ← Quay lại
          </Button>
        }
      />

      {/* Phần form sẽ nằm bên trong PageContainer. 
        PageContainer sẽ tự động xử lý chiều rộng, 
        ngăn không cho form tràn ra ngoài.
      */}
      <form onSubmit={handleSubmitRequest}>
        <InfoSection title="Thông tin yêu cầu" icon="📦">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormGroup>
              <Label htmlFor="productId" required>Dòng xe</Label>
              <Select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                options={vehicleOptions}
                placeholder="-- Chọn xe cần nhập --"
                error={errors.productId}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="quantity" required>Số lượng</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                error={errors.quantity}
              />
            </FormGroup>
          </div>

          <div className="p-4 pt-0">
            <FormGroup>
              <Label htmlFor="priority" required>Mức độ ưu tiên</Label>
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: 'Bình thường', label: 'Bình thường' },
                  { value: 'Cao', label: 'Cao' },
                  { value: 'Khẩn cấp', label: 'Khẩn cấp' },
                ]}
                error={errors.priority}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="reason" required>Lý do yêu cầu</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="Ví dụ: Bổ sung kho, Yêu cầu đặc biệt của khách,..."
                error={errors.reason}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Ghi chú (Không bắt buộc)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Thông tin bổ sung..."
              />
            </FormGroup>
          </div>
        </InfoSection>

        <ActionBar align="right" className="mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dealer/purchase-requests')}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
          </Button>
        </ActionBar>
      </form>

      {/* Modal Xác nhận (Giữ nguyên) */}
      <RequestStockConfirmationModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleFinalSubmit}
        isLoading={isLoading}
        selectedVehicle={selectedVehicle}
        quantity={formData.quantity}
      />
    </PageContainer>
  );
};

export default CreatePurchaseRequest;