import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { PageContainer, PageHeader, Button, Badge } from '../../components';

// --- Dữ liệu Mock và Hằng số (Đưa ra ngoài component) ---

const mockAppointments = [
  { id: 1, date: '2025-10-26', time: '09:00', customer: 'Nguyễn Văn A', vehicle: 'Model 3', status: 'Đã xác nhận' },
  { id: 2, date: '2025-10-26', time: '10:30', customer: 'Trần Thị B', vehicle: 'Model Y', status: 'Chờ xác nhận' },
  { id: 3, date: '2025-10-27', time: '14:00', customer: 'Lê Văn C', vehicle: 'Model S', status: 'Đã xác nhận' },
  { id: 4, date: '2025-10-28', time: '16:00', customer: 'Phạm Thị D', vehicle: 'Model X', status: 'Đã xác nhận' },
  { id: 5, date: '2025-10-29', time: '11:00', customer: 'Võ Văn E', vehicle: 'Model 3', status: 'Chờ xác nhận' },
  { id: 6, date: '2025-10-30', time: '15:00', customer: 'Hoàng Thị F', vehicle: 'Model Y', status: 'Hoàn thành' },
  // Thêm dữ liệu cho tháng 11 để test
  { id: 7, date: '2025-11-05', time: '09:00', customer: 'Khách A', vehicle: 'Model 3', status: 'Đã xác nhận' },
  { id: 8, date: '2025-11-05', time: '10:00', customer: 'Khách B', vehicle: 'Model Y', status: 'Đã xác nhận' },
  { id: 9, date: '2025-11-05', time: '11:00', customer: 'Khách C', vehicle: 'Model S', status: 'Chờ xác nhận' },
];

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// --- Component Chính ---

const TestDriveCalendar = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date("2025-10-26T12:00:00")); // Đặt ngày mặc định để test
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-10-01T12:00:00")); // Đặt tháng mặc định
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'day'

  useEffect(() => {
    loadAppointments();
  }, [currentMonth]); // Chỉ tải lại khi đổi tháng

  const loadAppointments = async () => {
    try {
      startLoading('Đang tải lịch lái thử...');
      await new Promise(resolve => setTimeout(resolve, 500));
      // TODO: Thay thế bằng API call
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      stopLoading();
    }
  };

  // --- Dữ liệu được tính toán (Tối ưu) ---

  // Tạo một Map các cuộc hẹn theo ngày (YYYY-MM-DD) để tra cứu nhanh
  const appointmentsByDate = useMemo(() => {
    const map = new Map();
    appointments.forEach(apt => {
      const date = apt.date;
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date).push(apt);
    });
    return map;
  }, [appointments]);

  // Lọc danh sách cho chế độ xem ngày
  const appointmentsForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointmentsByDate.get(dateStr) || [];
  }, [selectedDate, appointmentsByDate]);

  // Tính toán số liệu thống kê
  const stats = useMemo(() => {
    return {
      pending: appointments.filter(a => a.status === 'Chờ xác nhận').length,
      confirmed: appointments.filter(a => a.status === 'Đã xác nhận').length,
      completed: appointments.filter(a => a.status === 'Hoàn thành').length,
    };
  }, [appointments]);

  // --- Handlers ---

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value + "T12:00:00")); // Thêm T12:00:00 để tránh lỗi múi giờ
    setViewMode('day');
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      'Chờ xác nhận': 'warning',
      'Đã xác nhận': 'info',
      'Hoàn thành': 'success',
      'Đã hủy': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  // --- Render ---

  return (
    <PageContainer>
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
              onClick={() => navigate('/dealer/test-drives/new')} // Đã sửa
            >
              Đăng ký mới
            </Button>
          </div>
        }
      />

      {/* View Mode Switcher */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            📅 Theo tháng
          </Button>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'outline'}
            onClick={() => setViewMode('day')}
          >
            📋 Theo ngày
          </Button>
        </div>
        
        {viewMode === 'month' && (
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}> ← </Button>
            <span className="text-lg font-bold dark:text-white text-gray-900 min-w-[200px] text-center">
              Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}> → </Button>
          </div>
        )}
        
        {viewMode === 'day' && (
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="px-4 py-2 rounded-lg border dark:border-white/10 border-gray-300 dark:bg-gray-800 bg-white dark:text-gray-700 text-gray-900"
          />
        )}
      </div>

      {/* Calendar View */}
      {viewMode === 'month' ? (
        <MonthView 
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          appointmentsByDate={appointmentsByDate}
          onDayClick={handleDayClick}
        />
      ) : (
        <DayView 
          selectedDate={selectedDate}
          appointments={appointmentsForSelectedDate}
          onBackToMonth={() => setViewMode('month')}
          getStatusVariant={getStatusVariant}
        />
      )}

      <CalendarStats stats={stats} />
      
      {/* KHÔNG CẦN STYLE JSX NỮA */}
    </PageContainer>
  );
};

// --- Component Con: MonthView ---

const MonthView = ({ currentMonth, selectedDate, appointmentsByDate, onDayClick }) => {
  const { daysInMonth, startingDayOfWeek } = useMemo(() => {
    const date = currentMonth;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
    };
  }, [currentMonth]);

  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-container bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="calendar-header grid grid-cols-7 gap-2 mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-bold text-xs md:text-sm text-gray-600 dark:text-gray-800 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid grid grid-cols-7 gap-1 md:gap-2">
        {/* Empty cells */}
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* Days of the month */}
        {monthDays.map(day => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateStr = date.toISOString().split('T')[0];
          const dayAppointments = appointmentsByDate.get(dateStr) || [];
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();

          return (
            <CalendarDay
              key={day}
              day={day}
              isToday={isToday}
              isSelected={isSelected}
              count={dayAppointments.length}
              onClick={() => onDayClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
};

// --- Component Con: CalendarDay ---

const CalendarDay = ({ day, isToday, isSelected, count, onClick }) => {
  // Xây dựng class động bằng Tailwind
  const baseClasses = "aspect-square flex flex-col items-center justify-center rounded-lg md:rounded-xl cursor-pointer transition-all duration-300 relative min-h-[60px] md:min-h-[80px] lg:min-h-[100px]";
  
  let conditionalClasses = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:scale-105 hover:border-blue-500 hover:shadow-lg dark:hover:border-blue-400";
  let dayNumberClasses = "text-xl md:text-base font-semibold text-gray-900 dark:text-black";

  if (isToday) {
    conditionalClasses = "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500";
  }
  
  if (isSelected) {
    conditionalClasses = "bg-blue-300 border-blue-500 text-white shadow-lg scale-105";
    dayNumberClasses = "text-xl md:text-base font-bold text-black";
  }

  return (
    <div
      className={`${baseClasses} ${conditionalClasses}`}
      onClick={onClick}
    >
      <div className={dayNumberClasses}>{day}</div>
      {count > 0 && !isSelected && (
        <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2">
           <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
             {count}
           </span>
        </div>
      )}
      {count > 0 && isSelected && (
         <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2">
           <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
             {count}
           </span>
        </div>
      )}
    </div>
  );
};

// --- Component Con: DayView ---

const DayView = ({ selectedDate, appointments, onBackToMonth, getStatusVariant }) => {
  return (
    <div className="day-view">
      <div className="day-view-header flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h3 className="text-xl md:text-2xl font-bold dark:text-white text-gray-900">
          Lịch hẹn ngày {selectedDate.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <Button variant="outline" onClick={onBackToMonth}>
          ← Quay lại tháng
        </Button>
      </div>
      
      <div className="appointments-timeline space-y-4">
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              getStatusVariant={getStatusVariant}
            />
          ))
        ) : (
          <div className="empty-calendar text-center py-20 dark:bg-gray-800 bg-gray-50 rounded-xl border-2 border-dashed dark:border-gray-700 border-gray-300">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg dark:text-gray-400 text-gray-600">Không có lịch hẹn nào trong ngày này</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Component Con: AppointmentCard ---

const AppointmentCard = ({ appointment, getStatusVariant }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="appointment-card group dark:bg-gray-800 bg-white rounded-xl p-4 md:p-6 border dark:border-gray-700 border-gray-200 shadow-md hover:shadow-xl dark:hover:border-blue-500 hover:border-blue-500 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="appointment-time dark:bg-blue-900/50 bg-blue-50 rounded-lg px-4 py-3 text-center border dark:border-blue-700 border-blue-200">
            <div className="text-2xl font-bold dark:text-blue-300 text-blue-600">{appointment.time}</div>
          </div>
          
          <div className="appointment-details flex-1">
            <h4 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
              {appointment.customer}
            </h4>
            <p className="dark:text-gray-400 text-gray-600 mb-2">
              🚗 Xe: <span className="font-semibold dark:text-gray-300 text-gray-700">{appointment.vehicle}</span>
            </p>
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>
         </div>
        
        <div className="appointment-actions flex gap-2 self-start md:self-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dealer/test-drives/${appointment.id}`)} // Giả sử có trang chi tiết
          >
            Chi tiết
          </Button>
          {appointment.status === 'Chờ xác nhận' && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => alert(`Xác nhận lịch ${appointment.id}`)}
           >
              Xác nhận
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Component Con: CalendarStats ---

const CalendarStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    <StatCard
      icon="📋"
      value={stats.pending}
      label="Chờ xác nhận"
      color="blue"
    />
    <StatCard
      icon="✅"
      value={stats.confirmed}
      label="Đã xác nhận"
      color="green"
    />
    <StatCard
      icon="🎉"
      value={stats.completed}
      label="Hoàn thành"
      color="purple"
    />
  </div>
);

// --- Component Con: StatCard ---

const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: "dark:from-blue-900/50 dark:to-blue-800/30 from-blue-50 to-blue-100 dark:border-blue-500/30 border-blue-200 dark:text-blue-300 text-blue-700",
    green: "dark:from-green-900/50 dark:to-green-800/30 from-green-50 to-green-100 dark:border-green-500/30 border-green-200 dark:text-green-300 text-green-700",
    purple: "dark:from-purple-900/50 dark:to-purple-800/30 from-purple-50 to-purple-100 dark:border-purple-500/30 border-purple-200 dark:text-purple-300 text-purple-700",
  };

  return (
    <div className={`stat-card bg-gradient-to-br rounded-xl p-6 border shadow-md ${colorClasses[color]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-2xl font-bold dark:text-white text-gray-900">
        {value}
      </div>
      <div className="font-medium">{label}</div>
    </div>
  );
};

export default TestDriveCalendar;