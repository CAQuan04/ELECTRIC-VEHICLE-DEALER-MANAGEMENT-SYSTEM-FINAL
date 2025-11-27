/**
 * Dealer Feature Module
 * Centralized exports for dealer functionality
 */

// Import unified dealer theme styles
//import './styles/dealer-theme.css';

// ============================================
// PAGES
// ============================================

// Dashboard
export { default as DealerDashboard } from './pages/DealerDashboard.jsx';

// Vehicles Management
export { default as VehicleList } from './pages/Vehicles/VehicleList';
export { default as VehicleDetail } from './pages/Vehicles/VehicleDetail';
export { default as CompareVehicles } from './pages/Vehicles/CompareVehicles';

// Inventory Management
export { default as DealerInventory } from './pages/Inventory/DealerInventory';
export { default as StockDetail } from './pages/Inventory/StockDetail';
export { default as DistributionList } from './pages/Inventory/DistributionList';
export { default as DistributionRequestDetail } from './pages/Inventory/DistributionRequestDetail';
export { default as IncomingShipments } from './pages/Inventory/IncomingShipments';

// Customer Management
export { default as CustomerList } from './pages/Customers/CustomerList';
export { default as CustomerForm } from './pages/Customers/CustomerForm';
export { default as CustomerDetail } from './pages/Customers/CustomerDetail';

// Test Drive Management
export { default as TestDriveList } from './pages/TestDrive/TestDriveList';
export { default as TestDriveForm } from './pages/TestDrive/TestDriveForm';
export { default as TestDriveCalendar } from './pages/TestDrive/TestDriveCalendar';
export { default as TestDriveCalendarDetail } from './pages/TestDrive/TestDriveCalendarDetail';
export { default as TestDriveDetail } from './pages/TestDrive/TestDriveDetail';
// Sales Management
export { default as QuotationList } from './pages/Sales/QuotationList';
export { default as CreateQuotation } from './pages/Sales/CreateQuotation';
export { default as OrderList } from './pages/Sales/OrderList';
export { default as CreateOrder } from './pages/Sales/CreateOrder';
export { default as OrderDetail } from './pages/Sales/OrderDetail';
export { default as PaymentList } from './pages/Sales/PaymentList';
export { default as PaymentForm } from './pages/Sales/PaymentForm';

// Purchase Management
export { default as PurchaseRequestList } from './pages/Purchase/PurchaseRequestList';
export { default as CreatePurchaseRequest } from './pages/Purchase/CreatePurchaseRequest';
export { default as PurchaseRequestDetail } from './pages/Purchase/PurchaseRequestDetail';


// Reports
export { default as SalesPerformanceReport } from './pages/Reports/SalesPerformanceReport';
export { default as CustomerDebtReport } from './pages/Reports/CustomerDebtReport';
export { default as SupplierDebtReport } from './pages/Reports/SupplierDebtReport';

// Promotion Management
export { default as PromotionList } from './pages/Promotion/PromotionList';
export { default as PromotionDetail } from './pages/Promotion/PromotionDetail';
export {default as CreatePromotion } from './pages/Promotion/CreatePromotion';

// Staff Management
export { default as StaffList } from './pages/StaffManagement/StaffList';
export { default as StaffForm } from './pages/StaffManagement/StaffForm';

// Feedback & Complaint Management
export { default as FeedbackList } from './pages/Feedback/FeedbackList';
export { default as FeedbackForm } from './pages/Feedback/FeedbackForm';
export { default as FeedbackDetail } from './pages/Feedback/FeedbackDetail';

// ============================================
// HOOKS
// ============================================
export { useDealerInventory } from './hooks/useDealerInventory';
export { useQuotation } from './hooks/useQuotation';
export { useTestDrive } from './hooks/useTestDrive';

// ============================================
// CONTEXT & THEME
// ============================================
export { ThemeProvider, useTheme } from './context/ThemeContext';
export { default as ThemeToggle } from './components/ui/ThemeToggle';

// ============================================
// COMPONENTS
// ============================================
// Components are organized in subdirectories:
// - components/cards/
// - components/forms/
// - components/modals/
// - components/tables/
// Import directly from component files when needed
