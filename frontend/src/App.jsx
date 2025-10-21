import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Theme override CSS
import './styles/theme-override.css';

// Modules
import { 
  Sidebar, 
  Navbar, 
  Header
} from '@modules/layout';

import { 
  DealerGuard, 
  CustomerGuard, 
  AdminGuard, 
  AccessDenied
} from '@modules/auth';

import { VehicleList } from '@modules/common';

// Utils
import { AuthService } from '@utils';

// Loading system
import { 
  GlobalLoadingProvider, 
  withRouteLoading,
  withFullPageLoading,
  withDashboardLoading 
} from './modules/loading';

// Notification system
import { NotificationContainer } from '@modules/common';

// Feature imports
import { 
  CustomerDashboard, 
  CustomerList 
} from './features/customer';

import { 
  DealerDashboard,
  // Vehicles
  VehicleList as DealerVehicleList,
  VehicleDetail,
  CompareVehicles,
  // Inventory
  DealerInventory,
  StockDetail,
  RequestStock,
  // Customers
  CustomerList as DealerCustomerList,
  CustomerForm,
  CustomerDetail,
  // Test Drive
  TestDriveList,
  TestDriveForm,
  TestDriveCalendar,
  // Sales
  QuotationList,
  CreateQuotation,
  OrderList,
  CreateOrder,
  PaymentList,
  PaymentForm,
  // Purchase
  PurchaseRequestList,
  CreatePurchaseRequest,
  // Reports
  SalesPerformanceReport,
  CustomerDebtReport,
  SupplierDebtReport,
  // Promotion
  PromotionList,
  PromotionDetail,
  // Staff
  StaffList,
  StaffForm,
  // Theme
  ThemeProvider
} from './features/dealer';

// Import ThemeToggle separately
import ThemeToggle from './features/dealer/components/ui/ThemeToggle';

import { 
  EvmDashboard, 
  DealerList, 
  ReportDashboard 
} from './features/admin';

import { 
  Landing,
  Vehicles,
  ModelS,
  Model3,
  Charging,
  Shop,
  Information,
  Discover
} from './features/public';

// Pages from public features
import LoadingDemo from './features/public/pages/LoadingDemo';
import RegisterSuccess from './features/public/pages/RegisterSuccess';

// Auth components  
import RegisterForm from '@modules/auth/RegisterForm';

// Enhanced components with loading HOCs
const LandingWithLoading = withRouteLoading(Landing, {
  loadingMessage: 'Chào mừng đến với Tesla EVM...',
  loadingVariant: 'tesla',
  showLogo: true,
  autoLoadOnMount: true,
  loadingDuration: 1200
});

const CustomerDashboardWithLoading = withDashboardLoading(CustomerDashboard, {
  loadingMessage: 'Đang khởi tạo Customer Dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu khách hàng...',
  loadingVariant: 'dashboard',
  showLogo: true,
  enableSkeleton: true
});

const DealerDashboardWithLoading = withDashboardLoading(DealerDashboard, {
  loadingMessage: 'Đang khởi tạo Dealer Dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu đại lý...',
  loadingVariant: 'dashboard',
  showLogo: true,
  enableSkeleton: true
});

const EvmDashboardWithLoading = withDashboardLoading(EvmDashboard, {
  loadingMessage: 'Đang khởi tạo Admin Dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu hệ thống...',
  loadingVariant: 'dashboard',
  showLogo: true,
  enableSkeleton: true
});

const VehiclesWithLoading = withFullPageLoading(Vehicles, {
  loadingMessage: 'Đang tải danh sách xe Tesla...',
  loadingVariant: 'tesla',
  showLogo: true,
  minimumLoadingTime: 800,
  enableProgressBar: true
});

const ModelSWithLoading = withFullPageLoading(ModelS, {
  loadingMessage: 'Đang tải thông tin Tesla Model S...',
  loadingVariant: 'tesla',
  showLogo: true,
  minimumLoadingTime: 600
});

const Model3WithLoading = withFullPageLoading(Model3, {
  loadingMessage: 'Đang tải thông tin Tesla Model 3...',
  loadingVariant: 'tesla',
  showLogo: true,
  minimumLoadingTime: 600
});

// Dealer Layout with Theme Support
const DealerLayout = ({children}) => {
  return (
    <ThemeProvider>
      <AppLayout>
        {children}
      </AppLayout>
      <ThemeToggle />
    </ThemeProvider>
  );
};

const AppLayout = ({children}) => {
  const currentUser = AuthService.getCurrentUser();
  
  // Check if user is logged in to determine if we should show dashboard layout or public layout
  if (currentUser && currentUser.role !== 'guest') {
    // For dashboard pages - show sidebar + navbar layout
    return (
      <div style={{minHeight: '100vh'}}>
        <Sidebar />
        <div className="main-content-with-sidebar">
          <Navbar />
          <main className="theme-main bg-black text-white transition-colors duration-300" style={{padding: '20px', minHeight: 'calc(100vh - 70px)'}}>
            {children}
          </main>
        </div>
        <style>{`
          .main-content-with-sidebar {
            margin-left: 220px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          @media (max-width: 768px) {
            .main-content-with-sidebar {
              margin-left: 0;
            }
          }
        `}</style>
      </div>
    );
  } else {
    // For public pages - simple layout with just header
    return (
      <div style={{minHeight: '100vh'}}>
        <Header />
        <main className="theme-main bg-black text-white transition-colors duration-300" style={{padding: '20px', minHeight: 'calc(100vh - 70px)'}}>
          {children}
        </main>
      </div>
    );
  }
};

// Separate layout for public pages (always uses Header)
const PublicLayout = ({children}) => {
  return (
    <div style={{minHeight: '100vh'}}>
      <Header />
      <main className="theme-main bg-black text-white transition-colors duration-300" style={{padding: '20px', minHeight: 'calc(100vh - 70px)'}}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <GlobalLoadingProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingWithLoading />} />
        <Route path="/landing" element={<LandingWithLoading />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        
        {/* Role-based Dashboard Routes */}
        <Route path="/dealer-dashboard" element={
          <DealerGuard>
            <DealerLayout>
              <DealerDashboardWithLoading isLoading={false} isDataLoading={false} />
            </DealerLayout>
          </DealerGuard>
        } />
        
        <Route path="/customer-dashboard" element={
          <CustomerGuard>
            <AppLayout>
              <CustomerDashboardWithLoading isLoading={false} isDataLoading={false} />
            </AppLayout>
          </CustomerGuard>
        } />
        
        <Route path="/evm-dashboard" element={
          <AdminGuard>
            <AppLayout>
              <EvmDashboardWithLoading isLoading={false} isDataLoading={false} />
            </AppLayout>
          </AdminGuard>
        } />

        {/* Dealer-only Routes */}
        <Route path="/catalog" element={
          <DealerGuard>
            <DealerLayout><VehicleList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/sales/orders" element={
          <DealerGuard>
            <DealerLayout><OrderList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/customers" element={
          <DealerGuard>
            <DealerLayout><CustomerList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/inventory" element={
          <DealerGuard>
            <DealerLayout><DealerInventory /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Vehicles (UC 1.a) */}
        <Route path="/dealer/vehicles" element={
          <DealerGuard>
            <DealerLayout><DealerVehicleList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/vehicles/:vehicleId" element={
          <DealerGuard>
            <DealerLayout><VehicleDetail /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/vehicles/compare" element={
          <DealerGuard>
            <DealerLayout><CompareVehicles /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Inventory (UC 1.b.4) */}
        <Route path="/dealer/inventory" element={
          <DealerGuard>
            <DealerLayout><DealerInventory /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/inventory/:stockId" element={
          <DealerGuard>
            <DealerLayout><StockDetail /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/inventory/request" element={
          <DealerGuard>
            <DealerLayout><RequestStock /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Customers (UC 1.c.1) */}
        <Route path="/dealer/customers" element={
          <DealerGuard>
            <DealerLayout><DealerCustomerList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/new" element={
          <DealerGuard>
            <DealerLayout><CustomerForm /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/:customerId" element={
          <DealerGuard>
            <DealerLayout><CustomerDetail /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/:customerId/edit" element={
          <DealerGuard>
            <DealerLayout><CustomerForm /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Test Drive (UC 1.c.2) */}
        <Route path="/dealer/test-drives" element={
          <DealerGuard>
            <DealerLayout><TestDriveList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/test-drives/new" element={
          <DealerGuard>
            <DealerLayout><TestDriveForm /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/test-drives/calendar" element={
          <DealerGuard>
            <DealerLayout><TestDriveCalendar /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Sales (UC 1.b.1, 1.b.2, 1.b.6) */}
        <Route path="/dealer/quotations" element={
          <DealerGuard>
            <DealerLayout><QuotationList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/quotations/create" element={
          <DealerGuard>
            <DealerLayout><CreateQuotation /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/orders" element={
          <DealerGuard>
            <DealerLayout><OrderList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/orders/create" element={
          <DealerGuard>
            <DealerLayout><CreateOrder /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/payments" element={
          <DealerGuard>
            <DealerLayout><PaymentList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/payments/new" element={
          <DealerGuard>
            <DealerLayout><PaymentForm /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Purchase (UC 1.b.4) */}
        <Route path="/dealer/purchase-requests" element={
          <DealerGuard>
            <DealerLayout><PurchaseRequestList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/purchase-requests/create" element={
          <DealerGuard>
            <DealerLayout><CreatePurchaseRequest /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Reports (UC 1.d) */}
        <Route path="/dealer/reports/sales-performance" element={
          <DealerGuard>
            <DealerLayout><SalesPerformanceReport /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/reports/customer-debt" element={
          <DealerGuard>
            <DealerLayout><CustomerDebtReport /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/reports/supplier-debt" element={
          <DealerGuard>
            <DealerLayout><SupplierDebtReport /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Promotion (UC 1.b.3) */}
        <Route path="/dealer/promotions" element={
          <DealerGuard>
            <DealerLayout><PromotionList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/promotions/:promoId" element={
          <DealerGuard>
            <DealerLayout><PromotionDetail /></DealerLayout>
          </DealerGuard>
        } />

        {/* Dealer Routes - Staff Management */}
        <Route path="/dealer/staff" element={
          <DealerGuard>
            <DealerLayout><StaffList /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/staff/new" element={
          <DealerGuard>
            <DealerLayout><StaffForm /></DealerLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/staff/:staffId/edit" element={
          <DealerGuard>
            <DealerLayout><StaffForm /></DealerLayout>
          </DealerGuard>
        } />

        {/* Admin-only Routes */}
        <Route path="/reports" element={
          <AdminGuard>
            <AppLayout><ReportDashboard /></AppLayout>
          </AdminGuard>
        } />
        <Route path="/admin/dealers" element={
          <AdminGuard>
            <AppLayout><DealerList /></AppLayout>
          </AdminGuard>
        } />
        
        {/* Public Tesla website routes */}
        {/* Public Pages with Header */}
        <Route path="/vehicles" element={<PublicLayout><VehiclesWithLoading isLoading={false} /></PublicLayout>} />
        <Route path="/vehicles/model-s" element={<PublicLayout><ModelSWithLoading isLoading={false} /></PublicLayout>} />
        <Route path="/vehicles/model-3" element={<PublicLayout><Model3WithLoading isLoading={false} /></PublicLayout>} />
        <Route path="/charging" element={<PublicLayout><Charging /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
        <Route path="/information" element={<PublicLayout><Information /></PublicLayout>} />
        <Route path="/discover" element={<PublicLayout><Discover /></PublicLayout>} />
        
        {/* Demo Pages */}
        <Route path="/loading-demo" element={<PublicLayout><LoadingDemo /></PublicLayout>} />
        
        {/* Auth Pages */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        
        {/* Legacy routes - redirect to role-based */}
        <Route path="/dealer" element={
          <DealerGuard>
            <AppLayout><DealerDashboardWithLoading isLoading={false} isDataLoading={false} /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/evm" element={
          <AdminGuard>
            <AppLayout><EvmDashboardWithLoading isLoading={false} isDataLoading={false} /></AppLayout>
          </AdminGuard>
        } />
      </Routes>
      
      {/* Global Notification Container */}
      <NotificationContainer />
    </GlobalLoadingProvider>
  );
};
export default App;
