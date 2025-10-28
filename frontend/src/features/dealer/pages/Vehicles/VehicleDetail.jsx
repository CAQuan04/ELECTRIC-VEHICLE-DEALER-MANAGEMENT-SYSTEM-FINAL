import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, // Giả sử Card là một component wrapper <div>
  Button, 
  Badge 
} from '../../components';

const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    loadVehicleDetail();
  }, [vehicleId]);

  const loadVehicleDetail = async () => {
    // ... (logic loadVehicleDetail giữ nguyên) ...
    try {
      startLoading('Đang tải thông tin xe...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (error) {
      console.error('Error loading vehicle detail:', error);
    } finally {
      stopLoading();
    }
  };

  if (!vehicle) return null;

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
        {/* THAY ĐỔI: Thêm 'theme-card' */}
        <Card className="theme-card p-0 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-9xl">
            🚗
          </div>
        </Card>

        {/* Vehicle Info */}
        <div className="space-y-6">
          {/* THAY ĐỔI: Thêm 'theme-card', 'theme-text-primary', 'theme-text-muted' */}
          <Card className="theme-card">
            {/* Xóa 'text-white' */}
            <h2 className="text-3xl font-bold theme-text-primary mb-2">{vehicle.model}</h2>
            <p className="text-emerald-400 text-2xl font-bold mb-4">
              {formatPrice(vehicle.price)}
            </p>
            
            <div className="flex items-center gap-4">
              <Badge variant={vehicle.availability === 'Có sẵn' ? 'success' : 'warning'}>
                {vehicle.availability}
              </Badge>
              {/* Xóa 'text-gray-400' */}
              <span className="theme-text-muted">Tồn kho: {vehicle.stock} xe</span>
            </div>
          </Card>

          {/* Specs */}
          {/* THAY ĐỔI: Thêm 'theme-card', 'theme-text-primary', 'theme-text-muted', 'theme-border' */}
          <Card className="theme-card">
            {/* Xóa 'text-white dark:text-gray-700' */}
            <h3 className="text-xl font-bold theme-text-primary mb-4">⚡ Thông số kỹ thuật</h3>
            <div className="space-y-3">
              {/* Xóa 'border-white/10', 'text-gray-400', 'text-white' */}
              <div className="flex justify-between items-center pb-3 border-b theme-border">
                <span className="theme-text-muted">Phạm vi</span>
                <span className="theme-text-primary font-semibold">{vehicle.specs.range}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b theme-border">
                <span className="theme-text-muted">Tốc độ tối đa</span>
                <span className="theme-text-primary font-semibold">{vehicle.specs.topSpeed}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b theme-border">
                <span className="theme-text-muted">Tăng tốc</span>
                <span className="theme-text-primary font-semibold">{vehicle.specs.acceleration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="theme-text-muted">Pin</span>
                <span className="theme-text-primary font-semibold">{vehicle.specs.battery}</span>
              </div>
            </div>
          </Card>

          {/* Features */}
          {/* THAY ĐỔI: Thêm 'theme-card', 'theme-text-primary', 'theme-text-secondary' */}
          <Card className="theme-card">
            {/* Xóa 'text-white' */}
            <h3 className="text-xl font-bold theme-text-primary mb-4">✨ Tính năng nổi bật</h3>
            <ul className="space-y-2">
              {vehicle.features.map((feature, index) => (
                // Xóa 'text-gray-300'
                <li key={index} className="flex items-center gap-2 theme-text-secondary">
                  <span className="text-emerald-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>

          {/* Actions (Giữ nguyên, giả sử Button đã được theme) */}
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