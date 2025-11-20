import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@utils/api/services';
import { notifications } from '@utils/notifications';
import { 
  PageContainer, 
  PageHeader, 
  Card,
  Button, 
  Badge 
} from '../../components';const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    loadVehicleDetail();
  }, [vehicleId]);

  const loadVehicleDetail = async () => {
    try {
      startLoading('Đang tải thông tin xe...');
      
      const result = await dealerAPI.getVehicleById(vehicleId);
      
      if (result.success) {
        const data = result.data;
        // Transform backend data to match component format
        const transformedVehicle = {
          id: data.vehicleId || data.id,
          model: data.name || data.model,
          price: data.basePrice || data.price || 0,
          availability: data.totalQuantity > 0 ? 'Có sẵn' : 'Hết hàng',
          stock: data.totalQuantity || 0,
          specs: {
            range: data.range || 'N/A',
            topSpeed: data.topSpeed || 'N/A',
            acceleration: data.acceleration || 'N/A',
            battery: data.batteryCapacity || 'N/A'
          },
          features: data.features || [
            'Autopilot tiêu chuẩn',
            'Hệ thống âm thanh cao cấp',
            'Nội thất da cao cấp',
            'Sạc siêu nhanh'
          ]
        };
        setVehicle(transformedVehicle);
      } else {
        notifications.error('Lỗi tải dữ liệu', result.message);
        // Fallback to mock data
        const mockVehicle = {
          id: vehicleId,
          model: 'Model 3',
          price: 1200000000,
          availability: 'Có sẵn',
          stock: 5,
          specs: {
            range: '602 km',
            topSpeed: '261 km/h',
            acceleration: '3.1s (0-100km/h)',
            battery: '82 kWh'
          },
          features: [
            'Autopilot tiêu chuẩn',
            'Hệ thống âm thanh cao cấp',
            'Nội thất da cao cấp',
            'Sạc siêu nhanh'
          ]
        };
        setVehicle(mockVehicle);
      }
    } catch (error) {
      console.error('Error loading vehicle detail:', error);
      notifications.error('Lỗi hệ thống', 'Không thể tải thông tin xe');
    } finally {
      stopLoading();
    }
  };  if (!vehicle) return null;

  const formatPrice = (price) => {
    return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
  };

  return (
    <PageContainer>
      <PageHeader
        title={`🚗 ${vehicle.model}`}
        subtitle="Thông tin chi tiết xe"
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Image */}
        <Card className="p-0 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-9xl">
            🚗
          </div>
        </Card>

        {/* Vehicle Info */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">{vehicle.model}</h2>
            <p className="text-emerald-400 text-2xl font-bold mb-4">
              {formatPrice(vehicle.price)}
            </p>
            
            <div className="flex items-center gap-4">
              <Badge variant={vehicle.availability === 'Có sẵn' ? 'success' : 'warning'}>
                {vehicle.availability}
              </Badge>
              <span className="dark:text-gray-400 text-gray-600">Tồn kho: {vehicle.stock} xe</span>
            </div>
          </Card>

          {/* Specs */}
          <Card>
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">⚡ Thông số kỹ thuật</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b dark:border-white/10 border-gray-200">
                <span className="dark:text-gray-400 text-gray-600">Phạm vi</span>
                <span className="dark:text-white text-gray-900 font-semibold">{vehicle.specs.range}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b dark:border-white/10 border-gray-200">
                <span className="dark:text-gray-400 text-gray-600">Tốc độ tối đa</span>
                <span className="dark:text-white text-gray-900 font-semibold">{vehicle.specs.topSpeed}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b dark:border-white/10 border-gray-200">
                <span className="dark:text-gray-400 text-gray-600">Tăng tốc</span>
                <span className="dark:text-white text-gray-900 font-semibold">{vehicle.specs.acceleration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-gray-400 text-gray-600">Pin</span>
                <span className="dark:text-white text-gray-900 font-semibold">{vehicle.specs.battery}</span>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card>
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">✨ Tính năng nổi bật</h3>
            <ul className="space-y-2">
              {vehicle.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 dark:text-gray-300 text-gray-700">
                  <span className="text-emerald-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>          {/* Actions (Giữ nguyên, giả sử Button đã được theme) */}
          <div className="flex gap-4">
            <Button variant="gradient" className="flex-1">
              📋 Tạo báo giá
            </Button>
  t         <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => navigate('/dealer/vehicles/compare')}
            >
              ⚖️ So sánh xe
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default VehicleDetail;