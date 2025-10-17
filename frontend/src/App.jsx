import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Shared components
import { 
  Sidebar, 
  Navbar, 
  Header, 
  DealerGuard, 
  CustomerGuard, 
  AdminGuard, 
  StaffGuard,
  AccessDenied,
  AuthService,
  VehicleList
} from './shared';

// Loading system
import { 
  GlobalLoadingProvider, 
  withRouteLoading,
  withFullPageLoading,
  withDashboardLoading 
} from './shared/components/LoadingHOC';

// Notification system
import NotificationContainer from './shared/components/Notification/NotificationContainer';

// Feature imports
import { 
  CustomerDashboard, 
  CustomerList 
} from './features/customer';

import { 
  DealerDashboard, 
  OrderList, 
  InventoryList 
} from './features/dealer';

import {
  StaffDashboard,
  OrderList2, 
  InventoryList2
} from './features/staff';

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

// Pages
import LoadingDemo from './pages/LoadingDemo';
import RegisterSuccess from './pages/RegisterSuccess';

// Auth components  
import RegisterForm from './components/Auth/RegisterForm';

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

const StaffDashboardWithLoading = withDashboardLoading(StaffDashboard, {
  loadingMessage: 'Đang khởi tạo Staff Dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu nhân viên...',
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
          <main style={{padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: 'calc(100vh - 70px)'}}>
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
        <main style={{padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100)', minHeight: 'calc(100vh - 70px)'}}>
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
      <main style={{padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100)', minHeight: 'calc(100vh - 70px)'}}>
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
            <AppLayout>
              <DealerDashboardWithLoading isLoading={false} isDataLoading={false} />
            </AppLayout>
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
          <StaffGuard>
            <AppLayout>
              <StaffDashboardWithLoading isLoading={false} isDataLoading={false} />
            </AppLayout>
          </StaffGuard>
        } />
        

        {/* Dealer-only Routes */}
        <Route path="/catalog" element={
          <DealerGuard>
            <AppLayout><VehicleList /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/sales/orders" element={
          <DealerGuard>
            <AppLayout><OrderList /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/customers" element={
          <DealerGuard>
            <AppLayout><CustomerList /></AppLayout>
          </DealerGuard>
        } />
        <Route path="/inventory" element={
          <DealerGuard>
            <AppLayout><InventoryList /></AppLayout>
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
