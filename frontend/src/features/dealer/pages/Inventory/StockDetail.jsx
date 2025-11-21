import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Package, Ban, ShoppingCart, FileText, RefreshCw, Truck, ArrowLeft } from 'lucide-react';
import { notifications } from '@/utils/notifications';

// --- UI Components ---
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import Table from '@/features/dealer/components/ui/Table.jsx';
import EmptyState from '@/features/dealer/components/ui/EmptyState.jsx';
import { InfoSection, InfoRow } from '@/features/dealer/components/ui/AdvancedComponents.jsx';

// ✨ 1. FIX IMPORT: Giả sử PageContainer/PageHeader nằm ở thư mục components gốc của Dealer
// (Hãy kiểm tra lại đường dẫn '../../components' giống file PurchaseRequestList của bạn)
import {
  PageContainer,
  PageHeader 
} from '@/features/dealer/components'; 

const StockDetail = () => {
  const { dealerId, stockId } = useParams();
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  const [stockDetail, setStockDetail] = useState(null);

  // ✨ 2. TẠO BREADCRUMBS
  const breadcrumbs = useMemo(() => [
    { label: 'Kho hàng', path: `/${dealerId}/dealer/inventory` },
    { label: stockDetail ? `${stockDetail.model} - ${stockDetail.color}` : 'Chi tiết xe' }
  ], [dealerId, stockDetail]);

  useEffect(() => {
    const loadStockDetail = async () => {
      if (!dealerId || !stockId) {
        console.error('❌ Missing dealerId or stockId');
        return;
      }
      try {
        startLoading('Đang tải chi tiết kho...');
        console.log('🔍 Loading stock detail - dealerId:', dealerId, 'stockId:', stockId);
        const result = await dealerAPI.getStockById(dealerId, stockId); 
        console.log('✅ Detail API result:', result);
        console.log('📦 result.success:', result.success);
        console.log('📦 result.data:', result.data);
        
        if (result.success && result.data) {
          console.log('✅ Setting stock detail:', result.data);
          setStockDetail(result.data);
        } else {
          console.error('❌ Failed to load detail:', result);
          notifications.error('Lỗi', result.message || 'Không thể tải chi tiết kho');
          navigate(`/${dealerId}/dealer/inventory`);
        }
      } catch (error) {
        notifications.error('Lỗi hệ thống', error.message || 'Không thể tải chi tiết kho');
        navigate(`/${dealerId}/dealer/inventory`);
      } finally {
        stopLoading();
      }
    };
    
    loadStockDetail();
  }, [dealerId, stockId, navigate, startLoading, stopLoading]);

  // --- Columns Definition ---
  const vehicleColumns = [
    { key: 'vin', label: 'Số VIN', render: (item) => <span className="font-semibold theme-text-primary">{item.vin}</span> },
    { key: 'status', label: 'Trạng thái', render: (item) => {
        const variant = item.status.toLowerCase() === 'sẵn bán' ? 'success'
                      : item.status.toLowerCase() === 'đã đặt' ? 'warning'
                      : 'info';
        return <Badge variant={variant}>{item.status}</Badge>;
      } 
    },
    { key: 'receivedDate', label: 'Ngày nhập', render: (item) => item.receivedDate ? new Date(item.receivedDate).toLocaleDateString('vi-VN') : 'N/A' },
    { key: 'location', label: 'Vị trí', render: (item) => item.location || 'N/A' },
    { key: 'actions', label: 'Thao tác', render: (item) => (
        <Button variant="ghost" size="sm" onClick={() => alert(`Xem chi tiết VIN: ${item.vin}`)}>
          Chi tiết
        </Button>
      )
    }
  ];

  // --- Loading State ---
  if (isLoading && !stockDetail) return null;

  // --- Empty State wrapped in PageContainer ---
  if (!stockDetail) {
    return (
      <PageContainer>
        <PageHeader 
          title="Chi tiết kho" 
          breadcrumbs={[{ label: 'Kho hàng', path: '/dealer/inventory' }, { label: 'Chi tiết' }]}
        />
        <EmptyState
          title="Không tìm thấy"
          message="Không tìm thấy thông tin chi tiết cho mã kho này."
          action={{ label: 'Quay lại', onClick: () => navigate(-1) }}
        />
      </PageContainer>
    );
  }

  // --- Handlers ---
  const handleCreateQuotation = () => {
    navigate('/dealer/quotations/create', { 
      state: { preselectedVehicleId: stockDetail.vehicleId, preselectedConfigId: stockDetail.configId } 
    });
  };

  const handleCreateOrder = () => {
    navigate('/dealer/orders/create', { 
      state: { preselectedVehicleId: stockDetail.vehicleId, preselectedConfigId: stockDetail.configId } 
    });
  };

  const handleRequestMore = () => {
    navigate('/dealer/inventory/import', {
      state: { preselectedVehicleId: stockDetail.vehicleId, preselectedConfigId: stockDetail.configId }
    });
  };

  const handleRefresh = async () => {
    try {
      startLoading('Đang làm mới dữ liệu...');
      const result = await dealerAPI.getStockById(dealerId, stockId);
      if (result.success && result.data) {
        setStockDetail(result.data);
        notifications.success('Đã cập nhật', 'Dữ liệu đã được làm mới');
      }
    } catch (error) {
      notifications.error('Lỗi', 'Không thể làm mới dữ liệu');
    } finally {
      stopLoading();
    }
  };

  return (
    <PageContainer>
      {/* ✨ 3. SỬ DỤNG PAGEHEADER & ĐƯA BUTTON VÀO ACTIONS */}
      <PageHeader
        title={`${stockDetail.model} - ${stockDetail.color}`}
        subtitle="Chi tiết tồn kho và danh sách VIN"
        icon={<Package className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex flex-wrap gap-2">
             {/* Nút Back nhỏ nếu cần, hoặc dựa vào breadcrumbs */}
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="md:hidden">
               <ArrowLeft className="w-4 h-4" />
            </Button>

            <Button variant="ghost" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" /> Làm mới
            </Button>
            <Button variant="outline" onClick={handleRequestMore}>
              <Truck className="w-4 h-4 mr-2" /> Nhập thêm
            </Button>
            {/* Nhóm nút thao tác chính */}
            <Button variant="primary" onClick={handleCreateQuotation} disabled={stockDetail.available === 0}>
              <FileText className="w-4 h-4 mr-2" /> Báo giá
            </Button>
            <Button variant="gradient" onClick={handleCreateOrder} disabled={stockDetail.available === 0}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Đơn hàng
            </Button>
          </div>
        }
      />

      {/* Alert */}
      {stockDetail.available === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <Ban className="w-5 h-5" />
            <span className="font-semibold">Xe này đã hết hàng. Vui lòng nhập thêm xe để tiếp tục bán.</span>
          </div>
        </div>
      )}

      {/* Info Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoSection title="Tồn kho" icon={<Package className="w-5 h-5" />}>
          <InfoRow label="Tổng số xe" value={<span className="text-2xl font-bold theme-text-primary">{stockDetail.total || 0}</span>} />
          <InfoRow label="Sẵn sàng bán" value={<span className="text-xl font-bold text-emerald-500">{stockDetail.available || 0}</span>} />
          <InfoRow label="Đã đặt cọc" value={<span className="text-xl font-bold text-yellow-500">{stockDetail.reserved || 0}</span>} />
        </InfoSection>

        <InfoSection title="Doanh số" icon={<ShoppingCart className="w-5 h-5" />}>
          <InfoRow label="Đã bán (tháng)" value={<span className="text-xl font-bold text-green-600">{stockDetail.soldThisMonth || 0}</span>} />
          <InfoRow label="Đã bán (tổng)" value={<span className="text-xl font-bold text-blue-600">{stockDetail.totalSold || 0}</span>} />
          <InfoRow label="Doanh thu" value={<span className="text-lg font-semibold text-green-600">{((stockDetail.revenueThisMonth || 0) / 1000000000).toFixed(2)} tỷ</span>} />
        </InfoSection>

        <InfoSection title="Xuất xưởng" icon={<Truck className="w-5 h-5" />}>
          <InfoRow label="Chờ xuất" value={<span className="text-xl font-bold text-orange-500">{stockDetail.pendingDelivery || 0}</span>} />
          <InfoRow label="Đang vận chuyển" value={<span className="text-xl font-bold text-blue-500">{stockDetail.inTransit || 0}</span>} />
          <InfoRow label="Trạng thái" value={<Badge variant={stockDetail.available > 0 ? 'success' : 'warning'}>{stockDetail.available > 0 ? 'Còn hàng' : 'Hết hàng'}</Badge>} />
        </InfoSection>
      </div>

      {/* Table Section */}
      {/* ✨ FIX: Card có overflow-hidden và Table có wrapper overflow-x-auto */}
      <Card className="overflow-hidden">
        <h3 className="text-xl font-bold mb-4 p-6 pb-0 theme-text-primary">Danh sách xe (theo VIN)</h3>
        
        <div className="overflow-x-auto w-full">
          <Table
            columns={vehicleColumns}
            data={stockDetail.vehicles || []}
            keyField="vin"
          />
        </div>

        {(!stockDetail.vehicles || stockDetail.vehicles.length === 0) && (
          <EmptyState
            icon={<Ban className="w-12 h-12" />}
            title="Chưa có xe"
            message="Chưa có xe nào (VIN) được đăng ký cho lô hàng này."
            className="py-10"
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default StockDetail;