import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button, 
  Badge, 
  Table,
  StatCard,
  SearchBar
} from '../../components';

const DealerInventory = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      startLoading('Đang tải kho xe...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInventory = [
        { id: 1, model: 'Model 3', total: 15, available: 12, reserved: 3, color: 'White', status: 'Sẵn sàng' },
        { id: 2, model: 'Model Y', total: 10, available: 8, reserved: 2, color: 'Black', status: 'Sẵn sàng' },
        { id: 3, model: 'Model S', total: 6, available: 5, reserved: 1, color: 'Red', status: 'Sẵn sàng' },
        { id: 4, model: 'Model X', total: 3, available: 3, reserved: 0, color: 'Blue', status: 'Sẵn sàng' }
      ];
      
      setInventory(mockInventory);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      stopLoading();
    }
  };

  const handleRequestStock = () => {
    navigate('/dealer/inventory/request');
  };

  const inventoryColumns = [
    { key: 'model', label: 'Dòng xe', render: (item) => <span className="font-semibold">{item.model}</span> },
    { key: 'color', label: 'Màu sắc' },
    { key: 'total', label: 'Tổng số', render: (item) => <span className="text-white font-bold">{item.total}</span> },
    { key: 'available', label: 'Sẵn bán', render: (item) => <span className="text-emerald-400">{item.available}</span> },
    { key: 'reserved', label: 'Đã đặt', render: (item) => <span className="text-yellow-400">{item.reserved}</span> },
    { key: 'status', label: 'Trạng thái', render: (item) => <Badge variant="success">{item.status}</Badge> },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (item) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/dealer/inventory/${item.id}`)}
        >
          Chi tiết →
        </Button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Kho xe"
        subtitle="Quản lý tồn kho và đặt hàng mới"
        actions={
          <Button variant="gradient" onClick={handleRequestStock}>
            + Yêu cầu nhập xe
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="📦"
          title="Tổng xe trong kho"
          value={inventory.reduce((sum, item) => sum + item.total, 0)}
          trend="neutral"
        />
        <StatCard
          icon="✅"
          title="Xe sẵn sàng bán"
          value={inventory.reduce((sum, item) => sum + item.available, 0)}
          trend="up"
          change="Sẵn sàng giao"
        />
        <StatCard
          icon="🔖"
          title="Xe đã đặt cọc"
          value={inventory.reduce((sum, item) => sum + item.reserved, 0)}
          trend="neutral"
          change="Đang xử lý"
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <Table
          columns={inventoryColumns}
          data={inventory}
        />
      </Card>
    </PageContainer>
  );
};

export default DealerInventory;
