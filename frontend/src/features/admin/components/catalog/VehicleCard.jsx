// File: src/features/admin/components/catalog/VehicleCard.jsx
import React from "react";
import { Edit, Trash2, Wrench, Power, Battery, Gauge, Zap } from "lucide-react";

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
    // Tăng padding tổng thể lên p-8
    <div className="bg-[#13233a] rounded-3xl border border-slate-700 shadow-lg hover:shadow-cyan-900/40 transition p-8 flex flex-col group h-full">
      <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#0d1b2a] border border-slate-800">
        {/* Tăng chiều cao ảnh lên h-80 (khoảng 320px) */}
        <img
          src={vehicle.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={vehicle.model}
          className="w-full h-80 object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge trạng thái to hơn */}
        <div className="absolute top-4 right-4">
           <span className={`px-4 py-1.5 text-sm font-bold rounded-full border backdrop-blur-md ${
             vehicle.status === "Active" 
             ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
             : "bg-red-500/10 border-red-500/30 text-red-400"
           }`}>
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Tăng cỡ chữ tiêu đề lên 3xl */}
      <h3 className="text-3xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">{vehicle.model}</h3>
      
      <div className="flex items-center gap-3 text-slate-400 text-base mb-4">
        <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-medium">{vehicle.brand}</span>
        <span>•</span>
        <span className="font-medium">{vehicle.year}</span>
      </div>
      
      {/* Giá tiền to hơn (2xl) */}
      <p className="text-2xl text-cyan-400 font-bold mb-6 flex items-baseline gap-1">
        {vehicle.basePrice?.toLocaleString('vi-VN')} <span className="text-base font-normal text-slate-400">VNĐ</span>
      </p>

      <div className="border-t border-slate-800 pt-6 flex-grow space-y-4">
        <div className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-2">
           <Wrench className="w-5 h-5 text-slate-500" /> Cấu hình phiên bản
        </div>
        
        {vehicle.configs && vehicle.configs.length > 0 ? (
          <div className="space-y-3">
            {vehicle.configs.map((cfg) => (
              // Card con cấu hình cũng tăng padding lên p-4
              <div key={cfg.configId} className={`rounded-xl p-4 border ${cfg.status === "Active" ? "bg-[#1a2b44]/60 border-slate-700/60 hover:border-cyan-500/40" : "bg-[#1a1f2e] border-slate-800 opacity-60"} transition relative group/config`}>
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="text-slate-200 font-bold text-base flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                        {cfg.color}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700/50">
                            <Battery className="w-4 h-4 text-emerald-400" /> {cfg.batteryKwh} kWh
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700/50">
                            <Gauge className="w-4 h-4 text-amber-400" /> {cfg.rangeKm} km
                        </div>
                    </div>
                  </div>
                  
                  {canManage && (
                    <div className="flex gap-1 opacity-0 group-hover/config:opacity-100 transition-opacity bg-slate-950/90 rounded-lg p-1 backdrop-blur-md absolute right-3 top-3 border border-slate-700 shadow-lg">
                      <button onClick={() => onToggleConfigStatus(cfg)} title="Bật/Tắt" className={`p-2 rounded-md hover:bg-slate-800 transition ${cfg.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <Power className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditConfig(cfg)} title="Sửa" className="text-blue-400 p-2 rounded-md hover:bg-blue-900/30 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDeleteConfig(cfg.configId)} title="Xóa" className="text-red-400 p-2 rounded-md hover:bg-red-900/30 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-base italic flex items-center gap-2 py-4 justify-center bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <Zap className="w-5 h-5 opacity-50" /> Chưa có cấu hình
          </div>
        )}
      </div>

      {canManage && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800 gap-3">
          {vehicle.status === "Active" ? (
            <>
              {/* Nút bấm to hơn (py-2.5, text-base) */}
              <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-800 text-blue-400 text-base font-semibold transition border border-transparent hover:border-slate-700">
                <Edit className="w-5 h-5" /> Sửa
              </button>
              <button onClick={onAddConfig} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-base font-semibold transition border border-cyan-500/20">
                <Wrench className="w-5 h-5" /> Cấu hình
              </button>
              <button onClick={onDelete} className="flex items-center justify-center p-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition border border-transparent hover:border-red-500/20" title="Xóa xe">
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button onClick={() => onReactivate(vehicle)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-base font-bold transition border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Power className="w-5 h-5" /> Kích hoạt lại xe
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCard;