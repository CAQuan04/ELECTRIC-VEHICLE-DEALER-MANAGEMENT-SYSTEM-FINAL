import React from 'react';
import { AuthService } from '../../../shared/utils/auth';
import { 
  ErrorMessage, 
  DashboardHero, 
  NavigationPills,
  StatCard,
  Grid,
  DashboardSection,
  Card,
  DataTable,
  StatusBadge
} from '../../../shared/components/ui/UIComponents';
import { useDataFetching, useDashboardNavigation } from '../../../shared/hooks/useCommon';
import '../styles/DealerDashboard.css';
import '../styles/DealerSections.css';

const DealerDashboard = () => {
  const currentUser = AuthService.getCurrentUser();
  const { activeSection, changeSection } = useDashboardNavigation('overview');
  
  // Mock API function for dealer data
  const fetchDealerData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: {
        dealer: {
          vehicles: 47,
          orders: 13,
          customers: 156,
          revenue: 11.3
        },
        performance: {
          monthlySales: 13,
          quarterTarget: 85,
          customerSatisfaction: 4.7,
          deliveryTime: 5
        },
        recentOrders: [
          { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Tesla Model 3', status: 'processing', date: '2 giờ trước' },
          { id: 2, customer: 'Trần Thị B', vehicle: 'Tesla Model Y', status: 'completed', date: '1 ngày trước' },
          { id: 3, customer: 'Lê Văn C', vehicle: 'Tesla Model S', status: 'pending', date: '2 ngày trước' },
          { id: 4, customer: 'Phạm Thị D', vehicle: 'Tesla Model X', status: 'shipping', date: '3 ngày trước' }
        ],
        inventory: [
          { model: 'Model 3', available: 12, reserved: 3, total: 15 },
          { model: 'Model Y', available: 8, reserved: 2, total: 10 },
          { model: 'Model S', available: 5, reserved: 1, total: 6 },
          { model: 'Model X', available: 3, reserved: 0, total: 3 }
        ]
      }
    };
  };
  
  // Fetch dealer data using custom hook
  const { data: dealerData, loading, error, refetch } = useDataFetching(fetchDealerData, []);

  // Navigation sections configuration
  const navigationSections = [
    { key: 'overview', label: 'Tổng quan', icon: '📊' },
    { key: 'orders', label: 'Đơn hàng', icon: '📋' },
    { key: 'inventory', label: 'Kho xe', icon: '🚗' },
    { key: 'customers', label: 'Khách hàng', icon: '👥' },
    { key: 'reports', label: 'Báo cáo', icon: '📈' }
  ];

  // Get status info for orders
  const getOrderStatusInfo = (status) => {
    switch (status) {
      case 'processing':
        return { text: '🔄 Đang xử lý', type: 'pending' };
      case 'completed':
        return { text: '✅ Hoàn thành', type: 'completed' };
      case 'pending':
        return { text: '⏳ Chờ duyệt', type: 'pending' };
      case 'shipping':
        return { text: '🚚 Đang giao', type: 'scheduled' };
      default:
        return { text: status, type: 'pending' };
    }
  };

  // Render Overview Section
  const renderOverviewSection = () => (
    <DashboardSection title="📊 Tổng quan Dealer">
      <Grid columns="auto-fit" minWidth="250px" className="dealer-stats">
        <StatCard 
          value={dealerData.dealer.vehicles}
          label="Xe trong kho"
          icon="🚗"
        />
        <StatCard 
          value={dealerData.dealer.orders}
          label="Đơn hàng mới"
          icon="📋"
        />
        <StatCard 
          value={dealerData.dealer.customers}
          label="Khách hàng"
          icon="👥"
        />
        <StatCard 
          value={`${dealerData.dealer.revenue} tỷ`}
          label="Doanh thu tháng"
          icon="💰"
        />
      </Grid>
      
      <div style={{ marginTop: '2rem' }}>
        <Grid columns="auto-fit" minWidth="300px">
          <Card title="📈 Hiệu suất bán hàng">
            <div className="performance-metrics">
              <div className="metric-row">
                <span>Bán trong tháng:</span>
                <span><strong>{dealerData.performance.monthlySales} xe</strong></span>
              </div>
              <div className="metric-row">
                <span>Mục tiêu quý:</span>
                <span><strong>{dealerData.performance.quarterTarget} xe</strong></span>
              </div>
              <div className="metric-row">
                <span>Đánh giá KH:</span>
                <span><strong>{dealerData.performance.customerSatisfaction}/5.0</strong></span>
              </div>
              <div className="metric-row">
                <span>Thời gian giao:</span>
                <span><strong>{dealerData.performance.deliveryTime} ngày</strong></span>
              </div>
            </div>
          </Card>
        </Grid>
      </div>
    </DashboardSection>
  );

  // Render Orders Section
  const renderOrdersSection = () => {
    const orderTableHeaders = ['Khách hàng', 'Xe', 'Trạng thái', 'Thời gian'];
    const orderTableData = dealerData.recentOrders.map(order => {
      const statusInfo = getOrderStatusInfo(order.status);
      return [
        order.customer,
        order.vehicle,
        {
          value: statusInfo.text,
          className: `status ${statusInfo.type}`
        },
        order.date
      ];
    });

    return (
      <DashboardSection title="📋 Đơn hàng gần đây">
        <Card>
          <DataTable 
            headers={orderTableHeaders}
            data={orderTableData}
            className="orders-table"
          />
        </Card>
      </DashboardSection>
    );
  };

  // Render Inventory Section
  const renderInventorySection = () => (
    <DashboardSection title="🚗 Tình trạng kho xe">
      <Grid columns="auto-fit" minWidth="300px">
        {dealerData.inventory.map((item, index) => (
          <Card key={index} title={`Tesla ${item.model}`}>
            <div className="inventory-details">
              <div className="metric-row">
                <span>Có sẵn:</span>
                <span><strong>{item.available} xe</strong></span>
              </div>
              <div className="metric-row">
                <span>Đã đặt:</span>
                <span><strong>{item.reserved} xe</strong></span>
              </div>
              <div className="metric-row total">
                <span>Tổng cộng:</span>
                <span><strong>{item.total} xe</strong></span>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </DashboardSection>
  );

  // Render active section based on selection
  const renderActiveSection = () => {
    if (!dealerData) return null;

    switch (activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'orders':
        return renderOrdersSection();
      case 'inventory':
        return renderInventorySection();
      case 'customers':
        return (
          <DashboardSection title="👥 Quản lý khách hàng">
            <p>Chức năng quản lý khách hàng sẽ được phát triển...</p>
          </DashboardSection>
        );
      case 'reports':
        return (
          <DashboardSection title="📈 Báo cáo bán hàng">
            <p>Chức năng báo cáo sẽ được phát triển...</p>
          </DashboardSection>
        );
      default:
        return renderOverviewSection();
    }
  };

  return (
    <div className="dealer-dashboard">
      <DashboardHero 
        title="Chào mừng Dealer, {name}!"
        subtitle="Giao diện quản lý bán hàng Tesla"
        userName={currentUser?.name}
      />

      <NavigationPills 
        sections={navigationSections}
        activeSection={activeSection}
        onSectionChange={changeSection}
      />

      <div className="dealer-content">
        {error && (
          <ErrorMessage 
            error={error}
            onRetry={refetch}
          />
        )}

        {!error && renderActiveSection()}
      </div>
    </div>
  );
};

export default DealerDashboard;