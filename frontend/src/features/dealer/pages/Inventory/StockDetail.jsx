import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading'; // Giả sử path đúng
import { dealerAPI } from '@/utils/api/services/dealer.api.js'; // Sửa path

// Import UI components
import  Button  from '@/features/dealer/components/ui/Button.jsx';
import  Badge  from '@/features/dealer/components/ui/Badge.jsx';
import  Card  from '@/features/dealer/components/ui/Card.jsx';
import  Table  from '@/features/dealer/components/ui/Table.jsx'; // Giả sử bạn có
import { 
  DetailHeader, 
  InfoSection, 
  InfoRow 
} from '@/features/dealer/components/ui/AdvancedComponents.jsx';
import  EmptyState  from '@/features/dealer/components/ui/EmptyState.jsx';

const StockDetail = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  const [stockDetail, setStockDetail] = useState(null);

  useEffect(() => {
    // 1. TÁI CẤU TRÚC HÀM LOAD DATA
    const loadStockDetail = async () => {
      if (!stockId) return; // Không làm gì nếu không có ID
      try {
        startLoading('Đang tải chi tiết kho...');
        // 2. GỌI API THẬT
        const result = await dealerAPI.getStockById(stockId); 
        
        if (result.success && result.data) {
          setStockDetail(result.data);
        } else {
          console.error('Lỗi khi tải chi tiết kho:', result.message);
          alert('Không thể tải chi tiết kho.');
          navigate('/dealer/inventory'); // Quay lại nếu lỗi
        }
      } catch (error) {
        console.error('Error loading stock detail:', error);
        alert('Lỗi hệ thống: ' + (error.message || 'Không thể tải chi tiết kho'));
        navigate('/dealer/inventory');
      } finally {
        stopLoading();
      }
    };
    
    loadStockDetail();
  }, [stockId, navigate, startLoading, stopLoading]); // Thêm dependencies

  // 3. ĐỊNH NGHĨA CỘT CHO BẢNG VIN
  const vehicleColumns = [
    { key: 'vin', label: 'Số VIN', render: (item) => <span className="font-semibold theme-text-primary">{item.vin}</span> },
    { key: 'status', label: 'Trạng thái', render: (item) => {
        // Tùy biến màu badge theo trạng thái
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

  // Hiển thị loading (nếu cần, vì đã có global loader)
  if (isLoading && !stockDetail) {
    return null; // Global loader đang chạy
  }

  // Nếu không có data
  if (!stockDetail) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <DetailHeader title="Chi tiết kho" onBack={() => navigate(-1)} />
        <EmptyState
          title="Không tìm thấy"
          message="Không tìm thấy thông tin chi tiết cho mã kho này."
          action={{ label: 'Quay lại', onClick: () => navigate(-1) }}
        />
      </div>
    );
  }

  // 4. RENDER GIAO DIỆN HIỆN ĐẠI
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header với nút quay lại */}
      <DetailHeader
        title={`${stockDetail.model} - ${stockDetail.color}`}
        subtitle={`Chi tiết tồn kho cho mã sản phẩm`}
        onBack={() => navigate(-1)}
      />

      {/* Thông tin tóm tắt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoSection title="Tổng quan số lượng" icon="📦">
          <InfoRow label="Tổng số lượng" value={<span className="text-xl font-bold theme-text-primary">{stockDetail.total}</span>} />
          <InfoRow label="Sẵn sàng bán" value={<span className="text-xl font-bold text-emerald-500">{stockDetail.available}</span>} />
          <InfoRow label="Đã đặt cọc" value={<span className="text-xl font-bold text-yellow-500">{stockDetail.reserved}</span>} />
        </InfoSection>

        <InfoSection title="Thông tin lô hàng" icon="ℹ️">
          <InfoRow label="Mã sản phẩm" value={stockDetail.productId || stockId} />
          <InfoRow label="Trạng thái" value={<Badge variant={stockDetail.available > 0 ? 'success' : 'warning'}>{stockDetail.available > 0 ? 'Còn hàng' : 'Hết hàng'}</Badge>} />
          <InfoRow label="Lần cập nhật cuối" value={stockDetail.updatedAt ? new Date(stockDetail.updatedAt).toLocaleString('vi-VN') : 'N/A'} />
        </InfoSection>
      </div>

      {/* Bảng chi tiết các xe (VIN) */}
      <Card>
        <h3 className="text-xl font-bold mb-4 p-6 pb-0 theme-text-primary">Danh sách xe (theo VIN)</h3>
        <Table
          columns={vehicleColumns}
          data={stockDetail.vehicles || []}
          keyField="vin"
        />
        {(!stockDetail.vehicles || stockDetail.vehicles.length === 0) && (
          <EmptyState
            icon="🚫"
            title="Chưa có xe"
            message="Chưa có xe nào (VIN) được đăng ký cho lô hàng này."
            className="py-10"
          />
        )}
      </Card>
    </div>
  );
};

export default StockDetail;