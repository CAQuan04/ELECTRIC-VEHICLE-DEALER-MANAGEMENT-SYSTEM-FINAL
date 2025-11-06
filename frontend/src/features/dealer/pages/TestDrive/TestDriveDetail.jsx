import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';
import { 
  PageContainer, 
  PageHeader, 
  Button, 
  Badge,
  InfoSection,
  InfoRow,
  ActionBar,
  Card
} from '../../components';
import { Car, Calendar, User, Phone, Mail, MessageSquare } from 'lucide-react';

const TestDriveDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [testDrive, setTestDrive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadTestDriveDetail();
  }, [id]);

  const loadTestDriveDetail = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getTestDriveById(id);
      if (result.success && result.data) {
        setTestDrive(result.data);
        setFeedback(result.data.feedback || '');
      } else {
        console.error('Failed to load test drive:', result.message);
        notifications.error('Lỗi', 'Không thể tải thông tin lịch lái thử');
        navigate('/dealer/test-drives');
      }
    } catch (error) {
      console.error('Error loading test drive:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu');
      navigate('/dealer/test-drives');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    notifications.confirm(
      'Xác nhận cập nhật',
      `Xác nhận cập nhật trạng thái thành "${getStatusLabel(newStatus)}"?`,
      async () => {
        try {
          const result = await dealerAPI.updateTestDriveStatus(id, newStatus);
          if (result.success) {
            notifications.success('Thành công', 'Cập nhật trạng thái thành công!');
            await loadTestDriveDetail();
          } else {
            notifications.error('Lỗi', result.message);
          }
        } catch (error) {
          console.error('Error updating status:', error);
          notifications.error('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
        }
      }
    );
  };

  const handleCancel = async () => {
    // TODO: Có thể thay prompt bằng modal input
    const reason = prompt('Lý do hủy lịch:');
    if (!reason) return;

    try {
      const result = await dealerAPI.cancelTestDrive(id, reason);
      if (result.success) {
        notifications.success('Thành công', 'Đã hủy lịch lái thử thành công!');
        await loadTestDriveDetail();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error cancelling test drive:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi hủy lịch');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      notifications.warning('Cảnh báo', 'Vui lòng nhập phản hồi');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const result = await dealerAPI.updateTestDriveFeedback(id, feedback);
      if (result.success) {
        notifications.success('Thành công', 'Đã lưu phản hồi thành công!');
        await loadTestDriveDetail();
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi lưu phản hồi');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return labelMap[status] || status;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Chi tiết lịch lái thử"
          icon={<Car className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải thông tin...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!testDrive) {
    return null;
  }

  return (
    <PageContainer>
      <PageHeader
        title="🚗 Chi tiết lịch lái thử"
        subtitle={`Mã lịch: TD-${String(testDrive.id).padStart(4, '0')}`}
        icon={<Car className="w-16 h-16" />}
        showBackButton
        onBack={() => navigate('/dealer/test-drives')}
        badge={
          <Badge variant={getStatusBadge(testDrive.status)}>
            {getStatusLabel(testDrive.status)}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <InfoSection 
            title="Thông tin khách hàng" 
            icon="👤"
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <InfoRow
              icon={<User className="w-5 h-5" />}
              label="Tên khách hàng"
              value={testDrive.customerName}
            />
            <InfoRow
              icon={<Phone className="w-5 h-5" />}
              label="Số điện thoại"
              value={testDrive.customerPhone}
            />
            {testDrive.customerEmail && (
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={testDrive.customerEmail}
              />
            )}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dealer/customers/${testDrive.customerId}`)}
              >
                👤 Xem hồ sơ khách hàng
              </Button>
            </div>
          </InfoSection>

          <InfoSection 
            title="Thông tin xe" 
            icon="🚗"
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <InfoRow
              icon={<Car className="w-5 h-5" />}
              label="Dòng xe"
              value={testDrive.vehicleModel}
            />
            {testDrive.vehicleColor && (
              <InfoRow
                label="Màu sắc"
                value={testDrive.vehicleColor}
              />
            )}
            {testDrive.vehicleYear && (
              <InfoRow
                label="Năm sản xuất"
                value={testDrive.vehicleYear}
              />
            )}
          </InfoSection>

          <InfoSection 
            title="Thông tin lịch hẹn" 
            icon="📅"
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <InfoRow
              icon={<Calendar className="w-5 h-5" />}
              label="Ngày"
              value={new Date(testDrive.scheduleDatetime).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
            <InfoRow
              label="Giờ"
              value={new Date(testDrive.scheduleDatetime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
            <InfoRow
              label="Thời lượng"
              value={`${testDrive.duration || 60} phút`}
            />
            {testDrive.dealerName && (
              <InfoRow
                label="Đại lý"
                value={testDrive.dealerName}
              />
            )}
            {testDrive.salesRepName && (
              <InfoRow
                label="Nhân viên phụ trách"
                value={testDrive.salesRepName}
              />
            )}
          </InfoSection>

          {testDrive.notes && (
            <InfoSection 
              title="Ghi chú" 
              icon="📝"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {testDrive.notes}
              </p>
            </InfoSection>
          )}

          {/* Feedback Section */}
          {(testDrive.status === 'completed' || testDrive.feedback) && (
            <InfoSection 
              title="Phản hồi sau lái thử" 
              icon="💬"
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all duration-300"
                  placeholder="Nhập phản hồi của khách hàng sau buổi lái thử..."
                  disabled={testDrive.status !== 'completed' || isSubmittingFeedback}
                />
                {testDrive.status === 'completed' && (
                  <Button
                    variant="primary"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmittingFeedback || !feedback.trim()}
                    icon={<MessageSquare className="w-5 h-5" />}
                  >
                    {isSubmittingFeedback ? 'Đang lưu...' : 'Lưu phản hồi'}
                  </Button>
                )}
              </div>
            </InfoSection>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/10 border-2 border-blue-300 dark:border-blue-500">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Trạng thái
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Hiện tại:</span>
                <Badge variant={getStatusBadge(testDrive.status)}>
                  {getStatusLabel(testDrive.status)}
                </Badge>
              </div>
              {testDrive.createdAt && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Ngày đăng ký:</span>
                  <br />
                  {new Date(testDrive.createdAt).toLocaleString('vi-VN')}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              ⚡ Hành động
            </h3>
            <div className="space-y-3">
              {testDrive.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleStatusUpdate('confirmed')}
                  >
                    ✓ Xác nhận lịch
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleCancel}
                  >
                    ✗ Hủy lịch
                  </Button>
                </>
              )}
              
              {testDrive.status === 'confirmed' && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleStatusUpdate('completed')}
                  >
                    ✓ Đánh dấu hoàn thành
                  </Button>
                  <Button
                    variant="warning"
                    className="w-full"
                    onClick={handleCancel}
                  >
                    ✗ Hủy lịch
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/dealer/customers/${testDrive.customerId}`)}
              >
                👤 Xem khách hàng
              </Button>

              {testDrive.status === 'completed' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate(`/dealer/orders/create?customerId=${testDrive.customerId}&vehicleId=${testDrive.vehicleId}`)}
                >
                  🛒 Tạo đơn hàng
                </Button>
              )}
            </div>
          </Card>

          {testDrive.status === 'cancelled' && testDrive.cancellationReason && (
            <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700">
              <h3 className="text-lg font-bold mb-3 text-red-700 dark:text-red-400">
                ❌ Lý do hủy
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                {testDrive.cancellationReason}
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default TestDriveDetail;