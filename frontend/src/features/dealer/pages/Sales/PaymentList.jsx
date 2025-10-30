import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
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
import { CreditCard } from 'lucide-react';

const PaymentList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getPayments();
      if (result.success && result.data) {
        const paymentList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setPayments(paymentList);
      } else {
        console.error('Failed to load payments:', result.message);
        setPayments([]);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'completed': 'success',
      'failed': 'danger',
      'refunded': 'gray'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ xử lý',
      'completed': 'Hoàn thành',
      'failed': 'Thất bại',
      'refunded': 'Đã hoàn tiền'
    };
    return labelMap[status] || status;
  };

  const getPaymentTypeLabel = (type) => {
    const typeMap = {
      'deposit': 'Đặt cọc',
      'installment': 'Trả góp',
      'full': 'Toàn bộ',
      'final': 'Thanh toán cuối'
    };
    return typeMap[type] || type;
  };

  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      'cash': 'Tiền mặt',
      'bank_transfer': 'Chuyển khoản',
      'credit_card': 'Thẻ tín dụng',
      'financing': 'Tài chính'
    };
    return methodMap[method] || method;
  };

  const formatPrice = (price) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu VNĐ`;
  };

  const filteredPayments = payments.filter(p => 
    p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.orderId?.toString().includes(searchQuery) ||
    p.id?.toString().includes(searchQuery)
  );

  const paymentColumns = [
    { 
      key: 'id', 
      label: 'Mã thanh toán', 
      render: (item) => (
        <span className="font-bold text-emerald-400">
          PAY-{String(item.id).padStart(4, '0')}
        </span>
      )
    },
    { 
      key: 'orderId', 
      label: 'Mã đơn hàng',
      render: (item) => (
        <span className="font-semibold">
          ORD-{String(item.orderId).padStart(4, '0')}
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
      key: 'amount', 
      label: 'Số tiền', 
      render: (item) => (
        <span className="text-emerald-400 font-bold">
          {formatPrice(item.amount)}
        </span>
      )
    },
    { 
      key: 'paymentType', 
      label: 'Loại', 
      render: (item) => (
        <span className="font-medium text-cyan-600 dark:text-cyan-400">
          {getPaymentTypeLabel(item.paymentType)}
        </span>
      )
    },
    { 
      key: 'paymentMethod', 
      label: 'Phương thức', 
      render: (item) => (
        <span className="font-medium">
          {getPaymentMethodLabel(item.paymentMethod)}
        </span>
      )
    },
    { 
      key: 'paymentDate', 
      label: 'Ngày', 
      render: (item) => (
        <span className="text-gray-400">
          {new Date(item.paymentDate).toLocaleDateString('vi-VN')}
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
            onClick={() => navigate(`/dealer/payments/${item.id}`)}
          >
            👁️ Chi tiết
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handlePrintInvoice(item.id)}
          >
            🖨️ In hóa đơn
          </Button>
        </div>
      )
    }
  ];

  const handlePrintInvoice = (paymentId) => {
    console.log('Print invoice:', paymentId);
    alert(`Chức năng in hóa đơn cho thanh toán ${paymentId} đang được phát triển`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="💳 Quản lý thanh toán"
          subtitle="Theo dõi và quản lý thanh toán của khách hàng"
          icon={<CreditCard className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải danh sách thanh toán...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="💳 Quản lý thanh toán"
        subtitle="Theo dõi và quản lý thanh toán của khách hàng"
        icon={<CreditCard className="w-16 h-16" />}
        actions={
          <Button 
            variant="gradient" 
            onClick={() => navigate('/dealer/payments/new')}
          >
            + Ghi nhận thanh toán
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Tìm kiếm theo khách hàng, mã đơn hoặc mã thanh toán..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        {filteredPayments.length > 0 ? (
          <Table
            columns={paymentColumns}
            data={filteredPayments}
          />
        ) : (
          <EmptyState
            icon="📭"
            title="Chưa có thanh toán nào"
            message={searchQuery ? "Không tìm thấy thanh toán phù hợp với từ khóa tìm kiếm" : "Chưa có giao dịch thanh toán nào được ghi nhận"}
            action={{
              label: "Ghi nhận thanh toán",
              onClick: () => navigate('/dealer/payments/new')
            }}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default PaymentList;