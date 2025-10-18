import React, { useState, useEffect } from 'react';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button, 
  Badge 
} from '../../components';

const CompareVehicles = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  useEffect(() => {
    loadAvailableVehicles();
  }, []);

  const loadAvailableVehicles = async () => {
    try {
      startLoading('Đang tải danh sách xe...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVehicles = [
        { id: 1, model: 'Model 3', price: 1200000000, range: '602 km', topSpeed: '261 km/h', acceleration: '3.1s' },
        { id: 2, model: 'Model Y', price: 1500000000, range: '533 km', topSpeed: '217 km/h', acceleration: '3.5s' },
        { id: 3, model: 'Model S', price: 2800000000, range: '652 km', topSpeed: '322 km/h', acceleration: '2.1s' },
        { id: 4, model: 'Model X', price: 3200000000, range: '580 km', topSpeed: '250 km/h', acceleration: '2.6s' }
      ];
      
      setAvailableVehicles(mockVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      stopLoading();
    }
  };

  const handleSelectVehicle = (vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find(v => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const handleRemoveVehicle = (vehicleId) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  const formatPrice = (price) => {
    return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
  };

  return (
    <PageContainer>
      <PageHeader
        title="⚖️ So sánh xe"
        subtitle={`Chọn tối đa 3 xe để so sánh thông số (Đã chọn: ${selectedVehicles.length}/3)`}
      />

      {/* Vehicle Selector */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Chọn xe để so sánh:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableVehicles.map(vehicle => (
            <Button
              key={vehicle.id}
              variant={selectedVehicles.find(v => v.id === vehicle.id) ? 'primary' : 'secondary'}
              onClick={() => handleSelectVehicle(vehicle)}
              disabled={selectedVehicles.length >= 3 && !selectedVehicles.find(v => v.id === vehicle.id)}
              className="w-full"
            >
              {vehicle.model}
              {selectedVehicles.find(v => v.id === vehicle.id) && ' ✓'}
            </Button>
          ))}
        </div>
      </Card>

      {/* Comparison Table */}
      {selectedVehicles.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Thông số</th>
                  {selectedVehicles.map(vehicle => (
                    <th key={vehicle.id} className="text-left py-4 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-bold">{vehicle.model}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveVehicle(vehicle.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-400 font-semibold">Giá</td>
                  {selectedVehicles.map(vehicle => (
                    <td key={vehicle.id} className="py-4 px-4 text-white">
                      <span className="text-emerald-400 font-bold">{formatPrice(vehicle.price)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-400 font-semibold">Phạm vi</td>
                  {selectedVehicles.map(vehicle => (
                    <td key={vehicle.id} className="py-4 px-4 text-white">{vehicle.range}</td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-400 font-semibold">Tốc độ tối đa</td>
                  {selectedVehicles.map(vehicle => (
                    <td key={vehicle.id} className="py-4 px-4 text-white">{vehicle.topSpeed}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-400 font-semibold">Tăng tốc 0-100km/h</td>
                  {selectedVehicles.map(vehicle => (
                    <td key={vehicle.id} className="py-4 px-4 text-white">{vehicle.acceleration}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-400 text-lg">
            ⚖️ Chọn xe từ danh sách bên trên để bắt đầu so sánh
          </p>
        </Card>
      )}
    </PageContainer>
  );
};

export default CompareVehicles;
