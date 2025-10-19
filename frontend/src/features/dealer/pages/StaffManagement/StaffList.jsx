import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const StaffList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      startLoading('Đang tải danh sách nhân viên...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStaff = [
        { id: 1, name: 'Phạm Văn A', role: 'Sales Manager', email: 'phamvana@dealer.com', phone: '0901111111', joinDate: '2023-01-15', status: 'Đang làm' },
        { id: 2, name: 'Lê Thị B', role: 'Sales Executive', email: 'lethib@dealer.com', phone: '0902222222', joinDate: '2023-06-01', status: 'Đang làm' },
        { id: 3, name: 'Nguyễn Văn C', role: 'Customer Service', email: 'nguyenvanc@dealer.com', phone: '0903333333', joinDate: '2024-01-10', status: 'Đang làm' }
      ];
      
      setStaff(mockStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="staff-list-page">
      <div className="page-header">
        <h1>👥 Quản lý nhân viên</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/staff/new')}>
          + Thêm nhân viên
        </button>
      </div>

      <div className="staff-table">
        <table>
          <thead>
            <tr>
              <th>Tên nhân viên</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày vào làm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id}>
                <td><strong>{member.name}</strong></td>
                <td>{member.role}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.joinDate}</td>
                <td>
                  <span className="badge-success">{member.status}</span>
                </td>
                <td>
                  <button 
                    className="btn-link"
                    onClick={() => navigate(`/dealer/staff/${member.id}/edit`)}
                  >
                    Chỉnh sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
