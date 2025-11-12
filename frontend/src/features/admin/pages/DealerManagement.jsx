import React, { useState, useMemo } from "react";

const initialDealers = [
  {
    id: "DL001",
    name: "VinFast Thăng Long",
    address: "Số 1 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    phone: "0912345678",
    safetyStockLevel: 10,
    active: true,
  },
  {
    id: "DL002",
    name: "VinFast Sài Gòn",
    address: "Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0987654321",
    safetyStockLevel: 5,
    active: true,
  },
  {
    id: "DL003",
    name: "Đại lý Sài Gòn",
    address: "456 Nguyễn Huệ, TP.HCM",
    phone: "0987654321",
    safetyStockLevel: 5,
    active: true,
  },
  {
    id: "DL004",
    name: "Đại lý A - Hà Nội",
    address: "55 Tràng Tiền, Hà Nội",
    phone: "02411112222",
    safetyStockLevel: 5,
    active: true,
  },
  {
    id: "DL005",
    name: "Đại lý B - TPHCM",
    address: "22 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "02833334444",
    safetyStockLevel: 5,
    active: true,
  },
];

const emptyDealer = {
  id: "",
  username: "",
  password: "",
  address: "",
  email: "",
  role: "Dealer Staff",
  active: true,
};

const DealerManagement = () => {
  const [dealers, setDealers] = useState(initialDealers);
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyDealer);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredDealers = useMemo(() => {
    return dealers.filter((d) =>
      [d.username, d.address, d.id, d.email].some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [dealers, keyword]);

  const genId = () => {
    const next =
      Math.max(0, ...dealers.map((d) => Number(d.id.replace("DL", "")))) + 1;
    return `DL${String(next).padStart(3, "0")}`;
  };

  const openCreate = () => {
    setForm({ ...emptyDealer, id: genId() });
    setIsEdit(false);
    setShowModal(true);
  };
  const openEdit = (d) => {
    setForm(d);
    setIsEdit(true);
    setShowModal(true);
  };

  const saveDealer = (e) => {
    e.preventDefault();
    if (!form.username.trim()) return alert("Username không được để trống.");
    if (!form.password.trim()) return alert("Password bắt buộc.");
    if (!form.address.trim()) return alert("Địa chỉ không được để trống.");
    if (!form.email.trim()) return alert("Email bắt buộc.");

    if (isEdit) {
      setDealers((prev) =>
        prev.map((d) => (d.id === form.id ? { ...form } : d))
      );
    } else {
      setDealers((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) =>
    setDealers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );

  const askDelete = (d) => setConfirmDelete(d);
  const doDelete = () => {
    setDealers((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Đại lý</h1>
        <button
          className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 font-semibold shadow-lg hover:brightness-105"
          onClick={openCreate}
        >
          + Thêm đại lý
        </button>
      </div>

      <input
        className="min-w-[240px] mb-4 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
        placeholder="Tìm kiếm theo tên, địa chỉ hoặc email..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
        <table className="min-w-full border-collapse text-base md:text-base">
          <thead className="bg-slate-800/60 text-sky-300">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên đại lý</th>
              <th className="p-3 text-left">Địa chỉ</th>
              <th className="p-3 text-left">Điện thoại</th>
              <th className="p-3 text-left">Mức tồn an toàn</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((d) => (
              <tr
                key={d.id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3">{d.id}</td>
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.address}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3 text-center">{d.safetyStockLevel}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      d.active
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {d.active ? "Hoạt động" : "Ngưng"}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                    onClick={() => openEdit(d)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white"
                    onClick={() => askDelete(d)}
                  >
                    Xóa
                  </button>
                  <button
                    className={`px-2 py-1 rounded-lg ${
                      d.active
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-emerald-600/40 hover:bg-emerald-600"
                    }`}
                    onClick={() => toggleActive(d.id)}
                  >
                    {d.active ? "Tắt" : "Bật"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa đại lý */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">
                {isEdit ? "Cập nhật Đại lý" : "Thêm Đại lý"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
              >
                ✕
              </button>
            </div>
            <form onSubmit={saveDealer} className="px-5 py-4 space-y-4">
              <div>
                <label className="text-base text-slate-300">ID</label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.id}
                  disabled
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Username</label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Địa chỉ</label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Vai trò</label>
                <select
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option>Dealer Staff</option>
                  <option>Dealer Manager</option>
                  <option>EVM Staff</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
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
                  {isEdit ? "Lưu" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Xác nhận xoá */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">Xoá Đại lý</h3>
            </div>
            <div className="px-5 py-4 text-slate-200">
              Bạn có chắc muốn xoá <b>{confirmDelete.username}</b> không?
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-800">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:border-sky-500/50 hover:bg-sky-500/10"
              >
                Huỷ
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200 hover:bg-rose-600/15"
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

export default DealerManagement;
