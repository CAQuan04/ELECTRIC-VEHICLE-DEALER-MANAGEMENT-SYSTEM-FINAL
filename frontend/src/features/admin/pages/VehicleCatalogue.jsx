// File: src/features/admin/pages/VehicleCatalogue.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, Filter } from "lucide-react";
import VehicleCard from "../components/catalog/VehicleCard";
import ConfigModal from "../components/modals/ConfigModal";
import VehicleModal from "../components/modals/VehicleModal";
import { notifications } from '@utils/notifications';

// --- CÁC THÀNH PHẦN TÍCH HỢP ---
import apiClient from "../../../utils/api/client"; // Đảm bảo đường dẫn đúng

const VehicleCatalogue = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({ brand: "", status: "", color: "" });
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeConfig, setActiveConfig] = useState(null);

  // === HÀM LẤY DỮ LIỆU TỪ BACKEND ===
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
  
  // === LOGIC FILTER (KHÔNG THAY ĐỔI) ===
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color)))), [vehicles]);
  const filteredVehicles = useMemo(() => vehicles.filter((v) => 
    (!filter.brand || v.brand === filter.brand) &&
    (!filter.status || v.status === filter.status) &&
    (!filter.color || v.configs.some(c => c.color === filter.color) || v.color === filter.color)
  ), [vehicles, filter]);

  // === CÁC HÀM XỬ LÝ SỰ KIỆN CRUD (ĐÃ TÍCH HỢP API) ===

  const handleAddVehicle = () => {
    setActiveVehicle(null);
    setOpenVehicleModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setActiveVehicle(vehicle);
    setOpenVehicleModal(true);
  };

  const handleSaveVehicle = async (formData) => {
    try {
      if (formData.vehicleId) {
        await apiClient.put(`/admin/vehicles/${formData.vehicleId}`, formData);
      } else {
        await apiClient.post("/admin/vehicles", formData);
      }
      setOpenVehicleModal(false);
      await fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin xe:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    notifications.confirm(
      'Xóa xe',
      'Bạn có chắc muốn xóa mềm (chuyển sang Inactive) xe này?',
      async () => {
        try {
          await apiClient.delete(`/admin/vehicles/${vehicleId}`);
          await fetchVehicles();
          notifications.success('Thành công', 'Đã xóa xe thành công');
        } catch (error) {
          console.error("Lỗi khi xóa xe:", error);
          notifications.error('Lỗi', 'Không thể xóa xe');
        }
      }
    );
  };
  
  const handleReactivateVehicle = async (vehicle) => {
    notifications.confirm(
      'Kích hoạt lại xe',
      'Bạn có chắc muốn kích hoạt lại xe này?',
      async () => {
        try {
          await apiClient.put(`/admin/vehicles/${vehicle.vehicleId}/status`);
          await fetchVehicles();
          notifications.success('Thành công', 'Đã kích hoạt lại xe');
        } catch (error) {
          console.error("Lỗi khi kích hoạt lại xe:", error);
          notifications.error('Lỗi', 'Không thể kích hoạt lại xe');
        }
      }
    );
  };

  const handleOpenAddConfig = (vehicle) => {
    setActiveVehicle(vehicle);
    setActiveConfig(null);
    setOpenConfigModal(true);
  };

  const handleOpenEditConfig = (vehicle, config) => {
    setActiveVehicle(vehicle);
    setActiveConfig(config);
    setOpenConfigModal(true);
  };

  const handleSaveConfig = async (configData) => {
    if (!activeVehicle) return;
    try {
      // ===================================================================================
      // === PHẦN SỬA ĐỔI: SỬ DỤNG ĐÚNG ROUTE MỚI CHO UPDATE CONFIG ===
      if (configData.configId) { // Sửa cấu hình
        // Ghi chú: URL bây giờ cần cả vehicleId và configId.
        await apiClient.put(`/admin/vehicles/${activeVehicle.vehicleId}/configs/${configData.configId}`, configData);
      } else { // Thêm cấu hình mới
        await apiClient.post(`/admin/vehicles/${activeVehicle.vehicleId}/configs`, configData);
      }
      // ===================================================================================
      setOpenConfigModal(false);
      await fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
    }
  };

  const handleToggleConfigStatus = async (vehicleId, config) => {
    try {
      await apiClient.put(`/admin/vehicles/${vehicleId}/configs/${config.configId}/status`);
      await fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái cấu hình:", error);
    }
  };
  
  const handleDeleteConfig = async (vehicleId, configId) => {
    notifications.confirm(
      'Xóa cấu hình',
      'Bạn có chắc muốn xóa vĩnh viễn cấu hình này?',
      async () => {
        try {
          // ===================================================================================
          // === PHẦN SỬA ĐỔI: SỬ DỤNG ĐÚNG ROUTE MỚI CHO DELETE CONFIG ===
          // Ghi chú: URL bây giờ cần cả vehicleId và configId.
          await apiClient.delete(`/admin/vehicles/${vehicleId}/configs/${configId}`);
          // ===================================================================================
          await fetchVehicles();
          notifications.success('Thành công', 'Đã xóa cấu hình');
        } catch (error) {
          console.error("Lỗi khi xóa cấu hình:", error);
          notifications.error('Lỗi', 'Không thể xóa cấu hình');
        }
      }
    );
  };

  const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

  // === GIAO DIỆN ===
  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Quản lý danh mục xe
        </h1>
        {canManage && (
          <button onClick={handleAddVehicle} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110">
            <Plus className="w-4 h-4" /> Thêm xe
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#102032] p-3 rounded-2xl border border-slate-700">
        <Filter className="text-cyan-300" />
        <select value={filter.brand} onChange={(e) => setFilter({ ...filter, brand: e.target.value })} className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500">
          <option value="">Tất cả hãng</option>
          {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500">
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Hoạt động</option>
          <option value="Inactive">Ngừng</option>
        </select>
        <select value={filter.color} onChange={(e) => setFilter({ ...filter, color: e.target.value })} className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500">
          <option value="">Tất cả màu</option>
          {colors.map((c) => c && (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
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
        </div>
      )}

      {openConfigModal && <ConfigModal config={activeConfig} onClose={() => setOpenConfigModal(false)} onSave={handleSaveConfig} />}
      {openVehicleModal && <VehicleModal vehicle={activeVehicle} onClose={() => setOpenVehicleModal(false)} onSave={handleSaveVehicle} />}
    </div>
  );
};

export default VehicleCatalogue;