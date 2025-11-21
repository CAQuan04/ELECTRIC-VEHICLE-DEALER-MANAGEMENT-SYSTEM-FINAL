// File: src/features/admin/pages/EvmDashboard.jsx
import React, { useEffect } from "react";
import { AuthService } from "@utils";
import { usePageLoading } from "@modules/loading";
import "@modules/loading/GlobalLoading.css";

// Import icon từ lucide-react
import { 
  Users, 
  Building2, 
  Car, 
  Banknote, 
  TrendingUp, 
  Activity, 
  CarFront,
  LayoutDashboard
} from "lucide-react";

const EvmDashboard = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    startLoading("Đang tải dữ liệu hệ thống…");
    setTimeout(() => stopLoading(), 500);
  }, [startLoading, stopLoading]);

  console.log("🎨 EvmDashboard render - activeSection: overview (fixed)");

  // Dữ liệu thống kê kèm theo cấu hình Icon
  const statsData = [
    {
      label: "Người dùng hệ thống",
      value: 4,
      Icon: Users,
      color: "from-sky-500 to-cyan-400",
      iconColor: "text-sky-400",
    },
    {
      label: "Đại lý hoạt động",
      value: 8,
      Icon: Building2,
      color: "from-emerald-500 to-green-400",
      iconColor: "text-emerald-400",
    },
    {
      label: "Xe đang kinh doanh",
      value: 24,
      Icon: Car,
      color: "from-indigo-500 to-purple-400",
      iconColor: "text-purple-400",
    },
    {
      label: "Doanh số tháng này",
      value: "₫18.2 tỷ",
      Icon: Banknote,
      color: "from-orange-500 to-amber-400",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
             <LayoutDashboard className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
            Tổng quan hệ thống EVM
          </h2>
        </div>

        {/* THỐNG KÊ CHÍNH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${item.color}/10 hover:bg-slate-800/50 hover:border-slate-700 transition shadow-lg p-5 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300`}>
                   <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </h3>

              <p className="text-3xl font-extrabold text-slate-100 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* BIỂU ĐỒ GIẢ LẬP & HOẠT ĐỘNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doanh số */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-slate-100">
                 Doanh số 6 tháng gần nhất
              </h3>
            </div>

            <div className="w-full h-48 bg-gradient-to-t from-sky-900/20 to-transparent rounded-xl relative overflow-hidden border-b border-slate-800">
              {/* Fake Bars using CSS */}
              <div className="absolute bottom-0 left-[5%] w-[12%] h-[30%] bg-sky-600/40 rounded-t-md hover:bg-sky-500/60 transition"></div>
              <div className="absolute bottom-0 left-[20%] w-[12%] h-[50%] bg-sky-600/50 rounded-t-md hover:bg-sky-500/70 transition"></div>
              <div className="absolute bottom-0 left-[35%] w-[12%] h-[40%] bg-sky-600/40 rounded-t-md hover:bg-sky-500/60 transition"></div>
              <div className="absolute bottom-0 left-[50%] w-[12%] h-[70%] bg-sky-600/60 rounded-t-md hover:bg-sky-500/80 transition"></div>
              <div className="absolute bottom-0 left-[65%] w-[12%] h-[55%] bg-sky-600/50 rounded-t-md hover:bg-sky-500/70 transition"></div>
              <div className="absolute bottom-0 left-[80%] w-[12%] h-[85%] bg-sky-500/80 rounded-t-md shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:bg-sky-400/90 transition"></div>
            </div>
          </div>

          {/* Hoạt động người dùng */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Hoạt động người dùng
              </h3>
            </div>

            <div className="space-y-3">
                {[
                    { label: "Admin đang hoạt động", count: 3, color: "text-sky-400" },
                    { label: "EVM Staff", count: 5, color: "text-purple-400" },
                    { label: "Dealer Manager", count: 12, color: "text-amber-400" },
                    { label: "Dealer Staff", count: 35, color: "text-emerald-400" }
                ].map((role, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:bg-slate-900 transition">
                        <span className="text-slate-300 text-sm font-medium flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${role.color.replace('text', 'bg')}`}></span>
                            {role.label}
                        </span>
                        <span className={`font-bold ${role.color}`}>{role.count}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* DANH SÁCH XE NỔI BẬT */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <CarFront className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Dòng xe nổi bật trong hệ thống
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { model: "VF 3 Plus", price: "5.1 tỷ" },
              { model: "VF 7 Eco", price: "9 tỷ" },
              { model: "VF 8 Plus", price: "15 tỷ" },
              { model: "VF 9 Plus", price: "21 tỷ" },
            ].map((car, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-slate-950/50 border border-slate-800 p-5 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(8,145,178,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-center h-32 mb-4 bg-slate-900/50 rounded-xl border border-slate-800/50 group-hover:bg-slate-900 transition">
                    {/* Placeholder icon for Car Image since no img src provided */}
                    <Car className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors duration-300" />
                </div>
                <h4 className="text-slate-200 font-bold text-lg group-hover:text-cyan-400 transition-colors">
                    {car.model}
                </h4>
                <p className="text-slate-400 font-medium mt-1">
                    Giá niêm yết: <span className="text-cyan-400">{car.price} VNĐ</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvmDashboard;