import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Package, Plus, Minus, Save, RefreshCw } from 'lucide-react';
import { notifications } from '@utils';

// Import UI components
import Button from '@/features/dealer/components/ui/Button.jsx';
import Badge from '@/features/dealer/components/ui/Badge.jsx';
import Card from '@/features/dealer/components/ui/Card.jsx';
import Table from '@/features/dealer/components/ui/Table.jsx';
import { PageHeader } from '../../components';
import SearchBar from '@/features/dealer/components/ui/SearchBar.jsx';
import EmptyState from '@/features/dealer/components/ui/EmptyState.jsx';
import PageContainer from '../../components/layout/PageContainer';

const ManageInventory = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [vehicles, setVehicles] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState({}); // {vehicleId_configId: quantity}
  const [savingItems, setSavingItems] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      startLoading('Đang tải dữ liệu...');
      
      // Load vehicles với configs
      const vehiclesResult = await dealerAPI.getVehicles();
      if (vehiclesResult.success && vehiclesResult.data) {
        const vehicleList = Array.isArray(vehiclesResult.data) 
          ? vehiclesResult.data 
          : vehiclesResult.data.data || [];
        setVehicles(vehicleList);
      }

      // Load inventory hiện tại
      const inventoryResult = await dealerAPI.getInventory();
      if (inventoryResult.success && inventoryResult.data) {
        const inventoryList = Array.isArray(inventoryResult.data) 
          ? inventoryResult.data 
          : inventoryResult.data.data || [];
        setInventory(inventoryList);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      notifications.error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      stopLoading();
    }
  };

  // Tạo danh sách tất cả configs từ vehicles
  const getAllConfigs = () => {
    const configs = [];
    vehicles.forEach(vehicle => {
      if (vehicle.configs && Array.isArray(vehicle.configs)) {
        vehicle.configs.forEach(config => {
          // Tìm inventory hiện tại
          const currentInventory = inventory.find(
            inv => inv.vehicleId === vehicle.vehicleId && inv.configId === config.configId
          );
          
          const key = `${vehicle.vehicleId}_${config.configId}`;
          const currentQty = currentInventory?.quantity || 0;
          const pendingQty = pendingUpdates[key];
          
          configs.push({
            vehicleId: vehicle.vehicleId,
            vehicleName: vehicle.vehicleName || `${vehicle.brand} ${vehicle.model}`,
            brand: vehicle.brand,
            model: vehicle.model,
            configId: config.configId,
            configName: config.configName || 
              `${config.color} - ${config.batteryKwh}kWh - ${config.rangeKm}km`,
            color: config.color,
            batteryKwh: config.batteryKwh,
            rangeKm: config.rangeKm,
            basePrice: config.price || vehicle.basePrice,
            currentQuantity: currentQty,
            newQuantity: pendingQty !== undefined ? pendingQty : currentQty,
            hasChanges: pendingQty !== undefined && pendingQty !== currentQty,
            inventoryId: currentInventory?.inventoryId,
          });
        });
      }
    });
    return configs;
  };

  const allConfigs = getAllConfigs();
  const filteredConfigs = allConfigs.filter(config => 
    config.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
    config.configName.toLowerCase().includes(search.toLowerCase()) ||
    config.brand.toLowerCase().includes(search.toLowerCase()) ||
    config.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (vehicleId, configId, delta) => {
    const key = `${vehicleId}_${configId}`;
    const config = allConfigs.find(c => c.vehicleId === vehicleId && c.configId === configId);
    if (!config) return;

    const currentQty = config.currentQuantity;
    const newQty = Math.max(0, (pendingUpdates[key] !== undefined ? pendingUpdates[key] : currentQty) + delta);
    
    setPendingUpdates(prev => ({
      ...prev,
      [key]: newQty
    }));
  };

  const handleSaveItem = async (vehicleId, configId) => {
    const key = `${vehicleId}_${configId}`;
    const newQuantity = pendingUpdates[key];
    
    if (newQuantity === undefined) return;

    setSavingItems(prev => new Set([...prev, key]));
    
    try {
      const result = await dealerAPI.updateInventory({
        vehicleId,
        configId,
        quantity: newQuantity
      });

      if (result.success) {
        notifications.success('Thành công', 'Đã cập nhật số lượng xe trong kho');
        
        // Cập nhật inventory local
        setInventory(prev => {
          const existing = prev.find(inv => inv.vehicleId === vehicleId && inv.configId === configId);
          if (existing) {
            return prev.map(inv => 
              inv.vehicleId === vehicleId && inv.configId === configId
                ? { ...inv, quantity: newQuantity }
                : inv
            );
          } else {
            return [...prev, { vehicleId, configId, quantity: newQuantity }];
          }
        });

        // Xóa pending update
        setPendingUpdates(prev => {
          const newUpdates = { ...prev };
          delete newUpdates[key];
          return newUpdates;
        });
      } else {
        notifications.error('Lỗi', result.message || 'Không thể cập nhật số lượng');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      notifications.error('Lỗi', 'Không thể cập nhật số lượng');
    } finally {
      setSavingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleSaveAll = async () => {
    const updates = Object.entries(pendingUpdates).map(([key, quantity]) => {
      const [vehicleId, configId] = key.split('_').map(Number);
      return { vehicleId, configId, quantity };
    });

    if (updates.length === 0) {
      notifications.info('Thông báo', 'Không có thay đổi nào để lưu');
      return;
    }

    startLoading('Đang lưu thay đổi...');
    
    let successCount = 0;
    let failCount = 0;

    for (const update of updates) {
      try {
        const result = await dealerAPI.updateInventory(update);
        if (result.success) {
          successCount++;
          
          // Cập nhật inventory local
          setInventory(prev => {
            const existing = prev.find(
              inv => inv.vehicleId === update.vehicleId && inv.configId === update.configId
            );
            if (existing) {
              return prev.map(inv => 
                inv.vehicleId === update.vehicleId && inv.configId === update.configId
                  ? { ...inv, quantity: update.quantity }
                  : inv
              );
            } else {
              return [...prev, { 
                vehicleId: update.vehicleId, 
                configId: update.configId, 
                quantity: update.quantity 
              }];
            }
          });
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    stopLoading();

    if (successCount > 0) {
      notifications.success('Thành công', `Đã cập nhật ${successCount} mục`);
      setPendingUpdates({});
    }
    
    if (failCount > 0) {
      notifications.error('Lỗi', `Không thể cập nhật ${failCount} mục`);
    }
  };

  const handleResetChanges = () => {
    setPendingUpdates({});
    notifications.info('Đã hủy', 'Đã hủy tất cả thay đổi chưa lưu');
  };

  const columns = [
    { 
      key: 'vehicle', 
      label: 'Xe', 
      render: (item) => (
        <div>
          <div className="font-semibold text-gray-900">{item.vehicleName}</div>
          <div className="text-sm text-gray-500">{item.brand} - {item.model}</div>
        </div>
      )
    },
    { 
      key: 'config', 
      label: 'Cấu hình', 
      render: (item) => (
        <div>
          <div className="font-medium">{item.configName}</div>
          <div className="text-sm text-gray-500">
            {item.color} • {item.batteryKwh}kWh • {item.rangeKm}km
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Giá',
      render: (item) => (
        <span className="font-semibold text-blue-600">
          {item.basePrice?.toLocaleString('vi-VN')} ₫
        </span>
      )
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      render: (item) => {
        const key = `${item.vehicleId}_${item.configId}`;
        const isSaving = savingItems.has(key);
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.vehicleId, item.configId, -1)}
              disabled={isSaving || item.newQuantity <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 min-w-[80px] justify-center">
              <span className={`font-bold text-lg ${item.hasChanges ? 'text-orange-600' : 'text-gray-900'}`}>
                {item.newQuantity}
              </span>
              {item.hasChanges && (
                <span className="text-xs text-gray-500">
                  (từ {item.currentQuantity})
                </span>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.vehicleId, item.configId, 1)}
              disabled={isSaving}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item) => (
        <div>
          {item.hasChanges ? (
            <Badge variant="warning">Chưa lưu</Badge>
          ) : item.currentQuantity > 0 ? (
            <Badge variant="success">Có sẵn</Badge>
          ) : (
            <Badge variant="secondary">Chưa nhập</Badge>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item) => {
        const key = `${item.vehicleId}_${item.configId}`;
        const isSaving = savingItems.has(key);
        
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSaveItem(item.vehicleId, item.configId)}
            disabled={!item.hasChanges || isSaving}
            loading={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            Lưu
          </Button>
        );
      }
    }
  ];

  const hasChanges = Object.keys(pendingUpdates).length > 0;

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý kho xe"
        subtitle="Cập nhật số lượng xe trong kho"
        icon={<Package className="w-16 h-16" />}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
            {hasChanges && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handleResetChanges}
                >
                  Hủy thay đổi
                </Button>
                <Button 
                  variant="gradient" 
                  onClick={handleSaveAll}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu tất cả ({Object.keys(pendingUpdates).length})
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Summary Alert */}
      {hasChanges && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <Package className="w-5 h-5" />
            <span className="font-semibold">
              Bạn có {Object.keys(pendingUpdates).length} thay đổi chưa lưu
            </span>
          </div>
          <p className="text-sm text-orange-600 mt-1">
            Nhấn "Lưu tất cả" để lưu tất cả thay đổi hoặc "Lưu" từng mục riêng lẻ
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <div className="p-4">
          <SearchBar 
            placeholder="Tìm theo tên xe, màu sắc, cấu hình..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          data={filteredConfigs}
          keyField={(item) => `${item.vehicleId}_${item.configId}`}
        />
        {filteredConfigs.length === 0 && (
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="Không tìm thấy xe"
            message="Không có cấu hình xe nào phù hợp với tìm kiếm của bạn"
            className="py-10"
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default ManageInventory;
