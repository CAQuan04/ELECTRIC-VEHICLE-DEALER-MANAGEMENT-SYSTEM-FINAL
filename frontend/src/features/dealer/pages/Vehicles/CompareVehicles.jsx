import React, { useState, useEffect } from 'react';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@utils/api/services';
import { notifications } from '@utils/notifications';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button, 
  Badge,
  EmptyState
} from '../../components';
import {
  Car,
  Zap,
  Gauge,
  Battery,
  Calendar,
  Settings,
  Award,
  DollarSign
} from 'lucide-react';

const CompareVehicles = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    loadAvailableVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicles.length > 0) {
      loadComparisonData();
    } else {
      setComparisonData(null);
    }
  }, [selectedVehicles]);

  const loadAvailableVehicles = async () => {
    try {
      startLoading('Đang tải danh sách xe...');
      
      const result = await dealerAPI.getVehicles({ Size: 100 });
      
      if (result.success) {
        const vehicles = Array.isArray(result.data) 
          ? result.data 
          : (result.data.items || result.data.data || []);
        
        setAvailableVehicles(Array.isArray(vehicles) ? vehicles : []);
      } else {
        notifications.error('Lỗi tải dữ liệu', result.message);
        setAvailableVehicles([]);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      notifications.error('Lỗi hệ thống', 'Không thể tải danh sách xe');
      setAvailableVehicles([]);
    } finally {
      stopLoading();
    }
  };

  const loadComparisonData = async () => {
    try {
      const vehicleIds = selectedVehicles.map(v => v.vehicleId);
      const result = await dealerAPI.compareVehicles(vehicleIds);
      
      if (result.success) {
        setComparisonData(result.data);
      } else {
        // Nếu API compare không có, dùng dữ liệu từ selectedVehicles
        setComparisonData(selectedVehicles);
      }
    } catch (error) {
      console.error('Error loading comparison:', error);
      // Fallback to selected vehicles data
      setComparisonData(selectedVehicles);
    }
  };

  const handleSelectVehicle = (vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find(v => v.vehicleId === vehicle.vehicleId)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
      notifications.success('Đã thêm', `${vehicle.name} đã được thêm vào so sánh`);
    } else if (selectedVehicles.length >= 3) {
      notifications.warning('Giới hạn', 'Chỉ được chọn tối đa 3 xe để so sánh');
    }
  };

  const handleRemoveVehicle = (vehicleId) => {
    const vehicle = selectedVehicles.find(v => v.vehicleId === vehicleId);
    setSelectedVehicles(selectedVehicles.filter(v => v.vehicleId !== vehicleId));
    if (vehicle) {
      notifications.info('Đã xóa', `${vehicle.name} đã được xóa khỏi so sánh`);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
    }
    return `${(price / 1000000).toFixed(0)} triệu VNĐ`;
  };

  const getComparisonRows = () => {
    const displayData = comparisonData || selectedVehicles;
    
    return [
      {
        label: 'Giá bán',
        icon: <DollarSign size={18} />,
        getValue: (v) => formatPrice(v.price || v.basePrice),
        highlight: true
      },
      {
        label: 'Năm sản xuất',
        icon: <Calendar size={18} />,
        getValue: (v) => v.year || v.manufacturingYear || 'N/A'
      },
      {
        label: 'Màu sắc',
        icon: <Settings size={18} />,
        getValue: (v) => v.color || 'N/A'
      },
      {
        label: 'Phạm vi hoạt động',
        icon: <Battery size={18} />,
        getValue: (v) => v.range ? `${v.range} km` : 'N/A'
      },
      {
        label: 'Tốc độ tối đa',
        icon: <Gauge size={18} />,
        getValue: (v) => v.topSpeed ? `${v.topSpeed} km/h` : 'N/A'
      },
      {
        label: 'Tăng tốc 0-100km/h',
        icon: <Zap size={18} />,
        getValue: (v) => v.acceleration || 'N/A'
      },
      {
        label: 'Công suất',
        icon: <Award size={18} />,
        getValue: (v) => v.horsepower ? `${v.horsepower} HP` : 'N/A'
      },
      {
        label: 'Dung lượng pin',
        icon: <Battery size={18} />,
        getValue: (v) => v.batteryCapacity ? `${v.batteryCapacity} kWh` : 'N/A'
      },
      {
        label: 'Số chỗ ngồi',
        icon: <Car size={18} />,
        getValue: (v) => v.seats || v.seatingCapacity || 'N/A'
      },
      {
        label: 'Hệ dẫn động',
        icon: <Settings size={18} />,
        getValue: (v) => v.drivetrain || 'N/A'
      }
    ];
  };

  return (
    <PageContainer>
      <PageHeader
        title="⚖️ So sánh xe"
        description={`Chọn tối đa 3 xe để so sánh chi tiết thông số kỹ thuật (Đã chọn: ${selectedVehicles.length}/3)`}
      />

      {/* Vehicle Selector */}
      <Card className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Chọn xe để so sánh</h3>
        </div>
        
        {availableVehicles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {availableVehicles.map(vehicle => {
              const isSelected = selectedVehicles.find(v => v.vehicleId === vehicle.vehicleId);
              const isDisabled = selectedVehicles.length >= 3 && !isSelected;
              
              return (
                <Button
                  key={vehicle.vehicleId}
                  variant={isSelected ? 'primary' : 'secondary'}
                  onClick={() => handleSelectVehicle(vehicle)}
                  disabled={isDisabled}
                  className="w-full relative"
                >
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Car size={20} />
                    <span className="font-semibold">{vehicle.name}</span>
                    <span className="text-xs opacity-70">
                      {formatPrice(vehicle.price || vehicle.basePrice)}
                    </span>
                  </div>
                  {isSelected && (
                    <Badge variant="success" className="absolute -top-2 -right-2">
                      ✓
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Car size={48} />}
            title="Không có xe nào"
            description="Không tìm thấy xe nào trong hệ thống"
          />
        )}
      </Card>

      {/* Comparison Table */}
      {selectedVehicles.length > 0 ? (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Bảng so sánh chi tiết</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cyan-500/30">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold min-w-[200px]">
                    Thông số
                  </th>
                  {(comparisonData || selectedVehicles).map(vehicle => (
                    <th key={vehicle.vehicleId} className="text-left py-4 px-6 min-w-[220px]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white font-bold text-lg">{vehicle.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveVehicle(vehicle.vehicleId)}
                            icon={<span>×</span>}
                          />
                        </div>
                        <Badge variant="info" className="text-xs">
                          ID: {vehicle.vehicleId}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getComparisonRows().map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-white/10 ${row.highlight ? 'bg-cyan-500/5' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-gray-400 font-semibold">
                        {row.icon}
                        <span>{row.label}</span>
                      </div>
                    </td>
                    {(comparisonData || selectedVehicles).map(vehicle => (
                      <td 
                        key={vehicle.vehicleId} 
                        className={`py-4 px-6 ${row.highlight ? 'text-emerald-400 font-bold text-lg' : 'text-white'}`}
                      >
                        {row.getValue(vehicle)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => setSelectedVehicles([])}
            >
              Xóa tất cả
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                notifications.success('Thành công', 'Đã lưu kết quả so sánh');
              }}
            >
              Lưu so sánh
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-16">
          <EmptyState
            icon={<Settings size={64} />}
            title="Chưa chọn xe nào"
            description="Hãy chọn ít nhất 1 xe từ danh sách bên trên để bắt đầu so sánh thông số kỹ thuật"
          />
        </Card>
      )}
    </PageContainer>
  );
};

export default CompareVehicles;
