import React, { useState, useMemo } from "react";
import { 
  Plus, Building2, MapPin, Phone, Edit, 
  Trash2, Power, AlertCircle,
  Search, X, ChevronDown // Import thêm icon cho filter bar
} from "lucide-react";

// Đảm bảo đường dẫn import đúng với cấu trúc thư mục của bạn
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';

// Import UI Components
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
// Lưu ý: FormComponents vẫn dùng cho Modal
import { FormGroup, Label, Input, Select } from '../components/ui/FormComponents';

// ==========================================
// MAIN PAGE LOGIC (DealerManagement)
// ==========================================

const initialDealers = [
  { id: 1, name: "VinFast Thăng Long", address: "Số 1 Trần Duy Hưng, Cầu Giấy, Hà Nội", phone: "0912345678", safetyStockLevel: 10, active: true, region: "Miền Bắc" },
  { id: 2, name: "VinFast Sài Gòn", address: "Landmark 81, Bình Thạnh, TP.HCM", phone: "0987654321", safetyStockLevel: 5, active: true, region: "Miền Nam" },
  { id: 3, name: "Đại lý Sài Gòn", address: "456 Nguyễn Huệ, TP.HCM", phone: "0987654321", safetyStockLevel: 5, active: true, region: "Miền Nam" },
  { id: 4, name: "Đại lý A - Hà Nội", address: "55 Tràng Tiền, Hà Nội", phone: "02411112222", safetyStockLevel: 5, active: true, region: "Miền Bắc" },
  { id: 5, name: "Đại lý B - TPHCM", address: "22 Nguyễn Huệ, Quận 1, TP.HCM", phone: "02833334444", safetyStockLevel: 5, active: true, region: "Miền Nam" },
];

const emptyDealer = { id: "", name: "", address: "", phone: "", safetyStockLevel: 5, region: "Miền Bắc", active: true };

const DealerManagement = () => {
  const [dealers, setDealers] = useState(initialDealers);
  const [filter, setFilter] = useState({ searchTerm: "", region: "", status: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyDealer);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Logic lọc
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      const matchSearch = !filter.searchTerm || 
        d.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        d.address.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        d.phone.includes(filter.searchTerm);
      const matchRegion = !filter.region || d.region === filter.region;
      const matchStatus = filter.status === "" || (filter.status === "Active" ? d.active : !d.active);
      return matchSearch && matchRegion && matchStatus;
    }).sort((a, b) => a.id - b.id);
  }, [dealers, filter]);

  // Logic CRUD
  const genId = () => (dealers.length === 0 ? 1 : Math.max(...dealers.map((d) => d.id)) + 1);
  const openCreate = () => { setForm({ ...emptyDealer, id: genId() }); setIsEdit(false); setShowModal(true); };
  const openEdit = (d) => { setForm(d); setIsEdit(true); setShowModal(true); };
  
  const saveDealer = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) return;
    
    if (isEdit) {
      setDealers((prev) => prev.map((d) => (d.id === form.id ? { ...form } : d)));
    } else {
      setDealers((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) => setDealers((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  const doDelete = () => { setDealers((prev) => prev.filter((d) => d.id !== confirmDelete.id)); setConfirmDelete(null); };

  const regions = useMemo(() => Array.from(new Set(dealers.map(d => d.region))), [dealers]);

  // Options cho Modal Form
  const formRegionOptions = [
    { value: "Miền Bắc", label: "Miền Bắc" },
    { value: "Miền Trung", label: "Miền Trung" },
    { value: "Miền Nam", label: "Miền Nam" }
  ];

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Quản lý Đại lý"
        subtitle="Hệ thống phân phối"
        description="Quản lý danh sách đại lý, theo dõi mức tồn kho an toàn và trạng thái hoạt động của từng điểm bán trên toàn quốc."
        icon={<Building2 />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Đại lý", path: "/dealers" }
        ]}
        actions={
          <Button 
            variant="primary" 
            size="lg" 
            icon={<Plus className="w-5 h-5" />} 
            onClick={openCreate}
          >
            Thêm đại lý
          </Button>
        }
      />

      <div className="mt-8 space-y-8">
        
        {/* 2. FILTER BAR (GIAO DIỆN MỚI GIỐNG USER MANAGEMENT) */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 mb-12 shadow-2xl overflow-x-auto rounded-lg">
          <div className="flex items-center w-full h-auto md:h-24">
              
              {/* Filter Label */}
              <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                  <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
              </div>
              
              {/* Search Section */}
              <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[280px] group cursor-text hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 group-hover:text-white transition hidden sm:block">Search</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                        <input 
                          type="text" 
                          placeholder="Tìm tên, địa chỉ, SĐT..." 
                          value={filter.searchTerm} 
                          onChange={(e) => setFilter({...filter, searchTerm: e.target.value})} 
                          className="w-full bg-transparent border-none p-0 text-white placeholder:text-gray-500 focus:ring-0 text-base font-medium" 
                        />
                        {filter.searchTerm ? ( 
                          <button onClick={() => setFilter({...filter, searchTerm: ''})} className="text-gray-400 hover:text-white ml-2">
                            <X className="w-5 h-5" />
                          </button> 
                        ) : (
                          <Search className="w-5 h-5 text-gray-500 ml-2" />
                        )}
                     </div>
                  </div>
              </div>
              
              {/* Region Filter (Thay thế cho Role Filter bên User) */}
              <div className="h-full relative px-4 md:px-6 border-r border-gray-700/60 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                  <span className="text-gray-300 text-base font-semibold mr-2 truncate">Khu vực</span>
                  <select 
                    value={filter.region} 
                    onChange={(e) => setFilter({ ...filter, region: e.target.value })} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-white"
                  >
                    <option value="" className="bg-[#1e293b] text-white">Tất cả khu vực</option>
                    {regions.map((r) => (<option key={r} value={r} className="bg-[#1e293b] text-white">{r}</option>))}
                  </select>
                  <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                  {filter.region && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.region}</span>}
              </div>
              
              {/* Status Filter */}
              <div className="h-full relative px-4 md:px-6 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300 text-base font-semibold truncate">Trạng thái</span>
                  <select 
                    value={filter.status} 
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white"
                  >
                    <option value="" className="bg-[#1e293b] text-white">Tất cả</option>
                    <option value="Active" className="bg-[#1e293b] text-white">Hoạt động</option>
                    <option value="Inactive" className="bg-[#1e293b] text-white">Ngưng</option>
                  </select>
                  {filter.status && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.status === 'Active' ? 'Hoạt động' : 'Ngưng'}</span>}
              </div>
          </div>
        </div>

        {/* 3. TABLE DATA */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                  <th className="px-8 py-6">Đại lý</th>
                  <th className="px-8 py-6">Liên hệ</th>
                  <th className="px-8 py-6">Khu vực</th>
                  <th className="px-8 py-6 text-center">Tồn kho</th>
                  <th className="px-8 py-6">Trạng thái</th>
                  <th className="px-8 py-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {filteredDealers.length > 0 ? (
                  filteredDealers.map((d) => (
                    <tr key={d.id} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30 transition-colors duration-200 group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {d.name}
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          ID: {d.id}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="line-clamp-1">{d.address}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {d.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {d.region}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-black ${d.safetyStockLevel < 10 ? 'text-red-500' : 'text-cyan-600 dark:text-cyan-400'}`}>
                            {d.safetyStockLevel}
                          </span>
                          <span className="text-xs text-gray-500 uppercase font-bold">xe</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={d.active ? 'success' : 'danger'}>
                          {d.active ? "Hoạt động" : "Ngưng"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={d.active ? "text-gray-400 hover:text-red-500" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"}
                            onClick={() => toggleActive(d.id)}
                            title={d.active ? "Tắt kích hoạt" : "Kích hoạt"}
                          >
                            <Power className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEdit(d)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => setConfirmDelete(d)}
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <EmptyState 
                        icon="🔍"
                        title="Không tìm thấy đại lý"
                        description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn."
                        className="py-12"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. MODAL ADD/EDIT */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? "Cập nhật thông tin đại lý" : "Thêm đại lý mới"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" onClick={saveDealer}>
              {isEdit ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormGroup>
            <Label required>Tên đại lý</Label>
            <Input 
              placeholder="Ví dụ: VinFast Thăng Long" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label required>Địa chỉ chi tiết</Label>
            <Input 
              placeholder="Số nhà, đường, quận/huyện..." 
              value={form.address} 
              onChange={(e) => setForm({ ...form, address: e.target.value })} 
            />
          </FormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup>
              <Label required>Số điện thoại</Label>
              <Input 
                placeholder="09xxxxxxxx" 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </FormGroup>

            <FormGroup>
              <Label>Khu vực</Label>
              <Select 
                options={formRegionOptions}
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Mức tồn kho an toàn (xe)</Label>
            <Input 
              type="number" 
              value={form.safetyStockLevel} 
              onChange={(e) => setForm({ ...form, safetyStockLevel: Number(e.target.value) })} 
            />
          </FormGroup>
        </div>
      </Modal>

      {/* 5. MODAL DELETE CONFIRM */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Xác nhận xóa"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Hủy bỏ
            </Button>
            <Button variant="danger" onClick={doDelete}>
              Xác nhận xóa
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Bạn có chắc muốn xóa đại lý <span className="font-bold text-gray-900 dark:text-white">{confirmDelete?.name}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác và dữ liệu sẽ bị mất vĩnh viễn.
          </p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default DealerManagement;