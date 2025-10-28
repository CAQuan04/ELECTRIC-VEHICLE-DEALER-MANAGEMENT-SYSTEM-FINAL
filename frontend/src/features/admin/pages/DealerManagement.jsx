// DealerManagement.jsx — Quản lý Hợp đồng, Chỉ tiêu, Công nợ (Admin only)
import React, { useState } from "react";

/* ====== Mock data ====== */
const mockContracts = [
  {
    contract_id: "C001",
    dealer_id: "DL001",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    terms: "Phân phối xe điện dòng A",
    status: "Active",
  },
  {
    contract_id: "C002",
    dealer_id: "DL002",
    start_date: "2025-05-01",
    end_date: "2025-10-31",
    terms: "Bán lẻ xe điện mini",
    status: "Expired",
  },
];

const mockTargets = [
  {
    target_id: "T001",
    dealer_id: "DL001",
    period_start: "2025-10-01",
    period_end: "2025-10-31",
    sales_target: 50,
    actual_sales: 42,
  },
  {
    target_id: "T002",
    dealer_id: "DL002",
    period_start: "2025-10-01",
    period_end: "2025-10-31",
    sales_target: 70,
    actual_sales: 75,
  },
];

const mockDebts = [
  {
    debt_id: "D001",
    dealer_id: "DL001",
    amount_due: 120000000,
    due_date: "2025-11-30",
    status: "Pending",
  },
  {
    debt_id: "D002",
    dealer_id: "DL002",
    amount_due: 80000000,
    due_date: "2025-12-15",
    status: "Paid",
  },
];

/* ====== Component chính ====== */
const DealerManagement = () => {
  const [tab, setTab] = useState("contracts");
  const [contracts, setContracts] = useState(mockContracts);
  const [targets, setTargets] = useState(mockTargets);
  const [debts, setDebts] = useState(mockDebts);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ========== Helper ========== */
  const formatCurrency = (num) =>
    num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const openCreate = () => {
    setIsEdit(false);
    let template = {};
    if (tab === "contracts")
      template = {
        contract_id: `C${String(contracts.length + 1).padStart(3, "0")}`,
        dealer_id: "",
        start_date: "",
        end_date: "",
        terms: "",
        status: "Active",
      };
    else if (tab === "targets")
      template = {
        target_id: `T${String(targets.length + 1).padStart(3, "0")}`,
        dealer_id: "",
        period_start: "",
        period_end: "",
        sales_target: 0,
        actual_sales: 0,
      };
    else
      template = {
        debt_id: `D${String(debts.length + 1).padStart(3, "0")}`,
        dealer_id: "",
        amount_due: 0,
        due_date: "",
        status: "Pending",
      };

    setForm(template);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEdit(true);
    setForm({ ...item });
    setShowModal(true);
  };

  const saveItem = (e) => {
    e.preventDefault();
    if (tab === "contracts") {
      setContracts((prev) => {
        if (isEdit)
          return prev.map((c) =>
            c.contract_id === form.contract_id ? form : c
          );
        return [form, ...prev];
      });
    } else if (tab === "targets") {
      setTargets((prev) => {
        if (isEdit)
          return prev.map((t) =>
            t.target_id === form.target_id ? form : t
          );
        return [form, ...prev];
      });
    } else {
      setDebts((prev) => {
        if (isEdit)
          return prev.map((d) => (d.debt_id === form.debt_id ? form : d));
        return [form, ...prev];
      });
    }
    setShowModal(false);
  };

  const askDelete = (item) => setConfirmDelete(item);

  const doDelete = () => {
    if (tab === "contracts")
      setContracts((prev) =>
        prev.filter((c) => c.contract_id !== confirmDelete.contract_id)
      );
    else if (tab === "targets")
      setTargets((prev) =>
        prev.filter((t) => t.target_id !== confirmDelete.target_id)
      );
    else
      setDebts((prev) =>
        prev.filter((d) => d.debt_id !== confirmDelete.debt_id)
      );

    setConfirmDelete(null);
  };

  /* ========== Render bảng ========== */
  const renderTable = () => {
    if (tab === "contracts")
      return (
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead className="bg-slate-800/60 text-sky-300">
            <tr>
              <th className="p-3 text-left">Mã HĐ</th>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Ngày bắt đầu</th>
              <th className="p-3 text-left">Ngày kết thúc</th>
              <th className="p-3 text-left">Điều khoản</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr
                key={c.contract_id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3">{c.contract_id}</td>
                <td className="p-3">{c.dealer_id}</td>
                <td className="p-3">{c.start_date}</td>
                <td className="p-3">{c.end_date}</td>
                <td className="p-3">{c.terms}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                    onClick={() => openEdit(c)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white"
                    onClick={() => askDelete(c)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    if (tab === "targets")
      return (
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead className="bg-slate-800/60 text-sky-300">
            <tr>
              <th className="p-3 text-left">Mã chỉ tiêu</th>
              <th className="p-3 text-left">Đại lý</th>
              <th className="p-3 text-left">Từ ngày</th>
              <th className="p-3 text-left">Đến ngày</th>
              <th className="p-3 text-left">Mục tiêu</th>
              <th className="p-3 text-left">Thực tế</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t) => (
              <tr
                key={t.target_id}
                className="border-t border-slate-800 hover:bg-slate-800/30"
              >
                <td className="p-3">{t.target_id}</td>
                <td className="p-3">{t.dealer_id}</td>
                <td className="p-3">{t.period_start}</td>
                <td className="p-3">{t.period_end}</td>
                <td className="p-3 font-semibold text-emerald-300">
                  {t.sales_target}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    t.actual_sales >= t.sales_target
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
                >
                  {t.actual_sales}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white"
                    onClick={() => openEdit(t)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white"
                    onClick={() => askDelete(t)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    return (
      <table className="min-w-full text-sm md:text-base border-collapse">
        <thead className="bg-slate-800/60 text-sky-300">
          <tr>
            <th className="p-3 text-left">Mã công nợ</th>
            <th className="p-3 text-left">Đại lý</th>
            <th className="p-3 text-left">Số tiền</th>
            <th className="p-3 text-left">Hạn thanh toán</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((d) => (
            <tr
              key={d.debt_id}
              className="border-t border-slate-800 hover:bg-slate-800/30"
            >
              <td className="p-3">{d.debt_id}</td>
              <td className="p-3">{d.dealer_id}</td>
              <td className="p-3">{formatCurrency(d.amount_due)}</td>
              <td className="p-3">{d.due_date}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    d.status === "Paid"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {d.status}
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
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  /* ========== JSX chính ========== */
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl space-y-4">
      {/* Tabs phụ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "contracts", label: "Hợp đồng" },
          { key: "targets", label: "Chỉ tiêu" },
          { key: "debts", label: "Công nợ" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-full font-semibold border ${
              tab === t.key
                ? "bg-sky-600 text-white border-sky-600 shadow-[0_0_20px_rgba(14,165,233,.5)]"
                : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-sky-500/40 hover:bg-sky-500/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Nút thêm */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">
          {tab === "contracts"
            ? "Quản lý Hợp đồng đại lý"
            : tab === "targets"
            ? "Quản lý Chỉ tiêu doanh số"
            : "Quản lý Công nợ"}
        </h2>
        <button
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 text-base font-semibold shadow-lg hover:brightness-105"
          onClick={openCreate}
        >
          + Thêm
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        {renderTable()}
      </div>

      {/* Modal thêm / sửa */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_30px_120px_rgba(2,6,23,.8)] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">
              {isEdit ? "Cập nhật" : "Thêm mới"}{" "}
              {tab === "contracts"
                ? "Hợp đồng"
                : tab === "targets"
                ? "Chỉ tiêu"
                : "Công nợ"}
            </h3>

            <form
              onSubmit={saveItem}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {Object.keys(form).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-base text-slate-300 capitalize">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-slate-100"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    disabled={
                      key.endsWith("_id") ||
                      key === "status" ||
                      key === "terms"
                        ? false
                        : false
                    }
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

      {/* Xác nhận xoá */}
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
              <h3 className="text-xl font-bold">Xoá dữ liệu</h3>
            </div>
            <div className="px-5 py-4 text-slate-200">
              Bạn có chắc muốn xoá{" "}
              <b>{confirmDelete.contract_id || confirmDelete.target_id || confirmDelete.debt_id}</b>?
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

export default DealerManagement;
