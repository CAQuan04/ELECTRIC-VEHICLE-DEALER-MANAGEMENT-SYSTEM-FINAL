# Cấu trúc thư mục mới - EVM Frontend

## 📁 Tổng quan

Cấu trúc thư mục đã được tổ chức lại theo mô hình **Module-based Architecture** để dễ dàng quản lý và mở rộng.

## 🗂️ Cấu trúc chi tiết

```
src/
├── modules/              # Core modules - nhóm các components theo chức năng
│   ├── auth/            # Authentication & Authorization
│   │   ├── AuthComponent.jsx
│   │   ├── RoleGuard.jsx
│   │   ├── MultiStepRegister.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── Steps/       # Registration steps
│   │   └── index.js     # Barrel export
│   │
│   ├── layout/          # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DynamicIcon.jsx
│   │   └── index.js
│   │
│   ├── dashboard/       # Dashboard components
│   │   ├── DashboardCard.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── ActivityList.jsx
│   │   ├── ActionButton.jsx
│   │   └── index.js
│   │
│   ├── loading/         # Loading states & HOCs
│   │   ├── LoadingHOC.jsx
│   │   ├── LoadingPage.jsx
│   │   ├── GlobalLoading.css
│   │   └── index.js
│   │
│   └── common/          # Shared UI components
│       ├── ui/
│       ├── catalog/
│       ├── notification/
│       └── index.js
│
├── features/            # Feature modules (domain-based)
│   ├── admin/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   │
│   ├── customer/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   │
│   ├── dealer/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   │
│   └── public/
│       ├── pages/
│       └── index.js
│
├── hooks/               # Custom React hooks
│   ├── useCommon.js
│   ├── useLoading.js
│   └── index.js
│
├── utils/               # Utilities & Services
│   ├── auth.js
│   ├── googleAuth.js
│   ├── facebookAuth.js
│   ├── api.js
│   ├── api-simple.js
│   ├── apiServices.js
│   ├── completeMockAPI.js
│   ├── notifications.js
│   └── index.js
│
├── assets/              # Static assets
│   └── tesla/
│
├── styles/              # Global styles
│   ├── Dashboard.css
│   └── DashboardShared.css
│
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global CSS

```

## 📦 Cách sử dụng Import mới

### Trước đây (Old):
```javascript
import AuthComponent from '../../../shared/auth/AuthComponent';
import { withLoading } from '../../../shared/components/LoadingHOC';
import DashboardCard from '../../../shared/components/DashboardCard';
```

### Bây giờ (New):
```javascript
// Auth module
import { AuthComponent, RoleGuard, AdminGuard } from '@/modules/auth';

// Loading module
import { withLoading, usePageLoading } from '@/modules/loading';

// Dashboard module
import { DashboardCard, StatsGrid } from '@/modules/dashboard';

// Layout module
import { Header, Footer, Navbar } from '@/modules/layout';

// Utils
import { AuthService, apiClient } from '@/utils';

// Hooks
import { useCommon, useLoading } from '@/hooks';
```

## 🎯 Lợi ích

### 1. **Tổ chức rõ ràng**
- Components được nhóm theo chức năng liên quan
- Dễ dàng tìm kiếm và bảo trì

### 2. **Import đơn giản**
- Sử dụng barrel exports (index.js)
- Import path ngắn gọn và rõ ràng

### 3. **Khả năng mở rộng**
- Dễ dàng thêm module mới
- Tách biệt rõ ràng giữa các domain

### 4. **Separation of Concerns**
- **modules/**: Shared, reusable components
- **features/**: Domain-specific logic
- **hooks/**: Reusable logic
- **utils/**: Helper functions & services

## 🔄 Migration Guide

### Bước 1: Cập nhật imports
Tìm và thay thế tất cả import paths cũ bằng paths mới

### Bước 2: Kiểm tra dependencies
Đảm bảo tất cả dependencies đã được import đúng

### Bước 3: Test
Chạy ứng dụng và kiểm tra tất cả chức năng

## 📝 Quy tắc đặt tên

- **Modules**: lowercase, singular (auth, layout, dashboard)
- **Components**: PascalCase (AuthComponent, DashboardCard)
- **Utils/Hooks**: camelCase (useCommon, apiClient)
- **Files**: Match component name (AuthComponent.jsx)

## 🚀 Next Steps

1. [ ] Cập nhật tất cả import paths trong project
2. [ ] Setup path aliases trong vite.config.js
3. [ ] Xóa thư mục cũ sau khi verify
4. [ ] Cập nhật documentation

---

**Note**: Cấu trúc cũ vẫn còn trong `shared/` và `components/` cho đến khi hoàn tất migration.
