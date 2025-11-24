import React, { useMemo, useState, useEffect } from "react";
// Import apiClient để giữ cấu trúc, dù bài này đang chạy Mock
import apiClient from "../../../utils/api/apiClient";

// --- 1. MOCK DATA (DỮ LIỆU GIẢ LẬP) ---
const MOCK_CONTRACTS_DATA = [
    {
        contractId: 101,
        contractNumber: "HD-VF-2024-001",
        startDate: "2024-01-01",
        endDate: "2025-01-01",
        commissionRate: 5.5,
        terms: "Thưởng quý 2% nếu đạt KPI",
        status: "Active",
        // Link file PDF mẫu trên internet để test tính năng xem
        documentLink: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: "hop_dong_mau_2024.pdf"
    },
    {
        contractId: 102,
        contractNumber: "HD-VF-2024-002",
        startDate: "2024-06-01",
        endDate: "2025-06-01",
        commissionRate: 6.0,
        terms: "Đại lý cấp 1 khu vực Hà Nội",
        status: "Active",
        documentLink: "", 
        fileName: ""
    }
];

const MOCK_DEALERS = [
    { dealerId: 1, name: "VinFast Thăng Long (Demo)" },
    { dealerId: 2, name: "VinFast An Thái (Demo)" },
    { dealerId: 3, name: "VinFast Hải Châu (Demo)" }
];

// --- 2. HELPER UTILS ---
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") + ' VNĐ' : n;

const exportToCSV = (data, fileName) => {
    if (!data || data.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }
    const headers = ["ID", "So HD", "Ngay bat dau", "Ngay ket thuc", "Hoa hong (%)", "Trang thai", "Ghi chu"];
    const rows = data.map(item => [
        item.contractId,
        item.contractNumber || "",
        item.startDate,
        item.endDate,
        item.commissionRate,
        item.status,
        `"${item.terms || ""}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- 3. MAIN COMPONENT ---
const DealerContractManagement = () => {
  // --- STATE ---
  const [dealers, setDealers] = useState([]); 
  const [selectedDealerId, setSelectedDealerId] = useState(''); 

  const [contracts, setContracts] = useState([]);
  const [targets, setTargets] = useState([]);
  const [debts, setDebts] = useState([]);

  const [loadingData, setLoadingData] = useState(false); 
  const [tab, setTab] = useState("contracts"); 

  // Modal State
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractForm, setContractForm] = useState(null); 
  
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetForm, setTargetForm] = useState(null); 

  // Sorted Data
  const sortedContracts = useMemo(() => [...contracts].sort((a, b) => b.contractId - a.contractId), [contracts]);
  const sortedTargets = useMemo(() => [...targets].sort((a, b) => b.targetId - a.targetId), [targets]);
  const sortedDebts = useMemo(() => [...debts].sort((a, b) => a.debtId - b.debtId), [debts]);

  // --- LOGIC 1: LOAD DEALERS (MOCK) ---
  useEffect(() => {
    // Giả lập API call lấy danh sách đại lý
    setDealers(MOCK_DEALERS);
    setSelectedDealerId(MOCK_DEALERS[0].dealerId);
  }, []); 

  // --- LOGIC 2: LOAD DATA CHI TIẾT (MOCK) ---
  useEffect(() => {
    if (!selectedDealerId) return; 

    setLoadingData(true);
    // Giả lập độ trễ mạng (500ms)
    setTimeout(() => {
        setContracts(MOCK_CONTRACTS_DATA);
        // Mock data cho KPI và Công nợ (để trống hoặc thêm tùy ý)
        setTargets([
            { targetId: 1, periodStart: '2024-01-01', periodEnd: '2024-12-31', salesTarget: 5000000000, actualSales: 4200000000 }
        ]);
        setDebts([
            { debtId: 1, amountDue: 150000000, dueDate: '2024-12-20', status: 'Pending' }
        ]);
        setLoadingData(false);
    }, 500);

  }, [selectedDealerId]); 

  // --- LOGIC 3: UPLOAD FILE & CREATE BLOB URL ---
  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          // MAGIC: Tạo đường dẫn ảo truy cập trực tiếp file trên máy user
          const blobUrl = URL.createObjectURL(file);
          
          setContractForm({
              ...contractForm,
              documentLink: blobUrl, // Lưu link để hiển thị/tải
              fileName: file.name    // Lưu tên file
          });
      }
  };

  // --- LOGIC 4: SAVE CONTRACT (LOCAL STATE) ---
  const handleContractSave = (e) => {
    e.preventDefault();
    
    // Validate ngày tháng
    if (new Date(contractForm.endDate) <= new Date(contractForm.startDate)) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
    }

    // Tạo object mới (Giả lập Backend trả về ID)
    const newContract = {
        ...contractForm,
        contractId: Math.floor(Math.random() * 10000) + 100, // Random ID
        status: "Active"
    };

    // Cập nhật State (Thêm vào đầu danh sách)
    setContracts([newContract, ...contracts]);
    setShowContractModal(false);
    alert("Đã tạo hợp đồng mới thành công (Mock Data)!");
  };
  
  // Logic Save Target (Mock)
  const handleTargetSave = (e) => {
    e.preventDefault();
    const newTarget = {
        ...targetForm,
        targetId: Math.floor(Math.random() * 1000),
        actualSales: 0 // Mới tạo chưa có doanh số
    };
    setTargets([newTarget, ...targets]);
    setShowTargetModal(false);
  };

  // --- UI ACTIONS ---
  const openCreateContract = () => {
    setContractForm({
      contractNumber: "", 
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "", 
      commissionRate: 0, 
      documentLink: "", 
      fileName: "",
      terms: "",
      status: "Active",
    });
    setShowContractModal(true);
  };
  
  const openCreateTarget = () => {
    setTargetForm({
      periodStart: "", periodEnd: "", salesTarget: 0,
    });
    setShowTargetModal(true);
  };

  const handleExport = () => {
      const dealerName = dealers.find(d => d.dealerId == selectedDealerId)?.name || "DaiLy";
      exportToCSV(sortedContracts, `HD_${dealerName}.csv`);
  };
  
  const selectedDealerName = dealers.find(d => d.dealerId == selectedDealerId)?.name || '';

  return (
    <div className="space-y-6 p-4 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-sky-400 py-2">Quản lý Hợp đồng & KPI Đại lý</h1>
      
      {/* 1. SELECTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="font-semibold whitespace-nowrap text-slate-300">Đại lý:</label>
            <select
            value={selectedDealerId}
            onChange={(e) => setSelectedDealerId(e.target.value)}
            className="flex-1 md:w-64 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none"
            >
            {dealers.map(d => (
                <option key={d.dealerId} value={d.dealerId}>{d.name}</option>
            ))}
            </select>
        </div>
        <div className="hidden md:block h-6 w-px bg-slate-700 mx-2"></div>
        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
            ⚠ Chế độ Demo (Mock Data)
        </span>
      </div>

      {selectedDealerId ? (
        <>
          {/* 2. TABS & BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                {[
                { key: "contracts", label: "Hợp đồng" },
                { key: "targets", label: "KPI Doanh số" },
                { key: "debts", label: "Công nợ" },
                ].map((t) => (
                <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                    tab === t.key ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                >
                    {t.label}
                </button>
                ))}
            </div>

            <div className="flex gap-3">
                {/* NÚT XUẤT FILE */}
                {tab === "contracts" && sortedContracts.length > 0 && (
                     <button onClick={handleExport} className="px-4 py-2 rounded-xl border border-emerald-600/50 text-emerald-400 hover:bg-emerald-600 hover:text-white font-semibold transition flex items-center gap-2">
                        ⬇ Xuất Excel
                     </button>
                )}
                {/* NÚT THÊM MỚI */}
                {tab === "contracts" && (
                    <button className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg transition" onClick={openCreateContract}>
                    + Hợp đồng mới
                    </button>
                )}
                {tab === "targets" && (
                    <button className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg transition" onClick={openCreateTarget}>
                    + KPI mới
                    </button>
                )}
            </div>
          </div>

          {/* 3. MAIN CONTENT */}
          {loadingData ? <div className="text-center p-12 text-slate-400 animate-pulse">Đang tải dữ liệu mock...</div> : 
          <div className="mt-4">
            
            {/* --- TAB HỢP ĐỒNG --- */}
            {tab === "contracts" && (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl backdrop-blur-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-800/80 text-sky-300 font-bold uppercase tracking-wider">
                    <tr>
                        <th className="p-4 text-left">Số Hợp Đồng</th>
                        <th className="p-4 text-left">Hiệu lực</th>
                        <th className="p-4 text-left">Hết hạn</th>
                        <th className="p-4 text-left">Hoa hồng</th>
                        <th className="p-4 text-left">Điều khoản</th>
                        <th className="p-4 text-left">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {sortedContracts.map((c) => (
                        <tr key={c.contractId} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono text-white">
                            <div className="font-bold">{c.contractNumber || `#${c.contractId}`}</div>
                            {/* LINK XEM FILE BLOB/MOCK */}
                            {c.documentLink && (
                                <a href={c.documentLink} target="_blank" rel="noreferrer" download={c.fileName || "hop-dong.pdf"}
                                   className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 hover:underline mt-1 bg-sky-900/20 px-2 py-0.5 rounded border border-sky-800">
                                   📎 {c.fileName ? `Tải: ${c.fileName}` : "Xem file scan"}
                                </a>
                            )}
                        </td>
                        <td className="p-4 text-emerald-300">{new Date(c.startDate).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 text-rose-300">{new Date(c.endDate).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 font-bold text-yellow-400">{c.commissionRate}%</td>
                        <td className="p-4 truncate max-w-[25ch] text-slate-400" title={c.terms}>{c.terms}</td>
                        <td className="p-4">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {c.status}
                            </span>
                        </td>
                        </tr>
                    ))}
                    {sortedContracts.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chưa có hợp đồng nào.</td></tr>}
                    </tbody>
                </table>
                </div>
            )}

            {/* --- TAB KPI --- */}
            {tab === "targets" && (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-800/80 text-sky-300 font-bold uppercase">
                    <tr>
                        <th className="p-4 text-left">Kỳ đánh giá</th>
                        <th className="p-4 text-left">Mục tiêu</th>
                        <th className="p-4 text-left">Thực đạt</th>
                        <th className="p-4 text-left">Tiến độ</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {sortedTargets.map((t) => {
                        const percent = t.salesTarget > 0 ? Math.round((t.actualSales / t.salesTarget) * 100) : 0;
                        return (
                        <tr key={t.targetId} className="hover:bg-slate-800/40">
                            <td className="p-4 text-slate-300">{t.periodStart} ➝ {t.periodEnd}</td>
                            <td className="p-4 font-bold text-yellow-400">{formatMoney(t.salesTarget)}</td>
                            <td className="p-4 font-bold text-emerald-400">{formatMoney(t.actualSales)}</td>
                            <td className="p-4 w-48">
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${Math.min(percent, 100)}%`}}></div>
                                </div>
                                <div className="text-right text-xs text-slate-400 mt-1">{percent}%</div>
                            </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
                </div>
            )}

            {/* --- TAB CÔNG NỢ --- */}
            {tab === "debts" && (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-800/80 text-sky-300 font-bold uppercase">
                    <tr>
                        <th className="p-4 text-left">Mã Nợ</th>
                        <th className="p-4 text-left">Số tiền</th>
                        <th className="p-4 text-left">Hạn thanh toán</th>
                        <th className="p-4 text-left">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                    {sortedDebts.map((d) => (
                        <tr key={d.debtId} className="hover:bg-slate-800/40">
                        <td className="p-4 font-mono">DEBT-{d.debtId}</td>
                        <td className="p-4 font-bold text-white text-lg">{formatMoney(d.amountDue)}</td>
                        <td className="p-4 text-slate-300">{d.dueDate}</td>
                        <td className="p-4"><span className="text-rose-400 font-bold">{d.status}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
          </div>
          }
        </>
      ) : <div className="text-center p-12 text-slate-500">← Vui lòng chọn một đại lý</div>}

      {/* ========== MODAL TẠO HỢP ĐỒNG (CÓ UPLOAD FILE) ========== */}
      {showContractModal && contractForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowContractModal(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-sky-400">Tạo Hợp đồng mới</h3>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Mock Mode</span>
            </div>
            
            <form onSubmit={handleContractSave} className="px-6 py-5 space-y-5">
              
              {/* Row 1: Số HĐ & File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Số Hợp đồng *</label>
                    <input type="text" placeholder="VD: HD-2025-00X" required
                        value={contractForm.contractNumber} 
                        onChange={(e) => setContractForm({...contractForm, contractNumber: e.target.value})} 
                        className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white focus:border-sky-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">File Hợp đồng (Scan)</label>
                    <div className="mt-1 flex items-center gap-2">
                        <label className="flex-1 cursor-pointer bg-slate-800 border border-slate-600 hover:border-sky-500 text-slate-300 px-4 py-2.5 rounded-xl flex items-center justify-between group">
                            <span className="truncate max-w-[150px] text-sm">
                                {contractForm.fileName || "Chọn file PDF/Anh..."}
                            </span>
                            <span className="bg-slate-700 group-hover:bg-sky-600 text-xs px-2 py-1 rounded transition text-white">Browse</span>
                            <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                  </div>
              </div>

              {/* Row 2: Ngày tháng */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Ngày hiệu lực *</label>
                  <input type="date" value={contractForm.startDate} onChange={(e) => setContractForm({...contractForm, startDate: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Ngày hết hạn *</label>
                  <input type="date" value={contractForm.endDate} onChange={(e) => setContractForm({...contractForm, endDate: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Hoa hồng (%)</label>
                  <input type="number" min="0" step="0.1" value={contractForm.commissionRate} onChange={(e) => setContractForm({...contractForm, commissionRate: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white" />
                </div>
              </div>

              {/* Row 3: Điều khoản */}
              <div>
                <label className="text-sm text-slate-400">Điều khoản & Ghi chú</label>
                <textarea rows="3" placeholder="Ghi chú các điều khoản quan trọng..."
                    value={contractForm.terms} 
                    onChange={(e) => setContractForm({...contractForm, terms: e.target.value})} 
                    className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white focus:border-sky-500 outline-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowContractModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 font-medium">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg">Lưu Hợp đồng</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal Target (Giữ nguyên logic cũ) */}
      {showTargetModal && targetForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowTargetModal(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold px-6 py-4 border-b border-slate-800 text-sky-400">Thiết lập KPI</h3>
            <form onSubmit={handleTargetSave} className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Từ ngày</label>
                  <input type="date" value={targetForm.periodStart} onChange={(e) => setTargetForm({...targetForm, periodStart: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Đến ngày</label>
                  <input type="date" value={targetForm.periodEnd} onChange={(e) => setTargetForm({...targetForm, periodEnd: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white" />
                </div>
              </div>
              <div>
                  <label className="text-sm text-slate-400">Mục tiêu Doanh số (VNĐ)</label>
                  <input type="number" min="1" value={targetForm.salesTarget} onChange={(e) => setTargetForm({...targetForm, salesTarget: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-800 border border-slate-600 p-2.5 text-white font-bold text-lg" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowTargetModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 font-medium">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg">Lưu KPI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerContractManagement;