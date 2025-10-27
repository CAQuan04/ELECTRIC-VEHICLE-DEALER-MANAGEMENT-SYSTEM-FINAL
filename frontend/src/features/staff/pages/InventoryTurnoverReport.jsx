// InventoryTurnoverReport.jsx
import React, { useState } from "react";

const MOCK_REPORT = [
  {
    model: "Model 3",
    beginStock: 15,
    imported: 10,
    sold: 22,
    endStock: 8,
  },
  {
    model: "Model Y",
    beginStock: 15,
    imported: 5,
    sold: 10,
    endStock: 10,
  },
  {
    model: "Model S",
    beginStock: 12,
    imported: 3,
    sold: 5,
    endStock: 10,
  },
  {
    model: "Model X",
    beginStock: 10,
    imported: 2,
    sold: 4,
    endStock: 8,
  },
];

// Hàm tính turnover rate (%)
const calcTurnover = (sold, begin, end) => {
  const avgInventory = (begin + end) / 2;
  return avgInventory > 0 ? ((sold / avgInventory) * 100).toFixed(1) : 0;
};

// Màu theo hiệu suất
const turnoverColor = (rate) => {
  if (rate >= 80) return "text-emerald-400";
  if (rate >= 50) return "text-yellow-400";
  return "text-rose-400";
};

const InventoryTurnoverReport = () => {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            📊 Báo cáo tồn kho & Tốc độ tiêu thụ
          </h2>
          <p className="text-slate-400 mt-1">
            Thống kê hiệu suất tồn kho theo kỳ và sản phẩm
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2 shadow-sm focus:border-sky-500 focus:ring-0"
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {MOCK_REPORT.map((item) => {
          const rate = calcTurnover(item.sold, item.beginStock, item.endStock);
          return (
            <div
              key={item.model}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl hover:bg-slate-900/60 transition-all duration-300"
            >
              <h3 className="text-2xl font-extrabold mb-4 text-slate-100">
                {item.model}
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Tồn đầu kỳ</span>
                  <span className="font-semibold">{item.beginStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nhập thêm</span>
                  <span className="font-semibold">{item.imported}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bán ra</span>
                  <span className="font-semibold text-sky-400">
                    {item.sold}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tồn cuối kỳ</span>
                  <span className="font-semibold">{item.endStock}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3 mt-2">
                  <span className="font-bold text-slate-200">
                    Tốc độ tiêu thụ
                  </span>
                  <span
                    className={`font-extrabold text-lg ${turnoverColor(rate)}`}
                  >
                    {rate}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryTurnoverReport;
