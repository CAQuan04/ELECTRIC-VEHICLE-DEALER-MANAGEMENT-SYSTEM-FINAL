// File: src/features/staff/pages/CatalogueViewer.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, AlertCircle } from "lucide-react";
import apiClient from "../../../utils/api/client"; // Đảm bảo apiClient đã được cấu hình đúng

// Tái sử dụng VehicleCard từ thư mục admin để đồng bộ giao diện
import VehicleCard from "../../admin/components/catalog/VehicleCard";

const CatalogueViewer = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ brand: "", color: "" });

  // Hàm gọi API để lấy danh sách xe
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // --- THAY ĐỔI THEO YÊU CẦU ---
      // Gọi đến endpoint của Admin
      const response = await apiClient.get("/admin/vehicles"); 
      // --- KẾT THÚC THAY ĐỔI ---

      if (Array.isArray(response)) {
        setVehicles(response);
      } else {
        console.warn("API không trả về một mảng:", response);
        setVehicles([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải dữ liệu từ máy chủ.";
      console.error("Lỗi khi tải danh sách xe:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => {
    const colorSet = new Set();
    vehicles.forEach(v => {
      if (v.configs && Array.isArray(v.configs)) {
        v.configs.forEach(c => {
          if (c.color) colorSet.add(c.color);
        });
      }
    });
    return Array.from(colorSet);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    // Lọc theo brand và color. 
    // Giờ đây nó sẽ hiển thị cả xe 'Inactive' vì ta đang dùng API của Admin
    return vehicles.filter((v) =>
      (!filter.brand || v.brand === filter.brand) &&
      (!filter.color || (v.configs && v.configs.some(c => c.color === filter.color)))
    );
  }, [vehicles, filter]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Đang tải dữ liệu...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-400 flex flex-col items-center gap-2">
          <AlertCircle size={48} />
          <p>Đã xảy ra lỗi!</p>
          <p>{error}</p>
        </div>
      );
    }

    if (filteredVehicles.length === 0) {
      return <div className="text-center py-10">Không tìm thấy sản phẩm nào phù hợp.</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((v) => (
          <VehicleCard
            key={v.vehicleId}
            vehicle={v}
            canManage={false} // Nhân viên vẫn chỉ xem
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold leading-normal py-2 text-sky-400">
          Danh mục xe
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#102032] p-3 rounded-2xl border border-slate-700">
        <Filter className="text-cyan-300" />
        <select value={filter.brand} onChange={(e) => setFilter({ ...filter, brand: e.target.value })} className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500">
          <option value="">Tất cả hãng</option>
          {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>
        
        <select value={filter.color} onChange={(e) => setFilter({ ...filter, color: e.target.value })} className="bg-transparent text-slate-200 px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500">
          <option value="">Tất cả màu</option>
          {colors.map((c) => c && (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      {renderContent()}
    </div>
  );
};

export default CatalogueViewer;