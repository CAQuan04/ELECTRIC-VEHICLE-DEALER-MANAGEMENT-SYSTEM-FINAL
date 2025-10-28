import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, PageHeader, Badge, Button 
} from '../../components';

// --- Helper Component (Tái sử dụng từ CustomerDetail) ---
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</span>
    <span className="text-sm font-semibold text-gray-900 dark:text-white mt-1 sm:mt-0 text-left sm:text-right">
      {value}
    </span>
  </div>
);

// --- Helper Function (Tái sử dụng từ TestDriveCalendar) ---
const getStatusVariant = (status) => {
  const statusMap = {
    'Chờ xác nhận': 'warning',
    'Đã xác nhận': 'info',
    'Hoàn thành': 'success',
    'Đã hủy': 'danger'
  };
  return statusMap[status] || 'secondary';
};

// --- Component Chính ---
const TestDriveDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL (giả sử route là /:id)
  const navigate = useNavigate();
  const { startLoading, stopLoading } = usePageLoading();
  const [testDrive, setTestDrive] = useState(null); // Bắt đầu là null

  useEffect(() => {
    const loadData = async () => {
      if (!id) return; // Không làm gì nếu không có ID
      try {
        startLoading("Đang tải chi tiết lịch hẹn...");
        
        // --- GIẢ LẬP API CALL ---
        // TODO: Thay thế bằng API thật
        await new Promise(r => setTimeout(r, 800));
        const mockData = { 
          id: id, 
          customer: {
            id: 'KH-001',
            name: 'Nguyễn Văn A', 
            phone: '0901234567',
            email: 'nguyenvana@email.com',
          },
          vehicle: 'Model 3 Long Range',
          date: '2025-10-26',
          time: '09:00',
          status: 'Đã xác nhận',
          notes: 'Khách hàng đặc biệt quan tâm đến khả năng tăng tốc và hệ thống AutoPilot.'
        };
        setTestDrive(mockData);
        // --- KẾT THÚC GIẢ LẬP ---

      } catch (error) {
        console.error("Lỗi tải chi tiết lái thử:", error);
        // TODO: Hiển thị thông báo lỗi
      } finally {
        stopLoading();
      }
    };
    
    loadData();
  }, [id, startLoading, stopLoading]); // Dependencies

  // === LOADING GUARD (CHỐNG LỖI MÀN HÌNH ĐEN) ===
  // Hook usePageLoading sẽ hiển thị spinner toàn trang
  // Chúng ta chỉ cần trả về 'null' để component không render gì cả
  // cho đến khi 'testDrive' có dữ liệu
  if (!testDrive) {
    return null; 
  }

  // === Giao diện khi đã có dữ liệu ===
  return (
    <PageContainer>
      <PageHeader
        title={`Chi tiết Lái thử #${testDrive.id}`}
        subtitle={`Ngày: ${testDrive.date} | Giờ: ${testDrive.time}`}
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← Quay lại lịch
            </Button>
            {testDrive.status === 'Chờ xác nhận' && (
              <Button variant="primary" icon="✅">
                Xác nhận lịch
              </Button>
            )}
            {testDrive.status === 'Đã xác nhận' && (
              <Button variant="danger" icon="❌">
                Hủy lịch
              </Button>
            )}
          </div>
        }
      />

      {/* --- Nội dung chi tiết --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: Thông tin lịch hẹn */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-5 border-b border-gray-200 dark:border-gray-700">
            Thông tin Lịch hẹn
          </h3>
          <div className="p-5 space-y-4">
            <DetailItem label="Trạng thái" value={
              <Badge variant={getStatusVariant(testDrive.status)}>
                {testDrive.status}
              </Badge>
            } />
            <DetailItem label="Xe đăng ký" value={testDrive.vehicle} />
            <DetailItem label="Ngày hẹn" value={testDrive.date} />
            <DetailItem label="Giờ hẹn" value={testDrive.time} />
            <DetailItem label="Ghi chú" value={
              <span className="italic dark:text-gray-300 text-gray-700">
                {testDrive.notes || '(Không có ghi chú)'}
              </span>
            } />
          </div>
        </div>

        {/* Cột phải: Thông tin khách hàng */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-5 border-b border-gray-200 dark:border-gray-700">
            Thông tin Khách hàng
          </h3>
          <div className="p-5 space-y-4">
            <DetailItem label="Tên khách hàng" value={testDrive.customer.name} />
            <DetailItem label="Số điện thoại" value={testDrive.customer.phone} />
            <DetailItem label="Email" value={testDrive.customer.email} />
          </div>
          <div className="p-5 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/dealer/customers/${testDrive.customer.id}`)}
            >
              Xem hồ sơ khách hàng
            </Button>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default TestDriveDetail;