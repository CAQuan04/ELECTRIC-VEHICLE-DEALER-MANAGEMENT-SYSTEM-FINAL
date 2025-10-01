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
  AccessDenied,
  AuthService,
  VehicleList
} from './shared';

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
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      
      {/* Role-based Dashboard Routes */}
      <Route path="/dealer-dashboard" element={
        <DealerGuard>
          <AppLayout>
            <DealerDashboard />
          </AppLayout>
        </DealerGuard>
      } />
      
      <Route path="/customer-dashboard" element={
        <CustomerGuard>
          <AppLayout>
            <CustomerDashboard />
          </AppLayout>
        </CustomerGuard>
      } />
      
      <Route path="/evm-dashboard" element={
        <AdminGuard>
          <AppLayout>
            <EvmDashboard />
          </AppLayout>
        </AdminGuard>
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
      <Route path="/vehicles" element={<PublicLayout><Vehicles /></PublicLayout>} />
      <Route path="/vehicles/model-s" element={<PublicLayout><ModelS /></PublicLayout>} />
      <Route path="/vehicles/model-3" element={<PublicLayout><Model3 /></PublicLayout>} />
      <Route path="/charging" element={<PublicLayout><Charging /></PublicLayout>} />
      <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/information" element={<PublicLayout><Information /></PublicLayout>} />
      <Route path="/discover" element={<PublicLayout><Discover /></PublicLayout>} />
      
      {/* Legacy routes - redirect to role-based */}
      <Route path="/dealer" element={
        <DealerGuard>
          <AppLayout><DealerDashboard /></AppLayout>
        </DealerGuard>
      } />
      <Route path="/evm" element={
        <AdminGuard>
          <AppLayout><EvmDashboard /></AppLayout>
        </AdminGuard>
      } />
    </Routes>
    
    {/* Global Notification Container */}
    <NotificationContainer />
    </>
  );
};
export default App;
