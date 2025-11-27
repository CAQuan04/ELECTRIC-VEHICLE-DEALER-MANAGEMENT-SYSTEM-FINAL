import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { 
  BarChart3, Calendar, Filter, RefreshCcw, 
  DollarSign, ShoppingBag, TrendingUp 
} from "lucide-react";

import apiClient from "../../../utils/api/apiClient";

// Import UI Components
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge'; // <--- ĐÃ THÊM IMPORT NÀY
import EmptyState from '../components/ui/EmptyState';

// --- Helper utils ---
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") : n;
const getFirstDayOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const getToday = () => new Date().toISOString().slice(0, 10);

const SalesReport = () => {
  // --- STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
    groupBy: 'dealer', // 'dealer' or 'region'
  });
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalQuantity: 0 });

  // --- API CALLS ---
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: filters.startDate,
        EndDate: filters.endDate,
        GroupBy: filters.groupBy,
      };
      const response = await apiClient.get('/Analytics/sales-report', { params });
      
      const data = response.data.reportData || [];
      setReportData(data);
      
      // Tính toán các số liệu tổng hợp
      const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalQuantity = data.reduce((sum, item) => sum + item.totalQuantitySold, 0);
      setSummary({ totalRevenue, totalQuantity });

    } catch (error) {
      console.error("Lỗi khi tải báo cáo doanh số:", error);
      setReportData([]);
      setSummary({ totalRevenue: 0, totalQuantity: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Báo cáo Doanh thu"
        subtitle="Phân tích hiệu quả kinh doanh"
        description="Theo dõi doanh số bán hàng, số lượng xe bán ra theo từng đại lý hoặc khu vực trong khoảng thời gian tùy chọn."
        icon={<BarChart3 />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Báo cáo", path: "/reports" },
          { label: "Doanh thu", path: "/reports/sales" }
        ]}
        actions={
            <Button 
                variant="primary" 
                icon={<RefreshCcw className="w-4 h-4" />}
                onClick={fetchReport}
                disabled={loading}
            >
                Làm mới
            </Button>
        }
      />

      <div className="mt-8 space-y-8">
        
        {/* 2. FILTER BAR */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 mb-8 shadow-2xl overflow-x-auto rounded-lg">
          <div className="flex items-center w-full h-auto md:h-24">
              
              {/* Filter Label */}
              <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                  <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
              </div>
              
              {/* Start Date */}
              <div className="h-full flex items-center px-4 md:px-6 border-r border-gray-700/60 min-w-[200px] hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Từ ngày</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            type="date" 
                            name="startDate"
                            value={filters.startDate} 
                            onChange={handleFilterChange} 
                            className="bg-transparent border-none p-0 text-white text-sm font-medium outline-none w-full" 
                        />
                     </div>
                  </div>
              </div>

              {/* End Date */}
              <div className="h-full flex items-center px-4 md:px-6 border-r border-gray-700/60 min-w-[200px] hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Đến ngày</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            type="date" 
                            name="endDate"
                            value={filters.endDate} 
                            onChange={handleFilterChange} 
                            className="bg-transparent border-none p-0 text-white text-sm font-medium outline-none w-full" 
                        />
                     </div>
                  </div>
              </div>

              {/* Group By */}
              <div className="h-full flex items-center flex-1 px-4 md:px-6 min-w-[200px] hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Nhóm theo</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2">
                        <Filter className="w-4 h-4 text-gray-400 mr-2" />
                        <select 
                            name="groupBy"
                            value={filters.groupBy} 
                            onChange={handleFilterChange} 
                            className="bg-transparent border-none p-0 text-white text-sm font-medium outline-none w-full cursor-pointer"
                        >
                            <option value="dealer" className="bg-[#1e293b]">Đại lý</option>
                            <option value="region" className="bg-[#1e293b]">Khu vực</option>
                        </select>
                     </div>
                  </div>
              </div>
          </div>
        </div>

        {/* 3. SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="flex flex-col relative z-10">
                    <span className="text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">Tổng Doanh thu</span>
                    <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                        {formatMoney(summary.totalRevenue)} <span className="text-lg text-gray-500 font-normal">VNĐ</span>
                    </span>
                    <div className="mt-4 flex items-center text-emerald-500 text-sm font-bold">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Dữ liệu thực tế</span>
                    </div>
                </div>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShoppingBag className="w-24 h-24 text-blue-500" />
                </div>
                <div className="flex flex-col relative z-10">
                    <span className="text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">Tổng xe bán ra</span>
                    <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                        {summary.totalQuantity} <span className="text-lg text-gray-500 font-normal">xe</span>
                    </span>
                    <div className="mt-4 flex items-center text-blue-500 text-sm font-bold">
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        <span>Đã bàn giao</span>
                    </div>
                </div>
            </Card>
        </div>

        {/* 4. CHART & TABLE SECTION */}
        {loading ? (
             <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                <p className="text-gray-500">Đang phân tích dữ liệu...</p>
             </div>
        ) : reportData.length > 0 ? (
            <div className="space-y-8">
                {/* CHART */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-500" />
                        Biểu đồ doanh thu theo {filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}
                    </h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                                <XAxis 
                                    dataKey="groupingKey" 
                                    stroke="#9ca3af" 
                                    tick={{ fontSize: 12 }} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#9ca3af" 
                                    tickFormatter={(v) => `${(v / 1e9).toFixed(1)} Tỷ`} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }}
                                    itemStyle={{ color: "#fff" }}
                                    formatter={(value) => [`${formatMoney(value)} VNĐ`, "Doanh thu"]}
                                />
                                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                <Bar 
                                    dataKey="totalRevenue" 
                                    name="Doanh thu" 
                                    fill="#06b6d4" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* TABLE */}
                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                                    <th className="px-8 py-6">{filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}</th>
                                    <th className="px-8 py-6 text-center">Tổng xe bán được</th>
                                    <th className="px-8 py-6 text-right">Tổng Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {reportData.map((r, index) => (
                                    <tr key={index} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">
                                            {r.groupingKey}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <Badge variant="info" className="text-lg px-3">
                                                {r.totalQuantitySold}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                            {formatMoney(r.totalRevenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        ) : (
            <EmptyState 
                title="Không có dữ liệu báo cáo" 
                description="Vui lòng thay đổi bộ lọc thời gian hoặc tiêu chí nhóm để xem dữ liệu." 
            />
        )}
      </div>
    </PageContainer>
  );
};

export default SalesReport;