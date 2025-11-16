import React, { useState, useMemo } from "react";

const initialDealers = [
  {
    id: 1, // Đã đổi thành số
    name: "VinFast Thăng Long",
    address: "Số 1 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    phone: "0912345678",
    safetyStockLevel: 10,
    active: true,
    region: "Miền Bắc",
  },
  {
    id: 2,
    name: "VinFast Sài Gòn",
    address: "Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0987654321",
    safetyStockLevel: 5,
    active: true,
    region: "Miền Nam",
  },
  {
    id: 3,
    name: "Đại lý Sài Gòn",
    address: "456 Nguyễn Huệ, TP.HCM",
    phone: "0987654321",
    safetyStockLevel: 5,
    active: true,
    region: "Miền Nam",
  },
  {
    id: 4,
    name: "Đại lý A - Hà Nội",
    address: "55 Tràng Tiền, Hà Nội",
    phone: "02411112222",
    safetyStockLevel: 5,
    active: true,
    region: "Miền Bắc",
  },
  {
    id: 5,
    name: "Đại lý B - TPHCM",
    address: "22 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "02833334444",
    safetyStockLevel: 5,
    active: true,
    region: "Miền Nam",
  },
];

const emptyDealer = {
  id: "",
  name: "",
  address: "",
  phone: "",
  safetyStockLevel: 5,
  region: "Miền Bắc",
  active: true,
};

const DealerManagement = () => {
  const [dealers, setDealers] = useState(initialDealers);
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyDealer);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Logic lọc và SẮP XẾP
  const filteredDealers = useMemo(() => {
    const result = dealers.filter((d) =>
      [d.name, d.address, d.id, d.phone, d.region].some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
    // Sắp xếp ID từ thấp đến cao
    return result.sort((a, b) => a.id - b.id);
  }, [dealers, keyword]);

  // Logic tạo ID mới đơn giản (Max ID + 1)
  const genId = () => {
    if (dealers.length === 0) return 1;
    return Math.max(...dealers.map((d) => d.id)) + 1;
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
    if (!form.name.trim()) return alert("Tên đại lý không được để trống.");
    if (!form.address.trim()) return alert("Địa chỉ không được để trống.");
    if (!form.phone.trim()) return alert("Điện thoại bắt buộc.");

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
        <h1 className="text-lg font-semibold leading-normal py-2">Quản lý Đại lý</h1>
        <button
          className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 font-semibold shadow-lg hover:brightness-105"
          onClick={openCreate}
        >
          + Thêm đại lý
        </button>
      </div>

      <input
        className="min-w-[240px] mb-4 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
        placeholder="Tìm kiếm theo tên, địa chỉ, SĐT, khu vực..."
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
              <th className="p-3 text-left">Khu vực</th>
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
                <td className="p-3">{d.region}</td>
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
                <label className="text-base text-slate-300">Tên đại lý</label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Địa chỉ</label>
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Điện thoại</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-base text-slate-300">Khu vực</label>
                <select
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                >
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                </select>
              </div>
              <div>
                <label className="text-base text-slate-300">Mức tồn an toàn</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                  value={form.safetyStockLevel}
                  onChange={(e) =>
                    setForm({ ...form, safetyStockLevel: Number(e.target.value) })
                  }
                />
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
              Bạn có chắc muốn xoá <b>{confirmDelete.name}</b> không?
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