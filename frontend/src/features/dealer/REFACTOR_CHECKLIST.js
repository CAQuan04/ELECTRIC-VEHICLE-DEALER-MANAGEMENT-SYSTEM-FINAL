/**
 * REFACTORING CHECKLIST - DEALER MOCK DATA
 * 
 * ✅ = Đã refactor
 * ⏳ = Cần refactor
 * ℹ️ = Ghi chú
 * 
 * ====================================================================================
 * 
 * ✅ DealerDashboard.jsx
 *    - Import: MOCK_DASHBOARD_DATA from '../data/mockData'
 *    - useState: ✓ (dashboardData, setDashboardData)
 *    - Removed: Local MOCK_DASHBOARD_DATA constant
 * 
 * ⏳ ReportsSection.jsx
 *    - Import: MOCK_SALES_PERFORMANCE, MOCK_AR_DATA, MOCK_AP_DATA
 *    - Mock data nằm trực tiếp trong component
 * 
 * ⏳ VehicleList.jsx
 *    - Import: MOCK_VEHICLES
 *    - Mock data: const mockVehicles trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ VehicleDetail.jsx
 *    - Import: MOCK_VEHICLE_DETAIL
 *    - Mock data: const mockVehicle trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ CompareVehicles.jsx
 *    - Import: MOCK_COMPARE_VEHICLES
 *    - Mock data: const mockVehicles trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ DealerInventory.jsx
 *    - Import: MOCK_INVENTORY
 *    - Mock data: const mockInventory trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ StockDetail.jsx
 *    - Import: MOCK_STOCK_DETAIL
 *    - Mock data: const mockDetail trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ CustomerList.jsx
 *    - Import: MOCK_CUSTOMERS
 *    - Mock data: const mockCustomers trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ CustomerDetail.jsx
 *    - Import: MOCK_CUSTOMER_DETAIL
 *    - Mock data: const mockCustomer trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ TestDriveList.jsx
 *    - Import: MOCK_TEST_DRIVES
 *    - Mock data: const mockTestDrives trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ TestDriveCalendar.jsx
 *    - Import: MOCK_TEST_DRIVE_APPOINTMENTS
 *    - Mock data: const mockAppointments ngoài component
 *    - Cần kiểm tra useState
 * 
 * ⏳ TestDriveDetail.jsx
 *    - Import: MOCK_TEST_DRIVE_DETAIL
 *    - Mock data: const mockData trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ QuotationList.jsx
 *    - Import: MOCK_QUOTATIONS
 *    - Mock data: const mockQuotations trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ OrderList.jsx
 *    - Import: MOCK_ORDERS
 *    - Mock data: const mockOrders trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ PaymentList.jsx
 *    - Import: MOCK_PAYMENTS
 *    - Mock data: const mockPayments trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ PurchaseRequestList.jsx
 *    - Import: MOCK_PURCHASE_REQUESTS
 *    - Mock data: const mockRequests trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ SalesPerformanceReport.jsx
 *    - Import: MOCK_SALES_REPORT
 *    - Mock data: const mockReport trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ CustomerDebtReport.jsx
 *    - Import: MOCK_CUSTOMER_DEBT
 *    - Mock data: const mockDebt trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ SupplierDebtReport.jsx
 *    - Import: MOCK_SUPPLIER_DEBT
 *    - Mock data: const mockDebts trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ PromotionList.jsx
 *    - Import: MOCK_PROMOTIONS
 *    - Mock data: const mockPromotions trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ PromotionDetail.jsx
 *    - Import: MOCK_PROMOTION_DETAIL
 *    - Mock data: const mockPromotion trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ⏳ StaffList.jsx
 *    - Import: MOCK_STAFF
 *    - Mock data: const mockStaff trong useEffect
 *    - Cần kiểm tra useState
 * 
 * ====================================================================================
 * 
 * COMMON ISSUES TO CHECK:
 * 
 * 1. useState initialization:
 *    ❌ BAD:  const [data, setData] = useState([])  // Nếu data phức tạp
 *    ✅ GOOD: const [data, setData] = useState(null) // Hoặc initial value đúng type
 * 
 * 2. setState in useEffect:
 *    ❌ BAD:  setData(mockData)  // Nếu mockData là const trong useEffect
 *    ✅ GOOD: setData(MOCK_DATA)  // Import từ mockData.js
 * 
 * 3. Conditional rendering:
 *    ❌ BAD:  {data.map(...)}  // Crash nếu data = null
 *    ✅ GOOD: {data && data.map(...)}  // Hoặc data?.map(...)
 * 
 * 4. Loading state:
 *    ✅ GOOD: Sử dụng loading state để hiển thị skeleton/spinner
 * 
 * ====================================================================================
 * 
 * NEXT STEPS:
 * 
 * 1. Kiểm tra từng file xem có dùng useState/setState đúng cách
 * 2. Replace local mock data bằng import từ mockData.js
 * 3. Đảm bảo type safety (null check, optional chaining)
 * 4. Test từng trang sau khi refactor
 * 5. Commit từng nhóm file (vehicles, customers, sales, etc.)
 * 
 */

console.log('📋 Checklist created. Start refactoring!');
