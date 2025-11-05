# 📋 Feedback & Complaint Management Module

Module quản lý phản hồi và khiếu nại từ khách hàng cho hệ thống Dealer.

## 🎯 Tính năng chính

### 1. Danh sách phản hồi (FeedbackList)
- ✅ Hiển thị tất cả phản hồi/khiếu nại
- ✅ Tìm kiếm theo khách hàng, nội dung, mã
- ✅ Lọc theo loại: Tích cực, Tiêu cực, Khiếu nại
- ✅ Lọc theo trạng thái: Chờ xử lý, Đang xử lý, Đã giải quyết
- ✅ Thống kê metrics: Tổng, Tích cực, Khiếu nại, Chờ xử lý
- ✅ Xóa phản hồi
- ✅ Gửi thông báo cho khách hàng

### 2. Tạo/Sửa phản hồi (FeedbackForm)
- ✅ Chọn khách hàng từ danh sách
- ✅ Chọn loại: Positive, Negative, Complaint
- ✅ Nhập nội dung chi tiết
- ✅ Liên kết với đơn hàng (tùy chọn)
- ✅ Cập nhật trạng thái xử lý (edit mode)
- ✅ Thêm ghi chú xử lý (edit mode)
- ✅ Validation đầy đủ

### 3. Chi tiết phản hồi (FeedbackDetail)
- ✅ Xem đầy đủ thông tin phản hồi
- ✅ Thông tin khách hàng
- ✅ Nội dung và ghi chú xử lý
- ✅ Cập nhật trạng thái nhanh
- ✅ Gửi thông báo cho khách hàng
- ✅ Lịch sử timeline
- ✅ Chỉnh sửa và xóa

## 🗂️ Cấu trúc files

```
Feedback/
├── FeedbackList.jsx      # Danh sách phản hồi
├── FeedbackForm.jsx      # Form tạo/sửa
├── FeedbackDetail.jsx    # Chi tiết & xử lý
├── index.js              # Export module
└── README.md             # Tài liệu
```

## 🔌 API Endpoints

### Đã thêm vào `dealer.api.js`:

```javascript
// Lấy danh sách phản hồi
getFeedbacks(params)
// Params: CustomerId, Type, Status, StartDate, EndDate

// Lấy chi tiết phản hồi
getFeedbackById(feedbackId)

// Tạo phản hồi mới
createFeedback(feedbackData)
// Data: customerId, type, content, relatedOrderId

// Cập nhật phản hồi
updateFeedback(feedbackId, updateData)
// Data: customerId, type, content, relatedOrderId, status, note

// Cập nhật trạng thái
updateFeedbackStatus(feedbackId, status, note)
// Status: Pending, InProgress, Resolved

// Xóa phản hồi
deleteFeedback(feedbackId)

// Lấy thống kê
getFeedbackStatistics()

// Gửi thông báo
notifyCustomerFeedback(feedbackId)
```

## 🎨 Components được sử dụng

Tái sử dụng từ `dealer/components`:

### Layout
- `PageContainer` - Container chính
- `PageHeader` - Header với title, description, action
- `InfoSection` - Section với icon và title

### UI
- `Button` - Nút với variants (primary, secondary, info, danger)
- `Badge` - Badge status với colors
- `Table` - Bảng động với columns config
- `SearchBar` - Tìm kiếm
- `EmptyState` - Hiển thị khi không có data
- `MetricCard` - Thẻ thống kê

### Form
- `FormGroup` - Wrapper cho form field
- `Label` - Label với icon và required
- `Input` - Input field
- `Select` - Dropdown select với options
- `ActionBar` - Action buttons container

### Icons (Lucide React)
- MessageSquare, MessageSquarePlus
- ThumbsUp, ThumbsDown, AlertTriangle
- Clock, PlayCircle, CheckCircle2
- User, Mail, Phone, Calendar
- Eye, Edit, Trash2, Bell
- FileText, ShoppingCart

## 📊 Data Models

### Feedback Object
```javascript
{
  feedbackId: number,
  customerId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  dealerId: number,
  type: 'Positive' | 'Negative' | 'Complaint',
  content: string,
  relatedOrderId: number | null,
  status: 'Pending' | 'InProgress' | 'Resolved',
  note: string,
  createdBy: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

## 🚀 Routing cần thêm

Thêm vào router của dealer:

```javascript
// In DealerRoutes.jsx or similar
import { FeedbackList, FeedbackForm, FeedbackDetail } from './pages/Feedback';

// Routes
<Route path="/feedback" element={<FeedbackList />} />
<Route path="/feedback/create" element={<FeedbackForm />} />
<Route path="/feedback/edit/:feedbackId" element={<FeedbackForm />} />
<Route path="/feedback/:feedbackId" element={<FeedbackDetail />} />
```

## 🎯 Use Cases đã implement

### UC: Ghi nhận phản hồi và xử lý khiếu nại

✅ **Actor**: Dealer Staff

✅ **Flow**:
1. Staff truy cập module "Phản hồi & khiếu nại"
2. Chọn "Tạo phản hồi mới"
3. Nhập thông tin:
   - Chọn khách hàng
   - Chọn loại: Positive/Negative/Complaint
   - Nhập nội dung
   - Nhập mã đơn hàng (optional)
4. Hệ thống lưu vào DB với status = "Pending"
5. Nếu là khiếu nại → Gửi thông báo tự động
6. Staff cập nhật trạng thái: Pending → InProgress → Resolved
7. Thêm ghi chú xử lý
8. Sau hoàn tất → Gửi thông báo kết quả cho khách hàng
9. Xem lịch sử phản hồi của khách hàng

✅ **Domain**: Feedback, Customer, Order, Employee, Notification

## 🎨 Theme & Styling

Module sử dụng design system nhất quán:

- **Dark mode support** ✅
- **Gradient badges** với shadow effects
- **Rounded corners** (rounded-2xl)
- **Hover effects** với scale & shadow
- **Focus rings** với cyan color
- **Backdrop blur** effects
- **Responsive grid** layouts
- **Icon integration** với Lucide React

## 📝 Validation Rules

### FeedbackForm:
- **customerId**: Required
- **type**: Required (Positive/Negative/Complaint)
- **content**: Required, min 10 ký tự
- **relatedOrderId**: Optional, number
- **status**: Auto = Pending (edit mode)
- **note**: Optional

## 🔔 Notifications

Module sử dụng `@utils/notifications`:

- ✅ Success: Tạo, cập nhật, xóa thành công
- ✅ Error: Lỗi API, validation
- ✅ Warning: Validation form
- ✅ Info: Gửi thông báo

## 🧪 Testing Checklist

- [ ] Tạo phản hồi mới (Positive)
- [ ] Tạo khiếu nại (Complaint)
- [ ] Tìm kiếm phản hồi
- [ ] Lọc theo loại
- [ ] Lọc theo trạng thái
- [ ] Xem chi tiết
- [ ] Cập nhật trạng thái
- [ ] Thêm ghi chú xử lý
- [ ] Gửi thông báo khách hàng
- [ ] Chỉnh sửa phản hồi
- [ ] Xóa phản hồi
- [ ] Kiểm tra metrics
- [ ] Dark mode
- [ ] Responsive mobile

## 🔧 Backend Requirements

Cần implement các endpoints sau ở Backend:

```csharp
// FeedbackController.cs
[HttpGet] GetFeedbacks(filters)
[HttpGet("{id}")] GetFeedbackById(id)
[HttpPost] CreateFeedback(dto)
[HttpPut("{id}")] UpdateFeedback(id, dto)
[HttpPatch("{id}/status")] UpdateFeedbackStatus(id, status, note)
[HttpDelete("{id}")] DeleteFeedback(id)
[HttpGet("statistics")] GetStatistics()
[HttpPost("{id}/notify")] NotifyCustomer(id)
```

## 📚 Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "lucide-react": "latest"
}
```

## 🎓 Best Practices

1. **Component Reuse**: Tái sử dụng components từ `dealer/components`
2. **Consistent Styling**: Follow theme design system
3. **Error Handling**: Try-catch với notifications
4. **Loading States**: Sử dụng `usePageLoading`
5. **Validation**: Client-side validation trước khi submit
6. **Responsive**: Grid layouts responsive
7. **Dark Mode**: Support dark mode toàn bộ
8. **Icons**: Consistent icon usage
9. **User Feedback**: Clear notifications
10. **Navigation**: Proper routing và back buttons

## 🚀 Next Steps

1. Thêm routes vào DealerRoutes
2. Test với Backend API
3. Thêm vào navigation menu
4. Implement notification system
5. Add permission checks
6. Analytics tracking
7. Export/Print reports

---

**Version**: 1.0.0  
**Created**: 2025-01-06  
**Author**: AI Assistant  
**Status**: Ready for Integration ✅
