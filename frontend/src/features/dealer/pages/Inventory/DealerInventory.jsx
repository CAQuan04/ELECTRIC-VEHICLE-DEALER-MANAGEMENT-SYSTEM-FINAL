import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { useAuth } from '@/context/AuthContext';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Package, CheckCircle, Tag, Archive } from 'lucide-react';

// Import UI components
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import StatCard from '@/features/dealer/components/ui/StatCard.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import Table from '@/features/dealer/components/ui/Table.jsx';
import { PageHeader } from '../../components';
import SearchBar from '@/features/dealer/components/ui/SearchBar.jsx';
import EmptyState from '@/features/dealer/components/ui/EmptyState.jsx';

// Import PageContainer từ dealer layout
import PageContainer from '../../components/layout/PageContainer';

const DealerInventory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startLoading, stopLoading } = usePageLoading();
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadInventory();
  }, []); // Tải khi component mount

  const loadInventory = async () => {
    try {
      startLoading('Đang tải kho xe...');
      
      // Get dealerId from user context
      console.log('🔍 Full user object:', user);
      const dealerId = user?.dealerId;
      console.log('🆔 Extracted dealerId:', dealerId);
      
      if (!dealerId) {
        console.error('❌ Không tìm thấy dealerId trong thông tin user');
        console.error('User object keys:', Object.keys(user || {}));
        alert('Không thể xác định dealer. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log('📞 Calling API with dealerId:', dealerId, 'filters:', filters);
      // Call API with dealerId
      const result = await dealerAPI.getInventory(dealerId, filters); 
      console.log('✅ API Response:', result);

      if (result.success && result.data) {
        // Backend trả về array trực tiếp
        const inventoryList = Array.isArray(result.data) ? result.data : [];
        console.log('📦 Inventory loaded:', inventoryList.length, 'items');
        setInventory(inventoryList);
      } else {
        const errorMsg = result.message || 'Unknown error';
        console.error('❌ Lỗi khi tải kho:', errorMsg);
        console.error('Full result:', result);
        alert(`Không thể tải dữ liệu kho.\n\nLỗi: ${errorMsg}\n\n⚠️ Kiểm tra:\n1. Backend có đang chạy?\n2. Token JWT còn hợp lệ?\n3. Có quyền truy cập dealer này?`);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Lỗi hệ thống khi tải kho');
    } finally {
      stopLoading();
    }
  };

  const inventoryColumns = [
    { key: 'model', label: 'Dòng xe', render: (item) => <span className="font-semibold">{item.model || item.vehicleName}</span> },
    { key: 'color', label: 'Màu sắc', render: (item) => item.color || 'N/A' },
    { key: 'quantity', label: 'Số lượng', render: (item) => <span className="font-bold theme-text-primary">{item.quantity || 0}</span> },
    { key: 'basePrice', label: 'Giá cơ sở', render: (item) => item.basePrice ? `${(item.basePrice / 1000000).toFixed(0)}M VNĐ` : 'N/A' },
    { 
      key: 'status', 
      label: 'Trạng thái', 
      render: (item) => <Badge variant={item.status === 'Available' ? 'success' : item.status === 'Reserved' ? 'warning' : 'default'}>{item.status === 'Available' ? 'Sẵn sàng' : item.status === 'Reserved' ? 'Đã đặt' : 'Đã bán'}</Badge> 
    },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (item) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            const dealerId = user?.dealerId;
            console.log('🔍 Navigation - dealerId from auth:', dealerId, 'inventoryId:', item.inventoryId || item.id);
            if (!dealerId) {
              console.error('❌ No dealerId in user context:', user);
              return;
            }
            navigate(`/${dealerId}/dealer/inventory/${item.inventoryId}`);
          }}
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
      <PageHeader
        title="Kho xe"
        subtitle="Quản lý tồn kho và theo dõi nhập xuất"
        icon={<Package className="w-16 h-16" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dealer/inventory/distributions')}>
              📦 Phiếu nhập hàng
            </Button>
            <Button variant="gradient" onClick={() => navigate('/dealer/purchase-requests')}>
              🛒 Yêu cầu mua hàng
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className=" mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          title="Tổng xe trong kho"
          value={inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Xe sẵn sàng bán"
          value={inventory.filter(item => item.status === 'Available').reduce((sum, item) => sum + (item.quantity || 0), 0)}
          trend="up"
        />
        <StatCard
          icon={<Tag className="w-6 h-6" />}
          title="Xe đã đặt cọc"
          value={inventory.filter(item => item.status === 'Reserved').reduce((sum, item) => sum + (item.quantity || 0), 0)}
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