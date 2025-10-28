import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

// Mock data for sales performance
const salesPerformanceDataRaw = [
  { name: 'Nguyễn Văn A', sales: 2.4, target: 2.0, orders: 8 },
  { name: 'Trần Thị B', sales: 3.2, target: 2.5, orders: 11 },
  { name: 'Lê Văn C', sales: 1.8, target: 2.0, orders: 6 },
  { name: 'Phạm Thị D', sales: 2.9, target: 2.5, orders: 10 },
  { name: 'Hoàng Văn E', sales: 2.1, target: 2.0, orders: 7 },
  { name: 'Võ Thị F', sales: 3.5, target: 3.0, orders: 12 }
];

// Transform data for stacked bar chart
const salesPerformanceData = salesPerformanceDataRaw.map(emp => ({
  ...emp,
  achieved: Math.min(emp.sales, emp.target),
  exceeded: emp.sales > emp.target ? emp.sales - emp.target : 0,
  remaining: emp.sales < emp.target ? emp.target - emp.sales : 0
}));

const teamAverage = salesPerformanceDataRaw.reduce((sum, emp) => sum + emp.sales, 0) / salesPerformanceDataRaw.length;

// Mock AR data (Accounts Receivable - Công nợ khách hàng)
const arData = [
  { id: 'AR001', customer: 'Nguyễn Văn A', invoice: 'INV-2024-001', amount: 1200000000, paid: 800000000, outstanding: 400000000, dueDate: '2025-10-25', aging: '0-30', status: 'Chưa quá hạn' },
  { id: 'AR002', customer: 'Trần Thị B', invoice: 'INV-2024-002', amount: 950000000, paid: 0, outstanding: 950000000, dueDate: '2025-09-15', aging: '31-60', status: 'Quá hạn' },
  { id: 'AR003', customer: 'Lê Văn C', invoice: 'INV-2024-003', amount: 1500000000, paid: 1500000000, outstanding: 0, dueDate: '2025-10-10', aging: '0-30', status: 'Đã thanh toán' },
  { id: 'AR004', customer: 'Phạm Thị D', invoice: 'INV-2024-004', amount: 2100000000, paid: 500000000, outstanding: 1600000000, dueDate: '2025-08-20', aging: '61-90', status: 'Quá hạn' },
  { id: 'AR005', customer: 'Hoàng Văn E', invoice: 'INV-2024-005', amount: 850000000, paid: 850000000, outstanding: 0, dueDate: '2025-10-12', aging: '0-30', status: 'Đã thanh toán' }
];

// Mock AP data (Accounts Payable - Công nợ nhà cung cấp)
const apData = [
  { id: 'AP001', supplier: 'EVM Corporation', invoice: 'PO-2024-001', amount: 5000000000, paid: 3000000000, outstanding: 2000000000, dueDate: '2025-10-30', aging: '0-30', status: 'Chưa quá hạn' },
  { id: 'AP002', supplier: 'EVM Corporation', invoice: 'PO-2024-002', amount: 4500000000, paid: 0, outstanding: 4500000000, dueDate: '2025-09-10', aging: '31-60', status: 'Quá hạn' },
  { id: 'AP003', supplier: 'Tesla Parts Supplier', invoice: 'PO-2024-003', amount: 1200000000, paid: 1200000000, outstanding: 0, dueDate: '2025-10-05', aging: '0-30', status: 'Đã thanh toán' },
  { id: 'AP004', supplier: 'EVM Corporation', invoice: 'PO-2024-004', amount: 6000000000, paid: 1000000000, outstanding: 5000000000, dueDate: '2025-08-15', aging: '61-90', status: 'Quá hạn' }
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-cyan-500/30 dark:border-emerald-500/30 rounded-lg p-4 shadow-xl">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
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
      case 'Đã thanh toán': return 'dark:text-emerald-400 text-emerald-600 dark:bg-emerald-500/20 bg-emerald-100';
      case 'Chưa quá hạn': return 'dark:text-blue-400 text-blue-600 dark:bg-blue-500/20 bg-blue-100';
      case 'Quá hạn': return 'dark:text-red-400 text-red-600 dark:bg-red-500/20 bg-red-100';
      default: return 'dark:text-gray-400 text-gray-600 dark:bg-gray-500/20 bg-gray-100';
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

  return (
    <div className="space-y-8">

      {/* Sales Performance Chart */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            📈 Báo cáo doanh số theo nhân viên
          </h2>
          <div className="flex gap-2">
            <div className="px-4 py-2 dark:bg-emerald-500/20 bg-emerald-100 rounded-lg border dark:border-emerald-500/30 border-emerald-300">
              <span className="text-sm dark:text-gray-400 text-gray-600">TB đội nhóm: </span>
              <span className="text-lg font-bold dark:text-emerald-400 text-emerald-600">{teamAverage.toFixed(2)} tỷ</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={salesPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="dark:opacity-100 opacity-30" />
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

        {/* Employee Performance Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-white/10 border-gray-200">
                <th className="text-left py-3 px-4 dark:text-gray-400 text-gray-600 font-semibold">Nhân viên</th>
                <th className="text-right py-3 px-4 dark:text-gray-400 text-gray-600 font-semibold">Doanh số</th>
                <th className="text-right py-3 px-4 dark:text-gray-400 text-gray-600 font-semibold">Mục tiêu</th>
                <th className="text-right py-3 px-4 dark:text-gray-400 text-gray-600 font-semibold">Hoàn thành</th>
                <th className="text-right py-3 px-4 dark:text-gray-400 text-gray-600 font-semibold">Số đơn</th>
              </tr>
            </thead>
            <tbody>
              {salesPerformanceData.map((emp, idx) => {
                const completion = ((emp.sales / emp.target) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b dark:border-white/5 border-gray-100 dark:hover:bg-white/5 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium dark:text-gray text-gray-900">{emp.name}</td>
                    <td className="py-3 px-4 text-right dark:text-emerald-400 text-emerald-600 font-semibold">{emp.sales} tỷ</td>
                    <td className="py-3 px-4 text-right dark:text-gray-400 text-gray-600">{emp.target} tỷ</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${parseFloat(completion) >= 100 ? 'dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-400 text-emerald-600' :
                          parseFloat(completion) >= 80 ? 'dark:bg-yellow-500/20 bg-yellow-100 dark:text-yellow-400 text-yellow-600' :
                            'dark:bg-red-500/20 bg-red-100 dark:text-red-400 text-red-600'
                        }`}>
                        {completion}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right dark:text-blue-400 text-blue-600 font-semibold">{emp.orders}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debt Management Section */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-lg">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            💸 Báo cáo công nợ & Aging
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setDebtType('AR')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border
      ${debtType === 'AR'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md shadow-emerald-500/30 scale-[1.03]'
                  : 'bg-white/70 dark:bg-white/10 border-gray-300/30 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/20'
                }`}
            >
              👥 AR - Công nợ khách hàng
            </button>

            <button
              onClick={() => setDebtType('AP')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border
      ${debtType === 'AP'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-md shadow-blue-500/30 scale-[1.03]'
                  : 'bg-white/70 dark:bg-white/10 border-gray-300/30 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/20'
                }`}
            >
              🏢 AP - Công nợ nhà cung cấp
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="dark:bg-gradient-to-br dark:from-blue-600/20 dark:to-blue-700/20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-5 border dark:border-blue-500/30 border-blue-300">
            <div className="text-sm dark:text-gray-400 text-gray-600 mb-2">Tổng công nợ</div>
            <div className="text-2xl font-bold dark:text-blue-400 text-blue-600">{formatCurrency(totalOutstanding)}</div>
          </div>
          <div className="dark:bg-gradient-to-br dark:from-red-600/20 dark:to-red-700/20 bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-5 border dark:border-red-500/30 border-red-300">
            <div className="text-sm dark:text-gray-400 text-gray-600 mb-2">Quá hạn</div>
            <div className="text-2xl font-bold dark:text-red-400 text-red-600">{formatCurrency(totalOverdue)}</div>
          </div>
          <div className="dark:bg-gradient-to-br dark:from-emerald-600/20 dark:to-emerald-700/20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-5 border dark:border-emerald-500/30 border-emerald-300">
            <div className="text-sm dark:text-gray-400 text-gray-600 mb-2">Số hóa đơn</div>
            <div className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">{currentDebtData.length}</div>
          </div>
        </div>

        {/* Aging Buckets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black dark:text-white">
            📊 Phân tích theo Aging Buckets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(agingSummary).map(([bucket, amount]) => (
              <button
                key={bucket}
                onClick={() => setSelectedAging(selectedAging === bucket ? 'all' : bucket)}
                className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 transform
          ${selectedAging === bucket
                    ? 'bg-gradient-to-br from-emerald-500/15 to-teal-500/5 border-emerald-400/60 dark:border-emerald-500/70 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] scale-[1.02]'
                    : 'bg-white dark:bg-white/5 border-gray-500 dark:border-white/10 hover:border-emerald-400/40 hover:shadow-[0_0_12px_-4px_rgba(16,185,129,0.25)] hover:scale-[1.01]'
                  }`}
              >
                <div className="text-sm text-black dark:text-gray-900 mb-1">
                  {bucket} ngày
                </div>
                <div className="text-2xl font-bold text-black dark:text-black-500">
                  {formatCurrency(amount)}
                </div>
                <div className="text-xs text-black/80 dark:text-gray-400 mt-1">
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
              className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
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
               bg-black text-white hover:bg-neutral-800 
               dark:bg-emerald-600 dark:hover:bg-emerald-700 
               transition-colors shadow-md"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Debt Table */}
        <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200 dark:border-gray-100 bg-white dark:bg-gray-100">
          <table className="w-full rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-sky-50 dark:bg-sky-900/30">
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
                    className="text-left py-4 px-4 text-black-100 dark:text-black-200 font-semibold text-sm uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-300">
              {filteredDebtData.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-sky-50/60 dark:hover:bg-sky-900/20 transition-all"
                >
                  <td className="py-4 px-4 font-semibold text-black">
                    {item.id}
                  </td>

                  <td className="py-4 px-4 text-gray-800 dark:text-gray-600 font-medium">
                    {debtType === "AR" ? item.customer : item.supplier}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer">
                      {item.invoice}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right text-gray-900 dark:text-gray-700 font-semibold">
                    {formatCurrency(item.amount)}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(item.paid)}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span
                      className={`font-bold ${item.outstanding > 0
                          ? "text-red-600 dark:text-red-600"
                          : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {formatCurrency(item.outstanding)}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center text-sm text-gray-700 dark:text-gray-400">
                    {item.dueDate}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1.5 bg-sky-100 dark:bg-sky-800/40 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold border border-sky-200 dark:border-sky-700">
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
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default ReportsSection;
