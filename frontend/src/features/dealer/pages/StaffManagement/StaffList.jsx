import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// Lucide icons
import {
  UserPlus,
  Filter,
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
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  const { startLoading, stopLoading } = usePageLoading();

  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

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

      if (result.success) setStaff(result.data || []);
      else notifications.error('Lỗi tải dữ liệu', result.message);
    } catch (error) {
      notifications.error('Lỗi', 'Không thể tải danh sách nhân viên');
    } finally {
      stopLoading();
    }
  };

  const filteredStaff = useMemo(() => {
    let filtered = [...staff];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.fullName?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.phoneNumber?.toLowerCase().includes(query) ||
        member.username?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.roleId === Number(roleFilter));
    }

    return filtered;
  }, [staff, searchTerm, statusFilter, roleFilter]);

  const metrics = useMemo(() => ({
    total: staff.length,
    active: staff.filter(s => s.status === 'Active').length,
    inactive: staff.filter(s => s.status === 'Inactive').length,
    filtered: filteredStaff.length
  }), [staff, filteredStaff]);

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const actionText = newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa';

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} nhân viên này?`))
      return;

    try {
      startLoading(`Đang ${actionText} nhân viên...`);
      const result = await dealerAPI.updateUserStatus(userId, newStatus);

      if (result.success) {
        notifications.success('Thành công', `Đã ${actionText} nhân viên thành công`);
        loadStaff();
      } else notifications.error('Lỗi', result.message);
    } catch {
      notifications.error('Lỗi', `Không thể ${actionText} nhân viên`);
    } finally {
      stopLoading();
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('vi-VN');
    } catch {
      return d;
    }
  };

  const columns = [
    { key: 'userId', label: 'ID', render: v => `#${v}` },
    {
      key: 'fullName', label: 'Tên nhân viên',
      render: (value, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{value || row.username}</strong>
          <small style={{ color: '#666' }}>{row.username}</small>
        </div>
      )
    },
    {
      key: 'roleId', label: 'Chức vụ',
      render: v => <Badge variant="info">{roleNames[v] || `Role ${v}`}</Badge>
    },
    { key: 'email', label: 'Email', render: v => v || 'N/A' },
    { key: 'phoneNumber', label: 'Số điện thoại', render: v => v || 'N/A' },
    { key: 'dateOfBirth', label: 'Ngày sinh', render: v => formatDate(v) },
    { key: 'dealerId', label: 'Đại lý', render: v => v ? `Dealer #${v}` : 'N/A' },

    {
      key: 'status', label: 'Trạng thái',
      render: v => (
        <Badge variant={v === 'Active' ? 'success' : 'danger'}>
          {v === 'Active' ? 'Đang làm việc' : 'Nghỉ việc'}
        </Badge>
      )
    },

    {
      key: 'actions', label: 'Thao tác',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(dealerId
                ? `/${dealerId}/dealer/staff/${row.userId}/edit`
                : `/dealer/staff/${row.userId}/edit`
              )
            }
          >
            <Edit size={16} /> Sửa
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange(row.userId, row.status)}
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
            icon={<UserPlus size={18} />}
            onClick={() =>
              navigate(dealerId ? `/${dealerId}/dealer/staff/new` : `/dealer/staff/new`)
            }
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
        <MetricCard title="Tổng nhân viên" value={metrics.total} icon={<Users />} color="primary" />
        <MetricCard title="Đang làm việc" value={metrics.active} icon={<UserCheck />} color="success" />
        <MetricCard title="Nghỉ việc" value={metrics.inactive} icon={<UserX />} color="danger" />
        <MetricCard title="Kết quả lọc" value={metrics.filtered} icon={<Filter />} color="info" />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.5rem',
        flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="🔍 Tìm kiếm theo tên, email, SĐT..."
          />
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="Active">Đang làm việc</option>
          <option value="Inactive">Nghỉ việc</option>
        </select>

        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">Tất cả chức vụ</option>
          {Object.entries(roleNames).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <Button
          variant="secondary"
          icon={<RefreshCw size={18} />}
          onClick={loadStaff}
        >
          Làm mới
        </Button>
      </div>

      {/* Table or Empty State */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="Không tìm thấy nhân viên"
          description="Không có nhân viên nào phù hợp với bộ lọc hiện tại"
          action={
            <Button
              variant="primary"
              icon={<UserPlus size={18} />}
              onClick={() =>
                navigate(dealerId ? `/${dealerId}/dealer/staff/new` : `/dealer/staff/new`)
              }
            >
              Thêm nhân viên đầu tiên
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={filteredStaff}
          keyExtractor={row => row.userId}
        />
      )}
    </PageContainer>
  );
};

export default StaffList;
