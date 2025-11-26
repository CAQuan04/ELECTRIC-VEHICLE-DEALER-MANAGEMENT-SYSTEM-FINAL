import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@/utils/notifications';
// Import các icon cần thiết
import { ArrowLeft, Tag, Calendar, DollarSign, FileText, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  PageContainer,
  Badge,
  Button,
  // DetailHeader, // Nếu project không có component này thì dùng PageHeader
  PageHeader,
  InfoSection,
  InfoRow,
  ListSection,
  ActionBar
} from '../../components';

const PromotionDetail = () => {
  // 🛡️ FIX 1: Lấy đúng tên tham số từ URL (khớp với App.jsx: path="/.../:promoId")
  const { promoId } = useParams(); 
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [promotion, setPromotion] = useState(null);
  const { user } = useAuth();
  const dealerId = user?.dealerId;

  useEffect(() => {
    if (promoId && dealerId) {
      loadPromotionDetail();
    }
  }, [promoId, dealerId]);

  const loadPromotionDetail = async () => {
    try {
      startLoading('Đang tải chi tiết khuyến mãi...');
      
      // Gọi API với ID lấy từ URL
      const result = await dealerAPI.getPromotionById(promoId);

      if (result.success && result.data) {
        console.log('✅ Promotion Detail Data:', result.data); // Debug data
        setPromotion(result.data);
      } else {
        notifications.error('Lỗi', result.message || 'Không tìm thấy khuyến mãi');
        navigate('/dealer/promotions');
      }
    } catch (error) {
      console.error('Error loading promotion:', error);
      notifications.error('Lỗi hệ thống', 'Không thể tải chi tiết khuyến mãi');
    } finally {
      stopLoading();
    }
  };

  const getStatusBadge = (status) => {
    // Fallback cho các trường hợp status khác nhau
    const map = {
      'Active': { variant: 'success', text: 'Đang hiệu lực', icon: <CheckCircle size={14} /> },
      'Inactive': { variant: 'gray', text: 'Tạm dừng', icon: <XCircle size={14} /> },
      'Expired': { variant: 'danger', text: 'Hết hạn', icon: <Clock size={14} /> },
      'Draft': { variant: 'info', text: 'Nháp', icon: <Edit size={14} /> }
    };
    
    const normalized = status === 'Đang diễn ra' ? 'Active' : status;
    const item = map[normalized] || map['Inactive'];

    return (
      <Badge variant={item.variant}>
        <span className="flex items-center gap-1">
          {item.icon} {item.text}
        </span>
      </Badge>
    );
  };

  const formatDiscount = (type, value) => {
    if (!value) return '0';
    const numValue = Number(value);
    
    if (type === 'Percentage') return `${numValue}%`;
    if (type === 'FixedAmount') return `${numValue.toLocaleString('vi-VN')} đ`;
    return value; // Gift, Bundle...
  };

  // Nếu chưa có dữ liệu thì return null hoặc loading
  if (!promotion) return null;

  // 🛡️ FIX 2: Lấy ID an toàn để dùng cho nút Edit
  const currentId = promotion.promotionId || promotion.promoId || promotion.id || promoId;

  return (
    <PageContainer>
      <PageHeader
        title={promotion.name || 'Chi tiết khuyến mãi'}
        subtitle={`Mã chương trình: #${currentId}`}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/dealer/promotions')}>
              <ArrowLeft size={18} className="mr-2" /> Quay lại
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate(`/${dealerId}/dealer/promotions/edit/${currentId}`)}
              icon={<Edit size={18} />}
            >
              Chỉnh sửa
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Thông tin chung */}
        <InfoSection title="Thông tin chung" icon={<FileText size={20} />}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {/* 🛡️ FIX 3: Dùng CamelCase (discountType, status...) khớp với API */}
              <InfoRow 
                label="Trạng thái" 
                value={getStatusBadge(promotion.status)} 
              />
              <InfoRow 
                label="Loại khuyến mãi" 
                value={promotion.discountType} 
                icon={<Tag size={16} />} 
              />
              <InfoRow 
                label="Giá trị ưu đãi" 
                value={<span className="text-emerald-600 font-bold text-lg">{formatDiscount(promotion.discountType, promotion.discountValue)}</span>}
                icon={<DollarSign size={16} />}
              />
              <InfoRow 
                label="Thời gian áp dụng" 
                value={
                  <span className="font-medium">
                    {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString('vi-VN') : 'N/A'} 
                    {' - '} 
                    {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                }
                icon={<Calendar size={16} />}
              />
           </div>
        </InfoSection>

        {/* Mô tả */}
        <InfoSection title="Mô tả chi tiết" icon={<FileText size={20} />}>
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {promotion.description || 'Không có mô tả.'}
            </p>
          </div>
        </InfoSection>

        {/* Điều kiện áp dụng (Nếu có) */}
        {promotion.terms && promotion.terms.length > 0 && (
          <ListSection
            title="Điều kiện áp dụng"
            items={promotion.terms}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default PromotionDetail;