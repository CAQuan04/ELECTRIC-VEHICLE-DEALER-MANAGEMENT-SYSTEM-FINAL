import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Import Lucide icons
import {
  UserPlus,
  Filter,
  Search,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Edit,
  Power
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

const StaffList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Role mapping
  const roleNames = {
    1: 'Admin',
    2: 'Dealer Manager',
    3: 'Sales Executive',
    4: 'Technician',
    5: 'Customer Service',
    6: 'Finance',
    7: 'Support'
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      startLoading('Đang tải danh sách nhân viên...');
      
      const result = await dealerAPI.getUsers();
      
      if (result.success) {
        setStaff(result.data || []);
      } else {
        notifications.error('Lỗi tải dữ liệu', result.message);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      notifications.error('Lỗi', 'Không thể tải danh sách nhân viên');
    } finally {
      stopLoading();
    }
  };

  // Filter logic
  const filteredStaff = useMemo(() => {
    let filtered = [...staff];

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.fullName?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.phoneNumber?.toLowerCase().includes(query) ||
        member.username?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.roleId === parseInt(roleFilter));
    }

    return filtered;
  }, [staff, searchTerm, statusFilter, roleFilter]);

  // Metrics
  const staffMetrics = useMemo(() => {
    const total = staff.length;
    const active = staff.filter(s => s.status === 'Active').length;
    const inactive = staff.filter(s => s.status === 'Inactive').length;
    const filtered = filteredStaff.length;

    return { total, active, inactive, filtered };
  }, [staff, filteredStaff]);

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const actionText = newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa';
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} nhân viên này?`)) {
      return;
    }

    try {
      startLoading(`Đang ${actionText} nhân viên...`);
      
      const result = await dealerAPI.updateUserStatus(userId, newStatus);
      
      if (result.success) {
        notifications.success('Thành công', `Đã ${actionText} nhân viên thành công`);
        loadStaff(); // Reload list
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifications.error('Lỗi', `Không thể ${actionText} nhân viên`);
    } finally {
      stopLoading();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Table columns
  const columns = [
    { 
      key: 'userId', 
      label: 'ID',
      render: (value) => `#${value}`
    },
    { 
      key: 'fullName', 
      label: 'Tên nhân viên',
      render: (value, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <strong>{value || row.username}</strong>
          <small style={{ color: '#666', fontSize: '0.85rem' }}>{row.username}</small>
        </div>
      )
    },
    { 
      key: 'roleId', 
      label: 'Chức vụ',
      render: (value) => (
        <Badge variant="info">
          {roleNames[value] || `Role ${value}`}
        </Badge>
      )
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'phoneNumber', 
      label: 'Số điện thoại',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'dateOfBirth', 
      label: 'Ngày sinh',
      render: (value) => formatDate(value)
    },
    { 
      key: 'dealerId', 
      label: 'Đại lý',
      render: (value) => value ? `Dealer #${value}` : 'N/A'
    },
    { 
      key: 'status', 
      label: 'Trạng thái',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : 'danger'}>
          {value === 'Active' ? 'Đang làm việc' : 'Nghỉ việc'}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      label: 'Thao tác',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dealer/staff/${row.userId}/edit`)}
            title="Chỉnh sửa"
          >
            <Edit size={16} /> Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange(row.userId, row.status)}
            title={row.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <Power size={16} />
            {row.status === 'Active' ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="👥 Quản lý nhân viên"
        description="Quản lý thông tin nhân viên và phân quyền"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/dealer/staff/new')}
            icon={<UserPlus size={18} />}
          >
            Thêm nhân viên
          </Button>
        }
      />

      {/* Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <MetricCard
          title="Tổng nhân viên"
          value={staffMetrics.total}
          icon={<Users size={24} />}
          trend={{ value: 0, isPositive: true }}
          color="primary"
        />
        <MetricCard
          title="Đang làm việc"
          value={staffMetrics.active}
          icon={<UserCheck size={24} />}
          trend={{ value: 0, isPositive: true }}
          color="success"
        />
        <MetricCard
          title="Nghỉ việc"
          value={staffMetrics.inactive}
          icon={<UserX size={24} />}
          trend={{ value: 0, isPositive: false }}
          color="danger"
        />
        <MetricCard
          title="Kết quả lọc"
          value={staffMetrics.filtered}
          icon={<Filter size={24} />}
          color="info"
        />
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="🔍 Tìm kiếm theo tên, email, SĐT..."
          />
        </div>
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Active">Đang làm việc</option>
          <option value="Inactive">Nghỉ việc</option>
        </select>

        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">Tất cả chức vụ</option>
          {Object.entries(roleNames).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <Button
          variant="secondary"
          onClick={loadStaff}
          icon={<RefreshCw size={18} />}
        >
          Làm mới
        </Button>
      </div>

      {/* Staff Table */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="Không tìm thấy nhân viên"
          description="Không có nhân viên nào phù hợp với bộ lọc hiện tại"
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/dealer/staff/new')}
              icon={<UserPlus size={18} />}
            >
              Thêm nhân viên đầu tiên
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={filteredStaff}
          keyExtractor={(row) => row.userId}
        />
      )}
    </PageContainer>
  );
};

export default StaffList;
