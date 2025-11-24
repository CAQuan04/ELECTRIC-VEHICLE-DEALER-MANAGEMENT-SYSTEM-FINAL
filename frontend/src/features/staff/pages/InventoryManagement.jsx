import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../../utils/api/apiClient";
import { useAuth } from "../../../context/AuthContext";

// --- DATA ẢO CHO YÊU CẦU ĐẶT HÀNG (MOCK DATA) ---
const MOCK_REQUESTS = [
    { requestId: 88, dealerId: 101, dealerName: "VinFast Thăng Long", productId: 5, productName: "VF 8 Eco", qty: 2, createdAt: "2025-11-20T08:30:00Z", status: "Pending" },
    { requestId: 89, dealerId: 102, dealerName: "VinFast An Thái", productId: 7, productName: "VF 9 Plus", qty: 1, createdAt: "2025-11-21T09:15:00Z", status: "Pending" },
    { requestId: 90, dealerId: 103, dealerName: "VinFast Hải Châu", productId: 3, productName: "VF e34", qty: 5, createdAt: "2025-11-22T10:00:00Z", status: "Pending" },
];

const InventoryManagement = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("inventory");

    // --- STATE DATA ---
    const [inventories, setInventories] = useState([]);
    const [distributions, setDistributions] = useState([]);
    const [purchaseRequests, setPurchaseRequests] = useState([]); // Mock Data
    
    // --- STATE LOADING ---
    const [loading, setLoading] = useState(false);
    
    // --- STATE MODAL & FORM ---
    const [showFormModal, setShowFormModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [form, setForm] = useState({});
    
    // State cho Action
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState("");
    const [actionData, setActionData] = useState({ approvedQty: 0, reason: "" });

    // --- STATE DROPDOWN ---
    const [vehicles, setVehicles] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [configs, setConfigs] = useState([]); 

    const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

    // --- 1. FETCH DATA ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [invRes, distRes] = await Promise.all([
                apiClient.get('/inventory/summary'), 
                apiClient.get('/inventory/distributions/summary')
            ]);
            
            setInventories((invRes.data || []).sort((a, b) => a.inventoryId - b.inventoryId));
            setDistributions((distRes.data || []).sort((a, b) => a.distId - b.distId));

            // LOAD MOCK DATA CHO REQUESTS
            if (canManage) {
                // Chỉ set mock data lần đầu nếu mảng rỗng để tránh reset trạng thái khi thao tác
                setPurchaseRequests(prev => prev.length === 0 ? MOCK_REQUESTS : prev);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    }, [canManage]);

    const fetchDropdowns = useCallback(async () => {
        try {
            const [vRes, dRes] = await Promise.all([
                apiClient.get('/admin/vehicles'),
                apiClient.get('/dealers/basic')
            ]);
            setVehicles(vRes.data || []);
            setDealers(dRes.data || []);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        fetchData();
        fetchDropdowns();
    }, [fetchData, fetchDropdowns]);


    // --- 2. XỬ LÝ LOGIC REQUEST (DATA ẢO) ---
    
    const openActionModal = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        if (type === 'approve') {
            setActionData({ approvedQty: request.qty, reason: "" });
        } else {
            setActionData({ approvedQty: 0, reason: "" });
        }
        setShowActionModal(true);
    };

    // --- SỬA ĐỔI CHÍNH TẠI ĐÂY: UPDATE TRẠNG THÁI THAY VÌ XÓA ---
    const submitAction = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        if (actionType === 'approve') {
            alert(`[MOCK] Đã duyệt yêu cầu #${selectedRequest.requestId}`);
            
            // Cập nhật trạng thái thành 'Approved' thay vì xóa
            setPurchaseRequests(prev => prev.map(req => 
                req.requestId === selectedRequest.requestId 
                ? { ...req, status: 'Approved' } 
                : req
            ));

            if (window.confirm("Bạn có muốn tạo phiếu điều phối (Distribution) cho yêu cầu này ngay không?")) {
                prepareDistributionFromRequest(selectedRequest, actionData.approvedQty);
            }
        } else {
            alert(`[MOCK] Đã từ chối yêu cầu #${selectedRequest.requestId}`);
            
            // Cập nhật trạng thái thành 'Rejected' thay vì xóa
            setPurchaseRequests(prev => prev.map(req => 
                req.requestId === selectedRequest.requestId 
                ? { ...req, status: 'Rejected' } 
                : req
            ));
        }
        
        setShowActionModal(false);
    };

    // --- 3. XỬ LÝ FORM TẠO MỚI ---

    const prepareDistributionFromRequest = async (req, qty) => {
        await handleVehicleChangeInModal(req.productId || req.vehicleId); 
        
        setForm({
            vehicleId: req.productId || req.vehicleId,
            configId: '', 
            quantity: qty,
            fromLocation: 'Kho Tong Ha Noi',
            toDealerId: req.dealerId,
            scheduledDate: new Date().toISOString().slice(0, 10),
        });
        setActiveTab('distribution');
        setShowFormModal(true);
        setShowActionModal(false);
    };

    const openCreateModal = (type) => {
        if (type === 'inventory') {
            setForm({
                vehicleId: '', configId: '', quantity: '',
                locationType: "HQ", locationId: '1' 
            });
        } else {
            setForm({
                vehicleId: '', configId: '', quantity: '',
                fromLocation: 'Kho Tong Ha Noi', toDealerId: '',
                scheduledDate: new Date().toISOString().slice(0, 10),
            });
        }
        setShowFormModal(true);
    };

    const handleSaveForm = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'inventory') {
                await apiClient.post('/inventory/stock', { ...form, quantity: parseInt(form.quantity) });
            } else {
                // API LUỒNG 3
                const payload = {
                    fromLocation: "HQ",
                    toDealerId: parseInt(form.toDealerId),
                    vehicleId: parseInt(form.vehicleId),
                    configId: parseInt(form.configId),
                    qty: parseInt(form.quantity),
                    scheduledDate: form.scheduledDate
                };
                await apiClient.post('/api/v1/distributions', payload);
            }
            alert("Lưu thành công!");
            setShowFormModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("Lỗi khi lưu dữ liệu. Kiểm tra API.");
        }
    };

    // --- HELPER ---
    const handleVehicleChangeInModal = async (vehicleId) => {
        setForm(prev => ({...prev, vehicleId, configId: ''}));
        if (!vehicleId) { setConfigs([]); return; }
        try {
            const res = await apiClient.get(`/vehicles/${vehicleId}/configs`);
            setConfigs(res.data || []);
        } catch (error) { setConfigs([]); }
    };
    
    // --- UI STYLES ---
    const btnBase = "px-3 py-1.5 rounded-xl font-semibold transition duration-150 text-sm flex items-center justify-center gap-1";

    return (
        <div className="space-y-6 p-4 text-white min-h-screen">
            <h1 className="text-3xl font-bold text-slate-100 py-2">Quản lý tồn kho & Điều phối</h1>

            {/* TABS */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'inventory', label: 'Tồn kho', color: 'emerald', show: true },
                    { id: 'distribution', label: 'Điều phối xe', color: 'sky', show: true },
                    { id: 'requests', label: 'Yêu cầu đặt hàng', color: 'orange', show: canManage, count: purchaseRequests.filter(r => r.status === 'Pending').length }, // Chỉ đếm số pending
                ].map(tab => tab.show && (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                        className={`rounded-full border px-5 py-2.5 font-semibold transition flex items-center gap-2
                        ${activeTab === tab.id 
                            ? `bg-${tab.color}-600 text-white border-${tab.color}-600 shadow-lg` 
                            : `bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-${tab.color}-500/10 hover:border-${tab.color}-500/40`}`}>
                        {tab.label}
                        {tab.count > 0 && <span className="bg-white text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* --- TAB 1: INVENTORY --- */}
            {activeTab === "inventory" && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-emerald-400">Danh sách Tồn kho</h2>
                        {canManage && <button onClick={() => openCreateModal('inventory')} className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-500`}>+ Nhập/Xuất kho</button>}
                    </div>
                     <table className="min-w-full text-base">
                        <thead className="bg-slate-800/60 text-emerald-300 text-left">
                            <tr>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Sản phẩm</th>
                                <th className="p-3">Địa điểm</th>
                                <th className="p-3">Số lượng</th>
                                <th className="p-3">Ngày cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && inventories.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">Đang tải...</td></tr> :
                            inventories.map(i => (
                                <tr key={i.inventoryId} className="border-t border-slate-800 hover:bg-slate-800/30">
                                    <td className="p-3 font-mono text-emerald-200">#{i.inventoryId}</td>
                                    <td className="p-3 font-medium text-white">{i.vehicleName} ({i.configName})</td>
                                    <td className="p-3">{i.locationName}</td>
                                    <td className="p-3 font-bold text-emerald-400">{i.quantity}</td>
                                    <td className="p-3 text-slate-400">{new Date(i.updatedAt).toLocaleDateString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB 2: DISTRIBUTION --- */}
            {activeTab === "distribution" && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-sky-400">Danh sách Phiếu điều phối</h2>
                        {canManage && <button onClick={() => openCreateModal('distribution')} className={`${btnBase} bg-sky-600 text-white hover:bg-sky-500`}>+ Tạo phiếu</button>}
                    </div>
                    <table className="min-w-full text-base">
                        <thead className="bg-slate-800/60 text-sky-300 text-left">
                            <tr>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Sản phẩm</th>
                                <th className="p-3">Số lượng</th>
                                <th className="p-3">Từ</th>
                                <th className="p-3">Đến Đại lý</th>
                                <th className="p-3">Ngày giao</th>
                                <th className="p-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && distributions.length === 0 ? <tr><td colSpan="7" className="p-4 text-center">Đang tải...</td></tr> :
                            distributions.map(d => (
                                <tr key={d.distId} className="border-t border-slate-800 hover:bg-slate-800/30">
                                    <td className="p-3 font-mono text-sky-200">#{d.distId}</td>
                                    <td className="p-3 font-medium text-white">{d.vehicleName} ({d.configName})</td>
                                    <td className="p-3 font-bold">{d.quantity}</td>
                                    <td className="p-3">{d.fromLocation}</td>
                                    <td className="p-3 font-medium text-white">{d.toDealerName}</td>
                                    <td className="p-3">{d.scheduledDate}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB 3: REQUESTS (MOCK DATA) --- */}
            {activeTab === "requests" && canManage && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-orange-400">Yêu cầu đặt hàng</h2>
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 text-xs rounded border border-orange-500/30">DATA ẢO</span>
                    </div>
                    <table className="min-w-full text-base">
                        <thead className="bg-slate-800/60 text-orange-300 text-left">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Đại lý</th>
                                <th className="p-3">Sản phẩm</th>
                                <th className="p-3">SL</th>
                                <th className="p-3">Ngày tạo</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseRequests.length === 0 ? <tr><td colSpan="7" className="p-4 text-center text-slate-500">Không có yêu cầu nào.</td></tr> :
                            purchaseRequests.map(req => (
                                <tr key={req.requestId} className="border-t border-slate-800 hover:bg-slate-800/30">
                                    <td className="p-3 font-mono text-orange-200">#{req.requestId}</td>
                                    <td className="p-3 font-medium text-white">{req.dealerName}</td>
                                    <td className="p-3">{req.productName}</td>
                                    <td className="p-3 font-bold text-white">{req.qty}</td>
                                    <td className="p-3 text-slate-400">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                                    {/* CỘT TRẠNG THÁI */}
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border 
                                            ${req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                              req.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                            {req.status === 'Approved' ? 'Đã duyệt' : req.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    {/* CỘT TÁC VỤ */}
                                    <td className="p-3 flex justify-center gap-2">
                                        {/* CHỈ HIỆN NÚT NẾU LÀ PENDING */}
                                        {req.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => openActionModal(req, 'approve')} 
                                                    className={`${btnBase} bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-600/50`}>
                                                    ✓ Duyệt
                                                </button>
                                                <button onClick={() => openActionModal(req, 'reject')}
                                                    className={`${btnBase} bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/50`}>
                                                    ✕ Từ chối
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-slate-500 text-sm italic">Đã xử lý</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* === MODAL 1: ACTION (MOCK) === */}
            {showActionModal && selectedRequest && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setShowActionModal(false)}>
                    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                        <h3 className={`text-xl font-bold mb-4 ${actionType === 'approve' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {actionType === 'approve' ? 'Duyệt Yêu Cầu' : 'Từ Chối Yêu Cầu'} #{selectedRequest.requestId}
                        </h3>
                        <form onSubmit={submitAction} className="space-y-4">
                            {actionType === 'approve' ? (
                                <div>
                                    <label className="text-sm text-slate-300 mb-1 block">Số lượng duyệt (Yêu cầu: {selectedRequest.qty})</label>
                                    <input type="number" min="1" max={selectedRequest.qty}
                                        value={actionData.approvedQty}
                                        onChange={e => setActionData({...actionData, approvedQty: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">* (Mock) Không ảnh hưởng DB thật.</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm text-slate-300 mb-1 block">Lý do từ chối</label>
                                    <textarea 
                                        value={actionData.reason}
                                        onChange={e => setActionData({...actionData, reason: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white focus:border-red-500 outline-none h-24"
                                    />
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowActionModal(false)} className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300">Hủy</button>
                                <button type="submit" className={`px-4 py-2 rounded-xl font-bold text-white ${actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>
                                    Xác nhận (Ảo)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* === MODAL 2: FORM CREATE === */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setShowFormModal(false)}>
                    <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 text-white">
                            {activeTab === 'inventory' ? 'Nhập/Xuất Kho' : 'Tạo Phiếu Điều Phối Mới'}
                        </h3>
                        <form onSubmit={handleSaveForm} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400">Chọn xe</label>
                                    <select name="vehicleId" value={form.vehicleId} onChange={e => handleVehicleChangeInModal(e.target.value)} required 
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl p-2.5 text-white">
                                        <option value="">-- Chọn xe --</option>
                                        {vehicles.map(v => <option key={v.vehicleId} value={v.vehicleId}>{v.model}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Phiên bản</label>
                                    <select name="configId" value={form.configId} onChange={e => setForm({...form, configId: e.target.value})} required disabled={!form.vehicleId}
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl p-2.5 text-white disabled:opacity-50">
                                        <option value="">-- Chọn phiên bản --</option>
                                        {configs.map(c => <option key={c.configId} value={c.configId}>{c.color} - {c.batteryKwh}kWh</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Số lượng</label>
                                    <input type="number" name="quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required 
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl p-2.5 text-white" />
                                </div>
                                
                                {activeTab === 'distribution' && (
                                    <>
                                        <div>
                                            <label className="text-sm text-slate-400">Từ kho</label>
                                            <input type="text" value="Kho Tong Ha Noi" disabled className="w-full mt-1 bg-slate-800/50 border border-slate-700 rounded-xl p-2.5 text-slate-400 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-400">Đến Đại lý</label>
                                            <select name="toDealerId" value={form.toDealerId} onChange={e => setForm({...form, toDealerId: e.target.value})} required 
                                                className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl p-2.5 text-white">
                                                <option value="">-- Chọn đại lý --</option>
                                                {dealers.map(d => <option key={d.dealerId} value={d.dealerId}>{d.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-400">Ngày giao dự kiến</label>
                                            <input type="date" name="scheduledDate" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} required 
                                                className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl p-2.5 text-white" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-4">
                                <button type="button" onClick={() => setShowFormModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 font-medium">Hủy</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold shadow-lg">
                                    {activeTab === 'inventory' ? 'Lưu' : 'Tạo Phiếu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;