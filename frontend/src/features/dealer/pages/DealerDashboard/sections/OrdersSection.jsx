import React, { useState, useEffect } from 'react';
import { ClipboardList, ShoppingCart, FileText } from 'lucide-react';
import { dealerAPI } from '@utils/api/services';
import { useDealerRole } from '../../../components/auth/DealerRoleGuard';
import { usePageLoading } from '@modules/loading';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import StatCard from '../../../components/ui/StatCard';
import { mockOrders, mockOrderStats } from '../mockData';

const OrdersSection = ({ navigate }) => {
  const { isManager } = useDealerRole();
  const { startLoading, stopLoading } = usePageLoading();
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(mockOrderStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchOrders = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        
        // Fetch orders from API
        const result = await dealerAPI.getOrders({ limit: 10, sort: 'createdAt:desc' });
        
        if (!mounted) return;
        
        if (result.success) {
          setOrders(result.data.orders || result.data.data || []);
          if (result.data.stats) {
            setOrderStats(result.data.stats);
          }
        } else {
          // Use mock data when API fails
          console.warn('Orders API failed, using mock data');
          setOrders(mockOrders);
        }
      } catch (error) {
        if (!mounted) return;
        console.warn('Error fetching orders, using mock data:', error);
        // Use mock data on error
        setOrders(mockOrders.slice(0, 2));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const statsData = [
    { label: 'Chờ xử lý', value: orderStats?.pending || 0, color: 'yellow', icon: '⏳' },
    { label: 'Đang xử lý', value: orderStats?.processing || 0, color: 'blue', icon: '🔄' },
    { label: 'Hoàn thành', value: orderStats?.completed || 0, color: 'emerald', icon: '✅' },
    { label: 'Đã hủy', value: orderStats?.cancelled || 0, color: 'red', icon: '❌' }
  ];

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return <Badge variant="danger" size="sm">🔥 Ưu tiên cao</Badge>;
      case 'medium': return <Badge variant="info" size="sm">⚡ Trung bình</Badge>;
      default: return <Badge variant="secondary" size="sm">📌 Thường</Badge>;
    }
  };

  const columns = [
    { key: 'orderId', label: 'Mã ĐH', render: (row) => (
      <span className="font-mono font-bold text-cyan-600 dark:text-emerald-400">#{row.orderId || row.id}</span>
    )},
    { key: 'customerName', label: 'Khách hàng', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-emerald-500 dark:to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {(row.customerName || row.customer || 'U').charAt(0)}
        </div>
        <span className="font-semibold dark:text-white text-gray-900">{row.customerName || row.customer}</span>
      </div>
    )},
    { key: 'vehicleName', label: 'Xe' },
    { key: 'totalAmount', label: 'Giá trị', render: (row) => (
      <span className="font-bold text-lg dark:text-emerald-400 text-cyan-600">
        {typeof row.totalAmount === 'number' ? `${(row.totalAmount / 1000000000).toFixed(1)} tỷ` : row.amount}
      </span>
    )},
    { key: 'status', label: 'Trạng thái', render: (row) => {
      const statusMap = {
        'pending': 'Chờ duyệt',
        'processing': 'Đang xử lý',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy',
        'delivering': 'Đang giao'
      };
      return (
        <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'warning'}>
          {statusMap[row.status] || row.status}
        </Badge>
      );
    }},
    { key: 'priority', label: 'Ưu tiên', render: (row) => getPriorityBadge(row.priority) },
    { key: 'createdAt', label: 'Ngày', render: (row) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString('vi-VN') : row.date}
      </span>
    )},
    { key: 'actions', label: 'Thao tác', render: (row) => (
      <button 
        onClick={() => navigate(`/dealer/orders/${row.id}`)}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-emerald-500 dark:to-indigo-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-md"
      >
        Chi tiết
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-8 h-8" /> Quản lý đơn hàng
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Theo dõi và quản lý tất cả đơn hàng của đại lý</p>
        </div>
        <button 
          onClick={() => navigate('/dealer/orders/create')}
          className="px-6 py-3 bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 from-cyan-500 to-blue-600 hover:scale-105 rounded-xl font-bold text-white shadow-lg dark:hover:shadow-emerald-500/50 hover:shadow-cyan-500/50 transition-all duration-300 border border-white/20 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Tạo đơn hàng mới
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-emerald-500/10 dark:to-indigo-500/10">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Đơn hàng gần đây
          </h3>
        </div>
        
        <Table
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="Chưa có đơn hàng nào"
        />
      </div>
    </div>
  );
};

export default OrdersSection;
