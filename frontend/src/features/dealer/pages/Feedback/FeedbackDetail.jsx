import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  ArrowLeft,
  Edit,
  Bell,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  AlertTriangle,
  ShoppingCart,
  Clock,
  FileText,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  PlayCircle
} from 'lucide-react';

// Import components
import {
  PageContainer,
  PageHeader,
  Button,
  Badge,
  InfoSection,
  FormGroup,
  Label
} from '../../components';

const FeedbackDetail = () => {
  const navigate = useNavigate();
  const { feedbackId } = useParams();
  const { startLoading, stopLoading } = usePageLoading();
  
  const [feedback, setFeedback] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadFeedbackDetail();
  }, [feedbackId]);

  const loadFeedbackDetail = async () => {
    try {
      startLoading('Đang tải thông tin phản hồi...');
      
      const result = await dealerAPI.getFeedbackById(feedbackId);
      
      if (result.success && result.data) {
        setFeedback(result.data);
        setNewStatus(result.data.status);
      } else {
        notifications.error('Lỗi', result.message || 'Không thể tải thông tin phản hồi');
        navigate('/dealer/feedback');
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      notifications.error('Lỗi', 'Không thể tải thông tin phản hồi');
      navigate('/dealer/feedback');
    } finally {
      stopLoading();
    }
  };

  const handleUpdateStatus = async () => {
    if (newStatus === feedback.status && !statusNote.trim()) {
      notifications.warning('Cảnh báo', 'Vui lòng thay đổi trạng thái hoặc thêm ghi chú');
      return;
    }

    try {
      setIsUpdatingStatus(true);
      startLoading('Đang cập nhật trạng thái...');
      
      const result = await dealerAPI.updateFeedbackStatus(feedbackId, newStatus, statusNote);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã cập nhật trạng thái');
        setStatusNote('');
        loadFeedbackDetail();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.error('Lỗi', 'Không thể cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
      stopLoading();
    }
  };

  const handleNotify = async () => {
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

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      return;
    }

    try {
      startLoading('Đang xóa...');
      const result = await dealerAPI.deleteFeedback(feedbackId);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã xóa phản hồi');
        navigate('/dealer/feedback');
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

  const getTypeBadge = (type) => {
    const badges = {
      'Positive': { variant: 'success', icon: <ThumbsUp size={16} />, text: 'Tích cực' },
      'Negative': { variant: 'warning', icon: <ThumbsDown size={16} />, text: 'Tiêu cực' },
      'Complaint': { variant: 'danger', icon: <AlertTriangle size={16} />, text: 'Khiếu nại' }
    };
    const badge = badges[type] || badges['Negative'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-2">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': { variant: 'warning', icon: <Clock size={16} />, text: 'Chờ xử lý' },
      'InProgress': { variant: 'info', icon: <PlayCircle size={16} />, text: 'Đang xử lý' },
      'Resolved': { variant: 'success', icon: <CheckCircle2 size={16} />, text: 'Đã giải quyết' }
    };
    const badge = badges[status] || badges['Pending'];
    
    return (
      <Badge variant={badge.variant}>
        <span className="flex items-center gap-2">
          {badge.icon}
          {badge.text}
        </span>
      </Badge>
    );
  };

  if (!feedback) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`📋 Chi tiết phản hồi #${feedbackId}`}
        description="Xem và xử lý thông tin phản hồi/khiếu nại"
        onBack={() => navigate('/dealer/feedback')}
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/dealer/feedback/edit/${feedbackId}`)}
              icon={<Edit size={18} />}
            >
              Chỉnh sửa
            </Button>
            {feedback.status === 'Resolved' && (
              <Button
                variant="info"
                onClick={handleNotify}
                icon={<Bell size={18} />}
              >
                Gửi thông báo
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleDelete}
              icon={<Trash2 size={18} />}
            >
              Xóa
            </Button>
          </div>
        }
      />

      {/* Feedback Overview */}
      <InfoSection title="📊 Tổng quan" icon={<MessageSquare size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Mã phản hồi
            </div>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              #{feedback.feedbackId}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Loại
            </div>
            <div className="mt-1">
              {getTypeBadge(feedback.type)}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Trạng thái
            </div>
            <div className="mt-1">
              {getStatusBadge(feedback.status)}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Ngày tạo
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </InfoSection>

      {/* Customer Information */}
      <InfoSection title="👤 Thông tin khách hàng" icon={<User size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <User size={16} />
              Tên khách hàng
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {feedback.customerName || 'N/A'}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {feedback.customerEmail || 'N/A'}
            </div>
          </div>

          {feedback.customerPhone && (
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Số điện thoại
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300">
                {feedback.customerPhone}
              </div>
            </div>
          )}

          {feedback.relatedOrderId && (
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <ShoppingCart size={16} />
                Đơn hàng liên quan
              </div>
              <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                #{feedback.relatedOrderId}
              </div>
            </div>
          )}
        </div>
      </InfoSection>

      {/* Feedback Content */}
      <InfoSection title="💬 Nội dung phản hồi" icon={<FileText size={20} />}>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {feedback.content || 'Không có nội dung'}
          </p>
        </div>
      </InfoSection>

      {/* Processing Note */}
      {feedback.note && (
        <InfoSection title="📝 Ghi chú xử lý" icon={<FileText size={20} />}>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {feedback.note}
            </p>
          </div>
        </InfoSection>
      )}

      {/* Update Status */}
      <InfoSection title="⚙️ Cập nhật trạng thái xử lý" icon={<Clock size={20} />}>
        <div className="space-y-6">
          <FormGroup>
            <Label style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
              <Clock size={16} className="inline mr-2" />
              Trạng thái mới
            </Label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
            >
              <option value="Pending">⏳ Chờ xử lý</option>
              <option value="InProgress">⚙️ Đang xử lý</option>
              <option value="Resolved">✅ Đã giải quyết</option>
            </select>
          </FormGroup>

          <FormGroup>
            <Label style={{ paddingTop: '0.25rem', paddingBottom: '0.5rem' }}>
              <FileText size={16} className="inline mr-2" />
              Ghi chú cập nhật
            </Label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={4}
              placeholder="Nhập ghi chú về việc cập nhật trạng thái..."
              className="w-full px-6 py-4 rounded-2xl dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
            />
          </FormGroup>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus}
              icon={isUpdatingStatus ? null : <CheckCircle2 size={18} />}
            >
              {isUpdatingStatus ? '⏳ Đang cập nhật...' : 'Cập nhật trạng thái'}
            </Button>
          </div>
        </div>
      </InfoSection>

      {/* Timeline (if available) */}
      {feedback.updatedAt && (
        <InfoSection title="⏰ Lịch sử" icon={<Calendar size={20} />}>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-white">Phản hồi được tạo</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-white">Cập nhật gần nhất</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(feedback.updatedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        </InfoSection>
      )}
    </PageContainer>
  );
};

export default FeedbackDetail;
