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
import { ShoppingCart } from 'lucide-react';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getOrders();
      if (result.success && result.data) {
        const orderList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setOrders(orderList);
      } else {
        console.error('Failed to load orders:', result.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'processing': 'info',
      'shipping': 'info',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ duyệt',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return labelMap[status] || status;
  };

  const formatPrice = (price) => {
    return `${(price / 1000000).toLocaleString('vi-VN')} triệu VNĐ`;
  };

  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.vehicle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id?.toString().includes(searchQuery)
  );

  const orderColumns = [
    { 
      key: 'id', 
      label: 'Mã đơn', 
      render: (item) => (
        <span className="font-bold text-emerald-400">
          ORD-{String(item.id).padStart(4, '0')}
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
      key: 'orderDate', 
      label: 'Ngày đặt', 
      render: (item) => (
        <span className="text-gray-400">
          {new Date(item.orderDate).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    { 
      key: 'estimatedDelivery', 
      label: 'Ngày giao dự kiến', 
      render: (item) => (
        <span className="text-gray-400">
          {item.estimatedDelivery ? new Date(item.estimatedDelivery).toLocaleDateString('vi-VN') : 'Chưa xác định'}
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
            onClick={() => navigate(`/dealer/orders/${item.id}`)}
          >
            👁️ Chi tiết
          </Button>
          {item.status === 'shipping' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleTrackDelivery(item.id)}
            >
              📦 Theo dõi
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleTrackDelivery = (orderId) => {
    console.log('Track delivery:', orderId);
    alert(`Chức năng theo dõi giao hàng cho đơn ${orderId} đang được phát triển`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="📋 Quản lý đơn hàng"
          subtitle="Theo dõi và quản lý đơn hàng bán xe"
          icon={<ShoppingCart className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải danh sách đơn hàng...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="📋 Quản lý đơn hàng"
        subtitle="Theo dõi và quản lý đơn hàng bán xe"
        icon={<ShoppingCart className="w-16 h-16" />}
        actions={
          <Button 
            variant="gradient" 
            onClick={() => navigate('/dealer/orders/create')}
          >
            + Tạo đơn hàng mới
          </Button>
        }
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Tìm kiếm theo khách hàng, xe hoặc mã đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        {filteredOrders.length > 0 ? (
          <Table
            columns={orderColumns}
            data={filteredOrders}
          />
        ) : (
          <EmptyState
            icon="📭"
            title="Chưa có đơn hàng nào"
            message={searchQuery ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm" : "Hãy tạo đơn hàng đầu tiên cho khách hàng của bạn"}
            action={{
              label: "Tạo đơn hàng mới",
              onClick: () => navigate('/dealer/orders/create')
            }}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default OrderList;