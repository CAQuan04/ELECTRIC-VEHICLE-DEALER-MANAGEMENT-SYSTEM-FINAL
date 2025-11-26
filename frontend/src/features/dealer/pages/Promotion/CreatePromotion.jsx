import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@/utils/notifications';
import { Save, ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  PageContainer, PageHeader, Button, FormGroup, Label, Input, Select, Textarea, InfoSection, ActionBar
} from '../../components';

const CreatePromotion = () => {
  const navigate = useNavigate();
  const { promoId } = useParams(); // Lấy ID từ URL
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  const { user } = useAuth();
  
  const isEditMode = !!promoId; // Có ID => Chế độ Edit

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'Percentage',
    discountValue: 0,
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const dealerId = user?.dealerId;
  // Load dữ liệu khi vào trang Edit
  useEffect(() => {
    if (isEditMode, dealerId) {
      loadPromotionData();
    }
  }, [dealerId, promoId]);

  const loadPromotionData = async () => {
    try {
      startLoading('Đang tải dữ liệu...');
      console.log('🔍 Fetching promotion:', promoId);
      const result = await dealerAPI.getPromotionById(promoId);

      if (result.success && result.data) {
        const data = result.data;
        console.log("📥 Data received in Component:", data); // Debug

        setFormData({
          name: data.name || '',
          description: data.description || '',
          discountType: data.discountType || 'Percentage', // Swagger trả về CamelCase
          discountValue: data.discountValue || 0,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          status: data.status || 'Active'
        });
      } else {
        notifications.error('Lỗi', 'Không tìm thấy khuyến mãi');
        // 🛑 Nếu muốn debug lỗi, hãy tạm comment dòng navigate này lại
        //navigate('/dealer/promotions');
      }
    } catch (error) {
      console.error(error);
      notifications.error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      stopLoading();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (Logic validateForm giữ nguyên như cũ) ...

    try {
      startLoading(isEditMode ? 'Đang cập nhật...' : 'Đang tạo mới...');

      const payload = {
        name: formData.name,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status
      };

      let result;
      if (isEditMode) {
        result = await dealerAPI.updatePromotion(promoId, payload);
      } else {
        result = await dealerAPI.createPromotion(payload);
      }

      if (result.success) {
        notifications.success('Thành công', isEditMode ? 'Đã cập nhật' : 'Đã tạo mới');
        navigate('/dealer/promotions');
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      notifications.error('Lỗi hệ thống', 'Đã xảy ra lỗi');
    } finally {
      stopLoading();
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={isEditMode ? "✏️ Chỉnh sửa khuyến mãi" : "✨ Tạo khuyến mãi mới"}
        subtitle={isEditMode ? `Cập nhật thông tin chương trình #${promoId}` : "Thiết lập chương trình ưu đãi cho khách hàng"}
        actions={
          <Button variant="ghost" onClick={() => navigate(`/${dealerId}/dealer/promotions`)}>
            <ArrowLeft size={18} className="mr-2" /> Quay lại
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <InfoSection title="Thông tin cơ bản" icon="📋">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormGroup>
              <Label required>Tên chương trình</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Ưu đãi mùa hè 2025"
                error={errors.name}
              />
            </FormGroup>

            <FormGroup>
              <Label>Trạng thái</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'Active', label: 'Đang hiệu lực' },
                  { value: 'Inactive', label: 'Tạm dừng' },
                  { value: 'Draft', label: 'Nháp' }
                ]}
              />
            </FormGroup>

            <div className="md:col-span-2">
              <FormGroup>
                <Label>Mô tả chi tiết</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Nhập chi tiết về chương trình khuyến mãi..."
                />
              </FormGroup>
            </div>
          </div>
        </InfoSection>

        <InfoSection title="Thiết lập giảm giá" icon="💰">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormGroup>
              <Label required>Loại giảm giá</Label>
              <Select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                options={[
                  { value: 'Percentage', label: 'Theo phần trăm (%)' },
                  { value: 'FixedAmount', label: 'Số tiền cố định (VNĐ)' },
                  { value: 'Gift', label: 'Quà tặng' },
                  { value: 'Bundle', label: 'Combo sản phẩm' }
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Label required>
                {formData.discountType === 'Percentage' ? 'Giá trị (%)' : 'Giá trị giảm (VNĐ)'}
              </Label>
              <Input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                step={formData.discountType === 'Percentage' ? "0.01" : "1000"}
                placeholder="Nhập giá trị..."
                error={errors.discountValue}
              />
              {formData.discountType === 'Percentage' && (
                <span className="text-xs text-gray-500 mt-1">Nhập 10 cho 10%, 0.05 cho 0.05%...</span>
              )}
            </FormGroup>
          </div>
        </InfoSection>

        <InfoSection title="Thời gian áp dụng" icon="📅">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormGroup>
              <Label required>Ngày bắt đầu</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
              />
            </FormGroup>

            <FormGroup>
              <Label required>Ngày kết thúc</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
              />
            </FormGroup>
          </div>
        </InfoSection>

        <ActionBar align="right" className="mt-6">
          <Button type="button" variant="ghost" onClick={() => navigate(`/${dealerId}/dealer/promotions`)}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="gradient"
            icon={isEditMode ? <Edit size={18} /> : <Save size={18} />}
            disabled={isLoading}
          >
            {isLoading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi')}
          </Button>
        </ActionBar>
      </form>
    </PageContainer>
  );
};

export default CreatePromotion;