import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  BarChart3, Calendar, Filter, 
  RefreshCw, ChevronDown, DollarSign, Package 
} from "lucide-react";
import apiClient from "../../../utils/api/apiClient"; 

// --- UI COMPONENTS ---
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

// --- HELPER UTILS ---
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") : n;
const getFirstDayOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const getToday = () => new Date().toISOString().slice(0, 10);

const SalesReport = () => {
  // --- STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
    groupBy: 'dealer',
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

  // --- TABLE COLUMNS DEFINITION ---
  const columns = useMemo(() => [
    { 
      key: 'groupingKey', 
      label: filters.groupBy === 'dealer' ? 'Tên Đại lý' : 'Khu vực',
      render: (row) => <span className="font-bold text-white">{row.groupingKey}</span>
    },
    { 
      key: 'totalQuantitySold', 
      label: 'Số lượng xe', 
      render: (row) => <span className="font-medium">{row.totalQuantitySold} xe</span>
    },
    { 
      key: 'totalRevenue', 
      label: 'Doanh thu', 
      render: (row) => <span className="font-bold text-emerald-400 text-lg">{formatMoney(row.totalRevenue)} VNĐ</span>
    }
  ], [filters.groupBy]);

  // --- RENDER ---
  return (
    <PageContainer>
      {/* 1. Header */}
      <PageHeader
        title="Báo cáo Doanh số"
        subtitle="Phân tích hiệu quả kinh doanh theo thời gian thực."
        icon={<BarChart3 />}
        breadcrumbs={[{ label: "Trang chủ", path: "/" }, { label: "Báo cáo & Thống kê" }]}
        actions={
            <Button variant="primary" onClick={fetchReport} icon={<RefreshCw size={18} className={loading ? "animate-spin" : ""} />}>
                {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
            </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* 2. FILTER BAR (Style đồng bộ) */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 shadow-2xl overflow-x-auto rounded-lg">
            <div className="flex items-center w-full h-auto md:h-24">
                
                {/* Label */}
                <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                    <span className="text-blue-400 font-bold text-lg tracking-wide mr-3">Filter</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
                </div>

                {/* Start Date */}
                <div className="h-full flex items-center px-4 md:px-6 border-r border-gray-700/60 min-w-[200px] group cursor-pointer hover:bg-[#1a2b44]/20 transition">
                    <span className="text-gray-400 text-sm font-semibold mr-3 block">Từ ngày</span>
                    <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 focus-within:border-blue-500 transition w-full">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <input 
                            type="date" 
                            name="startDate" 
                            value={filters.startDate} 
                            onChange={handleFilterChange} 
                            className="bg-transparent border-none p-0 text-white text-sm w-full focus:ring-0"
                        />
                    </div>
                </div>

                {/* End Date */}
                <div className="h-full flex items-center px-4 md:px-6 border-r border-gray-700/60 min-w-[200px] group cursor-pointer hover:bg-[#1a2b44]/20 transition">
                    <span className="text-gray-400 text-sm font-semibold mr-3 block">Đến ngày</span>
                    <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 focus-within:border-blue-500 transition w-full">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <input 
                            type="date" 
                            name="endDate" 
                            value={filters.endDate} 
                            onChange={handleFilterChange} 
                            className="bg-transparent border-none p-0 text-white text-sm w-full focus:ring-0"
                        />
                    </div>
                </div>

                {/* Group By */}
                <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300 text-base font-semibold truncate">Nhóm theo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">
                            {filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                    <select 
                        name="groupBy" 
                        value={filters.groupBy} 
                        onChange={handleFilterChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white"
                    >
                        <option value="dealer" className="bg-[#1e293b]">Đại lý</option>
                        <option value="region" className="bg-[#1e293b]">Khu vực</option>
                    </select>
                </div>
            </div>
        </div>

        {/* 3. STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={120} /></div>
                <div className="relative z-10">
                    <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider">Tổng Doanh Thu</p>
                    <h3 className="text-4xl font-black text-emerald-400">{formatMoney(summary.totalRevenue)} <span className="text-lg text-slate-500">VNĐ</span></h3>
                </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Package size={120} /></div>
                <div className="relative z-10">
                    <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider">Tổng Xe Bán Ra</p>
                    <h3 className="text-4xl font-black text-sky-400">{summary.totalQuantity} <span className="text-lg text-slate-500">Xe</span></h3>
                </div>
            </div>
        </div>

        {/* 4. CHART SECTION */}
        <Card className="p-6 bg-[#1e293b]/50 backdrop-blur-xl border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-sky-400" />
                    Biểu đồ doanh thu theo {filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}
                </h3>
            </div>
            <div className="w-full h-[400px]">
                {loading ? (
                    <div className="h-full grid place-items-center text-slate-500">Đang vẽ biểu đồ...</div>
                ) : reportData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="groupingKey" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v / 1e9).toFixed(1)} tỷ`} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip
                                cursor={{ fill: '#334155', opacity: 0.2 }}
                                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`${formatMoney(value)} VNĐ`, "Doanh thu"]}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar 
                                dataKey="totalRevenue" 
                                name="Doanh thu" 
                                fill="url(#colorRevenue)" 
                                radius={[6, 6, 0, 0]} 
                                barSize={50}
                            />
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full grid place-items-center text-slate-500">Chưa có dữ liệu để hiển thị biểu đồ</div>
                )}
            </div>
        </Card>

        {/* 5. DATA TABLE */}
        <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
            {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-400">Đang tải dữ liệu chi tiết...</div>
            ) : reportData.length > 0 ? (
                <Table 
                    columns={columns} 
                    data={reportData} 
                    className="bg-[#1e293b]/50 backdrop-blur-xl"
                />
            ) : (
                <EmptyState 
                    icon="📊" 
                    title="Không có dữ liệu" 
                    description="Thử thay đổi khoảng thời gian hoặc tiêu chí lọc." 
                />
            )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default SalesReport;