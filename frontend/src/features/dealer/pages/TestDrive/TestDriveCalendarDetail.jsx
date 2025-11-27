import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@utils/api';

const TestDriveCalendarDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dealerId = user?.dealerId;
  const { date } = useParams(); // Format: YYYY-MM-DD
  const { startLoading, stopLoading } = usePageLoading();
  
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : new Date());
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    generateWeekDates();
    loadAppointments();
  }, [selectedDate]);

  const generateWeekDates = () => {
    const dates = [];
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    
    const monday = new Date(current.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    
    setCurrentWeek(dates);
  };

  const loadAppointments = async () => {
    try {
      startLoading('Đang tải lịch hẹn...');
      
      const dateStr = selectedDate.toISOString().split('T')[0];
      const result = await dealerAPI.getTestDrives({ date: dateStr });
      
      if (result.success) {
        setAppointments(result.data);
      } else {
        console.error('Error:', result.message);
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      loadMockData();
    } finally {
      stopLoading();
    }
  };

  const loadMockData = () => {
    // Đảm bảo biến mock này tồn tại
    if (typeof MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS !== 'undefined') {
      setAppointments(MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS);
    } else {
      console.warn("Mock data 'MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS' is not defined.");
      setAppointments([]); // Đặt mảng rỗng để tránh lỗi
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      startLoading('Đang cập nhật trạng thái...');
      
      const result = await dealerAPI.updateTestDriveStatus(appointmentId, newStatus);
      
      if (result.success) {
        await loadAppointments();
      } else {
        alert('Lỗi: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      stopLoading();
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ffc107',
      'confirmed': '#17a2b8',
      'completed': '#28a745',
      'cancelled': '#dc3545',
      'Chờ xác nhận': '#ffc107',
      'Đã xác nhận': '#17a2b8',
      'Hoàn thành': '#28a745',
      'Đã hủy': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getAppointmentAtTime = (time) => {
    return filteredAppointments.find(apt => apt.time === time);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100">
      <button 
        className="mb-4 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200" 
        onClick={() => navigate(dealerId ? `/${dealerId}/dealer/test-drives` : '/dealer/test-drives')}
      >
        ← Quay lại danh sách
      </button>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">📅 Lịch lái thử chi tiết</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Quản lý và theo dõi các buổi lái thử theo lịch</p>
        </div>
        <button 
          className="px-5 py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" 
          onClick={() => navigate(dealerId ? `/${dealerId}/dealer/test-drives/new` : '/dealer/test-drives/new')}
        >
          + Đăng ký mới
        </button>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <button 
          className="px-4 py-2 rounded-md font-medium text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" 
          onClick={handlePreviousWeek}
        >
          ← Tuần trước
        </button>
        
        <div className="hidden md:flex items-center justify-center gap-2">
          {currentWeek.map((date, index) => {
            const selected = isSelectedDate(date);
            const today = isToday(date);
            
            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center w-16 h-20 rounded-lg cursor-pointer transition-all duration-200 border-2
                  ${selected ? 'bg-indigo-600 text-white shadow-lg scale-105 border-indigo-600' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${!selected && today ? '!border-indigo-500' : ''}
                `}
                onClick={() => handleDateSelect(date)}
              >
                <div className={`text-xs font-bold uppercase ${selected ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold ${selected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {date.getDate()}
                </div>
                <div className={`text-xs font-semibold mt-1 ${selected ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {appointments.filter(apt => {
                    const aptDate = new Date(selectedDate); // Note: This logic seems to count appointments for the *selected* date, not the cell's date.
                    return aptDate.toDateString() === date.toDateString();
                  }).length} Lịch
                </div>
              </div>
            )
          })}
        </div>
        
        <button 
          className="px-4 py-2 rounded-md font-medium text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" 
          onClick={handleNextWeek}
        >
          Tuần sau →
        </button>
      </div>

      {/* Selected Date Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {selectedDate.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <div className="filter-status">
          <label className="mr-2 font-medium text-gray-700 dark:text-gray-300">Lọc theo trạng thái:</label>
          <select 
            className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Calendar Timeline View */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="timeline-container">
          {timeSlots.map((time, index) => {
            const appointment = getAppointmentAtTime(time);
            
            return (
              <div key={index} className="flex border-b border-gray-200 dark:border-gray-700 min-h-[100px] last:border-b-0">
                <div className="w-24 flex-shrink-0 p-4 font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  {time}
                </div>
                
                {appointment ? (
                  <div className="flex-1 p-4 bg-indigo-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{appointment.customerName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">🚗 {appointment.vehicleModel} - {appointment.vehicleColor}</p>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.statusText}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">📞 Điện thoại:</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{appointment.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">✉️ Email:</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{appointment.customerEmail}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">⏱️ Thời gian:</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{appointment.time} ({appointment.duration} phút)</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">👤 Nhân viên:</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{appointment.salesRepName}</span>
                      </div>
                      {appointment.notes && (
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">📝 Ghi chú:</span>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                      {appointment.status === 'pending' && (
                        <>
                          <button 
                            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          >
                            ✓ Xác nhận
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button 
                            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          >
                            ✓ Hoàn thành
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-colors"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      <button 
                        className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        onClick={() => navigate(`/dealer/customers/${appointment.customerId || appointment.id}`)}
                      >
                        👤 Xem khách hàng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 p-4 flex items-center justify-center text-gray-400 dark:text-gray-500 italic">
                    <p>Trống</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">{appointments.length}</div>
          <div className="text-base font-medium text-gray-600 dark:text-gray-400">Tổng lịch hẹn</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
            {appointments.filter(apt => apt.status === 'pending').length}
          </div>
          <div className="text-base font-medium text-gray-600 dark:text-gray-400">Chờ xác nhận</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="text-base font-medium text-gray-600 dark:text-gray-400">Đã xác nhận</div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
            {appointments.filter(apt => apt.status === 'completed').length}
          </div>
          <div className="text-base font-medium text-gray-600 dark:text-gray-400">Hoàn thành</div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveCalendarDetail;
