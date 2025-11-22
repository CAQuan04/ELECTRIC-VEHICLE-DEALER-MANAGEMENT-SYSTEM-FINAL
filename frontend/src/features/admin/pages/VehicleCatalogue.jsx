import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, CarFront, Search, ChevronDown, X } from "lucide-react"; 
import VehicleCard from "../components/catalog/VehicleCard";
import ConfigModal from "../components/modals/ConfigModal";
import VehicleModal from "../components/modals/VehicleModal";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../utils/api/client";

const VehicleCatalogue = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // State bộ lọc
  const [filter, setFilter] = useState({ searchTerm: "", brand: "", status: "", color: "" });
  
  // State Modals
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeConfig, setActiveConfig] = useState(null);

  // --- API: Lấy danh sách xe (FIX LỖI CHỚP TRANG) ---
  // Thêm tham số showLoader để kiểm soát việc hiện loading
  const fetchVehicles = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await apiClient.get("/admin/vehicles"); 
      setVehicles(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Lần đầu vào trang thì hiện loading
  useEffect(() => { fetchVehicles(true); }, [fetchVehicles]);
  
  // --- Logic Filter ---
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color)))), [vehicles]);
  
  const filteredVehicles = useMemo(() => vehicles.filter((v) => {
    const matchBrand = !filter.brand || v.brand === filter.brand;
    const matchStatus = !filter.status || v.status === filter.status;
    const matchColor = !filter.color || v.configs?.some(c => c.color === filter.color) || v.color === filter.color;
    const matchSearch = !filter.searchTerm || v.model.toLowerCase().includes(filter.searchTerm.toLowerCase());
    return matchBrand && matchStatus && matchColor && matchSearch;
  }), [vehicles, filter]);

  // --- XỬ LÝ XE (VEHICLE) ---

  const handleAddVehicle = () => { setActiveVehicle(null); setOpenVehicleModal(true); };
  const handleEditVehicle = (vehicle) => { setActiveVehicle(vehicle); setOpenVehicleModal(true); };
  
  const handleSaveVehicle = async (data) => {
    try {
      const formData = new FormData();
      formData.append("model", data.model);
      formData.append("brand", data.brand);
      if (data.year) formData.append("year", data.year);
      if (data.basePrice) formData.append("basePrice", data.basePrice);
      if (data.imageFile) formData.append("image", data.imageFile);

      if (data.vehicleId) {
        await apiClient.put(`/admin/vehicles/${data.vehicleId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await apiClient.post("/admin/vehicles", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setOpenVehicleModal(false);
      
      // FIX: Gọi fetchVehicles(false) để cập nhật ngầm, không chớp trang
      await fetchVehicles(false); 
    } catch (error) {
      console.error("Lỗi lưu xe:", error);
      alert("Lỗi server: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Bạn có chắc muốn xóa xe này?")) {
      try { 
        await apiClient.delete(`/admin/vehicles/${vehicleId}`); 
        // FIX: Update ngầm
        await fetchVehicles(false); 
      } catch (error) { 
        alert("Không thể xóa xe: " + error.message);
      }
    }
  };

  const handleReactivateVehicle = async (vehicle) => {
    if (window.confirm(`Bạn có muốn kích hoạt lại xe ${vehicle.model}?`)) {
      try {
        await apiClient.put(`/admin/vehicles/${vehicle.vehicleId}/status`);
        // FIX: Update ngầm
        await fetchVehicles(false);
      } catch (error) {
        alert("Lỗi kích hoạt lại xe.");
      }
    }
  };

  // --- XỬ LÝ CẤU HÌNH (CONFIG) ---

  const handleOpenAddConfig = (vehicle) => { setActiveVehicle(vehicle); setActiveConfig(null); setOpenConfigModal(true); };
  const handleOpenEditConfig = (vehicle, config) => { setActiveVehicle(vehicle); setActiveConfig(config); setOpenConfigModal(true); };

  const handleSaveConfig = async (configData) => {
    if (!activeVehicle) return;
    try {
      if (configData.configId) {
        await apiClient.put(`/admin/vehicles/${activeVehicle.vehicleId}/configs/${configData.configId}`, configData);
      } else {
        await apiClient.post(`/admin/vehicles/${activeVehicle.vehicleId}/configs`, configData);
      }
      setOpenConfigModal(false);
      // FIX: Update ngầm
      await fetchVehicles(false);
    } catch (error) { 
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleConfigStatus = async (config) => {
     const parentVehicle = vehicles.find(v => v.configs?.some(c => c.configId === config.configId));
     if(!parentVehicle) return;

    try { 
      await apiClient.put(`/admin/vehicles/${parentVehicle.vehicleId}/configs/${config.configId}/status`); 
      // FIX: Update ngầm -> Trải nghiệm mượt mà nhất
      await fetchVehicles(false); 
    } catch (error) { 
      alert("Lỗi thay đổi trạng thái cấu hình.");
    }
  };

  const handleDeleteConfig = async (configId) => {
    const parentVehicle = vehicles.find(v => v.configs?.some(c => c.configId === configId));
    if(!parentVehicle) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn cấu hình này?")) {
      try { 
        await apiClient.delete(`/admin/vehicles/${parentVehicle.vehicleId}/configs/${configId}`); 
        // FIX: Update ngầm
        await fetchVehicles(false); 
      } catch (error) { 
        alert("Lỗi xóa cấu hình.");
      }
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
             <CarFront className="w-9 h-9 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100 py-2">Quản lý danh mục xe</h1>
            <p className="text-slate-400 text-base">Quản lý danh mục và cấu hình xe</p>
          </div>
        </div>
        {canManage && (
          <button onClick={handleAddVehicle} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition text-lg">
            <Plus className="w-6 h-6" /> Thêm xe mới
          </button>
        )}
      </div>
      
      {/* FILTER BAR */}
      <div className="w-full bg-[#13233a] border-y border-slate-700 mb-12 shadow-2xl overflow-x-auto">
        <div className="flex items-center w-full h-auto md:h-24">
            
            {/* Filter Label */}
            <div className="h-full flex items-center px-6 md:px-8 border-r border-slate-700/60 bg-[#1a2b44]/50 flex-none">
                <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
            </div>

            {/* Search Input */}
            <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-slate-700/60 min-w-[250px] group cursor-text hover:bg-[#1a2b44]/20 transition" onClick={() => document.getElementById('search-input').focus()}>
                <span className="text-slate-300 font-semibold text-sm md:text-base mr-3 group-hover:text-white transition hidden sm:block">Search</span>
                <div className="relative flex-1">
                   <div className="flex items-center bg-[#0b1622] border border-slate-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500/50 transition">
                      <input 
                          id="search-input"
                          type="text" 
                          placeholder="Nhập model..." 
                          value={filter.searchTerm}
                          onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                          className="w-full bg-transparent border-none p-0 text-white placeholder:text-slate-500 focus:ring-0 text-sm md:text-base font-medium"
                      />
                      {filter.searchTerm ? (
                          <button onClick={(e) => {e.stopPropagation(); setFilter({...filter, searchTerm: ''})}} className="text-slate-400 hover:text-white ml-2">
                              <X className="w-5 h-5" />
                          </button>
                      ) : (
                         <ChevronDown className="w-5 h-5 text-slate-500 ml-2" />
                      )}
                   </div>
                </div>
            </div>

            {/* Brand Filter */}
            <div className="h-full relative px-4 md:px-6 border-r border-slate-700/60 flex-1 min-w-[150px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                <span className="text-slate-300 text-sm md:text-base font-semibold mr-2 truncate">Merchandising</span>
                <select value={filter.brand} onChange={(e) => setFilter({ ...filter, brand: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <option value="" className="bg-slate-900 text-slate-100 py-2">All Brands</option>
                    {brands.map((b) => (<option key={b} value={b} className="bg-slate-900 text-slate-100 py-2">{b}</option>))}
                </select>
                <ChevronDown className="ml-auto w-5 h-5 text-slate-400" />
                {filter.brand && <span className="absolute bottom-2 left-6 text-xs text-blue-400 font-bold tracking-wider truncate">{filter.brand}</span>}
            </div>

            {/* Color Filter */}
            <div className="h-full relative px-4 md:px-6 border-r border-slate-700/60 flex-1 min-w-[140px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                <span className="text-slate-300 text-sm md:text-base font-semibold mr-2 truncate">Theme</span>
                <select value={filter.color} onChange={(e) => setFilter({ ...filter, color: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <option value="" className="bg-slate-900 text-slate-100 py-2">All Colors</option>
                    {colors.map((c) => c && (<option key={c} value={c} className="bg-slate-900 text-slate-100 py-2">{c}</option>))}
                </select>
                <ChevronDown className="ml-auto w-5 h-5 text-slate-400" />
                {filter.color && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.color}</span>}
            </div>

            {/* Status Filter */}
            <div className="h-full relative px-4 md:px-6 flex-1 min-w-[160px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 text-sm md:text-base font-semibold truncate">Tool</span>
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                    <option value="" className="bg-slate-900 text-slate-100 py-2">All Status</option>
                    <option value="Active" className="bg-slate-900 text-slate-100 py-2">Active</option>
                    <option value="Inactive" className="bg-slate-900 text-slate-100 py-2">Inactive</option>
                </select>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/40 flex items-center justify-center ml-4 z-0 flex-none">
                    <span className="text-white font-bold text-xs md:text-sm">New</span>
                </div>
                {filter.status && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.status}</span>}
            </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Search className="w-12 h-12 mb-4 animate-bounce text-blue-500" />
            <p className="text-lg">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVehicles.map((v) => (
            <VehicleCard
              key={v.vehicleId}
              vehicle={v}
              canManage={canManage}
              onEdit={() => handleEditVehicle(v)}
              onDelete={() => handleDeleteVehicle(v.vehicleId)}
              onAddConfig={() => handleOpenAddConfig(v)}
              onEditConfig={(cfg) => handleOpenEditConfig(v, cfg)}
              onToggleConfigStatus={(cfg) => handleToggleConfigStatus(cfg)} 
              onDeleteConfig={(cfgId) => handleDeleteConfig(cfgId)}
              onReactivate={() => handleReactivateVehicle(v)}
            />
          ))}
          {filteredVehicles.length === 0 && (
            <div className="col-span-full text-center py-24 text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-[#0b1622]">
                <p className="text-xl font-medium">Không tìm thấy xe nào phù hợp.</p>
                <button onClick={() => setFilter({searchTerm:"", brand:"", status:"", color:""})} className="mt-4 text-blue-400 hover:underline text-lg">Xóa bộ lọc</button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {openConfigModal && <ConfigModal config={activeConfig} onClose={() => setOpenConfigModal(false)} onSave={handleSaveConfig} />}
      {openVehicleModal && <VehicleModal vehicle={activeVehicle} onClose={() => setOpenVehicleModal(false)} onSave={handleSaveVehicle} />}
    </div>
  );
};

export default VehicleCatalogue;