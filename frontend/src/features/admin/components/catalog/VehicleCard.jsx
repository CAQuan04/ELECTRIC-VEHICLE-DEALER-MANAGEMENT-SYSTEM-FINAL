// File: src/components/catalog/VehicleCard.jsx
import React from "react";
import { Edit, Trash2, Wrench, Power } from "lucide-react";

const VehicleCard = ({
  vehicle,
  canManage, // Nhận quyền quản lý từ component cha
  onEdit,
  onDelete,
  onAddConfig,
  onEditConfig,
  onToggleConfigStatus,
  onDeleteConfig,
  onReactivate,
}) => {
  return (
    <div className="bg-[#13233a] rounded-2xl border border-slate-700 shadow-lg hover:shadow-cyan-900/40 transition p-5 flex flex-col">
      {/* Ảnh xe */}
      <div className="relative overflow-hidden rounded-2xl mb-4">
        {/* Ghi chú: Sử dụng ImageUrl từ API, có ảnh dự phòng nếu null */}
        <img
          src={vehicle.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'}
          alt={vehicle.model}
          className="w-full h-64 object-contain bg-[#0d1b2a] p-3 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thông tin xe */}
      <h3 className="text-xl font-semibold text-cyan-400">{vehicle.model}</h3>
      <p className="text-slate-400 text-sm">{vehicle.brand} • {vehicle.year}</p>
      {/* Ghi chú: Định dạng lại giá tiền cho dễ đọc */}
      <p className="text-slate-300 font-medium mt-1">{vehicle.basePrice?.toLocaleString('vi-VN')} VNĐ</p>
      <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${vehicle.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
        {vehicle.status}
      </span>

      {/* Danh sách cấu hình */}
      <div className="mt-4 border-t border-slate-700 pt-3 space-y-2 flex-grow">
        <p className="text-sm font-semibold text-slate-300 mb-1">Cấu hình:</p>
        {vehicle.configs && vehicle.configs.length > 0 ? (
          <div className="space-y-2">
            {vehicle.configs.map((cfg) => (
              <div key={cfg.configId} className={`rounded-xl p-2 border ${cfg.status === "Active" ? "bg-[#1a2b44] border-slate-700" : "bg-[#1a1f2e] border-slate-800 opacity-75"} transition`}>
                <div className="flex justify-between items-center">
                  {/* Ghi chú: Hiển thị tên cấu hình dựa trên màu sắc */}
                  <div className="text-slate-200 text-sm font-semibold">{`${vehicle.model} - ${cfg.color}`}</div>
                  
                  {/* Ghi chú: Chỉ hiển thị các nút thao tác cấu hình nếu có quyền */}
                  {canManage && (
                    <div className="flex gap-2">
                      <button onClick={() => onToggleConfigStatus(cfg)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition ${cfg.status === 'Active' ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        <Power className="w-3 h-3" />
                        {cfg.status}
                      </button>
                      <button onClick={() => onEditConfig(cfg)} className="text-blue-400 hover:text-blue-300 text-xs">
                        <Edit className="w-3 h-3 inline" />
                      </button>
                      <button onClick={() => onDeleteConfig(cfg.configId)} className="text-red-400 hover:text-red-300 text-xs">
                        <Trash2 className="w-3 h-3 inline" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ghi chú: Hiển thị thông tin chi tiết từ API */}
                <div className="text-slate-400 text-xs mt-1">
                  🔋 {cfg.batteryKwh} kWh • 🚗 {cfg.rangeKm} km
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">Chưa có cấu hình</p>
        )}
      </div>

      {/* Nút thao tác xe */}
      {/* Ghi chú: Toàn bộ khối nút này chỉ hiển thị nếu có quyền quản lý */}
      {canManage && (
        <div className="flex justify-between mt-4 border-t border-slate-700 pt-4">
          {vehicle.status === "Active" ? (
            <>
              <button onClick={onEdit} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                <Edit className="w-4 h-4" /> Sửa
              </button>
              <button onClick={onDelete} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm">
                <Trash2 className="w-4 h-4" /> Xóa
              </button>
              <button onClick={onAddConfig} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm">
                <Wrench className="w-4 h-4" /> Cấu hình
              </button>
            </>
          ) : (
            <button onClick={() => onReactivate(vehicle)} className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm mx-auto">
              <Power className="w-4 h-4" /> Kích hoạt lại xe
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCard;