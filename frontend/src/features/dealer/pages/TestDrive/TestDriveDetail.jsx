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
  
  // State cho thời gian thực tế (quản lý ở frontend)
  const [actualStartTime, setActualStartTime] = useState(null);
  const [actualEndTime, setActualEndTime] = useState(null);
  const [durationMinutes, setDurationMinutes] = useState(null);

  useEffect(() => {
    loadTestDriveDetail();
    // Load thời gian từ localStorage nếu có
    loadTimingDataFromStorage();
  }, [id]);

  // Load thời gian đã lưu từ localStorage
  const loadTimingDataFromStorage = () => {
    const storageKey = `testdrive_timing_${id}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const { actualStartTime, actualEndTime, durationMinutes } = JSON.parse(savedData);
        setActualStartTime(actualStartTime ? new Date(actualStartTime) : null);
        setActualEndTime(actualEndTime ? new Date(actualEndTime) : null);
        setDurationMinutes(durationMinutes);
      } catch (error) {
        console.error('Error loading timing data:', error);
      }
    }
  };

  // Lưu thời gian vào localStorage
  const saveTimingDataToStorage = (startTime, endTime, duration) => {
    const storageKey = `testdrive_timing_${id}`;
    localStorage.setItem(storageKey, JSON.stringify({
      actualStartTime: startTime,
      actualEndTime: endTime,
      durationMinutes: duration
    }));
  };

  // Xóa dữ liệu timing khỏi localStorage
  const clearTimingDataFromStorage = () => {
    const storageKey = `testdrive_timing_${id}`;
    localStorage.removeItem(storageKey);
  };

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

  const handleStartTestDrive = async () => {
    notifications.confirm(
      'Xác nhận bắt đầu',
      'Xác nhận bắt đầu lái thử và giao xe cho khách hàng?',
      async () => {
        const startTime = new Date();
        setActualStartTime(startTime);
        saveTimingDataToStorage(startTime.toISOString(), null, null);
        notifications.success('Thành công', 'Đã xác nhận bắt đầu lái thử!');
      }
    );
  };

  const handleReturnTestDrive = async () => {
    if (!actualStartTime) {
      notifications.error('Lỗi', 'Chưa có thời gian bắt đầu. Vui lòng bắt đầu lái thử trước.');
      return;
    }

    notifications.confirm(
      'Xác nhận trả xe',
      'Xác nhận khách hàng đã trả xe?',
      async () => {
        try {
          const endTime = new Date();
          const duration = Math.round((endTime - actualStartTime) / 60000); // Tính phút
          
          setActualEndTime(endTime);
          setDurationMinutes(duration);
          saveTimingDataToStorage(actualStartTime.toISOString(), endTime.toISOString(), duration);

          // Tạo feedback với thông tin thời gian
          const timingInfo = `
═══════════════════════════════════════
📊 THÔNG TIN THỜI GIAN LÁI THỬ
═══════════════════════════════════════
🚗 Bắt đầu: ${actualStartTime.toLocaleString('vi-VN')}
🏁 Kết thúc: ${endTime.toLocaleString('vi-VN')}
⏱️ Thời lượng: ${duration} phút${duration >= 60 ? ` (${Math.floor(duration / 60)} giờ ${duration % 60} phút)` : ''}
═══════════════════════════════════════

${feedback ? `📝 Phản hồi:\n${feedback}` : ''}
          `.trim();

          // Cập nhật status thành completed với feedback chứa thông tin thời gian
          const result = await dealerAPI.updateTestDriveStatus(id, 'completed', timingInfo);
          
          if (result.success) {
            notifications.success('Thành công', `Đã xác nhận trả xe thành công!\nThời gian sử dụng: ${duration} phút`);
            await loadTestDriveDetail();
            // Xóa dữ liệu timing sau khi hoàn thành
            clearTimingDataFromStorage();
          } else {
            notifications.error('Lỗi', result.message);
          }
        } catch (error) {
          console.error('Error returning test drive:', error);
          notifications.error('Lỗi', 'Có lỗi xảy ra khi xác nhận trả xe');
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
              label="Thời lượng dự kiến"
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

          {/* Thời gian thực tế */}
          {(actualStartTime || actualEndTime) && (
            <InfoSection 
              title="Thời gian thực tế" 
              icon="⏱️"
              className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700"
            >
              {actualStartTime && (
                <InfoRow
                  label="🚗 Thời gian bắt đầu (giao xe)"
                  value={actualStartTime.toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                />
              )}
              {actualEndTime && (
                <InfoRow
                  label="🏁 Thời gian kết thúc (trả xe)"
                  value={actualEndTime.toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                />
              )}
              {durationMinutes && (
                <InfoRow
                  label="⌛ Thời gian sử dụng thực tế"
                  value={
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {durationMinutes} phút
                      {durationMinutes >= 60 && 
                        ` (${Math.floor(durationMinutes / 60)} giờ ${durationMinutes % 60} phút)`
                      }
                    </span>
                  }
                />
              )}
            </InfoSection>
          )}

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
              Trạng thái & Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Hiện tại:</span>
                <Badge variant={getStatusBadge(testDrive.status)}>
                  {getStatusLabel(testDrive.status)}
                </Badge>
              </div>
              {testDrive.createdAt && (
                <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">📝 Ngày đăng ký:</span>
                  <br />
                  {new Date(testDrive.createdAt).toLocaleString('vi-VN')}
                </div>
              )}
              {actualStartTime && (
                <div className="text-sm text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="font-medium">🚗 Bắt đầu:</span>
                  <br />
                  {actualStartTime.toLocaleString('vi-VN')}
                </div>
              )}
              {actualEndTime && (
                <div className="text-sm text-blue-600 dark:text-blue-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium">🏁 Trả xe:</span>
                  <br />
                  {actualEndTime.toLocaleString('vi-VN')}
                </div>
              )}
              {durationMinutes && (
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  ⌛ {durationMinutes} phút
                  {durationMinutes >= 60 && 
                    <div className="text-xs mt-1">
                      ({Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m)
                    </div>
                  }
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
              
              {testDrive.status === 'confirmed' && !actualStartTime && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleStartTestDrive}
                  >
                    🚗 Bắt đầu lái thử (Giao xe)
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

              {testDrive.status === 'confirmed' && actualStartTime && !actualEndTime && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleReturnTestDrive}
                  >
                    🏁 Xác nhận trả xe
                  </Button>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    ⏱️ Đang trong quá trình lái thử...
                  </div>
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