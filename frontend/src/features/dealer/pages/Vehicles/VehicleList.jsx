import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import {
  PageContainer,
  PageHeader,
  Card,
  Button,
  Badge,
  Select,
  FormGroup
} from '../../components';

const VehicleList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    model: '',
    priceRange: '',
    availability: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const loadVehicles = async () => {
    try {
      startLoading('Đang tải danh sách xe...');
      // TODO: Call API to get vehicles
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVehicles = [
        { id: 1, model: 'Model 3', price: 1200000000, availability: 'Có sẵn', stock: 5 },
        { id: 2, model: 'Model Y', price: 1500000000, availability: 'Có sẵn', stock: 3 },
        { id: 3, model: 'Model S', price: 2800000000, availability: 'Đặt hàng', stock: 0 },
        { id: 4, model: 'Model X', price: 3200000000, availability: 'Có sẵn', stock: 2 }
      ];
      
      setVehicles(mockVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      stopLoading();
    }
  };

  const handleViewDetail = (vehicleId) => {
    navigate(`/dealer/vehicles/${vehicleId}`);
  };

  const formatPrice = (price) => {
    return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
  };

  return (
    <PageContainer>
      <PageHeader
        title="🚗 Danh sách xe"
        subtitle="Quản lý và xem thông tin các dòng xe"
        actions={
          <Button 
            variant="gradient"
            onClick={() => navigate('/dealer/vehicles/compare')}
          >
            So sánh xe
          </Button>
        }
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormGroup>
          <Select
            value={filters.model}
            onChange={(e) => setFilters({...filters, model: e.target.value})}
            placeholder="Tất cả dòng xe"
            options={[
              { value: 'model3', label: 'Model 3' },
              { value: 'modelY', label: 'Model Y' },
              { value: 'modelS', label: 'Model S' },
              { value: 'modelX', label: 'Model X' }
            ]}
          />
        </FormGroup>

        <FormGroup>
          <Select
            value={filters.availability}
            onChange={(e) => setFilters({...filters, availability: e.target.value})}
            placeholder="Tất cả tình trạng"
            options={[
              { value: 'available', label: 'Có sẵn' },
              { value: 'order', label: 'Đặt hàng' }
            ]}
          />
        </FormGroup>

        <FormGroup>
          <Select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            placeholder="Khoảng giá"
            options={[
              { value: 'under1b', label: 'Dưới 1 tỷ' },
              { value: '1-2b', label: '1 - 2 tỷ' },
              { value: '2-3b', label: '2 - 3 tỷ' },
              { value: 'over3b', label: 'Trên 3 tỷ' }
            ]}
          />
        </FormGroup>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id} hover className="flex flex-col">
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center text-6xl">
              🚗
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-white">{vehicle.model}</h3>
              <p className="text-emerald-400 text-xl font-semibold mb-3">
                {formatPrice(vehicle.price)}
              </p>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={vehicle.availability === 'Có sẵn' ? 'success' : 'warning'}>
                  {vehicle.availability}
                </Badge>
                <span className="text-sm text-gray-400">Tồn kho: {vehicle.stock} xe</span>
              </div>
            </div>
            <Button 
              variant="primary"
              className="w-full"
              onClick={() => handleViewDetail(vehicle.id)}
            >
              Xem chi tiết
            </Button>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default VehicleList;
