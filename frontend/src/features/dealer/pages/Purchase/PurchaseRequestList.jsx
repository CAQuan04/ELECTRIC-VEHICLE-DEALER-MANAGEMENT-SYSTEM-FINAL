import React, { useState, useEffect, useMemo } from 'react';
// ✨ 1. IMPORT useNavigate
import { useNavigate } from 'react-router-dom';
import { Search, Plus, TrendingUp, Clock, CheckCircle, Package } from 'lucide-react';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
// (Import các component chuẩn)
import {
  PageContainer,
  PageHeader,
  MetricCard,
  Badge,
  Button,
  Table,
  EmptyState
} from '../../components';
import { usePageLoading } from '@modules/loading';
const PurchaseRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const { startLoading, stopLoading } = usePageLoading();
  // ✨ 2. KHỞI TẠO useNavigate
  const navigate = useNavigate();

  // ✨ 3. SỬA BREADCRUMBS
  //    (Mục cuối cùng là trang hiện tại, không nên có 'path')
  const breadcrumbs = [
    { label: 'Trang chủ', path: '/dealer-dashboard' },
    { label: 'Yêu cầu mua hàng' } // <-- Đã xóa path
  ];

  // (Logic loadRequests, requestMetrics, filteredRequests... giữ nguyên)
  useEffect(() => {
    loadRequests();
  }, []);
  const loadRequests = async () => {
    try {
      startLoading('Đang tải danh sách yêu cầu...');

      // Gọi API lấy danh sách yêu cầu nhập hàng
      // Lưu ý: dealerAPI.getStockRequests() cần được define trong dealer.api.js
      // Thường là GET /api/Inventory/distributions/requests hoặc tương tự
      const result = await dealerAPI.getStockRequests();

      if (result.success && result.data) {
        // 🟢 4. Ánh xạ dữ liệu từ Backend sang cấu trúc Frontend mong đợi
        // Backend thường trả về: requestId, vehicleName, status (Enum), createdDate...
        const mappedRequests = Array.isArray(result.data) ? result.data.map(item => ({
          id: item.requestId || item.id, // Map ID
          vehicle: item.vehicleName || item.productName || 'Xe chưa đặt tên', // Map tên xe
          quantity: item.quantity || 0,
          // Nếu backend chưa tính estimatedCost, có thể cần tính tay hoặc để 0
          estimatedCost: item.totalAmount || item.estimatedCost || 0,
          requestDate: item.createdDate || item.requestDate || new Date().toISOString(),
          status: mapStatusBackendToFrontend(item.status), // Xử lý trạng thái
          priority: item.priority || 'Bình thường'
        })) : [];

        setRequests(mappedRequests);
      } else {
        console.error('Lỗi tải dữ liệu:', result.message);
        // Có thể show thông báo lỗi nhẹ ở đây nếu muốn
      }
    } catch (error) {
      console.error('Lỗi hệ thống khi tải yêu cầu:', error);
    } finally {
      stopLoading();
    }
  };
  // Hàm phụ trợ: Map trạng thái từ Backend (thường là tiếng Anh hoặc số) sang hiển thị
  const mapStatusBackendToFrontend = (backendStatus) => {
    // Giả sử backend trả về: Pending, Approved, Rejected, Processing
    const statusMap = {
      'Pending': 'Chờ duyệt',
      'Approved': 'Đã duyệt',
      'Processing': 'Đang xử lý',
      'Rejected': 'Từ chối',
      // Fallback nếu backend đã trả về tiếng Việt
      'Chờ duyệt': 'Chờ duyệt',
      'Đã duyệt': 'Đã duyệt',
      'Đang xử lý': 'Đang xử lý',
      'Từ chối': 'Từ chối'
    };
    return statusMap[backendStatus] || backendStatus || 'Chờ duyệt';
  };
  const requestMetrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Chờ duyệt').length;
    const approved = requests.filter(r => r.status === 'Đã duyệt').length;
    const processing = requests.filter(r => r.status === 'Đang xử lý').length;
    return { total, pending, approved, processing };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let processedRequests = [...requests];

    if (searchTerm) {
      processedRequests = processedRequests.filter(req =>
        req.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      processedRequests = processedRequests.filter(
        req => req.status === 'statusFilter' // Lỗi logic ở đây, sửa thành req.status === statusFilter
      );
    }

    // Sửa lỗi logic
    if (statusFilter !== 'all') {
      processedRequests = processedRequests.filter(
        req => req.status === statusFilter
      );
    }


    processedRequests.sort((a, b) => {
      switch (sortOrder) {
        case 'date-asc':
          return new Date(a.requestDate) - new Date(b.requestDate);
        case 'date-desc':
          return new Date(b.requestDate) - new Date(a.requestDate);
        case 'cost-asc':
          return a.estimatedCost - b.estimatedCost;
        case 'cost-desc':
          return b.estimatedCost - a.estimatedCost;
        default:
          return 0;
      }
    });

    return processedRequests;
  }, [requests, searchTerm, statusFilter, sortOrder]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Chờ duyệt': return 'warning';
      case 'Đã duyệt': return 'success';
      case 'Đang xử lý': return 'info';
      case 'Từ chối': return 'danger';
      default: return 'info';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'Khẩn cấp': return 'danger';
      case 'Cao': return 'warning';
      default: return 'info';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Mã YC',
      render: (item) => (
        <span className="font-bold text-cyan-600 dark:text-cyan-400">
          PR-{String(item.id).padStart(4, '0')}
        </span>
      )
    },
    {
      key: 'vehicle',
      label: 'Xe',
      render: (row) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {row.vehicle}
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      render: (row) => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {row.quantity} xe
        </span>
      )
    },
    {
      key: 'estimatedCost',
      label: 'Chi phí',
      render: (item) => (
        <span className="text-gray-900 dark:text-white font-semibold">
          {(item.estimatedCost / 1000000000).toFixed(2)} tỷ
        </span>
      )
    },
    {
      key: 'requestDate',
      label: 'Ngày tạo',
      render: (item) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {new Date(item.requestDate).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Ưu tiên',
      render: (item) => <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item) => <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item) => (
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          onClick={() => navigate(`/dealer/purchase-requests/${item.id}`)}
        >
          Chi tiết
        </button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Yêu cầu mua hàng"
        subtitle="Danh sách các yêu cầu nhập xe đã gửi đến EVM"
        icon={<Package className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
        variant="darkTheme"
        actions={
          <Button
            variant="gradient"
            icon={<Plus />}
            onClick={() => navigate('/dealer/purchase-requests/create')}
          >
            + Tạo yêu cầu mới
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-cyan-600" />
          Tổng quan nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <MetricCard
            title="Tổng số yêu cầu"
            value={requestMetrics.total}
            icon="📦"
            color="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700"
            trend="+12%"
          />
          <MetricCard
            title="Chờ duyệt"
            value={requestMetrics.pending}
            icon="⏳"
            color="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700"
          />
          <MetricCard
            title="Đã duyệt"
            value={requestMetrics.approved}
            icon="✅"
            color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700"
          />
          <MetricCard
            title="Đang xử lý"
            value={requestMetrics.processing}
            icon="⚡"
            color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-stale-500 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Từ chối">Từ chối</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
            >
              <option value="date-desc">📅 Mới nhất</option>
              <option value="date-asc">📅 Cũ nhất</option>
              <option value="cost-desc">💰 Cao → Thấp</option>
              <option value="cost-asc">💰 Thấp → Cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table hoặc Empty State */}
      {filteredRequests.length > 0 ? (
        <div className="bg-none dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table
            columns={columns}
            data={filteredRequests}
          />
        </div>
      ) : (
        <EmptyState
          icon="📭"
          title="Không tìm thấy yêu cầu"
          message={
            searchTerm || statusFilter !== 'all'
              ? "Không tìm thấy yêu cầu nào phù hợp với tiêu chí lọc."
              : "Chưa có yêu cầu nào. Hãy tạo yêu cầu mới để bắt đầu."
          }
          action={{
            label: '+ Tạo yêu cầu mới',
            onClick: () => navigate('/dealer/purchase-requests/create')
          }}
        />
      )}
    </PageContainer>
  );
};

export default PurchaseRequestList;
