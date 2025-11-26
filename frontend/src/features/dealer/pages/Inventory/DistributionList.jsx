import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Package, Clock, CheckCircle, XCircle, FileText, Plus } from 'lucide-react';
import { notifications } from '@utils';
import { useAuth } from '@/context/AuthContext';
// Import UI components
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import Table from '@/features/dealer/components/ui/Table.jsx';
import { PageHeader } from '../../components';
import SearchBar from '@/features/dealer/components/ui/SearchBar.jsx';
import EmptyState from '@/features/dealer/components/ui/EmptyState.jsx';
import PageContainer from '../../components/layout/PageContainer';

/**
 * DistributionList - Danh sách yêu cầu nhập hàng từ Staff
 * Chức năng: Staff tạo yêu cầu → Manager xem và xử lý → Gửi đến Purchase
 */
const DistributionList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();
  const dealerId = user?.dealerId;  
  useEffect(() => {if (dealerId) {
    loadRequests();
  }}, [dealerId, filterStatus, search]);

  const loadRequests = async () => {
    try {
      startLoading('Đang tải danh sách yêu cầu...');
      
      const filters = {};
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      if (search.trim()) {
        filters.search = search;
      }
      
      const result = await dealerAPI.getStockRequests(filters);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setRequests(result.data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      notifications.error('Lỗi', error.message || 'Không thể tải danh sách yêu cầu');
      setRequests([]);
    } finally {
      stopLoading();
    }
  };

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
        <Icon className="w-3 h-3 mr-1" />
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

  const filteredRequests = requests.filter(req => {
    const matchSearch = !search || 
      (req.vehicleName || '').toLowerCase().includes(search.toLowerCase()) ||
      (req.requestedBy || '').toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || req.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: 'id',
      label: 'Mã YC',
      render: (item) => (
        <span className="font-mono text-sm font-semibold text-blue-600">
          SR-{String(item.id).padStart(4, '0')}
        </span>
      )
    },
    {
      key: 'vehicle',
      label: 'Thông tin xe',
      render: (item) => (
        <div>
          <div className="font-semibold text-gray-900">{item.vehicleName}</div>
          <div className="text-sm text-gray-500">{item.configName}</div>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      render: (item) => (
        <span className="font-bold text-blue-600">{item.quantity} xe</span>
      )
    },
    {
      key: 'requestedBy',
      label: 'Người yêu cầu',
      render: (item) => (
        <span className="text-gray-700">{item.requestedBy}</span>
      )
    },
    {
      key: 'requestDate',
      label: 'Ngày tạo',
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {new Date(item.requestDate).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Ưu tiên',
      render: (item) => getPriorityBadge(item.priority)
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item) => getStatusBadge(item.status)
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/${dealerId}/dealer/inventory/distributions/${item.id}`)}
        >
          <FileText className="w-4 h-4 mr-1" />
          Chi tiết
        </Button>
      )
    }
  ];

  const getPendingCount = () => {
    return requests.filter(r => r.status === 'Pending').length;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Yêu cầu nhập hàng từ Staff"
        subtitle="Quản lý và duyệt các yêu cầu nhập xe từ nhân viên bán hàng"
        icon={<FileText className="w-16 h-16" />}
        actions={
          <Button 
            variant="outline" 
            onClick={() => navigate(`/${dealerId}/dealer/inventory`)}
          >
            ← Quay lại kho xe
          </Button>
        }
      />

      {getPendingCount() > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">
              Có {getPendingCount()} yêu cầu đang chờ Manager duyệt
            </span>
          </div>
          <p className="text-sm text-orange-600 mt-1">
            Manager cần xem xét và duyệt yêu cầu, sau đó chuyển sang Purchase để gửi EVM
          </p>
        </div>
      )}

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                placeholder="Tìm theo tên xe, người yêu cầu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Pending">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredRequests}
          keyField="id"
        />

        {filteredRequests.length === 0 && (
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="Không có yêu cầu"
            message={search || filterStatus !== 'all' 
              ? "Không tìm thấy yêu cầu phù hợp với bộ lọc" 
              : "Chưa có yêu cầu nhập hàng nào từ Staff. Các yêu cầu sẽ được hiển thị ở đây sau khi Staff tạo."}
            className="py-10"
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default DistributionList;
