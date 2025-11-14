import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { aggregateByDealer, generateChart } from "../../admin/service/analyticsService";

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#86efac", "#4ade80"];
const formatMoney = (n) => (typeof n === "number" ? n.toLocaleString("vi-VN") : n);

const SalesReport = () => {
  const [period, setPeriod] = useState("2025-Q3");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // ========== Dữ liệu báo cáo ==========
  const aggregated = useMemo(
    () => aggregateByDealer(period, { region: regionFilter, search }),
    [period, regionFilter, search]
  );

  const { barChartData, pieChartData, summary } = useMemo(
    () => generateChart(aggregated),
    [aggregated]
  );

  const { totalRevenue, totalQuantity, avgRevenue } = summary;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-400 py-3">
        Báo cáo doanh số theo khu vực / đại lý (EVM Staff)
      </h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="2025-Q3">2025-Q3</option>
          <option value="2025-Q2">2025-Q2</option>
          <option value="2025-Q1">2025-Q1</option>
        </select>

        <select
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="ALL">Tất cả khu vực</option>
          <option value="Miền Bắc">Miền Bắc</option>
          <option value="Miền Trung">Miền Trung</option>
          <option value="Miền Nam">Miền Nam</option>
        </select>

        <input
          className="min-w-[220px] rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          placeholder="Tìm theo tên đại lý hoặc ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng doanh thu</div>
          <div className="text-2xl font-bold text-emerald-300">
            {formatMoney(totalRevenue)} VNĐ
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng số lượng</div>
          <div className="text-2xl font-bold text-emerald-300">{totalQuantity} xe</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Doanh thu TB / đại lý</div>
          <div className="text-2xl font-bold text-emerald-300">{formatMoney(avgRevenue)} VNĐ</div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <h3 className="text-lg font-semibold text-emerald-300 mb-3">
            Biểu đồ doanh thu theo đại lý
          </h3>
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                barGap={6}
              >
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(v) => v.toLocaleString("vi-VN")}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value, name) =>
                    name === "Doanh thu (VNĐ)"
                      ? [`${value.toLocaleString("vi-VN")} VNĐ`, name]
                      : [value, name]
                  }
                />
                <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 13 }} />

                {/* Doanh thu */}
                <Bar
                  dataKey="revenue"
                  name="Doanh thu (VNĐ)"
                  fill="#10b981"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#f1f5f9",
                    fontSize: 12,
                    formatter: (v) => v.toLocaleString("vi-VN"),
                  }}
                />

                {/* Số lượng */}
                <Bar
                  dataKey="quantity"
                  name="Số lượng"
                  fill="#34d399"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "insideTop",
                    dy: 18,
                    fill: "#f1f5f9",
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <h3 className="text-lg font-semibold text-emerald-300 mb-3">
            Top 5 đại lý theo doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="revenue"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {pieChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <table className="min-w-full border-collapse text-base">
          <thead className="bg-slate-800/60 text-emerald-300">
            <tr>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Khu vực</th>
              <th className="p-3 text-left">Số lượng</th>
              <th className="p-3 text-left">Doanh thu (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {aggregated.map((r) => (
              <tr
                key={r.dealer_id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3 font-medium">{r.dealerName}</td>
                <td className="p-3">{r.region}</td>
                <td className="p-3">{r.quantity}</td>
                <td className="p-3">{formatMoney(r.revenue)}</td>
              </tr>
            ))}
            {aggregated.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400">
                  Không có dữ liệu cho bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
