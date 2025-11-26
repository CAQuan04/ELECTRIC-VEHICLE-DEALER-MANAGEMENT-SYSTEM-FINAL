import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';
import { useAuth } from '@/context/AuthContext';
// Import Lucide icons
import {
  UserPlus,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Search,
  Users,
  Zap,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

import {
  PageContainer,
  PageHeader,
  SearchBar,
  Table,
  Badge,
  Button,
  EmptyState,
  MetricCard
} from '../../components';

const CustomerList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      startLoading('Đang tải danh sách khách hàng...');
      const response = await dealerAPI.getCustomers();

      if (response.success) {
        // Kiểm tra xem data là mảng hay object phân trang
        const rawData = Array.isArray(response.data)
          ? response.data
          : (response.data?.items || []); // Fallback nếu API trả về dạng { items: [...] }

        // MAP DỮ LIỆU BACKEND -> FRONTEND
        const mappedData = rawData.map(item => ({
          id: item.customerId,           // Map customerId -> id
          name: item.fullName,           // Map fullName -> name
          email: item.email || '',       // Backend thiếu email -> để trống
          phone: item.phone,
          address: item.address,

          // Logic tự động tính trạng thái dựa trên số đơn hàng
          status: item.totalOrders > 0 ? 'Đã mua' : 'Tiềm năng',

          // Các trường thống kê
          totalOrders: item.totalOrders,
          totalTestDrives: item.totalTestDrives,
          lastContact: 'N/A'             // Backend thiếu trường này -> để N/A
        }));

        setCustomers(mappedData);
      } else {
        notifications.error('Lỗi tải dữ liệu', response.message);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      notifications.error('Lỗi tải dữ liệu', error.message);
      setCustomers([]);
    } finally {
      stopLoading();
    }
  };

  // Filter and sort logic
  const filteredCustomers = useMemo(() => {
    let processedCustomers = [...customers];

    // Search filter
    if (searchTerm) {
      processedCustomers = processedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      processedCustomers = processedCustomers.filter(
        customer => customer.status === statusFilter
      );
    }

    // Sort
    if (sortOrder !== 'none') {
      processedCustomers.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }

    return processedCustomers;
  }, [customers, searchTerm, statusFilter, sortOrder]);

  // Metrics
  const customerMetrics = useMemo(() => {
    const total = customers.length;
    const purchased = customers.filter(c => c.status === 'Đã mua').length;
    const potential = customers.filter(c => c.status === 'Tiềm năng').length;
    const consulting = customers.filter(c => c.status === 'Đang tư vấn').length;

    return { total, purchased, potential, consulting };
  }, [customers]);

  // Sort toggle handler
  const handleSortToggle = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <SortAsc className="w-4 h-4" />;
    if (sortOrder === 'desc') return <SortDesc className="w-4 h-4" />;
    return <Filter className="w-4 h-4" />;
  };

  const getSortLabel = () => {
    if (sortOrder === 'asc') return 'Tên (A-Z)';
    if (sortOrder === 'desc') return 'Tên (Z-A)';
    return 'Sắp xếp';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortOrder('none');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || sortOrder !== 'none';

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Tên khách hàng',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-rose-500 dark:to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {/* Lấy chữ cái đầu của fullName */}
            {row.name ? row.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <span className="font-bold text-gray-800 dark:text-gray-200 block">
              {row.name}
            </span>
            {/* Hiển thị địa chỉ phụ bên dưới tên vì JSON có address */}
            <span className="text-xs text-gray-500 truncate max-w-[150px] block">
              {row.address}
            </span>
          </div>
        </div>
      )
    },

    {
      key: 'email',
      label: 'Email',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.email || <span className="italic text-gray-400">Chưa cập nhật</span>}
        </span>
      )
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      render: (row) => (
        <a
          href={`tel:${row.phone}`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {row.phone}
        </a>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Badge
          variant={
            row.status === 'Đã mua'
              ? 'success'
              : row.status === 'Tiềm năng'
                ? 'info'
                : 'warning'
          }
        >
          {row.status}
        </Badge>
      )
    },
    {
      key: 'stats', // Đổi cột Last Contact thành Thống kê vì JSON có số liệu này
      label: 'Hoạt động',
      render: (row) => (
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>🛒 Đơn hàng: <b>{row.totalOrders}</b></div>
          <div>🚗 Lái thử: <b>{row.totalTestDrives}</b></div>
        </div>
      )
    },
    {
      key: 'lastContact',
      label: 'Liên hệ gần nhất',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {row.lastContact || 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      tdClassName: 'text-center',
      render: (row) => (
        <Button
          size="sm"
          variant="primary"
          // Sử dụng row.id (đã map từ customerId)
          onClick={() => navigate(`/${dealerId}/dealer/customers/${row.id}`)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <PageContainer>
        {/* Header */}
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10" />
              <span>Quản lý khách hàng</span>
            </div>
          }
          subtitle="Tổng quan về cơ sở dữ liệu khách hàng và các hành động nhanh"
          actions={
            <Button
              variant="gradient"
              icon={<UserPlus className="w-5 h-5" />}
              onClick={() => navigate(`/${dealerId}/dealer/customers/new`)}
            >
              Thêm khách hàng
            </Button>
          }
        />

        {/* Metrics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-cyan-600 dark:text-emerald-400" />
            Tổng quan nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Tổng số khách hàng"
              value={customerMetrics.total}
              icon={<Users className="w-12 h-12" />}
              color="gray"
            />
            <MetricCard
              title="Khách hàng tiềm năng"
              value={customerMetrics.potential}
              icon={<Zap className="w-12 h-12" />}
              color="blue"
            />
            <MetricCard
              title="Đang tư vấn"
              value={customerMetrics.consulting}
              icon={<MessageSquare className="w-12 h-12" />}
              color="yellow"
            />
            <MetricCard
              title="Đã chốt (Mua hàng)"
              value={customerMetrics.purchased}
              icon={<CheckCircle className="w-12 h-12" />}
              color="rose"
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/80 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-200 dark:border-gray-700/50 shadow-xl dark:shadow-emerald-500/5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <SearchBar
                  placeholder="Tìm kiếm khách hàng (tên, email, số điện thoại)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!mb-0 pl-12"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-3 rounded-2xl bg-rose-800/50 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-emerald-500/20 focus:border-cyan-500 dark:focus:border-emerald-500 transition-all duration-300 font-medium cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Tiềm năng">Tiềm năng</option>
                <option value="Đã mua">Đã mua</option>
                <option value="Đang tư vấn">Đang tư vấn</option>
              </select>

              {/* Sort Button */}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSortToggle}
                icon={getSortIcon()}
              >
                {getSortLabel()}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={clearFilters}
                  icon={<X className="w-4 h-4" />}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Bộ lọc đang áp dụng:
                </span>
                {searchTerm && (
                  <Badge variant="info">
                    <Search className="w-3 h-3 mr-1" />
                    Tìm kiếm: "{searchTerm}"
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="warning">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Trạng thái: {statusFilter}
                  </Badge>
                )}
                {sortOrder !== 'none' && (
                  <Badge variant="purple">
                    {sortOrder === 'asc' ? (
                      <SortAsc className="w-3 h-3 mr-1" />
                    ) : (
                      <SortDesc className="w-3 h-3 mr-1" />
                    )}
                    {sortOrder === 'asc' ? 'Sắp xếp: A-Z' : 'Sắp xếp: Z-A'}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredCustomers.length > 0 && (
          <div className="mb-4 text-right">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center justify-end gap-2">
              <Users className="w-4 h-4" />
              Hiển thị {filteredCustomers.length} / {customers.length} khách hàng
            </span>
          </div>
        )}

        {/* Table / Empty State */}
        {filteredCustomers.length > 0 ? (
          <Table
            columns={columns}
            data={filteredCustomers}
            onRowClick={(row) => navigate(`/${dealerId}/dealer/customers/${row.id}`)}
          />
        ) : (
          <EmptyState
            icon={<Search className="w-20 h-20 text-gray-400 dark:text-gray-600" />}
            title="Không tìm thấy khách hàng"
            message={
              hasActiveFilters
                ? 'Không tìm thấy khách hàng nào phù hợp với tiêu chí. Thử điều chỉnh bộ lọc hoặc tìm kiếm.'
                : 'Chưa có khách hàng nào. Hãy thêm khách hàng mới để bắt đầu.'
            }
            action={{
              label: hasActiveFilters ? 'Xóa bộ lọc' : '+ Thêm khách hàng',
              onClick: hasActiveFilters ? clearFilters : () => navigate(`/${dealerId}/dealer/customers/new`)
            }}
          />
        )}
      </PageContainer>
    </div>
  );
};

export default CustomerList;