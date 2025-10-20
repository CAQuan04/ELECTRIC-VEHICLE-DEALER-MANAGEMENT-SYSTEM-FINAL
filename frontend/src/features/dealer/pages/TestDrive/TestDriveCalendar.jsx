import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const TestDriveCalendar = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    try {
      startLoading('Đang tải lịch...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock calendar data
      const mockAppointments = [
        { id: 1, time: '09:00', customer: 'Nguyễn Văn A', vehicle: 'Model 3', status: 'Đã xác nhận' },
        { id: 2, time: '10:30', customer: 'Trần Thị B', vehicle: 'Model Y', status: 'Chờ xác nhận' },
        { id: 3, time: '14:00', customer: 'Lê Văn C', vehicle: 'Model S', status: 'Đã xác nhận' },
        { id: 4, time: '16:00', customer: 'Phạm Thị D', vehicle: 'Model X', status: 'Đã xác nhận' }
      ];
      
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      stopLoading();
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Chờ xác nhận': '#ffc107',
      'Đã xác nhận': '#17a2b8',
      'Hoàn thành': '#28a745',
      'Đã hủy': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  return (
    <div className="test-drive-calendar-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="page-header">
        <h1>📅 Lịch lái thử</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/test-drive/new')}>
          + Đăng ký mới
        </button>
      </div>

      {/* Date Picker */}
      <div className="date-picker-section">
        <label>Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
        />
      </div>

      {/* Time Slots */}
      <div className="calendar-view">
        <h3>Lịch hẹn ngày {selectedDate.toLocaleDateString('vi-VN')}</h3>
        
        <div className="time-slots">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-time">
                <strong>{appointment.time}</strong>
              </div>
              <div className="appointment-details">
                <h4>{appointment.customer}</h4>
                <p>Xe: {appointment.vehicle}</p>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-actions">
                <button className="btn-link">Chi tiết</button>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="empty-calendar">
            <p>Không có lịch hẹn nào trong ngày này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDriveCalendar;
