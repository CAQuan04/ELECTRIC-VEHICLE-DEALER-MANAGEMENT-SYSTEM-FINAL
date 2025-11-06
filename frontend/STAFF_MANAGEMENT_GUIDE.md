# 📘 Hướng dẫn sử dụng Staff Management (Quản lý nhân viên)

## 🎯 Tổng quan

Module **Staff Management** cho phép Dealer quản lý nhân viên, bao gồm:
- Xem danh sách nhân viên
- Thêm nhân viên mới
- Chỉnh sửa thông tin nhân viên
- Kích hoạt/Vô hiệu hóa tài khoản
- Phân quyền theo chức vụ

---

## 📁 Cấu trúc Files

```
src/features/dealer/pages/StaffManagement/
├── StaffList.jsx          # Danh sách nhân viên
└── StaffForm.jsx          # Form tạo/sửa nhân viên

src/utils/api/services/
└── dealer.api.js          # API endpoints (lines 425+)
```

---

## 🔌 API Endpoints

### 1. **GET /api/Users** - Lấy danh sách nhân viên
```javascript
const result = await dealerAPI.getUsers();
// Response: { success: true, data: [...] }
```

**Response Data Structure:**
```json
{
  "userId": 1,
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@dealer.com",
  "phoneNumber": "0901234567",
  "dateOfBirth": "1990-01-15T00:00:00",
  "roleId": 2,
  "dealerId": 5,
  "status": "Active"
}
```

---

### 2. **GET /api/Users/{id}** - Lấy thông tin 1 nhân viên
```javascript
const result = await dealerAPI.getUserById(userId);
// Response: { success: true, data: {...} }
```

---

### 3. **POST /api/Users** - Tạo nhân viên mới
```javascript
const userData = {
  username: "johndoe",
  password: "Password123",
  fullName: "John Doe",
  email: "john@dealer.com",
  phoneNumber: "0901234567",
  dateOfBirth: "1990-01-15",
  roleId: 2,              // Required
  dealerId: 5             // Optional
};

const result = await dealerAPI.createUser(userData);
// Response: { success: true, data: {...} }
```

**Required Fields:**
- `username` ✅
- `password` ✅ (only for create)
- `fullName` ✅
- `email` ✅
- `phoneNumber` ✅
- `roleId` ✅

**Optional Fields:**
- `dateOfBirth`
- `dealerId`

---

### 4. **PUT /api/Users/{id}** - Cập nhật nhân viên
```javascript
const userData = {
  username: "johndoe",     // Can't change, but must include
  fullName: "John Doe Updated",
  email: "john.new@dealer.com",
  phoneNumber: "0909999999",
  dateOfBirth: "1990-01-15",
  roleId: 3,              // Changed role
  dealerId: 5
};

const result = await dealerAPI.updateUser(userId, userData);
// Response: { success: true, message: "..." }
```

**Note:** 
- ⚠️ Password NOT included in update (use separate password reset endpoint if available)
- ⚠️ Username can't be changed but must be included in request

---

### 5. **PATCH /api/Users/{id}/status** - Thay đổi trạng thái
```javascript
const result = await dealerAPI.updateUserStatus(userId, "Inactive");
// Response: { success: true, message: "..." }
```

**Valid Status Values:**
- `Active` - Đang làm việc
- `Inactive` - Nghỉ việc

---

## 👥 Roles (Chức vụ)

| Role ID | Role Name | Description |
|---------|-----------|-------------|
| 1 | Admin | Quản trị viên hệ thống |
| 2 | Dealer Manager | Quản lý đại lý |
| 3 | Sales Executive | Nhân viên bán hàng |
| 4 | Technician | Kỹ thuật viên |
| 5 | Customer Service | Chăm sóc khách hàng |
| 6 | Finance | Kế toán/Tài chính |
| 7 | Support | Hỗ trợ |

**Mapping trong code:**
```javascript
const roleNames = {
  1: 'Admin',
  2: 'Dealer Manager',
  3: 'Sales Executive',
  4: 'Technician',
  5: 'Customer Service',
  6: 'Finance',
  7: 'Support'
};
```

---

## 🎨 Features Đã Implement

### **StaffList.jsx**

#### ✅ **1. Load danh sách nhân viên**
- Call API `getUsers()` khi component mount
- Hiển thị loading state
- Xử lý lỗi với notifications

#### ✅ **2. Tìm kiếm & Lọc**
```javascript
// Search by name, email, phone, username
<input 
  type="text"
  placeholder="🔍 Tìm kiếm theo tên, email, SĐT..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// Filter by status
<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="all">Tất cả trạng thái</option>
  <option value="Active">Đang làm việc</option>
  <option value="Inactive">Nghỉ việc</option>
</select>

// Filter by role
<select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
  <option value="all">Tất cả chức vụ</option>
  {Object.entries(roleNames).map(([id, name]) => (
    <option key={id} value={id}>{name}</option>
  ))}
</select>
```

#### ✅ **3. Thống kê nhanh**
```javascript
<div className="stats-row">
  <div className="stat-card">
    <div className="stat-value">{staff.length}</div>
    <div className="stat-label">Tổng nhân viên</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">{staff.filter(s => s.status === 'Active').length}</div>
    <div className="stat-label">Đang làm việc</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">{staff.filter(s => s.status === 'Inactive').length}</div>
    <div className="stat-label">Nghỉ việc</div>
  </div>
</div>
```

#### ✅ **4. Bảng hiển thị**
Columns:
- ID
- Tên nhân viên (fullName + username)
- Chức vụ (role badge)
- Email
- Số điện thoại
- Ngày sinh
- Đại lý
- Trạng thái (badge)
- Thao tác (Sửa, Kích hoạt/Vô hiệu)

#### ✅ **5. Thay đổi trạng thái**
```javascript
const handleStatusChange = async (userId, currentStatus) => {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  
  if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} nhân viên này?`)) {
    return;
  }

  const result = await dealerAPI.updateUserStatus(userId, newStatus);
  
  if (result.success) {
    notifications.success('Thành công', `Đã ${actionText} nhân viên thành công`);
    loadStaff(); // Reload list
  }
};
```

#### ✅ **6. Điều hướng**
- **Thêm mới:** Navigate to `/dealer/staff/new`
- **Chỉnh sửa:** Navigate to `/dealer/staff/${userId}/edit`

---

### **StaffForm.jsx**

#### ✅ **1. Dual Mode (Create/Edit)**
```javascript
const { staffId } = useParams();
const isEditMode = !!staffId;

// Load data in edit mode
useEffect(() => {
  if (isEditMode) {
    loadStaffData();
  }
}, [staffId]);
```

#### ✅ **2. Form Sections**

**🔐 Account Information:**
- Username (disabled in edit mode)
- Password (only in create mode)
- Role selection
- Status (only in edit mode)

**👤 Personal Information:**
- Full name
- Email
- Phone number
- Date of birth
- Dealer ID

#### ✅ **3. Form Validation**
```javascript
const validateForm = () => {
  const newErrors = {};

  // Username: min 3 chars
  if (!formData.username.trim()) {
    newErrors.username = 'Tên đăng nhập không được để trống';
  }

  // Password: min 6 chars (create mode only)
  if (!isEditMode && formData.password.length < 6) {
    newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  // Email: valid format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Email không hợp lệ';
  }

  // Phone: 10 digits starting with 0
  if (!/^0\d{9}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
  }

  // Age: 18-65
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18 || age > 65) {
    newErrors.dateOfBirth = 'Nhân viên phải từ 18 đến 65 tuổi';
  }

  return Object.keys(newErrors).length === 0;
};
```

#### ✅ **4. Submit Handler**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    notifications.warning('Validation', 'Vui lòng kiểm tra lại thông tin');
    return;
  }

  const submitData = {
    username: formData.username,
    fullName: formData.fullName,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    dateOfBirth: formData.dateOfBirth || null,
    roleId: parseInt(formData.roleId),
    dealerId: formData.dealerId ? parseInt(formData.dealerId) : null
  };

  // Add password only for create
  if (!isEditMode) {
    submitData.password = formData.password;
  }

  let result;
  if (isEditMode) {
    result = await dealerAPI.updateUser(staffId, submitData);
  } else {
    result = await dealerAPI.createUser(submitData);
  }

  if (result.success) {
    notifications.success('Thành công', '...');
    navigate('/dealer/staff');
  }
};
```

#### ✅ **5. Error Display**
```javascript
{errors.username && <span className="error-message">{errors.username}</span>}
```

#### ✅ **6. Cancel with Confirmation**
```javascript
const handleCancel = () => {
  if (window.confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
    navigate('/dealer/staff');
  }
};
```

---

## 🧪 Testing Checklist

### **Before Testing:**
```bash
# Make sure backend database migration is applied
cd backend/EVDealer.BE.API
dotnet ef database update
```

### **Test Cases:**

#### ✅ **List Page**
- [ ] Page loads without errors
- [ ] All staff members display correctly
- [ ] Statistics show correct counts
- [ ] Search works (name, email, phone)
- [ ] Status filter works (Active/Inactive)
- [ ] Role filter works
- [ ] Refresh button reloads data
- [ ] Status badges display correctly
- [ ] Role badges display correctly
- [ ] Edit button navigates to form
- [ ] Status toggle button works
- [ ] Confirmation dialog appears before status change

#### ✅ **Create Form**
- [ ] Page loads without errors
- [ ] All fields render correctly
- [ ] Password field is visible
- [ ] Role dropdown has all options
- [ ] Username validation works (min 3 chars)
- [ ] Password validation works (min 6 chars)
- [ ] Email validation works (valid format)
- [ ] Phone validation works (10 digits, starts with 0)
- [ ] Age validation works (18-65)
- [ ] Required field validation works
- [ ] Submit creates new user successfully
- [ ] Success notification appears
- [ ] Redirects to list page after success
- [ ] Cancel button works with confirmation

#### ✅ **Edit Form**
- [ ] Page loads with existing data
- [ ] Username field is disabled
- [ ] Password field is NOT visible
- [ ] Status dropdown is visible
- [ ] Data pre-fills correctly
- [ ] Date formats correctly (YYYY-MM-DD)
- [ ] Update saves changes successfully
- [ ] Success notification appears
- [ ] Redirects to list page after success
- [ ] Error handling works (invalid data)

#### ✅ **Status Management**
- [ ] Can activate inactive user
- [ ] Can deactivate active user
- [ ] Confirmation dialog appears
- [ ] Success notification appears
- [ ] List refreshes after change
- [ ] Status badge updates correctly

---

## 🚨 Common Issues & Solutions

### **Issue 1: 404 Error on API calls**
```
Error: Request failed with status code 404
```

**Solution:**
- Check `dealer.api.js` endpoints don't have `/api/` prefix
- Correct: `/Users`
- Wrong: `/api/Users`

---

### **Issue 2: 500 Error "Invalid column name"**
```
Microsoft.Data.SqlClient.SqlException: Invalid column name 'ImageUrl'
```

**Solution:**
```bash
cd backend/EVDealer.BE.API
dotnet ef database update
```

---

### **Issue 3: Validation errors not showing**
```javascript
// Make sure error state is being set
if (!formData.email.trim()) {
  newErrors.email = 'Email không được để trống';
}
setErrors(newErrors); // ← Don't forget this!
```

---

### **Issue 4: Date not formatting correctly**
```javascript
// Backend returns: "1990-01-15T00:00:00"
// Input needs: "1990-01-15"

dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
```

---

### **Issue 5: RoleId as string instead of number**
```javascript
// When submitting, convert to number
roleId: parseInt(formData.roleId)
```

---

## 📝 Usage Examples

### **Example 1: Create Sales Executive**
```javascript
const newStaff = {
  username: "nguyenvana",
  password: "NguyenVanA123",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@dealer.com",
  phoneNumber: "0901234567",
  dateOfBirth: "1995-05-15",
  roleId: 3,        // Sales Executive
  dealerId: 5       // Dealer #5
};

const result = await dealerAPI.createUser(newStaff);
```

### **Example 2: Update Phone & Email**
```javascript
const updatedData = {
  username: "nguyenvana",     // Must include
  fullName: "Nguyễn Văn A",
  email: "nguyenvana.new@dealer.com",  // Changed
  phoneNumber: "0909876543",           // Changed
  dateOfBirth: "1995-05-15",
  roleId: 3,
  dealerId: 5
};

const result = await dealerAPI.updateUser(userId, updatedData);
```

### **Example 3: Deactivate Resigned Employee**
```javascript
const result = await dealerAPI.updateUserStatus(userId, "Inactive");

if (result.success) {
  console.log("Employee deactivated successfully");
}
```

---

## 🎯 Future Enhancements

- [ ] **Bulk Import:** Import staff from Excel/CSV
- [ ] **Photo Upload:** Add profile photos
- [ ] **Email Notifications:** Send account credentials to new staff
- [ ] **Password Reset:** Allow admins to reset passwords
- [ ] **Activity Log:** Track who created/updated staff records
- [ ] **Export:** Export staff list to Excel
- [ ] **Advanced Filters:** Filter by join date range, dealer
- [ ] **Pagination:** Add pagination for large staff lists
- [ ] **Delete:** Soft delete functionality
- [ ] **Permissions:** Granular permission management

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. ✅ Backend đang chạy (`https://localhost:7213`)
2. ✅ Database migration đã apply
3. ✅ API endpoints khớp với OpenAPI spec
4. ✅ Browser console có lỗi không
5. ✅ Network tab có response lỗi không

---

**Last Updated:** 2025-01-09  
**Version:** 1.0.0
