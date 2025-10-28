# 📅 Test Drive Calendar - Hệ Thống Lịch Lái Thử

## 📋 Tổng Quan

Hệ thống lịch lái thử (Test Drive Calendar) cung cấp giao diện trực quan để xem và quản lý các lịch hẹn lái thử theo tháng và theo ngày, giúp dealer dễ dàng theo dõi và sắp xếp lịch trình.

## 🎯 Tính Năng Chính

### 1. **Hai Chế Độ Xem**

#### 📅 Chế Độ Tháng (Month View)
- Hiển thị toàn bộ tháng dưới dạng lưới lịch
- Mỗi ngày hiển thị số lượng lịch hẹn bằng badge
- Click vào ngày để xem chi tiết lịch hẹn
- Điều hướng qua lại giữa các tháng
- Highlight ngày hôm nay và ngày được chọn

#### 📋 Chế Độ Ngày (Day View)
- Hiển thị danh sách chi tiết tất cả lịch hẹn trong ngày
- Sắp xếp theo thời gian
- Hiển thị đầy đủ thông tin: Khách hàng, xe, giờ, trạng thái
- Hành động nhanh: Xem chi tiết, xác nhận lịch

### 2. **Thống Kê Nhanh**
- Số lượng lịch chờ xác nhận
- Số lượng lịch đã xác nhận
- Số lượng lịch hoàn thành

### 3. **Điều Hướng Linh Hoạt**
- Chuyển đổi giữa chế độ tháng và ngày
- Điều hướng giữa các tháng
- Chọn ngày cụ thể bằng date picker
- Quay lại danh sách lái thử
- Tạo lịch hẹn mới

## 🏗️ Kiến Trúc Component

### File Structure
```
TestDrive/
├── TestDriveList.jsx           # Danh sách lái thử (có nút "Xem lịch")
├── TestDriveCalendar.jsx       # Giao diện lịch (Month + Day view)
└── README_CALENDAR.md          # Tài liệu này
```

### Component Hierarchy
```jsx
TestDriveCalendar
├── PageContainer
│   ├── PageHeader (title + actions)
│   ├── ViewModeSwitcher (Month/Day buttons)
│   ├── MonthNavigation (← Month Year →)
│   ├── CalendarGrid (Month View)
│   │   ├── WeekdayHeaders
│   │   └── CalendarDays[]
│   │       ├── DayNumber
│   │       └── AppointmentCountBadge
│   ├── DayView (Day View)
│   │   ├── DayViewHeader
│   │   └── AppointmentsTimeline[]
│   │       └── AppointmentCard
│   │           ├── Time
│   │           ├── Customer Info
│   │           ├── Vehicle
│   │           ├── Status Badge
│   │           └── Action Buttons
│   └── QuickStats
│       ├── PendingCount
│       ├── ConfirmedCount
│       └── CompletedCount
```

## 💻 Cách Sử Dụng

### Từ TestDriveList

```jsx
// Trong TestDriveList.jsx
<PageHeader
  title="🚗 Quản lý lái thử"
  actions={
    <div className="flex gap-3">
      <Button 
        variant="outline"
        icon="📅"
        onClick={() => navigate('/dealer/test-drives/calendar')}
      >
        Xem lịch
      </Button>
      <Button variant="primary" icon="+" onClick={...}>
        Đăng ký mới
      </Button>
    </div>
  }
/>
```

### State Management

```javascript
const [appointments, setAppointments] = useState([]);
const [selectedDate, setSelectedDate] = useState(new Date());
const [viewMode, setViewMode] = useState('month'); // 'month' or 'day'
const [currentMonth, setCurrentMonth] = useState(new Date());
```

### Calendar Helpers

```javascript
// Lấy số ngày trong tháng và ngày đầu tuần
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  return { daysInMonth, startingDayOfWeek };
};

// Lấy lịch hẹn cho một ngày cụ thể
const getAppointmentsForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  return appointments.filter(apt => apt.date === dateStr);
};

// Điều hướng tháng
const navigateMonth = (direction) => {
  const newMonth = new Date(currentMonth);
  newMonth.setMonth(currentMonth.getMonth() + direction);
  setCurrentMonth(newMonth);
};
```

## 🔌 API Integration

### Endpoint (Tương Lai)

```javascript
// TODO: Thay thế mock data bằng API call thực
const loadAppointments = async () => {
  try {
    startLoading('Đang tải lịch lái thử...');
    
    // Calculate date range for current month
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // API Call
    const response = await apiClient.get('/api/test-drives', {
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dealerShopId: AuthService.getDealerShopId() // Shop-level filtering
      }
    });
    
    setAppointments(response.data);
  } catch (error) {
    console.error('Error loading appointments:', error);
    // Show error notification
  } finally {
    stopLoading();
  }
};
```

### Expected API Response Format

```json
[
  {
    "id": 1,
    "date": "2025-10-26",
    "time": "09:00",
    "customer": "Nguyễn Văn A",
    "customerId": "C001",
    "vehicle": "Model 3",
    "vehicleId": "V123",
    "status": "Đã xác nhận",
    "dealerShopId": "SHOP001"
  },
  {
    "id": 2,
    "date": "2025-10-26",
    "time": "10:30",
    "customer": "Trần Thị B",
    "customerId": "C002",
    "vehicle": "Model Y",
    "vehicleId": "V456",
    "status": "Chờ xác nhận",
    "dealerShopId": "SHOP001"
  }
]
```

### API Endpoints Cần Thiết

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test-drives` | Lấy danh sách lịch hẹn (filter by date range, shopId) |
| GET | `/api/test-drives/:id` | Lấy chi tiết một lịch hẹn |
| POST | `/api/test-drives` | Tạo lịch hẹn mới |
| PUT | `/api/test-drives/:id` | Cập nhật lịch hẹn |
| PUT | `/api/test-drives/:id/confirm` | Xác nhận lịch hẹn |
| DELETE | `/api/test-drives/:id` | Hủy lịch hẹn |

## 🎨 Styling Features

### CSS Variables Used
```css
--bg-secondary: Background cho calendar cells
--border-color: Border cho calendar cells
--primary-color: Highlight color cho hover/selected
--text-primary: Text color
```

### Responsive Design
- Desktop: Full calendar grid với 7 cột
- Tablet: Calendar thu nhỏ, min-height 60px
- Mobile: Compact view với smaller badges

### Dark Mode Support
- Tự động chuyển đổi theo theme
- Gradient colors điều chỉnh cho dark/light
- Border và shadow tối ưu cho cả hai chế độ

### Visual Indicators

**Ngày hôm nay:**
```css
.calendar-day.today {
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2));
}
```

**Ngày được chọn:**
```css
.calendar-day.selected {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: #1d4ed8;
}
```

**Ngày có lịch hẹn:**
```css
.calendar-day.has-appointments::after {
  content: '';
  position: absolute;
  bottom: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}
```

## 🎯 User Flows

### Flow 1: Xem Lịch Tháng
```
User ở TestDriveList 
  → Click "Xem lịch" button
    → Navigate to /dealer/test-drives/calendar
      → Default: Month view hiển thị
        → User thấy toàn bộ tháng với appointment counts
          → Click vào ngày có lịch
            → Chuyển sang Day view của ngày đó
```

### Flow 2: Xem Chi Tiết Ngày
```
User ở Month view
  → Click ngày trên calendar
    → Chuyển sang Day view
      → Thấy danh sách chi tiết appointments
        → Click "Chi tiết" button
          → Navigate to /dealer/test-drives/:id
```

### Flow 3: Điều Hướng Tháng
```
User ở Month view
  → Click "←" button
    → currentMonth.setMonth(month - 1)
      → Calendar re-render với tháng trước
        → Load appointments cho tháng mới
```

### Flow 4: Xác Nhận Lịch
```
User ở Day view
  → Thấy appointment có status "Chờ xác nhận"
    → Click "Xác nhận" button
      → API call: PUT /api/test-drives/:id/confirm
        → Status update to "Đã xác nhận"
          → UI re-render với badge mới
```

## 🧪 Testing Scenarios

### Test 1: Calendar Rendering
- [ ] Month view hiển thị đúng số ngày trong tháng
- [ ] Ngày đầu tháng bắt đầu đúng thứ trong tuần
- [ ] Ngày hôm nay được highlight
- [ ] Badge đếm appointment chính xác

### Test 2: Navigation
- [ ] Click ngày chuyển sang Day view
- [ ] "←" và "→" buttons điều hướng tháng đúng
- [ ] Date picker cập nhật selectedDate
- [ ] "Quay lại tháng" button hoạt động

### Test 3: Data Display
- [ ] Appointments hiển thị đúng ngày
- [ ] Status badge hiển thị đúng màu
- [ ] Time sorting đúng trong Day view
- [ ] Quick stats tính toán chính xác

### Test 4: Responsive
- [ ] Calendar responsive trên mobile
- [ ] Buttons stack properly trên màn hình nhỏ
- [ ] Touch interactions hoạt động tốt

### Test 5: Shop Access Control
- [ ] Chỉ hiển thị appointments của shop hiện tại
- [ ] API call include dealerShopId filter
- [ ] Cross-shop data không accessible

## 📊 Performance Optimization

### Current Optimizations
- Mock data load trong 800ms
- React re-renders tối ưu với proper keys
- Conditional rendering cho empty states

### Future Optimizations
```javascript
// 1. Memoize calendar calculations
const calendarDays = useMemo(() => {
  return renderMonthView();
}, [currentMonth, appointments]);

// 2. Debounce month navigation
const debouncedNavigate = useCallback(
  debounce((direction) => navigateMonth(direction), 300),
  []
);

// 3. Lazy load appointments khi hover ngày
const [hoveredDayAppointments, setHoveredDayAppointments] = useState(null);

// 4. Virtual scrolling cho Day view nếu có nhiều appointments
```

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] **Drag & Drop**: Kéo thả để reschedule appointments
- [ ] **Week View**: Thêm chế độ xem theo tuần
- [ ] **Recurring Appointments**: Lịch định kỳ
- [ ] **Color Coding**: Màu theo loại xe hoặc status
- [ ] **Export Calendar**: Xuất lịch sang iCal/Google Calendar
- [ ] **Notification**: Nhắc nhở trước appointment
- [ ] **Conflict Detection**: Cảnh báo lịch trùng

### Advanced Features
- [ ] **Multi-select Days**: Chọn nhiều ngày để batch operations
- [ ] **Search & Filter**: Tìm kiếm appointment theo customer/vehicle
- [ ] **Print View**: In lịch theo tháng/tuần
- [ ] **Analytics**: Thống kê lịch hẹn theo thời gian
- [ ] **Integration**: Sync với external calendar apps

## 🔗 Route Configuration

### App.jsx Route Setup
```jsx
// Route đã được cấu hình trong App.jsx
<Route path="/dealer/test-drives/calendar" element={
  <DealerGuard>
    <DealerShopGuard>
      <DealerLayout>
        <TestDriveCalendar />
      </DealerLayout>
    </DealerShopGuard>
  </DealerGuard>
} />
```

### Related Routes
- `/dealer/test-drives` - Danh sách lái thử (TestDriveList)
- `/dealer/test-drives/calendar` - Lịch lái thử (TestDriveCalendar)
- `/dealer/test-drives/schedule` - Đăng ký lái thử mới
- `/dealer/test-drives/:id` - Chi tiết lái thử

## 📚 Dependencies

### Components Used
- `PageContainer` - Layout wrapper
- `PageHeader` - Header với title và actions
- `Button` - Action buttons
- `Badge` - Status indicators

### Hooks Used
- `useState` - Component state management
- `useEffect` - Data loading lifecycle
- `useNavigate` - React Router navigation
- `usePageLoading` - Global loading state

### Utilities
- `AuthService.getDealerShopId()` - Shop context (future use)

## 🐛 Troubleshooting

### Issue: Calendar không hiển thị appointments
**Solution:** Kiểm tra format date trong mock data phải match với `YYYY-MM-DD`

### Issue: Ngày đầu tháng sai vị trí
**Solution:** Kiểm tra `startingDayOfWeek` calculation, JavaScript getDay() returns 0-6 (Sunday=0)

### Issue: Navigation buttons không hoạt động
**Solution:** Đảm bảo `currentMonth` state được update và trigger useEffect

### Issue: Dark mode colors không đúng
**Solution:** Sử dụng CSS variables từ theme system thay vì hardcode colors

## 📝 Notes

- **Locale:** Calendar sử dụng locale 'vi-VN' cho date formatting
- **Time Zone:** Tất cả dates nên được handle với local timezone
- **Week Start:** Calendar bắt đầu từ Chủ Nhật (CN) theo chuẩn Việt Nam
- **Shop Isolation:** Tương lai sẽ filter appointments theo `dealerShopId`

---

**Created:** 2025-10-26  
**Last Updated:** 2025-10-26  
**Version:** 1.0.0  
**Status:** ✅ Implementation Complete
