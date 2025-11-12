// File: src/features/staff/pages/CatalogueViewer.jsx

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Filter } from "lucide-react";
import apiClient from "../../../utils/api/client"; // Import API client

// TÁI SỬ DỤNG VehicleCard từ thư mục admin
// (Đảm bảo đường dẫn này chính xác từ file staff của bạn)
import VehicleCard from "../../admin/components/catalog/VehicleCard";

// ▼▼▼ 1. MOCK DATA (DỮ LIỆU GIẢ) ▼▼▼
const mockVehicleData = [
  {
    vehicleId: "V001",
    model: "VF 8",
    brand: "VinFast",
    year: 2024,
    basePrice: 1200000000,
    imageUrl: "https://via.placeholder.com/400x300.png?text=VinFast+VF+8",
    status: "Active",
    configs: [
      {
        configId: "C01",
        color: "Trắng",
        batteryKwh: 82,
        rangeKm: 420,
        status: "Active",
      },
      {
        configId: "C02",
        color: "Đỏ",
        batteryKwh: 87,
        rangeKm: 470,
        status: "Active",
      },
    ],
  },
  {
    vehicleId: "V002",
    model: "Model Y",
    brand: "Tesla",
    year: 2023,
    basePrice: 1500000000,
    imageUrl: "https://via.placeholder.com/400x300.png?text=Tesla+Model+Y",
    status: "Active",
    configs: [
      {
        configId: "C03",
        color: "Đen",
        batteryKwh: 75,
        rangeKm: 510,
        status: "Active",
      },
    ],
  },
  {
    vehicleId: "V003",
    model: "VF e34",
    brand: "VinFast",
    year: 2022,
    basePrice: 700000000,
    imageUrl: "https://via.placeholder.com/400x300.png?text=VinFast+VFe34",
    status: "Inactive", // Thử 1 xe Inactive để kiểm tra bộ lọc
    configs: [],
  },
];
// ▲▲▲ KẾT THÚC MOCK DATA ▲▲▲


const CatalogueViewer = () => {
  // ▼▼▼ 2. SỬA ĐỔI STATE ▼▼▼
  // Dùng mock data làm dữ liệu ban đầu
  const [vehicles, setVehicles] = useState(mockVehicleData); 
  
  // Tắt loading vì đã có mock data
  const [loading, setLoading] = useState(false); 
  
  // Bộ lọc (đã sửa status: "" để hiện cả xe Active và Inactive)
  const [filter, setFilter] = useState({ brand: "", status: "", color: "" });
  // ▲▲▲ KẾT THÚC SỬA ĐỔI STATE ▲▲▲

  // 1. Lấy dữ liệu từ một endpoint của Staff
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      // (Chúng ta sẽ không gọi dòng này vì đang dùng mock data)
      // const response = await apiClient.get("/staff/catalog"); 
      // setVehicles(response);
      console.log("Đã bỏ qua gọi API vì đang dùng mock data");
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ▼▼▼ 3. SỬA ĐỔI useEffect ▼▼▼
  // Vô hiệu hóa việc gọi API bằng cách comment (//) khối này
  /*
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);
  */
  // ▲▲▲ KẾT THÚC SỬA ĐỔI useEffect ▲▲▲
  
  // 2. Tái sử dụng logic lọc (filter)
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color)))), [vehicles]);
  const filteredVehicles = useMemo(() => vehicles.filter((v) => 
    (!filter.brand || v.brand === filter.brand) &&
    (!filter.status || v.status === filter.status) &&
    (!filter.color || v.configs.some(c => c.color === filter.color) || v.color === filter.color)
  ), [vehicles, filter]);

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Catalogue sản phẩm
        </h1>
        {/* KHÔNG CÓ NÚT THÊM XE */}
      </div>
      
      {/* 3. Tái sử dụng thanh Filter */}
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
            // 4. Tái sử dụng VehicleCard ở chế độ "read-only"
            <VehicleCard
              key={v.vehicleId}
              vehicle={v}
              canManage={false} 
            />
          ))}
        </div>
      )}

      {/* 5. KHÔNG CÓ MODALS */}
    </div>
  );
};

export default CatalogueViewer;