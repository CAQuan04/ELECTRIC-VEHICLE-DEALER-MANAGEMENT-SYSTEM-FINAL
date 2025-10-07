import React, { useState, useEffect } from 'react';
import { 
  withFullPageLoading, 
  withDashboardLoading,
  withRouteLoading,
  useGlobalLoading,
  usePageLoading 
} from '../shared/components/LoadingHOC';
import '../shared/components/GlobalLoading.css';

// Example: Dashboard với full page loading
const DashboardComponent = ({ startLoading, stopLoading }) => {
  const [data, setData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const loadDashboardData = async () => {
    setIsDataLoading(true);
    startLoading('Đang tải dữ liệu dashboard...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({ message: 'Dashboard loaded successfully!' });
    } finally {
      setIsDataLoading(false);
      stopLoading();
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Tesla EVM Dashboard</h1>
      {data ? (
        <div>
          <p>{data.message}</p>
          <button onClick={loadDashboardData}>Reload Data</button>
        </div>
      ) : (
        <button onClick={loadDashboardData}>Load Dashboard</button>
      )}
    </div>
  );
};

// Wrap với route loading
const DashboardWithRouteLoading = withRouteLoading(DashboardComponent, {
  loadingMessage: 'Đang khởi tạo Tesla Dashboard...',
  loadingVariant: 'tesla',
  showLogo: true,
  autoLoadOnMount: true,
  loadingDuration: 1500
});

// Example: Page component với full page loading
const HomePage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    // Simulate page initialization
    const loadPage = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setPageData({ title: 'Welcome to Tesla EVM' });
      setIsPageLoading(false);
    };
    
    loadPage();
  }, []);

  return (
    <div className="home-page">
      <h1>{pageData?.title || 'Loading...'}</h1>
      <p>Tesla Electric Vehicle Management System</p>
    </div>
  );
};

// Wrap với full page loading
const HomePageWithLoading = withFullPageLoading(HomePage, {
  loadingMessage: 'Chào mừng đến với Tesla EVM...',
  loadingVariant: 'tesla',
  showLogo: true,
  minimumLoadingTime: 1000,
  enableProgressBar: true,
  enableFadeTransition: true
});

// Example: Component sử dụng global loading hook
const DataComponent = () => {
  const { setGlobalLoading } = useGlobalLoading();
  const { startLoading, stopLoading } = usePageLoading();
  const [data, setData] = useState([]);

  const loadData = async () => {
    const loadingId = startLoading('Đang tải dữ liệu...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData(['Item 1', 'Item 2', 'Item 3']);
    } finally {
      stopLoading();
    }
  };

  const loadGlobalData = async () => {
    setGlobalLoading(true, 'Đang đồng bộ dữ liệu toàn cục...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Global data loaded!');
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="data-component">
      <h2>Data Management</h2>
      <button onClick={loadData}>Load Page Data</button>
      <button onClick={loadGlobalData}>Load Global Data</button>
      
      {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example: Admin Dashboard với dashboard loading
const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Initial dashboard load
    const initDashboard = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData({
        users: 150,
        vehicles: 45,
        dealers: 12
      });
      setIsLoading(false);
    };

    initDashboard();
  }, []);

  const refreshData = async () => {
    setIsDataLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsDataLoading(false);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {dashboardData && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Users</h3>
            <p>{dashboardData.users}</p>
          </div>
          <div className="stat-card">
            <h3>Vehicles</h3>
            <p>{dashboardData.vehicles}</p>
          </div>
          <div className="stat-card">
            <h3>Dealers</h3>
            <p>{dashboardData.dealers}</p>
          </div>
        </div>
      )}
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

// Wrap với dashboard loading
const AdminDashboardWithLoading = withDashboardLoading(AdminDashboard, {
  loadingMessage: 'Đang khởi tạo Admin Dashboard...',
  dataLoadingMessage: 'Đang cập nhật dữ liệu...',
  loadingVariant: 'dashboard',
  showLogo: true,
  enableSkeleton: true
});

// Main App example showing different loading patterns
const LoadingExampleApp = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePageWithLoading isLoading={false} />;
      case 'dashboard':
        return <DashboardWithRouteLoading />;
      case 'admin':
        return <AdminDashboardWithLoading isLoading={false} isDataLoading={false} />;
      case 'data':
        return <DataComponent />;
      default:
        return <HomePageWithLoading isLoading={false} />;
    }
  };

  return (
    <div className="app">
      <nav className="navigation">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('admin')}>Admin</button>
        <button onClick={() => setCurrentPage('data')}>Data</button>
      </nav>
      
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default LoadingExampleApp;

// Usage examples:

// 1. Wrap entire app with global loading
// export default withGlobalLoading(LoadingExampleApp);

// 2. Use in React Router
// <Route path="/" element={<HomePageWithLoading />} />
// <Route path="/dashboard" element={<DashboardWithRouteLoading />} />

// 3. Manual loading control
// const MyComponent = () => {
//   const { startLoading, stopLoading } = usePageLoading();
//   
//   const handleAsyncAction = async () => {
//     startLoading('Processing...');
//     try {
//       await someAsyncOperation();
//     } finally {
//       stopLoading();
//     }
//   };
// };

// 4. Global loading control
// const MyComponent = () => {
//   const { setGlobalLoading } = useGlobalLoading();
//   
//   const handleGlobalAction = async () => {
//     setGlobalLoading(true, 'Syncing data...');
//     try {
//       await globalSyncOperation();
//     } finally {
//       setGlobalLoading(false);
//     }
//   };
// };