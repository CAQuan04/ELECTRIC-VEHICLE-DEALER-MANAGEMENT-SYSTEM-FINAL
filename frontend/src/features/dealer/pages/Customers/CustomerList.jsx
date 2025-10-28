import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
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

  // START: Thêm state cho Lọc và Sắp xếp
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Tiềm năng', 'Đã mua', 'Đang tư vấn'
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'
  // END: Thêm state

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    // Logic tải dữ liệu... (Giữ nguyên)
    try {
      startLoading('Đang tải danh sách khách hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCustomers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', status: 'Tiềm năng', lastContact: '2025-10-10' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0902345678', status: 'Đã mua', lastContact: '2025-09-15' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0903456789', status: 'Đang tư vấn', lastContact: '2025-10-12' },
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0904567890', status: 'Tiềm năng', lastContact: '2025-10-08' },
        { id: 5, name: 'Võ Thành E', email: 'vothanhe@email.com', phone: '0905678901', status: 'Đang tư vấn', lastContact: '2025-10-11' },
        { id: 6, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', status: 'Tiềm năng', lastContact: '2025-10-10' },
        { id: 7, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0902345678', status: 'Đã mua', lastContact: '2025-09-15' },
        { id: 8, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0903456789', status: 'Đang tư vấn', lastContact: '2025-10-12' },
        { id: 9, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0904567890', status: 'Tiềm năng', lastContact: '2025-10-08' },
        { id: 10, name: 'Võ Thành E', email: 'vothanhe@email.com', phone: '0905678901', status: 'Đang tư vấn', lastContact: '2025-10-11' },
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      stopLoading();
    }
  };

  // START: Cập nhật logic lọc và sắp xếp, bọc trong useMemo
  const filteredCustomers = useMemo(() => {
    let processedCustomers = [...customers];

    // 1. Lọc theo Search Term
    if (searchTerm) {
      processedCustomers = processedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // 2. Lọc theo Trạng thái
    if (statusFilter !== 'all') {
      processedCustomers = processedCustomers.filter(
        customer => customer.status === statusFilter
      );
    }

    // 3. Sắp xếp theo Tên
    if (sortOrder !== 'none') {
      processedCustomers.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else { // 'desc'
          return b.name.localeCompare(a.name);
        }
      });
    }

    return processedCustomers;
  }, [customers, searchTerm, statusFilter, sortOrder]); // Thêm dependencies
  // END: Cập nhật logic

  const customerMetrics = useMemo(() => {
    const total = customers.length;
    const purchased = customers.filter(c => c.status === 'Đã mua').length;
    const potential = customers.filter(c => c.status === 'Tiềm năng').length;

    return {
      total,
      purchased,
      potential,
    };
  }, [customers]);

  // START: Thêm helpers cho Sắp xếp
  const handleSortToggle = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
  };

  const getSortButtonLabel = () => {
    if (sortOrder === 'asc') return 'Tên (A-Z) 🔼';
    if (sortOrder === 'desc') return 'Tên (Z-A) 🔽';
    return 'Sắp xếp theo tên';
  };
  // END: Thêm helpers

  // Định nghĩa lại cột (Giữ nguyên)
  const columns = [
    {
      key: 'name',
      label: 'Tên khách hàng',
      render: (row) => <span className="font-semibold text-gray-800 dark:text-gray-800">{row.name}</span>
    },
    // ... (Các cột khác giữ nguyên) ...
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.email}</span>
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.phone}</span>
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Badge variant={
          row.status === 'Đã mua' ? 'success' :
            row.status === 'Đang tư vấn' ? 'warning' :
              'info'
        }>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'lastContact',
      label: 'Liên hệ gần nhất',
      render: (row) => <span className="text-gray-600 dark:text-gray-400 text-2sm">{row.lastContact}</span>
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
          onClick={() => navigate(`/dealer/customers/${row.id}`)}
        >
          Xem chi tiết KH
        </Button>
      )
    }
  ];

  return (
    <PageContainer>
      {/* 1. HEADER BANNER (Giữ nguyên) */}
      <PageHeader
        title="👥 Quản lý khách hàng"
        subtitle="Tổng quan về cơ sở dữ liệu khách hàng và các hành động nhanh"
        actions={
          <Button
            variant="gradient"
            icon="+"
            onClick={() => navigate('/dealer/customers/new')}
          >
            Thêm khách hàng
          </Button>
        }
      />

      {/* 2. METRIC CARDS - Đã thêm tiêu đề khu vực */}
      <div className="mb-8">

        {/* --- TIÊU ĐỀ --- */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          📊 Tổng quan nhanh
        </h2>


        {/* Lưới các thẻ số liệu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            title="Tổng số khách hàng"
            value={customerMetrics.total}
            icon="⭐"
            color="bg-indigo-50 border-indigo-100 dark:bg-gray-800 dark:border-indigo-100"
            className="rounded-xl" // (Đã xóa chữ 't' bị dư ở đây)
          />
          <MetricCard
            title="Khách hàng tiềm năng"
            value={customerMetrics.potential}
            icon="⚡"
            color="bg-blue-50 border-blue-500 dark:bg-gray-800 dark:border-blue-600"
            className="rounded-xl"
          />
          <MetricCard
            title="Đã chốt (Mua hàng)"
            value={customerMetrics.purchased}
            icon="✅"
            color="bg-green-50 border-green-500 dark:bg-gray-800 dark:border-green-600"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* 3. CONTROLS (Search Bar và các bộ lọc khác) - ĐÃ CẬP NHẬT */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 
                      dark:bg-slate-600 rounded-xl shadow-md 
                      border border-gray-100 dark:border-gray-400">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <SearchBar
            placeholder="Tìm kiếm khách hàng (tên, email, số điện thoại)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!mb-0 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* START: Cập nhật UI Lọc và Sắp xếp */}
        <div className="flex space-x-3">
          {/* Lọc theo Trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 text-sm dark:text-gray-300 !rounded-lg bg-stone-50 dark:bg-gray-700 border border-blue-600 dark:border-gray-300 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Tiềm năng">Tiềm năng</option>
            <option value="Đã mua">Đã mua</option>
            <option value="Đang tư vấn">Đang tư vấn</option>
          </select>

          {/* Sắp xếp theo Tên */}
          <Button
            size="sm"
            variant="secondary"
            className="!rounded-lg"
            onClick={handleSortToggle}
          >
            {getSortButtonLabel()}
          </Button>
        </div>
        {/* END: Cập nhật UI */}

      </div>

      {/* 4. TABLE / EMPTY STATE (Giữ nguyên) */}
      {filteredCustomers.length > 0 ? (
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <Table
            columns={columns}
            data={filteredCustomers}
          />
        </div>
      ) : (
        <EmptyState
          icon="📭"
          title="Không tìm thấy khách hàng"
          message={
            searchTerm || statusFilter !== 'all'
              ? "Không tìm thấy khách hàng nào phù hợp với tiêu chí."
              : "Chưa có khách hàng nào. Hãy thêm khách hàng mới."
          }
          action={{
            label: '+ Thêm khách hàng',
            onClick: () => navigate('/dealer/customers/new')
          }}
          className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-100"
        />
      )}
    </PageContainer>
  );
};

export default CustomerList;