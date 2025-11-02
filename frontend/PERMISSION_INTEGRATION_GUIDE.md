# Hướng Dẫn Tích Hợp Permission System vào App.jsx

## Tổng Quan
Tài liệu này hướng dẫn cách cập nhật `App.jsx` để sử dụng hệ thống phân quyền mới dựa trên `DealerRoleGuard` thay thế cho `DealerGuard` và `DealerShopGuard` cũ.

## Các Thay Đổi Chính

### 1. Import Components Mới

**❌ Xóa imports cũ:**
```jsx
import {
  DealerGuard,
  DealerShopGuard,
  CustomerGuard,
  AdminGuard,
  AccessDenied,
} from "@modules/auth";
```

**✅ Thay thế bằng:**
```jsx
import {
  CustomerGuard,
  AdminGuard,
} from "@modules/auth";

// Import dealer permission system
import DealerRoleGuard, { 
  ManagerOnlyGuard, 
  StaffAndManagerGuard 
} from "./features/dealer/components/auth/DealerRoleGuard";
import AccessDenied from "./features/dealer/pages/AccessDenied";
```

---

## 2. Mapping Use Cases → Routes → Guards

### UC 1.a - Tra cứu thông tin xe (Staff + Manager)

**Routes:**
- `/dealer/vehicles` - Danh sách xe
- `/dealer/vehicles/:vehicleId` - Chi tiết xe
- `/dealer/vehicles/compare` - So sánh xe

**Guard Pattern:**
```jsx
<Route
  path="/dealer/vehicles"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <DealerVehicleList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.b.1 - Lập báo giá (Staff + Manager)

**Routes:**
- `/dealer/quotations` - Danh sách báo giá
- `/dealer/quotations/create` - Tạo báo giá mới

**Guard Pattern:**
```jsx
<Route
  path="/dealer/quotations"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <QuotationList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.b.2 - Lập đơn hàng (Staff tạo, Manager duyệt)

**Routes:**
- `/dealer/orders` - Danh sách đơn hàng (Staff + Manager)
- `/dealer/orders/create` - Tạo đơn hàng (Staff + Manager)

**Lưu ý:** 
- Staff có thể tạo và xem orders
- Chỉ Manager có thể approve/cancel orders
- Logic approve sẽ được handle trong component OrderList/OrderDetail

**Guard Pattern:**
```jsx
<Route
  path="/dealer/orders"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <OrderList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>

<Route
  path="/dealer/orders/create"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <CreateOrder />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.b.3 - Quản lý chương trình khuyến mãi (MANAGER ONLY)

**Routes:**
- `/dealer/promotions` - Danh sách khuyến mãi
- `/dealer/promotions/:promoId` - Chi tiết khuyến mãi

**Guard Pattern:**
```jsx
<Route
  path="/dealer/promotions"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <PromotionList />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>

<Route
  path="/dealer/promotions/:promoId"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <PromotionDetail />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>
```

---

### UC 1.b.4 - Quản lý đặt hàng với nhà cung cấp (Staff + Manager)

**Routes:**
- `/dealer/purchase-requests` - Danh sách đơn đặt hàng
- `/dealer/purchase-requests/create` - Tạo đơn đặt hàng

**Guard Pattern:**
```jsx
<Route
  path="/dealer/purchase-requests"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <PurchaseRequestList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.b.5 - Quản lý kho (Staff + Manager)

**Routes:**
- `/dealer/inventory` - Danh sách tồn kho
- `/dealer/inventory/:stockId` - Chi tiết tồn kho
- `/dealer/inventory/request` - Yêu cầu nhập kho

**Guard Pattern:**
```jsx
<Route
  path="/dealer/inventory"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <DealerInventory />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.b.6 - Quản lý thanh toán (Staff + Manager)

**Routes:**
- `/dealer/payments` - Danh sách thanh toán
- `/dealer/payments/new` - Tạo thanh toán

**Guard Pattern:**
```jsx
<Route
  path="/dealer/payments"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <PaymentList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.c.1 - Quản lý hồ sơ khách hàng (Staff + Manager)

**Routes:**
- `/dealer/customers` - Danh sách khách hàng
- `/dealer/customers/new` - Tạo khách hàng mới
- `/dealer/customers/:customerId` - Chi tiết khách hàng
- `/dealer/customers/:customerId/edit` - Sửa khách hàng

**Guard Pattern:**
```jsx
<Route
  path="/dealer/customers"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <DealerCustomerList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.c.2 - Lên lịch lái thử (Staff + Manager)

**Routes:**
- `/dealer/test-drives` - Danh sách lịch lái thử
- `/dealer/test-drives/new` - Tạo lịch lái thử
- `/dealer/test-drives/calendar` - Xem lịch
- `/dealer/test-drives/:id` - Chi tiết lái thử

**Guard Pattern:**
```jsx
<Route
  path="/dealer/test-drives"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <TestDriveList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.c.3 - Xử lý khiếu nại (Staff xử lý, Manager phân công)

**Routes:** (Chưa có trong App.jsx hiện tại - cần tạo sau)
- `/dealer/complaints` - Danh sách khiếu nại (Staff + Manager)
- `/dealer/complaints/:id` - Chi tiết khiếu nại (Staff + Manager)

**Guard Pattern:**
```jsx
<Route
  path="/dealer/complaints"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <ComplaintList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.d.1 - Xem báo cáo bán hàng (Staff + Manager)

**Routes:**
- `/dealer/reports/sales-performance` - Báo cáo hiệu suất bán hàng

**Lưu ý:**
- Staff: Chỉ xem báo cáo cá nhân
- Manager: Xem báo cáo toàn bộ + export

**Guard Pattern:**
```jsx
<Route
  path="/dealer/reports/sales-performance"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <SalesPerformanceReport />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

---

### UC 1.d.2 - Xem báo cáo công nợ (MANAGER ONLY)

**Routes:**
- `/dealer/reports/customer-debt` - Báo cáo công nợ khách hàng
- `/dealer/reports/supplier-debt` - Báo cáo công nợ nhà cung cấp

**Guard Pattern:**
```jsx
<Route
  path="/dealer/reports/customer-debt"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <CustomerDebtReport />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>

<Route
  path="/dealer/reports/supplier-debt"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <SupplierDebtReport />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>
```

---

### Staff Management (MANAGER ONLY)

**Routes:**
- `/dealer/staff` - Danh sách nhân viên
- `/dealer/staff/new` - Thêm nhân viên
- `/dealer/staff/:staffId/edit` - Sửa nhân viên

**Guard Pattern:**
```jsx
<Route
  path="/dealer/staff"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <StaffList />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>

<Route
  path="/dealer/staff/new"
  element={
    <ManagerOnlyGuard>
      <AppLayout>
        <StaffForm />
      </AppLayout>
    </ManagerOnlyGuard>
  }
/>
```

---

### Dashboard & Access Denied

**Routes:**
- `/dealer/dashboard` - Dashboard (Staff + Manager)
- `/dealer/access-denied` - Trang báo lỗi không có quyền

**Guard Pattern:**
```jsx
<Route
  path="/dealer/dashboard"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <DealerDashboardWithLoading isLoading={false} isDataLoading={false} />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>

<Route
  path="/dealer/access-denied"
  element={<AccessDenied />}
/>
```

---

## 3. Cập Nhật Legacy Routes

**Các routes cũ cần cập nhật:**

```jsx
// ❌ Xóa các routes dùng DealerShopGuard
<Route
  path="/catalog"
  element={
    <DealerGuard>
      <DealerShopGuard>
        <AppLayout>
          <VehicleList />
        </AppLayout>
      </DealerShopGuard>
    </DealerGuard>
  }
/>

// ✅ Thay thế bằng
<Route
  path="/catalog"
  element={
    <StaffAndManagerGuard>
      <AppLayout>
        <VehicleList />
      </AppLayout>
    </StaffAndManagerGuard>
  }
/>
```

**Áp dụng cho:**
- `/catalog`
- `/sales/orders`
- `/customers`
- `/inventory`

---

## 4. Checklist Triển Khai

### Bước 1: Cập nhật imports
- [ ] Xóa imports `DealerGuard`, `DealerShopGuard` từ `@modules/auth`
- [ ] Import `DealerRoleGuard`, `ManagerOnlyGuard`, `StaffAndManagerGuard`
- [ ] Import `AccessDenied` từ dealer pages

### Bước 2: Thêm route Access Denied
- [ ] Thêm route `/dealer/access-denied`

### Bước 3: Cập nhật routes theo Use Cases
- [ ] UC 1.a: Vehicles routes → `StaffAndManagerGuard`
- [ ] UC 1.b.1: Quotations → `StaffAndManagerGuard`
- [ ] UC 1.b.2: Orders → `StaffAndManagerGuard`
- [ ] UC 1.b.3: Promotions → `ManagerOnlyGuard`
- [ ] UC 1.b.4: Purchase → `StaffAndManagerGuard`
- [ ] UC 1.b.5: Inventory → `StaffAndManagerGuard`
- [ ] UC 1.b.6: Payments → `StaffAndManagerGuard`
- [ ] UC 1.c.1: Customers → `StaffAndManagerGuard`
- [ ] UC 1.c.2: Test Drives → `StaffAndManagerGuard`
- [ ] UC 1.d.1: Sales Reports → `StaffAndManagerGuard`
- [ ] UC 1.d.2: Debt Reports → `ManagerOnlyGuard`
- [ ] Staff Management → `ManagerOnlyGuard`

### Bước 4: Xóa legacy routes
- [ ] Thay thế `/catalog` với guard mới
- [ ] Thay thế `/sales/orders` với guard mới
- [ ] Thay thế `/customers` với guard mới
- [ ] Thay thế `/inventory` với guard mới

### Bước 5: Testing
- [ ] Test với dealer_staff account
- [ ] Test với dealer_manager account
- [ ] Verify access denied page hiển thị đúng
- [ ] Check redirect flow

---

## 5. Ví Dụ Code Hoàn Chỉnh

```jsx
// ========== IMPORTS ==========
import DealerRoleGuard, { 
  ManagerOnlyGuard, 
  StaffAndManagerGuard 
} from "./features/dealer/components/auth/DealerRoleGuard";
import AccessDenied from "./features/dealer/pages/AccessDenied";

// ========== ROUTES ==========
const App = () => {
  return (
    <GlobalLoadingProvider>
      <ThemeProvider>
        <Routes>
          {/* Access Denied */}
          <Route path="/dealer/access-denied" element={<AccessDenied />} />

          {/* Dashboard - Staff + Manager */}
          <Route
            path="/dealer/dashboard"
            element={
              <StaffAndManagerGuard>
                <AppLayout>
                  <DealerDashboardWithLoading />
                </AppLayout>
              </StaffAndManagerGuard>
            }
          />

          {/* Vehicles - Staff + Manager */}
          <Route
            path="/dealer/vehicles"
            element={
              <StaffAndManagerGuard>
                <AppLayout>
                  <DealerVehicleList />
                </AppLayout>
              </StaffAndManagerGuard>
            }
          />

          {/* Promotions - MANAGER ONLY */}
          <Route
            path="/dealer/promotions"
            element={
              <ManagerOnlyGuard>
                <AppLayout>
                  <PromotionList />
                </AppLayout>
              </ManagerOnlyGuard>
            }
          />

          {/* Staff Management - MANAGER ONLY */}
          <Route
            path="/dealer/staff"
            element={
              <ManagerOnlyGuard>
                <AppLayout>
                  <StaffList />
                </AppLayout>
              </ManagerOnlyGuard>
            }
          />

          {/* ... other routes ... */}
        </Routes>
      </ThemeProvider>
    </GlobalLoadingProvider>
  );
};
```

---

## 6. Lưu Ý Quan Trọng

### Về DealerRoleGuard
- **Không cần** `DealerShopGuard` nữa, shop check được tích hợp vào `DealerRoleGuard` qua prop `shopId`
- Default behavior: Nếu không chỉ định `requiredRole`, cho phép tất cả dealer roles
- Redirect mặc định: `/dealer/access-denied` (có thể customize qua prop `redirectTo`)

### Về Staff vs Manager
- **Staff**: Có thể tạo, xem, sửa nhưng KHÔNG approve/delete/export
- **Manager**: Có tất cả quyền của Staff + approve/delete/export/manage

### Về Logic Phân Quyền Trong Component
- Guards chỉ bảo vệ route-level access
- Component-level permissions (buttons, actions) dùng `PermissionGuard` hoặc `Can` component
- Ví dụ: OrderList page accessible cho cả Staff và Manager, nhưng button "Approve" chỉ hiển thị cho Manager

---

## 7. Next Steps

Sau khi cập nhật App.jsx:
1. Update các components để sử dụng `PermissionGuard` cho action-level permissions
2. Update sidebar navigation để ẩn/hiện menu items dựa trên role
3. Update AuthService để hỗ trợ `dealerRole` field
4. Tạo migration script để assign role cho existing dealers
5. Testing end-to-end với cả 2 roles

---

**📝 Ghi chú:** Tài liệu này được tạo tự động dựa trên Use Case Document và permissions.js configuration. Mọi thay đổi về phân quyền cần update cả 3 files: permissions.js, App.jsx, và tài liệu này.
