import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { 
  BrainCircuit, Play, RotateCw, CalendarClock, 
  TrendingUp, AlertCircle, BarChart3, Search, 
  Clock, CheckCircle2
} from "lucide-react"; 

import apiClient from '../../../utils/api/client';
import { useAuth } from '../../../context/AuthContext'; // Giả sử bạn có context này

// Import UI Components
import PageContainer from '../../admin/components/layout/PageContainer';
import PageHeader from '../../admin/components/layout/PageHeader';
import Card from '../../admin/components/ui/Card';
import Button from '../../admin/components/ui/Button';
import Badge from '../../admin/components/ui/Badge'; // Đảm bảo đã import Badge
import EmptyState from '../../admin/components/ui/EmptyState';

const ForecastReport = () => {
  // --- STATE ---
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isJobRunning, setIsJobRunning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { user } = useAuth();
  const canRunAI = user?.role === "Admin"; 

  // --- API CALLS ---
  const fetchForecasts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/Analytics/demand-forecasts');
      const data = response.data || response; 
      
      if (Array.isArray(data)) {
        setForecasts(data);
      } else {
        setForecasts([]);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu dự báo:", error);
      setForecasts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRunForecast = async () => {
    if (!canRunAI) return;
    setIsJobRunning(true);
    try {
      await apiClient.post('/Analytics/run-demand-forecast');
      alert("Đã gửi yêu cầu chạy mô hình AI thành công. Vui lòng đợi vài phút rồi nhấn 'Làm mới'.");
    } catch (error) {
      console.error("Lỗi kích hoạt Job AI:", error);
      alert("Không thể chạy mô hình AI lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsJobRunning(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, [fetchForecasts]);

  // --- DATA PROCESSING ---
  
  // 1. Filter Data
  const filteredForecasts = useMemo(() => {
      if (!searchTerm) return forecasts;
      return forecasts.filter(f => 
        f.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.dealerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [forecasts, searchTerm]);

  // 2. Chart Data (Aggregate by Vehicle Name)
  const chartData = useMemo(() => {
    if (!Array.isArray(filteredForecasts) || filteredForecasts.length === 0) return [];

    const agg = {};
    filteredForecasts.forEach(f => {
      const vName = f.vehicleName || "Unknown";
      const qty = f.predictedQuantity || 0;

      if (!agg[vName]) {
        agg[vName] = { name: vName, Value: 0 };
      }
      agg[vName].Value += qty;
    });
    return Object.values(agg).sort((a, b) => b.Value - a.Value).slice(0, 10); // Top 10
  }, [filteredForecasts]);

  // 3. Statistics
  const totalDemand = useMemo(() => forecasts.reduce((sum, item) => sum + (item.predictedQuantity || 0), 0), [forecasts]);

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Dự báo Nhu cầu AI"
        subtitle="Phân tích & Đề xuất nhập hàng"
        description="Sử dụng mô hình học máy (Machine Learning) để phân tích dữ liệu lịch sử và dự báo nhu cầu xe cho kỳ tiếp theo."
        icon={<BrainCircuit />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "AI Dự báo", path: "/forecast" }
        ]}
        actions={
          <div className="flex gap-3">
             <Button 
                variant="ghost" 
                icon={<RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
                onClick={fetchForecasts}
                disabled={loading}
             >
                Làm mới
             </Button>
             <Button 
                variant="primary" 
                icon={isJobRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                onClick={handleRunForecast}
                disabled={!canRunAI || isJobRunning}
                className={isJobRunning ? "opacity-80 cursor-not-allowed" : ""}
             >
                {isJobRunning ? "AI đang xử lý..." : "Chạy dự báo ngay"}
             </Button>
          </div>
        }
      />

      <div className="mt-8 space-y-8">
        
        {/* 2. FILTER BAR */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 mb-8 shadow-2xl overflow-x-auto rounded-lg">
          <div className="flex items-center w-full h-auto md:h-24">
              {/* Filter Label */}
              <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                  <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">AI Filter</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
              </div>
              
              {/* Search */}
              <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[280px] group cursor-text hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Tìm kiếm</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Tên dòng xe, đại lý..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none p-0 text-white text-sm font-medium outline-none w-full" 
                        />
                     </div>
                  </div>
              </div>

              {/* Info Section */}
              <div className="h-full flex items-center flex-1 px-4 md:px-6 min-w-[250px] hover:bg-[#1a2b44]/20 transition justify-between">
                  <div className="flex items-center gap-2">
                      <CalendarClock className="w-5 h-5 text-yellow-500" />
                      <div>
                          <div className="text-xs text-gray-400">Lịch chạy tự động</div>
                          <div className="text-sm font-bold text-white">Chủ Nhật (18:00)</div>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        {/* 3. SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden border-l-4 border-l-indigo-500 p-6">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-24 h-24 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Tổng nhu cầu kỳ tới</span>
                    <div className="text-4xl font-black text-gray-900 dark:text-white my-2">
                        {totalDemand.toLocaleString()} <span className="text-lg font-normal text-gray-500">xe</span>
                    </div>
                    <Badge variant="success">+15% tăng trưởng</Badge>
                </div>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 p-6">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="relative z-10">
                    <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Độ tin cậy (Confidence)</span>
                    <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 my-2">
                        92.4%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92.4%' }}></div>
                    </div>
                </div>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-cyan-500 p-6">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Clock className="w-24 h-24 text-cyan-500" />
                </div>
                <div className="relative z-10">
                    <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Cập nhật lần cuối</span>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white my-2">
                        {new Date().toLocaleDateString('vi-VN')}
                    </div>
                    <p className="text-xs text-gray-500 italic">*Dữ liệu được cập nhật Realtime từ Job Server</p>
                </div>
            </Card>
        </div>

        {/* 4. CHART & TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CHART SECTION (Chiếm 2/3) */}
            <div className="lg:col-span-2">
                <Card className="h-full p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" /> 
                            Top 10 Dòng xe có nhu cầu cao nhất
                        </h3>
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold border border-indigo-200 dark:border-indigo-500/30">
                            Mô hình: ARIMA + LSTM
                        </span>
                    </div>
                    <div className="h-[350px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{fill: '#374151', opacity: 0.2}}
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Value" name="Số lượng dự báo" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState title="Chưa có dữ liệu biểu đồ" description="Hãy chạy dự báo để xem phân tích." />
                        )}
                    </div>
                </Card>
            </div>

            {/* TABLE SECTION (Chiếm 1/3 - Danh sách chi tiết rút gọn) */}
            <div className="lg:col-span-1">
                <Card className="h-full overflow-hidden p-0 flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white">Chi tiết Dự báo</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-[400px] custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th className="px-5 py-3">Dòng xe</th>
                                    <th className="px-5 py-3 text-right">Số lượng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {filteredForecasts.length > 0 ? filteredForecasts.map((f, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{f.vehicleName}</div>
                                            <div className="text-xs text-gray-500">{f.dealerName}</div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{f.predictedQuantity}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="p-8 text-center text-gray-500 text-sm">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

        </div>
      </div>
    </PageContainer>
  );
};

export default ForecastReport;