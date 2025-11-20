import React, { useMemo, useState, useEffect, useCallback } from "react";
// Ghi chú: Import apiClient để thực hiện các lời gọi API.
import apiClient from "../../../utils/api/apiClient";

// --- Helper utils (Hàm tiện ích để định dạng số tiền) ---
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") + ' VNĐ' : n;

// --- Component ---
const DealerContractManagement = () => {
  // --- STATE MANAGEMENT ---
  const [dealers, setDealers] = useState([]); // State lưu danh sách tất cả đại lý cho dropdown
  const [selectedDealerId, setSelectedDealerId] = useState(''); // State lưu ID của đại lý đang được chọn

  // State cho dữ liệu của đại lý được chọn
  const [contracts, setContracts] = useState([]);
  const [targets, setTargets] = useState([]);
  const [debts, setDebts] = useState([]);
  
  const [loadingData, setLoadingData] = useState(false); // State để hiển thị "Đang tải..."
  const [tab, setTab] = useState("contracts"); // State quản lý tab đang hoạt động

  // --- Modal states ---
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractForm, setContractForm] = useState(null); // State cho form hợp đồng
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetForm, setTargetForm] = useState(null); // State cho form chỉ tiêu

  // --- DERIVED/SORTED STATE (THÊM MỚI) ---
  // Sắp xếp danh sách hợp đồng theo ID
  const sortedContracts = useMemo(() => {
    return [...contracts].sort((a, b) => a.contractId - b.contractId);
  }, [contracts]);

  // Sắp xếp danh sách chỉ tiêu theo ID
  const sortedTargets = useMemo(() => {
    return [...targets].sort((a, b) => a.targetId - b.targetId);
  }, [targets]);

  // Sắp xếp danh sách công nợ theo ID
  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => a.debtId - b.debtId);
  }, [debts]);
  
  // --- API CALLS ---

  // Ghi chú: useEffect này chạy 1 lần duy nhất để tải danh sách đại lý cho dropdown.
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await apiClient.get('/Dealers');
        setDealers(response.data);
        // Tự động chọn đại lý đầu tiên trong danh sách để hiển thị chi tiết.
        if (response.data && response.data.length > 0) {
            setSelectedDealerId(response.data[0].dealerId);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đại lý:", error);
      }
    };
    fetchDealers();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần.

  // Ghi chú: useEffect này sẽ chạy lại mỗi khi người dùng chọn một đại lý khác.
  useEffect(() => {
    if (!selectedDealerId) return; // Không làm gì nếu chưa có đại lý nào được chọn.

    const fetchDealerDetails = async () => {
        setLoadingData(true);
        try {
            // Gọi song song 3 API để lấy dữ liệu của đại lý được chọn.
            const [contractsRes, targetsRes, debtsRes] = await Promise.all([
                apiClient.get(`/api/manage/dealers/${selectedDealerId}/contracts`),
                apiClient.get(`/api/manage/dealers/${selectedDealerId}/targets`),
                apiClient.get(`/api/manage/dealers/${selectedDealerId}/debts`)
            ]);
            setContracts(contractsRes.data);
            setTargets(targetsRes.data);
            setDebts(debtsRes.data);
        } catch (error) {
            console.error(`Lỗi khi tải chi tiết đại lý ${selectedDealerId}:`, error);
        } finally {
            setLoadingData(false);
        }
    };

    fetchDealerDetails();
  }, [selectedDealerId]); // Phụ thuộc vào selectedDealerId

  // --- LOGIC LƯU DỮ LIỆU ---

  const handleContractSave = async (e) => {
    e.preventDefault();
    if (!selectedDealerId) return alert("Vui lòng chọn một đại lý.");
    try {
      await apiClient.post(`/api/manage/dealers/${selectedDealerId}/contracts`, contractForm);
      setShowContractModal(false);
      // Tải lại chỉ riêng tab hợp đồng để cập nhật.
      const contractsRes = await apiClient.get(`/api/manage/dealers/${selectedDealerId}/contracts`);
      setContracts(contractsRes.data);
    } catch (error) {
      console.error("Lỗi khi lưu hợp đồng:", error);
      alert("Lưu hợp đồng thất bại.");
    }
  };
  
  const handleTargetSave = async (e) => {
    e.preventDefault();
    if (!selectedDealerId) return alert("Vui lòng chọn một đại lý.");
    const payload = {
      ...targetForm,
      salesTarget: Number(targetForm.salesTarget)
    };
    try {
      await apiClient.post(`/api/manage/dealers/${selectedDealerId}/targets`, payload);
      setShowTargetModal(false);
      // Tải lại chỉ riêng tab chỉ tiêu để cập nhật.
      const targetsRes = await apiClient.get(`/api/manage/dealers/${selectedDealerId}/targets`);
      setTargets(targetsRes.data);
    } catch (error) {
      console.error("Lỗi khi lưu chỉ tiêu:", error);
      alert("Lưu chỉ tiêu thất bại.");
    }
  };

  // --- UI HELPERS ---

  const openCreateContract = () => {
    setContractForm({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      terms: "",
      status: "Active",
    });
    setShowContractModal(true);
  };
  
  const openCreateTarget = () => {
    setTargetForm({
      periodStart: "",
      periodEnd: "",
      salesTarget: 0,
    });
    setShowTargetModal(true);
  };
  
  const selectedDealerName = dealers.find(d => d.dealerId === parseInt(selectedDealerId))?.name || '';
  
  return (
    <div className="space-y-6 p-4 text-white">
      <h1 className="text-2xl font-bold text-sky-400 py-2">Hợp đồng & KPI đại lý</h1>
      
      <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
        <label className="font-semibold whitespace-nowrap">Xem thông tin của Đại lý:</label>
        <select
          value={selectedDealerId}
          onChange={(e) => setSelectedDealerId(e.target.value)}
          className="w-full md:w-auto rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2"
        >
          {dealers.map(d => (
            <option key={d.dealerId} value={d.dealerId}>{d.name}</option>
          ))}
        </select>
      </div>

      {selectedDealerId ? (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { key: "contracts", label: "Hợp đồng" },
              { key: "targets", label: "Chỉ tiêu doanh số" },
              { key: "debts", label: "Công nợ" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  tab === t.key ? "bg-sky-600 text-white" : "bg-slate-900/40 border border-slate-800 hover:bg-sky-500/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
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
          </div>

          {loadingData ? <div className="text-center p-6">Đang tải dữ liệu cho đại lý...</div> : 
          <>
            {/* Panels */}
            {tab === "contracts" && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
                <table className="min-w-full border-collapse text-base">
                    <thead className="bg-slate-800/60 text-sky-300">
                    <tr>
                        <th className="p-3 text-left">Mã HĐ</th>
                        <th className="p-3 text-left">Bắt đầu</th>
                        <th className="p-3 text-left">Kết thúc</th>
                        <th className="p-3 text-left">Điều khoản</th>
                        <th className="p-3 text-left">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* CẬP NHẬT: Dùng sortedContracts và hiển thị contractId */}
                    {sortedContracts.map((c) => (
                        <tr key={c.contractId} className="border-t border-slate-800 hover:bg-slate-800/30">
                        <td className="p-3 font-medium">{c.contractId}</td>
                        <td className="p-3">{c.startDate}</td>
                        <td className="p-3">{c.endDate}</td>
                        <td className="p-3 truncate max-w-[40ch]" title={c.terms}>{c.terms}</td>
                        <td className="p-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/40">{c.status}</span></td>
                        </tr>
                    ))}
                    {sortedContracts.length === 0 && ( <tr><td colSpan="5" className="p-6 text-center text-slate-400">Đại lý này chưa có hợp đồng nào.</td></tr> )}
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
                        <th className="p-3 text-left">Kỳ bắt đầu</th>
                        <th className="p-3 text-left">Kỳ kết thúc</th>
                        <th className="p-3 text-left">Mục tiêu</th>
                        <th className="p-3 text-left">Thực đạt</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* CẬP NHẬT: Dùng sortedTargets và hiển thị targetId */}
                    {sortedTargets.map((t) => (
                        <tr key={t.targetId} className="border-t border-slate-800 hover:bg-slate-800/30">
                        <td className="p-3 font-medium">{t.targetId}</td>
                        <td className="p-3">{t.periodStart}</td>
                        <td className="p-3">{t.periodEnd}</td>
                        <td className="p-3 font-bold text-yellow-400">{formatMoney(t.salesTarget)}</td>
                        <td className="p-3 font-bold text-emerald-400">{formatMoney(t.actualSales)}</td>
                        </tr>
                    ))}
                     {sortedTargets.length === 0 && ( <tr><td colSpan="5" className="p-6 text-center text-slate-400">Đại lý này chưa có chỉ tiêu nào.</td></tr> )}
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
                        <th className="p-3 text-left">Số tiền (VNĐ)</th>
                        <th className="p-3 text-left">Hạn thanh toán</th>
                        <th className="p-3 text-left">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* CẬP NHẬT: Dùng sortedDebts và hiển thị debtId */}
                    {sortedDebts.map((d) => (
                        <tr key={d.debtId} className="border-t border-slate-800 hover:bg-slate-800/30">
                        <td className="p-3 font-medium">{d.debtId}</td>
                        <td className="p-3 font-bold">{formatMoney(d.amountDue)}</td>
                        <td className="p-3">{d.dueDate}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "Paid" ? "text-emerald-300 bg-emerald-800/40" : "text-rose-300 bg-rose-800/40"}`}>{d.status}</span>
                        </td>
                        </tr>
                    ))}
                    {sortedDebts.length === 0 && ( <tr><td colSpan="4" className="p-6 text-center text-slate-400">Đại lý này không có công nợ nào.</td></tr> )}
                    </tbody>
                </table>
                </div>
            )}
          </>
          }
        </>
      ) : <div className="text-center p-6">Vui lòng chọn một đại lý để xem thông tin.</div>}

      {/* ========== Modals ========== */}
      {showContractModal && contractForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setShowContractModal(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold px-5 py-4 border-b border-slate-800">Tạo hợp đồng mới cho {selectedDealerName}</h3>
            <form onSubmit={handleContractSave} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Ngày bắt đầu *</label>
                  <input type="date" value={contractForm.startDate} onChange={(e) => setContractForm({...contractForm, startDate: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
                <div>
                  <label>Ngày kết thúc *</label>
                  <input type="date" value={contractForm.endDate} onChange={(e) => setContractForm({...contractForm, endDate: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
                <div className="md:col-span-2">
                  <label>Điều khoản</label>
                  <textarea rows="4" value={contractForm.terms} onChange={(e) => setContractForm({...contractForm, terms: e.target.value})} className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
                <div>
                  <label>Trạng thái</label>
                  <select value={contractForm.status} onChange={(e) => setContractForm({...contractForm, status: e.target.value})} className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowContractModal(false)} className="px-4 py-2 rounded-xl border border-slate-700">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold">Tạo hợp đồng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTargetModal && targetForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setShowTargetModal(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold px-5 py-4 border-b border-slate-800">Tạo chỉ tiêu mới cho {selectedDealerName}</h3>
            <form onSubmit={handleTargetSave} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Kỳ bắt đầu *</label>
                  <input type="date" value={targetForm.periodStart} onChange={(e) => setTargetForm({...targetForm, periodStart: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
                <div>
                  <label>Kỳ kết thúc *</label>
                  <input type="date" value={targetForm.periodEnd} onChange={(e) => setTargetForm({...targetForm, periodEnd: e.target.value})} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
                <div className="md:col-span-2">
                  <label>Mục tiêu (Doanh số) *</label>
                  <input type="number" min="1" value={targetForm.salesTarget} onChange={(e) => setTargetForm({...targetForm, salesTarget: e.target.value})} required placeholder="Ví dụ: 5000000000" className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowTargetModal(false)} className="px-4 py-2 rounded-xl border border-slate-700">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold">Tạo chỉ tiêu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerContractManagement;