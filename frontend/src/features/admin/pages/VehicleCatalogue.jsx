import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, CarFront, Search, ChevronDown, X, Filter } from "lucide-react"; 
import apiClient from "../../../utils/api/client";
import { useAuth } from "../../../context/AuthContext";

// Import Components chuẩn
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import VehicleCard from '../components/catalog/VehicleCard'; 
import ConfigModal from '../components/modals/ConfigModal'; 
import VehicleModal from '../components/modals/VehicleModal'; 

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

  // --- API ---
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

  useEffect(() => { fetchVehicles(true); }, [fetchVehicles]);
  
  // --- Logic Filter & Sort ---
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color)))), [vehicles]);
  
  const filteredVehicles = useMemo(() => {
    // 1. Lọc dữ liệu
    let result = vehicles.filter((v) => {
      const matchBrand = !filter.brand || v.brand === filter.brand;
      const matchStatus = !filter.status || v.status === filter.status;
      const matchColor = !filter.color || v.configs?.some(c => c.color === filter.color) || v.color === filter.color;
      const matchSearch = !filter.searchTerm || v.model.toLowerCase().includes(filter.searchTerm.toLowerCase());
      return matchBrand && matchStatus && matchColor && matchSearch;
    });

    // 2. Sắp xếp: Mới nhất lên đầu (ID giảm dần)
    result.sort((a, b) => b.vehicleId - a.vehicleId);

    return result;
  }, [vehicles, filter]);

  // --- HANDLERS ---
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
        await apiClient.put(`/admin/vehicles/${data.vehicleId}`, formData); 
      } else {
        await apiClient.post("/admin/vehicles", formData); 
      }
      
      setOpenVehicleModal(false);
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
        await fetchVehicles(false);
      } catch (error) {
        alert("Lỗi kích hoạt lại xe.");
      }
    }
  };

  // --- CONFIG HANDLERS ---
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
        await fetchVehicles(false); 
      } catch (error) { 
        alert("Lỗi xóa cấu hình.");
      }
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Quản lý Danh mục xe"
        subtitle="Hồ sơ sản phẩm"
        description="Quản lý thông tin xe, phiên bản cấu hình, giá bán và hình ảnh sản phẩm."
        icon={<CarFront />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Danh mục xe", path: "/vehicles" }
        ]}
        actions={
          canManage && (
            <Button 
                variant="primary" 
                size="lg" 
                icon={<Plus className="w-5 h-5" />} 
                onClick={handleAddVehicle}
            >
                Thêm xe mới
            </Button>
          )
        }
      />
      
      <div className="mt-8 space-y-8">
        {/* 2. FILTER BAR */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 mb-12 shadow-2xl overflow-x-auto rounded-lg">
            <div className="flex items-center w-full h-auto md:h-24">
                
                {/* Label */}
                <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                    <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
                </div>

                {/* Search */}
                <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[250px] group cursor-text hover:bg-[#1a2b44]/20 transition">
                    <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Search</span>
                    <div className="relative flex-1">
                    <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                        <input 
                            type="text" 
                            placeholder="Nhập tên model..." 
                            value={filter.searchTerm}
                            onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                            className="w-full bg-transparent border-none p-0 text-white placeholder:text-gray-500 focus:ring-0 text-base font-medium"
                        />
                        {filter.searchTerm ? (
                            <button onClick={() => setFilter({...filter, searchTerm: ''})} className="text-gray-400 hover:text-white ml-2"><X className="w-5 h-5" /></button>
                        ) : (<Search className="w-5 h-5 text-gray-500 ml-2" />)}
                    </div>
                    </div>
                </div>

                {/* Brand Filter */}
                <div className="h-full relative px-4 md:px-6 border-r border-gray-700/60 flex-1 min-w-[160px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                    <span className="text-gray-300 text-base font-semibold mr-2 truncate">Hãng xe</span>
                    <select value={filter.brand} onChange={(e) => setFilter({ ...filter, brand: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-white">
                        <option value="" className="bg-[#1e293b]">Tất cả</option>
                        {brands.map((b) => (<option key={b} value={b} className="bg-[#1e293b]">{b}</option>))}
                    </select>
                    <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                    {filter.brand && <span className="absolute bottom-2 left-6 text-xs text-blue-400 font-bold tracking-wider truncate">{filter.brand}</span>}
                </div>

                {/* Color Filter */}
                <div className="h-full relative px-4 md:px-6 border-r border-gray-700/60 flex-1 min-w-[160px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                    <span className="text-gray-300 text-base font-semibold mr-2 truncate">Màu sắc</span>
                    <select value={filter.color} onChange={(e) => setFilter({ ...filter, color: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-white">
                        <option value="" className="bg-[#1e293b]">Tất cả</option>
                        {colors.map((c) => c && (<option key={c} value={c} className="bg-[#1e293b]">{c}</option>))}
                    </select>
                    <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                    {filter.color && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.color}</span>}
                </div>

                {/* Status Filter */}
                <div className="h-full relative px-4 md:px-6 flex-1 min-w-[160px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300 text-base font-semibold truncate">Trạng thái</span>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white">
                        <option value="" className="bg-[#1e293b]">Tất cả</option>
                        <option value="Active" className="bg-[#1e293b]">Active</option>
                        <option value="Inactive" className="bg-[#1e293b]">Inactive</option>
                    </select>
                    {filter.status && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.status}</span>}
                </div>
            </div>
        </div>
        
        {/* 3. GRID LIST */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
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
                <div className="col-span-full">
                    <EmptyState title="Không tìm thấy xe" description="Thử thay đổi bộ lọc tìm kiếm của bạn." />
                </div>
            )}
            </div>
        )}

        {/* 4. MODALS */}
        {openConfigModal && <ConfigModal config={activeConfig} onClose={() => setOpenConfigModal(false)} onSave={handleSaveConfig} />}
        {openVehicleModal && <VehicleModal vehicle={activeVehicle} onClose={() => setOpenVehicleModal(false)} onSave={handleSaveVehicle} />}
      </div>
    </PageContainer>
  );
};

export default VehicleCatalogue;