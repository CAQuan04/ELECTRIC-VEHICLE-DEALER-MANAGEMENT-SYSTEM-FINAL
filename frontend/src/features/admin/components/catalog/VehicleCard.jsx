import React from "react";
// Đảm bảo đã import 'Plus' để không bị lỗi ReferenceError
import { Edit, Trash2, Wrench, Power, Battery, Gauge, Zap, Plus } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

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
    <Card className="flex flex-col h-full p-6 hover:shadow-cyan-900/20 transition-all duration-300 border border-gray-700/50">
      
      {/* --- 1. ẢNH XE --- */}
      <div className="relative overflow-hidden rounded-2xl mb-6 bg-[#0b1622] border border-gray-800 aspect-[4/3] flex items-center justify-center group">
        <img
          src={vehicle.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
          alt={vehicle.model}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
           <Badge variant={vehicle.status === "Active" ? "success" : "danger"} className="text-sm px-3 py-1">
             {vehicle.status}
           </Badge>
        </div>
      </div>

      {/* --- 2. TÊN & HÃNG (Cỡ chữ to hơn) --- */}
      <div className="mb-5">
          <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
            {vehicle.model}
          </h3>
          <div className="flex items-center gap-3 text-gray-300 text-base"> {/* Tăng lên text-base */}
            <span className="px-3 py-1 rounded bg-gray-800 border border-gray-700 font-medium">
              {vehicle.brand}
            </span>
            <span className="opacity-50">•</span>
            <span>{vehicle.year}</span>
          </div>
      </div>
      
      {/* --- 3. GIÁ TIỀN (Rất to và rõ) --- */}
      <div className="mb-6 pb-6 border-b border-gray-700">
          <p className="text-3xl text-cyan-400 font-bold flex items-baseline gap-2"> {/* Tăng lên text-3xl */}
            {vehicle.basePrice?.toLocaleString('vi-VN')} 
            <span className="text-lg font-normal text-gray-400">VNĐ</span>
          </p>
      </div>

      {/* --- 4. DANH SÁCH CẤU HÌNH --- */}
      <div className="flex-grow space-y-4">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-200 mb-3">
           <Wrench className="w-5 h-5 text-gray-400" /> Phiên bản & Cấu hình
        </div>
        
        {vehicle.configs && vehicle.configs.length > 0 ? (
          <div className="space-y-3">
            {vehicle.configs.map((cfg) => (
              <div key={cfg.configId} className={`rounded-xl p-4 border ${cfg.status === "Active" ? "bg-[#1a2b44]/40 border-gray-700 hover:border-cyan-500/30" : "bg-gray-900/50 border-gray-800 opacity-60"} transition group/config relative`}>
                <div className="flex justify-between items-start">
                  <div>
                    {/* Tên màu to hơn */}
                    <div className="text-gray-100 font-bold text-base flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-500/50"></span>
                        {cfg.color}
                    </div>
                    {/* Thông số to hơn (text-sm thay vì text-xs) */}
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-emerald-500" /> {cfg.batteryKwh} kWh</span>
                        <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-amber-500" /> {cfg.rangeKm} km</span>
                    </div>
                  </div>
                  
                  {/* Nút sửa/xóa cấu hình */}
                  {canManage && (
                    <div className="flex gap-2 opacity-0 group-hover/config:opacity-100 transition-opacity absolute right-3 top-3 bg-gray-900 p-1.5 rounded-lg border border-gray-700 shadow-lg">
                      <button onClick={() => onEditConfig(cfg)} className="text-blue-400 p-1.5 hover:bg-blue-900/30 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteConfig(cfg.configId)} className="text-red-400 p-1.5 hover:bg-red-900/30 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-base italic flex items-center justify-center py-6 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
            <Zap className="w-5 h-5 mr-2 opacity-50" /> Chưa có cấu hình
          </div>
        )}
      </div>

      {/* --- 5. NÚT HÀNH ĐỘNG (Chữ to hơn, bỏ size="sm") --- */}
      {canManage && (
        <div className="flex items-center gap-3 mt-8 pt-5 border-t border-gray-800">
          {vehicle.status === "Active" ? (
            <>
              <Button variant="ghost" onClick={onEdit} className="flex-1 text-blue-400 hover:bg-blue-500/10 text-base font-medium">
                <Edit className="w-5 h-5 mr-2" /> Sửa
              </Button>
              <Button variant="ghost" onClick={onAddConfig} className="flex-1 text-cyan-400 hover:bg-cyan-500/10 text-base font-medium">
                <Plus className="w-5 h-5 mr-2" /> Cấu hình
              </Button>
              <Button variant="ghost" onClick={onDelete} className="text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => onReactivate(vehicle)} className="w-full text-emerald-400 hover:bg-emerald-500/10 text-base font-medium">
              <Power className="w-5 h-5 mr-2" /> Kích hoạt lại
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default VehicleCard;