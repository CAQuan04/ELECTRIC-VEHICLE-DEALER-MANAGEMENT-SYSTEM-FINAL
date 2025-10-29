# 📁 Frontend Structure - EVM Dealer System

> **Dự án**: Electric Vehicle Management (EVM) - Hệ thống quản lý xe điện
> **Framework**: React 18.2.0 + Vite 7.1.7
> **UI Libraries**: Material-UI, Tailwind CSS 4.x
> **Routing**: React Router DOM v6

---

## 🌲 Cấu trúc thư mục tổng quan

```
frontend/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   └── vite.svg
│
├── src/                         # Source code chính
│   ├── assets/                  # Tài nguyên tĩnh (hình ảnh, icons)
│   ├── components/              # Shared components dùng chung
│   ├── context/                 # React Context (AuthContext, v.v.)
│   ├── examples/                # Code mẫu, demos
│   ├── features/                # Feature modules (Admin, Dealer, Customer, Staff)
│   ├── firebase/                # Firebase configuration
│   ├── hooks/                   # Custom React hooks
│   ├── modules/                 # UI modules (layout, loading, dashboard)
│   ├── pages/                   # Top-level pages (Login, Dashboard)
│   ├── shared/                  # Shared utilities và components
│   ├── styles/                  # Global styles, themes
│   ├── utils/                   # Utilities (API, auth, helpers)
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
│
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.cjs          # Tailwind configuration
├── postcss.config.cjs           # PostCSS configuration
└── eslint.config.js             # ESLint configuration
```

---

## 📂 Chi tiết cấu trúc từng thư mục

### 1️⃣ **`/src/assets/`** - Tài nguyên tĩnh

```
assets/
├── icons.jsx                    # Icon components
├── react.svg                    # React logo
├── tesla/                       # Tesla vehicle images
│   ├── model-3.png
│   ├── model-s.png
│   ├── model-x.png
│   ├── model-y.png
│   ├── tesla_logo.svg
│   └── ... (nhiều hình ảnh xe)
└── tinh-xa-sapnhap-main/       # Dữ liệu địa giới hành chính VN
    ├── provinces.json           # Danh sách tỉnh/thành
    ├── districts.json           # Danh sách quận/huyện
    └── wards.json               # Danh sách phường/xã
```

**Mục đích**: Lưu trữ hình ảnh, icons, dữ liệu tĩnh

---

### 2️⃣ **`/src/components/`** - Shared Components

```
components/
├── Button.jsx                   # Button component tùy chỉnh
├── Card.jsx                     # Card wrapper component
├── PageContainer.jsx            # Page layout container
├── ProtectedRoute.jsx           # Route bảo vệ theo quyền
└── Select.jsx                   # Select/Dropdown component
```

**Mục đích**: Components dùng chung trong toàn bộ ứng dụng

---

### 3️⃣ **`/src/context/`** - React Context

```
context/
└── AuthContext.jsx              # Quản lý trạng thái authentication
```

**Mục đích**: Global state management cho authentication và user info

---

### 4️⃣ **`/src/features/`** - Feature Modules ⭐

Đây là phần **QUAN TRỌNG NHẤT** - Mỗi role có module riêng:

#### 🔴 **Admin Module** - `/src/features/admin/`

```
admin/
├── components/                  # Admin-specific components
│   ├── DealerForm.jsx
│   ├── DealerList.jsx
│   ├── EditDealerDialog.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── UserForm.jsx
│   └── VehicleForm.jsx
│
├── pages/                       # Admin pages
│   ├── AdminDashboard.jsx       # Trang dashboard admin
│   ├── DealerManagement.jsx     # Quản lý dealer
│   ├── UserManagement.jsx       # Quản lý users
│   └── VehicleManagement.jsx    # Quản lý vehicles
│
├── styles/                      # Admin styles
│   └── AdminDashboard.css
│
└── index.js                     # Export admin module
```

#### 🟢 **Dealer Module** - `/src/features/dealer/` 

```
dealer/
├── components/                  # Dealer components
│   ├── Analytics/              # Biểu đồ, thống kê
│   ├── Common/                 # Components dùng chung
│   ├── Customers/              # Customer-related components
│   ├── Forms/                  # Form components
│   ├── Inventory/              # Kho hàng components
│   ├── Layout/                 # Layout cho dealer
│   ├── Orders/                 # Đơn hàng components
│   ├── Tables/                 # Bảng dữ liệu
│   ├── TestDrives/             # Lái thử components
│   └── Vehicles/               # Vehicle-related components
│
├── context/                     # Dealer contexts
│   └── DealerContext.jsx
│
├── data/                        # Mock data, constants
│   └── mockData.js
│
├── hooks/                       # Dealer custom hooks
│   ├── useAnalytics.js
│   ├── useCustomers.js
│   ├── useDashboard.js
│   ├── useInventory.js
│   ├── useOrders.js
│   ├── useTestDrives.js
│   └── useVehicles.js
│
├── pages/                       # Dealer pages
│   ├── Analytics/              # Trang phân tích
│   │   ├── AnalyticsPage.jsx
│   │   └── PerformanceReport.jsx
│   │
│   ├── Customers/              # Quản lý khách hàng
│   │   ├── CustomerDetail.jsx
│   │   └── CustomerList.jsx
│   │
│   ├── Dashboard/              # Dashboard dealer
│   │   └── DealerDashboard.jsx
│   │
│   ├── Inventory/              # Quản lý kho
│   │   ├── InventoryList.jsx
│   │   ├── RequestStock.jsx
│   │   └── StockDetail.jsx
│   │
│   ├── Orders/                 # Quản lý đơn hàng
│   │   ├── OrderDetail.jsx
│   │   └── OrderList.jsx
│   │
│   ├── Profile/                # Hồ sơ dealer
│   │   ├── DealerProfile.jsx
│   │   └── ShopSettings.jsx
│   │
│   ├── Promotions/             # Khuyến mãi
│   │   └── PromotionList.jsx
│   │
│   ├── TestDrives/             # Lịch lái thử
│   │   ├── TestDriveCalendar.jsx
│   │   ├── TestDriveDetail.jsx
│   │   └── TestDriveList.jsx
│   │
│   └── Vehicles/               # Danh mục xe
│       ├── VehicleComparison.jsx
│       ├── VehicleDetail.jsx
│       └── VehicleList.jsx
│
├── styles/                      # Dealer styles
│   ├── Analytics.css
│   ├── CustomerDetail.css
│   ├── DealerDashboard.css
│   ├── Inventory.css
│   ├── OrderDetail.css
│   ├── TestDriveCalendar.css
│   └── VehicleList.css
│
├── index.js                     # Export dealer module
├── CODE_QUALITY_REPORT.md       # Báo cáo chất lượng code
├── REFACTORING_SUMMARY.md       # Tóm tắt refactoring
└── REFACTOR_CHECKLIST.js        # Checklist refactor
```

#### 🔵 **Customer Module** - `/src/features/customer/`

```
customer/
├── components/                  # Customer components
│   ├── BookingForm.jsx
│   ├── VehicleCard.jsx
│   └── ...
│
├── pages/                       # Customer pages
│   ├── Booking.jsx
│   ├── CustomerDashboard.jsx
│   ├── MyOrders.jsx
│   ├── VehicleCatalog.jsx
│   └── ...
│
├── styles/
└── index.js
```

#### 🟡 **Staff Module** - `/src/features/staff/`

```
staff/
├── components/
├── pages/
│   └── StaffDashboard.jsx
├── styles/
└── index.js
```

#### ⚪ **Public Module** - `/src/features/public/`

```
public/
├── components/
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   └── ContactPage.jsx
└── index.js
```

---

### 5️⃣ **`/src/firebase/`** - Firebase Configuration

```
firebase/
└── config.js                    # Firebase app configuration
```

---

### 6️⃣ **`/src/hooks/`** - Custom React Hooks

```
hooks/
├── index.js                     # Export all hooks
├── useCommon.js                 # Common hooks
└── useLoading.js                # Loading state hook
```

---

### 7️⃣ **`/src/modules/`** - UI Modules

```
modules/
├── dashboard/                   # Dashboard UI components
│   ├── ActionButton.jsx
│   ├── ActivityList.jsx
│   ├── DashboardCard.jsx
│   ├── DashboardHeader.jsx
│   ├── StatsGrid.jsx
│   └── index.js
│
├── layout/                      # Layout components
│   ├── DynamicIcon.jsx
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── Header.jsx
│   ├── Header.css
│   ├── Logo.jsx
│   ├── Navbar.css
│   └── index.js
│
└── loading/                     # Loading components
    ├── GlobalLoading.css
    ├── LoadingHOC.jsx
    ├── LoadingPage.jsx
    ├── LoadingPage.css
    └── index.js
```

---

### 8️⃣ **`/src/pages/`** - Top-level Pages

```
pages/
├── Login.jsx                    # Trang đăng nhập
└── Dashboard.jsx                # Dashboard tổng quan
```

---

### 9️⃣ **`/src/shared/`** - Shared Resources

```
shared/
├── auth/                        # Auth components
│   ├── AuthComponent.jsx
│   └── RoleGuard.jsx
│
├── components/                  # Shared UI components
│   └── Header.jsx
│
├── utils/                       # Shared utilities
│   ├── auth.js
│   └── googleAuth.js
│
└── index.js
```

---

### 🔟 **`/src/styles/`** - Global Styles

```
styles/
├── Dashboard.css                # Dashboard styles
├── DashboardShared.css          # Shared dashboard styles
├── theme-override.css           # Theme overrides
└── theme-variables.css          # CSS variables
```

---

### 1️⃣1️⃣ **`/src/utils/`** - Utilities ⭐

```
utils/
├── api/                         # API layer
│   ├── client.js               # Axios client configuration
│   ├── baseApi.js              # Base API methods
│   ├── database.js             # Database operations
│   ├── index.js                # Export API
│   │
│   ├── mock/                   # Mock data
│   │   └── data.js
│   │
│   └── services/               # API Services
│       ├── admin.service.js    # Admin API calls
│       ├── customer.service.js # Customer API calls
│       ├── dealer.service.js   # Dealer API calls (old)
│       ├── dealer.api.js       # Dealer API calls (new - refactored)
│       └── index.js            # Export services
│
├── auth.js                      # Authentication utilities
├── facebookAuth.js              # Facebook auth
├── firebaseFacebookAuth.js      # Firebase Facebook auth
├── googleAuth.js                # Google auth
├── index.js                     # Export utilities
└── notifications.js             # Notification helpers
```

---

## 🛠️ Tech Stack

### Core
- **React 18.2.0** - UI library
- **Vite 7.1.7** - Build tool & dev server
- **React Router DOM 6.23** - Client-side routing

### UI & Styling
- **Material-UI (MUI) 7.3.4** - Component library
- **Tailwind CSS 4.1.13** - Utility-first CSS
- **Emotion** - CSS-in-JS
- **Lucide React** - Icons

### Data & API
- **Axios 1.13** - HTTP client
- **Recharts 3.3** - Charting library

### Animation
- **GSAP 3.13** - Animation library
- **React Transition Group 4.4** - Transition animations
- **Bezier Easing 2.1** - Easing functions

### Authentication
- **@react-oauth/google** - Google OAuth
- **Firebase** (via custom config) - Authentication & backend

---

## 🎯 Features theo Role

### 👨‍💼 **Admin**
- ✅ Quản lý dealers
- ✅ Quản lý users  
- ✅ Quản lý vehicles
- ✅ Dashboard tổng quan

### 🏪 **Dealer**
- ✅ Dashboard với thống kê
- ✅ Quản lý kho hàng (Inventory)
- ✅ Quản lý đơn hàng (Orders)
- ✅ Quản lý khách hàng (Customers)
- ✅ Lịch lái thử (Test Drives)
- ✅ Danh mục xe (Vehicles)
- ✅ Khuyến mãi (Promotions)
- ✅ Phân tích & báo cáo (Analytics)
- ✅ Hồ sơ dealer (Profile)

### 👥 **Customer**
- ✅ Xem danh mục xe
- ✅ Đặt lịch lái thử
- ✅ Quản lý đơn hàng
- ✅ Dashboard cá nhân

### 👨‍💻 **Staff**
- ✅ Dashboard nhân viên
- ⏳ Các tính năng đang phát triển

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `VehicleCard.jsx`)
- **Utilities**: camelCase (e.g., `useVehicles.js`)
- **Styles**: kebab-case (e.g., `dealer-dashboard.css`)

### Folders
- **Features**: lowercase (e.g., `dealer/`, `admin/`)
- **Components**: PascalCase (e.g., `Vehicles/`, `Orders/`)

### Code
- **Components**: PascalCase
- **Functions/Hooks**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

---

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🌐 API Structure

### Base URL
- Development: `http://localhost:5000/api`
- Production: TBD

### API Services
```javascript
// Admin APIs
import { adminService } from '@/utils/api/services/admin.service';

// Dealer APIs (NEW - Refactored)
import { dealerAPI } from '@/utils/api/services/dealer.api';

// Customer APIs
import { customerService } from '@/utils/api/services/customer.service';
```

---

## 🔐 Authentication Flow

```
1. User đăng nhập (Login.jsx)
   ↓
2. Auth qua Firebase/Google OAuth
   ↓
3. Token được lưu trong AuthContext
   ↓
4. ProtectedRoute kiểm tra auth
   ↓
5. RoleGuard kiểm tra quyền
   ↓
6. Redirect đến dashboard tương ứng
```

---

## 📊 State Management

- **Global State**: React Context (AuthContext, DealerContext)
- **Local State**: React useState, useReducer
- **Server State**: Custom hooks (useVehicles, useOrders, v.v.)

---

## 🎨 Theming

### Theme Variables
```css
/* src/styles/theme-variables.css */
--primary-color: #...
--secondary-color: #...
--background-color: #...
```

### Tailwind Config
```javascript
// tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      colors: { ... },
      spacing: { ... }
    }
  }
}
```

---

## 📚 Documentation Files

- `STRUCTURE_GUIDE.md` - Hướng dẫn cấu trúc dự án
- `CODE_QUALITY_REPORT.md` - Báo cáo chất lượng code (Dealer module)
- `REFACTORING_SUMMARY.md` - Tóm tắt quá trình refactoring
- `REFACTOR_CHECKLIST.js` - Checklist refactoring

---

## 🚀 Recent Updates

### Dealer Module Refactoring
- ✅ Refactor `dealer.api.js` - Loại bỏ code trùng lặp
- ✅ Chuẩn hóa API methods với try-catch
- ✅ Thêm JSDoc comments đầy đủ
- ✅ Tổ chức code theo sections logic

---

## 📞 Contact & Support

- **Project**: EVM - Electric Vehicle Management
- **Team**: FPT University - Kỳ 5
- **Framework**: React + Vite + Material-UI

---

**Last Updated**: October 29, 2025
**Version**: 0.1.0
