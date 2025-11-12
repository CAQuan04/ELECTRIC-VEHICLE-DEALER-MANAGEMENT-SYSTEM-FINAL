// File: src/features/admin/pages/UserManagement.jsx
import React, { useState, useMemo } from "react";

/* ========== Mock data ========== */
const initialUsers = [
  {
    id: "U001",
    name: "Nguyễn Minh Anh",
    username: "minhanh",
    password: "123456",
    email: "minh.anh@example.com",
    role: "Admin",
    dealer: "DL001",
    active: true,
    createdAt: "2025-09-01",
    updatedAt: "2025-10-10",
  },
  {
    id: "U002",
    name: "Trần Bảo",
    username: "tranbao",
    password: "abc123",
    email: "tran.bao@example.com",
    role: "Dealer Manager",
    dealer: "DL002",
    active: true,
    createdAt: "2025-09-10",
    updatedAt: "2025-10-15",
  },
  {
    id: "U003",
    name: "Lê Kiên",
    username: "lekien",
    password: "kien789",
    email: "le.kien@example.com",
    role: "EVM Staff",
    dealer: "DL005",
    active: false,
    createdAt: "2025-10-02",
    updatedAt: "2025-10-20",
  },
  {
    id: "U004",
    name: "Phạm Trí",
    username: "phamtri",
    password: "tri123",
    email: "pham.tri@example.com",
    role: "Dealer Staff",
    dealer: "DL008",
    active: true,
    createdAt: "2025-10-10",
    updatedAt: "2025-10-23",
  },
];

const emptyForm = {
  id: "",
  name: "",
  username: "",
  password: "",
  email: "",
  role: "Staff",
  dealer: "",
  active: true,
  createdAt: "",
  updatedAt: "",
};

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const k = keyword.trim().toLowerCase();
      const byKey =
        !k ||
        [u.name, u.email, u.id].some((v) =>
          String(v).toLowerCase().includes(k)
        );
      const byRole = roleFilter === "ALL" || u.role === roleFilter;
      const byStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? u.active : !u.active);
      return byKey && byRole && byStatus;
    });
  }, [users, keyword, roleFilter, statusFilter]);

  const genId = () => {
    const num =
      Math.max(0, ...users.map((u) => Number(u.id.replace("U", "")))) + 1;
    return `U${String(num).padStart(3, "0")}`;
  };
  const isValidEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  const openCreate = () => {
    setIsEdit(false);
    setForm({ ...emptyForm, id: genId() });
    setShowModal(true);
  };
  const openEdit = (u) => {
    setIsEdit(true);
    setForm({ ...u });
    setShowModal(true);
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Vui lòng nhập họ tên.");
    if (!form.username.trim()) return alert("Vui lòng nhập username.");
    if (!form.password.trim()) return alert("Vui lòng nhập mật khẩu.");
    if (!isValidEmail(form.email)) return alert("Email không hợp lệ.");

    const now = new Date().toISOString().slice(0, 10);

    if (isEdit) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === form.id ? { ...u, ...form, updatedAt: now } : u
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        { ...form, createdAt: now, updatedAt: now },
      ]);
    }
    setShowModal(false);
    setForm(emptyForm);
  };

  const toggleActive = (id) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  const askDelete = (u) => setConfirmDelete(u);
  const doDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-base">Quản lý người dùng</h1>
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
          placeholder="Tìm theo tên, email, ID…"
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
        <table className="min-w-full border-collapse text-base md:text-base">
          <thead className="bg-slate-800/60 text-sky-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Họ và tên</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Mật khẩu</th>
              <th className="p-3 text-left">Gmail</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-left">Ngày cập nhật</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.password}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.dealer}</td>
                <td className="p-3">{u.createdAt}</td>
                <td className="p-3">{u.updatedAt}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.active
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {u.active ? "Hoạt động" : "Ngưng"}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                    onClick={() => openEdit(u)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white"
                    onClick={() => askDelete(u)}
                  >
                    Xóa
                  </button>
                  <button
                    className={`px-2 py-1 rounded-lg ${
                      u.active
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-emerald-600/40 hover:bg-emerald-600"
                    }`}
                    onClick={() => toggleActive(u.id)}
                  >
                    {u.active ? "Tắt" : "Bật"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_120px_rgba(2,6,23,.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">
                {isEdit ? "Cập nhật người dùng" : "Thêm người dùng"}
              </h3>
              <button
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveUser} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-base text-slate-300">ID</label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.id}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Họ và tên
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Username
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required={!isEdit}
                    placeholder={isEdit ? "Giữ nguyên nếu không đổi" : ""}
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Vai trò
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  >
                    <option>Admin</option>
                    <option>EVM Staff</option>
                    <option>Dealer Manager</option>
                    <option>Dealer Staff</option>
                    <option>Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-base text-slate-300">Đại lý</label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                    value={form.dealer}
                    onChange={(e) =>
                      setForm({ ...form, dealer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Trạng thái
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-sky-500"
                      checked={form.active}
                      onChange={() =>
                        setForm({ ...form, active: !form.falsed })
                      }
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div>
                  <label className="text-base text-slate-300">
                    Ngày tạo
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-slate-200"
                    value={form.createdAt || ""}
                    onChange={(e) =>
                      setForm({ ...form, createdAt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-base text-slate-300">
                    Cập nhật gần nhất
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-slate-200"
                    value={form.updatedAt || ""}
                    onChange={(e) =>
                      setForm({ ...form, updatedAt: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
                  onClick={() => setShowModal(false)}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:brightness-105"
                >
                  {isEdit ? "Lưu thay đổi" : "Tạo người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_120px_rgba(2,6,23,.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">Xoá người dùng</h3>
            </div>
            <div className="px-5 py-4 text-slate-200">
              Bạn có chắc muốn xoá <b>{confirmDelete.name}</b> (
              {confirmDelete.email})?
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
              <button
                className="px-4 py-2 rounded-xl border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
                onClick={() => setConfirmDelete(null)}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200 hover:bg-rose-600/15"
                onClick={doDelete}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;