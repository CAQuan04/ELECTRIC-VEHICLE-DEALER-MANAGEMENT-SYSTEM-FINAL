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
    import apiClient from "../../../utils/api/apiClient"; 

// --- Helper utils ---
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
      const response = await apiClient.get('/api/Analytics/sales-report', { params });
      
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

  // --- UI ---
  return (
    <div className="space-y-6 p-4 text-white">
      <h1 className="text-2xl font-bold text-sky-400">
        Báo cáo doanh số
      </h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 items-center bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
        <div>
            <label className="text-sm">Từ ngày:</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="ml-2 rounded-md bg-slate-800 p-2 border border-slate-700" />
        </div>
        <div>
            <label className="text-sm">Đến ngày:</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="ml-2 rounded-md bg-slate-800 p-2 border border-slate-700" />
        </div>
        <div>
            <label className="text-sm">Nhóm theo:</label>
            <select name="groupBy" value={filters.groupBy} onChange={handleFilterChange} className="ml-2 rounded-md bg-slate-800 p-2 border border-slate-700">
                <option value="dealer">Đại lý</option>
                <option value="region">Khu vực</option>
            </select>
        </div>
        <button onClick={fetchReport} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold ml-auto" disabled={loading}>
            {loading ? 'Đang tải...' : 'Xem báo cáo'}
        </button>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng doanh thu</div>
          <div className="text-2xl font-bold text-sky-300">
            {formatMoney(summary.totalRevenue)} VNĐ
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng số lượng xe bán được</div>
          <div className="text-2xl font-bold text-sky-300">
            {summary.totalQuantity} xe
          </div>
        </div>
      </div>

      {loading ? <div className="text-center p-10">Đang tải dữ liệu biểu đồ...</div> : 
       reportData.length > 0 ? (
        <>
          {/* Biểu đồ */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            <h3 className="text-lg font-semibold text-sky-300 mb-3">
              Biểu đồ doanh thu theo {filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}
            </h3>
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="groupingKey" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v / 1e9).toFixed(1)} Tỷ`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px" }}
                    formatter={(value) => [`${formatMoney(value)} VNĐ`, "Doanh thu"]}
                  />
                  <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
                  <Bar dataKey="totalRevenue" name="Doanh thu" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bảng chi tiết */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
            <table className="min-w-full border-collapse text-base">
              <thead className="bg-slate-800/60 text-sky-300">
                <tr>
                  <th className="p-3 text-left">{filters.groupBy === 'dealer' ? 'Đại lý' : 'Khu vực'}</th>
                  <th className="p-3 text-left">Tổng xe bán được</th>
                  <th className="p-3 text-left">Tổng Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((r, index) => (
                  <tr key={index} className="border-t border-slate-800 hover:bg-slate-800/30">
                    <td className="p-3 font-medium">{r.groupingKey}</td>
                    <td className="p-3">{r.totalQuantitySold}</td>
                    <td className="p-3 font-semibold text-emerald-400">{formatMoney(r.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : <div className="text-center p-10 text-slate-500">Không có dữ liệu cho bộ lọc hiện tại.</div>
      }
    </div>
  );
};

export default SalesReport;