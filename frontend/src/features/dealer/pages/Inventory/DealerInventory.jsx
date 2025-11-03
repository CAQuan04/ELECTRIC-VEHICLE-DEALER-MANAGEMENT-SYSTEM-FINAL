import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading'; // Giả sử path đúng
import { dealerAPI } from '@/utils/api/services/dealer.api.js'; // Sửa path
import { Package, CheckCircle, Tag, Archive } from 'lucide-react';

// Import UI components
import  Button  from '@/features/dealer/components/ui/Button.jsx';
import  Badge from '@/features/dealer/components/ui/Badge.jsx';
import  StatCard  from '@/features/dealer/components/ui/StatCard.jsx';
import  Card  from '@/features/dealer/components/ui/Card.jsx';
import  Table  from '@/features/dealer/components/ui/Table.jsx'; // Giả sử bạn có
import { DetailHeader } from '@/features/dealer/components/ui/AdvancedComponents.jsx';
import  SearchBar  from '@/features/dealer/components/ui/SearchBar.jsx';
import  EmptyState  from '@/features/dealer/components/ui/EmptyState.jsx';

// (Giả sử PageContainer là 1 div đơn giản)
const PageContainer = ({ children }) => <div className="container mx-auto p-4 md:p-8">{children}</div>;

const DealerInventory = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadInventory();
  }, []); // Tải khi component mount

  const loadInventory = async () => {
    try {
      startLoading('Đang tải kho xe...');
      // 1. GỌI API THẬT
      const result = await dealerAPI.getInventory(filters); 

      if (result.success && result.data) {
        // Giả định API trả về { success: true, data: [...] }
        const inventoryList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setInventory(inventoryList);
      } else {
        console.error('Lỗi khi tải kho:', result.message);
        alert('Không thể tải dữ liệu kho');
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Lỗi hệ thống khi tải kho');
    } finally {
      stopLoading();
    }
  };

  const handleRequestStock = () => {
    navigate('/dealer/inventory/request');
  };

  const inventoryColumns = [
    { key: 'model', label: 'Dòng xe', render: (item) => <span className="font-semibold">{item.model || item.productInfo?.name}</span> },
    { key: 'color', label: 'Màu sắc', render: (item) => item.color || item.productInfo?.color || 'N/A' },
    { key: 'total', label: 'Tổng số', render: (item) => <span className="font-bold theme-text-primary">{item.total}</span> },
    { key: 'available', label: 'Sẵn bán', render: (item) => <span className="text-emerald-500 font-semibold">{item.available}</span> },
    { key: 'reserved', label: 'Đã đặt', render: (item) => <span className="text-yellow-500 font-semibold">{item.reserved}</span> },
    { 
      key: 'status', 
      label: 'Trạng thái', 
      render: (item) => <Badge variant={item.available > 0 ? 'success' : 'warning'}>{item.available > 0 ? 'Sẵn sàng' : 'Hết hàng'}</Badge> 
    },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (item) => (
        <Button 
          variant="ghost" 
          size="sm"
          // 2. Điều hướng tới trang chi tiết với ID thật
          onClick={() => navigate(`/dealer/inventory/${item.id}`)}
        >
          Chi tiết →
        </Button>
      )
    }
  ];

  const filteredInventory = inventory.filter(
    item => (item.model || item.productInfo?.name)?.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <PageContainer>
      <DetailHeader
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
          icon={<Package className="w-6 h-6" />}
          title="Tổng xe trong kho"
          value={inventory.reduce((sum, item) => sum + (item.total || 0), 0)}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Xe sẵn sàng bán"
          value={inventory.reduce((sum, item) => sum + (item.available || 0), 0)}
          trend="up"
        />
        <StatCard
          icon={<Tag className="w-6 h-6" />}
          title="Xe đã đặt cọc"
          value={inventory.reduce((sum, item) => sum + (item.reserved || 0), 0)}
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="p-4">
          <SearchBar 
            placeholder="Tìm theo dòng xe..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <Table
          columns={inventoryColumns}
          data={filteredInventory}
          keyField="id"
        />
        {filteredInventory.length === 0 && (
          <EmptyState
            icon={<Archive className="w-12 h-12" />}
            title="Kho trống"
            message="Không tìm thấy xe nào trong kho. Hãy thử yêu cầu nhập xe mới."
            className="py-10"
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default DealerInventory;