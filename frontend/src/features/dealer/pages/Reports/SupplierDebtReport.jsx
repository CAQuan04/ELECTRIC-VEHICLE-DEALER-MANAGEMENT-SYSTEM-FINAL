import React, { useState, useEffect } from 'react';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button,
  Badge 
} from '../../components';

const SupplierDebtReport = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [supplierDebts, setSupplierDebts] = useState([]);

  useEffect(() => {
    loadSupplierDebts();
  }, []);

  const loadSupplierDebts = async () => {
    try {
      startLoading('Đang tải báo cáo công nợ nhà cung cấp...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDebts = [
        { id: 1, supplier: 'Tesla Factory', invoice: 'INV-2025-001', amount: 12000000000, paid: 8000000000, remaining: 4000000000, dueDate: '2025-11-15', status: 'Đúng hạn' },
        { id: 2, supplier: 'Tesla Parts Co.', invoice: 'INV-2025-002', amount: 5000000000, paid: 2000000000, remaining: 3000000000, dueDate: '2025-10-20', status: 'Sắp đến hạn' }
      ];
      
      setSupplierDebts(mockDebts);
    } catch (error) {
      console.error('Error loading supplier debts:', error);
    } finally {
      stopLoading();
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Đúng hạn': 'success',
      'Sắp đến hạn': 'warning',
      'Quá hạn': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const totalDebt = supplierDebts.reduce((sum, item) => sum + item.remaining, 0);

  return (
    <PageContainer>
      <PageHeader
        title="🏭 Báo cáo công nợ nhà cung cấp"
        subtitle="Theo dõi và quản lý công nợ với nhà cung cấp"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold dark:text-white text-gray-900 mb-2">{supplierDebts.length}</h3>
            <p className="dark:text-gray-400 text-gray-600">Nhà cung cấp</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-500 mb-2">
              {(totalDebt / 1000000000).toFixed(1)} tỷ
            </h3>
            <p className="dark:text-gray-400 text-gray-600">Tổng công nợ</p>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-white/10 border-gray-200">
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Nhà cung cấp</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Mã hóa đơn</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Tổng giá trị</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Đã thanh toán</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Còn lại</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Hạn thanh toán</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Trạng thái</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {supplierDebts.map(debt => (
                <tr key={debt.id} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/5 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="dark:text-white text-gray-900">{debt.supplier}</strong>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">{debt.invoice}</td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">
                    {(debt.amount / 1000000).toLocaleString('vi-VN')} triệu
                  </td>
                  <td className="py-3 px-4 dark:text-emerald-400 text-emerald-600">
                    {(debt.paid / 1000000).toLocaleString('vi-VN')} triệu
                  </td>
                  <td className="py-3 px-4">
                    <strong className="dark:text-blue-400 text-blue-600">
                      {(debt.remaining / 1000000).toLocaleString('vi-VN')} triệu
                    </strong>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">{debt.dueDate}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadge(debt.status)}>
                      {debt.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">Thanh toán</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="primary">📥 Xuất báo cáo</Button>
      </div>
    </PageContainer>
  );
};

export default SupplierDebtReport;
