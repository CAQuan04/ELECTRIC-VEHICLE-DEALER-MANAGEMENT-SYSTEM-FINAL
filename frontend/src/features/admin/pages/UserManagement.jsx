import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Plus, Search, Users, Mail, Phone, Calendar, 
  Edit, Power, Shield, Building2, AlertCircle,
  X, ChevronDown // Import thêm icon cho thanh Filter cũ
} from "lucide-react";

// Import Services
import AdminService from "../../../utils/api/services/admin.service";

// Import Layout & UI Components
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { FormGroup, Label, Input, Select } from '../components/ui/FormComponents';

// ==========================================
// MAIN PAGE LOGIC (UserManagement)
// ==========================================

const emptyUser = { 
  username: "", password: "", fullName: "", email: "", 
  phoneNumber: "", dateOfBirth: "", roleId: "2", dealerId: "", status: "active" 
};

const UserManagement = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ searchTerm: "", role: "", status: "" });
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [confirmAction, setConfirmAction] = useState(null);

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

  // --- ACTIONS ---
  const openCreate = () => { 
    setForm(emptyUser); 
    setIsEdit(false); 
    setShowModal(true); 
  };

  const openEdit = (user) => { 
    setForm({
      ...user,
      password: "",
      roleId: user.roleId || "2",
      dealerId: user.dealerId || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ""
    });
    setEditingUserId(user.userId);
    setIsEdit(true); 
    setShowModal(true); 
  };

  const handleSaveUser = async () => {
    try {
      if (!form.username || !form.fullName || !form.email) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      if (isEdit) { 
        const updateData = {
          roleId: parseInt(form.roleId),
          dealerId: form.dealerId ? parseInt(form.dealerId) : null,
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          dateOfBirth: form.dateOfBirth || null, 
        };
        await AdminService.updateUser(editingUserId, updateData);
      } else { 
        const createData = {
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          dateOfBirth: form.dateOfBirth || null,
          roleId: parseInt(form.roleId),
          dealerId: form.dealerId ? parseInt(form.dealerId) : null,
        };
        await AdminService.createUser(createData);
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(`Lỗi: ${error.response?.data?.message || "Đã xảy ra lỗi."}`);
    }
  };

  const confirmToggleStatus = (user) => {
    setConfirmAction({
      type: 'status',
      data: user,
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn có chắc muốn ${user.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản "${user.username}"?`
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'status') {
      const user = confirmAction.data;
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      try {
        await AdminService.changeUserStatus(user.userId, { status: newStatus });
        setUsers(prevUsers => prevUsers.map(u => 
            u.userId === user.userId ? { ...u, status: newStatus } : u
        ));
      } catch (error) { 
        alert("Lỗi khi thay đổi trạng thái."); 
        fetchUsers();
      }
    }
    setConfirmAction(null);
  };

  const formRoleOptions = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Dealer Manager" },
    { value: "3", label: "Staff" },
    { value: "4", label: "Customer" }
  ];

  return (
    <PageContainer>
      {/* 1. HEADER */}
      <PageHeader
        title="Quản lý Người dùng"
        subtitle="Tài khoản & Phân quyền"
        description="Quản lý danh sách người dùng, cập nhật thông tin cá nhân và kiểm soát quyền truy cập hệ thống."
        icon={<Users />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Người dùng", path: "/users" }
        ]}
        actions={
          <Button 
            variant="primary" 
            size="lg" 
            icon={<Plus className="w-5 h-5" />} 
            onClick={openCreate}
          >
            Thêm người dùng
          </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* 2. FILTER BAR (GIỮ LẠI GIAO DIỆN CŨ CỦA BẠN) */}
        <div className="w-full bg-[#13233a] border-y border-slate-700 mb-12 shadow-2xl overflow-x-auto rounded-lg">
          <div className="flex items-center w-full h-auto md:h-24">
              {/* Filter Label */}
              <div className="h-full flex items-center px-6 md:px-8 border-r border-slate-700/60 bg-[#1a2b44]/50 flex-none">
                  <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
              </div>
              
              {/* Search */}
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
              {/* Role Filter */}
              <div className="h-full relative px-4 md:px-6 border-r border-slate-700/60 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                  <span className="text-slate-300 text-base font-semibold mr-2 truncate">Vai trò</span>
                  <select 
                    value={filter.role} 
                    onChange={(e) => setFilter({ ...filter, role: e.target.value })} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-100">Tất cả</option>
                    {roles.map((r) => (<option key={r} value={r} className="bg-slate-900 text-slate-100">{r}</option>))}
                  </select>
                  <ChevronDown className="ml-auto w-5 h-5 text-slate-400" />
                  {filter.role && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.role}</span>}
              </div>
              
              {/* Status Filter */}
              <div className="h-full relative px-4 md:px-6 flex-1 min-w-[180px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 text-base font-semibold truncate">Trạng thái</span>
                  <select 
                    value={filter.status} 
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  >
                    <option value="" className="bg-slate-900 text-slate-100">Tất cả</option>
                    <option value="Active" className="bg-slate-900 text-slate-100">Hoạt động</option>
                    <option value="Inactive" className="bg-slate-900 text-slate-100">Ngưng</option>
                  </select>
                  {filter.status && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.status === 'Active' ? 'Hoạt động' : 'Ngưng'}</span>}
              </div>
          </div>
        </div>

        {/* 3. TABLE DATA (GIỮ NGUYÊN BẢN MỚI CHO GỌN) */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                  <th className="px-8 py-6">Người dùng</th>
                  <th className="px-8 py-6">Tài khoản</th>
                  <th className="px-8 py-6">Liên hệ</th>
                  <th className="px-8 py-6">Vai trò / Đơn vị</th>
                  <th className="px-8 py-6">Trạng thái</th>
                  <th className="px-8 py-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {loading ? (
                  <tr><td colSpan="6" className="px-8 py-16 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.userId} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30 transition-colors duration-200 group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {u.fullName}
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          ID: {u.userId}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-cyan-600 dark:text-cyan-400 font-bold border border-gray-200 dark:border-gray-700">
                           {u.username}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" /> 
                              <span className="truncate max-w-[180px]" title={u.email}>{u.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 
                              {u.phoneNumber || '---'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Shield className="w-4 h-4 text-purple-500" />
                                {u.roleName}
                            </div>
                            {u.dealerName && (
                                <div className="text-xs text-gray-500 ml-6 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> {u.dealerName}
                                </div>
                            )}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                          {u.status === 'active' ? "Hoạt động" : "Ngưng"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={u.status === 'active' ? "text-gray-400 hover:text-red-500" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"}
                            onClick={() => confirmToggleStatus(u)}
                            title={u.status === 'active' ? "Vô hiệu hóa" : "Kích hoạt"}
                          >
                            <Power className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEdit(u)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
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
                        title="Không tìm thấy người dùng"
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

      {/* 4. MODAL ADD/EDIT USER */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              {isEdit ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormGroup>
               <Label required>Tên đăng nhập</Label>
               <Input 
                 disabled={isEdit}
                 placeholder="username" 
                 value={form.username} 
                 onChange={(e) => setForm({ ...form, username: e.target.value })} 
                 className={isEdit ? "opacity-60 cursor-not-allowed" : ""}
               />
             </FormGroup>
             {!isEdit && (
                <FormGroup>
                  <Label required>Mật khẩu</Label>
                  <Input 
                    type="password"
                    placeholder="********" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  />
                </FormGroup>
             )}
          </div>

          <FormGroup>
            <Label required>Họ và tên</Label>
            <Input 
              placeholder="Nguyễn Văn A" 
              value={form.fullName} 
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
            />
          </FormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup>
              <Label required>Email</Label>
              <Input 
                type="email"
                placeholder="example@mail.com" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </FormGroup>

            <FormGroup>
              <Label>Số điện thoại</Label>
              <Input 
                placeholder="09xxxxxxxx" 
                value={form.phoneNumber} 
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} 
              />
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormGroup>
               <Label>Ngày sinh</Label>
               <Input 
                 type="date"
                 value={form.dateOfBirth} 
                 onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} 
               />
             </FormGroup>
             <FormGroup>
               <Label>Vai trò</Label>
               <Select 
                 options={formRoleOptions}
                 value={form.roleId}
                 onChange={(e) => setForm({ ...form, roleId: e.target.value })}
               />
             </FormGroup>
          </div>
          
          <FormGroup>
            <Label>Mã Đại Lý (Dealer ID)</Label>
            <Input 
               type="number"
               placeholder="Nhập ID đại lý (nếu có)"
               value={form.dealerId}
               onChange={(e) => setForm({ ...form, dealerId: e.target.value })}
            />
          </FormGroup>
        </div>
      </Modal>

      {/* 5. MODAL CONFIRM ACTION */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.title || "Xác nhận"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>
              Hủy bỏ
            </Button>
            <Button variant="danger" onClick={handleConfirmAction}>
              Xác nhận
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {confirmAction?.message}
          </p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default UserManagement;