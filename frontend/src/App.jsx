// File: src/App.jsx
import "./index.css";
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Theme override CSS
import "./styles/theme-variables.css";

// --- HỆ THỐNG XÁC THỰC ---
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 

// --- CÁC MODULES ---
import { Sidebar, Navbar, Header } from "@modules/layout";
import { 
    AccessDenied, 
    AdminGuard, 
    DealerGuard, 
    CustomerGuard, 
    StaffGuard,  // Make sure this is included
    DealerShopGuard 
} from "@modules/auth";
import { GlobalLoadingProvider, withRouteLoading, withFullPageLoading, withDashboardLoading } from "./modules/loading";
import { NotificationContainer } from "@modules/common";
import RegisterForm from "@modules/auth/RegisterForm";

// --- CÁC FEATURES VÀ PAGES ---
import { CustomerDashboard } from "./features/customer";
import { DealerDashboard, VehicleList as DealerVehicleList, VehicleDetail, CompareVehicles, DealerInventory, StockDetail, RequestStock, CustomerList as DealerCustomerList, CustomerForm, CustomerDetail, TestDriveList, TestDriveForm, TestDriveCalendar, TestDriveDetail, QuotationList, CreateQuotation, OrderList, CreateOrder, PaymentList, PaymentForm, PurchaseRequestList, CreatePurchaseRequest, SalesPerformanceReport, CustomerDebtReport, SupplierDebtReport, PromotionList, PromotionDetail, StaffList, StaffForm, ThemeProvider, ThemeToggle } from "./features/dealer";
import { EvmDashboard, ReportDashboard, VehicleCatalogue, DealerList, UserManagement } from "./features/admin";
import { Landing, Vehicles, ModelS, Model3, Charging, Shop, Information, Discover } from "./features/public";
import { StaffDashboard } from "./features/staff";
import LoadingDemo from "./features/public/pages/LoadingDemo";
import RegisterSuccess from "./features/public/pages/RegisterSuccess";

// === ĐỊNH NGHĨA CÁC GUARD VÀ LAYOUTS ===

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="full-page-loader">Checking session...</div>;
    return user ? <Outlet /> : <Navigate to="/landing" replace />;
};

const AppLayout = () => (
    <div style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="main-content-with-sidebar">
            <Navbar />
            <main className="p-5 bg-gray-50 dark:bg-slate-900 transition-colors duration-300" style={{ minHeight: "calc(100vh - 70px)" }}>
                <Outlet /> 
            </main>
        </div>
        <style>{`.main-content-with-sidebar { margin-left: 220px; width: calc(100% - 220px); } @media (max-width: 768px) { .main-content-with-sidebar { margin-left: 0; width: 100%; } }`}</style>
    </div>
);

const PublicLayout = () => (
    <div style={{ minHeight: "100vh" }}>
        <Header />
        <main className="p-5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: "calc(100vh - 70px)" }}>
            <Outlet />
        </main>
    </div>
);

// ===================================================================================
// === KẾT HỢP CÁC COMPONENT LOADING (ĐÃ ĐIỀN ĐẦY ĐỦ 100%) ===
const LandingWithLoading = withRouteLoading(Landing, {
  loadingMessage: "Chào mừng đến với Tesla EVM...",
  loadingVariant: "tesla",
  showLogo: true,
  autoLoadOnMount: true,
  loadingDuration: 1200,
});

const CustomerDashboardWithLoading = withDashboardLoading(CustomerDashboard, {
  loadingMessage: "Đang khởi tạo Customer Dashboard...",
  dataLoadingMessage: "Đang tải dữ liệu khách hàng...",
  loadingVariant: "dashboard",
  showLogo: true,
  enableSkeleton: true,
});

const DealerDashboardWithLoading = withDashboardLoading(DealerDashboard, {
  loadingMessage: "Đang khởi tạo Dealer Dashboard...",
  dataLoadingMessage: "Đang tải dữ liệu đại lý...",
  loadingVariant: "dashboard",
  showLogo: true,
  enableSkeleton: true,
});

const EvmDashboardWithLoading = withDashboardLoading(EvmDashboard, {
  loadingMessage: "Đang khởi tạo Admin Dashboard...",
  dataLoadingMessage: "Đang tải dữ liệu hệ thống...",
  loadingVariant: "dashboard",
  showLogo: true,
  enableSkeleton: true,
});

const StaffDashboardWithLoading = withDashboardLoading(StaffDashboard, {
  loadingMessage: "Đang khởi tạo Staff Dashboard...",
  dataLoadingMessage: "Đang tải dữ liệu nhân viên...",
  loadingVariant: "dashboard",
  showLogo: true,
  enableSkeleton: true,
});

const VehiclesWithLoading = withFullPageLoading(Vehicles, {
  loadingMessage: "Đang tải danh sách xe Tesla...",
  loadingVariant: "tesla",
  showLogo: true,
  minimumLoadingTime: 800,
  enableProgressBar: true,
});

const ModelSWithLoading = withFullPageLoading(ModelS, {
  loadingMessage: "Đang tải thông tin Tesla Model S...",
  loadingVariant: "tesla",
  showLogo: true,
  minimumLoadingTime: 600,
});

const Model3WithLoading = withFullPageLoading(Model3, {
  loadingMessage: "Đang tải thông tin Tesla Model 3...",
  loadingVariant: "tesla",
  showLogo: true,
  minimumLoadingTime: 600,
});
// ===================================================================================


// === COMPONENT APP CHÍNH ===
const App = () => {
  return (
    <AuthProvider>
      <GlobalLoadingProvider>
        <ThemeProvider>
          <Routes>
            {/* --- CÁC ROUTE CÔNG KHAI --- */}
            <Route element={<PublicLayout />}>
              <Route path="/landing" element={<LandingWithLoading />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/register/success" element={<RegisterSuccess />} />
              <Route path="/vehicles" element={<VehiclesWithLoading isLoading={false} />} />
              <Route path="/vehicles/model-s" element={<ModelSWithLoading isLoading={false} />} />
              <Route path="/vehicles/model-3" element={<Model3WithLoading isLoading={false} />} />
              <Route path="/charging" element={<Charging />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/information" element={<Information />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/loading-demo" element={<LoadingDemo />} />
            </Route>
            <Route path="/" element={<Navigate to="/landing" replace />} />

            {/* --- CÁC ROUTE ĐƯỢC BẢO VỆ --- */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    
                    {/* --- ADMIN ONLY ROUTES --- */}
                    <Route element={<AdminGuard />}>
                        <Route path="evm-dashboard" element={<EvmDashboardWithLoading isLoading={false} isDataLoading={false} />} />
                        <Route path="admin/dealers" element={<DealerList />} />
                        <Route path="admin/users" element={<UserManagement />} />
                    </Route>

                    {/* --- STAFF ROUTES (Admin & EVMStaff) --- */}
                    <Route element={<StaffGuard />}>
                        <Route path="staff-dashboard" element={<StaffDashboardWithLoading isLoading={false} isDataLoading={false} />} />
                        <Route path="reports" element={<ReportDashboard />} />
                        <Route path="admin/catalog" element={<VehicleCatalogue />} />
                        <Route path="admin/inventory" element={<div>Trang Quản lý Tổng Kho</div>} />
                    </Route>

                    <Route element={<DealerGuard />}>
                        <Route path="dealer-dashboard" element={<DealerShopGuard><DealerDashboardWithLoading isLoading={false} isDataLoading={false} /></DealerShopGuard>} />
                        <Route path="dealer/vehicles" element={<DealerShopGuard><DealerVehicleList /></DealerShopGuard>} />
                        <Route path="dealer/vehicles/:vehicleId" element={<DealerShopGuard><VehicleDetail /></DealerShopGuard>} />
                        <Route path="dealer/vehicles/compare" element={<DealerShopGuard><CompareVehicles /></DealerShopGuard>} />
                        <Route path="dealer/inventory" element={<DealerShopGuard><DealerInventory /></DealerShopGuard>} />
                        <Route path="dealer/inventory/:stockId" element={<DealerShopGuard><StockDetail /></DealerShopGuard>} />
                        <Route path="dealer/inventory/request" element={<DealerShopGuard><RequestStock /></DealerShopGuard>} />
                        <Route path="dealer/customers" element={<DealerShopGuard><DealerCustomerList /></DealerShopGuard>} />
                        <Route path="dealer/customers/new" element={<DealerShopGuard><CustomerForm /></DealerShopGuard>} />
                        <Route path="dealer/customers/:customerId" element={<DealerShopGuard><CustomerDetail /></DealerShopGuard>} />
                        <Route path="dealer/customers/:customerId/edit" element={<DealerShopGuard><CustomerForm /></DealerShopGuard>} />
                        <Route path="dealer/test-drives" element={<DealerShopGuard><TestDriveList /></DealerShopGuard>} />
                        <Route path="dealer/test-drives/new" element={<DealerShopGuard><TestDriveForm /></DealerShopGuard>} />
                        <Route path="dealer/test-drives/calendar" element={<DealerShopGuard><TestDriveCalendar /></DealerShopGuard>} />
                        <Route path="dealer/test-drives/:id" element={<DealerShopGuard><TestDriveDetail /></DealerShopGuard>} />
                        <Route path="dealer/quotations" element={<DealerShopGuard><QuotationList /></DealerShopGuard>} />
                        <Route path="dealer/quotations/create" element={<DealerShopGuard><CreateQuotation /></DealerShopGuard>} />
                        <Route path="dealer/orders" element={<DealerShopGuard><OrderList /></DealerShopGuard>} />
                        <Route path="dealer/orders/create" element={<DealerShopGuard><CreateOrder /></DealerShopGuard>} />
                        <Route path="dealer/payments" element={<DealerShopGuard><PaymentList /></DealerShopGuard>} />
                        <Route path="dealer/payments/new" element={<DealerShopGuard><PaymentForm /></DealerShopGuard>} />
                        <Route path="dealer/purchase-requests" element={<DealerShopGuard><PurchaseRequestList /></DealerShopGuard>} />
                        <Route path="dealer/purchase-requests/create" element={<DealerShopGuard><CreatePurchaseRequest /></DealerShopGuard>} />
                        <Route path="dealer/reports/sales-performance" element={<DealerShopGuard><SalesPerformanceReport /></DealerShopGuard>} />
                        <Route path="dealer/reports/customer-debt" element={<DealerShopGuard><CustomerDebtReport /></DealerShopGuard>} />
                        <Route path="dealer/reports/supplier-debt" element={<DealerShopGuard><SupplierDebtReport /></DealerShopGuard>} />
                        <Route path="dealer/promotions" element={<DealerShopGuard><PromotionList /></DealerShopGuard>} />
                        <Route path="dealer/promotions/:promoId" element={<DealerShopGuard><PromotionDetail /></DealerShopGuard>} />
                        <Route path="dealer/staff" element={<StaffList />} />
                        <Route path="dealer/staff/new" element={<StaffForm />} />
                        <Route path="dealer/staff/:staffId/edit" element={<StaffForm />} />
                    </Route>

                    <Route element={<CustomerGuard />}>
                        <Route path="customer-dashboard" element={<CustomerDashboardWithLoading isLoading={false} isDataLoading={false} />} />
                    </Route>

                </Route>
            </Route>

            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
          <ThemeToggle />
          <NotificationContainer />
        </ThemeProvider>
      </GlobalLoadingProvider>
    </AuthProvider>
  );
};

export default App;