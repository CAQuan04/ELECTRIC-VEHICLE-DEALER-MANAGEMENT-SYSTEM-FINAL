import React, { useState, useMemo } from "react";
import { getInventoryTurnoverReport } from "./service/reportingService";

const turnoverColor = (rate) => {
  if (rate >= 80) return "text-emerald-400";
  if (rate >= 50) return "text-yellow-400";
  return "text-rose-400";
};

const InventoryTurnoverReport = () => {
  const [dealer, setDealer] = useState("ALL");
  const [period, setPeriod] = useState("month");

  // Gọi service tổng hợp dữ liệu
  const report = useMemo(
    () => getInventoryTurnoverReport({ dealerId: dealer, period }),
    [dealer, period]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2 py-2">
            Báo cáo tồn kho & tốc độ tiêu thụ
          </h1>
          <p className="text-slate-400 mt-1">
            Theo dõi hiệu suất tồn kho và tốc độ tiêu thụ của từng sản phẩm
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2"
          >
            <option value="ALL">Tất cả đại lý</option>
            <option value="DL001">Đại lý Hà Nội</option>
            <option value="DL002">Đại lý TP.HCM</option>
            <option value="DL003">Đại lý Đà Nẵng</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 px-4 py-2"
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
          </select>
        </div>
      </div>

      {/* Cards hiển thị báo cáo */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {report.map((item) => (
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
                  className={`font-extrabold text-lg ${turnoverColor(item.turnoverRate)}`}
                >
                  {item.turnoverRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTurnoverReport;
