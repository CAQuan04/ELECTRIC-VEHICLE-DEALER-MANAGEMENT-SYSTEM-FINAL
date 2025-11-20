# Hướng dẫn cập nhật TestDriveCalendar.jsx

## Mục đích
Thêm nút "Xem lịch chi tiết" để chuyển đến trang TestDriveCalendarDetail

## Cách cập nhật

Tìm phần PageHeader trong file `TestDriveCalendar.jsx` (khoảng dòng 225-245) và thay đổi:

### Code hiện tại:
```jsx
<PageHeader
  title="📅 Lịch lái thử"
  subtitle="Quản lý và theo dõi lịch hẹn lái thử"
  actions={
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={() => navigate('/dealer/test-drives')}
      >
        ← Danh sách
      </Button>
      <Button
        variant="primary"
        icon="+"
        onClick={() => navigate('/dealer/test-drives/new')}
      >
        Đăng ký mới
      </Button>
    </div>
  }
/>
```

### Code mới (thêm nút Xem lịch chi tiết):
```jsx
<PageHeader
  title="📅 Lịch lái thử"
  subtitle="Quản lý và theo dõi lịch hẹn lái thử"
  actions={
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={() => navigate('/dealer/test-drives')}
      >
        ← Danh sách
      </Button>
      <Button
        variant="secondary"
        icon="📆"
        onClick={() => navigate(`/dealer/test-drive/calendar/${selectedDate.toISOString().split('T')[0]}`)}
      >
        Xem lịch chi tiết
      </Button>
      <Button
        variant="primary"
        icon="+"
        onClick={() => navigate('/dealer/test-drives/new')}
      >
        Đăng ký mới
      </Button>
    </div>
  }
/>
```

## Đã hoàn thành
✅ Tạo file TestDriveCalendarDetail.jsx - Trang hiển thị lịch chi tiết theo timeline
✅ Tạo file TestDriveCalendarDetail.css - Style cho trang lịch chi tiết
✅ Thêm export trong features/dealer/index.js
✅ Thêm import trong App.jsx
✅ Thêm route mới: /dealer/test-drive/calendar/:date
✅ Tạo file TestDriveDetail.jsx cơ bản

## Cần làm
⏳ Cập nhật nút trong TestDriveCalendar.jsx theo hướng dẫn trên
