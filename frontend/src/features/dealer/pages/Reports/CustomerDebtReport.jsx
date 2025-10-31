import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button,
  Badge,
  SearchBar,
  EmptyState,
  StatCard,
  Select,
  FormGroup,
  Label
} from '../../components';
import { DollarSign, Download, Mail } from 'lucide-react';

const CustomerDebtReport = () => {
  const navigate = useNavigate();
  const [debtData, setDebtData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, ontime, upcoming, overdue

  useEffect(() => {
    loadDebtReport();
  }, [statusFilter]);

  const loadDebtReport = async () => {
    setIsLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const result = await dealerAPI.getCustomerDebtReport(params);
      
      if (result.success && result.data) {
        const debtList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setDebtData(debtList);
      } else {
        console.error('Failed to load debt report:', result.message);
        setDebtData([]);
      }
    } catch (error) {
      console.error('Error loading debt report:', error);
      setDebtData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ontime': 'success',
      'upcoming': 'warning',
      'overdue': 'danger'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'ontime': 'Đúng hạn',
      'upcoming': 'Sắp đến hạn',
      'overdue': 'Quá hạn'
    };
    return labelMap[status] || status;
  };

  const handleRemindDebt = async (debtId, customerName) => {
    if (confirm(`Gửi nhắc nợ cho khách hàng ${customerName}?`)) {
      try {
        const result = await dealerAPI.sendDebtReminder(debtId);
        if (result.success) {
          alert('Đã gửi nhắc nợ thành công!');
        } else {
          alert('Lỗi: ' + result.message);
        }
      } catch (error) {
        console.error('Error sending reminder:', error);
        alert('Có lỗi xảy ra khi gửi nhắc nợ');
      }
    }
  };

  const handleBulkReminder = async () => {
    if (confirm('Gửi nhắc nợ hàng loạt cho tất cả khách hàng có nợ?')) {
      try {
        const result = await dealerAPI.sendBulkDebtReminders();
        if (result.success) {
          alert(`Đã gửi nhắc nợ cho ${result.data.count} khách hàng!`);
        } else {
          alert('Lỗi: ' + result.message);
        }
      } catch (error) {
        console.error('Error sending bulk reminders:', error);
        alert('Có lỗi xảy ra khi gửi nhắc nợ hàng loạt');
      }
    }
  };

// ---LOGIC XUẤT BÁO CÁO (UC 1.D.2) ---
  const handleExportReport = async (format = 'excel') => {
    setIsExporting(true);
    try {
      // 1. Chuẩn bị params (giống hệt params đang lọc)
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined
      };
      
      // 2. Gọi API export
      // (Dựa theo file dealer.api.js, hàm này trả về { success: true, data: blob })
      const result = await dealerAPI.exportDebtReport(format, 'customer', params);

      if (result.success && result.data) {
        // 3. Tạo URL tạm thời từ blob
        const url = window.URL.createObjectURL(new Blob([result.data]));
        
        // 4. Tạo 1 thẻ <a> ẩn để kích hoạt tải file
        const link = document.createElement('a');
        link.href = url;
        const fileExtension = format === 'pdf' ? 'pdf' : 'xlsx';
        const fileName = `BaoCao_CongNo_KhachHang_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
        link.setAttribute('download', fileName);
        
        // 5. Kích hoạt
        document.body.appendChild(link);
        link.click();
        
        // 6. Dọn dẹp
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(result.message || 'Không thể xuất file');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Lỗi khi xuất báo cáo: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredDebtData = debtData.filter(debt => 
    debt.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debt.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDebt = filteredDebtData.reduce((sum, item) => sum + (item.remaining || 0), 0);
  const overdueCount = filteredDebtData.filter(d => d.status === 'overdue').length;
  const upcomingCount = filteredDebtData.filter(d => d.status === 'upcoming').length;

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'ontime', label: 'Đúng hạn' },
    { value: 'upcoming', label: 'Sắp đến hạn' },
    { value: 'overdue', label: 'Quá hạn' }
  ];

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Báo cáo công nợ khách hàng"
          subtitle="Theo dõi và quản lý công nợ khách hàng (Accounts Receivable)"
          icon={<DollarSign className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải báo cáo công nợ...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="💰 Báo cáo công nợ khách hàng"
        subtitle="Theo dõi và quản lý công nợ khách hàng (Accounts Receivable)"
        icon={<DollarSign className="w-16 h-16" />}
      />

      {/* Summary Cards */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon="👥"
          title="Khách hàng còn nợ"
          value={filteredDebtData.length}
        />
        
        <StatCard
          icon="💵"
          title="Tổng công nợ"
          value={`${(totalDebt / 1000000000).toFixed(1)} tỷ`}
        />
        
        <StatCard
          icon="⚠️"
          title="Quá hạn thanh toán"
          value={overdueCount}
          trend={overdueCount > 0 ? 'down' : 'up'}
        />
        
        <StatCard
          icon="⏰"
          title="Sắp đến hạn"
          value={upcomingCount}
          trend={upcomingCount > 5 ? 'down' : 'neutral'}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <SearchBar
          placeholder="Tìm kiếm theo khách hàng hoặc mã đơn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <FormGroup className="mb-0">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </FormGroup>
      </div>

      {/* Debt Table */}
      <Card className="mt-6">
        {filteredDebtData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-600/80 dark:to-gray-700/80">
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Khách hàng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Mã đơn
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Tổng giá trị
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Đã thanh toán
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Còn lại
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Hạn thanh toán
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Trạng thái
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {filteredDebtData.map(debt => (
                  <tr 
                    key={debt.id} 
                    className="hover:bg-cyan-50 dark:hover:bg-emerald-500/10 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <strong className="text-lg dark:text-white text-gray-900">{debt.customerName}</strong>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold dark:text-emerald-400 text-emerald-600">
                        {debt.orderId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold dark:text-gray-300 text-gray-700">
                        {((debt.totalAmount || 0) / 1000000).toLocaleString('vi-VN')} triệu
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold dark:text-emerald-400 text-emerald-600">
                        {((debt.paid || 0) / 1000000).toLocaleString('vi-VN')} triệu
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <strong className="text-lg dark:text-red-400 text-red-600">
                        {((debt.remaining || 0) / 1000000).toLocaleString('vi-VN')} triệu
                      </strong>
                    </td>
                    <td className="py-4 px-6">
                      <span className="dark:text-gray-400 text-gray-600">
                        {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusBadge(debt.status)}>
                        {getStatusLabel(debt.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemindDebt(debt.id, debt.customerName)}
                      >
                        📧 Nhắc nợ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="💰"
            title="Không có công nợ"
            message={searchQuery ? "Không tìm thấy công nợ phù hợp với từ khóa tìm kiếm" : "Tất cả khách hàng đã thanh toán đầy đủ"}
          />
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end mt-6">
<Button 
          variant="primary"
          onClick={() => handleExportReport('excel')} // Sửa: Chỉ rõ là excel
          icon={<Download className="w-5 h-5" />}
          disabled={isExporting} // Vô hiệu hóa khi đang xuất
        >
          {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
        </Button>
        <Button 
          variant="secondary"
          onClick={handleBulkReminder}
          icon={<Mail className="w-5 h-5" />}
          disabled={filteredDebtData.length === 0}
        >
          Gửi nhắc nợ hàng loạt
        </Button>
      </div>
    </PageContainer>
  );
};

export default CustomerDebtReport;