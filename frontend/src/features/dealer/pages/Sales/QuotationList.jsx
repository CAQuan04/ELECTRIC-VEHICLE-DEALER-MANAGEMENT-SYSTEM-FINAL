import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { AuthService } from '@utils';
import {
  PageContainer,
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  SearchBar,
  EmptyState
} from '../../components';
import { FileText, Edit, Inbox } from 'lucide-react';

const QuotationList = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getQuotations();
      if (result.success && result.data) {
        const quotationList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setQuotations(quotationList);
      } else {
        console.error('Failed to load quotations:', result.message);
        setQuotations([]);
      }
    } catch (error) {
      console.error('Error loading quotations:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'accepted': 'success',
      'rejected': 'danger',
      'expired': 'gray'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ phản hồi',
      'accepted': 'Đã chấp nhận',
      'rejected': 'Từ chối',
      'expired': 'Hết hạn'
    };
    return labelMap[status] || status;
  };

  const formatPrice = (price) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu VNĐ`;
  };

  const filteredQuotations = quotations.filter(q =>
    q.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.vehicle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.id?.toString().includes(searchQuery)
  );

  const quotationColumns = [
    {
      key: 'id',
      label: 'Mã báo giá',
      render: (item) => (
        <span className="font-bold text-emerald-400">
          QUO-{String(item.id).padStart(4, '0')}
        </span>
      )
    },
    {
      key: 'customerName',
      label: 'Khách hàng',
      render: (item) => (
        <span className="font-semibold">{item.customerName}</span>
      )
    },
    {
      key: 'vehicle',
      label: 'Xe',
      render: (item) => (
        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
          {item.vehicle}
        </span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Giá trị',
      render: (item) => (
        <span className="text-emerald-400 font-bold">
          {formatPrice(item.totalAmount)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (item) => (
        <span className="text-gray-400">
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'validUntil',
      label: 'Hiệu lực đến',
      render: (item) => (
        <span className="text-gray-400">
          {new Date(item.validUntil).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item) => (
        <Badge variant={getStatusBadge(item.status)}>
          {getStatusLabel(item.status)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dealer/quotations/${item.id}`)}
          >
            👁️ Xem
          </Button>
          {/* Chỉ cho phép sửa nếu trạng thái là 'pending' (Chờ duyệt) */}
          {item.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dealer/quotations/edit/${item.id}`)}
            >
              <Edit className="w-4 h-4" /> {/* Dùng icon */}
            </Button>
          )}
          {/* Chỉ cho phép chuyển đổi nếu trạng thái là 'accepted' (Đã chấp nhận) */}
          {item.status === 'accepted' && (
            <Button
              variant="ghost"
              size="sm"
              // Chuyển đến trang Tạo Đơn hàng mới, mang theo ID báo giá
              onClick={() => navigate(`/dealer/orders/create?quotationId=${item.id}`)}
            >
              ➡️ Tạo Đơn hàng
            </Button>
          )}
        </div>
      )
    }
  ];

  const handlePrint = (quotationId) => {
    console.log('Print quotation:', quotationId);
    alert(`Chức năng in báo giá ${quotationId} đang được phát triển`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Quản lý báo giá"
          subtitle="Theo dõi và quản lý báo giá cho khách hàng"
          icon={<FileText className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải danh sách báo giá...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý báo giá"
        subtitle="Theo dõi và quản lý báo giá cho khách hàng"
        icon={<FileText className="w-16 h-16" />}
        actions={
          <Button
            variant="gradient"
            onClick={() => {
              const currentUser = AuthService.getCurrentUser();
              const dealerId = currentUser?.dealerId;
              navigate(dealerId ? `/${dealerId}/dealer/quotations/create` : '/dealer/quotations/create');
            }}
          >
            + Tạo báo giá mới
          </Button>
        }
      />

      <div className="mb-6 mt-8">
        <SearchBar
          placeholder="Tìm kiếm theo khách hàng, xe hoặc mã báo giá..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        {filteredQuotations.length > 0 ? (
          <Table
            columns={quotationColumns}
            data={filteredQuotations}
          />
        ) : (
          <EmptyState
            icon={<Inbox className="w-12 h-12" />}
            title="Chưa có báo giá nào"
            message={searchQuery ? "Không tìm thấy báo giá phù hợp với từ khóa tìm kiếm" : "Hãy tạo báo giá đầu tiên cho khách hàng của bạn"}
            action={{
              label: "Tạo báo giá mới",
              onClick: () => navigate('/dealer/quotations/create')
            }}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default QuotationList;