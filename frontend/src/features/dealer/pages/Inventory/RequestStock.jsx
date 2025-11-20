import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api';

import Button from '@/features/dealer/components/ui/Button'; 
import {
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
} from '@/features/dealer/components/ui/FormComponents'; 
import {
  DetailHeader,
  InfoSection,
  ActionBar,
} from '@/features/dealer/components/ui/AdvancedComponents'; 

// Component này nằm cùng cấp, không phải trong 'ui'
import RequestStockConfirmationModal from '@/features/dealer/components/RequestStockConfirmationModal.jsx';
const usePageLoading = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  return {
    isLoading: loading,
    loadingMessage: message,
    startLoading: (msg = 'Đang tải...') => {
      setMessage(msg);
      setLoading(true);
    },
    stopLoading: () => setLoading(false),
  };
};

const RequestStockPage = () => {
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    notes: '',
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  
  // State để quản lý modal xác nhận
  const [isConfirming, setIsConfirming] = useState(false);

  // --- 1. NẠP DỮ LIỆU ĐỘNG (XE) TỪ API ---
  useEffect(() => {
    const fetchVehicles = async () => {
      startLoading('Đang tải danh sách xe...');
      try {
        const result = await dealerAPI.getVehicles();
        if (result.success && result.data) {
          const vehicleList = Array.isArray(result.data) ? result.data : result.data.data || [];
          setVehicles(vehicleList);
        } else {
          throw new Error(result.message || 'Không thể tải danh sách xe');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách xe:', error);
        alert('Không thể tải danh sách xe từ máy chủ.');
      }
      stopLoading();
    };
    
    fetchVehicles();
  }, []); // Chỉ chạy 1 lần

  // --- 2. XỬ LÝ FORM ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId) {
      newErrors.productId = 'Vui lòng chọn một dòng xe.';
    }
    if (formData.quantity < 1) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm này chỉ mở modal
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirming(true); // Mở dialog xác nhận
    }
  };

  // --- 3. XỬ LÝ GỌI API (Được gọi bởi Modal) ---
  
  /**
   * Hàm này được truyền vào modal và sẽ được gọi khi
   * người dùng nhấn "Xác nhận & Gửi" bên trong modal.
   * @param {string} password - Mật khẩu nhận được từ modal
   */
  const handleFinalSubmit = async (password) => {
    startLoading('Đang gửi yêu cầu...');

    // TODO: Thêm bước xác thực mật khẩu nếu API yêu cầu
    // Ví dụ: const authResult = await authAPI.verifyPassword(password);
    // if (!authResult.success) { 
    //   alert('Mật khẩu không đúng!');
    //   stopLoading();
    //   return; 
    // }

    try {
      const requestData = {
        productId: formData.productId,
        quantity: parseInt(formData.quantity, 10),
        notes: formData.notes,
        // Thêm password nếu API 'requestStock' yêu cầu
        // password: password 
      };

      // Gọi API requestStock từ dealer.api.js
      const response = await dealerAPI.requestStock(requestData);

      stopLoading();
      setIsConfirming(false); // Đóng modal
      alert('Yêu cầu nhập xe đã được gửi thành công!');
      navigate('/dealer/inventory');

    } catch (error) {
      stopLoading();
      // Không đóng modal nếu lỗi, để người dùng thử lại
      console.error('Lỗi khi gửi yêu cầu nhập kho:', error);
      alert(
        error.response?.data?.message ||
        'Có lỗi xảy ra. Vui lòng thử lại!'
      );
    }
  };

  // --- 4. RENDER GIAO DIỆN ---
  
  const vehicleOptions = vehicles.map((v) => ({
    label: `${v.name} - ${v.color || 'N/A'} (Tồn: ${v.stock || 0})`,
    value: v.id,
  }));

  const selectedVehicle = vehicles.find(v => v.id === formData.productId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      
      <DetailHeader
        title="📝 Yêu cầu nhập xe"
        subtitle="Tạo yêu cầu nhập xe mới từ EVM"
        onBack={() => navigate(-1)}
      />

      {/* === FORM CHÍNH === */}
      <form onSubmit={handleSubmitRequest}>
        <InfoSection title="Thông tin yêu cầu" icon="📦">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormGroup>
              <Label htmlFor="productId" required>Dòng xe & Màu sắc</Label>
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
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Thêm ghi chú nếu cần..."
              />
            </FormGroup>
          </div>
        </InfoSection>

        {/* === NÚT GỬI === */}
        <ActionBar align="right" className="mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
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

      {/* === DIALOG XÁC NHẬN (Đã được tách) === */}
      <RequestStockConfirmationModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={handleFinalSubmit}
        isLoading={isLoading}
        selectedVehicle={selectedVehicle}
        quantity={formData.quantity}
      />
    </div>
  );
};

export default RequestStockPage;