import React, { useState } from "react";

// DashboardWithLogo.jsx
// React component with individual SVG icons for each dashboard card.
// Each item displays an icon on the left and text on the right.

function IconAgency({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M3 13h18v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6h10v7H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconReports({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M9 17v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 17v-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconUsers({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11c1.657 0 3-1.567 3-3.5S7.657 4 6 4 3 5.567 3 7.5 4.343 11 6 11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 20a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.8 16.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.63 0 1.18-.37 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.12 2.8l.06.06c.45.45 1.01.7 1.62.7.23 0 .46-.03.68-.09.5-.14 1.03.11 1.3.56l.07.12c.45.7 1.37 1.13 2.29 1.13.92 0 1.84-.43 2.29-1.13l.07-.12c.27-.45.8-.7 1.3-.56.22.06.45.09.68.09.61 0 1.17-.25 1.62-.7l.06-.06A2 2 0 0 1 21.2 7.12l-.06.06c-.45.45-.7 1.01-.7 1.62 0 .23.03.46.09.68.14.5-.11 1.03-.56 1.3l-.12.07c-.7.45-1.13 1.37-1.13 2.29 0 .92.43 1.84 1.13 2.29l.12.07c.45.27.7.8.56 1.3-.06.22-.09.45-.09.68 0 .61.25 1.17.7 1.62l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06c-.45-.45-1.01-.7-1.62-.7-.23 0-.46.03-.68.09-.5.14-1.03-.11-1.3-.56l-.07-.12c-.45-.7-1.37-1.13-2.29-1.13-.92 0-1.84.43-2.29 1.13l-.07.12c-.27.45-.8.7-1.3.56-.22-.06-.45-.09-.68-.09-.61 0-1.17.25-1.62.7l-.06.06A2 2 0 0 1 2.8 16.88l.06-.06c.45-.45 1.01-.7 1.62-.7.23 0 .46.03.68.09.5.14 1.03-.11 1.3-.56l.07-.12c.45-.7 1.37-1.13 2.29-1.13.92 0 1.84.43 2.29 1.13l.07.12c.27.45.8.7 1.3.56.22-.06.45-.09.68-.09.61 0 1.17.25 1.62.7l.06.06a2 2 0 0 1 0 2.83z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMaintenance({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M21 13v6a1 1 0 0 1-1 1h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V5a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10a4 4 0 1 1-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAnalytics({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14l3-5 4 7 3-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardWithLogo() {
  const [activeSection, setActiveSection] = useState(null);

  const items = [
    { key: "agency", label: "Quản lý đại lý", Icon: IconAgency },
    { key: "reports", label: "Báo cáo hệ thống", Icon: IconReports },
    { key: "users", label: "Quản lý users", Icon: IconUsers },
    { key: "settings", label: "Cấu hình hệ thống", Icon: IconSettings },
    { key: "maintenance", label: "Bảo trì hệ thống", Icon: IconMaintenance },
    { key: "analytics", label: "Analytics", Icon: IconAnalytics },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <header className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Active: ${activeSection ?? "none"}`)}
            className="rounded-full px-4 py-2 bg-white/5 hover:bg-white/7 text-sm"
          >
            Quick status
          </button>

          <div className="text-sm text-slate-400">User: Admin</div>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {items.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-4 rounded-2xl border border-slate-800 bg-white/5 backdrop-blur-md px-5 py-5 text-xl font-semibold text-left hover:border-sky-500/40 hover:bg-sky-500/10 transition shadow-[0_10px_30px_rgba(2,6,23,.4)] ${
                activeSection === key ? "ring-2 ring-sky-400/40" : ""
              }`}
              aria-pressed={activeSection === key}
            >
              <div className="p-2 rounded-lg bg-white/3 text-sky-400">
                <Icon />
              </div>

              <div>{label}</div>
            </button>
          ))}
        </div>

        <section className="mt-8 p-6 rounded-2xl bg-white/3 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-2">Chi tiết</h2>
          <p className="text-slate-300">
            {activeSection ? `Đang xem: ${items.find(i => i.key === activeSection)?.label}` : "Chưa chọn mục nào."}
          </p>
        </section>
      </main>
    </div>
  );
}
