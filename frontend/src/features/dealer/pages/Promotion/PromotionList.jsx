import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  Plus,
  Search,
  Filter,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Gift,
  Package
} from 'lucide-react';

// Import components
import {
  PageContainer,
  PageHeader,
  SearchBar,
  Table,
  Badge,
  Button,
  EmptyState,
  MetricCard
} from '../../components';

const PromotionList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      startLoading('Đang tải danh sách khuyến mãi...');
      const result = await dealerAPI.getPromotions();
      
      if (result.success) {
        setPromotions(Array.isArray(result.data) ? result.data : []);
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

  // Filter promotions
  const filteredPromotions = useMemo(() => {
    let result = [...promotions];

    // Search filter
    if (searchTerm) {
      result = result.filter(promo =>
        promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.promoId?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(promo => promo.status === statusFilter);
    }

    // Type filter
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
      'Expired': { variant: 'danger', icon: <Clock size={14} />, text: 'Hết hạn' }
    };
    const badge = badges[status] || badges['Inactive'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  // Get discount type badge
  const getDiscountTypeBadge = (type, value) => {
    const badges = {
      'Percentage': { 
        variant: 'info', 
        icon: <Percent size={14} />, 
        text: `${value}%` 
      },
      'FixedAmount': { 
        variant: 'success', 
        icon: <DollarSign size={14} />, 
        text: `${value.toLocaleString('vi-VN')}đ` 
      },
      'Gift': { 
        variant: 'purple', 
        icon: <Gift size={14} />, 
        text: 'Quà tặng' 
      },
      'Bundle': { 
        variant: 'warning', 
        icon: <Package size={14} />, 
        text: 'Combo' 
      }
    };
    const badge = badges[type] || badges['Percentage'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  // Handle delete
  const handleDelete = async (promotionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      return;
    }

    try {
      startLoading('Đang xóa...');
      const result = await dealerAPI.deletePromotion(promotionId);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã xóa chương trình khuyến mãi');
        loadPromotions();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      notifications.error('Lỗi', 'Không thể xóa chương trình khuyến mãi');
    } finally {
      stopLoading();
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (promotionId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      startLoading('Đang cập nhật...');
      const result = await dealerAPI.updatePromotionStatus(promotionId, newStatus);
      
      if (result.success) {
        notifications.success('Thành công', `Đã ${newStatus === 'Active' ? 'kích hoạt' : 'tạm dừng'} chương trình`);
        loadPromotions();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.error('Lỗi', 'Không thể cập nhật trạng thái');
    } finally {
      stopLoading();
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'promoId',
      label: 'Mã',
      render: (value) => <span className="font-bold text-cyan-600 dark:text-cyan-400">#{value}</span>
    },
    {
      key: 'name',
      label: 'Tên chương trình',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {row.description || 'Không có mô tả'}
          </div>
        </div>
      )
    },
    {
      key: 'discountType',
      label: 'Loại giảm giá',
      render: (value, row) => getDiscountTypeBadge(value, row.discountValue)
    },
    {
      key: 'condition',
      label: 'Điều kiện',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {value || 'Không có điều kiện'}
          </p>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Thời gian',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">
            {value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            đến {row.endDate ? new Date(row.endDate).toLocaleDateString('vi-VN') : 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => navigate(`/dealer/promotions/${row.promoId}`)}
            icon={<Eye size={14} />}
          >
            Chi tiết
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/dealer/promotions/edit/${row.promoId}`)}
            icon={<Edit size={14} />}
          >
            Sửa
          </Button>
          {row.status !== 'Expired' && (
            <Button
              variant={row.status === 'Active' ? 'warning' : 'success'}
              size="sm"
              onClick={() => handleToggleStatus(row.promoId, row.status)}
            >
              {row.status === 'Active' ? 'Tạm dừng' : 'Kích hoạt'}
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.promoId)}
            icon={<Trash2 size={14} />}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="🎁 Quản lý khuyến mãi"
        description="Tạo và quản lý các chương trình khuyến mãi"
        action={
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
        <MetricCard
          title="Tổng chương trình"
          value={metrics.total}
          icon={<Tag className="w-8 h-8" />}
          variant="info"
        />
        <MetricCard
          title="Đang hiệu lực"
          value={metrics.active}
          icon={<CheckCircle className="w-8 h-8" />}
          variant="success"
        />
        <MetricCard
          title="Tạm dừng"
          value={metrics.inactive}
          icon={<XCircle className="w-8 h-8" />}
          variant="gray"
        />
        <MetricCard
          title="Hết hạn"
          value={metrics.expired}
          icon={<Clock className="w-8 h-8" />}
          variant="danger"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên, mô tả, mã..."
        />

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
            <Filter size={16} className="inline mr-2" />
            Loại giảm giá
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
          >
            <option value="all">Tất cả</option>
            <option value="Percentage">Theo phần trăm</option>
            <option value="FixedAmount">Giá trị cố định</option>
            <option value="Gift">Quà tặng</option>
            <option value="Bundle">Combo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
            <Filter size={16} className="inline mr-2" />
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
          >
            <option value="all">Tất cả</option>
            <option value="Active">Đang hiệu lực</option>
            <option value="Inactive">Tạm dừng</option>
            <option value="Expired">Hết hạn</option>
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
          description={searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
            ? "Không tìm thấy chương trình khuyến mãi phù hợp với bộ lọc"
            : "Bắt đầu bằng cách tạo chương trình khuyến mãi mới"}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/dealer/promotions/create')}
              icon={<Plus size={20} />}
            >
              Tạo chương trình đầu tiên
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default PromotionList;
