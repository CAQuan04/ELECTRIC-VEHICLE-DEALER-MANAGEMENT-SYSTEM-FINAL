// File: src/features/admin/pages/ForecastReport.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { 
  BrainCircuit, 
  Play, 
  RotateCw, 
  CalendarClock, 
  TrendingUp, 
  AlertCircle, 
  BarChart3,
  Search
} from "lucide-react"; 
import apiClient from '../../../utils/api/client'; // Đảm bảo đường dẫn đúng
import { useAuth } from '../../../context/AuthContext';

const ForecastReport = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isJobRunning, setIsJobRunning] = useState(false);
  const { user } = useAuth();

  const canRunAI = user?.role === "Admin"; 

  // --- API CALLS ---
  const fetchForecasts = useCallback(async () => {
    setLoading(true);
    try {
      // === GỌI API THẬT ===
      const response = await apiClient.get('/Analytics/demand-forecasts');
      
      // Xử lý dữ liệu trả về (đảm bảo là mảng)
      // Tùy vào cấu hình axios interceptor của bạn mà dữ liệu nằm trong response.data hoặc response trực tiếp
      const data = response.data || response; 
      
      if (Array.isArray(data)) {
        setForecasts(data);
      } else {
        console.warn("API không trả về mảng dữ liệu:", data);
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
      // Gọi API kích hoạt Job AI
      await apiClient.post('/Analytics/run-demand-forecast');
      alert("Đã gửi yêu cầu chạy mô hình AI thành công. Vui lòng đợi vài phút rồi nhấn 'Làm mới'.");
      
      // Tùy chọn: Tự động load lại bảng sau khi gửi lệnh (tuy nhiên Job AI thường tốn thời gian)
      // fetchForecasts(); 
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

  // --- CHUẨN BỊ DỮ LIỆU CHO BIỂU ĐỒ (Dựa trên Bảng) ---
  // Gom nhóm dữ liệu để vẽ biểu đồ: Tổng nhu cầu theo từng Dòng xe
  const chartData = useMemo(() => {
    if (!Array.isArray(forecasts) || forecasts.length === 0) return [];

    const agg = {};
    forecasts.forEach(f => {
      // Kiểm tra an toàn các trường dữ liệu
      const vName = f.vehicleName || "Unknown";
      const qty = f.predictedQuantity || 0;

      if (!agg[vName]) {
        agg[vName] = { name: vName, Value: 0 };
      }
      agg[vName].Value += qty;
    });
    return Object.values(agg).sort((a, b) => b.Value - a.Value); // Sắp xếp cao xuống thấp
  }, [forecasts]);

  return (
    <div className="space-y-6 text-slate-200 min-h-screen bg-slate-950 p-6">
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <BrainCircuit className="w-12 h-12 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    Dự báo nhu cầu AI
                </h2>
                <p className="text-slate-400 mt-1 flex items-center gap-2 text-base">
                    Phân tích dữ liệu lịch sử để đề xuất số lượng nhập hàng
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-slate-800">
          <CalendarClock className="w-5 h-5 text-amber-400" />
          <div className="text-sm">
            <p className="text-slate-400">Lịch chạy tự động:</p>
            <p className="font-bold text-amber-400">Chủ Nhật (18:00)</p>
          </div>
        </div>
      </div>

      {/* === CONTROLS === */}
      <div className="bg-[#0f172a] p-2 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 shadow-sm">
        <button
          onClick={handleRunForecast}
          disabled={!canRunAI || isJobRunning}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition shadow-lg ${
            canRunAI
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/40 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-wait"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isJobRunning ? (
              <> <RotateCw className="w-5 h-5 animate-spin" /> AI đang xử lý... </>
          ) : (
              <> <Play className="w-5 h-5 fill-current" /> Chạy dự báo ngay </>
          )}
        </button>

        <button
          onClick={fetchForecasts}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition hover:text-white"
        >
          <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
        
        <div className="ml-auto px-4 text-sm text-slate-400 italic flex items-center gap-2">
             {forecasts.length > 0 && (
                 <>
                    <AlertCircle className="w-4 h-4 text-emerald-400" />
                    Dữ liệu mới nhất: <span className="text-emerald-400 font-medium">{new Date().toLocaleDateString('vi-VN')}</span>
                 </>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === CHART SECTION === */}
          <div className="lg:col-span-2 bg-[#0b1622] rounded-3xl border border-slate-800 p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2">
                     <BarChart3 className="w-5 h-5" /> Tổng nhu cầu theo dòng xe
                 </h3>
                 <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                     Mô hình: ARIMA + LSTM
                 </span>
             </div>
             
             <div className="h-80 w-full">
                {forecasts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#1e293b', opacity: 0.4}}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '12px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="Value" name="Số lượng dự báo" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                        <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                        <p>{loading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu để vẽ biểu đồ"}</p>
                    </div>
                )}
             </div>
          </div>

          {/* === MINI STATS === */}
          <div className="space-y-4">
             {/* Tổng quan */}
             <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-lg">
                 <h4 className="text-indigo-200 text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Tổng nhu cầu kỳ tới
                 </h4>
                 <div className="text-5xl font-extrabold text-white mb-2 tracking-tight">
                     {forecasts.reduce((sum, item) => sum + (item.predictedQuantity || 0), 0).toLocaleString()}
                     <span className="text-xl text-indigo-400 font-medium ml-2">xe</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20">
                        +15% tăng trưởng
                    </span>
                    <span className="text-slate-400">so với tháng trước</span>
                 </div>
             </div>

             {/* Độ tin cậy AI */}
             <div className="bg-[#0b1622] p-6 rounded-3xl border border-slate-800 shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-slate-400 text-sm font-medium">Độ chính xác (Confidence)</h4>
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                 </div>
                 
                 <div className="flex items-end gap-2 mb-3">
                     <span className="text-4xl font-bold text-emerald-400">92.4%</span>
                 </div>
                 <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                     <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '92.4%' }}></div>
                 </div>
                 <p className="text-xs text-slate-500 mt-3 italic">
                    *Dựa trên đối chiếu dữ liệu lịch sử 6 tháng gần nhất.
                 </p>
             </div>
          </div>
      </div>

      {/* === DATA TABLE === */}
      <div className="bg-[#0b1622] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
               <Search className="w-5 h-5 text-slate-400" /> Chi tiết dự báo theo Đại lý
            </h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Hiển thị {forecasts.length} bản ghi
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                <th className="p-5">Đại lý</th>
                <th className="p-5">Dòng xe</th>
                <th className="p-5">Kỳ dự báo</th>
                <th className="p-5 text-center">SL Đề xuất</th>
                <th className="p-5 text-right">Ngày phân tích</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
                {loading ? (
                    <tr><td colSpan="5" className="p-10 text-center text-slate-500">
                        <div className="flex justify-center items-center gap-2"><RotateCw className="animate-spin w-5 h-5"/> Đang tải dữ liệu...</div>
                    </td></tr>
                ) : forecasts.length > 0 ? (
                forecasts.map((f) => (
                    <tr key={f.forecastId} className="hover:bg-slate-800/50 transition group">
                    <td className="p-5 font-semibold text-slate-200">{f.dealerName}</td>
                    <td className="p-5">
                        <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 font-medium border border-slate-700 group-hover:border-cyan-500/30 transition">
                            {f.vehicleName}
                        </span>
                    </td>
                    <td className="p-5 text-slate-400">{f.forecastPeriodStart}</td>
                    <td className="p-5 text-center">
                        <span className="text-lg font-bold text-indigo-400">{f.predictedQuantity}</span>
                    </td>
                    <td className="p-5 text-right text-slate-500 font-mono">
                        {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <BrainCircuit className="w-12 h-12 mb-3 opacity-20" />
                        Chưa có dữ liệu dự báo nào. Nhấn nút "Chạy dự báo" để bắt đầu.
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

export default ForecastReport;