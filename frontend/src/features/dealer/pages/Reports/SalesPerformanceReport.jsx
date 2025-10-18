import React, { useState, useEffect } from 'react';
import { usePageLoading } from '@modules/loading';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button 
} from '../../components';

const SalesPerformanceReport = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState('month'); // month, quarter, year

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    try {
      startLoading('Đang tải báo cáo...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReport = {
        totalSales: 13,
        totalRevenue: 18500000000,
        target: 20000000000,
        completion: 92.5,
        topVehicles: [
          { model: 'Model 3', units: 7, revenue: 8400000000 },
          { model: 'Model Y', units: 4, revenue: 6000000000 },
          { model: 'Model S', units: 2, revenue: 5600000000 }
        ],
        monthlyTrend: [
          { month: 'T7', sales: 4, revenue: 5200000000 },
          { month: 'T8', sales: 5, revenue: 6800000000 },
          { month: 'T9', sales: 4, revenue: 6500000000 }
        ]
      };
      
      setReportData(mockReport);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      stopLoading();
    }
  };

  if (!reportData) return null;

  const periodButtons = (
    <div className="flex gap-2">
      <Button
        variant={period === 'month' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('month')}
      >
        Tháng này
      </Button>
      <Button
        variant={period === 'quarter' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('quarter')}
      >
        Quý này
      </Button>
      <Button
        variant={period === 'year' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('year')}
      >
        Năm nay
      </Button>
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        title="📊 Báo cáo hiệu suất bán hàng"
        subtitle="Theo dõi doanh thu và hiệu suất kinh doanh"
        actions={periodButtons}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold dark:text-white text-gray-900 mb-2">{reportData.totalSales}</h3>
            <p className="dark:text-gray-400 text-gray-600">Tổng số xe bán</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-emerald-500 mb-2">
              {(reportData.totalRevenue / 1000000000).toFixed(1)} tỷ
            </h3>
            <p className="dark:text-gray-400 text-gray-600">Doanh thu</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-500 mb-2">{reportData.completion}%</h3>
            <p className="dark:text-gray-400 text-gray-600">Hoàn thành mục tiêu</p>
          </div>
        </Card>
      </div>

      {/* Top Vehicles */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">🏆 Top xe bán chạy</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-white/10 border-gray-200">
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Dòng xe</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Số lượng</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topVehicles.map((vehicle, index) => (
                <tr key={index} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/5 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="dark:text-white text-gray-900">{vehicle.model}</strong>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">{vehicle.units}</td>
                  <td className="py-3 px-4 dark:text-emerald-400 text-emerald-600 font-semibold">
                    {(vehicle.revenue / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Trend */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">📈 Xu hướng theo tháng</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-white/10 border-gray-200">
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Tháng</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Số xe bán</th>
                <th className="text-left py-3 px-4 dark:text-gray-300 text-gray-700 font-semibold">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {reportData.monthlyTrend.map((month, index) => (
                <tr key={index} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/5 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <strong className="dark:text-white text-gray-900">{month.month}</strong>
                  </td>
                  <td className="py-3 px-4 dark:text-gray-400 text-gray-600">{month.sales}</td>
                  <td className="py-3 px-4 dark:text-blue-400 text-blue-600 font-semibold">
                    {(month.revenue / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="primary">
          📥 Xuất PDF
        </Button>
        <Button variant="secondary">
          📊 Xuất Excel
        </Button>
      </div>
    </PageContainer>
  );
};

export default SalesPerformanceReport;
