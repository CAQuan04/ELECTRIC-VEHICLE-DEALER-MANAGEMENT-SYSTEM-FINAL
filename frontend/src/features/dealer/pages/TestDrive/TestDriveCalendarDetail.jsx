import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@utils/api';
import { MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS } from '../../data/mockData';
import './TestDriveCalendarDetail.css';

const TestDriveCalendarDetail = () => {
  const navigate = useNavigate();
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
        // Fallback to mock data for demo
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
    const mockAppointments = MOCK_TEST_DRIVE_DETAIL_APPOINTMENTS;
    
    setAppointments(mockAppointments);
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
        // Reload appointments
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
    <div className="test-drive-calendar-detail-page">
      <button className="btn-back" onClick={() => navigate('/dealer/test-drive')}>
        ← Quay lại danh sách
      </button>

      <div className="page-header">
        <div>
          <h1>📅 Lịch lái thử chi tiết</h1>
          <p className="subtitle">Quản lý và theo dõi các buổi lái thử theo lịch</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/dealer/test-drives/new')}
        >
          + Đăng ký mới
        </button>
      </div>

      {/* Week Navigator */}
      <div className="week-navigator">
        <button className="btn-nav" onClick={handlePreviousWeek}>
          ← Tuần trước
        </button>
        
        <div className="week-dates">
          {currentWeek.map((date, index) => (
            <div
              key={index}
              className={`date-cell ${isToday(date) ? 'today' : ''} ${isSelectedDate(date) ? 'selected' : ''}`}
              onClick={() => handleDateSelect(date)}
            >
              <div className="day-name">
                {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </div>
              <div className="day-number">
                {date.getDate()}
              </div>
              <div className="appointment-count">
                {appointments.filter(apt => {
                  const aptDate = new Date(selectedDate);
                  return aptDate.toDateString() === date.toDateString();
                }).length}
              </div>
            </div>
          ))}
        </div>
        
        <button className="btn-nav" onClick={handleNextWeek}>
          Tuần sau →
        </button>
      </div>

      {/* Selected Date Info */}
      <div className="selected-date-info">
        <h2>
          {selectedDate.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
        <div className="filter-status">
          <label>Lọc theo trạng thái:</label>
          <select 
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
      <div className="calendar-timeline">
        <div className="timeline-container">
          {timeSlots.map((time, index) => {
            const appointment = getAppointmentAtTime(time);
            
            return (
              <div key={index} className="timeline-slot">
                <div className="time-label">{time}</div>
                
                {appointment ? (
                  <div className="appointment-detail-card">
                    <div className="appointment-header">
                      <div>
                        <h3>{appointment.customerName}</h3>
                        <p className="vehicle-info">🚗 {appointment.vehicleModel} - {appointment.vehicleColor}</p>
                      </div>
                      <span 
                        className="status-badge-large"
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.statusText}
                      </span>
                    </div>
                    
                    <div className="appointment-info">
                      <div className="info-row">
                        <span className="label">📞 Điện thoại:</span>
                        <span>{appointment.customerPhone}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">✉️ Email:</span>
                        <span>{appointment.customerEmail}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">⏱️ Thời gian:</span>
                        <span>{appointment.time} ({appointment.duration} phút)</span>
                      </div>
                      <div className="info-row">
                        <span className="label">👤 Nhân viên:</span>
                        <span>{appointment.salesRepName}</span>
                      </div>
                      {appointment.notes && (
                        <div className="info-row">
                          <span className="label">📝 Ghi chú:</span>
                          <span>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="appointment-actions">
                      {appointment.status === 'pending' && (
                        <>
                          <button 
                            className="btn-success"
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          >
                            ✓ Xác nhận
                          </button>
                          <button 
                            className="btn-danger"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button 
                            className="btn-success"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          >
                            ✓ Hoàn thành
                          </button>
                          <button 
                            className="btn-warning"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-info"
                        onClick={() => navigate(`/dealer/customers/${appointment.customerId || appointment.id}`)}
                      >
                        👤 Xem khách hàng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-slot">
                    <p>Trống</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="calendar-stats">
        <div className="stat-card">
          <div className="stat-number">{appointments.length}</div>
          <div className="stat-label">Tổng lịch hẹn</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.status === 'pending').length}
          </div>
          <div className="stat-label">Chờ xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="stat-label">Đã xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.status === 'completed').length}
          </div>
          <div className="stat-label">Hoàn thành</div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveCalendarDetail;
