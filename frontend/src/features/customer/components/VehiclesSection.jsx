import React from 'react';
import { 
  DashboardSection, 
  Card, 
  Grid, 
  StatusBadge 
} from '@modules/common/ui/UIComponents';
import { CustomerMockAPI } from '../services/customerMockAPI';
import '../styles/CustomerSections.css';

const VehiclesSection = ({ data }) => {
  if (!data || !data.vehicles) return null;

  const { vehicles } = data;

  return (
    <DashboardSection title="🚗 Xe của tôi">
      <Grid columns="auto-fit" minWidth="400px">
        {vehicles.map(vehicle => (
          <Card 
            key={vehicle.id}
            title={vehicle.model}
            headerAction={
              <StatusBadge status={vehicle.status}>
                {vehicle.status === 'active' ? '✅ Hoạt động' : '⚠️ Bảo trì'}
              </StatusBadge>
            }
            className="vehicle-card"
          >
            <div className="vehicle-details">
              <div className="detail-row">
                <span className="label">Năm sản xuất:</span>
                <span className="value">{vehicle.year}</span>
              </div>
              <div className="detail-row">
                <span className="label">Màu sắc:</span>
                <span className="value">{vehicle.color}</span>
              </div>
              <div className="detail-row">
                <span className="label">VIN:</span>
                <span className="value">{vehicle.vin}</span>
              </div>
              <div className="detail-row">
                <span className="label">Số km đã đi:</span>
                <span className="value">{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="detail-row">
                <span className="label">Pin:</span>
                <span className="value">{vehicle.batteryLevel}% ({vehicle.range} km)</span>
              </div>
              <div className="detail-row">
                <span className="label">Bảo dưỡng cuối:</span>
                <span className="value">{CustomerMockAPI.formatDate(vehicle.lastService)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Bảo dưỡng tiếp theo:</span>
                <span className="value">{CustomerMockAPI.formatDate(vehicle.nextService)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Bảo hiểm hết hạn:</span>
                <span className="value">{CustomerMockAPI.formatDate(vehicle.insuranceExpiry)}</span>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </DashboardSection>
  );
};

export default VehiclesSection;