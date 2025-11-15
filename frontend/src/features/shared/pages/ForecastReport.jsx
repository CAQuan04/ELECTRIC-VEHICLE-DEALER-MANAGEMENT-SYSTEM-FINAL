import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from '../../../utils/api/apiClient'; // Đảm bảo đường dẫn này đúng
import { useAuth } from '../../../context/AuthContext'; // Import useAuth để lấy vai trò người dùng

// 🌈 Màu cho biểu đồ
const DEALER_COLORS = {
  "Đại lý A - Hà Nội": "#06b6d4",
  "Đại lý B - TPHCM": "#a78bfa",
  "Đại lý Sài Gòn": "#34d399",
  "VinFast Thang Long": "#f97316",
  "VinFast Sài Gòn": "#ec4899",
};

const ForecastReport = () => {
  // --- STATE MANAGEMENT ---
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isJobRunning, setIsJobRunning] = useState(false);
  const { user } = useAuth(); // Lấy thông tin user hiện tại

  // Ghi chú: Xác định quyền dựa trên vai trò của người dùng lấy từ AuthContext.
  const canRunAI = user?.role === "Admin"; 

  // --- API CALLS ---
  const fetchForecasts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/Analytics/demand-forecasts');
      setForecasts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dự báo:", error);
      setForecasts([]); // Đặt lại thành mảng rỗng nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRunForecast = async () => {
    if (!canRunAI) return;
    setIsJobRunning(true);
    try {
      // Gửi yêu cầu chạy job và nhận lại jobId
      const response = await apiClient.post('/api/Analytics/run-demand-forecast');
      console.log("Đã gửi yêu cầu chạy Job AI, Job ID:", response.data.jobId);
      // Có thể thêm logic kiểm tra trạng thái job sau một khoảng thời gian
      alert("Yêu cầu đã được gửi. Dữ liệu sẽ được cập nhật sau vài phút. Vui lòng nhấn 'Làm mới' để xem kết quả.");
    } catch (error) {
      console.error("Lỗi khi kích hoạt Job AI:", error);
      alert("Kích hoạt Job AI thất bại.");
    } finally {
      setIsJobRunning(false);
    }
  };

  // Lấy dữ liệu lần đầu khi trang được tải
  useEffect(() => {
    fetchForecasts();
  }, [fetchForecasts]);

  // --- DATA PREPARATION FOR CHART ---
  // Ghi chú: Phần này rất phức tạp và phụ thuộc vào dữ liệu lịch sử.
  // Hiện tại, chúng ta sẽ tạm thời ẩn biểu đồ và chỉ tập trung vào bảng.
  // Để biểu đồ hoạt động, bạn cần một API khác để lấy dữ liệu bán hàng lịch sử đã được tổng hợp.

  return (
    <div className="space-y-8 p-4 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400">
            🤖 Dự báo nhu cầu sản xuất & phân phối
          </h2>
          <p className="text-slate-400 mt-1">
            AI phân tích dữ liệu bán hàng lịch sử để dự báo số lượng cần sản xuất cho kỳ tiếp theo.
          </p>
        </div>
        
        {/* Ghi chú: Thêm thông tin về lịch chạy tự động */}
        <div className="text-right text-xs text-slate-500 bg-slate-800/50 p-2 rounded-lg">
          <p>🤖 Lần chạy tự động tiếp theo:</p>
          <p className="font-semibold text-amber-400">Chủ Nhật hàng tuần (18:00)</p>
        </div>
      </div>

      {/* Bộ điều khiển */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleRunForecast}
          disabled={!canRunAI || isJobRunning}
          className={`px-4 py-2 rounded-xl font-semibold shadow transition ${
            canRunAI
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isJobRunning ? "🔄 Đang chạy mô hình AI..." : "🚀 Chạy dự báo (Thủ công)"}
        </button>

        <button
          onClick={fetchForecasts}
          className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "🔁 Làm mới dữ liệu"}
        </button>

        {!canRunAI && (
          <span className="text-slate-500 text-sm italic">
            (Bạn đang ở chế độ xem – chỉ Admin được phép chạy mô hình)
          </span>
        )}
      </div>
      
      {/* Ghi chú: Thêm một dòng giải thích về kết quả đang xem */}
      {forecasts.length > 0 && (
        <p className="text-sm text-slate-400 italic">
          Bảng bên dưới hiển thị kết quả từ lần chạy AI gần nhất vào lúc: <span className="font-semibold text-cyan-400">{new Date(forecasts[0].createdAt).toLocaleString('vi-VN')}</span>
        </p>
      )}

      {/* Bảng dự báo */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <table className="min-w-full border-collapse text-base">
          <thead className="bg-slate-800/60 text-indigo-300">
            <tr>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Tên xe</th>
              <th className="p-3 text-left">Kỳ dự báo</th>
              <th className="p-3 text-left">Số lượng dự báo</th>
              <th className="p-3 text-left">Thời gian tạo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="p-6 text-center">Đang tải dữ liệu dự báo...</td></tr>
            ) : forecasts.length > 0 ? (
              forecasts.map((f) => (
                <tr key={f.forecastId} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-3 font-medium">{f.dealerName}</td>
                  <td className="p-3">{f.vehicleName}</td>
                  <td className="p-3">{f.forecastPeriodStart}</td>
                  <td className="p-3 font-semibold text-indigo-300">
                    {f.predictedQuantity}
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(f.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400 italic">
                  Chưa có dữ liệu dự báo. Nhấn “Chạy dự báo AI” để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Biểu đồ (Tạm thời ẩn đi) */}
      {/* 
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-indigo-300 mb-3">
          Xu hướng tiêu thụ & Dự báo AI (đa đại lý)
        </h3>
        // Logic biểu đồ cần API dữ liệu lịch sử...
      </div>
      */}
    </div>
  );
};

export default ForecastReport;