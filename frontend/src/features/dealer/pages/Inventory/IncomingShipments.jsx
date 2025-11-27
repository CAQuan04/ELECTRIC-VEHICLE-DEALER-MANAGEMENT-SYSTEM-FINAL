import React, { useState, useEffect, useMemo } from 'react';
import { Truck, CheckCircle, Calendar, MapPin, Package, RefreshCw } from 'lucide-react';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils';
import { PageContainer, PageHeader, Card, Button, Badge, Table, EmptyState } from '../../components';
import { usePageLoading } from '@modules/loading';
import { useAuth } from '@/context/AuthContext';

const IncomingShipments = () => {
  // Lấy user và dealerId (đã fix dependency)
  const { user } = useAuth();
  const dealerId = user?.dealerId;

  const [shipments, setShipments] = useState([]);
  const [vehicleMap, setVehicleMap] = useState({});
  const { startLoading, stopLoading } = usePageLoading();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const statusOptions = [
    { label: 'Tất cả', value: 'All' },
    { label: 'Đang vận chuyển', value: 'InTransit', variant: 'info' },
    
    { label: 'Hoàn thành', value: 'Completed', variant: 'success' },
    { label: 'Bị lỗi', value: 'Failed_OutOfStock', variant: 'danger' },
  ];
  useEffect(() => {
    // Chỉ load data khi có dealerId
    if (dealerId) {
      loadData();
    }
  }, [dealerId]);

  const loadData = async () => {
    try {
      startLoading('Đang tải danh sách hàng về...');

      // 1. Gọi song song: Lấy đơn hàng về + Lấy danh sách xe (dùng ID)
      const [distResult, vehResult] = await Promise.all([
        dealerAPI.getIncomingDistributions(dealerId),
        dealerAPI.getVehicles()
      ]);

      // 2. Xử lý Map tên xe (ID -> Name)
      const vMap = {};
      if (vehResult.success) {
        const rawData = vehResult.data;
        const vList = rawData?.items || rawData?.data || (Array.isArray(rawData) ? rawData : []);
        vList.forEach(v => {
          vMap[v.vehicleId || v.id] = v.model || v.vehicleName;
        });
        setVehicleMap(vMap);
      }

      // 3. Xử lý danh sách đơn hàng
      if (distResult.success) {
        // Fallback an toàn: hỗ trợ cả data bọc trong .data hoặc array trực tiếp
        const rawData = distResult.data?.data || distResult.data || [];
        setShipments(Array.isArray(rawData) ? rawData : []);
      } else {
        // Nếu API thất bại, báo lỗi rõ ràng
        notifications.error('Lỗi tải dữ liệu', distResult.message);
        setShipments([]);
      }
    } catch (error) {
      console.error(error);
      notifications.error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      stopLoading();
    }
  };

  const handleConfirm = async (item) => {
    // Lấy ID an toàn: distId (thường) -> DistId (hoa) -> dealerRequestId
    const confirmId = item.distId || item.DistId || item.dealerRequestId;

    if (!confirmId) {
      notifications.error("Lỗi", "Không tìm thấy mã vận đơn (DistId)");
      return;
    }

    if (!window.confirm(`Xác nhận đã nhận lô hàng #${confirmId}? Kho sẽ được cập nhật.`)) return;

    try {
      startLoading('Đang nhập kho...');
      const result = await dealerAPI.confirmDistributionReceipt(confirmId);

      if (result.success) {
        notifications.success('Thành công', 'Đã nhập kho thành công!');
        loadData(); // Reload lại danh sách
      } else {
        notifications.error('Lỗi', result.message || "Không thể xác nhận");
      }
    } catch (error) {
      notifications.error('Lỗi', 'Có lỗi xảy ra khi xác nhận');
    } finally {
      stopLoading();
    }
  };
  // ✅ 3. HÀM LỌC DỮ LIỆU
  const filteredShipments = useMemo(() => {
    if (selectedStatus === 'All') {
      return shipments;
    }
    return shipments.filter(shipment => shipment.status === selectedStatus);
  }, [shipments, selectedStatus]);
  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      key: 'id',
      label: 'Mã Đơn',
      render: (row) => (
        <div>
          {row.dealerRequestId && (
            <span className="font-mono font-bold text-blue-600 block">PR-{row.dealerRequestId}</span>
          )}
          <span className="text-lg text-gray-500 font-mono">
            DST-{row.distId || row.DistId}
          </span>
        </div>
      )
    },
    {
      key: 'items',
      label: 'Danh sách xe',
      render: (row) => {
        // Hỗ trợ cả 'items' và 'Items' (hoa/thường)
        const itemsList = row.items || row.Items || [];

        return (
          <div className="space-y-1">
            {itemsList.length > 0 ? (
              itemsList.map((item, index) => (
                <div key={index} className="flex items-center text-sm border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                  <Package className="w-3 h-3 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">
                    {/* Map tên xe */}
                    {vehicleMap[item.vehicleId || item.VehicleId] || `Xe ID ${item.vehicleId || item.VehicleId}`}
                  </span>
                  <span className="text-gray-500 text-xs mr-2">
                    (Cấu hình #{item.configId || item.ConfigId})
                  </span>
                  <span className="ml-auto font-bold text-blue-600 bg-blue-50 px-2 rounded">
                    x{item.quantity || item.Quantity}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 italic">Không có xe</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'total',
      label: 'Tổng SL',
      render: (row) => {
        const itemsList = row.items || row.Items || [];
        const totalQty = itemsList.reduce((sum, i) => sum + (i.quantity || i.Quantity || 0), 0);
        return <span className="font-bold text-lg">{totalQty}</span>;
      }
    },
    {
      key: 'info',
      label: 'Vận chuyển',
      render: (row) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            {row.fromLocation || row.FromLocation || 'Kho Tổng'}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-3 h-3 mr-1" />
            {row.scheduledDate
              ? new Date(row.scheduledDate).toLocaleDateString('vi-VN')
              : 'N/A'}
          </div>
          {/* THÊM TRƯỜNG TRẠNG THÁI */}
          <div className="flex items-center">
            <Badge
              variant={row.status === 'InTransit' ? 'info' : 'secondary'}
              className="font-medium"
            >
              {row.status || 'Chưa rõ'}
            </Badge>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Thao tác',
      render: (row) => {
        // ✅ LOGIC ĐÃ SỬA: Chỉ hiển thị nút khi status là 'InTransit'
        if (row.status === 'InTransit') {
          return (
            <Button size="sm" variant="primary" onClick={() => handleConfirm(row)}>
              <CheckCircle className="w-4 h-4 mr-2" /> Nhận Hàng
            </Button>
          );
        }

        // Hiển thị trạng thái khác (đã nhận, lỗi, v.v.)
        return <span className="text-sm text-gray-500 italic">Không khả dụng</span>;
      }
    }
  ];

return (
    <PageContainer>
      <PageHeader 
        title="Hàng đang về (Incoming)" 
        subtitle="Xác nhận nhận bàn giao xe từ Hãng"
        icon={<Truck className="w-8 h-8" />}
        actions={
            <Button variant="outline" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" /> Làm mới
            </Button>
        }
      />
      
      {/* ✅ 4. THÊM UI BỘ LỌC TRẠNG THÁI */}
      <div className="mb-4 flex flex-wrap gap-2 mt-5">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={selectedStatus === option.value ? option.variant || 'primary' : 'secondary'}
            onClick={() => setSelectedStatus(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      <Card>
        {/* ✅ 5. THAY THẾ 'shipments' BẰNG 'filteredShipments' */}
        {filteredShipments.length > 0 ? (
            <Table columns={columns} data={filteredShipments} keyField={(row) => row.distId || row.DistId || Math.random()} />
        ) : (
            <EmptyState 
                title="Không có lô hàng nào" 
                message={selectedStatus === 'All' 
                         ? 'Hiện tại không có lô hàng nào đang chờ nhận.'
                         : `Không tìm thấy lô hàng nào với trạng thái "${statusOptions.find(o => o.value === selectedStatus)?.label}".`
                        }
            />
        )}
      </Card>
    </PageContainer>
  );
};

export default IncomingShipments;