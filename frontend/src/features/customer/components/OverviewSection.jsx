import React from 'react';
import { 
  DashboardSection, 
  StatCard, 
  Card, 
  Grid 
} from '../../../shared/components/ui/UIComponents';
import { CustomerMockAPI } from '../services/customerMockAPI';
import '../styles/CustomerSections.css';

const OverviewSection = ({ data }) => {
  if (!data) return null;

  const { overview } = data;

  return (
    <DashboardSection title="📊 Tổng quan tài khoản">
      <Grid columns="auto-fit" minWidth="250px" className="customer-stats">
        <StatCard 
          value={overview.totalVehicles}
          label="Xe sở hữu"
          icon="🚗"
        />
        <StatCard 
          value={overview.pendingServices}
          label="Dịch vụ đang chờ"
          icon="🔧"
        />
        <StatCard 
          value={CustomerMockAPI.formatCurrency(overview.remainingLoanAmount)}
          label="Nợ còn lại"
          icon="💰"
        />
        <StatCard 
          value={CustomerMockAPI.formatCurrency(overview.monthlyPayment)}
          label="Trả góp hàng tháng"
          icon="📅"
        />
      </Grid>
      
      <div style={{ marginTop: '2rem' }}>
        <Card title="💳 Thông tin tài chính">
          <div className="overview-details">
            <p><strong>Điểm tín dụng:</strong> {overview.creditScore}</p>
            <p><strong>Hạng thành viên:</strong> {overview.membershipLevel}</p>
            <p><strong>Kỳ thanh toán tiếp theo:</strong> {CustomerMockAPI.formatDate(overview.nextPaymentDate)}</p>
          </div>
        </Card>
      </div>
    </DashboardSection>
  );
};

export default OverviewSection;