# 🎨 Staff Management - Component Usage Summary

## ✅ Đã tái sử dụng các component từ project

### **StaffList.jsx** - Sử dụng các component có sẵn:

#### **Layout Components:**
- `PageContainer` - Container chính cho toàn bộ trang
- `PageHeader` - Header với title, description và actions button

#### **UI Components:**
- `SearchBar` - Thanh tìm kiếm với icon
- `Table` - Bảng dữ liệu động với columns config
- `Badge` - Badge component với variants (success, danger, info)
- `Button` - Button với variants (primary, secondary, ghost) và sizes
- `EmptyState` - Trạng thái rỗng với icon, title, description và action
- `MetricCard` - Card hiển thị metrics với icon, value, trend

#### **Icons từ Lucide React:**
```javascript
import {
  UserPlus,      // Thêm nhân viên
  Filter,        // Lọc
  Search,        // Tìm kiếm
  Users,         // Nhân viên
  UserCheck,     // Đang làm việc
  UserX,         // Nghỉ việc
  RefreshCw,     // Làm mới
  Edit,          // Chỉnh sửa
  Power          // Kích hoạt/Vô hiệu
} from 'lucide-react';
```

#### **Features:**
1. ✅ Metrics Cards - Hiển thị thống kê (tổng, active, inactive, filtered)
2. ✅ Search & Filters - Tìm kiếm + lọc theo status/role
3. ✅ Dynamic Table - Bảng với columns config và custom render
4. ✅ Empty State - Hiển thị khi không có dữ liệu
5. ✅ Badge Status - Badge màu cho trạng thái và role
6. ✅ Action Buttons - Sửa và thay đổi trạng thái

---

### **StaffForm.jsx** - Sử dụng các component có sẵn:

#### **Layout Components:**
- `PageContainer` - Container chính
- `PageHeader` - Header với back button
- `InfoSection` - Section với title và icon
- `ActionBar` - Action bar cho các button submit/cancel

#### **Form Components:**
- `FormGroup` - Wrapper cho form field với error handling
- `Label` - Label với icon và required indicator
- `Input` - Input field với error state
- `Select` - Select dropdown với options
- `Button` - Form buttons (submit, cancel)

#### **Icons từ Lucide React:**
```javascript
import {
  UserPlus,      // Tạo mới
  Edit,          // Chỉnh sửa
  Save,          // Lưu
  X,             // Hủy
  Mail,          // Email
  Phone,         // Điện thoại
  User,          // User
  Lock,          // Password
  Calendar,      // Ngày sinh
  Building,      // Đại lý
  Shield         // Chức vụ/Bảo mật
} from 'lucide-react';
```

#### **Features:**
1. ✅ Section Layout - Chia form thành các section có icon
2. ✅ Grid Layout - Responsive grid cho các field
3. ✅ Validation - Real-time validation với error messages
4. ✅ Icon Labels - Label có icon cho mỗi field
5. ✅ Disabled State - Username disabled khi edit
6. ✅ Conditional Fields - Password chỉ hiện khi create, Status chỉ hiện khi edit
7. ✅ Loading State - Button disable khi đang submit

---

## 📦 Import Pattern

### **StaffList.jsx:**
```javascript
import {
  PageContainer,
  PageHeader,
  SearchBar,
  Table,
  Badge,
  Button,
  EmptyState,
  MetricCard
} from '../../components';
```

### **StaffForm.jsx:**
```javascript
import {
  PageContainer,
  PageHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Select,
  InfoSection,
  ActionBar
} from '../../components';
```

---

## 🎨 Component Usage Examples

### **1. MetricCard:**
```javascript
<MetricCard
  title="Tổng nhân viên"
  value={staffMetrics.total}
  icon={<Users size={24} />}
  trend={{ value: 0, isPositive: true }}
  color="primary"
/>
```

### **2. Table với Dynamic Columns:**
```javascript
const columns = [
  { 
    key: 'userId', 
    label: 'ID',
    render: (value) => `#${value}`
  },
  { 
    key: 'status', 
    label: 'Trạng thái',
    render: (value) => (
      <Badge variant={value === 'Active' ? 'success' : 'danger'}>
        {value === 'Active' ? 'Đang làm việc' : 'Nghỉ việc'}
      </Badge>
    )
  },
  { 
    key: 'actions', 
    label: 'Thao tác',
    render: (_, row) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/dealer/staff/${row.userId}/edit`)}
      >
        <Edit size={16} /> Sửa
      </Button>
    )
  }
];

<Table
  columns={columns}
  data={filteredStaff}
  keyExtractor={(row) => row.userId}
/>
```

### **3. EmptyState:**
```javascript
<EmptyState
  icon={<Users size={48} />}
  title="Không tìm thấy nhân viên"
  description="Không có nhân viên nào phù hợp với bộ lọc hiện tại"
  action={
    <Button
      variant="primary"
      onClick={() => navigate('/dealer/staff/new')}
      icon={<UserPlus size={18} />}
    >
      Thêm nhân viên đầu tiên
    </Button>
  }
/>
```

### **4. InfoSection với FormGroup:**
```javascript
<InfoSection title="🔐 Thông tin tài khoản" icon={<Shield size={20} />}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
    <FormGroup error={errors.username}>
      <Label required icon={<User size={16} />}>Tên đăng nhập</Label>
      <Input
        name="username"
        value={formData.username}
        onChange={handleChange}
        disabled={isEditMode}
        placeholder="Nhập tên đăng nhập"
        error={!!errors.username}
      />
      {errors.username && (
        <span style={{ color: '#e53e3e', fontSize: '0.875rem' }}>
          {errors.username}
        </span>
      )}
    </FormGroup>
  </div>
</InfoSection>
```

### **5. PageHeader với Actions:**
```javascript
<PageHeader
  title="👥 Quản lý nhân viên"
  description="Quản lý thông tin nhân viên và phân quyền"
  actions={
    <Button
      variant="primary"
      onClick={() => navigate('/dealer/staff/new')}
      icon={<UserPlus size={18} />}
    >
      Thêm nhân viên
    </Button>
  }
/>
```

### **6. ActionBar:**
```javascript
<ActionBar>
  <Button
    type="button"
    variant="secondary"
    onClick={handleCancel}
    disabled={isSubmitting}
    icon={<X size={18} />}
  >
    Hủy
  </Button>
  <Button
    type="submit"
    variant="primary"
    disabled={isSubmitting}
    icon={<Save size={18} />}
  >
    {isSubmitting ? '⏳ Đang xử lý...' : 'Cập nhật'}
  </Button>
</ActionBar>
```

---

## 🚀 Benefits của việc tái sử dụng component

### ✅ **Consistency:**
- UI nhất quán giữa các trang
- Styling tự động từ component library
- Behavior chuẩn (hover, focus, disabled states)

### ✅ **Maintainability:**
- Dễ maintain - sửa 1 chỗ, cập nhật toàn bộ
- Code ngắn gọn hơn
- Ít duplicate code

### ✅ **Developer Experience:**
- Không cần viết CSS
- Props interface rõ ràng
- TypeScript support (nếu có)

### ✅ **Performance:**
- Component đã được optimize
- Consistent re-render behavior
- Smaller bundle size (code reuse)

---

## 📝 Coding Standards

### **1. Import Order:**
```javascript
// 1. React & Router
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Hooks & Utils
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api';
import { notifications } from '@utils/notifications';

// 3. Icons
import { UserPlus, Edit, Save } from 'lucide-react';

// 4. Components
import { PageContainer, PageHeader, Button } from '../../components';
```

### **2. useMemo for Filters:**
```javascript
const filteredStaff = useMemo(() => {
  let filtered = [...staff];
  
  if (searchTerm.trim()) {
    filtered = filtered.filter(/* logic */);
  }
  
  if (statusFilter !== 'all') {
    filtered = filtered.filter(/* logic */);
  }
  
  return filtered;
}, [staff, searchTerm, statusFilter]);
```

### **3. Metrics Calculation:**
```javascript
const staffMetrics = useMemo(() => {
  const total = staff.length;
  const active = staff.filter(s => s.status === 'Active').length;
  const inactive = staff.filter(s => s.status === 'Inactive').length;
  const filtered = filteredStaff.length;

  return { total, active, inactive, filtered };
}, [staff, filteredStaff]);
```

---

## 🎯 Next Steps

### **Recommended Enhancements:**

1. **Add Loading Skeleton:**
   - Sử dụng Skeleton component khi load data
   - Better UX hơn loading spinner

2. **Add Pagination:**
   - Sử dụng Pagination component có sẵn
   - Pagination state management

3. **Add Sorting:**
   - Column sorting trong Table
   - Sort by name, date, role, etc.

4. **Add Bulk Actions:**
   - Checkbox selection
   - Bulk activate/deactivate
   - Bulk role change

5. **Add Excel Export:**
   - Export staff list to Excel
   - Custom columns selection

---

**Last Updated:** 2025-01-09  
**Components Version:** Latest from project
