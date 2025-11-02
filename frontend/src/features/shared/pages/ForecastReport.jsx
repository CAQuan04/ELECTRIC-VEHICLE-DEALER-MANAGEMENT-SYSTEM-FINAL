import React, { useState, useEffect, useMemo } from "react";
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
import { runDemandForecast, getForecast } from "../services/forecastService";

// 🌈 Màu riêng cho từng đại lý
const DEALER_COLORS = {
  DL001: "#06b6d4", // Hà Nội
  DL002: "#a78bfa", // TP.HCM
  DL003: "#34d399", // Đà Nẵng
};

// ⚡️ Dữ liệu bán hàng lịch sử (SalesOrder)
const salesHistory = [
  { dealer_id: "DL001", period: "2025-Q1", quantity: 120 },
  { dealer_id: "DL001", period: "2025-Q2", quantity: 140 },
  { dealer_id: "DL001", period: "2025-Q3", quantity: 160 },
  { dealer_id: "DL002", period: "2025-Q1", quantity: 80 },
  { dealer_id: "DL002", period: "2025-Q2", quantity: 90 },
  { dealer_id: "DL002", period: "2025-Q3", quantity: 100 },
  { dealer_id: "DL003", period: "2025-Q1", quantity: 60 },
  { dealer_id: "DL003", period: "2025-Q2", quantity: 75 },
  { dealer_id: "DL003", period: "2025-Q3", quantity: 120 },
];

const ForecastReport = ({ role = "Staff" }) => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const canRunAI = role === "Admin"; // ✅ chỉ Admin được chạy dự báo

  // 🧠 Chạy mô hình AI dự báo
  const handleRunForecast = () => {
    if (!canRunAI)
      return alert("❌ Chỉ Admin mới có quyền chạy mô hình dự báo AI.");
    setLoading(true);
    setTimeout(() => {
      runDemandForecast(); // 🧠 chạy mô hình
      const updated = getForecast(); // 🆕 lấy dữ liệu mới nhất
      setForecasts([...updated]); // cập nhật state
      setLoading(false);
    }, 800);
  };

  // 🔁 Làm mới dữ liệu mock
  const handleRefresh = () => {
    const updated = getForecast();
    setForecasts([...updated]);
  };

  // 🧩 Lấy dữ liệu ban đầu (cho Staff/hoặc lần đầu vào)
  useEffect(() => {
    const data = getForecast();
    setForecasts(data);
  }, []);

  // ⚙️ Chuẩn bị dữ liệu biểu đồ
  const chartData = useMemo(() => {
    const allPeriods = [
      ...new Set([
        ...salesHistory.map((s) => s.period),
        ...forecasts.map((f) => f.forecast_period_start),
      ]),
    ].sort();

    return allPeriods.map((period) => {
      const row = { period };
      for (const dealer of Object.keys(DEALER_COLORS)) {
        const sale = salesHistory.find(
          (s) => s.dealer_id === dealer && s.period === period
        );
        const forecast = forecasts.find(
          (f) => f.dealer_id === dealer && f.forecast_period_start === period
        );
        row[`${dealer}_actual`] = sale ? sale.quantity : null;
        row[`${dealer}_forecast`] = forecast ? forecast.predicted_quantity : null;
      }
      return row;
    });
  }, [forecasts]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-indigo-400">
        🤖 Dự báo nhu cầu sản xuất & phân phối
      </h2>
      <p className="text-slate-400">
        AI phân tích dữ liệu bán hàng lịch sử để dự báo số lượng cần sản xuất cho
        kỳ tiếp theo.
      </p>

      {/* 🎛️ Bộ điều khiển */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleRunForecast}
          disabled={!canRunAI || loading}
          className={`px-4 py-2 rounded-xl font-semibold shadow transition ${
            canRunAI
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {loading ? "🔄 Đang chạy mô hình AI..." : "🚀 Chạy dự báo AI"}
        </button>

        <button
          onClick={handleRefresh}
          className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm"
        >
          🔁 Làm mới dữ liệu
        </button>

        {!canRunAI && (
          <span className="text-slate-500 text-sm italic">
            (Bạn đang ở chế độ xem – chỉ Admin được phép chạy mô hình)
          </span>
        )}
      </div>

      {/* 🧾 Bảng dự báo */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-800/60 text-indigo-300">
            <tr>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Mã xe</th>
              <th className="p-3 text-left">Kỳ dự báo</th>
              <th className="p-3 text-left">Số lượng dự báo</th>
              <th className="p-3 text-left">Thời gian tạo</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.length > 0 ? (
              forecasts.map((f) => (
                <tr
                  key={f.forecast_id}
                  className="border-t border-slate-800 hover:bg-slate-800/30"
                >
                  <td className="p-3">{f.dealer_id}</td>
                  <td className="p-3">{f.vehicle_id}</td>
                  <td className="p-3">{f.forecast_period_start}</td>
                  <td className="p-3 font-semibold text-indigo-300">
                    {f.predicted_quantity}
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(f.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-slate-400 italic"
                >
                  Chưa có dữ liệu dự báo. Nhấn “Chạy dự báo AI” để bắt đầu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📊 Biểu đồ đa đại lý */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-indigo-300 mb-3">
          Xu hướng tiêu thụ & Dự báo AI (đa đại lý)
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 40, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="period" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1", cursor: "pointer" }} />

            {/* Vẽ từng đại lý */}
            {Object.keys(DEALER_COLORS).map((dealer) => (
              <React.Fragment key={dealer}>
                <Line
                  type="monotone"
                  dataKey={`${dealer}_actual`}
                  stroke={DEALER_COLORS[dealer]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={`${dealer} - Thực tế`}
                />
                <Line
                  type="monotone"
                  dataKey={`${dealer}_forecast`}
                  stroke={DEALER_COLORS[dealer]}
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 5 }}
                  name={`${dealer} - Dự báo AI`}
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastReport;
