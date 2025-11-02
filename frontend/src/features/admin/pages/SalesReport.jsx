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
import { aggregateByDealer, generateChart } from "../service/analyticsService";

const COLORS = [
  "#06b6d4",
  "#0ea5e9",
  "#38bdf8",
  "#60a5fa",
  "#7c3aed",
  "#f97316",
];
const formatMoney = (n) =>
  typeof n === "number" ? n.toLocaleString("vi-VN") : n;

const SalesReport = () => {
  const [period, setPeriod] = useState("2025-Q3");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // ========== Gọi service xử lý dữ liệu ==========
  const aggregated = useMemo(
    () => aggregateByDealer(period, { region: regionFilter, search }),
    [period, regionFilter, search]
  );

  const { barChartData, pieChartData, summary } = useMemo(
    () => generateChart(aggregated),
    [aggregated]
  );

  const { totalRevenue, totalQuantity, avgRevenue } = summary;

  // ========== Export XLSX / PDF / CSV ==========
  const exportXLSX = async () => {
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(aggregated);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
      XLSX.writeFile(wb, `sales-report-${period}.xlsx`);
    } catch {
      alert("Chưa cài thư viện xlsx, dùng CSV thay thế.");
      exportCSV();
    }
  };

  const exportCSV = () => {
    const header = Object.keys(aggregated[0] || {});
    const csv = [
      header.join(","),
      ...aggregated.map((r) => header.map((h) => `"${r[h] ?? ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sales-report-${period}.csv`;
    a.click();
  };

  const exportPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text(`Báo cáo doanh số - ${period}`, 14, 16);
      doc.text(`Tổng doanh thu: ${formatMoney(totalRevenue)} VNĐ`, 14, 24);
      aggregated.forEach((r, i) => {
        doc.text(
          `${r.dealerName} (${r.region}) - ${r.quantity} xe - ${formatMoney(
            r.revenue
          )} VNĐ`,
          14,
          36 + i * 6
        );
      });
      doc.save(`sales-report-${period}.pdf`);
    } catch {
      alert("Chưa cài jsPDF, dùng CSV thay thế.");
      exportCSV();
    }
  };

  // ========== UI ==========
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sky-400">
        Báo cáo doanh số theo khu vực / đại lý
      </h2>

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

        <div className="ml-auto flex gap-2">
          <button
            onClick={exportXLSX}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow"
          >
            Xuất Excel
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-900/50 text-white"
          >
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng doanh thu</div>
          <div className="text-2xl font-bold text-sky-300">
            {formatMoney(totalRevenue)} VNĐ
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Tổng số lượng</div>
          <div className="text-2xl font-bold text-sky-300">
            {totalQuantity} xe
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <div className="text-slate-300 text-sm">Doanh thu TB / đại lý</div>
          <div className="text-2xl font-bold text-sky-300">
            {formatMoney(avgRevenue)} VNĐ
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <h3 className="text-lg font-semibold text-sky-300 mb-3">
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
    <XAxis
      dataKey="name"
      stroke="#94a3b8"
      tick={{ fontSize: 12 }}
      interval={0}
      angle={0}
    />
    <YAxis
      stroke="#94a3b8"
      tickFormatter={(v) => v.toLocaleString("vi-VN")}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "6px",
        color: "#e2e8f0",
      }}
      formatter={(value, name) =>
        name === "Doanh thu (VNĐ)"
          ? [`${value.toLocaleString("vi-VN")} VNĐ`, name]
          : [value, name]
      }
    />
    <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 13 }} />

    {/* Cột doanh thu */}
    <Bar
      dataKey="revenue"
      name="Doanh thu (VNĐ)"
      fill="#06b6d4"
      barSize={40}
      radius={[4, 4, 0, 0]}
      label={{
        position: "top",
        fill: "#f1f5f9",
        fontSize: 12,
        formatter: (v) => v.toLocaleString("vi-VN"),
      }}
    />

    {/* Cột số lượng */}
    <Bar
      dataKey="quantity"
      name="Số lượng"
      fill="#0ea5e9"
      barSize={40}
      radius={[4, 4, 0, 0]}
      label={{
        position: "insideTop",
        dy: 18, // đẩy số lượng xuống một chút để không chồng
        fill: "#f1f5f9",
        fontSize: 12,
      }}
    />
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
          <h3 className="text-lg font-semibold text-sky-300 mb-3">
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
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-800/60 text-sky-300">
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
