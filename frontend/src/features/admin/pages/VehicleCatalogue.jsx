import React, { useMemo, useState } from "react";
import { Plus, Filter } from "lucide-react";
import VehicleCard from "../components/catalog/VehicleCard";
import ConfigModal from "../components/modals/ConfigModal";
import VehicleModal from "../components/modals/VehicleModal";

const VehicleCatalog = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: "2",
      brand: "VinFast",
      model: "VF 9 Plus",
      year: 2024,
      basePrice: "21,000,000,000",
      status: "Active",
      image: "https://storage.googleapis.com/vinfast-data-01/vinfast-vf-9-plus-van-hanh-manh-me_1644999493.png",
      color: "Trắng",
      configs: [
        {
          id: "5",
          name: "VF 9 Plus - Trắng",
          battery: "123 kWh",
          range: 600,
          price: "21,000,000,000",
          colorOptions: ["Trắng"],
          status: "Active",
        },
        {
          id: "6",
          name: "VF 9 Plus - Đen",
          battery: "123 kWh",
          range: 600,
          price: "21,000,000,000",
          colorOptions: ["Đen"],
          status: "Inactive",
        },
      ],
    },
    {
      id: "3",
      brand: "VinFast",
      model: "VF 8 Plus",
      year: 2025,
      basePrice: "15,000,000,000",
      status: "Active",
      image: "https://vinfast-vn.vn/wp-content/uploads/2023/10/vinfast-vf8-1-1.png",
      color: "Đỏ",
      configs: [],
    },
    {
      id: "4",
      brand: "VinFast",
      model: "VF 7 Eco",
      year: 2025,
      basePrice: "9,000,000,000",
      status: "Active",
      image: "https://vinfast-vungtau.vn/upload/tour/2081216609137070.png",
      color: "Xanh",
      configs: [],
    },
    {
      id: "5",
      brand: "VinFast",
      model: "VF 3 Puls",
      year: 2025,
      basePrice: "5,100,000,000",
      status: "Inactive",
      image: "https://bizweb.dktcdn.net/100/440/693/files/thay-binh-ac-quy-xe-vinfast-vf3.png?v=1692676803417",
      color: "Vàng",
      configs: [],
    },
  ]);

  const [filter, setFilter] = useState({ brand: "", status: "", color: "" });
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [activeConfig, setActiveConfig] = useState(null);

  // Tạo danh sách filter động
  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))),
    [vehicles]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          vehicles
            .flatMap((v) => v.configs.flatMap((c) => c.colorOptions ?? []))
            .concat(vehicles.map((v) => v.color))
        )
      ),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (v) =>
        (!filter.brand || v.brand === filter.brand) &&
        (!filter.status || v.status === filter.status) &&
        (!filter.color || v.color === filter.color)
    );
  }, [vehicles, filter]);

  // ======================
  // CRUD XE
  // ======================
  const handleAddVehicle = () => {
    setActiveVehicle(null);
    setOpenVehicleModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setActiveVehicle(vehicle);
    setOpenVehicleModal(true);
  };

  const handleSaveVehicle = (data) => {
    setVehicles((prev) => {
      if (data.id) {
        return prev.map((v) => (v.id === data.id ? { ...v, ...data } : v));
      }
      const newId = (
        Math.max(0, ...prev.map((v) => parseInt(v.id))) + 1
      ).toString();
      return [...prev, { ...data, id: newId, status: "Active", configs: [] }];
    });
    setOpenVehicleModal(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: "Inactive" } : v))
    );
  };

  const handleReactivateVehicle = (vehicle) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicle.id ? { ...v, status: "Active" } : v
      )
    );
  };

  // ======================
  // CRUD CẤU HÌNH
  // ======================
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

  const handleSaveConfig = (cfgForm) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== activeVehicle.id) return v;
        const configs = v.configs || [];
        if (cfgForm.id) {
          return {
            ...v,
            configs: configs.map((c) => (c.id === cfgForm.id ? cfgForm : c)),
          };
        } else {
          const newId = "C" + (configs.length + 1);
          return {
            ...v,
            configs: [
              ...configs,
              { ...cfgForm, id: newId, status: "Active" },
            ],
          };
        }
      })
    );
    setOpenConfigModal(false);
  };

  const handleToggleConfigStatus = (vehicleId, cfg) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              configs: v.configs.map((c) =>
                c.id === cfg.id
                  ? {
                      ...c,
                      status: c.status === "Active" ? "Inactive" : "Active",
                    }
                  : c
              ),
            }
          : v
      )
    );
  };

  // ======================
  // GIAO DIỆN
  // ======================
  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Quản lý danh mục xe
        </h1>

        <button
          onClick={handleAddVehicle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110"
        >
          <Plus className="w-4 h-4" /> Thêm xe
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#102032] p-3 rounded-2xl border border-slate-700">
        <Filter className="text-cyan-300" />
        <select
          value={filter.brand}
          onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
          className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tất cả hãng</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Hoạt động</option>
          <option value="Inactive">Ngừng</option>
        </select>

        <select
          value={filter.color}
          onChange={(e) => setFilter({ ...filter, color: e.target.value })}
          className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Tất cả màu</option>
          {colors.map(
            (c) =>
              c && (
                <option key={c} value={c}>
                  {c}
                </option>
              )
          )}
        </select>
      </div>

      {/* Danh sách xe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            onEdit={() => handleEditVehicle(v)}
            onDelete={() => handleDeleteVehicle(v.id)}
            onAddConfig={() => handleOpenAddConfig(v)}
            onEditConfig={(cfg) => handleOpenEditConfig(v, cfg)}
            onToggleConfigStatus={(cfg) => handleToggleConfigStatus(v.id, cfg)}
            onReactivate={(veh) => handleReactivateVehicle(veh)} // ✅ Thêm kích hoạt lại xe
          />
        ))}
      </div>

      {/* Modals */}
      {openConfigModal && (
        <ConfigModal
          config={activeConfig}
          onClose={() => setOpenConfigModal(false)}
          onSave={handleSaveConfig}
        />
      )}
      {openVehicleModal && (
        <VehicleModal
          vehicle={activeVehicle}
          onClose={() => setOpenVehicleModal(false)}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
};

export default VehicleCatalog;
