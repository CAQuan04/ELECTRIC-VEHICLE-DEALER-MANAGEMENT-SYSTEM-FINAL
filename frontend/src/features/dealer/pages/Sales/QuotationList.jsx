import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button, 
  Badge, 
  Table 
} from '../../components';

const QuotationList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      startLoading('Đang tải danh sách báo giá...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockQuotations = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', amount: 1200000000, date: '2025-10-10', status: 'Chờ phản hồi', validUntil: '2025-10-25' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', amount: 1500000000, date: '2025-10-12', status: 'Đã chấp nhận', validUntil: '2025-10-27' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', amount: 2800000000, date: '2025-10-08', status: 'Từ chối', validUntil: '2025-10-23' }
      ];
      
      setQuotations(mockQuotations);
    } catch (error) {
      console.error('Error loading quotations:', error);
    } finally {
      stopLoading();
    }
  };
  const getStatusBadge = (status) => {
    const statusMap = {
      'Chờ phản hồi': 'warning',
      'Đã chấp nhận': 'success',
      'Từ chối': 'danger',
      'Hết hạn': 'gray'
    };
    return statusMap[status] || 'gray';
  };

  const formatPrice = (price) => {
    return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
  };

  const quotationColumns = [
    { 
      key: 'id', 
      label: 'Mã báo giá', 
      render: (item) => <span className="font-bold text-emerald-400">QUO-{String(item.id).padStart(4, '0')}</span>
    },
    { key: 'customer', label: 'Khách hàng' },
    { key: 'vehicle', label: 'Xe', render: (item) => <span className="font-semibold">{item.vehicle}</span> },
    { 
      key: 'amount', 
      label: 'Giá trị', 
      render: (item) => <span className="text-emerald-400 font-bold">{formatPrice(item.amount)}</span>
    },
    { key: 'date', label: 'Ngày tạo', render: (item) => <span className="text-gray-400">{item.date}</span> },
    { key: 'validUntil', label: 'Hiệu lực đến', render: (item) => <span className="text-gray-400">{item.validUntil}</span> },
    { 
      key: 'status', 
      label: 'Trạng thái', 
      render: (item) => <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
    },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">👁️ Xem</Button>
          <Button variant="ghost" size="sm">🖨️ In</Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="📄 Quản lý báo giá"
        subtitle="Theo dõi và quản lý báo giá cho khách hàng"
        actions={
          <Button variant="gradient" onClick={() => navigate('/dealer/sales/quotations/new')}>
            + Tạo báo giá mới
          </Button>
        }
      />

      <Card>
        <Table
          columns={quotationColumns}
          data={quotations}
        />
      </Card>
    </PageContainer>
  );
};

export default QuotationList;
