import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { useAuth } from '@/context/AuthContext';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Package, CheckCircle, AlertTriangle, Archive, PlusCircle } from 'lucide-react'; // Thêm AlertTriangle
import { notifications } from '@utils'; // Giả sử có util này

// UI Components
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import StatCard from '@/features/dealer/components/ui/StatCard.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import Table from '@/features/dealer/components/ui/Table.jsx';
import { PageHeader } from '../../components';
import SearchBar from '@/features/dealer/components/ui/SearchBar.jsx';
import EmptyState from '@/features/dealer/components/ui/EmptyState.jsx';
import PageContainer from '../../components/layout/PageContainer';
import Modal from '@/features/dealer/components/ui/Modal.jsx'; // Cần component Modal

const DealerInventory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startLoading, stopLoading } = usePageLoading();
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const [lowStockItems, setLowStockItems] = useState([]); // State lưu xe sắp hết
  const [showLowStockModal, setShowLowStockModal] = useState(false); // State hiện popup

  const dealerId = user?.dealerId;
  
  // Logic phân quyền: Staff nhập nội bộ, Manager nhập từ hãng
  const isManager = user?.role === 'DealerManager'; 
  const isStaff = user?.role === 'DealerStaff';

  useEffect(() => {
    if (dealerId) loadInventory();
  }, [dealerId]);

  const loadInventory = async () => {
    try {
      startLoading('Đang tải kho xe...');
      const result = await dealerAPI.getInventory(dealerId, filters);

      if (result.success && result.data) {
        const data = Array.isArray(result.data) ? result.data : [];
        setInventory(data);

        // --- LOGIC 1: CHECK TỒN KHO THẤP (< 5) ---
        const lowStock = data.filter(item => (item.quantity || 0) < 5);
        if (lowStock.length > 0) {
          setLowStockItems(lowStock);
          setShowLowStockModal(true); // --- LOGIC 2: BẬT POPUP ---
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      stopLoading();
    }
  };

  // Cấu hình cột hiển thị
  const inventoryColumns = [
    { 
      key: 'model', 
      label: 'Dòng xe', 
      render: (item) => (
        <div>
           <span className="font-semibold block">{item.model || item.vehicleName}</span>
           {/* Hiển thị tag cảnh báo ngay tên xe nếu thấp */}
           {(item.quantity || 0) < 5 && (
             <span className="text-xs text-red-600 flex items-center mt-1">
               <AlertTriangle className="w-3 h-3 mr-1" /> Sắp hết hàng
             </span>
           )}
        </div>
      ) 
    },
    { key: 'color', label: 'Màu sắc', render: (item) => item.color || 'N/A' },
    { 
      key: 'quantity', 
      label: 'Số lượng', 
      render: (item) => {
        const qty = item.quantity || 0;
        // --- LOGIC 3: HIGHLIGHT SỐ LƯỢNG ---
        const colorClass = qty < 5 ? 'text-red-600 font-extrabold' : 'theme-text-primary font-bold';
        return <span className={colorClass}>{qty}</span>;
      } 
    },
    { key: 'basePrice', label: 'Giá cơ sở', render: (item) => item.basePrice ? `${(item.basePrice / 1000000).toFixed(0)}M VNĐ` : 'N/A' },
    { 
      key: 'status', 
      label: 'Trạng thái', 
      render: (item) => <Badge variant={item.quantity > 0 ? 'success' : 'danger'}>{item.quantity > 0 ? 'Sẵn sàng' : 'Hết hàng'}</Badge> 
    },
    { 
      key: 'actions', 
      label: 'Thao tác', 
      render: (item) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/${dealerId}/dealer/inventory/${item.inventoryId}`)}>
            Chi tiết
          </Button>
          {/* Nút nhanh cho Staff tạo yêu cầu khi thấy hết hàng */}
          {isStaff && (item.quantity || 0) < 5 && (
             <Button 
               variant="outline" 
               size="sm" 
               className="text-orange-600 border-orange-200 hover:bg-orange-50"
               onClick={() => navigate(`/${dealerId}/dealer/inventory/request`, { 
                 state: { preselectedVehicle: item } // Truyền data sang trang request
               })}
             >
               Yêu cầu nhập
             </Button>
          )}
        </div>
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
            {/* Phân biệt nút bấm cho Staff và Manager */}
            {isStaff && (
                <Button variant="primary" onClick={() => navigate(`/${dealerId}/dealer/inventory/request`)}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Tạo Yêu Cầu Nhập (Staff)
                </Button>
            )}
            
            {isManager && (
                <>
                  <Button variant="outline" onClick={() => navigate(`/${dealerId}/dealer/inventory/distributions`)}>
                    📦 Duyệt yêu cầu từ Staff
                  </Button>
                  <Button variant="gradient" onClick={() => navigate(`/${dealerId}/dealer/purchase-requests/create`)}>
                    🛒 Đặt hàng EVM (Manager)
                  </Button>
                </>
            )}
          </div>
        }
      />

      {/* --- POPUP CẢNH BÁO TỒN KHO THẤP --- */}
      {showLowStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <h3 className="text-xl font-bold">Cảnh báo tồn kho thấp!</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Có <strong>{lowStockItems.length}</strong> dòng xe đang có số lượng dưới 5 chiếc.
              Vui lòng kiểm tra và nhập thêm hàng để đảm bảo kinh doanh.
            </p>
            <div className="max-h-40 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
                {lowStockItems.map(item => (
                    <div key={item.inventoryId} className="flex justify-between py-1 border-b last:border-0">
                        <span>{item.model} ({item.color})</span>
                        <span className="font-bold text-red-600">SL: {item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowLowStockModal(false)}>Đóng</Button>
              {isStaff ? (
                  <Button variant="primary" onClick={() => {
                      setShowLowStockModal(false);
                      navigate(`/${dealerId}/dealer/inventory/request`);
                  }}>Tạo yêu cầu ngay</Button>
              ) : (
                  <Button variant="primary" onClick={() => {
                      setShowLowStockModal(false);
                      navigate(`/${dealerId}/dealer/purchase-requests/create`);
                  }}>Nhập hàng ngay</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Package className="w-6 h-6" />}
          title="Tổng xe trong kho"
          value={inventory.reduce((sum, item) => sum + (item.quantity || 0), 0)}
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title="Cần nhập thêm (<5)"
          value={lowStockItems.length}
          trend={lowStockItems.length > 0 ? "down" : "neutral"}
          trendLabel="Mẫu xe sắp hết"
          className="bg-red-50 border-red-200" // Highlight card này
        />
      </div>

      <Card>
        <div className="p-4">
          <SearchBar 
            placeholder="Tìm theo dòng xe..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <Table columns={inventoryColumns} data={filteredInventory} keyField="inventoryId" />
        {filteredInventory.length === 0 && <EmptyState title="Kho trống" />}
      </Card>
    </PageContainer>
  );
};

export default DealerInventory;