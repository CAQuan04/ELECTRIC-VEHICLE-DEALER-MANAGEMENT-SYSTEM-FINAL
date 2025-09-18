# EVM Dealer Management (Frontend Only Prototype)

## Phạm vi hiện tại
Dự án hiện tại chỉ bao gồm phần Frontend (React + Vite). Dữ liệu được mock bằng axios interceptor trong `src/services/api.js` thay vì gọi backend thật. Bạn có thể tích hợp backend sau này (Node/.NET/Java...) bằng cách thay đổi `api.js` và thêm proxy nếu cần.

## Landing Page
Trang `/` là landing (hero slider) mô phỏng giới thiệu dòng xe, sử dụng animation easing (bezier-easing) & component animate value tùy chỉnh. Điều hướng menu dẫn tới các module bên trong.

## Chức năng prototype
### 1. Đại lý (Dealer Staff / Manager)
- Truy vấn thông tin xe: danh sách xe (mock data).
- Quản lý bán hàng: danh sách đơn hàng (mock).
- Quản lý khách hàng: danh sách khách hàng (mock).
- Tồn kho: bảng tồn kho đại lý (mock).
- Báo cáo: placeholder doanh số, tồn kho, dự báo.

### 2. Hãng xe (EVM Staff / Admin)
- Quản lý đại lý: danh sách đại lý (mock).
- Dashboard EVM: placeholder điều phối & dự báo.

## Cấu trúc thư mục
```
frontend/
  src/
    components/
      Layout/ (Navbar, Sidebar)
      Catalog/VehicleList.jsx
      Sales/OrderList.jsx
      Customers/CustomerList.jsx
      Inventory/InventoryList.jsx
      Reports/ReportDashboard.jsx
      Admin/DealerList.jsx
    pages/
      Landing.jsx / Landing.css
      DealerDashboard.jsx
      EvmDashboard.jsx
    services/api.js (mock data layer)
    App.jsx
    main.jsx
  vite.config.js
  package.json
```

## Chạy dự án (Windows cmd)
```
cd frontend
npm install
npm run dev
```
Mở trình duyệt: http://localhost:5173

## Packages chính
- react, react-router-dom
- axios (mock interceptor)
- bezier-easing (animation easing)

## Mock API
`api.js` intercepts axios requests và trả về dữ liệu in-memory cho các endpoint:
- /vehicles
- /orders
- /customers
- /inventory
- /dealers
- /reports/sales
- /reports/inventory
- /reports/forecast

## Nâng cấp tương lai (gợi ý)
1. Thêm backend thật: tạo thư mục `backend/` và triển khai REST API.
2. Thêm state management (Redux Toolkit / Zustand) khi nghiệp vụ phức tạp.
3. Thêm xác thực & phân quyền (role-based routes).
4. Tách UI thành design system (Button, Table, Card...).
5. Sử dụng TanStack Query để cache và đồng bộ dữ liệu khi có backend.
6. Viết test (Jest + React Testing Library).

## Ghi chú
Prototype nhằm minh hoạ luồng màn hình & cấu trúc. Dữ liệu hiện tại KHÔNG phải dữ liệu thật.
