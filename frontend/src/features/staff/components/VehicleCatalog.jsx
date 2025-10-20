import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../shared/utils/auth';
import './VehicleCatalog.css';

const VehicleCatalog = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    model: '',
    priceRange: '',
    category: '',
    availability: 'all'
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [compareList, setCompareList] = useState([]);

  // Mock vehicle data - Replace with API call
  const mockVehicles = [
    {
      id: 1,
      model: 'Model S',
      category: 'Sedan',
      price: 2800000000,
      wholeSalePrice: 2500000000,
      range: 652,
      acceleration: 2.1,
      topSpeed: 322,
      charging: 'Supercharger V3',
      availability: 'available',
      stock: 15,
      colors: ['Pearl White', 'Solid Black', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      features: ['Autopilot', 'Premium Interior', 'Glass Roof', 'Premium Audio'],
      image: '/src/assets/tesla/models.png',
      dealerDiscount: 5,
      specifications: {
        motor: 'Dual Motor All-Wheel Drive',
        battery: '100 kWh',
        seats: 5,
        warranty: '8 years / 240,000 km'
      }
    },
    {
      id: 2,
      model: 'Model 3',
      category: 'Sedan',
      price: 1200000000,
      wholeSalePrice: 1000000000,
      range: 568,
      acceleration: 3.1,
      topSpeed: 261,
      charging: 'Supercharger V3',
      availability: 'available',
      stock: 25,
      colors: ['Pearl White', 'Solid Black', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      features: ['Autopilot', 'Premium Interior', 'Glass Roof'],
      image: '/src/assets/tesla/model-3.png',
      dealerDiscount: 3,
      specifications: {
        motor: 'Rear-Wheel Drive',
        battery: '75 kWh',
        seats: 5,
        warranty: '8 years / 192,000 km'
      }
    },
    {
      id: 3,
      model: 'Model Y',
      category: 'SUV',
      price: 1800000000,
      wholeSalePrice: 1600000000,
      range: 525,
      acceleration: 3.5,
      topSpeed: 217,
      charging: 'Supercharger V3',
      availability: 'low_stock',
      stock: 3,
      colors: ['Pearl White', 'Solid Black', 'Midnight Silver', 'Deep Blue', 'Pearl Red'],
      features: ['Autopilot', 'Premium Interior', 'Glass Roof', '7-Seat Option'],
      image: '/src/assets/tesla/modely.png',
      dealerDiscount: 2,
      specifications: {
        motor: 'Dual Motor All-Wheel Drive',
        battery: '81 kWh',
        seats: '5 or 7',
        warranty: '8 years / 192,000 km'
      }
    },
    {
      id: 4,
      model: 'Cybertruck',
      category: 'Truck',
      price: 2200000000,
      wholeSalePrice: 2000000000,
      range: 547,
      acceleration: 2.6,
      topSpeed: 209,
      charging: 'Supercharger V4',
      availability: 'pre_order',
      stock: 0,
      colors: ['Stainless Steel'],
      features: ['Autopilot', 'Bulletproof Body', 'Air Suspension', 'Towing Package'],
      image: '/src/assets/tesla/cyphertruck.png',
      dealerDiscount: 0,
      specifications: {
        motor: 'Tri Motor All-Wheel Drive',
        battery: '123 kWh',
        seats: 6,
        warranty: '8 years / 240,000 km'
      }
    }
  ];

  useEffect(() => {
    setVehicles(mockVehicles);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAvailabilityStatus = (availability, stock) => {
    switch(availability) {
      case 'available': return { text: 'Có sẵn', class: 'available' };
      case 'low_stock': return { text: `Sắp hết (${stock})`, class: 'low-stock' };
      case 'pre_order': return { text: 'Đặt trước', class: 'pre-order' };
      case 'out_of_stock': return { text: 'Hết hàng', class: 'out-of-stock' };
      default: return { text: 'Không xác định', class: 'unknown' };
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.category && vehicle.category !== filters.category) return false;
    if (filters.availability !== 'all' && vehicle.availability !== filters.availability) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (vehicle.price < min * 1000000 || vehicle.price > max * 1000000) return false;
    }
    return true;
  });

  const addToCompare = (vehicle) => {
    if (compareList.length < 3 && !compareList.find(v => v.id === vehicle.id)) {
      setCompareList([...compareList, vehicle]);
    }
  };

  const removeFromCompare = (vehicleId) => {
    setCompareList(compareList.filter(v => v.id !== vehicleId));
  };

  return (
    <div className="vehicle-catalog">
      <div className="catalog-header">
        <h2>📚 Danh Mục Xe Điện</h2>
        <p>Xem thông tin chi tiết và so sánh các mẫu xe</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>🔍 Tìm kiếm mẫu xe:</label>
            <input
              type="text"
              placeholder="Nhập tên mẫu xe..."
              value={filters.model}
              onChange={(e) => setFilters({...filters, model: e.target.value})}
            />
          </div>
          
          <div className="filter-group">
            <label>🚗 Loại xe:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">Tất cả</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div className="filter-group">
            <label>💰 Khoảng giá (triệu VND):</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              <option value="">Tất cả</option>
              <option value="0-1500">0 - 1,5 tỷ</option>
              <option value="1500-2000">1,5 - 2 tỷ</option>
              <option value="2000-3000">2 - 3 tỷ</option>
              <option value="3000-5000">3+ tỷ</option>
            </select>
          </div>

          <div className="filter-group">
            <label>📦 Tình trạng kho:</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
            >
              <option value="all">Tất cả</option>
              <option value="available">Có sẵn</option>
              <option value="low_stock">Sắp hết</option>
              <option value="pre_order">Đặt trước</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-items">
            <span>🔄 So sánh ({compareList.length}/3):</span>
            {compareList.map(vehicle => (
              <div key={vehicle.id} className="compare-item">
                {vehicle.model}
                <button onClick={() => removeFromCompare(vehicle.id)}>×</button>
              </div>
            ))}
          </div>
          <button 
            className="compare-btn"
            disabled={compareList.length < 2}
            onClick={() => setSelectedVehicle('compare')}
          >
            So Sánh Chi Tiết
          </button>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="vehicles-grid">
        {filteredVehicles.map(vehicle => {
          const status = getAvailabilityStatus(vehicle.availability, vehicle.stock);
          const isInCompare = compareList.find(v => v.id === vehicle.id);
          
          return (
            <div key={vehicle.id} className="vehicle-card">
              <div className="vehicle-image">
                <img src={vehicle.image} alt={vehicle.model} />
                <div className={`availability-badge ${status.class}`}>
                  {status.text}
                </div>
              </div>
              
              <div className="vehicle-info">
                <h3>{vehicle.model}</h3>
                <p className="category">{vehicle.category}</p>
                
                <div className="pricing">
                  <div className="retail-price">
                    <span className="label">Giá bán lẻ:</span>
                    <span className="price">{formatCurrency(vehicle.price)}</span>
                  </div>
                  <div className="wholesale-price">
                    <span className="label">Giá sỉ:</span>
                    <span className="price">{formatCurrency(vehicle.wholeSalePrice)}</span>
                  </div>
                  <div className="dealer-profit">
                    <span className="label">Lợi nhuận:</span>
                    <span className="profit">{formatCurrency(vehicle.price - vehicle.wholeSalePrice)}</span>
                  </div>
                </div>

                <div className="key-specs">
                  <div className="spec">⚡ {vehicle.range} km</div>
                  <div className="spec">🚀 0-100: {vehicle.acceleration}s</div>
                  <div className="spec">🏎️ {vehicle.topSpeed} km/h</div>
                </div>

                <div className="vehicle-actions">
                  <button 
                    className="btn-detail"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    📋 Chi Tiết
                  </button>
                  <button 
                    className={`btn-compare ${isInCompare ? 'active' : ''}`}
                    onClick={() => isInCompare ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
                    disabled={!isInCompare && compareList.length >= 3}
                  >
                    {isInCompare ? '✓ Đã chọn' : '🔄 So sánh'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && selectedVehicle !== 'compare' && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="vehicle-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedVehicle.model}</h2>
              <button className="close-btn" onClick={() => setSelectedVehicle(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="detail-image">
                <img src={selectedVehicle.image} alt={selectedVehicle.model} />
              </div>
              
              <div className="detail-info">
                <div className="pricing-detail">
                  <h3>💰 Thông Tin Giá</h3>
                  <div className="price-row">
                    <span>Giá bán lẻ:</span>
                    <span>{formatCurrency(selectedVehicle.price)}</span>
                  </div>
                  <div className="price-row">
                    <span>Giá sỉ:</span>
                    <span>{formatCurrency(selectedVehicle.wholeSalePrice)}</span>
                  </div>
                  <div className="price-row profit-row">
                    <span>Lợi nhuận:</span>
                    <span>{formatCurrency(selectedVehicle.price - selectedVehicle.wholeSalePrice)}</span>
                  </div>
                  <div className="price-row">
                    <span>Chiết khấu đại lý:</span>
                    <span>{selectedVehicle.dealerDiscount}%</span>
                  </div>
                </div>

                <div className="specifications">
                  <h3>⚙️ Thông Số Kỹ Thuật</h3>
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span>Động cơ:</span>
                      <span>{selectedVehicle.specifications.motor}</span>
                    </div>
                    <div className="spec-item">
                      <span>Pin:</span>
                      <span>{selectedVehicle.specifications.battery}</span>
                    </div>
                    <div className="spec-item">
                      <span>Phạm vi:</span>
                      <span>{selectedVehicle.range} km</span>
                    </div>
                    <div className="spec-item">
                      <span>Tăng tốc 0-100:</span>
                      <span>{selectedVehicle.acceleration}s</span>
                    </div>
                    <div className="spec-item">
                      <span>Tốc độ tối đa:</span>
                      <span>{selectedVehicle.topSpeed} km/h</span>
                    </div>
                    <div className="spec-item">
                      <span>Số ghế:</span>
                      <span>{selectedVehicle.specifications.seats}</span>
                    </div>
                    <div className="spec-item">
                      <span>Bảo hành:</span>
                      <span>{selectedVehicle.specifications.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="features-colors">
                  <div className="features">
                    <h3>✨ Tính Năng</h3>
                    <div className="feature-list">
                      {selectedVehicle.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>

                  <div className="colors">
                    <h3>🎨 Màu Sắc Có Sẵn</h3>
                    <div className="color-list">
                      {selectedVehicle.colors.map((color, index) => (
                        <span key={index} className="color-tag">{color}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="inventory-info">
                  <h3>📦 Thông Tin Kho</h3>
                  <div className="inventory-details">
                    <div className="stock-info">
                      <span>Tồn kho:</span>
                      <span className={selectedVehicle.stock > 10 ? 'good-stock' : selectedVehicle.stock > 0 ? 'low-stock' : 'no-stock'}>
                        {selectedVehicle.stock} xe
                      </span>
                    </div>
                    <div className="availability-info">
                      <span>Tình trạng:</span>
                      <span className={getAvailabilityStatus(selectedVehicle.availability).class}>
                        {getAvailabilityStatus(selectedVehicle.availability).text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {selectedVehicle === 'compare' && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="compare-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔄 So Sánh Xe</h2>
              <button className="close-btn" onClick={() => setSelectedVehicle(null)}>×</button>
            </div>
            
            <div className="compare-content">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Thông số</th>
                    {compareList.map(vehicle => (
                      <th key={vehicle.id}>{vehicle.model}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hình ảnh</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>
                        <img src={vehicle.image} alt={vehicle.model} className="compare-image" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Giá bán lẻ</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{formatCurrency(vehicle.price)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Giá sỉ</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{formatCurrency(vehicle.wholeSalePrice)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Lợi nhuận</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id} className="profit-cell">
                        {formatCurrency(vehicle.price - vehicle.wholeSalePrice)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Phạm vi</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.range} km</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Tăng tốc 0-100</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.acceleration}s</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Tốc độ tối đa</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.topSpeed} km/h</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Tồn kho</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.stock} xe</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Động cơ</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.specifications.motor}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Pin</td>
                    {compareList.map(vehicle => (
                      <td key={vehicle.id}>{vehicle.specifications.battery}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCatalog;