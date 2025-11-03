// PricingManagement.jsx — Quản lý giá & khuyến mãi (EVM Staff)
import React, { useState } from "react";

const PricingManagement = () => {
  const [activeTab, setActiveTab] = useState("price");

  /* ========== BUTTON STYLES ========== */
  const btnBase =
    "px-3 py-1.5 rounded-xl font-semibold transition duration-150";
  const btnAdd =
    btnBase +
    " bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110";
  const btnEdit =
    btnBase + " bg-emerald-600/30 hover:bg-emerald-600 text-white";
  const btnDelete =
    btnBase + " bg-rose-600/30 hover:bg-rose-600 text-white";

  /* ========== MOCK DATA ========== */
  const [pricingList, setPricingList] = useState([
    {
      price_id: "PR001",
      vehicle_id: "EV-01",
      dealer_level: "Cấp 1",
      base_price: 890000000,
      discount_rate: 5,
      effective_date: "2025-10-01",
    },
    {
      price_id: "PR002",
      vehicle_id: "EV-02",
      dealer_level: "Cấp 2",
      base_price: 950000000,
      discount_rate: 3,
      effective_date: "2025-10-10",
    },
  ]);

  const [promotions, setPromotions] = useState([
    {
      promo_id: "KM001",
      title: "Tặng 1 năm bảo hiểm thân vỏ",
      start_date: "2025-10-15",
      end_date: "2025-11-15",
      apply_level: "Tất cả đại lý",
    },
    {
      promo_id: "KM002",
      title: "Giảm 10 triệu cho mẫu EV-01",
      start_date: "2025-11-01",
      end_date: "2025-11-30",
      apply_level: "Cấp 1",
    },
  ]);

  /* ========== STATE ========== */
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ========== GENERATOR ========== */
  const genId = (prefix, list, key) => {
    const num =
      Math.max(0, ...list.map((i) => Number(i[key].replace(prefix, "")))) + 1;
    return `${prefix}${String(num).padStart(3, "0")}`;
  };

  /* ========== PRICE CRUD ========== */
  const openCreatePrice = () => {
    setIsEdit(false);
    setForm({
      price_id: genId("PR", pricingList, "price_id"),
      vehicle_id: "",
      dealer_level: "",
      base_price: "",
      discount_rate: "",
      effective_date: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEditPrice = (p) => {
    setIsEdit(true);
    setForm({ ...p });
    setShowModal(true);
  };

  const savePrice = (e) => {
    e.preventDefault();
    if (!form.vehicle_id || !form.base_price)
      return alert("Vui lòng nhập đầy đủ thông tin giá.");
    if (isEdit) {
      setPricingList((prev) =>
        prev.map((x) => (x.price_id === form.price_id ? { ...form } : x))
      );
    } else {
      setPricingList((prev) => [{ ...form }, ...prev]);
    }
    setShowModal(false);
  };

  const deletePrice = () => {
    setPricingList((prev) =>
      prev.filter((x) => x.price_id !== confirmDelete.price_id)
    );
    setConfirmDelete(null);
  };

  /* ========== PROMOTION CRUD ========== */
  const openCreatePromo = () => {
    setIsEdit(false);
    setForm({
      promo_id: genId("KM", promotions, "promo_id"),
      title: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "",
      apply_level: "",
    });
    setShowModal(true);
  };

  const openEditPromo = (p) => {
    setIsEdit(true);
    setForm({ ...p });
    setShowModal(true);
  };

  const savePromo = (e) => {
    e.preventDefault();
    if (!form.title || !form.end_date)
      return alert("Vui lòng nhập đầy đủ thông tin khuyến mãi.");
    if (isEdit) {
      setPromotions((prev) =>
        prev.map((x) => (x.promo_id === form.promo_id ? { ...form } : x))
      );
    } else {
      setPromotions((prev) => [{ ...form }, ...prev]);
    }
    setShowModal(false);
  };

  const deletePromo = () => {
    setPromotions((prev) =>
      prev.filter((x) => x.promo_id !== confirmDelete.promo_id)
    );
    setConfirmDelete(null);
  };

  /* ========== UI ========== */
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "price", label: "Bảng giá đại lý" },
          { key: "promotion", label: "Chính sách khuyến mãi" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-5 py-2.5 font-semibold transition ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]"
                : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRICE TABLE */}
      {activeTab === "price" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">
              Bảng giá đại lý
            </h2>
            <button onClick={openCreatePrice} className={btnAdd}>
              + Thêm giá
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-slate-800/60 text-emerald-300">
                <tr>
                  <th className="p-3 text-left">Mã giá</th>
                  <th className="p-3 text-left">Mẫu xe</th>
                  <th className="p-3 text-left">Cấp đại lý</th>
                  <th className="p-3 text-left">Giá gốc (VNĐ)</th>
                  <th className="p-3 text-left">Chiết khấu (%)</th>
                  <th className="p-3 text-left">Hiệu lực</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pricingList.map((p) => (
                  <tr
                    key={p.price_id}
                    className="border-t border-slate-800 hover:bg-slate-800/40"
                  >
                    <td className="p-3">{p.price_id}</td>
                    <td className="p-3">{p.vehicle_id}</td>
                    <td className="p-3">{p.dealer_level}</td>
                    <td className="p-3">{p.base_price.toLocaleString()}</td>
                    <td className="p-3">{p.discount_rate}%</td>
                    <td className="p-3">{p.effective_date}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openEditPrice(p)}
                        className={btnEdit}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className={btnDelete}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROMOTION TABLE */}
      {activeTab === "promotion" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">
              Chính sách khuyến mãi
            </h2>
            <button onClick={openCreatePromo} className={btnAdd}>
              + Thêm khuyến mãi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-slate-800/60 text-sky-300">
                <tr>
                  <th className="p-3 text-left">Mã KM</th>
                  <th className="p-3 text-left">Tiêu đề</th>
                  <th className="p-3 text-left">Bắt đầu</th>
                  <th className="p-3 text-left">Kết thúc</th>
                  <th className="p-3 text-left">Áp dụng</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((pm) => (
                  <tr
                    key={pm.promo_id}
                    className="border-t border-slate-800 hover:bg-slate-800/40"
                  >
                    <td className="p-3">{pm.promo_id}</td>
                    <td className="p-3">{pm.title}</td>
                    <td className="p-3">{pm.start_date}</td>
                    <td className="p-3">{pm.end_date}</td>
                    <td className="p-3">{pm.apply_level}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openEditPromo(pm)}
                        className={btnEdit}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setConfirmDelete(pm)}
                        className={btnDelete}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_100px_rgba(2,6,23,.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-emerald-400">
                {activeTab === "price"
                  ? isEdit
                    ? "Cập nhật giá"
                    : "Thêm giá mới"
                  : isEdit
                  ? "Sửa khuyến mãi"
                  : "Thêm khuyến mãi mới"}
              </h3>
              <button
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={activeTab === "price" ? savePrice : savePromo}
              className="px-5 py-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(form).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="text-slate-300 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      disabled={
                        (activeTab === "price" && key === "price_id") ||
                        (activeTab === "promotion" && key === "promo_id")
                      }
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                  onClick={() => setShowModal(false)}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg hover:brightness-110"
                >
                  {isEdit ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_100px_rgba(2,6,23,.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-emerald-400">
                Xác nhận xoá
              </h3>
            </div>
            <div className="px-5 py-4 text-slate-200">
              Bạn có chắc muốn xoá bản ghi{" "}
              <b>{confirmDelete.price_id || confirmDelete.promo_id}</b>?
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
              <button
                className="px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                onClick={() => setConfirmDelete(null)}
              >
                Huỷ
              </button>
              <button
                className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-300 hover:bg-rose-600/15"
                onClick={
                  activeTab === "price" ? deletePrice : deletePromo
                }
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

export default PricingManagement;
