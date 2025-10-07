import React, { useState, useMemo } from 'react';

const PaymentHistory = ({ 
  payments = [], 
  loading = false,
  onPaymentClick 
}) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Đã thanh toán', class: 'bg-green-100 text-green-700 border-green-200' },
      pending: { label: 'Sắp đến hạn', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      overdue: { label: 'Quá hạn', class: 'bg-red-100 text-red-700 border-red-200' },
      processing: { label: 'Đang xử lý', class: 'bg-blue-100 text-blue-700 border-blue-200' }
    };
    
    const config = statusConfig[status] || { label: 'Không xác định', class: 'bg-gray-100 text-gray-700 border-gray-200' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">↕️</span>;
    }
    return sortDirection === 'asc' ? 
      <span className="text-blue-600 ml-1">↑</span> : 
      <span className="text-blue-600 ml-1">↓</span>;
  };

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;
    
    if (statusFilter !== 'all') {
      filtered = payments.filter(payment => payment.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [payments, sortField, sortDirection, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredAndSortedPayments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPaymentMethodInfo = (method) => {
    const methodMap = {
      bank_transfer: { label: 'Chuyển khoản', icon: '🏦' },
      auto_debit: { label: 'Trừ tự động', icon: '🔄' },
      cash: { label: 'Tiền mặt', icon: '💵' },
      credit_card: { label: 'Thẻ tín dụng', icon: '💳' }
    };
    return methodMap[method] || { label: method, icon: '💳' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <span className="text-6xl mb-4 mx-auto block text-gray-400">📋</span>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có lịch sử thanh toán</h3>
        <p className="text-gray-500">Lịch sử thanh toán sẽ hiển thị ở đây sau khi bạn thực hiện giao dịch đầu tiên.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800">Lịch sử thanh toán</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Sắp đến hạn</option>
              <option value="overdue">Quá hạn</option>
              <option value="processing">Đang xử lý</option>
            </select>
            
            <div className="text-sm text-gray-600 flex items-center">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                {filteredAndSortedPayments.length} kết quả
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('date')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
              >
                <div className="flex items-center">
                  Ngày thanh toán
                  {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Xe
              </th>
              <th 
                onClick={() => handleSort('amount')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
              >
                <div className="flex items-center">
                  Số tiền
                  {getSortIcon('amount')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
              >
                <div className="flex items-center">
                  Trạng thái
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('method')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
              >
                <div className="flex items-center">
                  Phương thức
                  {getSortIcon('method')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPayments.map((payment, index) => {
              const methodInfo = getPaymentMethodInfo(payment.method);
              
              return (
                <tr 
                  key={payment.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onPaymentClick && onPaymentClick(payment)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(payment.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleTimeString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚗</span>
                      <span className="text-sm text-gray-700">
                        {payment.vehicleModel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{methodInfo.icon}</span>
                      <span className="text-sm text-gray-700">
                        {methodInfo.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </div>
            
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau →
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;