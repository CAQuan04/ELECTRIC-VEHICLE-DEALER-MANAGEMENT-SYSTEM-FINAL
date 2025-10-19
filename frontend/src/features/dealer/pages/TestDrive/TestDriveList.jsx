import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const TestDriveList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [testDrives, setTestDrives] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  useEffect(() => {
    loadTestDrives();
  }, [filter]);

  const loadTestDrives = async () => {
    try {
      startLoading('Đang tải danh sách lái thử...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTestDrives = [
        { id: 1, customer: 'Nguyễn Văn A', vehicle: 'Model 3', date: '2025-10-15', time: '10:00', status: 'Đã xác nhận' },
        { id: 2, customer: 'Trần Thị B', vehicle: 'Model Y', date: '2025-10-16', time: '14:00', status: 'Chờ xác nhận' },
        { id: 3, customer: 'Lê Văn C', vehicle: 'Model S', date: '2025-10-14', time: '09:00', status: 'Hoàn thành' },
        { id: 4, customer: 'Phạm Thị D', vehicle: 'Model X', date: '2025-10-17', time: '15:30', status: 'Đã xác nhận' }
      ];
      
      setTestDrives(mockTestDrives);
    } catch (error) {
      console.error('Error loading test drives:', error);
    } finally {
      stopLoading();
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Chờ xác nhận': 'badge-warning',
      'Đã xác nhận': 'badge-info',
      'Hoàn thành': 'badge-success',
      'Đã hủy': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  return (
    <div className="test-drive-list-page">
      <div className="page-header">
        <h1>🚗 Quản lý lái thử</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/test-drive/new')}>
          + Đăng ký lái thử mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Chờ xác nhận
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''}
          onClick={() => setFilter('confirmed')}
        >
          Đã xác nhận
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Hoàn thành
        </button>
      </div>

      {/* Test Drive Table */}
      <div className="test-drive-table">
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Xe</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {testDrives.map(testDrive => (
              <tr key={testDrive.id}>
                <td><strong>{testDrive.customer}</strong></td>
                <td>{testDrive.vehicle}</td>
                <td>{testDrive.date}</td>
                <td>{testDrive.time}</td>
                <td>
                  <span className={getStatusBadge(testDrive.status)}>
                    {testDrive.status}
                  </span>
                </td>
                <td>
                  <button className="btn-link">Chi tiết</button>
                  {testDrive.status === 'Chờ xác nhận' && (
                    <button className="btn-link">Xác nhận</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page-actions">
        <button className="btn-secondary" onClick={() => navigate('/dealer/test-drive/calendar')}>
          📅 Xem lịch
        </button>
      </div>
    </div>
  );
};

export default TestDriveList;
