// DealerContractManagement.jsx
import React, { useMemo, useState } from "react";

/*
  PRO Version: Full CRUD + filtering + validation + UI consistent with EvmDashboard.jsx
  - Tables: DealerContract, DealerTarget, Debt
  - Actions: create/edit/delete, setTarget, trackPerformance(simulated), updateDebt, markAsPaid
  - Style: Tailwind classes matching EvmDashboard dark theme
*/

/* ========== Mock initial data ========== */
const initialContracts = [
  {
    contract_id: "C001",
    dealer_id: "DL001",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    terms: "Phân phối khu vực Hà Nội. Chiết khấu theo doanh số quý.",
    status: "Active",
  },
  {
    contract_id: "C002",
    dealer_id: "DL002",
    start_date: "2025-02-01",
    end_date: "2025-12-31",
    terms: "Hợp tác bán hàng, hỗ trợ marketing 5%.",
    status: "Active",
  },
];

const initialTargets = [
  {
    target_id: "T001",
    dealer_id: "DL001",
    period_start: "2025-07-01",
    period_end: "2025-09-30",
    sales_target: 200,
    actual_sales: 180,
  },
  {
    target_id: "T002",
    dealer_id: "DL002",
    period_start: "2025-07-01",
    period_end: "2025-09-30",
    sales_target: 150,
    actual_sales: 160,
  },
];

const initialDebts = [
  {
    debt_id: "D001",
    dealer_id: "DL001",
    amount_due: 50000000,
    due_date: "2025-11-30",
    status: "Unpaid",
  },
  {
    debt_id: "D002",
    dealer_id: "DL002",
    amount_due: 30000000,
    due_date: "2025-12-15",
    status: "Paid",
  },
];

/* ========== Helper utils ========== */
const genId = (prefix, list) =>
  `${prefix}${String(list.length + 1).padStart(3, "0")}`;

const formatMoney = (n) =>
  typeof n === "number" ? n.toLocaleString("vi-VN") : n;

/* ========== Component ========== */
const DealerContractManagement = () => {
  /* --- Data states --- */
  const [contracts, setContracts] = useState(initialContracts);
  const [targets, setTargets] = useState(initialTargets);
  const [debts, setDebts] = useState(initialDebts);

  /* --- UI states --- */
  const [tab, setTab] = useState("contracts"); // contracts | targets | debts
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // for contracts & debts
  const [sortBy, setSortBy] = useState(""); // simple sort key

  /* --- Modal states --- */
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractForm, setContractForm] = useState(null); // null means new
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetForm, setTargetForm] = useState(null);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [debtForm, setDebtForm] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null); // {type, id}

  /* ---------------- Core domain methods ---------------- */

  // Contracts
  const createContract = (payload) => {
    const newId = genId("C", contracts);
    const record = {
      contract_id: newId,
      dealer_id: payload.dealer_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      terms: payload.terms,
      status: payload.status || "Active",
    };
    setContracts((prev) => [...prev, record]);
    return record;
  };

  const updateContract = (id, payload) => {
    setContracts((prev) =>
      prev.map((c) => (c.contract_id === id ? { ...c, ...payload } : c))
    );
  };

  const deleteContract = (id) => {
    setContracts((prev) => prev.filter((c) => c.contract_id !== id));
    // optionally cascade: delete targets/debts for dealer? Not auto here.
  };

  // Targets
  const setTarget = (payload) => {
    const newId = genId("T", targets);
    const record = {
      target_id: newId,
      dealer_id: payload.dealer_id,
      period_start: payload.period_start,
      period_end: payload.period_end,
      sales_target: Number(payload.sales_target),
      actual_sales: Number(payload.actual_sales || 0),
    };
    setTargets((prev) => [...prev, record]);
    return record;
  };

  const updateTarget = (id, payload) => {
    setTargets((prev) =>
      prev.map((t) => (t.target_id === id ? { ...t, ...payload } : t))
    );
  };

  const deleteTarget = (id) => {
    setTargets((prev) => prev.filter((t) => t.target_id !== id));
  };

  // Performance tracking (simulated or computed)
  // For real system this would pull invoices/sales from Billing Service
  const trackPerformance = (dealerId, periodStart) => {
    // find target by dealer + periodStart
    const t = targets.find(
      (x) => x.dealer_id === dealerId && x.period_start === periodStart
    );
    if (!t) return alert("Không tìm thấy chỉ tiêu tương ứng.");

    // Simulate by random around target (but not exceeding double)
    const simulated = Math.round(
      t.sales_target * (0.6 + Math.random() * 1.2)
    );
    updateTarget(t.target_id, { actual_sales: simulated });
    return simulated;
  };

  // Debts
  const updateDebt = (payload) => {
    const newId = genId("D", debts);
    const record = {
      debt_id: newId,
      dealer_id: payload.dealer_id,
      amount_due: Number(payload.amount_due),
      due_date: payload.due_date,
      status: payload.status || "Unpaid",
    };
    setDebts((prev) => [...prev, record]);
    return record;
  };

  const updateDebtStatus = (id, status) => {
    setDebts((prev) => prev.map((d) => (d.debt_id === id ? { ...d, status } : d)));
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.debt_id !== id));
  };

  /* ---------------- Filtering & Sorting ---------------- */

  const contractsFiltered = useMemo(() => {
    let list = [...contracts];
    const k = search.trim().toLowerCase();
    if (k) {
      list = list.filter(
        (c) =>
          c.contract_id.toLowerCase().includes(k) ||
          c.dealer_id.toLowerCase().includes(k) ||
          c.terms.toLowerCase().includes(k)
      );
    }
    if (filterStatus !== "ALL") {
      list = list.filter((c) => c.status === filterStatus);
    }
    if (sortBy === "start_date") {
      list.sort((a, b) => a.start_date.localeCompare(b.start_date));
    } else if (sortBy === "end_date") {
      list.sort((a, b) => a.end_date.localeCompare(b.end_date));
    }
    return list;
  }, [contracts, search, filterStatus, sortBy]);

  const targetsFiltered = useMemo(() => {
    let list = [...targets];
    const k = search.trim().toLowerCase();
    if (k) {
      list = list.filter(
        (t) =>
          t.target_id.toLowerCase().includes(k) ||
          t.dealer_id.toLowerCase().includes(k)
      );
    }
    if (sortBy === "period_start") {
      list.sort((a, b) => a.period_start.localeCompare(b.period_start));
    }
    return list;
  }, [targets, search, sortBy]);

  const debtsFiltered = useMemo(() => {
    let list = [...debts];
    const k = search.trim().toLowerCase();
    if (k) {
      list = list.filter(
        (d) =>
          d.debt_id.toLowerCase().includes(k) ||
          d.dealer_id.toLowerCase().includes(k)
      );
    }
    if (filterStatus !== "ALL") {
      list = list.filter((d) => d.status === filterStatus);
    }
    if (sortBy === "due_date") {
      list.sort((a, b) => a.due_date.localeCompare(b.due_date));
    }
    return list;
  }, [debts, search, filterStatus, sortBy]);

  /* ---------------- UI Helpers ---------------- */

  const openCreateContract = () => {
    setContractForm({
      dealer_id: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: "",
      terms: "",
      status: "Active",
    });
    setShowContractModal(true);
  };

  const openEditContract = (c) => {
    setContractForm({ ...c });
    setShowContractModal(true);
  };

  const handleContractSave = (e) => {
    e.preventDefault();
    const f = contractForm;
    if (!f.dealer_id.trim()) return alert("Vui lòng nhập dealer_id.");
    if (!f.start_date || !f.end_date)
      return alert("Vui lòng nhập ngày bắt đầu và kết thúc.");
    if (f.contract_id) {
      updateContract(f.contract_id, f);
    } else {
      createContract(f);
    }
    setShowContractModal(false);
    setContractForm(null);
  };

  const openCreateTarget = () => {
    setTargetForm({
      dealer_id: "",
      period_start: "",
      period_end: "",
      sales_target: "",
      actual_sales: 0,
    });
    setShowTargetModal(true);
  };

  const openEditTarget = (t) => {
    setTargetForm({ ...t });
    setShowTargetModal(true);
  };

  const handleTargetSave = (e) => {
    e.preventDefault();
    const f = targetForm;
    if (!f.dealer_id.trim()) return alert("Vui lòng nhập dealer_id.");
    if (!f.period_start || !f.period_end)
      return alert("Vui lòng nhập kỳ bắt đầu và kết thúc.");
    if (!f.sales_target || Number(f.sales_target) <= 0)
      return alert("Mục tiêu doanh số phải > 0.");
    if (f.target_id) {
      updateTarget(f.target_id, f);
    } else {
      setTarget(f);
    }
    setShowTargetModal(false);
    setTargetForm(null);
  };

  const openCreateDebt = () => {
    setDebtForm({
      dealer_id: "",
      amount_due: "",
      due_date: new Date().toISOString().slice(0, 10),
      status: "Unpaid",
    });
    setShowDebtModal(true);
  };

  const openEditDebt = (d) => {
    setDebtForm({ ...d });
    setShowDebtModal(true);
  };

  const handleDebtSave = (e) => {
    e.preventDefault();
    const f = debtForm;
    if (!f.dealer_id.trim()) return alert("Vui lòng nhập dealer_id.");
    if (!f.amount_due || Number(f.amount_due) <= 0)
      return alert("Số tiền nợ phải > 0.");
    if (f.debt_id) {
      setDebts((prev) => prev.map((x) => (x.debt_id === f.debt_id ? f : x)));
    } else {
      updateDebt(f);
    }
    setShowDebtModal(false);
    setDebtForm(null);
  };

  const confirmDeleteItem = (type, id) => {
    setConfirmDelete({ type, id });
  };

  const doDeleteConfirmed = () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    if (type === "contract") deleteContract(id);
    if (type === "target") deleteTarget(id);
    if (type === "debt") deleteDebt(id);
    setConfirmDelete(null);
  };

  /* ---------------- Render UI ---------------- */

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold leading-normal py-2 text-sky-400">Hợp đồng & KPI đại lý</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "contracts", label: "Hợp đồng" },
          { key: "targets", label: "Chỉ tiêu doanh số" },
          { key: "debts", label: "Công nợ" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setSearch("");
              setFilterStatus("ALL");
              setSortBy("");
            }}
            className={`px-4 py-2 rounded-xl font-semibold ${
              tab === t.key ? "bg-sky-600 text-white" : "bg-slate-900/40 border border-slate-800 hover:bg-sky-500/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="min-w-[220px] flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          placeholder="Tìm theo ID, đại lý, mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Expired">Expired</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>

        <select
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Không sắp xếp</option>
          {tab === "contracts" && <option value="start_date">Sắp xếp: Ngày bắt đầu</option>}
          {tab === "contracts" && <option value="end_date">Sắp xếp: Ngày kết thúc</option>}
          {tab === "targets" && <option value="period_start">Sắp xếp: Kỳ bắt đầu</option>}
          {tab === "debts" && <option value="due_date">Sắp xếp: Hạn thanh toán</option>}
        </select>

        <div className="ml-auto flex gap-2">
          {tab === "contracts" && (
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow" onClick={openCreateContract}>
              + Thêm hợp đồng
            </button>
          )}
          {tab === "targets" && (
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow" onClick={openCreateTarget}>
              + Thêm chỉ tiêu
            </button>
          )}
          {tab === "debts" && (
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow" onClick={openCreateDebt}>
              + Tạo công nợ
            </button>
          )}
        </div>
      </div>

      {/* Panels */}
      {tab === "contracts" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
          <table className="min-w-full border-collapse text-base">
            <thead className="bg-slate-800/60 text-sky-300">
              <tr>
                <th className="p-3 text-left">Mã HĐ</th>
                <th className="p-3 text-left">Đại lý</th>
                <th className="p-3 text-left">Bắt đầu</th>
                <th className="p-3 text-left">Kết thúc</th>
                <th className="p-3 text-left">Điều khoản</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contractsFiltered.map((c) => (
                <tr key={c.contract_id} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-3 font-medium">{c.contract_id}</td>
                  <td className="p-3">{c.dealer_id}</td>
                  <td className="p-3">{c.start_date}</td>
                  <td className="p-3">{c.end_date}</td>
                  <td className="p-3 truncate max-w-[40ch]" title={c.terms}>{c.terms}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/40">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white" onClick={() => openEditContract(c)}>Sửa</button>
                    <button className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white" onClick={() => confirmDeleteItem("contract", c.contract_id)}>Xóa</button>
                  </td>
                </tr>
              ))}
              {contractsFiltered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">Không có hợp đồng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "targets" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-800/60 text-sky-300">
              <tr>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Đại lý</th>
                <th className="p-3 text-left">Kỳ bắt đầu</th>
                <th className="p-3 text-left">Kỳ kết thúc</th>
                <th className="p-3 text-left">Mục tiêu</th>
                <th className="p-3 text-left">Thực đạt</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {targetsFiltered.map((t) => (
                <tr key={t.target_id} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-3 font-medium">{t.target_id}</td>
                  <td className="p-3">{t.dealer_id}</td>
                  <td className="p-3">{t.period_start}</td>
                  <td className="p-3">{t.period_end}</td>
                  <td className="p-3">{t.sales_target}</td>
                  <td className="p-3">{t.actual_sales}</td>
                  <td className="p-3 text-center space-x-2">
                    <button className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white" onClick={() => openEditTarget(t)}>Sửa</button>
                    <button className="px-2 py-1 rounded-lg bg-emerald-600/40 hover:bg-emerald-600 text-white" onClick={() => {
                      const simulated = trackPerformance(t.dealer_id, t.period_start);
                      alert(`Cập nhật doanh số thực tế: ${simulated}`);
                    }}>Theo dõi</button>
                    <button className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white" onClick={() => confirmDeleteItem("target", t.target_id)}>Xóa</button>
                  </td>
                </tr>
              ))}
              {targetsFiltered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">Không có chỉ tiêu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "debts" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-800/60 text-sky-300">
              <tr>
                <th className="p-3 text-left">Mã nợ</th>
                <th className="p-3 text-left">Đại lý</th>
                <th className="p-3 text-left">Số tiền (VNĐ)</th>
                <th className="p-3 text-left">Hạn</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {debtsFiltered.map((d) => (
                <tr key={d.debt_id} className="border-t border-slate-800 hover:bg-slate-800/30">
                  <td className="p-3 font-medium">{d.debt_id}</td>
                  <td className="p-3">{d.dealer_id}</td>
                  <td className="p-3">{formatMoney(d.amount_due)}</td>
                  <td className="p-3">{d.due_date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "Paid" ? "text-emerald-300 bg-emerald-800/10" : "text-rose-300 bg-rose-800/10"}`}>{d.status}</span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button className="px-2 py-1 rounded-lg bg-sky-600/40 hover:bg-sky-600 text-white" onClick={() => openEditDebt(d)}>Sửa</button>
                    {d.status !== "Paid" && (
                      <button className="px-2 py-1 rounded-lg bg-emerald-600/40 hover:bg-emerald-600 text-white" onClick={() => {
                        updateDebtStatus(d.debt_id, "Paid");
                      }}>Đánh dấu đã trả</button>
                    )}
                    <button className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-white" onClick={() => confirmDeleteItem("debt", d.debt_id)}>Xóa</button>
                  </td>
                </tr>
              ))}
              {debtsFiltered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">Không có công nợ phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== Modals ========== */}

      {/* Contract Modal */}
      {showContractModal && contractForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={() => { setShowContractModal(false); setContractForm(null); }}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">{contractForm.contract_id ? "Cập nhật hợp đồng" : "Tạo hợp đồng mới"}</h3>
              <button className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700" onClick={() => { setShowContractModal(false); setContractForm(null); }}>✕</button>
            </div>
            <form onSubmit={handleContractSave} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-base text-slate-300">Mã hợp đồng</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.contract_id || "(auto)"} disabled />
                </div>
                <div>
                  <label className="text-base text-slate-300">Mã đại lý</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.dealer_id} onChange={(e) => setContractForm({ ...contractForm, dealer_id: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Ngày bắt đầu</label>
                  <input type="date" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.start_date} onChange={(e) => setContractForm({ ...contractForm, start_date: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Ngày kết thúc</label>
                  <input type="date" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.end_date} onChange={(e) => setContractForm({ ...contractForm, end_date: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-base text-slate-300">Điều khoản</label>
                  <textarea rows="4" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.terms} onChange={(e) => setContractForm({ ...contractForm, terms: e.target.value })} />
                </div>
                <div>
                  <label className="text-base text-slate-300">Trạng thái</label>
                  <select className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={contractForm.status} onChange={(e) => setContractForm({ ...contractForm, status: e.target.value })}>
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {contractForm.contract_id && (
                  <button type="button" className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200 hover:bg-rose-600/10" onClick={() => confirmDeleteItem("contract", contractForm.contract_id)}>Xóa</button>
                )}
                <button type="button" className="px-4 py-2 rounded-xl border border-slate-700" onClick={() => { setShowContractModal(false); setContractForm(null); }}>Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold">{contractForm.contract_id ? "Lưu thay đổi" : "Tạo hợp đồng"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && targetForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={() => { setShowTargetModal(false); setTargetForm(null); }}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">{targetForm.target_id ? "Cập nhật chỉ tiêu" : "Tạo chỉ tiêu mới"}</h3>
              <button className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700" onClick={() => { setShowTargetModal(false); setTargetForm(null); }}>✕</button>
            </div>
            <form onSubmit={handleTargetSave} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-base text-slate-300">Mã chỉ tiêu</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.target_id || "(auto)"} disabled />
                </div>
                <div>
                  <label className="text-base text-slate-300">Mã đại lý</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.dealer_id} onChange={(e) => setTargetForm({ ...targetForm, dealer_id: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Kỳ bắt đầu</label>
                  <input type="date" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.period_start} onChange={(e) => setTargetForm({ ...targetForm, period_start: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Kỳ kết thúc</label>
                  <input type="date" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.period_end} onChange={(e) => setTargetForm({ ...targetForm, period_end: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Mục tiêu (số xe)</label>
                  <input type="number" min="1" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.sales_target} onChange={(e) => setTargetForm({ ...targetForm, sales_target: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Thực đạt (số xe)</label>
                  <input type="number" min="0" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={targetForm.actual_sales} onChange={(e) => setTargetForm({ ...targetForm, actual_sales: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {targetForm.target_id && (
                  <button type="button" className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200" onClick={() => confirmDeleteItem("target", targetForm.target_id)}>Xóa</button>
                )}
                <button type="button" className="px-4 py-2 rounded-xl border border-slate-700" onClick={() => { setShowTargetModal(false); setTargetForm(null); }}>Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold">{targetForm.target_id ? "Lưu" : "Tạo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debt Modal */}
      {showDebtModal && debtForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={() => { setShowDebtModal(false); setDebtForm(null); }}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">{debtForm.debt_id ? "Cập nhật công nợ" : "Tạo công nợ mới"}</h3>
              <button className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700" onClick={() => { setShowDebtModal(false); setDebtForm(null); }}>✕</button>
            </div>
            <form onSubmit={handleDebtSave} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-base text-slate-300">Mã nợ</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={debtForm.debt_id || "(auto)"} disabled />
                </div>
                <div>
                  <label className="text-base text-slate-300">Mã đại lý</label>
                  <input className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={debtForm.dealer_id} onChange={(e) => setDebtForm({ ...debtForm, dealer_id: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Số tiền (VNĐ)</label>
                  <input type="number" min="0" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={debtForm.amount_due} onChange={(e) => setDebtForm({ ...debtForm, amount_due: e.target.value })} required />
                </div>
                <div>
                  <label className="text-base text-slate-300">Hạn thanh toán</label>
                  <input type="date" className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={debtForm.due_date} onChange={(e) => setDebtForm({ ...debtForm, due_date: e.target.value })} />
                </div>
                <div>
                  <label className="text-base text-slate-300">Trạng thái</label>
                  <select className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2" value={debtForm.status} onChange={(e) => setDebtForm({ ...debtForm, status: e.target.value })}>
                    <option>Unpaid</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {debtForm.debt_id && (
                  <button type="button" className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200" onClick={() => confirmDeleteItem("debt", debtForm.debt_id)}>Xóa</button>
                )}
                <button type="button" className="px-4 py-2 rounded-xl border border-slate-700" onClick={() => { setShowDebtModal(false); setDebtForm(null); }}>Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold">{debtForm.debt_id ? "Lưu" : "Tạo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-xl font-bold">Xác nhận xóa</h3>
            </div>
            <div className="px-5 py-4 text-slate-200">
              Bạn có chắc muốn xóa <b>{confirmDelete.type}</b> với ID <b>{confirmDelete.id}</b>?
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
              <button className="px-4 py-2 rounded-xl border border-slate-700" onClick={() => setConfirmDelete(null)}>Huỷ</button>
              <button className="px-4 py-2 rounded-xl border border-rose-600/40 text-rose-200 hover:bg-rose-600/10" onClick={doDeleteConfirmed}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerContractManagement;
