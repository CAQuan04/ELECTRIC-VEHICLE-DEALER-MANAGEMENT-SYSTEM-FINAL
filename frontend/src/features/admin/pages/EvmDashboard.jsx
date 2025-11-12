// File: src/features/admin/pages/EvmDashboard.jsx
import React, { useEffect, useState } from "react";
import { AuthService } from "@utils";
import { usePageLoading } from "@modules/loading";
import "@modules/loading/GlobalLoading.css";
import DealerManagement from "./DealerManagement";
import DealerContractManagement from "./DealerContractManagement";
import SalesReport from "./SalesReport";
import ForecastReport from "../../shared/pages/ForecastReport";
// IMPORT COMPONENT MỚI
import UserManagement from "./UserManagement";

const EvmDashboard = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [activeSection, setActiveSection] = useState("overview");

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    startLoading("Đang tải dữ liệu hệ thống…");
    setTimeout(() => stopLoading(), 500);
  }, [startLoading, stopLoading]);

  /* ========== Giao diện dashboard ========== */
  console.log('🎨 EvmDashboard render - activeSection:', activeSection);
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      {/* NAV PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "overview", label: "Tổng quan" },
          { key: "dealers", label: "Quản lý đại lý" },
          { key: "users", label: "Quản lý người dùng" },
          { key: "contracts", label: "Hợp đồng & KPI đại lý" },
          { key: "sales", label: "Báo cáo doanh số" },
          { key: "forecast", label: "Dự báo nhu cầu (AI)" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`rounded-full border px-5 py-2.5 font-semibold ${
              activeSection === tab.key
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-slate-900/40 border-slate-800 hover:bg-sky-500/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === "contracts" && <DealerContractManagement />}

      {activeSection === "sales" && <SalesReport />}

      {activeSection === "forecast" && <ForecastReport />}

      {/* DEALER */}
      {activeSection === "dealers" && <DealerManagement />}

      {/* USERS - THAY THẾ BẰNG COMPONENT MỚI */}
      {activeSection === "users" && <UserManagement />}

      {/* Other sections */}
      {activeSection === "overview" && (
        <div className="space-y-8">
          {/* HEADER */}
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
            📊 Tổng quan hệ thống EVM
          </h2>

          {/* THỐNG KÊ CHÍNH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Người dùng hệ thống",
                value: 4, // Giá trị tạm thời sau khi tách state
                icon: "👥",
                color: "from-sky-500 to-cyan-400",
              },
              {
                label: "Đại lý hoạt động",
                value: 8,
                icon: "🏢",
                color: "from-emerald-500 to-green-400",
              },
              {
                label: "Xe đang kinh doanh",
                value: 24,
                icon: "🚗",
                color: "from-indigo-500 to-purple-400",
              },
              {
                label: "Doanh số tháng này",
                value: "₫18.2 tỷ",
                icon: "💰",
                color: "from-orange-500 to-amber-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${item.color}/10 hover:${item.color}/20 transition shadow-lg p-5`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-300">
                  {item.label}
                </h3>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* BIỂU ĐỒ GIẢ LẬP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doanh số */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-sky-300">
                📈 Doanh số 6 tháng gần nhất
              </h3>
              <div className="w-full h-40 bg-gradient-to-t from-sky-900/30 to-transparent rounded-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[16%] h-[30%] bg-sky-500/50"></div>
                <div className="absolute bottom-0 left-[20%] w-[16%] h-[60%] bg-sky-500/60"></div>
                <div className="absolute bottom-0 left-[40%] w-[16%] h-[80%] bg-sky-500/70"></div>
                <div className="absolute bottom-0 left-[60%] w-[16%] h-[50%] bg-sky-500/60"></div>
                <div className="absolute bottom-0 left-[80%] w-[16%] h-[75%] bg-sky-500/70"></div>
              </div>
            </div>

            {/* Hoạt động người dùng */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-emerald-300">
                👤 Hoạt động người dùng
              </h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>• 3 Admin đang hoạt động</li>
                <li>• 5 EVM Staff</li>
                <li>• 12 Dealer Manager</li>
                <li>• 35 Dealer Staff</li>
              </ul>
            </div>
          </div>

          {/* DANH SÁCH XE NỔI BẬT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">
              🚙 Dòng xe nổi bật trong hệ thống
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { model: "VF 3 Plus", img: "/vf3.png", price: "5.1 tỷ" },
                { model: "VF 7 Eco", img: "/vf7.png", price: "9 tỷ" },
                { model: "VF 8 Plus", img: "/vf8.png", price: "15 tỷ" },
                { model: "VF 9 Plus", img: "/vf9.png", price: "21 tỷ" },
              ].map((car, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#13233a] border border-slate-800 p-4 hover:shadow-cyan-900/30 transition"
                >
                  <img
                    src={car.img}
                    alt={car.model}
                    className="w-full h-40 object-contain mb-2"
                  />
                  <h4 className="text-slate-200 font-semibold">{car.model}</h4>
                  <p className="text-cyan-400 font-medium">{car.price} VNĐ</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === "system" && (
        <div className="text-slate-400">Cấu hình hệ thống...</div>
      )}
      {activeSection === "reports" && (
        <div className="text-slate-400">Các báo cáo và thống kê...</div>
      )}
    </div>
  );
};

export default EvmDashboard;