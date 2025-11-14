import React, { useState, useMemo, useEffect, useCallback } from "react";
import AdminService from "../../../utils/api/services/admin.service";
import UserModal from "../components/modals/UserModal";

const UserManagement = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- API CALLS ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllUsers();
      // Sắp xếp mảng data nhận về theo userId tăng dần
      const sortedData = response.data.sort((a, b) => a.userId - b.userId);
      setUsers(sortedData); // Sử dụng dữ liệu đã sắp xếp
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- LOGIC XỬ LÝ SỰ KIỆN ---
  const openCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (editingUser) { // --- CHẾ ĐỘ SỬA ---
        const updateData = {
          roleId: parseInt(formData.roleId),
          dealerId: formData.dealerId ? parseInt(formData.dealerId) : null,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth || null, 
        };
        await AdminService.updateUser(editingUser.userId, updateData);
      } else { // --- CHẾ ĐỘ TẠO MỚI ---
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
      }
      setShowModal(false);
      fetchUsers(); // Tải lại danh sách (đã được sắp xếp)
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi không xác định.";
      alert(`Lỗi: ${errorMessage} (Vui lòng kiểm tra lại thông tin, Username hoặc Email có thể đã tồn tại).`);
    }
  };

  const toggleActive = async (user) => {
    // Sử dụng 'active'/'inactive' (chữ thường)
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const friendlyNewStatus = newStatus === 'active' ? 'Hoạt động' : 'Ngưng hoạt động';

    if (window.confirm(`Bạn có chắc muốn chuyển trạng thái của người dùng "${user.username}" thành "${friendlyNewStatus}"?`)) {
      try {
        await AdminService.changeUserStatus(user.userId, { status: newStatus });
        fetchUsers(); // Tải lại danh sách (đã được sắp xếp)
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
        alert("Đã xảy ra lỗi khi thay đổi trạng thái.");
      }
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const k = keyword.trim().toLowerCase();
      
      // Tìm kiếm theo ID gốc (String) và SĐT
      const byKey = !k || [
        u.username, 
        u.fullName, 
        u.email, 
        u.phoneNumber,
        String(u.userId) // Tìm ID gốc
      ].some(v => v?.toLowerCase().includes(k));
      
      const byRole = roleFilter === "ALL" || u.roleName === roleFilter;
      // Lọc theo trạng thái chữ thường
      const byStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? u.status === 'active' : u.status === 'inactive');
      
      return byKey && byRole && byStatus;
    });
  }, [users, keyword, roleFilter, statusFilter]);

  return (
    <div className="space-y-4 p-4 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold leading-normal py-2">Quản lý người dùng</h1>
        <button
          className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 font-semibold shadow-lg hover:brightness-105"
          onClick={openCreate}
        >
          + Thêm người dùng
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-2">
        <input
          className="min-w-[220px] flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
          placeholder="Tìm theo tên, email, SĐT, ID…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option>Admin</option>
          <option>EVM Staff</option>
          <option>Dealer Manager</option>
          <option>Dealer Staff</option>
        </select>
        <select
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang kích hoạt</option>
          <option value="INACTIVE">Đang vô hiệu</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-slate-800/60 text-sky-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Họ và tên</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Ngày sinh</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="p-4 text-center">Đang tải dữ liệu người dùng...</td></tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.userId} className="border-t border-slate-800 hover:bg-slate-800/30">
                  
                  {/* Hiển thị ID gốc */}
                  <td className="p-3">{u.userId}</td>
                  
                  <td className="p-3 font-medium">{u.fullName}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phoneNumber || 'N/A'}</td>
                  <td className="p-3">{u.dateOfBirth || 'N/A'}</td>
                  <td className="p-3">{u.roleName}</td>
                  <td className="p-3">{u.dealerName || 'N/A'}</td>
                  
                  {/* Hiển thị trạng thái (chữ thường) */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                      {u.status === 'active' ? "Hoạt động" : "Ngưng"}
                    </span>
                  </td>
                  
                  {/* Nút hành động (chữ thường) */}
                  <td className="p-3 text-center space-x-2">
                    <button
                      className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                      onClick={() => openEdit(u)}
                    >
                      Sửa
                    </button>
                    <button
                      className={`px-2 py-1 rounded-lg ${u.status === 'active' ? "bg-slate-700 hover:bg-slate-600" : "bg-emerald-600/40 hover:bg-emerald-600"}`}
                      onClick={() => toggleActive(u)}
                    >
                      {u.status === 'active' ? "Tắt" : "Bật"}
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filteredUsers.length === 0 && (
                <tr><td colSpan="10" className="p-4 text-center text-slate-500">Không tìm thấy người dùng nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal 
          user={editingUser} 
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserManagement;