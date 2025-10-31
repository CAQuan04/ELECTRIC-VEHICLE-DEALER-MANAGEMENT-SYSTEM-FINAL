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
  FormGroup
} from '../../components';
import { Building, Download, DollarSign } from 'lucide-react';

const SupplierDebtReport = () => {
  const navigate = useNavigate();
  const [supplierDebts, setSupplierDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSupplierDebts();
  }, [statusFilter]);

  const loadSupplierDebts = async () => {
    setIsLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const result = await dealerAPI.getSupplierDebtReport(params);
      
      if (result.success && result.data) {
        const debtList = Array.isArray(result.data) ? result.data : result.data.data || [];
        setSupplierDebts(debtList);
      } else {
        console.error('Failed to load supplier debts:', result.message);
        setSupplierDebts([]);
      }
    } catch (error) {
      console.error('Error loading supplier debts:', error);
      setSupplierDebts([]);
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

  const handlePayment = async (debtId, supplierName) => {
    if (confirm(`Xác nhận thanh toán cho ${supplierName}?`)) {
      navigate(`/dealer/payments/new?supplierId=${debtId}`);
    }
  };

  const handleExportReport = async () => {
    alert('Chức năng xuất báo cáo đang được phát triển');
  };

  const filteredDebts = supplierDebts.filter(debt => 
    debt.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debt.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDebt = filteredDebts.reduce((sum, item) => sum + (item.remaining || 0), 0);
  const overdueCount = filteredDebts.filter(d => d.status === 'overdue').length;
  const upcomingCount = filteredDebts.filter(d => d.status === 'upcoming').length;

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
          title="Báo cáo công nợ nhà cung cấp"
          subtitle="Theo dõi và quản lý công nợ với nhà cung cấp (Accounts Payable)"
          icon={<Building className="w-16 h-16" />}
        />
        <Card>
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải báo cáo công nợ nhà cung cấp...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="🏭 Báo cáo công nợ nhà cung cấp"
        subtitle="Theo dõi và quản lý công nợ với nhà cung cấp (Accounts Payable)"
        icon={<Building className="w-16 h-16" />}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="🏢"
          title="Nhà cung cấp"
          value={filteredDebts.length}
        />
        
        <StatCard
          icon="💰"
          title="Tổng công nợ"
          value={`${(totalDebt / 1000000000).toFixed(1)} tỷ`}
        />
        
        <StatCard
          icon="⚠️"
          title="Quá hạn"
          value={overdueCount}
          trend={overdueCount > 0 ? 'down' : 'up'}
        />
        
        <StatCard
          icon="⏰"
          title="Sắp đến hạn"
          value={upcomingCount}
          trend={upcomingCount > 3 ? 'down' : 'neutral'}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <SearchBar
          placeholder="Tìm kiếm theo nhà cung cấp hoặc mã hóa đơn..."
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

      {/* Supplier Debt Table */}
      <Card className="mb-8">
        {filteredDebts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-600/80 dark:to-gray-700/80">
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Nhà cung cấp
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Mã hóa đơn
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
                {filteredDebts.map(debt => (
                  <tr 
                    key={debt.id} 
                    className="hover:bg-cyan-50 dark:hover:bg-emerald-500/10 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <strong className="text-lg dark:text-white text-gray-900">{debt.supplierName}</strong>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold dark:text-blue-400 text-blue-600">
                        {debt.invoiceId}
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
                      <strong className="text-lg dark:text-blue-400 text-blue-600">
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
                        onClick={() => handlePayment(debt.id, debt.supplierName)}
                      >
                        💳 Thanh toán
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🏭"
            title="Không có công nợ nhà cung cấp"
            message={searchQuery ? "Không tìm thấy công nợ phù hợp với từ khóa tìm kiếm" : "Tất cả hóa đơn nhà cung cấp đã được thanh toán"}
          />
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button 
          variant="primary"
          onClick={handleExportReport}
          icon={<Download className="w-5 h-5" />}
        >
          Xuất báo cáo
        </Button>
      </div>
    </PageContainer>
  );
};

export default SupplierDebtReport;