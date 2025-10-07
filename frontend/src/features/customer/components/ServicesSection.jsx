import React from 'react';
import { 
  DashboardSection, 
  Card, 
  StatusBadge 
} from '../../../shared/components/ui/UIComponents';
import { CustomerMockAPI } from '../services/customerMockAPI';
import '../styles/CustomerSections.css';

const ServicesSection = ({ data }) => {
  if (!data || !data.services) return null;

  const { services } = data;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'scheduled':
        return { text: '📅 Đã lên lịch', type: 'scheduled' };
      case 'completed':
        return { text: '✅ Hoàn thành', type: 'completed' };
      case 'pending':
        return { text: '⏳ Chờ xác nhận', type: 'pending' };
      default:
        return { text: status, type: 'pending' };
    }
  };

  return (
    <DashboardSection title="🔧 Dịch vụ">
      <div className="services-list">
        {services.map(service => {
          const statusInfo = getStatusInfo(service.status);
          return (
            <Card 
              key={service.id}
              title={service.serviceType}
              headerAction={
                <StatusBadge status={statusInfo.type}>
                  {statusInfo.text}
                </StatusBadge>
              }
              className="service-card"
            >
              <div className="service-details">
                <div className="detail-row">
                  <span className="label">Xe:</span>
                  <span className="value">{service.vehicleModel}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Ngày:</span>
                  <span className="value">{CustomerMockAPI.formatDate(service.scheduledDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Mô tả:</span>
                  <span className="value">{service.description}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Chi phí dự kiến:</span>
                  <span className="value">{CustomerMockAPI.formatCurrency(service.estimatedCost)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Trung tâm:</span>
                  <span className="value">{service.serviceCenter}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Kỹ thuật viên:</span>
                  <span className="value">{service.technician}</span>
                </div>
                {service.completedDate && (
                  <div className="detail-row">
                    <span className="label">Hoàn thành:</span>
                    <span className="value">{CustomerMockAPI.formatDate(service.completedDate)}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardSection>
  );
};

export default ServicesSection;