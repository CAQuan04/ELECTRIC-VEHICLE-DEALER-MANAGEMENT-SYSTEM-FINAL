import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { AuthService } from '@utils';
import { useAuth } from '@/context/AuthContext';
import { 
  PageContainer, 
  PageHeader, 
  Button, 
  Badge,
  StatCard,
  EmptyState
} from '../../components';
import { Calendar as CalendarIcon, BarChart3, Clock, CheckCircle, PartyPopper, Inbox } from 'lucide-react';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Soft Dark Theme Colors
const THEME = {
  bg: {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800/50',
    card: 'bg-slate-800/80',
    hover: 'hover:bg-slate-700/50',
  },
  border: {
    default: 'border-slate-700/50',
    hover: 'hover:border-cyan-400/50',
    active: 'border-cyan-400',
  },
  text: {
    primary: 'text-slate-100',
    secondary: 'text-slate-300',
    muted: 'text-slate-400',
    accent: 'text-cyan-300',
  }
};

const TestDriveCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    loadAppointments();
  }, [currentMonth]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      const dealerId = currentUser?.dealerId;
      
      if (!dealerId) {
        console.error('❌ No dealerId found');
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      console.log('🔍 Loading test drives for calendar:', { dealerId, startDate, endDate });
      
      const result = await dealerAPI.getTestDrives(dealerId, {
        FromDate: startDate.toISOString().split('T')[0],
        ToDate: endDate.toISOString().split('T')[0],
        Page: 1,
        Size: 1000
      });
      
      console.log('✅ Calendar test drives result:', result);
      
      if (result.success && result.data) {
        const appointmentList = Array.isArray(result.data) ? result.data : [];
        console.log('📅 Calendar appointments:', appointmentList);
        setAppointments(appointmentList);
      } else {
        console.error('❌ Failed to load calendar:', result.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('❌ Error loading calendar:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const appointmentsByDate = useMemo(() => {
    const map = new Map();
    appointments.forEach(apt => {
      const date = new Date(apt.scheduleDatetime).toISOString().split('T')[0];
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date).push(apt);
    });
    return map;
  }, [appointments]);

  const appointmentsForSelectedDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointmentsByDate.get(dateStr) || [];
  }, [selectedDate, appointmentsByDate]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
    };
  }, [appointments]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value + "T12:00:00"));
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
      'pending': 'warning',
      'confirmed': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return labelMap[status] || status;
  };

  if (isLoading && appointments.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Lịch lái thử"
          subtitle="Quản lý và theo dõi lịch hẹn lái thử"
          icon={<CalendarIcon className="w-16 h-16" />}
        />
        <div className="text-center py-16">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
            Đang tải lịch...
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Lịch lái thử"
        subtitle="Quản lý và theo dõi lịch hẹn lái thử"
        icon={<CalendarIcon className="w-16 h-16" />}
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(dealerId ? `/${dealerId}/dealer/test-drives` : '/dealer/test-drives')}
            >
              ← Danh sách
            </Button>
            <Button
              variant="gradient"
              onClick={() => navigate(dealerId ? `/${dealerId}/dealer/test-drives/new` : '/dealer/test-drives/new')}
            >
              + Đăng ký mới
            </Button>
          </div>
        }
      />
      <div className='mt-8 '>
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
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>←</Button>
            <span className="text-lg font-bold dark:text-white text-gray-900 min-w-[200px] text-center">
              Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>→</Button>
          </div>
        )}
</div>
        {viewMode === 'day' && (
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700  dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-emerald-500/20 focus:border-cyan-500 dark:focus:border-emerald-500"
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
          getStatusLabel={getStatusLabel}
          navigate={navigate}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Tổng lịch hẹn"
          value={stats.total}
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Chờ xác nhận"
          value={stats.pending}
          trend={stats.pending > 0 ? 'neutral' : 'up'}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Đã xác nhận"
          value={stats.confirmed}
        />
        <StatCard
          icon={<PartyPopper className="w-6 h-6" />}
          title="Hoàn thành"
          value={stats.completed}
          trend="up"
        />
      </div>
    </PageContainer>
  );
};

// Month View Component
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
    <div className="dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-bold text-sm text-slate-600 dark:text-slate-400 py-3">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

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

// Calendar Day Component
const CalendarDay = ({ day, isToday, isSelected, count, onClick }) => {
  const baseClasses = "aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 relative min-h-[60px] lg:min-h-[80px]";
  
  let conditionalClasses = "dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-xl";
  let dayNumberClasses = "text-xl font-semibold text-slate-700 dark:text-slate-200";

  if (isToday) {
    conditionalClasses = "bg-cyan-50 dark:bg-cyan-900/50 border-2 border-cyan-500";
    dayNumberClasses = "text-base font-bold text-cyan-700 dark:text-cyan-200";
  }
  
  if (isSelected) {
    conditionalClasses = "bg-gradient-to-br from-rose-300 to-slate-500 border-2 border-cyan-500 text-white shadow-xl scale-102";
    dayNumberClasses = "text-base font-bold text-white";
  }

  return (
    <div
      className={`${baseClasses} ${conditionalClasses}`}
      onClick={onClick}
    >
      <div className={dayNumberClasses}>{day}</div>
      {count > 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span className={`${isSelected ? 'bg-white text-emerald-700' : 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-emerald-900'} px-2 py-0.5 rounded-full text-xs font-bold`}>
            {count}
          </span>
        </div>
      )}
    </div>
  );
};

// Day View Component
const DayView = ({ selectedDate, appointments, onBackToMonth, getStatusVariant, getStatusLabel, navigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-slate-100 text-slate-900">
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
      
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments
            .sort((a, b) => new Date(a.scheduleDatetime) - new Date(b.scheduleDatetime))
            .map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                getStatusVariant={getStatusVariant}
                getStatusLabel={getStatusLabel}
                navigate={navigate}
              />
            ))
        ) : (
          <EmptyState
            icon={<Inbox className="w-12 h-12" />}
            title="Không có lịch hẹn"
            message="Không có lịch hẹn nào trong ngày này"
          />
        )}
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, getStatusVariant, getStatusLabel, navigate }) => {
  const time = new Date(appointment.scheduleDatetime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/dealer/test-drives/${appointment.id}`)}
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-cyan-50 dark:bg-cyan-900/50 rounded-xl px-5 py-4 text-center border-2 border-cyan-200 dark:border-cyan-700">
            <div className="text-3xl font-bold dark:text-cyan-300 text-cyan-600">{time}</div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold dark:text-slate-100 text-slate-900 mb-2">
              {appointment.customerName}
            </h4>
            <p className="dark:text-slate-400 text-slate-600 mb-2">
              🚗 Xe: <span className="font-semibold dark:text-slate-300 text-slate-700">{appointment.vehicleModel}</span>
            </p>
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dealer/test-drives/${appointment.id}`);
            }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestDriveCalendar;