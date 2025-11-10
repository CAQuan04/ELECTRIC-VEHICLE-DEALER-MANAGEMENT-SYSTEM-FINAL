import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { notifications } from '@utils/notifications';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-rose-500/30 rounded-lg p-4 shadow-xl">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)} tỷ
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ReportsSection = () => {
  const [debtType, setDebtType] = useState('AR'); // AR or AP
  const [selectedAging, setSelectedAging] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [salesPerformanceData, setSalesPerformanceData] = useState([]);
  const [teamAverage, setTeamAverage] = useState(0);
  const [arData, setArData] = useState([]);
  const [apData, setApData] = useState([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setIsLoading(true);
    try {
      // Load sales performance data (from staff/users)
      await loadSalesPerformance();
      
      // Load debt data
      await loadDebtData();
    } catch (error) {
      console.error('Error loading reports data:', error);
      notifications.error('Lỗi', 'Không thể tải dữ liệu báo cáo');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSalesPerformance = async () => {
    try {
      // Giả sử có API lấy danh sách staff với target và actual sales
      // Nếu chưa có API này, tạm thời dùng data từ Users API
      const usersResult = await dealerAPI.getUsers();
      
      if (usersResult.success && usersResult.data) {
        // Transform user data to sales performance
        const performanceData = usersResult.data
          .filter(user => user.role === 'DealerStaff' || user.role === 'DealerManager')
          .map(user => ({
            name: user.fullName || user.username,
            sales: (Math.random() * 3 + 1), // Mock data - cần thay bằng dữ liệu thực từ orders
            target: 2.5,
            orders: Math.floor(Math.random() * 10 + 5) // Mock - cần lấy từ orders
          }));

        const transformedData = performanceData.map(emp => ({
          ...emp,
          achieved: Math.min(emp.sales, emp.target),
          exceeded: emp.sales > emp.target ? emp.sales - emp.target : 0,
          remaining: emp.sales < emp.target ? emp.target - emp.sales : 0
        }));

        setSalesPerformanceData(transformedData);
        
        if (performanceData.length > 0) {
          const avg = performanceData.reduce((sum, emp) => sum + emp.sales, 0) / performanceData.length;
          setTeamAverage(avg);
        }
      }
    } catch (error) {
      console.error('Error loading sales performance:', error);
    }
  };

  const loadDebtData = async () => {
    try {
      // Load customer debt (AR)
      const ordersResult = await dealerAPI.getOrders({ status: 'Completed' });
      
      if (ordersResult.success && ordersResult.data?.items) {
        // Transform orders to AR data
        const arDataTransformed = ordersResult.data.items
          .filter(order => order.paymentStatus !== 'Paid')
          .map(order => {
            const outstanding = order.totalAmount - (order.paidAmount || 0);
            const daysOverdue = order.dueDate 
              ? Math.floor((new Date() - new Date(order.dueDate)) / (1000 * 60 * 60 * 24))
              : 0;
            
            let aging = '0-30';
            let status = 'Chưa quá hạn';
            
            if (daysOverdue > 90) {
              aging = '90+';
              status = 'Quá hạn';
            } else if (daysOverdue > 60) {
              aging = '61-90';
              status = 'Quá hạn';
            } else if (daysOverdue > 30) {
              aging = '31-60';
              status = 'Quá hạn';
            } else if (daysOverdue < 0) {
              status = 'Chưa quá hạn';
            } else if (outstanding === 0) {
              status = 'Đã thanh toán';
            }

            return {
              id: `AR${String(order.orderId).padStart(3, '0')}`,
              customer: order.customerName,
              invoice: order.orderNumber || `INV-${order.orderId}`,
              amount: order.totalAmount,
              paid: order.paidAmount || 0,
              outstanding: outstanding,
              dueDate: order.dueDate ? new Date(order.dueDate).toLocaleDateString('vi-VN') : 'N/A',
              aging: aging,
              status: status
            };
          });
        
        setArData(arDataTransformed);
      }

      // Mock AP data (cần API riêng từ backend)
      // Tạm thời giữ một số dữ liệu mẫu
      setApData([
        { 
          id: 'AP001', 
          supplier: 'EVM Corporation', 
          invoice: 'PO-2024-001', 
          amount: 5000000000, 
          paid: 3000000000, 
          outstanding: 2000000000, 
          dueDate: '30/10/2025', 
          aging: '0-30', 
          status: 'Chưa quá hạn' 
        }
      ]);
      
    } catch (error) {
      console.error('Error loading debt data:', error);
    }
  };

  const currentDebtData = debtType === 'AR' ? arData : apData;

  // Calculate aging summary
  const agingSummary = {
    '0-30': 0,
    '31-60': 0,
    '61-90': 0,
    '90+': 0
  };

  currentDebtData.forEach(item => {
    if (item.outstanding > 0) {
      agingSummary[item.aging] = (agingSummary[item.aging] || 0) + item.outstanding;
    }
  });

  const filteredDebtData = selectedAging === 'all'
    ? currentDebtData
    : currentDebtData.filter(item => item.aging === selectedAging);

  const totalOutstanding = currentDebtData.reduce((sum, item) => sum + item.outstanding, 0);
  const totalOverdue = currentDebtData.filter(item => item.status === 'Quá hạn').reduce((sum, item) => sum + item.outstanding, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã thanh toán': return 'text-rose-400 bg-rose-500/20';
      case 'Chưa quá hạn': return 'text-blue-400 bg-blue-500/20';
      case 'Quá hạn': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const exportToCSV = () => {
    const headers = debtType === 'AR'
      ? ['Mã', 'Khách hàng', 'Hóa đơn', 'Tổng tiền', 'Đã thanh toán', 'Còn nợ', 'Hạn thanh toán', 'Trạng thái']
      : ['Mã', 'Nhà cung cấp', 'Đơn hàng', 'Tổng tiền', 'Đã thanh toán', 'Còn nợ', 'Hạn thanh toán', 'Trạng thái'];

    const rows = currentDebtData.map(item => [
      item.id,
      debtType === 'AR' ? item.customer : item.supplier,
      item.invoice,
      item.amount,
      item.paid,
      item.outstanding,
      item.dueDate,
      item.status
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `debt_report_${debtType}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl font-bold text-gray-400">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Sales Performance Chart */}
      <div className="bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            📈 Báo cáo doanh số theo nhân viên
          </h2>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-rose-500/20 rounded-lg border border-rose-500/30">
              <span className="text-sm text-gray-400">TB đội nhóm: </span>
              <span className="text-lg font-bold text-rose-400">{teamAverage.toFixed(2)} tỷ</span>
            </div>
          </div>
        </div>

        {salesPerformanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={salesPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" label={{ value: 'Doanh số (tỷ VNĐ)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="achieved" stackId="a" fill="#10b981" name="Đạt mục tiêu" radius={[0, 0, 0, 0]} />
              <Bar dataKey="exceeded" stackId="a" fill="#3b82f6" name="Vượt mục tiêu" radius={[8, 8, 0, 0]} />
              <Bar dataKey="remaining" stackId="a" fill="#ef4444" name="Chưa đạt" radius={[8, 8, 0, 0]} opacity={0.5} />
              <Line type="monotone" dataKey={teamAverage} stroke="#f59e0b" strokeWidth={3} name="Trung bình đội nhóm" dot={false} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <p>Không có dữ liệu doanh số</p>
          </div>
        )}

        {/* Employee Performance Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nhân viên</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Doanh số</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Mục tiêu</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Hoàn thành</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Số đơn</th>
              </tr>
            </thead>
            <tbody>
              {salesPerformanceData.map((emp, idx) => {
                const completion = ((emp.sales / emp.target) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-300">{emp.name}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-semibold">{emp.sales.toFixed(2)} tỷ</td>
                    <td className="py-3 px-4 text-right text-gray-400">{emp.target} tỷ</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(completion) >= 100 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : parseFloat(completion) >= 80 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                        {completion}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-blue-400 font-semibold">{emp.orders}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debt Management Section */}
      <div className="bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-lg">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            💸 Báo cáo công nợ & Aging
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setDebtType('AR')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border ${
                debtType === 'AR'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md shadow-emerald-500/30 scale-[1.03]'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
            >
              👥 AR - Công nợ khách hàng
            </button>

            <button
              onClick={() => setDebtType('AP')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border ${
                debtType === 'AP'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-md shadow-blue-500/30 scale-[1.03]'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
            >
              🏢 AP - Công nợ nhà cung cấp
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl p-5 border border-blue-500/30">
            <div className="text-sm text-gray-400 mb-2">Tổng công nợ</div>
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalOutstanding)}</div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-xl p-5 border border-red-500/30">
            <div className="text-sm text-gray-400 mb-2">Quá hạn</div>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(totalOverdue)}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 rounded-xl p-5 border border-emerald-500/30">
            <div className="text-sm text-gray-400 mb-2">Số hóa đơn</div>
            <div className="text-2xl font-bold text-emerald-400">{currentDebtData.length}</div>
          </div>
        </div>

        {/* Aging Buckets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            📊 Phân tích theo Aging Buckets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(agingSummary).map(([bucket, amount]) => (
              <button
                key={bucket}
                onClick={() => setSelectedAging(selectedAging === bucket ? 'all' : bucket)}
                className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 transform ${
                  selectedAging === bucket
                    ? 'bg-gradient-to-br from-emerald-500/15 to-teal-500/5 border-emerald-400/60 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] scale-[1.02]'
                    : 'bg-gray-700/50 border-gray-600 hover:border-emerald-400/40 hover:shadow-[0_0_12px_-4px_rgba(16,185,129,0.25)] hover:scale-[1.01]'
                  }`}
              >
                <div className="text-sm text-gray-400 mb-1">
                  {bucket} ngày
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(amount)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {
                    currentDebtData.filter(
                      item => item.aging === bucket && item.outstanding > 0
                    ).length
                  } hóa đơn
                </div>
              </button>
            ))}
          </div>

          {selectedAging !== 'all' && (
            <button
              onClick={() => setSelectedAging('all')}
              className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>←</span> <span>Xem tất cả</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={exportToCSV}
            className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 
               bg-emerald-600 hover:bg-emerald-700 text-white
               transition-colors shadow-md"
          >
            📥 Export CSV
          </button>
          <button
            onClick={loadReportsData}
            className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 
               bg-blue-600 hover:bg-blue-700 text-white
               transition-colors shadow-md"
          >
            � Làm mới
          </button>
        </div>

        {/* Debt Table */}
        <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-700 bg-gray-900">
          <table className="w-full rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b-2 border-gray-700 bg-gray-800">
                {[
                  "Mã",
                  debtType === "AR" ? "Khách hàng" : "Nhà cung cấp",
                  "Hóa đơn",
                  "Tổng tiền",
                  "Đã thanh toán",
                  "Còn nợ",
                  "Hạn TT",
                  "Aging",
                  "Trạng thái",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="text-left py-4 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredDebtData.length > 0 ? (
                filteredDebtData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-800/50 transition-all"
                  >
                    <td className="py-4 px-4 font-semibold text-white">
                      {item.id}
                    </td>

                    <td className="py-4 px-4 text-gray-300 font-medium">
                      {debtType === "AR" ? item.customer : item.supplier}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sky-400 font-semibold hover:underline cursor-pointer">
                        {item.invoice}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right text-gray-200 font-semibold">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="text-emerald-400 font-semibold">
                        {formatCurrency(item.paid)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span
                        className={`font-bold ${
                          item.outstanding > 0
                            ? "text-red-400"
                            : "text-gray-500"
                        }`}
                      >
                        {formatCurrency(item.outstanding)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center text-sm text-gray-400">
                      {item.dueDate}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 bg-sky-800/40 text-sky-300 rounded-lg text-xs font-semibold border border-sky-700">
                        {item.aging}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    Không có dữ liệu công nợ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default ReportsSection;
