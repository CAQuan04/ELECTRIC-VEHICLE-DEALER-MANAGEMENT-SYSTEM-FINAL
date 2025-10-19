import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const StockDetail = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [stockDetail, setStockDetail] = useState(null);

  useEffect(() => {
    loadStockDetail();
  }, [stockId]);

  const loadStockDetail = async () => {
    try {
      startLoading('Đang tải chi tiết kho...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDetail = {
        id: stockId,
        model: 'Model 3',
        color: 'Pearl White',
        total: 15,
        available: 12,
        reserved: 3,
        vehicles: [
          { vin: 'VIN001', status: 'Sẵn bán', receivedDate: '2025-09-01', location: 'Khu A' },
          { vin: 'VIN002', status: 'Đã đặt', receivedDate: '2025-09-05', location: 'Khu A' },
          { vin: 'VIN003', status: 'Sẵn bán', receivedDate: '2025-09-10', location: 'Khu B' },
        ]
      };
      
      setStockDetail(mockDetail);
    } catch (error) {
      console.error('Error loading stock detail:', error);
    } finally {
      stopLoading();
    }
  };

  if (!stockDetail) return null;

  return (
    <div className="stock-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="stock-header">
        <h1>{stockDetail.model} - {stockDetail.color}</h1>
        <div className="stock-stats">
          <div className="stat">
            <span className="value">{stockDetail.total}</span>
            <span className="label">Tổng số</span>
          </div>
          <div className="stat">
            <span className="value">{stockDetail.available}</span>
            <span className="label">Sẵn bán</span>
          </div>
          <div className="stat">
            <span className="value">{stockDetail.reserved}</span>
            <span className="label">Đã đặt</span>
          </div>
        </div>
      </div>

      <div className="vehicles-table">
        <h3>Danh sách xe trong kho</h3>
        <table>
          <thead>
            <tr>
              <th>VIN</th>
              <th>Trạng thái</th>
              <th>Ngày nhập</th>
              <th>Vị trí</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stockDetail.vehicles.map(vehicle => (
              <tr key={vehicle.vin}>
                <td><strong>{vehicle.vin}</strong></td>
                <td>
                  <span className={vehicle.status === 'Sẵn bán' ? 'badge-success' : 'badge-warning'}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.receivedDate}</td>
                <td>{vehicle.location}</td>
                <td>
                  <button className="btn-link">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockDetail;
