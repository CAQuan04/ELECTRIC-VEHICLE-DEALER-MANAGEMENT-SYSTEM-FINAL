import React, { useState, useEffect } from 'react';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button,
  Badge 
} from '../../components';

const CustomerDebtReport = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [debtData, setDebtData] = useState([]);

  useEffect(() => {
    loadDebtReport();
  }, []);

  const loadDebtReport = async () => {
    try {
      startLoading('Đang tải báo cáo công nợ...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDebt = [
        { id: 1, customer: 'Nguyễn Văn A', orderId: 'ORD-0001', totalAmount: 1200000000, paid: 240000000, remaining: 960000000, dueDate: '2025-11-01', status: 'Đúng hạn' },
        { id: 2, customer: 'Trần Thị B', orderId: 'ORD-0002', totalAmount: 1500000000, paid: 500000000, remaining: 1000000000, dueDate: '2025-10-15', status: 'Sắp đến hạn' },
        { id: 3, customer: 'Lê Văn C', orderId: 'ORD-0003', totalAmount: 2800000000, paid: 800000000, remaining: 2000000000, dueDate: '2025-09-30', status: 'Quá hạn' }
      ];
      
      setDebtData(mockDebt);
    } catch (error) {
      console.error('Error loading debt report:', error);
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

  const totalDebt = debtData.reduce((sum, item) => sum + item.remaining, 0);

  return (
    <PageContainer>
      <PageHeader
        title="💰 Báo cáo công nợ khách hàng"
        subtitle="Theo dõi và quản lý công nợ khách hàng"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold dark:text-white text-gray-900 mb-2">{debtData.length}</h3>
            <p className="dark:text-gray-400 text-gray-600">Khách hàng còn nợ</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-red-500 mb-2">
              {(totalDebt / 1000000000).toFixed(1)} tỷ
            </h3>
            <p className="dark:text-gray-400 text-gray-600">Tổng công nợ</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-orange-500 mb-2">
              {debtData.filter(d => d.status === 'Quá hạn').length}
            </h3>
            <p className="dark:text-gray-400 text-gray-600">Quá hạn thanh toán</p>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-white/10 border-gray-200">
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Khách hàng</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Mã đơn</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Tổng giá trị</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Đã thanh toán</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Còn lại</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Hạn thanh toán</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Trạng thái</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {debtData.map(debt => (
                <tr key={debt.id} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/5 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="dark:text-white text-gray-900">{debt.customer}</strong>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">{debt.orderId}</td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">
                    {(debt.totalAmount / 1000000).toLocaleString('vi-VN')} triệu
                  </td>
                  <td className="py-3 px-4 dark:text-emerald-400 text-emerald-600">
                    {(debt.paid / 1000000).toLocaleString('vi-VN')} triệu
                  </td>
                  <td className="py-3 px-4">
                    <strong className="dark:text-red-400 text-red-600">
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
                    <Button variant="ghost" size="sm">Nhắc nợ</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="primary">📥 Xuất báo cáo</Button>
        <Button variant="secondary">📧 Gửi nhắc nợ hàng loạt</Button>
      </div>
    </PageContainer>
  );
};

export default CustomerDebtReport;
