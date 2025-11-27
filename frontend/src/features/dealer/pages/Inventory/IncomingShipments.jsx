import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Calendar, MapPin, Package, Info } from 'lucide-react';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils';
import { PageContainer, PageHeader, Card, Button, Badge, Table, EmptyState } from '../../components';
import { usePageLoading } from '@modules/loading';

const IncomingShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [vehicleMap, setVehicleMap] = useState({}); // Dùng để tra cứu tên xe từ ID
  const { startLoading, stopLoading } = usePageLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      startLoading('Đang tải danh sách hàng về...');
      
      // 1. Gọi song song: Lấy đơn hàng về + Lấy danh sách xe (để map tên)
      const [distResult, vehResult] = await Promise.all([
        dealerAPI.getIncomingDistributions(),
        dealerAPI.getVehicles()
      ]);

      // 2. Xử lý Map tên xe (ID -> Name)
      const vMap = {};
      if (vehResult.success) {
        const vList = vehResult.data?.items || vehResult.data || [];
        vList.forEach(v => {
          // Lưu tên xe vào map. Ví dụ: vMap[1] = "VinFast VF 8"
          vMap[v.vehicleId || v.id] = v.model || v.vehicleName; 
        });
        setVehicleMap(vMap);
      }

      // 3. Xử lý danh sách đơn hàng
      if (distResult.success) {
        const data = Array.isArray(distResult.data) ? distResult.data : (distResult.data?.data || []);
        setShipments(data);
      }
    } catch (error) {
      console.error(error);
      notifications.error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      stopLoading();
    }
  };

  const handleConfirm = async (item) => {
    // Sử dụng id của distribution (ưu tiên distId, fallback sang dealerRequestId nếu API chưa trả về id riêng)
    const confirmId = item.distId || item.dealerRequestId; 

    if (!window.confirm(`Xác nhận đã nhận lô hàng #${confirmId}? Kho sẽ được cập nhật.`)) return;

    try {
      startLoading('Đang nhập kho...');
      const result = await dealerAPI.confirmDistributionReceipt(confirmId);
      
      if (result.success) {
        notifications.success('Thành công', 'Đã nhập kho thành công!');
        loadData(); // Reload lại danh sách
      } else {
        notifications.error('Lỗi', result.message);
      }
    } catch (error) {
      notifications.error('Lỗi', 'Có lỗi xảy ra khi xác nhận');
    } finally {
      stopLoading();
    }
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    { 
      key: 'id', 
      label: 'Mã Đơn', 
      render: (row) => (
        <div>
           <span className="font-mono font-bold text-blue-600">
             #{row.dealerRequestId}
           </span>
           {/* Nếu BE trả về distId thì hiển thị thêm cho rõ */}
           {row.distId && <div className="text-xs text-gray-400">DST-{row.distId}</div>}
        </div>
      ) 
    },
    { 
      key: 'items', 
      label: 'Danh sách xe', 
      render: (row) => (
        <div className="space-y-1">
          {/* Lặp qua mảng items trong JSON */}
          {row.items && row.items.length > 0 ? (
            row.items.map((item, index) => (
              <div key={index} className="flex items-center text-sm border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                <Package className="w-3 h-3 mr-2 text-gray-400" />
                <span className="font-medium mr-2">
                  {/* Tra cứu tên xe từ Map, nếu không có thì hiện ID */}
                  {vehicleMap[item.vehicleId] || `Xe ID ${item.vehicleId}`}
                </span>
                <span className="text-gray-500 text-xs">
                  (Cấu hình #{item.configId})
                </span>
                <span className="ml-auto font-bold text-blue-600 bg-blue-50 px-2 rounded">
                  x{item.quantity}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 italic">Không có xe</span>
          )}
        </div>
      )
    },
    { 
        key: 'total', 
        label: 'Tổng SL', 
        render: (row) => {
            // Tính tổng số lượng xe trong đơn
            const totalQty = row.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
            return <span className="font-bold text-lg">{totalQty}</span>;
        }
    },
    { 
      key: 'info', 
      label: 'Thông tin vận chuyển', 
      render: (row) => (
        <div className="text-sm space-y-1">
            <div className="flex items-center text-gray-600">
                <MapPin className="w-3 h-3 mr-1"/> 
                Từ: <span className="font-medium ml-1">{row.fromLocation || 'Kho Tổng'}</span>
            </div>
            <div className="flex items-center text-gray-600">
                <Calendar className="w-3 h-3 mr-1"/> 
                Dự kiến: <span className="font-medium ml-1">
                    {row.scheduledDate ? new Date(row.scheduledDate).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
            </div>
        </div>
      ) 
    },
    { 
      key: 'action', 
      label: 'Thao tác', 
      render: (row) => (
        <Button size="sm" variant="primary" onClick={() => handleConfirm(row)}>
            <CheckCircle className="w-4 h-4 mr-2" /> Nhận Hàng
        </Button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Hàng đang về (Incoming)" 
        subtitle="Xác nhận nhận bàn giao xe từ Hãng (EVM)"
        icon={<Truck className="w-8 h-8" />}
        actions={
            <Button variant="outline" onClick={loadData}>Làm mới</Button>
        }
      />
      
      <Card>
        {shipments.length > 0 ? (
            <Table columns={columns} data={shipments} keyField="dealerRequestId" />
        ) : (
            <EmptyState 
                title="Không có hàng đang về" 
                message="Hiện tại không có chuyến xe nào đang vận chuyển đến đại lý." 
                icon={<Truck className="w-12 h-12 text-gray-300"/>}
            />
        )}
      </Card>
    </PageContainer>
  );
};

export default IncomingShipments;