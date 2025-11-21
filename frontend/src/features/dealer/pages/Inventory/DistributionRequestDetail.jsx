import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { FileText, Clock, User, Package, CheckCircle, XCircle } from 'lucide-react';
import { notifications } from '@utils';

// Import UI components
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import { 
  DetailHeader, 
  InfoSection, 
  InfoRow 
} from '@/features/dealer/components/ui/AdvancedComponents.jsx';
import PageContainer from '../../components/layout/PageContainer';

const DistributionRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [request, setRequest] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    loadRequestDetail();
  }, [requestId]);

  const loadRequestDetail = async () => {
    try {
      startLoading('Đang tải chi tiết yêu cầu...');
      
      const result = await dealerAPI.getStockRequestById(requestId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setRequest(result.data);
    } catch (error) {
      console.error('Error loading request detail:', error);
      notifications.error('Lỗi', error.message || 'Không thể tải chi tiết yêu cầu');
      navigate('/dealer/inventory/distributions');
    } finally {
      stopLoading();
    }
  };

  const handleApprove = async () => {
    if (!confirm('Duyệt yêu cầu này? Sau khi duyệt, bạn cần tạo Purchase Request để gửi đến EVM.')) {
      return;
    }

    setApproving(true);
    try {
      const result = await dealerAPI.approveStockRequest(requestId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      notifications.success('Đã duyệt', result.message || 'Yêu cầu đã được duyệt. Hãy tạo Purchase Request để gửi EVM.');
      
      // Chuyển đến trang tạo Purchase Request với thông tin được điền sẵn
      navigate('/dealer/purchase-requests/create', {
        state: {
          prefilledData: {
            vehicleName: request.vehicleName,
            configName: request.configName,
            quantity: request.quantity,
            priority: request.priority,
            reason: request.reason,
            sourceRequestId: request.id
          }
        }
      });
    } catch (error) {
      notifications.error('Lỗi', error.message || 'Không thể duyệt yêu cầu');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Lý do từ chối:');
    if (!reason || reason.trim() === '') {
      notifications.error('Lỗi', 'Vui lòng nhập lý do từ chối');
      return;
    }

    setRejecting(true);
    try {
      const result = await dealerAPI.rejectStockRequest(requestId, reason);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      notifications.success('Đã từ chối', result.message || 'Yêu cầu đã bị từ chối');
      navigate('/dealer/inventory/distributions');
    } catch (error) {
      notifications.error('Lỗi', error.message || 'Không thể từ chối yêu cầu');
    } finally {
      setRejecting(false);
    }
  };

  if (!request) {
    return null; // Loading or error
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { variant: 'warning', label: 'Chờ duyệt', icon: Clock },
      'Approved': { variant: 'success', label: 'Đã duyệt', icon: CheckCircle },
      'Rejected': { variant: 'danger', label: 'Từ chối', icon: XCircle },
    };

    const config = statusMap[status] || { variant: 'secondary', label: status, icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'Khẩn cấp': 'danger',
      'Cao': 'warning',
      'Bình thường': 'info',
      'Thấp': 'secondary'
    };
    return <Badge variant={priorityMap[priority] || 'info'}>{priority}</Badge>;
  };

  const canApproveOrReject = request.status === 'Pending';

  return (
    <PageContainer>
      <DetailHeader
        title={`Yêu cầu nhập hàng #SR-${String(request.id).padStart(4, '0')}`}
        subtitle="Chi tiết yêu cầu nhập xe từ Staff"
        onBack={() => navigate('/dealer/inventory/distributions')}
      />

      {/* Action Buttons */}
      {canApproveOrReject && (
        <div className="mb-6 flex gap-3">
          <Button
            variant="gradient"
            onClick={handleApprove}
            loading={approving}
            disabled={approving || rejecting}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Duyệt yêu cầu
          </Button>
          
          <Button
            variant="danger"
            onClick={handleReject}
            loading={rejecting}
            disabled={approving || rejecting}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Từ chối
          </Button>
        </div>
      )}

      {/* Alert nếu đã duyệt */}
      {request.status === 'Approved' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              Yêu cầu đã được duyệt. Hãy tạo Purchase Request để gửi đến EVM.
            </span>
          </div>
        </div>
      )}

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InfoSection title="Thông tin yêu cầu" icon={<FileText className="w-5 h-5" />}>
          <InfoRow label="Mã yêu cầu" value={<span className="font-mono font-semibold">SR-{String(request.id).padStart(4, '0')}</span>} />
          <InfoRow label="Trạng thái" value={getStatusBadge(request.status)} />
          <InfoRow label="Mức độ ưu tiên" value={getPriorityBadge(request.priority)} />
          <InfoRow label="Ngày tạo" value={new Date(request.requestDate).toLocaleDateString('vi-VN')} />
        </InfoSection>

        <InfoSection title="Thông tin người yêu cầu" icon={<User className="w-5 h-5" />}>
          <InfoRow label="Tên nhân viên" value={<span className="font-semibold">{request.requestedBy}</span>} />
          <InfoRow label="Vai trò" value={request.requestedByRole} />
        </InfoSection>
      </div>

      {/* Thông tin xe */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Thông tin xe yêu cầu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-200">Dòng xe</span>
              <p className="text-lg font-semibold text-white-900">{request.vehicleName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-200">Cấu hình</span>
              <p className="text-lg font-semibold text-white-900">{request.configName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-200">Số lượng</span>
              <p className="text-2xl font-bold text-blue-600">{request.quantity} xe</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Chi phí ước tính</span>
            <p className="text-xl font-bold text-green-600">
              {(request.estimatedCost / 1000000000).toFixed(2)} tỷ VNĐ
            </p>
          </div>
        </div>
      </Card>

      {/* Lý do và ghi chú */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lý do yêu cầu</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{request.reason}</p>
        </div>
      </Card>

      {request.customerDemand && (
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhu cầu khách hàng</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.customerDemand}</p>
          </div>
        </Card>
      )}

      {request.notes && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.notes}</p>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default DistributionRequestDetail;
