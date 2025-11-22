import React, { useState, useMemo } from "react";
import { 
  Plus, Search, ChevronDown, X, Building2, 
  MapPin, Phone, Edit, Trash2, Power, AlertCircle 
} from "lucide-react";

// Dữ liệu mẫu giữ nguyên
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
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) return alert("Vui lòng điền đủ thông tin.");
    if (isEdit) setDealers((prev) => prev.map((d) => (d.id === form.id ? { ...form } : d)));
    else setDealers((prev) => [...prev, form]);
    setShowModal(false);
  };
  const toggleActive = (id) => setDealers((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  const doDelete = () => { setDealers((prev) => prev.filter((d) => d.id !== confirmDelete.id)); setConfirmDelete(null); };

  const regions = useMemo(() => Array.from(new Set(dealers.map(d => d.region))), [dealers]);

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
             <Building2 className="w-9 h-9 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100 py-1">Quản lý Đại lý</h1>
            <p className="text-slate-400 text-base">Quản lý hệ thống phân phối và kho hàng</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition text-lg">
          <Plus className="w-6 h-6" /> Thêm đại lý
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="w-full bg-[#13233a] border-y border-slate-700 mb-12 shadow-2xl overflow-x-auto">
        <div className="flex items-center w-full h-auto md:h-24">
            {/* LABEL */}
            <div className="h-full flex items-center px-6 md:px-8 border-r border-slate-700/60 bg-[#1a2b44]/50 flex-none">
                <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
            </div>
            {/* SEARCH */}
            <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-slate-700/60 min-w-[250px] group cursor-text hover:bg-[#1a2b44]/20 transition" onClick={() => document.getElementById('search-dealer').focus()}>
                <span className="text-slate-300 font-semibold text-base mr-3 group-hover:text-white transition hidden sm:block">Search</span>
                <div className="relative flex-1">
                   <div className="flex items-center bg-[#0b1622] border border-slate-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                      <input id="search-dealer" type="text" placeholder="Tên, địa chỉ, SĐT..." value={filter.searchTerm} onChange={(e) => setFilter({...filter, searchTerm: e.target.value})} className="w-full bg-transparent border-none p-0 text-white placeholder:text-slate-500 focus:ring-0 text-base font-medium" />
                      {filter.searchTerm ? ( <button onClick={(e) => {e.stopPropagation(); setFilter({...filter, searchTerm: ''})}} className="text-slate-400 hover:text-white ml-2"><X className="w-5 h-5" /></button> ) : (<ChevronDown className="w-5 h-5 text-slate-500 ml-2" />)}
                   </div>
                </div>
            </div>
            {/* REGION */}
            <div className="h-full relative px-4 md:px-6 border-r border-slate-700/60 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                <span className="text-slate-300 text-base font-semibold mr-2 truncate">Khu vực</span>
                <select value={filter.region} onChange={(e) => setFilter({ ...filter, region: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <option value="" className="bg-slate-900 text-slate-100">Tất cả</option>
                    {regions.map((r) => (<option key={r} value={r} className="bg-slate-900 text-slate-100">{r}</option>))}
                </select>
                <ChevronDown className="ml-auto w-5 h-5 text-slate-400" />
                {filter.region && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.region}</span>}
            </div>
            {/* STATUS */}
            <div className="h-full relative px-4 md:px-6 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 text-base font-semibold truncate">Trạng thái</span>
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                    <option value="" className="bg-slate-900 text-slate-100">Tất cả</option>
                    <option value="Active" className="bg-slate-900 text-slate-100">Hoạt động</option>
                    <option value="Inactive" className="bg-slate-900 text-slate-100">Ngưng</option>
                </select>
                <div className="w-12 h-12 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/40 flex items-center justify-center ml-4 z-0 flex-none"><span className="text-white font-bold text-sm">New</span></div>
                {filter.status && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.status === 'Active' ? 'Hoạt động' : 'Ngưng'}</span>}
            </div>
        </div>
      </div>

      {/* --- TABLE DATA (ĐÃ TĂNG CỠ CHỮ) --- */}
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#13233a] shadow-xl">
        <table className="w-full text-left text-slate-300">
          {/* Header to hơn */}
          <thead className="bg-[#1a2b44] text-slate-100 text-base uppercase font-bold tracking-wider border-b border-slate-700">
            <tr>
              <th className="px-8 py-6">Đại lý</th>
              <th className="px-8 py-6">Liên hệ</th>
              <th className="px-8 py-6">Khu vực</th>
              <th className="px-8 py-6 text-center">Mức tồn kho</th>
              <th className="px-8 py-6">Trạng thái</th>
              <th className="px-8 py-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredDealers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/50 transition duration-150">
                <td className="px-8 py-6">
                    {/* Tên Đại Lý: Text XL */}
                    <div className="font-bold text-xl text-white mb-2">{d.name}</div>
                    <div className="flex items-center text-sm text-slate-400 gap-2">
                        <span className="bg-slate-700 px-2 py-0.5 rounded text-sm font-medium">ID: {d.id}</span>
                    </div>
                </td>
                <td className="px-8 py-6 space-y-2">
                    {/* Liên hệ: Text Base + Icon to hơn */}
                    <div className="flex items-center gap-3 text-base text-slate-300">
                        <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" /> 
                        <span className="line-clamp-1">{d.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-slate-300">
                        <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" /> {d.phone}
                    </div>
                </td>
                <td className="px-8 py-6">
                    {/* Khu vực: Text Base */}
                    <span className="px-4 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600 text-base font-medium text-slate-200">
                        {d.region}
                    </span>
                </td>
                <td className="px-8 py-6 text-center">
                    {/* Tồn kho: Text 2XL */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-cyan-400">{d.safetyStockLevel}</span>
                        <span className="text-sm text-slate-500 font-medium">xe</span>
                    </div>
                </td>
                <td className="px-8 py-6">
                  {/* Trạng thái: Text Base */}
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold border ${
                    d.active 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${d.active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                    {d.active ? "Hoạt động" : "Ngưng"}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => toggleActive(d.id)} title={d.active ? "Tắt" : "Bật"} className={`p-2.5 rounded-xl border transition ${d.active ? "border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white" : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"}`}>
                        <Power className="w-5 h-5" />
                    </button>
                    <button onClick={() => openEdit(d)} title="Sửa" className="p-2.5 rounded-xl border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition">
                        <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => setConfirmDelete(d)} title="Xóa" className="p-2.5 rounded-xl border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition">
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDealers.length === 0 && (
                <tr>
                    <td colSpan="6" className="px-8 py-16 text-center text-slate-500 italic text-lg">
                        Không tìm thấy đại lý nào phù hợp.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-[#0b1622] shadow-2xl p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
                      <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{isEdit ? "Cập nhật Đại lý" : "Thêm Đại lý mới"}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={saveDealer} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Tên đại lý</label>
                    <input className="w-full rounded-xl border border-slate-700 bg-[#0f1b2e] px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên đại lý..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Địa chỉ</label>
                    <input className="w-full rounded-xl border border-slate-700 bg-[#0f1b2e] px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Địa chỉ chi tiết..." />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Số điện thoại</label>
                    <input className="w-full rounded-xl border border-slate-700 bg-[#0f1b2e] px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Khu vực</label>
                    <select className="w-full rounded-xl border border-slate-700 bg-[#0f1b2e] px-4 py-3 text-white focus:border-blue-500 outline-none transition" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                      <option>Miền Bắc</option><option>Miền Trung</option><option>Miền Nam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Mức tồn an toàn</label>
                    <input type="number" className="w-full rounded-xl border border-slate-700 bg-[#0f1b2e] px-4 py-3 text-white focus:border-blue-500 outline-none transition" value={form.safetyStockLevel} onChange={(e) => setForm({ ...form, safetyStockLevel: Number(e.target.value) })} />
                  </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
                <button type="button" className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition font-medium" onClick={() => setShowModal(false)}>Huỷ</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0b1622] shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-white mb-2">Xác nhận xoá</h3>
            <p className="text-slate-400 mb-6">Bạn có chắc muốn xoá đại lý <b className="text-white">{confirmDelete.name}</b>? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition">Huỷ bỏ</button>
              <button onClick={doDelete} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition">Xác nhận xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;