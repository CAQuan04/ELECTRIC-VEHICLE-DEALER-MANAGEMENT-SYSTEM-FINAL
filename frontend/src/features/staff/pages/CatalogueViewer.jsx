import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, Car, RefreshCw, Search, X, ChevronDown } from "lucide-react";
// Lưu ý: Kiểm tra lại đường dẫn utils này tùy vào vị trí thực tế của thư mục utils
// Nếu utils nằm cùng cấp với pages và components thì dùng ../utils
import apiClient from "../../../utils/api/client";

// --- UI Components ---
// Layout components (Theo hình ảnh nằm trong components/layout)
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";

// UI components (Theo hình ảnh nằm trong components/ui)
import Card from "../components/ui/Card";
import { Select } from "../components/ui/FormComponents";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

// --- Feature Components ---
// Lưu ý: Đường dẫn này giả định thư mục admin nằm cùng cấp với pages (src/admin)
// Nếu không tìm thấy, hãy kiểm tra lại vị trí của VehicleCard
import VehicleCard from "../../admin/components/catalog/VehicleCard";

const CatalogueViewer = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State bộ lọc (Đồng bộ với Admin)
  const [filter, setFilter] = useState({ searchTerm: "", brand: "", status: "", color: "" });

  // --- API CALL ---
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/admin/vehicles");
      
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

  // --- DATA PROCESSING (Đồng bộ logic với Admin) ---
  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))), [vehicles]);
  
  const colors = useMemo(() => Array.from(new Set(
    vehicles.flatMap((v) => v.configs?.flatMap((c) => c.color ?? []) ?? []).concat(vehicles.map((v) => v.color))
  )), [vehicles]);

  const filteredVehicles = useMemo(() => {
    // 1. Lọc dữ liệu
    let result = vehicles.filter((v) => {
      const matchBrand = !filter.brand || v.brand === filter.brand;
      const matchStatus = !filter.status || v.status === filter.status;
      
      // Check color trong cả xe cha và configs con
      const matchColor = !filter.color || 
                         (v.configs && v.configs.some(c => c.color === filter.color)) || 
                         (v.color === filter.color);
      
      const matchSearch = !filter.searchTerm || 
                          v.model.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                          v.brand.toLowerCase().includes(filter.searchTerm.toLowerCase());

      return matchBrand && matchStatus && matchColor && matchSearch;
    });

    // 2. Sắp xếp: Mới nhất lên đầu (ID giảm dần)
    result.sort((a, b) => b.vehicleId - a.vehicleId);

    return result;
  }, [vehicles, filter]);

  // --- RENDER HELPERS ---
  const renderContent = () => {
    // 1. Loading State
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-3xl h-[400px] border border-gray-700/50"></div>
          ))}
        </div>
      );
    }

    // 2. Error State
    if (error) {
      return (
        <div className="py-12">
          <EmptyState
            icon="⚠️"
            title="Đã xảy ra lỗi"
            description={error}
            action={
              <Button onClick={fetchVehicles} variant="primary" icon={<RefreshCw size={16}/>}>
                Thử lại
              </Button>
            }
          />
        </div>
      );
    }

    // 3. Empty State (No Results)
    if (filteredVehicles.length === 0) {
      return (
        <div className="py-12">
          <EmptyState
            icon="🏎️"
            title="Không tìm thấy xe"
            description="Không có mẫu xe nào phù hợp với bộ lọc hiện tại."
            action={
              <Button 
                onClick={() => setFilter({ searchTerm: "", brand: "", status: "", color: "" })} 
                variant="ghost"
              >
                Xóa bộ lọc
              </Button>
            }
          />
        </div>
      );
    }

    // 4. Data Grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredVehicles.map((v) => (
          <VehicleCard
            key={v.vehicleId}
            vehicle={v}
            canManage={false} // QUAN TRỌNG: Viewer không được sửa/xóa
          />
        ))}
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <PageContainer>
      {/* 1. Header */}
      <PageHeader
        title="Danh mục xe"
        subtitle="Tra cứu thông tin và thông số kỹ thuật xe"
        icon={<Car />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Danh mục xe" }
        ]}
        actions={
           <Button variant="ghost" icon={<RefreshCw size={18} />} onClick={fetchVehicles}>
             Làm mới
           </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* 2. FILTER BAR (Đồng bộ UI với VehicleCatalogue) */}
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

        {/* 3. Content Area */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </PageContainer>
  );
};

export default CatalogueViewer;