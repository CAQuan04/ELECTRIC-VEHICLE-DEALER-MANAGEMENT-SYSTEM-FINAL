// InventoryManagement.jsx — Quản lý tồn kho & điều phối xe (EVM Staff)
import React, { useState, useMemo } from "react";

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  /* ========== MOCK DATA ========== */
  const [inventories, setInventories] = useState([
    {
      inventory_id: "INV001",
      product_id: "P001",
      location_type: "Tổng kho",
      location_id: "WH001",
      quantity: 120,
      updated_at: "2025-10-20",
    },
    {
      inventory_id: "INV002",
      product_id: "P002",
      location_type: "Đại lý",
      location_id: "DL001",
      quantity: 20,
      updated_at: "2025-10-23",
    },
  ]);

  const [distributions, setDistributions] = useState([
    {
      dist_id: "DIST001",
      from_location: "WH001",
      to_dealer_id: "DL001",
      product_id: "P001",
      qty: 10,
      scheduled_date: "2025-10-22",
      actual_date: "2025-10-23",
      status: "Hoàn tất",
    },
    {
      dist_id: "DIST002",
      from_location: "WH001",
      to_dealer_id: "DL002",
      product_id: "P002",
      qty: 5,
      scheduled_date: "2025-10-25",
      actual_date: "",
      status: "Đang chờ",
    },
  ]);

  /* ========== FORM / MODAL STATE ========== */
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ========== GENERATORS ========== */
  const genId = (prefix, list, key) => {
    const num =
      Math.max(0, ...list.map((i) => Number(i[key].replace(prefix, "")))) + 1;
    return `${prefix}${String(num).padStart(3, "0")}`;
  };

  /* ========== INVENTORY CRUD ========== */
  const openCreateInventory = () => {
    setIsEdit(false);
    setForm({
      inventory_id: genId("INV", inventories, "inventory_id"),
      product_id: "",
      location_type: "Tổng kho",
      location_id: "",
      quantity: "",
      updated_at: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEditInventory = (i) => {
    setIsEdit(true);
    setForm({ ...i });
    setShowModal(true);
  };

  const saveInventory = (e) => {
    e.preventDefault();
    if (!form.product_id || !form.location_id || !form.quantity)
      return alert("Vui lòng nhập đầy đủ thông tin.");
    const now = new Date().toISOString().slice(0, 10);
    if (isEdit) {
      setInventories((prev) =>
        prev.map((x) =>
          x.inventory_id === form.inventory_id
            ? { ...form, updated_at: now }
            : x
        )
      );
    } else {
      setInventories((prev) => [{ ...form, updated_at: now }, ...prev]);
    }
    setShowModal(false);
  };

  const deleteInventory = () => {
    setInventories((prev) =>
      prev.filter((x) => x.inventory_id !== confirmDelete.inventory_id)
    );
    setConfirmDelete(null);
  };

  /* ========== DISTRIBUTION CRUD ========== */
  const openCreateDistribution = () => {
    setIsEdit(false);
    setForm({
      dist_id: genId("DIST", distributions, "dist_id"),
      from_location: "WH001",
      to_dealer_id: "",
      product_id: "",
      qty: "",
      scheduled_date: new Date().toISOString().slice(0, 10),
      actual_date: "",
      status: "Đang chờ",
    });
    setShowModal(true);
  };

  const openEditDistribution = (d) => {
    setIsEdit(true);
    setForm({ ...d });
    setShowModal(true);
  };

  const saveDistribution = (e) => {
    e.preventDefault();
    if (!form.product_id || !form.to_dealer_id || !form.qty)
      return alert("Vui lòng nhập đầy đủ thông tin điều phối.");
    if (isEdit) {
      setDistributions((prev) =>
        prev.map((x) => (x.dist_id === form.dist_id ? { ...form } : x))
      );
    } else {
      setDistributions((prev) => [{ ...form }, ...prev]);
    }
    setShowModal(false);
  };

  const deleteDistribution = () => {
    setDistributions((prev) =>
      prev.filter((x) => x.dist_id !== confirmDelete.dist_id)
    );
    setConfirmDelete(null);
  };

  const confirmDelivery = (dist_id) => {
    const now = new Date().toISOString().slice(0, 10);
    setDistributions((prev) =>
      prev.map((d) =>
        d.dist_id === dist_id
          ? { ...d, status: "Hoàn tất", actual_date: now }
          : d
      )
    );
  };

  /* ========== UI RENDERING ========== */
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "inventory", label: "Tồn kho tổng" },
          { key: "distribution", label: "Điều phối xe" },
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

      {/* INVENTORY */}
      {activeTab === "inventory" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">
              Quản lý tồn kho tổng
            </h2>
            <button
              onClick={openCreateInventory}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 shadow-lg hover:brightness-110"
            >
              + Thêm kho
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-slate-800/60 text-emerald-300">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Mã sản phẩm</th>
                  <th className="p-3 text-left">Loại kho</th>
                  <th className="p-3 text-left">Mã kho / đại lý</th>
                  <th className="p-3 text-left">Số lượng</th>
                  <th className="p-3 text-left">Cập nhật</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {inventories.map((i) => (
                  <tr
                    key={i.inventory_id}
                    className="border-t border-slate-800 hover:bg-slate-800/40"
                  >
                    <td className="p-3">{i.inventory_id}</td>
                    <td className="p-3">{i.product_id}</td>
                    <td className="p-3">{i.location_type}</td>
                    <td className="p-3">{i.location_id}</td>
                    <td className="p-3">{i.quantity}</td>
                    <td className="p-3">{i.updated_at}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openEditInventory(i)}
                        className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-white"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setConfirmDelete(i)}
                        className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-white"
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

      {/* DISTRIBUTION */}
      {activeTab === "distribution" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">
              Điều phối xe cho đại lý
            </h2>
            <button
              onClick={openCreateDistribution}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 shadow-lg hover:brightness-110"
            >
              + Tạo phiếu điều phối
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-slate-800/60 text-sky-300">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Từ kho</th>
                  <th className="p-3 text-left">Đến đại lý</th>
                  <th className="p-3 text-left">Sản phẩm</th>
                  <th className="p-3 text-left">Số lượng</th>
                  <th className="p-3 text-left">Lịch giao</th>
                  <th className="p-3 text-left">Thực tế</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map((d) => (
                  <tr
                    key={d.dist_id}
                    className="border-t border-slate-800 hover:bg-slate-800/40"
                  >
                    <td className="p-3">{d.dist_id}</td>
                    <td className="p-3">{d.from_location}</td>
                    <td className="p-3">{d.to_dealer_id}</td>
                    <td className="p-3">{d.product_id}</td>
                    <td className="p-3">{d.qty}</td>
                    <td className="p-3">{d.scheduled_date}</td>
                    <td className="p-3">{d.actual_date || "—"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          d.status === "Hoàn tất"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      {d.status !== "Hoàn tất" && (
                        <button
                          onClick={() => confirmDelivery(d.dist_id)}
                          className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-white"
                        >
                          Xác nhận
                        </button>
                      )}
                      <button
                        onClick={() => openEditDistribution(d)}
                        className="px-2 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600 text-white"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setConfirmDelete(d)}
                        className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-white"
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

      {/* MODALS */}
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
                {activeTab === "inventory"
                  ? isEdit
                    ? "Cập nhật kho"
                    : "Thêm kho mới"
                  : isEdit
                  ? "Sửa phiếu điều phối"
                  : "Tạo phiếu điều phối"}
              </h3>
              <button
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                activeTab === "inventory" ? saveInventory : saveDistribution
              }
              className="px-5 py-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(form)
                  .filter((k) => !["status", "updated_at"].includes(k))
                  .map((key) => (
                    <div key={key} className="space-y-1">
                      <label className="text-slate-300 capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <input
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        disabled={key.endsWith("_id")}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
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
              <b>{confirmDelete.inventory_id || confirmDelete.dist_id}</b>?
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
                  activeTab === "inventory"
                    ? deleteInventory
                    : deleteDistribution
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

export default InventoryManagement;
