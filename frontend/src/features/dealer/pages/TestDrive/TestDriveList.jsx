import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { AuthService } from '@utils';
import { notifications } from '@utils/notifications';
import {
  PageContainer,
  PageHeader,
  Button,
  Badge,
  Table,
  SearchBar,
  EmptyState,
  StatCard
} from '../../components';
import { Calendar, Car, BarChart3, Clock, CheckCircle, PartyPopper } from 'lucide-react';

const TestDriveList = () => {
  const navigate = useNavigate();
  const [allTestDrives, setAllTestDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTestDrives();
  }, []);

  const loadTestDrives = async () => {
    setIsLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const dealerId = currentUser?.dealerId;
      
      if (!dealerId) {
        notifications.error('Lỗi', 'Không tìm thấy thông tin đại lý');
        setAllTestDrives([]);
        setIsLoading(false);
        return;
      }
      
      console.log('🔍 Loading test drives for dealerId:', dealerId);
      const result = await dealerAPI.getTestDrives(dealerId);
      console.log('✅ Test drives result:', result);
      
      if (result.success && result.data) {
        const testDriveList = Array.isArray(result.data) ? result.data : [];
        console.log('📋 Test drive list:', testDriveList);
        setAllTestDrives(testDriveList);
      } else {
        console.error('❌ Failed to load test drives:', result.message);
        setAllTestDrives([]);
      }
    } catch (error) {
      console.error('Error loading test drives:', error);
      setAllTestDrives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (testId, newStatus) => {
    try {
      const result = await dealerAPI.updateTestDriveStatus(testId, newStatus);
      if (result.success) {
        await loadTestDrives();
        notifications.success('Thành công', 'Cập nhật trạng thái thành công!');
      } else {
        notifications.error('Lỗi cập nhật', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.error('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleCancelTestDrive = async (testId) => {
    notifications.confirm(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy lịch lái thử này?',
      async () => {
        try {
          const result = await dealerAPI.cancelTestDrive(testId, 'Hủy bởi nhân viên');
          if (result.success) {
            await loadTestDrives();
            notifications.success('Thành công', 'Đã hủy lịch lái thử thành công!');
          } else {
            notifications.error('Lỗi hủy lịch', result.message);
          }
        } catch (error) {
          console.error('Error cancelling test drive:', error);
          notifications.error('Lỗi', 'Có lỗi xảy ra khi hủy lịch');
        }
      }
    );
  };

  const filteredTestDrives = useMemo(() => {
    let filtered = allTestDrives;
    
    // Filter by status
    if (filter !== 'all') {
      const statusMap = {
        pending: 'pending',
        confirmed: 'confirmed',
        completed: 'completed',
        cancelled: 'cancelled'
      };
      filtered = filtered.filter(drive => drive.status === statusMap[filter]);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(drive =>
        drive.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.vehicleModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.customerPhone?.includes(searchQuery)
      );
    }
    
    return filtered;
  }, [allTestDrives, filter, searchQuery]);

  const getStatusVariant = (status) => {
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

  const columns = [
    {
      key: 'customerName',
      label: 'Khách hàng',
      render: (row) => (
        <div>
          <span className="font-semibold text-gray-900 dark:text-white block">
            {row.customerName}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.customerPhone}
          </span>
        </div>
      )
    },
    {
      key: 'vehicle',
      label: 'Xe',
      render: (row) => (
        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
          {row.vehicleModel}
        </span>
      )
    },
    {
      key: 'scheduleDatetime',
      label: 'Thời gian',
      render: (row) => (
        <div>
          <span className="block font-medium">
            {new Date(row.scheduleDatetime).toLocaleDateString('vi-VN')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(row.scheduleDatetime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )
    },
    {
      key: 'dealerName',
      label: 'Đại lý',
      render: (row) => (
        <span className="text-sm">{row.dealerName}</span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {getStatusLabel(row.status)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('👁️ View test drive:', row);
              const currentUser = AuthService.getCurrentUser();
              const dealerId = currentUser?.dealerId;
              navigate(dealerId ? `/${dealerId}/dealer/test-drives/${row.testId}` : `/dealer/test-drives/${row.testId}`);
            }}
          >
            👁️ Chi tiết
          </Button>
          {row.status === 'pending' && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-emerald-600 dark:text-emerald-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(row.id, 'confirmed');
                }}
              >
                ✓ Xác nhận
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelTestDrive(row.id);
                }}
              >
                ✗ Hủy
              </Button>
            </>
          )}
          {row.status === 'confirmed' && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-emerald-600 dark:text-emerald-400"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(row.id, 'completed');
              }}
            >
              ✓ Hoàn thành
            </Button>
          )}
        </div>
      )
    }
  ];

  const stats = useMemo(() => ({
    total: allTestDrives.length,
    pending: allTestDrives.filter(d => d.status === 'pending').length,
    confirmed: allTestDrives.filter(d => d.status === 'confirmed').length,
    completed: allTestDrives.filter(d => d.status === 'completed').length
  }), [allTestDrives]);

  const FilterTab = ({ value, label, count }) => (
    <button
      className={`px-6 py-3 font-semibold text-2sm transition-all duration-300 relative
        ${filter === value
          ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent'
        }`}
      onClick={() => setFilter(value)}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
          filter === value 
            ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Quản lý lái thử"
          subtitle="Quản lý lịch hẹn và theo dõi buổi lái thử"
          icon={<Car className="w-16 h-16" />}
        />
        <div className="text-center py-16 mt-8">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
            Đang tải danh sách lái thử...
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý lái thử"
        subtitle="Quản lý lịch hẹn và theo dõi buổi lái thử"
        icon={<Car className="w-16 h-16" />}
        actions={
          <div className="flex gap-3">
            <Button 
              variant="secondary"
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => {
                const currentUser = AuthService.getCurrentUser();
                const dealerId = currentUser?.dealerId;
                navigate(dealerId ? `/${dealerId}/dealer/test-drives/calendar` : '/dealer/test-drives/calendar');
              }}
            >
              Xem lịch
            </Button>
            <Button 
              variant="gradient"
              onClick={() => {
                const currentUser = AuthService.getCurrentUser();
                const dealerId = currentUser?.dealerId;
                navigate(dealerId ? `/${dealerId}/dealer/test-drives/new` : '/dealer/test-drives/new');
              }}
            >
              + Đăng ký mới
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid mt-8 grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Tổng số"
          value={stats.total}
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Chờ xác nhận"
          value={stats.pending}
          trend={stats.pending > 0 ? 'neutral' : 'up'}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Đã xác nhận"
          value={stats.confirmed}
        />
        <StatCard
          icon={<PartyPopper className="w-6 h-6" />}
          title="Hoàn thành"
          value={stats.completed}
          trend="up"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Tìm kiếm theo khách hàng, xe hoặc số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-blue-700 overflow-hidden">
        <nav className="flex flex-wrap" aria-label="Tabs">
          <FilterTab value="all" label="Tất cả" count={stats.total} />
          <FilterTab value="pending" label="Chờ xác nhận" count={stats.pending} />
          <FilterTab value="confirmed" label="Đã xác nhận" count={stats.confirmed} />
          <FilterTab value="completed" label="Hoàn thành" count={stats.completed} />
        </nav>
      </div>

      {/* Table */}
      {filteredTestDrives.length > 0 ? (
        <Table
          columns={columns}
          data={filteredTestDrives}
          onRowClick={(row) => {
            console.log('📋 Row clicked:', row);
            const currentUser = AuthService.getCurrentUser();
            const dealerId = currentUser?.dealerId;
            navigate(dealerId ? `/${dealerId}/dealer/test-drives/${row.testId}` : `/dealer/test-drives/${row.testId}`);
          }}
        />
      ) : (
        <EmptyState
          icon={<Car className="w-12 h-12" />}
          title="Chưa có lịch lái thử"
          message={searchQuery ? "Không tìm thấy lịch lái thử phù hợp" : "Chưa có lịch hẹn lái thử nào"}
          action={{
            label: "Đăng ký lái thử mới",
            onClick: () => {
              const currentUser = AuthService.getCurrentUser();
              const dealerId = currentUser?.dealerId;
              navigate(dealerId ? `/${dealerId}/dealer/test-drives/new` : '/dealer/test-drives/new');
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default TestDriveList;