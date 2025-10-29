import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import {
  PageContainer,
  Badge,
  Button,
  DetailHeader,
  InfoSection,
  InfoRow,
  ListSection,
  ActionBar
} from '../../components';

const PromotionDetail = () => {
  const { promotionId } = useParams()
  const navigate = useNavigate()
  const { startLoading, stopLoading } = usePageLoading()
  const [promotion, setPromotion] = useState(null)

  useEffect(() => {
    loadPromotionDetail()
  }, [promotionId])

  const loadPromotionDetail = async () => {
    try {
      startLoading('Đang tải chi tiết khuyến mãi...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockPromotion = {
        id: promotionId,
        name: 'Khuyến mãi Model 3',
        type: 'Giảm giá',
        discount: '10%',
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        status: 'Đang diễn ra',
        description: 'Giảm giá 10% cho tất cả các dòng Model 3. Áp dụng cho tất cả các màu sắc và cấu hình.',
        terms: [
          'Áp dụng cho Model 3 Standard Range Plus',
          'Không áp dụng đồng thời với các chương trình khác',
          'Chỉ áp dụng cho xe có sẵn trong kho',
          'Số lượng có hạn'
        ],
        applicableVehicles: ['Model 3 Standard', 'Model 3 Long Range', 'Model 3 Performance']
      }

      setPromotion(mockPromotion)
    } catch (error) {
      console.error('Error loading promotion:', error)
    } finally {
      stopLoading()
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Đang diễn ra': 'success',
      'Sắp diễn ra': 'info',
      'Đã kết thúc': 'gray'
    };
    return statusMap[status] || 'gray';
  };

  if (!promotion) return null;

  return (
    <PageContainer>
      <DetailHeader
        title={promotion.name}
        onBack={() => navigate(-1)}
        badge={<Badge variant={getStatusBadge(promotion.status)}>{promotion.status}</Badge>}
        actions={
          <>
            <Button variant="secondary">📤 Chia sẻ</Button>
            <Button variant="gradient">✅ Áp dụng cho đơn hàng</Button>
          </>
        }
      />

      <div className="space-y-6">
        {/* Thông tin chung */}
        <InfoSection title="📋 Thông tin chung" icon="📋">
          <InfoRow label="Loại" value={promotion.type} icon="🏷️" />
          <InfoRow 
            label="Ưu đãi" 
            value={<span className="text-emerald-400">{promotion.discount}</span>}
            icon="💰"
          />
          <InfoRow 
            label="Thời gian" 
            value={`${promotion.startDate} ~ ${promotion.endDate}`}
            icon="📅"
          />
        </InfoSection>

        {/* Mô tả */}
        <InfoSection title="📝 Mô tả" icon="📝">
          <p className="text-gray-300 leading-relaxed">{promotion.description}</p>
        </InfoSection>

        {/* Điều kiện áp dụng */}
        <ListSection
          title="Điều kiện áp dụng"
          icon="✅"
          items={promotion.terms}
          itemIcon="✓"
        />

        {/* Xe áp dụng */}
        <InfoSection title="🚗 Xe áp dụng" icon="🚗">
          <div className="flex flex-wrap gap-3">
            {promotion.applicableVehicles.map((vehicle, index) => (
              <Badge key={index} variant="purple">
                {vehicle}
              </Badge>
            ))}
          </div>
        </InfoSection>

        {/* Action Bar */}
        <ActionBar align="right">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
          <Button variant="ghost">📋 Sao chép</Button>
          <Button variant="primary">✏️ Chỉnh sửa</Button>
        </ActionBar>
      </div>
    </PageContainer>
  );
};

export default PromotionDetail
