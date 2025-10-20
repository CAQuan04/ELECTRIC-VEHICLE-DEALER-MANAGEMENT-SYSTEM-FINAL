import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

const PurchaseRequestList = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      startLoading('Đang tải danh sách yêu cầu mua hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRequests = [
        { id: 1, vehicle: 'Model 3', quantity: 5, requestDate: '2025-10-01', status: 'Chờ duyệt', priority: 'Cao', estimatedCost: 6000000000 },
        { id: 2, vehicle: 'Model Y', quantity: 3, requestDate: '2025-09-28', status: 'Đã duyệt', priority: 'Bình thường', estimatedCost: 4500000000 },
        { id: 3, vehicle: 'Model S', quantity: 2, requestDate: '2025-10-05', status: 'Đang xử lý', priority: 'Khẩn cấp', estimatedCost: 5600000000 }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      stopLoading();
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Chờ duyệt': 'badge-warning',
      'Đã duyệt': 'badge-success',
      'Đang xử lý': 'badge-info',
      'Từ chối': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'Khẩn cấp': 'badge-danger',
      'Cao': 'badge-warning',
      'Bình thường': 'badge-info'
    };
    return priorityMap[priority] || 'badge-secondary';
  };

  return (
    <div className="purchase-request-list-page">
      <div className="page-header">
        <h1>📦 Yêu cầu mua hàng</h1>
        <button className="btn-primary" onClick={() => navigate('/dealer/purchase/new')}>
          + Tạo yêu cầu mới
        </button>
      </div>

      <div className="request-table">
        <table>
          <thead>
            <tr>
              <th>Mã yêu cầu</th>
              <th>Xe</th>
              <th>Số lượng</th>
              <th>Chi phí dự kiến</th>
              <th>Ngày tạo</th>
              <th>Ưu tiên</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td><strong>PR-{String(request.id).padStart(4, '0')}</strong></td>
                <td>{request.vehicle}</td>
                <td>{request.quantity}</td>
                <td>{(request.estimatedCost / 1000000).toLocaleString('vi-VN')} triệu VNĐ</td>
                <td>{request.requestDate}</td>
                <td>
                  <span className={getPriorityBadge(request.priority)}>
                    {request.priority}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadge(request.status)}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button className="btn-link">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseRequestList;
