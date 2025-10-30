import React, { useState } from "react";

/* ====== Hàm định dạng ngày ====== */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("vi-VN"); // hiển thị dd/mm/yyyy
};

/* ====== Mock Data ====== */
const mockUsers = [
  {
    user_id: "U001",
    full_name: "Nguyễn Minh Anh",
    username: "minhanh",
    password: "123456",
    email: "minh.anh@example.com",
    role: "Admin",
    dealer: "DL001",
    created_at: "2025-09-01",
    updated_at: "2025-10-10",
    status: "Active",
  },
  {
    user_id: "U002",
    full_name: "Trần Bảo",
    username: "tranbao",
    password: "abc123",
    email: "tran.bao@example.com",
    role: "Manager",
    dealer: "DL002",
    created_at: "2025-09-10",
    updated_at: "2025-10-15",
    status: "Active",
  },
  {
    user_id: "U003",
    full_name: "Lê Kiên",
    username: "lekien",
    password: "kien789",
    email: "le.kien@example.com",
    role: "Staff",
    dealer: "DL005",
    created_at: "2025-10-02",
    updated_at: "2025-10-20",
    status: "Inactive",
  },
  {
    user_id: "U004",
    full_name: "Phạm Trí",
    username: "phamtri",
    password: "tri123",
    email: "pham.tri@example.com",
    role: "Staff",
    dealer: "DL008",
    created_at: "2025-10-10",
    updated_at: "2025-10-23",
    status: "Active",
  },
  {
    user_id: "U005",
    full_name: "Bảo Long",
    username: "admin01",
    password: "admin123",
    email: "baolong@gmail.com",
    role: "Admin",
    dealer: "DL001",
    created_at: "2025-09-01",
    updated_at: "2025-10-10",
    status: "Active",
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(
    [...mockUsers].sort((a, b) => a.user_id.localeCompare(b.user_id))
  );
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ====== Create / Edit / Delete ====== */
  const openCreate = () => {
    setIsEdit(false);
    setForm({
      user_id: `U${String(users.length + 1).padStart(3, "0")}`,
      full_name: "",
      username: "",
      password: "",
      email: "",
      role: "Staff",
      dealer: "",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      status: "Active",
    });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setIsEdit(true);
    setForm({ ...user });
    setShowModal(true);
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (isEdit) {
      setUsers((prev) =>
        prev
          .map((u) => (u.user_id === form.user_id ? form : u))
          .sort((a, b) => a.user_id.localeCompare(b.user_id))
      );
    } else {
      setUsers((prev) =>
        [...prev, form].sort((a, b) => a.user_id.localeCompare(b.user_id))
      );
    }
    setShowModal(false);
  };

  const askDelete = (user) => setConfirmDelete(user);
  const doDelete = () => {
    setUsers((prev) => prev.filter((u) => u.user_id !== confirmDelete.user_id));
    setConfirmDelete(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">👤 Quản lý người dùng</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 font-semibold shadow-lg hover:brightness-105"
        >
          + Thêm người dùng
        </button>
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full text-sm md:text-base border-collapse">
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
            {users.map((u) => (
              <tr
                key={u.user_id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3">{u.user_id}</td>
                <td className="p-3">{u.full_name}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.password}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.dealer}</td>
                <td className="p-3">{formatDate(u.created_at)}</td>
                <td className="p-3">{formatDate(u.updated_at)}</td>
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
                    onClick={() => openEdit(u)}
                    className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => askDelete(u)}
                    className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white"
                  >
                    Xoá
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

      {/* ===== Modal Thêm / Sửa ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_120px_rgba(2,6,23,.8)] p-6 space-y-4"
          >
            <h3 className="text-xl font-bold mb-2">
              {isEdit ? "Cập nhật người dùng" : "Thêm người dùng"}
            </h3>

            <form onSubmit={saveUser} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(form).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-slate-300 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type={
                      key === "password"
                        ? "password"
                        : key === "created_at" || key === "updated_at"
                        ? "date"
                        : "text"
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-slate-100"
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    disabled={key === "user_id"}
                  />
                </div>
              ))}

              <div className="col-span-full flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:brightness-105"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Xác nhận xoá ===== */}
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
              Bạn có chắc muốn xoá <b>{confirmDelete.full_name}</b>?
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-800">
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
