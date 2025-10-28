import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import {
  PageContainer,
  PageHeader,
  Badge,
  Button,
  GridCard
} from '../../components';

const PromotionList = () => {
  const navigate = useNavigate()
  const { startLoading, stopLoading } = usePageLoading()
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      startLoading('Đang tải danh sách khuyến mãi...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockPromotions = [
        { id: 1, name: 'Ưu đãi cuối năm 2025', type: 'Giảm giá', discount: '10%', startDate: '2025-11-01', endDate: '2025-12-31', status: 'Sắp diễn ra' },
        { id: 2, name: 'Khuyến mãi Model 3', type: 'Quà tặng', discount: 'Phụ kiện miễn phí', startDate: '2025-10-01', endDate: '2025-10-31', status: 'Đang diễn ra' },
        { id: 3, name: 'Flash Sale Tháng 9', type: 'Giảm giá', discount: '50 triệu', startDate: '2025-09-01', endDate: '2025-09-30', status: 'Đã kết thúc' }
      ]

      setPromotions(mockPromotions)
    } catch (error) {
      console.error('Error loading promotions:', error)
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

  return (
    <PageContainer>
      <PageHeader
        title="🎁 Quản lý khuyến mãi"
        subtitle="Tạo và quản lý các chương trình khuyến mãi"
        actions={
          <Button variant="gradient" onClick={() => navigate('/dealer/promotions/new')}>
            + Tạo khuyến mãi mới
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promo => (
          <GridCard
            key={promo.id}
            onClick={() => navigate(`/dealer/promotions/${promo.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{promo.name}</h3>
              <Badge variant={getStatusBadge(promo.status)}>
                {promo.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-gray-400 text-sm">
                <span className="font-semibold">Loại:</span> {promo.type}
              </p>
              <p className="text-emerald-400 text-lg font-bold">
                💰 {promo.discount}
              </p>
              <p className="text-gray-400 text-sm">
                📅 {promo.startDate} ~ {promo.endDate}
              </p>
            </div>

            <Button variant="primary" className="w-full">
              Xem chi tiết →
            </Button>
          </GridCard>
        ))}
      </div>
    </PageContainer>
  );
};

export default PromotionList
