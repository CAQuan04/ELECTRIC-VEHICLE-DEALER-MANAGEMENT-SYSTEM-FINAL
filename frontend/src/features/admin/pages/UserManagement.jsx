import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Plus, Search, ChevronDown, X, Users, 
  Mail, Phone, Calendar, Edit, Power, Shield, Building2
} from "lucide-react";
import AdminService from "../../../utils/api/services/admin.service";
import UserModal from "../components/modals/UserModal";

const UserManagement = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ searchTerm: "", role: "", status: "" });
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- API CALLS ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllUsers();
      const sortedData = response.data.sort((a, b) => a.userId - b.userId);
      setUsers(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // --- EVENT HANDLERS ---
  const openCreate = () => { setEditingUser(null); setShowModal(true); };
  const openEdit = (user) => { setEditingUser(user); setShowModal(true); };

  const handleSaveUser = async (formData) => {
    try {
      if (editingUser) { 
        const updateData = {
          roleId: parseInt(formData.roleId),
          dealerId: formData.dealerId ? parseInt(formData.dealerId) : null,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth || null, 
        };
        await AdminService.updateUser(editingUser.userId, updateData);
        // Sau khi sửa xong, nên fetch lại để đảm bảo dữ liệu đúng nhất hoặc update state thủ công tương tự
        fetchUsers(); 
      } else { 
        const createData = {
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth || null,
          roleId: parseInt(formData.roleId),
          dealerId: formData.dealerId ? parseInt(formData.dealerId) : null,
        };
        await AdminService.createUser(createData);
        fetchUsers();
      }
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi:", error);
      alert(`Lỗi: ${error.response?.data?.message || "Đã xảy ra lỗi."}`);
    }
  };

  // --- FIX LỖI GIẬT TRANG TẠI ĐÂY ---
  const toggleActive = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    // Cập nhật UI "lạc quan" (Optimistic update) hoặc chờ API xong rồi update state cục bộ
    // Cách an toàn: Gọi API xong -> Update State Local -> Không gọi fetchUsers()
    
    if (window.confirm(`Chuyển trạng thái "${user.username}" thành "${newStatus === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'}"?`)) {
      try {
        await AdminService.changeUserStatus(user.userId, { status: newStatus });
        
        // FIX: Cập nhật trực tiếp state users thay vì gọi fetchUsers() gây loading
        setUsers(prevUsers => prevUsers.map(u => 
            u.userId === user.userId ? { ...u, status: newStatus } : u
        ));

      } catch (error) { 
        alert("Lỗi khi thay đổi trạng thái."); 
        // Nếu lỗi thì có thể revert lại hoặc fetch lại data để đồng bộ
        fetchUsers();
      }
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchSearch = !filter.searchTerm || [
        u.username, u.fullName, u.email, u.phoneNumber, String(u.userId)
      ].some(v => v?.toLowerCase().includes(filter.searchTerm.toLowerCase()));
      
      const matchRole = !filter.role || u.roleName === filter.role;
      const matchStatus = !filter.status || (filter.status === "Active" ? u.status === 'active' : u.status === 'inactive');
      
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, filter]);

  const roles = useMemo(() => Array.from(new Set(users.map(u => u.roleName).filter(Boolean))), [users]);

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
             <Users className="w-9 h-9 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100 py-1">Quản lý người dùng</h1>
            <p className="text-slate-400 text-base">Quản lý tài khoản và phân quyền hệ thống</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition text-lg"
          onClick={openCreate}
        >
          <Plus className="w-6 h-6" /> Thêm người dùng
        </button>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="w-full bg-[#13233a] border-y border-slate-700 mb-12 shadow-2xl overflow-x-auto">
        <div className="flex items-center w-full h-auto md:h-24">
            {/* Filter Label */}
            <div className="h-full flex items-center px-6 md:px-8 border-r border-slate-700/60 bg-[#1a2b44]/50 flex-none">
                <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
            </div>
            {/* Search */}
            <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-slate-700/60 min-w-[280px] group cursor-text hover:bg-[#1a2b44]/20 transition" onClick={() => document.getElementById('search-user').focus()}>
                <span className="text-slate-300 font-semibold text-base mr-3 group-hover:text-white transition hidden sm:block">Search</span>
                <div className="relative flex-1">
                   <div className="flex items-center bg-[#0b1622] border border-slate-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                      <input id="search-user" type="text" placeholder="Tên, email, SĐT..." value={filter.searchTerm} onChange={(e) => setFilter({...filter, searchTerm: e.target.value})} className="w-full bg-transparent border-none p-0 text-white placeholder:text-slate-500 focus:ring-0 text-base font-medium" />
                      {filter.searchTerm ? ( <button onClick={(e) => {e.stopPropagation(); setFilter({...filter, searchTerm: ''})}} className="text-slate-400 hover:text-white ml-2"><X className="w-5 h-5" /></button> ) : (<ChevronDown className="w-5 h-5 text-slate-500 ml-2" />)}
                   </div>
                </div>
            </div>
            {/* Role Filter */}
            <div className="h-full relative px-4 md:px-6 border-r border-slate-700/60 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                <span className="text-slate-300 text-base font-semibold mr-2 truncate">Vai trò</span>
                <select value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  <option value="" className="bg-slate-900 text-slate-100">Tất cả</option>
                  {roles.map((r) => (<option key={r} value={r} className="bg-slate-900 text-slate-100">{r}</option>))}
                </select>
                <ChevronDown className="ml-auto w-5 h-5 text-slate-400" />
                {filter.role && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.role}</span>}
            </div>
            {/* Status Filter */}
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

      {/* --- TABLE DATA --- */}
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#13233a] shadow-xl">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-[#1a2b44] text-slate-100 text-base uppercase font-bold tracking-wider border-b border-slate-700">
            <tr>
              <th className="px-8 py-6">Họ và tên</th>
              <th className="px-8 py-6">Username</th>
              <th className="px-8 py-6">Thông tin liên hệ</th>
              <th className="px-8 py-6">Vai trò / Đơn vị</th>
              <th className="px-8 py-6">Ngày sinh</th>
              <th className="px-8 py-6">Trạng thái</th>
              <th className="px-8 py-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan="7" className="px-8 py-16 text-center text-slate-400 text-lg">Đang tải dữ liệu...</td></tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-800/50 transition duration-150">
                  <td className="px-8 py-6">
                    <div className="font-bold text-xl text-white mb-2">{u.fullName}</div>
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-sm font-medium text-slate-300">ID: {u.userId}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="bg-slate-700/50 border border-slate-600 px-3 py-1.5 rounded-lg text-base font-bold text-sky-400">
                        {u.username}
                     </span>
                  </td>
                  <td className="px-8 py-6 space-y-2">
                    <div className="flex items-center gap-3 text-base text-slate-300">
                        <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" /> 
                        <span className="truncate max-w-[200px]" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-slate-300">
                        <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" /> {u.phoneNumber || '---'}
                    </div>
                  </td>
                  <td className="px-8 py-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <span className="text-base font-medium text-slate-200">{u.roleName}</span>
                    </div>
                    {u.dealerName && (
                        <div className="text-sm text-slate-400 ml-7 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {u.dealerName}
                        </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-base text-slate-300">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        {u.dateOfBirth || '---'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold border ${
                      u.status === 'active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${u.status === 'active' ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      {u.status === 'active' ? "Hoạt động" : "Ngưng"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => toggleActive(u)} title={u.status === 'active' ? "Vô hiệu hóa" : "Kích hoạt"} className={`p-2.5 rounded-xl border transition ${u.status === 'active' ? "border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white" : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"}`}>
                        <Power className="w-5 h-5" />
                      </button>
                      <button onClick={() => openEdit(u)} title="Chỉnh sửa thông tin" className="p-2.5 rounded-xl border border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition">
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!loading && filteredUsers.length === 0 && (
                <tr><td colSpan="7" className="px-8 py-16 text-center text-slate-500 italic text-lg">Không tìm thấy người dùng nào phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && <UserModal user={editingUser} onClose={() => setShowModal(false)} onSave={handleSaveUser} />}
    </div>
  );
};

export default UserManagement;