import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { Car } from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  Card,
  Button,
  Badge,
  Select,
  FormGroup
} from '../../components';
import VehicleApi from './vehicleApi';

const VehicleList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    model: '',
    minPrice: null,
    maxPrice: null,
    page: 1,
    size: 12
  });

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      startLoading('Đang tải danh sách xe...');
      
      const params = {
        search: filters.search || undefined,
        brand: filters.brand || undefined,
        model: filters.model || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: filters.page,
        size: filters.size
      };

      const result = await VehicleApi.getVehicles(params);
      
      if (result.success) {
        setVehicles(result.data.items || []);
        setPagination(result.data.pagination || {
          page: 1,
          size: 10,
          total: 0,
          totalPages: 0
        });
      } else {
        throw new Error(result.error || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError(error.message || 'Không thể tải danh sách xe');
      setVehicles([]); // Clear vehicles on error
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleViewDetail = (vehicleId) => {
    navigate(`/dealer/vehicles/${vehicleId}`);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return `${(price / 1000000000).toFixed(1)} tỷ VNĐ`;
  };

  const getAvailabilityBadge = (totalQuantity) => {
    if (totalQuantity > 5) return { text: 'Có sẵn', variant: 'success' };
    if (totalQuantity > 0) return { text: 'Ít hàng', variant: 'warning' };
    return { text: 'Hết hàng', variant: 'danger' };
  };

  return (
    <PageContainer>
      <PageHeader
        title="Danh sách xe"
        subtitle="Quản lý và xem thông tin các dòng xe"
        icon={<Car className="w-16 h-16" />}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FormGroup>
          <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Tên xe hoặc thương hiệu..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormGroup>

        <FormGroup>
          <label className="block text-sm font-medium mb-1">Thương hiệu</label>
          <Select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            placeholder="Tất cả thương hiệu"
            options={[
              { value: 'Tesla', label: 'Tesla' },
              { value: 'Audi', label: 'Audi' },
              { value: 'Ford', label: 'Ford' },
              { value: 'Hyundai', label: 'Hyundai' },
              { value: 'Kia', label: 'Kia' },
              { value: 'Volkswagen', label: 'Volkswagen' },
              { value: 'Volvo', label: 'Volvo' },
              { value: 'Nissan', label: 'Nissan' },
              { value: 'Lucid', label: 'Lucid' }
            ]}
          />
        </FormGroup>

        <FormGroup>
          <label className="block text-sm font-medium mb-1">Khoảng giá</label>
          <Select
            value={filters.priceRange}
            onChange={(e) => {
              const range = e.target.value;
              let minPrice = null, maxPrice = null;
              if (range) {
                [minPrice, maxPrice] = range.split('-').map(Number);
              }
              setFilters(prev => ({
                ...prev,
                minPrice,
                maxPrice,
                priceRange: e.target.value
              }));
            }}
            placeholder="Tất cả mức giá"
            options={[
              { value: '', label: 'Tất cả mức giá' },
              { value: '0-50000', label: 'Dưới 50k' },
              { value: '50000-70000', label: '50k - 70k' },
              { value: '70000-100000', label: '70k - 100k' },
              { value: '100000-999999', label: 'Trên 100k' }
            ]}
          />
        </FormGroup>

        <FormGroup>
          <label className="block text-sm font-medium mb-1">Sắp xếp</label>
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            placeholder="Sắp xếp theo"
            options={[
              { value: 'name', label: 'Tên A-Z' },
              { value: 'price_asc', label: 'Giá tăng dần' },
              { value: 'price_desc', label: 'Giá giảm dần' },
              { value: 'newest', label: 'Mới nhất' }
            ]}
          />
        </FormGroup>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400">⚠️ {error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={loadVehicles}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination.total > 0 && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Hiển thị {vehicles.length} xe (Trang {pagination.page}/{pagination.totalPages} - Tổng cộng {pagination.total} xe)
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map(vehicle => {
            const availability = getAvailabilityBadge(vehicle.inventorySummary?.totalQuantity || 0);
            
            return (
              <Card key={vehicle.vehicleId} hover className="flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 flex items-center justify-center text-6xl">
                  🚗
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{vehicle.brand}</h3>
                    <Badge variant="info">{vehicle.year}</Badge>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-white">{vehicle.model}</h4>
                  <p className="text-emerald-400 text-lg font-semibold mb-3">
                    {formatPrice(vehicle.basePrice)}
                  </p>
                  
                  {/* Vehicle Configs */}
                  {vehicle.configs && vehicle.configs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Cấu hình:</p>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.configs.slice(0, 2).map(config => (
                          <Badge key={config.configId} variant="secondary" className="text-xs">
                            {config.color}
                          </Badge>
                        ))}
                        {vehicle.configs.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{vehicle.configs.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={availability.variant}>
                      {availability.text}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Tồn kho: {vehicle.inventorySummary?.totalQuantity || 0} xe
                    </span>
                  </div>
                </div>
                <Button 
                  variant="primary"
                  className="w-full"
                  onClick={() => handleViewDetail(vehicle.vehicleId)}
                >
                  Xem chi tiết
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* No data message */}
      {!loading && vehicles.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Không tìm thấy xe nào</h3>
          <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      )}
    </PageContainer>
  );
};

export default VehicleList;
