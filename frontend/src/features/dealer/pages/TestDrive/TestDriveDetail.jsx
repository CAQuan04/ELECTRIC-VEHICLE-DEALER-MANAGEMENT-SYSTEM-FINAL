import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Button, 
  Badge, 
  Table 
} from '../../components';

const TestDriveDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { startLoading, stopLoading } = usePageLoading();
  
  // allTestDrives sẽ giữ danh sách đầy đủ từ API
  const [allTestDrives, setAllTestDrives] = useState([]);
  
  // filter sẽ kiểm soát tab nào đang được chọn
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  // Chỉ tải dữ liệu một lần khi component mount
  useEffect(() => {
    loadTestDrives();
  }, []);

  const loadTestDrives = async () => {
    try {
      startLoading('Đang tải danh sách lái thử...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTestDrives = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', date: '2025-10-15', time: '10:00', status: 'Đã xác nhận' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', date: '2025-10-16', time: '14:00', status: 'Chờ xác nhận' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', date: '2025-10-14', time: '09:00', status: 'Hoàn thành' },
        { id: 4, customer: 'Phạm Thị D', vehicle: 'Model X', date: '2025-10-17', time: '15:30', status: 'Đã xác nhận' },
        { id: 5, customer: 'Võ Văn E', vehicle: 'Model 3', date: '2025-10-18', time: '11:00', status: 'Chờ xác nhận' },
      ];
      
      setAllTestDrives(mockTestDrives);
    } catch (error) {
      console.error('Error loading test drives:', error);
    } finally {
      stopLoading();
    }
  };

  // Lọc danh sách hiển thị bằng useMemo để tối ưu hiệu suất
  const filteredTestDrives = useMemo(() => {
    if (filter === 'all') {
      return allTestDrives;
    }
    
    // Map trạng thái của filter sang trạng thái trong dữ liệu
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
    };
    
    return allTestDrives.filter(drive => drive.status === statusMap[filter]);
  }, [allTestDrives, filter]);

  // Helper để chuyển đổi status (dữ liệu) sang variant (Badge)
  const getStatusVariant = (status) => {
    const statusMap = {
      'Chờ xác nhận': 'warning',
      'Đã xác nhận': 'info',
      'Hoàn thành': 'success',
      'Đã hủy': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  // Định nghĩa cột cho component Table
  const columns = [
    {
      key: 'customer',
      label: 'Khách hàng',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.customer}
        </span>
      )
    },
    {
      key: 'vehicle',
      label: 'Xe'
    },
    {
      key: 'date',
      label: 'Ngày'
    },
    {
      key: 'time',
      label: 'Giờ'
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="link" size="sm" onClick={() => alert(`Xem chi tiết ${row.id}`)}>
            Chi tiết
          </Button>
          {row.status === 'Chờ xác nhận' && (
            <Button variant="link" size="sm" className="text-emerald-600 dark:text-emerald-400" onClick={() => alert(`Xác nhận ${row.id}`)}>
              Xác nhận
            </Button>
          )}
        </div>
      )
    }
  ];

  // Component cho Tab
  const FilterTab = ({ value, label }) => (
    <button
      className={`px-4 py-3 font-semibold text-sm transition-colors
        ${
          filter === value
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent'
        }`}
      onClick={() => setFilter(value)}
    >
      {label}
    </button>
  );

  return (
    <PageContainer>
      <PageHeader
        title="🚗 Quản lý lái thử"
        actions={
          <Button 
            variant="primary"
            icon="+"
            onClick={() => navigate('/dealer/test-drives/new')}
          >
            Đăng ký lái thử mới
          </Button>
        }
      />

      {/* Filter Tabs (Giao diện mới) */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          <FilterTab value="all" label="Tất cả" />
          <FilterTab value="pending" label="Chờ xác nhận" />
          <FilterTab value="confirmed" label="Đã xác nhận" />
          <FilterTab value="completed" label="Hoàn thành" />
        </nav>
      </div>

      {/* Bảng dữ liệu (Sử dụng component Table) */}
      <Table
        columns={columns}
        data={filteredTestDrives}
        onRowClick={(row) => alert(`Xem chi tiết ${row.id}`)}
      />

      {/* Nút xem lịch (Giao diện mới) */}
      <div className="mt-6 flex justify-start">
        <Button 
          variant="secondary" 
          icon="📅"
          onClick={() => navigate('/dealer/test-drives/calendar')}
        >
          Xem lịch
        </Button>
      </div>
    </PageContainer>
  );
};

export default TestDriveDetail;
