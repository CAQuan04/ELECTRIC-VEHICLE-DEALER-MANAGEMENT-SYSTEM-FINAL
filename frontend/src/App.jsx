import './index.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Theme override CSS
import './styles/theme-variables.css';

// Modules
import {
  Sidebar,
  Navbar,
  Header
} from '@modules/layout';

import {
  DealerGuard,
  DealerShopGuard,
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
  TestDriveDetail,
  TestDriveCalendarDetail,
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
  ThemeProvider,
  ThemeToggle
} from './features/dealer';

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

import {StaffDashboard} from './features/staff'
import { CatalogueManager } from './features/admin'

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

const StaffDashboardWithLoading = withDashboardLoading(StaffDashboard, {
  loadingMessage: 'Đang khởi tạo Staff Dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu nhân viên...',
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
// (Lưu ý: DealerLayout này đang không được sử dụng ở bất kỳ đâu trong file App.jsx)
const DealerLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <AppLayout>
        {children}
      </AppLayout>
      <ThemeToggle />
    </ThemeProvider>
  );
};

const AppLayout = ({ children }) => {
  const currentUser = AuthService.getCurrentUser();

  // Check if user is logged in to determine if we should show dashboard layout or public layout
  if (currentUser && currentUser.role !== 'guest') {
    // For dashboard pages - show sidebar + navbar layout
    return (
      <div style={{ minHeight: '100vh' }}>
        <Sidebar />
        <div className="main-content-with-sidebar">
          <Navbar />
          <main className="p-5 bg-gray-50 dark:bg-slate-900 transition-colors duration-300" style={{ minHeight: 'calc(100vh - 70px)' }}>
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
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <main className="p-5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300" style={{ minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </main>
      </div>
    );
  }
};

// Separate layout for public pages (always uses Header)
const PublicLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <main className="p-5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300" style={{ minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <GlobalLoadingProvider>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingWithLoading />} />
          <Route path="/landing" element={<LandingWithLoading />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Role-based Dashboard Routes */}
          <Route path="/dealer-dashboard" element={
            <DealerGuard>
              <DealerShopGuard>
                <AppLayout>
                  <DealerDashboardWithLoading isLoading={false} isDataLoading={false} />
                </AppLayout>
              </DealerShopGuard>
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

          <Route path="/staff-dashboard" element={
            <AdminGuard>
              <AppLayout>
                <StaffDashboardWithLoading isLoading={false} isDataLoading={false} />
              </AppLayout>
            </AdminGuard>
          } />

        {/* Dealer-only Routes - Protected by DealerShopGuard */}
        <Route path="/catalog" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><VehicleList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/sales/orders" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><OrderList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/customers" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CustomerList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/inventory" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><DealerInventory /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Vehicles (UC 1.a) */}
        <Route path="/dealer/vehicles" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><DealerVehicleList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/vehicles/:vehicleId" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><VehicleDetail /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/vehicles/compare" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CompareVehicles /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Inventory (UC 1.b.4) */}
        <Route path="/dealer/inventory" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><DealerInventory /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/inventory/:stockId" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><StockDetail /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/inventory/request" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><RequestStock /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Customers (UC 1.c.1) */}
        <Route path="/dealer/customers" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><DealerCustomerList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/new" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CustomerForm /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/:customerId" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CustomerDetail /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/customers/:customerId/edit" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CustomerForm /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Test Drive (UC 1.c.2) */}
        <Route path="/dealer/test-drives" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><TestDriveList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/test-drives/new" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><TestDriveForm /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/test-drives/calendar" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><TestDriveCalendar /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/test-drives/:id" element={
          <DealerGuard><DealerShopGuard>
            <AppLayout><TestDriveDetail /></AppLayout>
          </DealerShopGuard></DealerGuard>
        } />
        {/* Dealer Routes - Sales (UC 1.b.1, 1.b.2, 1.b.6) */}
        <Route path="/dealer/quotations" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><QuotationList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/quotations/create" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CreateQuotation /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
<<<<<<< Updated upstream
=======
        <Route path="/dealer/quotations/edit/:quotationId" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CreateQuotation /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
>>>>>>> Stashed changes
        <Route path="/dealer/orders" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><OrderList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/orders/create" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CreateOrder /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/payments" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><PaymentList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/payments/new" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><PaymentForm /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Purchase (UC 1.b.4) */}
        <Route path="/dealer/purchase-requests" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><PurchaseRequestList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/purchase-requests/create" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CreatePurchaseRequest /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Reports (UC 1.d) */}
        <Route path="/dealer/reports/sales-performance" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><SalesPerformanceReport /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/reports/customer-debt" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><CustomerDebtReport /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/reports/supplier-debt" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><SupplierDebtReport /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Promotion (UC 1.b.3) */}
        <Route path="/dealer/promotions" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><PromotionList /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />
        <Route path="/dealer/promotions/:promoId" element={
          <DealerGuard>
            <DealerShopGuard>
              <AppLayout><PromotionDetail /></AppLayout>
            </DealerShopGuard>
          </DealerGuard>
        } />

        {/* Dealer Routes - Staff Management */}
        <Route path="/dealer/staff" element={
          <DealerGuard>
            <AppLayout><StaffList /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/staff/new" element={
          <DealerGuard>
            <AppLayout><StaffForm /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/dealer/staff/:staffId/edit" element={
          <DealerGuard>
            <AppLayout><StaffForm /></AppLayout>
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
        <Route path="/admin/catalog" element={
          <AdminGuard>
            <AppLayout><CatalogueManager /></AppLayout>
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
      <ThemeToggle />
      {/* Global Notification Container */}
      <NotificationContainer />
      </ThemeProvider>
    </GlobalLoadingProvider>
  );
};
export default App;