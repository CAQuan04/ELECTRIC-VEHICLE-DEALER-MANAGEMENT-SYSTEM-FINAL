// EvmDashboard.jsx — one-file version (Tailwind + SVG Logo + CRUD Users, larger typography)
import React, { useEffect, useMemo, useState } from "react";
import { AuthService } from "@utils";
import { usePageLoading } from "@modules/loading";
import "@modules/loading/GlobalLoading.css";
import DashboardWithLogo from "./DashboardWithLogo";

/* ========== Inline SVG Logo (sang, gradient xanh biển) ========== */
const Logo = ({ size = 44, className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={`drop-shadow-lg ${className}`}
    aria-label="EV Management"
  >
    <defs>
      <linearGradient id="evmGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="14" fill="url(#evmGrad)" />
    <rect
      x="10.5"
      y="10.5"
      width="43"
      height="43"
      rx="12"
      fill="none"
      stroke="rgba(255,255,255,.35)"
      strokeWidth="1.5"
    />
    <path
      d="M36 14 L26 34 h10 l-8 16 L44 30 h-10z"
      fill="white"
      opacity="0.94"
    />
  </svg>
);

/* ========== Mock data ========== */
const initialUsers = [
  {
    id: "U001",
    name: "Nguyễn Minh Anh",
    email: "minh.anh@example.com",
    role: "Admin",
    active: true,
    createdAt: "2025-09-01",
  },
  {
    id: "U002",
    name: "Trần Bảo",
    email: "tran.bao@example.com",
    role: "Manager",
    active: true,
    createdAt: "2025-09-10",
  },
  {
    id: "U003",
    name: "Lê Kiên",
    email: "le.kien@example.com",
    role: "Staff",
    active: false,
    createdAt: "2025-10-02",
  },
  {
    id: "U004",
    name: "Phạm Trí",
    email: "pham.tri@example.com",
    role: "Staff",
    active: true,
    createdAt: "2025-10-10",
  },
];

// --- Các icon SVG nhỏ (React components) ---
const IconClipboard = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="4" y="7" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 16h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconBackup = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 10a8 8 0 1 0-1.6 4.8L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 6v6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconBox = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 3.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 3.46a2 2 0 0 0 2 0l7-3.46A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27 6.96l8.73 4.5 8.73-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconUser = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const emptyForm = { id: "", name: "", email: "", role: "Staff", active: true };

/* ========== Dashboard Component ========== */
const EvmDashboard = () => {
  const { startLoading, stopLoading } = usePageLoading();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  // Users state
  const [users, setUsers] = useState(initialUsers);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    const load = async () => {
      try {
        startLoading("Đang tải dữ liệu hệ thống…");
        // mock
        const data = {
          system: { dealers: 24, sales: 157, inventory: 1284, revenue: 185.7 },
          performance: {
            uptime: 99.8,
            customerSatisfaction: 4.8,
            deliveryTime: 7,
            targetAchievement: 112,
          },
          activities: [
            {
              id: 1,
              title: "Dealer DL001 tạo đơn hàng mới",
              time: "10 phút trước",
              icon: <IconClipboard />, // thay emoji bằng SVG component
            },
            {
              id: 2,
              title: "Hệ thống backup hoàn thành",
              time: "1 giờ trước",
              icon: <IconBackup />,
            },
            {
              id: 3,
              title: "Dealer DL005 cập nhật kho",
              time: "2 giờ trước",
              icon: <IconBox />,
            },
            {
              id: 4,
              title: "Khách hàng mới đăng ký",
              time: "3 giờ trước",
              icon: <IconUser />,
            },
          ],
        };
        setDashboardData(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load EVM dashboard data");
      } finally {
        stopLoading();
      }
    };
    load();
  }, [startLoading, stopLoading]);

  /* ===== Users helpers ===== */
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
    if (!isValidEmail(form.email)) return alert("Email không hợp lệ.");
    if (isEdit) {
      setUsers((prev) =>
        prev.map((u) => (u.id === form.id ? { ...u, ...form } : u))
      );
    } else {
      setUsers((prev) => [
        { ...form, createdAt: new Date().toISOString().slice(0, 10) },
        ...prev,
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

  /* ===== Error / Loading ===== */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 grid place-items-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 text-center shadow-2xl">
          <div className="text-2xl font-bold mb-2">⚠️ Lỗi hệ thống</div>
          <p className="text-slate-300"> {error} </p>
          <button
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 font-semibold shadow-lg hover:brightness-105"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  if (!dashboardData) return null;

  /* ===== UI ===== */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 text-[15.5px] md:text-[16.5px] lg:text-[17px]">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-[0_30px_80px_rgba(2,6,23,.6)] mb-6">
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-sky-700/20 blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/3 p-2 shadow-sm flex items-center">
            <div className="text-sky-400">
              {/* main app logo could go here */}
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" fill="rgba(255,255,255,0.02)" />
                <path d="M30 60 C30 45, 45 36, 50 36 C55 36, 70 45, 70 60 C70 72, 60 80, 50 80 C40 80, 30 72, 30 60 Z" fill="currentColor" opacity="0.95" />
              </svg>
            </div>

          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">EVM Admin</h1>
          </div>
        </div>
          <p className="text-slate-300 text-base md:text-lg">
            Chào mừng {currentUser?.name ?? "Admin"} – quản lý toàn bộ hệ thống
            EVM
          </p>

          {/* HERO STATS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Đại lý hoạt động",
                value: dashboardData.system.dealers,
              },
              { label: "Xe bán/tháng", value: dashboardData.system.sales },
              {
                label: "Uptime hệ thống",
                value: `${dashboardData.performance.uptime}%`,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-white/5 backdrop-blur-md p-5 text-center shadow-[0_12px_40px_rgba(14,165,233,.15)]"
              >
                <div className="text-3xl md:text-4xl font-extrabold">
                  {s.value}
                </div>
                <div className="text-slate-400 text-base">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAV PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "overview", label: "Tổng quan" },
          { key: "dealers", label: "Quản lý đại lý" },
          { key: "users", label: "Quản lý người dùng" },
          { key: "system", label: "Hệ thống" },
          { key: "reports", label: "Báo cáo" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold transition text-3xl",
              activeSection === tab.key
                ? "bg-sky-600 text-white border-sky-600 shadow-[0_12px_30px_rgba(14,165,233,.35)]"
                : "bg-slate-900/40 border-slate-800 text-slate-200 hover:border-sky-500/50 hover:bg-sky-500/10",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                title: "Đại lý hoạt động",
                value: dashboardData.system.dealers,
                delta: "+3 tháng này",
                deltaClass: "text-emerald-400",
              },
              {
                title: "Xe bán tháng này",
                value: dashboardData.system.sales,
                delta: "+8.7% so với tháng trước",
                deltaClass: "text-emerald-400",
              },
              {
                title: "Tồn kho toàn hệ thống",
                value: dashboardData.system.inventory.toLocaleString(),
                delta: "-2.1% so với tháng trước",
                deltaClass: "text-rose-400",
              },
              {
                title: "Doanh thu tổng",
                value: `${dashboardData.system.revenue}B VND`,
                delta: "+15.3% so với tháng trước",
                deltaClass: "text-emerald-400",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl"
              >
                <div className="text-base text-slate-400 mb-1">{c.title}</div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  {c.value}
                </div>
                <div className={`${c.deltaClass} text-sm md:text-base mt-1`}>
                  {c.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Performance + Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
              <div className="text-xl md:text-2xl font-bold mb-4">
                Hiệu suất hệ thống
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Uptime", `${dashboardData.performance.uptime}%`],
                  [
                    "Hài lòng KH",
                    `${dashboardData.performance.customerSatisfaction}/5`,
                  ],
                  [
                    "Thời gian giao hàng",
                    `${dashboardData.performance.deliveryTime} ngày`,
                  ],
                  [
                    "Hoàn thành mục tiêu",
                    `${dashboardData.performance.targetAchievement}%`,
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center"
                  >
                    <div className="text-slate-400 text-base">{k}</div>
                    <div className="text-2xl md:text-3xl font-extrabold mt-1">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
              <div className="text-xl md:text-2xl font-bold mb-4">
                Hoạt động gần đây
              </div>
              <div className="space-y-3">
                {dashboardData.activities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 border-b border-slate-800/70 pb-3 last:border-b-0"
                  >
                    <div className="grid place-items-center w-11 h-11 rounded-xl bg-sky-600/20">
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base md:text-lg">
                        {a.title}
                      </div>
                      <div className="text-slate-400 text-sm md:text-base">
                        {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* DEALERS placeholder */}
      {activeSection === "dealers" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Quản lý đại lý</h2>
            <button
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 text-base font-semibold shadow-lg hover:brightness-105"
              onClick={() => alert("Tính năng đang phát triển")}
            >
              + Thêm đại lý mới
            </button>
          </div>
          <p className="text-slate-300 mt-4">Tính năng đang được phát triển…</p>
        </div>
      )}

      {/* USERS: CRUD */}
      {activeSection === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              Quản lý người dùng
            </h2>
            <button
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 text-base font-semibold shadow-lg hover:brightness-105"
              onClick={openCreate}
            >
              + Thêm người dùng
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2">
            <input
              className="min-w-[220px] flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 outline-none ring-0 focus:border-sky-500/60"
              placeholder="Tìm theo tên, email, ID…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 outline-none focus:border-sky-500/60"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>
            </select>
            <select
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 outline-none focus:border-sky-500/60"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Trạng thái (tất cả)</option>
              <option value="ACTIVE">Đang kích hoạt</option>
              <option value="INACTIVE">Đang vô hiệu</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
            <table className="min-w-full text-[15.5px] md:text-[16px]">
              <thead>
                <tr className="text-left border-b border-slate-800/70">
                  {[
                    "ID",
                    "Họ tên",
                    "Email",
                    "Vai trò",
                    "Trạng thái",
                    "Ngày tạo",
                    "Thao tác",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-semibold text-slate-200 text-base"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-800/50 last:border-b-0"
                  >
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3 font-semibold">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold border",
                          u.role === "Admin"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : u.role === "Manager"
                            ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                            : "bg-lime-500/15 text-lime-300 border-lime-500/30",
                        ].join(" ")}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold border",
                          u.active
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-600/20 text-slate-300 border-slate-600/40",
                        ].join(" ")}
                      >
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-sm md:text-base hover:border-sky-500/50 hover:bg-sky-500/10 transition"
                          onClick={() => openEdit(u)}
                        >
                          Sửa
                        </button>
                        <button
                          className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-sm md:text-base hover:border-sky-500/50 hover:bg-sky-500/10 transition"
                          onClick={() => toggleActive(u.id)}
                        >
                          {u.active ? "Vô hiệu" : "Kích hoạt"}
                        </button>
                        <button
                          className="px-3.5 py-1.5 rounded-lg border border-rose-600/40 text-rose-300 text-sm md:text-base hover:bg-rose-600/10 transition"
                          onClick={() => askDelete(u)}
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-slate-400"
                      colSpan={7}
                    >
                      Không có người dùng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Create/Edit */}
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
                  <h3 className="text-xl md:text-2xl font-bold">
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
                    <div className="space-y-1">
                      <label className="text-base text-slate-300">ID</label>
                      <input
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                        value={form.id}
                        disabled
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-base text-slate-300">Họ tên</label>
                      <input
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-base text-slate-300">Email</label>
                      <input
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
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
                        <option>Manager</option>
                        <option>Staff</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-base text-slate-300">
                        Trạng thái
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-sky-500"
                          checked={form.active}
                          onChange={() =>
                            setForm({ ...form, active: !form.active })
                          }
                        />
                        <span>Active</span>
                      </label>
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

          {/* Delete Confirm */}
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
                  <h3 className="text-xl md:text-2xl font-bold">
                    Xoá người dùng
                  </h3>
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
      )}

      {/* SYSTEM placeholder */}
      {activeSection === "system" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold">Cấu hình hệ thống</h2>
          <p className="text-slate-300 mt-2">Tính năng đang được phát triển…</p>
        </div>
      )}

      {/* REPORTS placeholder */}
      {activeSection === "reports" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold">
            Báo cáo và phân tích
          </h2>
          <p className="text-slate-300 mt-2">Tính năng đang được phát triển…</p>
        </div>
      )}
    </div>
  );
};

export default EvmDashboard;
