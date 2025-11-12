// File: src/features/admin/components/catalog/VehicleCard.jsx
import React from "react";
import { Edit, Trash2, Wrench, Power } from "lucide-react";

const VehicleCard = ({
  vehicle,
  canManage,
  onEdit,
  onDelete,
  onAddConfig,
  onEditConfig,
  onToggleConfigStatus,
  onDeleteConfig,
  onReactivate,
}) => {
  return (
    // THAY ĐỔI 1: Tăng padding tổng thể lên p-8
    <div className="bg-[#13233a] rounded-2xl border border-slate-700 shadow-lg hover:shadow-cyan-900/40 transition p-8 flex flex-col">
      <div className="relative overflow-hidden rounded-2xl mb-4">
        {/* THAY ĐỔI 2: Tăng chiều cao ảnh lên h-80 */}
        <img
          src={vehicle.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={vehicle.model}
          className="w-full h-80 object-contain bg-[#0d1b2a] p-3 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* THAY ĐỔI 3: Tăng cỡ chữ thông tin cơ bản */}
      <h3 className="text-3xl font-semibold text-cyan-400">{vehicle.model}</h3>
      <p className="text-slate-400 text-lg">{vehicle.brand} • {vehicle.year}</p>
      <p className="text-2xl text-slate-200 font-semibold mt-2">{vehicle.basePrice?.toLocaleString('vi-VN')} VNĐ</p>
      <span className={`inline-block mt-3 px-4 py-1.5 text-base rounded-full ${vehicle.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
        {vehicle.status}
      </span>

      {/* THAY ĐỔI 4: Tăng khoảng cách (mt-6, pt-5) và cỡ chữ title "Cấu hình" */}
      <div className="mt-6 border-t border-slate-700 pt-5 space-y-3 flex-grow">
        <p className="text-lg font-semibold text-slate-300 mb-3">Cấu hình:</p>
        {vehicle.configs && vehicle.configs.length > 0 ? (
          <div className="space-y-3">
            {vehicle.configs.map((cfg) => (
              // THAY ĐỔI 5: Tăng padding (p-4) và cỡ chữ bên trong card cấu hình
              <div key={cfg.configId} className={`rounded-xl p-4 border ${cfg.status === "Active" ? "bg-[#1a2b44] border-slate-700" : "bg-[#1a1f2e] border-slate-800 opacity-75"} transition`}>
                <div className="flex justify-between items-center">
                  <div className="text-slate-200 text-lg font-semibold">{`${vehicle.model} - ${cfg.color}`}</div>
                  
                  {canManage && (
                    <div className="flex gap-2">
                      <button onClick={() => onToggleConfigStatus(cfg)} className={`flex items-center gap-1.5 text-base px-3 py-1 rounded-lg transition ${cfg.status === 'Active' ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        <Power className="w-4 h-4" />
                        {cfg.status}
                      </button>
                      <button onClick={() => onEditConfig(cfg)} className="text-blue-400 hover:text-blue-300 text-sm p-1.5 rounded hover:bg-blue-900/50">
                        <Edit className="w-5 h-5 inline" />
                      </button>
                      <button onClick={() => onDeleteConfig(cfg.configId)} className="text-red-400 hover:text-red-300 text-sm p-1.5 rounded hover:bg-red-900/50">
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-slate-400 text-base mt-2">
                  🔋 {cfg.batteryKwh} kWh • 🚗 {cfg.rangeKm} km
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-lg italic">Chưa có cấu hình</p>
        )}
      </div>

      {canManage && (
        // THAY ĐỔI 6: Tăng cỡ chữ nút (text-lg) và icon (w-6 h-6)
        <div className="flex justify-between mt-6 border-t border-slate-700 pt-6">
          {vehicle.status === "Active" ? (
            <>
              <button onClick={onEdit} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-lg font-medium">
                <Edit className="w-6 h-6" /> Sửa
              </button>
              <button onClick={onDelete} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-lg font-medium">
                <Trash2 className="w-6 h-6" /> Xóa
              </button>
              <button onClick={onAddConfig} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-lg font-medium">
                <Wrench className="w-6 h-6" /> Thêm cấu hình
              </button>
            </>
          ) : (
            <button onClick={() => onReactivate(vehicle)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-lg font-medium mx-auto">
              <Power className="w-6 h-6" /> Kích hoạt lại xe
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCard;