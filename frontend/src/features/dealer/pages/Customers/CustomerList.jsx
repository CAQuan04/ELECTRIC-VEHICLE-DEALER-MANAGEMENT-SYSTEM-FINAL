import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  SearchBar, 
  Table, 
  Badge, 
  Button,
  EmptyState 
} from '../../components';

const CustomerList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      startLoading('Đang tải danh sách khách hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCustomers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', status: 'Tiềm năng', lastContact: '2025-10-10' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0902345678', status: 'Đã mua', lastContact: '2025-09-15' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0903456789', status: 'Đang tư vấn', lastContact: '2025-10-12' },
        { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0904567890', status: 'Tiềm năng', lastContact: '2025-10-08' }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      stopLoading();
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Tên khách hàng',
      render: (row) => <span className="font-semibold text-white">{row.name}</span>
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className="text-gray-400">{row.email}</span>
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      render: (row) => <span className="text-gray-400">{row.phone}</span>
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
      render: (row) => <span className="text-gray-400">{row.lastContact}</span>
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
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="👥 Quản lý khách hàng"
        subtitle="Quản lý thông tin và lịch sử khách hàng"
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

      <SearchBar
        placeholder="Tìm kiếm khách hàng (tên, email, số điện thoại)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {filteredCustomers.length > 0 ? (
        <Table
          columns={columns}
          data={filteredCustomers}
        />
      ) : (
        <EmptyState
          icon="📭"
          title="Không tìm thấy khách hàng"
          message="Thử tìm kiếm với từ khóa khác hoặc thêm khách hàng mới"
          action={{
            label: '+ Thêm khách hàng đầu tiên',
            onClick: () => navigate('/dealer/customers/new')
          }}
        />
      )}
    </PageContainer>
  );
};

export default CustomerList;
