import "./index.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

// Theme override CSS
import "./styles/theme-variables.css";

// Contexts
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { useAuth } from "./context/AuthContext";

// Modules
import { Sidebar, Navbar, Header } from "@modules/layout";
import { VehicleList } from "@modules/common";

// Auth Guards
import {
  AccessDenied,
  AdminGuard,
  DealerGuard,
  CustomerGuard,
  StaffGuard,
  AdminStaffGuard,
  DealerShopGuard,
} from "@modules/auth";

// Utils
import { AuthService } from "@utils";

// Loading system
import {
  GlobalLoadingProvider,
  withRouteLoading,
  withFullPageLoading,
  withDashboardLoading,
} from "./modules/loading";

// Notification system
import NotificationProvider from "@modules/common/notification/NotificationProvider";
import { NotificationContainer } from "@modules/common";

// Auth components
import RegisterForm from "@modules/auth/RegisterForm";

// Feature imports - Customer
import { CustomerDashboard, CustomerList } from "./features/customer";

// Feature imports - Dealer
import {
  DealerDashboard,
  // Vehicles
  VehicleList as DealerVehicleList,
  VehicleDetail,
  CompareVehicles,
  // Inventory
  DealerInventory,
  StockDetail,
  DistributionList,
  DistributionRequestDetail,
  // Customers
  CustomerList as DealerCustomerList,
  CustomerForm,
  CustomerForm as CreateCustomer,
  CustomerDetail,
  // Test Drive
  TestDriveList,
  TestDriveList as DealerTestDriveList,
  TestDriveForm,
  TestDriveForm as CreateTestDrive,
  TestDriveCalendar,
  TestDriveDetail,
  TestDriveCalendarDetail,
  // Sales
  QuotationList,
  QuotationList as DealerQuotationList,
  CreateQuotation,
  OrderList,
  OrderList as DealerOrderList,
  CreateOrder,
  OrderDetail,
  PaymentList,
  PaymentList as DealerPaymentList,
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
  PromotionList as DealerPromotionList,
  PromotionDetail,
  CreatePromotion,
  // Staff
  StaffList,
  StaffList as DealerStaffManagement,
  StaffForm,
  // Feedback
  FeedbackList,
  FeedbackForm,
  FeedbackDetail,
  // Theme
  ThemeProvider,
  ThemeToggle,
} from "./features/dealer";

// Feature imports - Admin
import {
  EvmDashboard,
  ReportDashboard,
  VehicleCatalogue,
  DealerList,
} from "./features/admin";
import DealerManagement from "./features/admin/pages/DealerManagement";
import SalesReport from "./features/admin/pages/SalesReport";
import UserManagement from "./features/admin/pages/UserManagement";
import DealerContractManagement from "./features/admin/pages/DealerContractManagement";

// Feature imports - Staff
import { StaffDashboard } from "./features/staff";
import { RequestStock } from "./features/staff";
import CatalogueViewer from "./features/staff/pages/CatalogueViewer";
import InventoryManagement from "./features/staff/pages/InventoryManagement";
import PricingManagement from "./features/staff/pages/PricingManagement";
import InventoryTurnoverReport from "./features/staff/pages/InventoryTurnoverReport";
import ForecastReport from './features/shared/pages/ForecastReport';
import SaleReport from "./features/staff/pages/SaleReport";

// Feature imports - Public
import {
  Landing,
  Vehicles,
  ModelS,
  Model3,
  Charging,
  Shop,
  Information,
  Discover,
} from "./features/public";

// Pages from public features
import LoadingDemo from "./features/public/pages/LoadingDemo";
import RegisterSuccess from "./features/public/pages/RegisterSuccess";

// Test components
import APITestPage from "./pages/APITestPage";

// Enhanced components with loading HOCs
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

// Dealer Layout with Theme Support (Not currently used)
const DealerLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
      <ThemeToggle />
    </ThemeProvider>
  );
};

const AppLayout = ({ children }) => {
  const { user } = useAuth(); // Sử dụng context mới
  const { isExpanded } = useSidebar(); // Lấy state từ context

  console.log("📐 AppLayout render - user:", user);

  // Check if user is logged in to determine if we should show dashboard layout or public layout
  // Backend roles: 'Admin', 'EVMStaff', 'DealerManager', 'DealerStaff', 'Customer'
  if (user) {
    // For dashboard pages - show sidebar + navbar layout
    console.log("✅ AppLayout: Hiển thị layout với sidebar");
    return (
      <div style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="main-content-with-sidebar">
          <Navbar />
          <main
            className="p-5 bg-gray-50 dark:bg-slate-900 transition-colors duration-300"
            style={{ minHeight: "calc(100vh - 70px)" }}
          >
            {children}
          </main>
        </div>
        <style>{`
          .main-content-with-sidebar {
            padding-left: ${isExpanded ? "254px" : "60px"} !important;
            margin-left: 0 !important;
            min-height: 100vh;
            width: 100vw !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
            
            /* Smooth transition khi sidebar expand/collapse */
            transition: padding-left 0.3s ease-in-out;
          }
          
          @media (max-width: 1024px) {
            .main-content-with-sidebar {
              padding-left: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Nếu không có user, chỉ render children không có sidebar
  console.log("ℹ️ AppLayout: Không có user, render children only");
  return <>{children}</>;
};

// Separate layout for public pages (always uses Header)
const PublicLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <main
        className="p-5 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <SidebarProvider>
      <GlobalLoadingProvider>
        <NotificationProvider>
          <ThemeProvider>
            <Routes>
              {/* Redirect root to landing */}
              <Route path="/" element={<LandingWithLoading />} />

              {/* Public Routes with PublicLayout */}
              <Route
                path="/landing"
                element={
                  <PublicLayout>
                    <LandingWithLoading />
                  </PublicLayout>
                }
              />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* API Test Route */}
              <Route path="/api-test" element={<APITestPage />} />

              {/* Protected Routes with AppLayout */}
              {/* Admin Routes */}
              <Route
                path="/evm-dashboard"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <EvmDashboardWithLoading
                        isLoading={false}
                        isDataLoading={false}
                      />
                    </AppLayout>
                  </AdminGuard>
                }
              />

              <Route
                path="/admin/dealers"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <DealerManagement />
                    </AppLayout>
                  </AdminGuard>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <UserManagement />
                    </AppLayout>
                  </AdminGuard>
                }
              />

              <Route
                path="/admin/contracts-kpi"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <DealerContractManagement />
                    </AppLayout>
                  </AdminGuard>
                }
              />

              <Route
                path="/admin/ai-forecast"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <ForecastReport />
                    </AppLayout>
                  </AdminGuard>
                }
              />

              {/* Staff Routes (EVMStaff only) */}
              <Route
                path="/staff-dashboard"
                element={
                  <StaffGuard>
                    <AppLayout>
                      <StaffDashboardWithLoading
                        isLoading={false}
                        isDataLoading={false}
                      />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              <Route
                path="/staff/catalog"
                element={
                  <StaffGuard>
                    <AppLayout>
                      <CatalogueViewer />
                    </AppLayout>
                  </StaffGuard>
                }
              />
              <Route
                path="/staff/inventory"
                element={
                  <StaffGuard>
                    <AppLayout>
                      <InventoryManagement />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              <Route
                path="/staff/pricing"
                element={
                  <StaffGuard>
                    <AppLayout>
                      <PricingManagement />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              <Route
                path="/staff/sales-reports"
                element={
                  <StaffGuard>
                    <AppLayout>
                      <SaleReport />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              <Route
                path="/staff/reports"
                element={
                  <StaffGuard>
                    <AppLayout>
                      {/* (Path này khớp với "Báo cáo tồn kho" trong Sidebar) */}
                      <InventoryTurnoverReport />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              <Route
                path="/staff/ai-forecast"
                element={
                  <StaffGuard>
                    <AppLayout>
                      {/* (Tái sử dụng component ForecastReport của Admin) */}
                      <ForecastReport />
                    </AppLayout>
                  </StaffGuard>
                }
              />

              {/* Shared Routes (Admin & EVMStaff) */}
              <Route
                path="/admin/reports"
                element={
                  <AdminStaffGuard>
                    <AppLayout>
                      <SalesReport />
                    </AppLayout>
                  </AdminStaffGuard>
                }
              />

              <Route
                path="/admin/catalog"
                element={
                  <AdminStaffGuard>
                    <AppLayout>
                      <VehicleCatalogue />
                    </AppLayout>
                  </AdminStaffGuard>
                }
              />

              {/* Dealer Dashboard - với dealerId trong URL */}
              <Route
                path="/:dealerId/dealer-dashboard"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerDashboardWithLoading
                          isLoading={false}
                          isDataLoading={false}
                        />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Vehicles */}
              <Route
                path="/:dealerId/dealer/vehicles"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerVehicleList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/vehicles/:vehicleId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <VehicleDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/vehicles/compare"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CompareVehicles />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Inventory */}
              <Route
                path="/:dealerId/dealer/inventory"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerInventory />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/:stockId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <StockDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/distributions"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DistributionList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/distributions/:requestId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DistributionRequestDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/request"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <RequestStock />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Customers */}
              <Route
                path="/:dealerId/dealer/customers"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerCustomerList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/customers/new"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateCustomer />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Test Drives */}
              <Route
                path="/:dealerId/dealer/test-drives"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerTestDriveList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/new"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateTestDrive />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/calendar"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveCalendar />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/:id"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Orders */}
              <Route
                path="/:dealerId/dealer/orders"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerOrderList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/orders/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateOrder />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Quotations */}
              <Route
                path="/:dealerId/dealer/quotations"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerQuotationList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/quotations/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateQuotation />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Payments */}
              <Route
                path="/:dealerId/dealer/payments"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerPaymentList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Reports */}
              <Route
                path="/:dealerId/dealer/reports/sales-performance"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <SalesPerformanceReport />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Promotions */}
              <Route
                path="/:dealerId/dealer/promotions"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerPromotionList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes with dealerId - Staff */}
              <Route
                path="/:dealerId/dealer/staff"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerStaffManagement />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Fallback route cho dealer-dashboard không có dealerId */}
              <Route
                path="/dealer-dashboard"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerDashboardWithLoading
                          isLoading={false}
                          isDataLoading={false}
                        />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Customer Dashboard */}
              <Route
                path="/customer-dashboard"
                element={
                  <CustomerGuard>
                    <AppLayout>
                      <CustomerDashboardWithLoading
                        isLoading={false}
                        isDataLoading={false}
                      />
                    </AppLayout>
                  </CustomerGuard>
                }
              />

              {/* Dealer Routes - Vehicles */}
              <Route
                path="/:dealerId/dealer/vehicles"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerVehicleList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/dealer/vehicles/:vehicleId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <VehicleDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/vehicles/compare"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CompareVehicles />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Inventory */}
              <Route
                path="/:dealerId/dealer/inventory"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerInventory />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/:stockId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <StockDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/distributions"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DistributionList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/distributions/:requestId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DistributionRequestDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/inventory/request"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <RequestStock />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Customers */}
              <Route
                path="/:dealerId/dealer/customers"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <DealerCustomerList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/customers/new"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CustomerForm />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/customers/:customerId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CustomerDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/customers/:customerId/edit"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CustomerForm />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Test Drive */}
              <Route
                path="/:dealerId/dealer/test-drives"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/new"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveForm />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/calendar"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveCalendar />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/test-drives/:id"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <TestDriveDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Sales */}
              <Route
                path="/:dealerId/dealer/quotations"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <QuotationList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/quotations/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateQuotation />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/orders"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <OrderList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/orders/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreateOrder />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/orders/:id"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <OrderDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/payments"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <PaymentList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/payments/new"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <PaymentForm />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Purchase */}
              <Route
                path="/:dealerId/dealer/purchase-requests"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <PurchaseRequestList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/purchase-requests/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreatePurchaseRequest />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Reports */}
              <Route
                path="/:dealerId/dealer/reports/sales-performance"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <SalesPerformanceReport />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/reports/customer-debt"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CustomerDebtReport />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/reports/supplier-debt"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <SupplierDebtReport />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />
              {/* Dealer Routes - Promotions */}
              <Route
                path="/:dealerId/dealer/promotions"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <PromotionList />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* 🟢 [THÊM MỚI] Route tạo khuyến mãi */}
              <Route
                path="/:dealerId/dealer/promotions/create"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreatePromotion />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* 🟢 [THÊM MỚI] Route chỉnh sửa khuyến mãi */}
              <Route
                path="/:dealerId/dealer/promotions/edit/:promoId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <CreatePromotion />
                        {/* Lưu ý: CreatePromotion cần được sửa để hỗ trợ cả mode Edit nếu muốn */}
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              <Route
                path="/:dealerId/dealer/promotions/:promoId"
                element={
                  <DealerGuard>
                    <DealerShopGuard>
                      <AppLayout>
                        <PromotionDetail />
                      </AppLayout>
                    </DealerShopGuard>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Staff Management */}
              <Route
                path="/:dealerId/dealer/staff"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <StaffList />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/staff/new"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <StaffForm />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/staff/:staffId/edit"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <StaffForm />
                    </AppLayout>
                  </DealerGuard>
                }
              />

              {/* Dealer Routes - Feedback */}
              <Route
                path="/:dealerId/dealer/feedback"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <FeedbackList />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/feedback/create"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <FeedbackForm />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/feedback/edit/:feedbackId"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <FeedbackForm />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/:dealerId/dealer/feedback/:feedbackId"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <FeedbackDetail />
                    </AppLayout>
                  </DealerGuard>
                }
              />

              {/* Public Pages */}
              <Route
                path="/vehicles"
                element={
                  <PublicLayout>
                    <VehiclesWithLoading isLoading={false} />
                  </PublicLayout>
                }
              />
              <Route
                path="/vehicles/model-s"
                element={
                  <PublicLayout>
                    <ModelSWithLoading isLoading={false} />
                  </PublicLayout>
                }
              />
              <Route
                path="/vehicles/model-3"
                element={
                  <PublicLayout>
                    <Model3WithLoading isLoading={false} />
                  </PublicLayout>
                }
              />
              <Route
                path="/charging"
                element={
                  <PublicLayout>
                    <Charging />
                  </PublicLayout>
                }
              />
              <Route
                path="/shop"
                element={
                  <PublicLayout>
                    <Shop />
                  </PublicLayout>
                }
              />
              <Route
                path="/information"
                element={
                  <PublicLayout>
                    <Information />
                  </PublicLayout>
                }
              />
              <Route
                path="/discover"
                element={
                  <PublicLayout>
                    <Discover />
                  </PublicLayout>
                }
              />
              <Route
                path="/loading-demo"
                element={
                  <PublicLayout>
                    <LoadingDemo />
                  </PublicLayout>
                }
              />

              {/* Auth Pages */}
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/register/success" element={<RegisterSuccess />} />

              {/* Legacy routes */}
              <Route
                path="/dealer"
                element={
                  <DealerGuard>
                    <AppLayout>
                      <DealerDashboardWithLoading
                        isLoading={false}
                        isDataLoading={false}
                      />
                    </AppLayout>
                  </DealerGuard>
                }
              />
              <Route
                path="/evm"
                element={
                  <AdminGuard>
                    <AppLayout>
                      <EvmDashboardWithLoading
                        isLoading={false}
                        isDataLoading={false}
                      />
                    </AppLayout>
                  </AdminGuard>
                }
              />
            </Routes>
            <ThemeToggle />
            <NotificationContainer />
          </ThemeProvider>
        </NotificationProvider>
      </GlobalLoadingProvider>
    </SidebarProvider>
  );
};

export default App;
