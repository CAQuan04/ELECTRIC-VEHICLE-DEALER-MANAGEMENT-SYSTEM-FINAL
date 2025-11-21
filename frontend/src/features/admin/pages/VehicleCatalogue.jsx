// File: src/features/admin/pages/VehicleCatalogue.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, Filter, CarFront, Search } from "lucide-react"; // Thêm CarFront, Search
import VehicleCard from "../components/catalog/VehicleCard";
import ConfigModal from "../components/modals/ConfigModal";
import VehicleModal from "../components/modals/VehicleModal";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../utils/api/client";

const VehicleCatalogue = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [filter, setFilter] = useState({ brand: "", status: "", color: "" });
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeConfig, setActiveConfig] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/vehicles"); 
      setVehicles(response);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);
  
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color)))), [vehicles]);
  const filteredVehicles = useMemo(() => vehicles.filter((v) => 
    (!filter.brand || v.brand === filter.brand) &&
    (!filter.status || v.status === filter.status) &&
    (!filter.color || v.configs.some(c => c.color === filter.color) || v.color === filter.color)
  ), [vehicles, filter]);

  // ... (Giữ nguyên các hàm handle CRUD như cũ) ...
  const handleAddVehicle = () => { setActiveVehicle(null); setOpenVehicleModal(true); };
  const handleEditVehicle = (vehicle) => { setActiveVehicle(vehicle); setOpenVehicleModal(true); };
  const handleSaveVehicle = async (formData) => {
    try {
      if (formData.vehicleId) await apiClient.put(`/admin/vehicles/${formData.vehicleId}`, formData);
      else await apiClient.post("/admin/vehicles", formData);
      setOpenVehicleModal(false); await fetchVehicles();
    } catch (error) { console.error(error); }
  };
  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Bạn có chắc muốn xóa mềm xe này?")) {
      try { await apiClient.delete(`/admin/vehicles/${vehicleId}`); await fetchVehicles(); } catch (error) { console.error(error); }
    }
  };
  const handleReactivateVehicle = async (vehicle) => {
    if (window.confirm("Bạn có chắc muốn kích hoạt lại?")) {
      try { await apiClient.put(`/admin/vehicles/${vehicle.vehicleId}/status`); await fetchVehicles(); } catch (error) { console.error(error); }
    }
  };
  const handleOpenAddConfig = (vehicle) => { setActiveVehicle(vehicle); setActiveConfig(null); setOpenConfigModal(true); };
  const handleOpenEditConfig = (vehicle, config) => { setActiveVehicle(vehicle); setActiveConfig(config); setOpenConfigModal(true); };
  const handleSaveConfig = async (configData) => {
    if (!activeVehicle) return;
    try {
      if (configData.configId) await apiClient.put(`/admin/vehicles/${activeVehicle.vehicleId}/configs/${configData.configId}`, configData);
      else await apiClient.post(`/admin/vehicles/${activeVehicle.vehicleId}/configs`, configData);
      setOpenConfigModal(false); await fetchVehicles();
    } catch (error) { console.error(error); }
  };
  const handleToggleConfigStatus = async (vehicleId, config) => {
    try { await apiClient.put(`/admin/vehicles/${vehicleId}/configs/${config.configId}/status`); await fetchVehicles(); } catch (error) { console.error(error); }
  };
  const handleDeleteConfig = async (vehicleId, configId) => {
    if (window.confirm("Xóa vĩnh viễn cấu hình này?")) {
      try { await apiClient.delete(`/admin/vehicles/${vehicleId}/configs/${configId}`); await fetchVehicles(); } catch (error) { console.error(error); }
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
             <CarFront className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Quản lý danh mục xe</h1>
            <p className="text-slate-400 text-sm">Quản lý models, phiên bản và giá bán</p>
          </div>
        </div>

        {canManage && (
          <button onClick={handleAddVehicle} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition">
            <Plus className="w-5 h-5" /> Thêm xe mới
          </button>
        )}
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-[#1e293b]/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center px-3 text-slate-400">
           <Filter className="w-5 h-5" />
        </div>
        <div className="h-8 w-[1px] bg-slate-700 mx-1"></div>
        
        <select value={filter.brand} onChange={(e) => setFilter({ ...filter, brand: e.target.value })} className="bg-slate-900/50 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none hover:bg-slate-800 transition">
          <option value="">Tất cả hãng</option>
          {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>
        
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="bg-slate-900/50 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none hover:bg-slate-800 transition">
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Đang kinh doanh</option>
          <option value="Inactive">Ngừng kinh doanh</option>
        </select>
        
        <select value={filter.color} onChange={(e) => setFilter({ ...filter, color: e.target.value })} className="bg-slate-900/50 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none hover:bg-slate-800 transition">
          <option value="">Tất cả màu sắc</option>
          {colors.map((c) => c && (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Search className="w-10 h-10 mb-4 animate-bounce text-sky-500" />
            <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((v) => (
            <VehicleCard
              key={v.vehicleId}
              vehicle={v}
              canManage={canManage}
              onEdit={() => handleEditVehicle(v)}
              onDelete={() => handleDeleteVehicle(v.vehicleId)}
              onAddConfig={() => handleOpenAddConfig(v)}
              onEditConfig={(cfg) => handleOpenEditConfig(v, cfg)}
              onToggleConfigStatus={(cfg) => handleToggleConfigStatus(v.vehicleId, cfg)}
              onDeleteConfig={(cfgId) => handleDeleteConfig(v.vehicleId, cfgId)}
              onReactivate={() => handleReactivateVehicle(v)}
            />
          ))}
          {filteredVehicles.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
                Không tìm thấy xe nào phù hợp bộ lọc.
            </div>
          )}
        </div>
      )}

      {openConfigModal && <ConfigModal config={activeConfig} onClose={() => setOpenConfigModal(false)} onSave={handleSaveConfig} />}
      {openVehicleModal && <VehicleModal vehicle={activeVehicle} onClose={() => setOpenVehicleModal(false)} onSave={handleSaveVehicle} />}
    </div>
  );
};

export default VehicleCatalogue;