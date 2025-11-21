import React, { useState, useEffect } from 'react';
import { Users, UserPlus, TrendingUp } from 'lucide-react';
import { dealerAPI } from '@utils/api/services';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import StatCard from '../../../components/ui/StatCard';

const CustomersSection = ({ navigate }) => {
  const [customers, setCustomers] = useState([]);
  const [customerStats, setCustomerStats] = useState(mockCustomerStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchCustomers = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        
        // Fetch customers from API
        const result = await dealerAPI.getCustomers({ limit: 10, sort: 'totalSpent:desc' });
        
        if (!mounted) return;
        
        if (result.success) {
          setCustomers(result.data.customers || result.data.data || []);
          if (result.data.stats) {
            setCustomerStats(result.data.stats);
          }
        } else {
          // Use mock data when API fails
          console.warn('Customers API failed, using mock data');
          setCustomers(mockCustomers);
        }
      } catch (error) {
        if (!mounted) return;
        console.warn('Error fetching customers, using mock data:', error);
        // Use mock data on error
        setCustomers(mockCustomers.slice(0, 2));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCustomers();
    
    return () => {
      mounted = false;
    };
  }, []);

  const statsData = [
    { label: 'Tổng khách hàng', value: customerStats?.total || 0, color: 'blue', icon: '👥' },
    { label: 'Khách VIP', value: customerStats?.vip || 0, color: 'yellow', icon: '⭐' },
    { label: 'Khách mới (tháng)', value: customerStats?.newThisMonth || 0, color: 'emerald', icon: '🆕' },
    { label: 'Khách tiềm năng', value: customerStats?.potential || 0, color: 'purple', icon: '🎯' }
  ];

  const getTierBadge = (tier) => {
    switch(tier?.toUpperCase()) {
      case 'VIP': return <Badge variant="warning" className="bg-gradient-to-r from-yellow-400 to-orange-500">⭐ VIP</Badge>;
      case 'GOLD': return <Badge variant="warning">🥇 Gold</Badge>;
      case 'SILVER': return <Badge variant="secondary">🥈 Silver</Badge>;
      case 'BRONZE': return <Badge variant="secondary" className="bg-gradient-to-r from-orange-400 to-orange-600">🥉 Bronze</Badge>;
      default: return <Badge variant="secondary">👤 Member</Badge>;
    }
  };

  const columns = [
    { key: 'customerId', label: 'Mã KH', render: (row) => (
      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">#{row.customerId || row.id}</span>
    )},
    { key: 'name', label: 'Khách hàng', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-500 dark:to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold">
          {(row.name || row.fullName || 'U').charAt(0)}
        </div>
        <div>
          <div className="font-semibold dark:text-white text-gray-900">{row.name || row.fullName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'phone', label: 'Liên hệ', render: (row) => (
      <span className="text-sm dark:text-gray-300 text-gray-700 font-mono">{row.phone || row.phoneNumber}</span>
    )},
    { key: 'orderCount', label: 'Đơn hàng', render: (row) => (
      <Badge variant="info">{row.orderCount || row.orders || 0} đơn</Badge>
    )},
    { key: 'totalSpent', label: 'Tổng chi tiêu', render: (row) => (
      <span className="font-bold text-lg dark:text-emerald-400 text-cyan-600">
        {typeof row.totalSpent === 'number' ? `${(row.totalSpent / 1000000000).toFixed(1)} tỷ` : row.spent || '0 tỷ'}
      </span>
    )},
    { key: 'tier', label: 'Hạng', render: (row) => getTierBadge(row.tier || row.memberTier) },
    { key: 'actions', label: 'Thao tác', render: (row) => (
      <div className="flex gap-2">
        <button 
          onClick={() => navigate(`/dealer/customers/${row.id}`)}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-emerald-500 dark:to-indigo-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-md text-sm"
        >
          Xem
        </button>
        <button className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-500 dark:to-fuchsia-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-md text-sm">
          Liên hệ
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8" /> Quản lý khách hàng
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quản lý thông tin và lịch sử mua hàng của khách hàng</p>
        </div>
        <button 
          onClick={() => navigate('/dealer/customers/new')}
          className="px-6 py-3 bg-gradient-to-r dark:from-emerald-600 dark:to-emerald-700 from-cyan-500 to-blue-600 hover:scale-105 rounded-xl font-bold text-white shadow-lg dark:hover:shadow-emerald-500/50 hover:shadow-cyan-500/50 transition-all duration-300 border border-white/20 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Thêm khách hàng mới
        </button>
      </div>

      {/* Customer Stats */}
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

      {/* Customers Table */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-fuchsia-500/10">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Khách hàng hàng đầu
          </h3>
        </div>
        
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          emptyMessage="Chưa có khách hàng nào"
        />
      </div>
    </div>
  );
};

export default CustomersSection;
