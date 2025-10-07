# Tesla EVM Loading System Documentation

## Tổng quan

Hệ thống loading của Tesla EVM cung cấp nhiều cách để hiển thị trạng thái loading cho toàn bộ ứng dụng, từ loading đơn giản đến loading toàn màn hình với animation Tesla.

## Các thành phần chính

### 1. GlobalLoadingProvider
Context provider quản lý trạng thái loading toàn cục cho toàn bộ ứng dụng.

```jsx
import { GlobalLoadingProvider } from './shared/components/LoadingHOC';

function App() {
  return (
    <GlobalLoadingProvider>
      {/* App content */}
    </GlobalLoadingProvider>
  );
}
```

### 2. Higher-Order Components (HOCs)

#### withFullPageLoading
Bao bọc component với loading toàn màn hình.

```jsx
import { withFullPageLoading } from './shared/components/LoadingHOC';

const MyComponent = () => <div>Content</div>;

const MyComponentWithLoading = withFullPageLoading(MyComponent, {
  loadingMessage: 'Đang tải trang...',
  loadingVariant: 'tesla',
  showLogo: true,
  minimumLoadingTime: 1000,
  enableProgressBar: true,
  enableFadeTransition: true
});

// Sử dụng
<MyComponentWithLoading isLoading={true} />
```

**Options:**
- `loadingMessage`: Thông báo hiển thị khi loading
- `loadingVariant`: 'tesla' | 'dashboard' | 'minimal' | 'default'
- `showLogo`: Hiển thị logo Tesla
- `minimumLoadingTime`: Thời gian loading tối thiểu (ms)
- `enableProgressBar`: Hiển thị thanh tiến trình
- `enableFadeTransition`: Hiệu ứng fade khi loading

#### withDashboardLoading
Dành cho các dashboard component với loading skeleton.

```jsx
import { withDashboardLoading } from './shared/components/LoadingHOC';

const DashboardComponent = () => <div>Dashboard content</div>;

const DashboardWithLoading = withDashboardLoading(DashboardComponent, {
  loadingMessage: 'Đang khởi tạo dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu...',
  loadingVariant: 'dashboard',
  showLogo: true,
  enableSkeleton: true
});

// Sử dụng
<DashboardWithLoading 
  isLoading={false} 
  isDataLoading={true} 
/>
```

#### withRouteLoading
Dành cho loading khi chuyển trang/route.

```jsx
import { withRouteLoading } from './shared/components/LoadingHOC';

const PageComponent = () => <div>Page content</div>;

const PageWithRouteLoading = withRouteLoading(PageComponent, {
  loadingMessage: 'Đang tải trang...',
  loadingVariant: 'tesla',
  showLogo: true,
  autoLoadOnMount: true,
  loadingDuration: 1500
});
```

### 3. Hooks

#### useGlobalLoading
Hook để điều khiển loading toàn cục.

```jsx
import { useGlobalLoading } from './shared/components/LoadingHOC';

function MyComponent() {
  const { setGlobalLoading, isGlobalLoading, globalMessage } = useGlobalLoading();

  const handleGlobalAction = async () => {
    setGlobalLoading(true, 'Đang đồng bộ dữ liệu...');
    
    try {
      await someAsyncOperation();
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div>
      <p>Global Loading: {isGlobalLoading ? 'Active' : 'Inactive'}</p>
      <p>Message: {globalMessage}</p>
      <button onClick={handleGlobalAction}>Start Global Loading</button>
    </div>
  );
}
```

#### usePageLoading
Hook để điều khiển loading trong trang.

```jsx
import { usePageLoading } from './shared/components/LoadingHOC';

function MyComponent() {
  const { startLoading, stopLoading, isLoading, loadingMessage } = usePageLoading();

  const handlePageAction = async () => {
    const loadingId = startLoading('Đang tải dữ liệu...', 'tesla');
    
    try {
      await fetchData();
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      <p>Page Loading: {isLoading ? 'Active' : 'Inactive'}</p>
      <p>Message: {loadingMessage}</p>
      <button onClick={handlePageAction}>Load Data</button>
    </div>
  );
}
```

## Loading Variants

### 1. Tesla Variant
Màu đỏ Tesla với animation đặc biệt.

```jsx
// Sử dụng
startLoading('Connecting to Tesla servers...', 'tesla');
```

**Đặc điểm:**
- Màu chủ đạo: #e53e3e (Tesla Red)
- Logo Tesla
- Animation đặc biệt
- Phù hợp cho: Trang chủ, product pages

### 2. Dashboard Variant
Màu xanh dương cho admin interface.

```jsx
// Sử dụng
startLoading('Loading dashboard...', 'dashboard');
```

**Đặc điểm:**
- Màu chủ đạo: #3182ce (Blue)
- Skeleton loading
- Progress indicators
- Phù hợp cho: Admin dashboards, data tables

### 3. Minimal Variant
Loading đơn giản, nhẹ nhàng.

```jsx
// Sử dụng
startLoading('Loading...', 'minimal');
```

**Đặc điểm:**
- Màu xám trung tính
- Spinner đơn giản
- Không có logo
- Phù hợp cho: Quick actions, form submissions

### 4. Default Variant
Loading chuẩn với branding.

```jsx
// Sử dụng
startLoading('Please wait...', 'default');
```

## CSS Classes và Styling

### Import CSS
```jsx
import '../shared/components/GlobalLoading.css';
```

### Custom Classes
```css
/* Global loading overlay */
.global-loading-overlay

/* Tesla themed loading */
.loading-tesla

/* Dashboard themed loading */
.loading-dashboard

/* Minimal loading */
.loading-minimal

/* Loading animations */
.tesla-pulse
.fade-in
.slide-up
```

## Patterns sử dụng

### 1. App-wide Loading
```jsx
// App.jsx
import { GlobalLoadingProvider } from './shared/components/LoadingHOC';

function App() {
  return (
    <GlobalLoadingProvider>
      <Routes>
        {/* routes */}
      </Routes>
    </GlobalLoadingProvider>
  );
}
```

### 2. Page-level Loading
```jsx
// Trang với loading khi mount
const HomePage = withFullPageLoading(HomePageComponent, {
  loadingMessage: 'Chào mừng đến với Tesla EVM...',
  loadingVariant: 'tesla',
  showLogo: true,
  autoLoadOnMount: true
});
```

### 3. Dashboard Loading
```jsx
// Dashboard với skeleton loading
const AdminDashboard = withDashboardLoading(AdminDashboardComponent, {
  loadingMessage: 'Đang khởi tạo dashboard...',
  dataLoadingMessage: 'Đang tải dữ liệu...',
  enableSkeleton: true
});

// Sử dụng
<AdminDashboard 
  isLoading={false}      // Initial loading
  isDataLoading={true}   // Data refresh loading
/>
```

### 4. Async Operations
```jsx
function DataComponent() {
  const { startLoading, stopLoading } = usePageLoading();
  const { setGlobalLoading } = useGlobalLoading();

  const loadData = async () => {
    // Page-level loading
    startLoading('Đang tải dữ liệu...');
    try {
      const data = await fetchData();
      // Process data
    } finally {
      stopLoading();
    }
  };

  const syncGlobalData = async () => {
    // Global loading
    setGlobalLoading(true, 'Đang đồng bộ...');
    try {
      await syncData();
    } finally {
      setGlobalLoading(false);
    }
  };
}
```

### 5. Route Loading
```jsx
// Route với auto loading
const ProductPage = withRouteLoading(ProductPageComponent, {
  autoLoadOnMount: true,
  loadingDuration: 1200,
  loadingMessage: 'Đang tải sản phẩm Tesla...'
});

// React Router
<Route path="/vehicles" element={<ProductPage />} />
```

## Best Practices

### 1. Chọn variant phù hợp
- **Tesla**: Trang public, landing pages
- **Dashboard**: Admin interfaces, data heavy pages
- **Minimal**: Quick actions, form submissions
- **Default**: General purpose

### 2. Loading duration
- **Quick actions**: 500-1000ms
- **Page loads**: 1000-2000ms  
- **Heavy operations**: 2000ms+

### 3. Messages
- Tiếng Việt cho user-facing
- Cụ thể về action đang thực hiện
- Tránh message quá dài

### 4. UX Guidelines
- Không block UI quá lâu
- Sử dụng skeleton cho data loading
- Progress bar cho long operations
- Fade transitions cho smooth experience

## Troubleshooting

### Common Issues

1. **Loading không hiển thị**
   ```jsx
   // Đảm bảo GlobalLoadingProvider được wrap
   <GlobalLoadingProvider>
     <App />
   </GlobalLoadingProvider>
   ```

2. **CSS không load**
   ```jsx
   // Import CSS trong component
   import '../shared/components/GlobalLoading.css';
   ```

3. **Hook không hoạt động**
   ```jsx
   // Đảm bảo component nằm trong Provider
   const MyComponent = () => {
     const { setGlobalLoading } = useGlobalLoading(); // Must be inside Provider
   };
   ```

4. **Loading không tự động stop**
   ```jsx
   // Luôn luôn stop loading trong finally
   try {
     startLoading('...');
     await operation();
   } finally {
     stopLoading(); // Important!
   }
   ```

## Demo

Truy cập `/loading-demo` để xem demo đầy đủ các tính năng loading.

## API Reference

### GlobalLoadingProvider Props
- `children`: ReactNode - App content

### withFullPageLoading Options
- `loadingMessage`: string - Loading message
- `loadingVariant`: 'tesla' | 'dashboard' | 'minimal' | 'default'
- `showLogo`: boolean - Show Tesla logo
- `minimumLoadingTime`: number - Minimum loading duration (ms)
- `enableProgressBar`: boolean - Show progress bar
- `enableFadeTransition`: boolean - Fade transition effect

### withDashboardLoading Options
- `loadingMessage`: string - Initial loading message
- `dataLoadingMessage`: string - Data loading message
- `loadingVariant`: 'dashboard' | 'tesla' | 'minimal'
- `showLogo`: boolean - Show logo
- `enableSkeleton`: boolean - Enable skeleton loading

### withRouteLoading Options
- `loadingMessage`: string - Loading message
- `loadingVariant`: 'tesla' | 'dashboard' | 'minimal' | 'default'
- `showLogo`: boolean - Show logo
- `autoLoadOnMount`: boolean - Auto start loading on mount
- `loadingDuration`: number - Loading duration (ms)

### useGlobalLoading Returns
- `setGlobalLoading`: (isLoading: boolean, message?: string) => void
- `isGlobalLoading`: boolean
- `globalMessage`: string

### usePageLoading Returns
- `startLoading`: (message?: string, variant?: string) => string
- `stopLoading`: () => void
- `isLoading`: boolean
- `loadingMessage`: string