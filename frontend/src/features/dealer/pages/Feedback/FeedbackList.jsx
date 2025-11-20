import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  MessageSquarePlus,
  MessageSquare,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Clock,
  PlayCircle,
  CheckCircle2,
  Eye,
  Trash2,
  Bell
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

const FeedbackList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      startLoading('Đang tải danh sách phản hồi...');
      const result = await dealerAPI.getFeedbacks();
      
      if (result.success) {
        // Ensure data is an array
        setFeedbacks(Array.isArray(result.data) ? result.data : []);
      } else {
        notifications.error('Lỗi', result.message);
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      notifications.error('Lỗi', 'Không thể tải danh sách phản hồi');
      setFeedbacks([]);
    } finally {
      stopLoading();
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    // Search filter
    if (searchTerm) {
      result = result.filter(feedback =>
        feedback.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedbackId?.toString().includes(searchTerm)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(feedback => feedback.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(feedback => feedback.status === statusFilter);
    }

    return result;
  }, [feedbacks, searchTerm, typeFilter, statusFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const positive = feedbacks.filter(f => f.type === 'Positive').length;
    const complaints = feedbacks.filter(f => f.type === 'Complaint').length;
    const pending = feedbacks.filter(f => f.status === 'Pending').length;
    const inProgress = feedbacks.filter(f => f.status === 'InProgress').length;
    const resolved = feedbacks.filter(f => f.status === 'Resolved').length;

    return {
      total,
      positive,
      complaints,
      pending,
      inProgress,
      resolved
    };
  }, [feedbacks]);

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      'Positive': { variant: 'success', icon: <ThumbsUp size={14} />, text: 'Tích cực' },
      'Negative': { variant: 'warning', icon: <ThumbsDown size={14} />, text: 'Tiêu cực' },
      'Complaint': { variant: 'danger', icon: <AlertTriangle size={14} />, text: 'Khiếu nại' }
    };
    const badge = badges[type] || badges['Negative'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      'Pending': { variant: 'warning', icon: <Clock size={14} />, text: 'Chờ xử lý' },
      'InProgress': { variant: 'info', icon: <PlayCircle size={14} />, text: 'Đang xử lý' },
      'Resolved': { variant: 'success', icon: <CheckCircle2 size={14} />, text: 'Đã giải quyết' }
    };
    const badge = badges[status] || badges['Pending'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-1">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  // Handle view details
  const handleViewDetails = (feedbackId) => {
    navigate(`/dealer/feedback/${feedbackId}`);
  };

  // Handle delete
  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      return;
    }

    try {
      startLoading('Đang xóa...');
      const result = await dealerAPI.deleteFeedback(feedbackId);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã xóa phản hồi');
        loadFeedbacks();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      notifications.error('Lỗi', 'Không thể xóa phản hồi');
    } finally {
      stopLoading();
    }
  };

  // Handle send notification
  const handleNotify = async (feedbackId) => {
    try {
      startLoading('Đang gửi thông báo...');
      const result = await dealerAPI.notifyCustomerFeedback(feedbackId);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã gửi thông báo cho khách hàng');
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      notifications.error('Lỗi', 'Không thể gửi thông báo');
    } finally {
      stopLoading();
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'feedbackId',
      label: 'Mã',
      render: (value) => <span className="font-bold text-cyan-600 dark:text-cyan-400">#{value}</span>
    },
    {
      key: 'customerName',
      label: 'Khách hàng',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{value || 'N/A'}</div>
          {row.relatedOrderId && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Đơn hàng: #{row.relatedOrderId}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Loại',
      render: (value) => getTypeBadge(value)
    },
    {
      key: 'content',
      label: 'Nội dung',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {value || 'Không có nội dung'}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => handleViewDetails(row.feedbackId)}
            icon={<Eye size={14} />}
          >
            Chi tiết
          </Button>
          {row.status === 'Resolved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleNotify(row.feedbackId)}
              icon={<Bell size={14} />}
            >
              Thông báo
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.feedbackId)}
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
        title="📋 Quản lý phản hồi & khiếu nại"
        description="Tiếp nhận và xử lý phản hồi, khiếu nại từ khách hàng"
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/dealer/feedback/create')}
            icon={<MessageSquarePlus size={20} />}
          >
            Tạo phản hồi mới
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Tổng phản hồi"
          value={metrics.total}
          icon={<MessageSquare className="w-8 h-8" />}
          variant="info"
        />
        <MetricCard
          title="Tích cực"
          value={metrics.positive}
          icon={<ThumbsUp className="w-8 h-8" />}
          variant="success"
        />
        <MetricCard
          title="Khiếu nại"
          value={metrics.complaints}
          icon={<AlertTriangle className="w-8 h-8" />}
          variant="danger"
        />
        <MetricCard
          title="Chờ xử lý"
          value={metrics.pending}
          icon={<Clock className="w-8 h-8" />}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo khách hàng, nội dung, mã..."
        />

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
            <Filter size={16} className="inline mr-2" />
            Loại phản hồi
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
          >
            <option value="all">Tất cả</option>
            <option value="Positive">Tích cực</option>
            <option value="Negative">Tiêu cực</option>
            <option value="Complaint">Khiếu nại</option>
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
            <option value="Pending">Chờ xử lý</option>
            <option value="InProgress">Đang xử lý</option>
            <option value="Resolved">Đã giải quyết</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredFeedbacks.length > 0 ? (
        <Table
          columns={columns}
          data={filteredFeedbacks}
        />
      ) : (
        <EmptyState
          icon={<MessageSquare size={64} />}
          title="Chưa có phản hồi nào"
          description={searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
            ? "Không tìm thấy phản hồi phù hợp với bộ lọc" 
            : "Bắt đầu bằng cách tạo phản hồi mới"}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/dealer/feedback/create')}
              icon={<MessageSquarePlus size={20} />}
            >
              Tạo phản hồi đầu tiên
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default FeedbackList;
