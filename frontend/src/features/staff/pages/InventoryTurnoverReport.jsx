import React, { useState, useEffect, useCallback } from "react";
import { 
  Activity, Calendar, Filter, ChevronDown, 
  RefreshCw, ArrowRight, Package, TrendingUp 
} from "lucide-react";
import apiClient from "../../../utils/api/apiClient"; 

// --- UI COMPONENTS ---
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

// --- Helper utils ---
const turnoverColor = (rate) => {
  if (rate >= 80) return "text-emerald-400";
  if (rate >= 50) return "text-yellow-400";
  return "text-rose-400";
};

const getFirstDayOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
const getToday = () => new Date().toISOString().slice(0, 10);

const InventoryTurnoverReport = () => {
  // --- STATE MANAGEMENT ---
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
    dealerId: "", // Để trống là "Tất cả đại lý"
  });
  
  // State cho dropdown
  const [dealers, setDealers] = useState([]);

  // --- API CALLS ---

  // Tải danh sách đại lý cho dropdown
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await apiClient.get('/Dealers/basic');
        setDealers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đại lý:", error);
      }
    };
    fetchDealers();
  }, []);

  // Hàm gọi API chính để lấy dữ liệu báo cáo
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: filters.startDate,
        EndDate: filters.endDate,
        DealerId: filters.dealerId ? parseInt(filters.dealerId) : undefined,
      };
      const response = await apiClient.get('/Analytics/inventory-turnover', { params });
      setReportData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải báo cáo tồn kho:", error);
      setReportData([]);
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

  // --- RENDER ---
  return (
    <PageContainer>
      {/* 1. Header */}
      <PageHeader
        title="Báo cáo Tồn kho & Hiệu suất"
        subtitle="Theo dõi biến động kho và tốc độ tiêu thụ (Sell-through Rate)."
        icon={<Activity />}
        breadcrumbs={[{ label: "Trang chủ", path: "/" }, { label: "Báo cáo Kho" }]}
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

                {/* Dealer Filter */}
                <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300 text-base font-semibold truncate">Đại lý</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-sm uppercase tracking-wider truncate max-w-[150px] text-right">
                            {filters.dealerId ? dealers.find(d => d.dealerId.toString() === filters.dealerId)?.name : "Tất cả"}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                    <select 
                        name="dealerId" 
                        value={filters.dealerId} 
                        onChange={handleFilterChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white"
                    >
                        <option value="" className="bg-[#1e293b]">Tất cả đại lý</option>
                        {dealers.map(d => (
                            <option key={d.dealerId} value={d.dealerId} className="bg-[#1e293b]">{d.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* 3. REPORT GRID */}
        {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">Đang phân tích dữ liệu...</div>
        ) : reportData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reportData.map((item, index) => (
                    <Card 
                        key={index} 
                        className="group relative hover:scale-[1.02] transition-all duration-300 border-slate-700/50 hover:border-blue-500/50 bg-[#1e293b]/60 backdrop-blur-xl"
                    >
                        {/* Decorative glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                        
                        <div className="relative p-2">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Package size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white truncate max-w-[200px]" title={item.groupingKey}>
                                        {item.groupingKey}
                                    </h3>
                                </div>
                                <Badge variant={item.sellThroughRatePercentage >= 50 ? 'success' : 'warning'}>
                                    STR: {item.sellThroughRatePercentage}%
                                </Badge>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 mb-1">Tồn đầu kỳ</p>
                                    <p className="text-xl font-bold text-white">{item.openingStock}</p>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                                    <p className="text-xs text-slate-400 mb-1">Tồn cuối kỳ</p>
                                    <p className="text-xl font-bold text-white">{item.closingStock}</p>
                                </div>
                            </div>

                            {/* Flow Chart (Visual representation using text) */}
                            <div className="flex items-center justify-between text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="text-center">
                                    <p className="text-emerald-400 font-bold text-lg">+{item.quantityReceived}</p>
                                    <p className="text-slate-500 text-xs uppercase">Nhập</p>
                                </div>
                                <div className="flex-1 flex justify-center text-slate-600">
                                    <ArrowRight size={16} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sky-400 font-bold text-lg">-{item.quantitySold}</p>
                                    <p className="text-slate-500 text-xs uppercase">Bán</p>
                                </div>
                            </div>

                            {/* Footer: Efficiency */}
                            <div className="mt-4 flex items-center gap-2 pt-2">
                                <TrendingUp size={16} className={turnoverColor(item.sellThroughRatePercentage)} />
                                <span className="text-sm text-slate-400">Hiệu suất tiêu thụ: </span>
                                <span className={`font-bold ${turnoverColor(item.sellThroughRatePercentage)}`}>
                                    {item.sellThroughRatePercentage >= 80 ? 'Rất tốt' : item.sellThroughRatePercentage >= 50 ? 'Ổn định' : 'Chậm'}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <EmptyState 
                icon="📉" 
                title="Không có dữ liệu" 
                description="Không tìm thấy hoạt động kho nào trong khoảng thời gian này." 
            />
        )}
      </div>
    </PageContainer>
  );
};

export default InventoryTurnoverReport;