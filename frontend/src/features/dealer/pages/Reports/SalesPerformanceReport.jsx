import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { 
  PageContainer, 
  PageHeader, 
  Card, 
  Button,
  StatCard,
  EmptyState
} from '../../components';
import { TrendingUp, Download, FileSpreadsheet } from 'lucide-react';

const SalesPerformanceReport = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('month'); // month, quarter, year

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const result = await dealerAPI.getSalesReport({ period });
      if (result.success && result.data) {
        setReportData(result.data);
      } else {
        console.error('Failed to load report:', result.message);
        setReportData(null);
      }
    } catch (error) {
      console.error('Error loading report:', error);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    alert('Chức năng xuất PDF đang được phát triển');
  };

  const handleExportExcel = async () => {
    alert('Chức năng xuất Excel đang được phát triển');
  };

  const periodButtons = (
    <div className="flex gap-2">
      <Button
        variant={period === 'month' ? 'gradient' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('month')}
      >
        Tháng này
      </Button>
      <Button
        variant={period === 'quarter' ? 'gradient' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('quarter')}
      >
        Quý này
      </Button>
      <Button
        variant={period === 'year' ? 'gradient' : 'secondary'}
        size="sm"
        onClick={() => setPeriod('year')}
      >
        Năm nay
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Báo cáo hiệu suất bán hàng"
          subtitle="Theo dõi doanh thu và hiệu suất kinh doanh"
          icon={<TrendingUp className="w-16 h-16" />}
          actions={periodButtons}
        />
        <Card>
          <div className="text-center py-16 mb-8">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
              Đang tải báo cáo...
            </p>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!reportData) {
    return (
      <PageContainer>
        <PageHeader
          title="Báo cáo hiệu suất bán hàng"
          subtitle="Theo dõi doanh thu và hiệu suất kinh doanh"
          icon={<TrendingUp className="w-16 h-16" />}
          actions={periodButtons}
        />
        <Card className="mt-8">
          <EmptyState
          icon={<TrendingUp className= "w-12 h-12" />}
            
            title="Không có dữ liệu báo cáo"
            message="Chưa có dữ liệu bán hàng trong kỳ được chọn"
          />
        </Card>
      </PageContainer>
    );
  }

  const completionPercentage = reportData.target > 0 
    ? ((reportData.totalRevenue / reportData.target) * 100).toFixed(1)
    : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Báo cáo hiệu suất bán hàng"
        subtitle="Theo dõi doanh thu và hiệu suất kinh doanh"
        icon={<TrendingUp className="w-16 h-16" />}
        actions={periodButtons}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="🚗"
          title="Tổng số xe bán"
          value={reportData.totalSales}
          change={reportData.salesGrowth ? `${reportData.salesGrowth > 0 ? '+' : ''}${reportData.salesGrowth}%` : null}
          trend={reportData.salesGrowth > 0 ? 'up' : reportData.salesGrowth < 0 ? 'down' : 'neutral'}
        />
        
        <StatCard
          icon="💰"
          title="Doanh thu"
          value={`${(reportData.totalRevenue / 1000000000).toFixed(1)} tỷ`}
          change={reportData.revenueGrowth ? `${reportData.revenueGrowth > 0 ? '+' : ''}${reportData.revenueGrowth}%` : null}
          trend={reportData.revenueGrowth > 0 ? 'up' : reportData.revenueGrowth < 0 ? 'down' : 'neutral'}
        />
        
        <StatCard
          icon="🎯"
          title="Mục tiêu"
          value={`${(reportData.target / 1000000000).toFixed(1)} tỷ`}
        />
        
        <StatCard
          icon="📈"
          title="Hoàn thành"
          value={`${completionPercentage}%`}
          trend={completionPercentage >= 100 ? 'up' : completionPercentage >= 80 ? 'neutral' : 'down'}
        />
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">
          🎯 Tiến độ hoàn thành mục tiêu
        </h3>
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-4 ${
                completionPercentage >= 100 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : completionPercentage >= 80 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            >
              <span className="text-white font-bold text-sm">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Đã đạt: {(reportData.totalRevenue / 1000000).toLocaleString('vi-VN')} triệu VNĐ
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Mục tiêu: {(reportData.target / 1000000).toLocaleString('vi-VN')} triệu VNĐ
            </span>
          </div>
        </div>
      </Card>

      {/* Top Vehicles */}
      {reportData.topVehicles && reportData.topVehicles.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            Top xe bán chạy
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-600/80 dark:to-gray-700/80">
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Dòng xe
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Số lượng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Doanh thu
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    % Tổng doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {reportData.topVehicles.map((vehicle, index) => {
                  const percentage = ((vehicle.revenue / reportData.totalRevenue) * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-cyan-50 dark:hover:bg-emerald-500/10 transition-colors duration-300">
                      <td className="py-4 px-6">
                        <span className="text-2xl font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <strong className="text-lg dark:text-white text-gray-900">{vehicle.model}</strong>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold dark:text-cyan-400 text-cyan-600">{vehicle.units}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold dark:text-emerald-400 text-emerald-600">
                          {(vehicle.revenue / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-sm dark:text-gray-300 text-gray-700 min-w-[3rem]">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Monthly Trend */}
      {reportData.monthlyTrend && reportData.monthlyTrend.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">📈</span>
            Xu hướng theo tháng
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-gray-600/80 dark:to-gray-700/80">
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Tháng
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Số xe bán
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Doanh thu
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Biểu đồ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {reportData.monthlyTrend.map((month, index) => {
                  const maxRevenue = Math.max(...reportData.monthlyTrend.map(m => m.revenue));
                  const percentage = ((month.revenue / maxRevenue) * 100).toFixed(0);
                  return (
                    <tr key={index} className="hover:bg-cyan-50 dark:hover:bg-emerald-500/10 transition-colors duration-300">
                      <td className="py-4 px-6">
                        <strong className="text-lg dark:text-white text-gray-900">{month.month}</strong>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold dark:text-cyan-400 text-cyan-600">{month.sales}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold dark:text-emerald-400 text-emerald-600">
                          {(month.revenue / 1000000).toLocaleString('vi-VN')} triệu VNĐ
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Export Actions */}
      <div className="flex gap-4 justify-end">
        <Button 
          variant="primary"
          onClick={handleExportPDF}
          icon={<Download className="w-5 h-5" />}
        >
          Xuất PDF
        </Button>
        <Button 
          variant="secondary"
          onClick={handleExportExcel}
          icon={<FileSpreadsheet className="w-5 h-5" />}
        >
          Xuất Excel
        </Button>
      </div>
    </PageContainer>
  );
};

export default SalesPerformanceReport;