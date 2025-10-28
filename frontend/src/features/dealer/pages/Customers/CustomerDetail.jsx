import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';

// --- Component Nút Tab (Helper) ---
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-semibold text-sm transition-colors
      ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent'
      }`}
  >
    {label}
  </button>
);


const CustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [customer, setCustomer] = useState(null);
  // Thêm state cho tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'history', 'drives', 'notes'

  useEffect(() => {
    loadCustomerDetail();
  }, [customerId]);

  const loadCustomerDetail = async () => {
    try {
      startLoading('Đang tải thông tin khách hàng...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data (Giữ nguyên)
      const mockCustomer = {
        id: customerId,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1',
        city: 'TP. Hồ Chí Minh',
        status: 'Tiềm năng',
        createdDate: '2025-09-01',
        purchaseHistory: [
          { id: 1, vehicle: 'Model 3', date: '2024-06-15', amount: 1200000000 }
        ],
        testDrives: [
          { id: 1, vehicle: 'Model Y', date: '2025-10-05', status: 'Hoàn thành' }
        ],
        notes: 'Khách hàng quan tâm đến Model Y'
      };
      
      setCustomer(mockCustomer);
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      stopLoading();
    }
  };

  // Helper function cho Badge (Cập nhật Dark Mode)
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Đã mua':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'Tiềm năng':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'Đang tư vấn':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (!customer) return null;

  // Cập nhật nền với Dark Mode
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* NÚT QUAY LẠI (Cập nhật Dark Mode) */}
      <button
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-6 flex items-center transition duration-150"
        onClick={() => navigate(-1)}
      >
        <span className="mr-2">&larr;</span> Quay lại danh sách
      </button>

      {/* HEADER MỚI (Thiết kế lại, thêm Dark Mode) */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          
          {/* Thông tin chính */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-300 flex-shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center flex-wrap space-x-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusBadgeClasses(customer.status)}`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm">
                <span>📧 {customer.email}</span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                <span>📞 {customer.phone}</span>
              </p>
            </div>
          </div>

          {/* Actions (Thiết kế lại nút) */}
          <div className="flex space-x-3 w-full md:w-auto">
            <button
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
              onClick={() => navigate(`/dealer/customers/${customerId}/edit`)}
            >
              <span className="mr-2">✏️</span> Chỉnh sửa
            </button>
            <a
              href={`tel:${customer.phone}`}
              className="w-full md:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-600"
            >
              <span className="mr-2">📞</span> Gọi
            </a>
          </div>
        </div>
      </div>
      
      {/* === BỐ CỤC TAB MỚI === */}
      
      {/* THANH ĐIỀU HƯỚNG TAB */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
          <TabButton label="Tổng quan" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton label="Lịch sử Mua hàng" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <TabButton label="Lịch sử Lái thử" isActive={activeTab === 'drives'} onClick={() => setActiveTab('drives')} />
          <TabButton label="Ghi chú" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
        </nav>
      </div>

      {/* NỘI DUNG TAB */}
      <div className="tab-content">
        
        {/* --- TAB 1: TỔNG QUAN --- */}
        {activeTab === 'overview' && (
          <DetailCard title="Thông tin chi tiết">
            <DetailItem label="Email" value={customer.email} />
            <DetailItem label="Số điện thoại" value={customer.phone} />
            <DetailItem label="Địa chỉ" value={customer.address} />
            <DetailItem label="Thành phố" value={customer.city} />
            <DetailItem label="Ngày tạo hồ sơ" value={customer.createdDate} />
          </DetailCard>
        )}
        
        {/* --- TAB 2: LỊCH SỬ MUA HÀNG --- */}
        {activeTab === 'history' && (
          <DetailCard title="Lịch sử mua hàng">
            {customer.purchaseHistory.length > 0 ? (
              <Table
                headers={['Xe', 'Ngày mua', 'Giá trị']}
                data={customer.purchaseHistory.map(purchase => ({
                  vehicle: purchase.vehicle,
                  date: purchase.date,
                  amount: <span className="font-medium text-green-600 dark:text-green-400">{`${(purchase.amount / 1000000).toLocaleString('vi-VN')} triệu VNĐ`}</span>
                }))}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm">Chưa có lịch sử mua hàng</p>
            )}
          </DetailCard>
        )}
        
        {/* --- TAB 3: LỊCH SỬ LÁI THỬ --- */}
        {activeTab === 'drives' && (
          <DetailCard title="Lịch sử lái thử">
            {customer.testDrives.length > 0 ? (
              <Table
                headers={['Xe', 'Ngày lái thử', 'Trạng thái']}
                data={customer.testDrives.map(testDrive => ({
                  vehicle: testDrive.vehicle,
                  date: testDrive.date,
                  status: (
                    <span key={testDrive.id} className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                      {testDrive.status}
                    </span>
                  )
                }))}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm">Chưa có lịch sử lái thử</p>
            )}
          </DetailCard>
        )}

        {/* --- TAB 4: GHI CHÚ --- */}
        {activeTab === 'notes' && (
          <DetailCard title="Ghi chú">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {customer.notes || <span className="italic text-gray-500 dark:text-gray-400">Không có ghi chú</span>}
            </p>
          </DetailCard>
        )}
      </div>

    </div>
  );
};

// --- Custom Components (Cập nhật Dark Mode) ---

// Wrapper cho mỗi phần (Hiện đại hóa)
const DetailCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-5 border-b border-gray-200 dark:border-gray-700">{title}</h3>
    {/* Bỏ padding p-5 ở đây nếu children là Table */}
    <div className={children.type === Table ? '' : 'p-5'}>
      {children}
    </div>
  </div>
);

// Hiển thị một mục chi tiết (Cập nhật Dark Mode)
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</span>
    <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1 sm:mt-0 text-left sm:text-right">{value}</span>
  </div>
);

// Component Table (Cập nhật Dark Mode)
const Table = ({ headers, data }) => (
    <div className="overflow-x-auto rounded-b-xl">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            {header}
                        </th>
                     ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {Object.values(row).map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default CustomerDetail;