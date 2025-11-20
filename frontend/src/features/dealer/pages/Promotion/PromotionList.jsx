import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@/utils/notifications'; // Sửa path import nếu cần
import { useAuth } from '@/context/AuthContext';
// Import Lucide icons
import {
  Plus, Search, Filter, Tag, CheckCircle, XCircle,
  Clock, Eye, Edit, Trash2, Percent, DollarSign, Gift, Package
} from 'lucide-react';

// Import components
import {
  PageContainer, PageHeader, SearchBar, Table,
  Badge, Button, EmptyState, MetricCard
} from '../../components';

const PromotionList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const { user } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (user?.dealerId) {
      loadPromotions();
    }
  }, [user?.dealerId]);

  const loadPromotions = async () => {
    try {
      startLoading('Đang tải danh sách khuyến mãi...');
      const params = { dealerId: user?.dealerId };
      const result = await dealerAPI.getPromotions(params);

      if (result.success) {
        // Đảm bảo luôn là mảng
        const list = Array.isArray(result.data) ? result.data : [];
        console.log('✅ Promotions API Data:', list); // Debug data từ API
        setPromotions(list);
      } else {
        notifications.error('Lỗi', result.message);
        setPromotions([]);
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      notifications.error('Lỗi', 'Không thể tải danh sách khuyến mãi');
      setPromotions([]);
    } finally {
      stopLoading();
    }
  };

  // --- 1. BỘ LỌC AN TOÀN ---
  const filteredPromotions = useMemo(() => {
    let result = [...promotions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(promo => {
        // ✅ FIX: Thêm promotionId vào đây luôn
        const id = promo.promotionId || promo.promoId || promo.id;

        return (
          (promo.name && promo.name.toLowerCase().includes(term)) ||
          (promo.description && promo.description.toLowerCase().includes(term)) ||
          (id && id.toString().includes(term))
        );
      });
    }
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(promo => promo.status === statusFilter);
    }

    // Type filter (Dùng camelCase theo Swagger)
    if (typeFilter !== 'all') {
      result = result.filter(promo => promo.discountType === typeFilter);
    }

    return result;
  }, [promotions, searchTerm, statusFilter, typeFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = promotions.length;
    const active = promotions.filter(p => p.status === 'Active').length;
    const inactive = promotions.filter(p => p.status === 'Inactive').length;
    const expired = promotions.filter(p => p.status === 'Expired').length;
    return { total, active, inactive, expired };
  }, [promotions]);

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Active': { variant: 'success', icon: <CheckCircle size={14} />, text: 'Đang hiệu lực' },
      'Inactive': { variant: 'gray', icon: <XCircle size={14} />, text: 'Ngừng hoạt động' },
      'Expired': { variant: 'danger', icon: <Clock size={14} />, text: 'Hết hạn' },
      'Draft': { variant: 'info', icon: <Edit size={14} />, text: 'Nháp' }
    };
    // Fallback
    const normalized = status === 'Đang diễn ra' ? 'Active' : status;
    const badge = badges[normalized] || badges['Inactive'];

    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">{badge.icon} {badge.text}</span>
      </Badge>
    );
  };

  // Get discount type badge
  const getDiscountTypeBadge = (type, value) => {
    const safeValue = value ? Number(value) : 0;
    const badges = {
      'Percentage': { variant: 'info', icon: <Percent size={14} />, text: `${safeValue}%` },
      'FixedAmount': { variant: 'success', icon: <DollarSign size={14} />, text: `${safeValue.toLocaleString('vi-VN')}đ` },
      'Gift': { variant: 'purple', icon: <Gift size={14} />, text: 'Quà tặng' },
      'Bundle': { variant: 'warning', icon: <Package size={14} />, text: 'Combo' }
    };
    const badge = badges[type] || badges['Percentage'];

    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">{badge.icon} {badge.text}</span>
      </Badge>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình này?')) return;
    try {
      startLoading('Đang xóa...');
      const result = await dealerAPI.deletePromotion(id);
      if (result.success) {
        notifications.success('Thành công', 'Đã xóa chương trình');
        loadPromotions();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      notifications.error('Lỗi', 'Không thể xóa chương trình');
    } finally {
      stopLoading();
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      startLoading('Đang cập nhật...');
      const result = await dealerAPI.updatePromotionStatus(id, newStatus);
      if (result.success) {
        notifications.success('Thành công', 'Đã cập nhật trạng thái');
        loadPromotions();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      notifications.error('Lỗi', 'Không thể cập nhật trạng thái');
    } finally {
      stopLoading();
    }
  };

  const columns = [
    {
      key: 'col_id',
      label: 'Mã',
      render: (row) => {
        // ✅ FIX: Thêm row.promotionId vào danh sách tìm kiếm
        const id = row.promotionId || row.promoId || row.id || row.promo_id;
        return <span className="font-bold text-cyan-600">#{id || '???'}</span>;
      }
    },
    {
      key: 'name',
      label: 'Tên chương trình',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {row.description || 'Không có mô tả'}
          </div>
        </div>
      )
    },
    {
      key: 'discountType',
      label: 'Loại giảm giá',
      // Log cho thấy: discountType="FixedAmount", discountValue=1000000 -> CamelCase đúng rồi
      render: (row) => getDiscountTypeBadge(row.discountType, row.discountValue)
    },
    {
      key: 'startDate',
      label: 'Thời gian',
      // Log cho thấy: startDate="2025-11-22" -> CamelCase đúng rồi
      render: (row) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">
            {row.startDate ? new Date(row.startDate).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
          <div className="text-gray-500">
            đến {row.endDate ? new Date(row.endDate).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => {
        // ✅ FIX QUAN TRỌNG: Thêm row.promotionId vào đây để nút bấm hoạt động
        const id = row.promotionId || row.promoId || row.id || row.promo_id;

        if (!id) return <span className="text-xs text-red-500 font-bold">Thiếu ID</span>;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="info"
              size="sm"
              onClick={() => navigate(`/dealer/promotions/${id}`)}
              icon={<Eye size={14} />}
            >
              Chi tiết
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/dealer/promotions/edit/${id}`)}
              icon={<Edit size={14} />}
            >
              Sửa
            </Button>

            {row.status !== 'Expired' && (
              <Button
                variant={row.status === 'Active' ? 'warning' : 'success'}
                size="sm"
                onClick={() => handleToggleStatus(id, row.status)}
              >
                {row.status === 'Active' ? 'Tạm dừng' : 'Kích hoạt'}
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(id)}
              icon={<Trash2 size={14} />}
            >
              Xóa
            </Button>
          </div>
        );
      }
    }
  ];
  return (
    <PageContainer>
      <PageHeader
        title="🎁 Quản lý khuyến mãi"
        description="Tạo và quản lý các chương trình khuyến mãi"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/dealer/promotions/create')}
            icon={<Plus size={20} />}
          >
            Tạo khuyến mãi mới
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Tổng chương trình" value={metrics.total} icon={<Tag className="w-8 h-8" />} variant="info" />
        <MetricCard title="Đang hiệu lực" value={metrics.active} icon={<CheckCircle className="w-8 h-8" />} variant="success" />
        <MetricCard title="Tạm dừng" value={metrics.inactive} icon={<XCircle className="w-8 h-8" />} variant="gray" />
        <MetricCard title="Hết hạn" value={metrics.expired} icon={<Clock className="w-8 h-8" />} variant="danger" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên, mô tả..."
        />
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">Tất cả loại</option>
            <option value="Percentage">Phần trăm</option>
            <option value="FixedAmount">Số tiền</option>
          </select>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Hiệu lực</option>
            <option value="Inactive">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredPromotions.length > 0 ? (
        <Table
          columns={columns}
          data={filteredPromotions}
        />
      ) : (
        <EmptyState
          icon={<Tag size={64} />}
          title="Chưa có chương trình khuyến mãi nào"
          description="Thử thay đổi bộ lọc hoặc tạo mới."
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/dealer/promotions/create')}
              icon={<Plus size={20} />}
            >
              Tạo mới
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default PromotionList;