import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../../utils/api/apiClient";
import { useAuth } from "../../../context/AuthContext";

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const { user } = useAuth();

    // --- STATE MANAGEMENT ---
    const [inventories, setInventories] = useState([]);
    const [distributions, setDistributions] = useState([]);
    const [purchaseRequests, setPurchaseRequests] = useState([]); 
    
    // Loading
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    
    // State Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({});
    const [isEdit, setIsEdit] = useState(false); 
    
    // State Dropdown
    const [vehicles, setVehicles] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [configs, setConfigs] = useState([]); 

    // --- QUYỀN HẠN ---
    const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';
    const isDealerManager = user?.role === 'DealerManager';

    // --- 1. FETCH DATA CŨ ---
    const fetchInventoryData = useCallback(async () => {
        setLoadingInventory(true);
        try {
            // LƯU Ý: Đã bỏ '/api' ở đầu vì apiClient tự thêm
            const [invRes, distRes] = await Promise.all([
                apiClient.get('/inventory/summary'), 
                apiClient.get('/inventory/distributions/summary')
            ]);
            
            // SẮP XẾP TỪ BÉ ĐẾN LỚN THEO ID
            const sortedInv = (invRes.data || []).sort((a, b) => a.inventoryId - b.inventoryId);
            const sortedDist = (distRes.data || []).sort((a, b) => a.distId - b.distId);

            setInventories(sortedInv);
            setDistributions(sortedDist);
        } catch (error) {
            console.error("Lỗi tải Tồn kho/Điều phối"); 
            setInventories([]);
            setDistributions([]);
        } finally {
            setLoadingInventory(false);
        }
    }, []);

    // --- 2. FETCH DATA MỚI ---
    const fetchNewData = useCallback(async () => {
        if (!canManage) return;
        
        setLoadingRequests(true);
        try {
            // SỬA LỖI QUAN TRỌNG: Bỏ '/api' ở đầu
            const reqRes = await apiClient.get('/procurement/requests/pending');
            
            // SẮP XẾP TỪ BÉ ĐẾN LỚN THEO REQUEST ID
            const sortedReq = (reqRes.data || []).sort((a, b) => a.requestId - b.requestId);
            setPurchaseRequests(sortedReq);
            
            // Tải dropdown 
            const results = await Promise.allSettled([
                apiClient.get('/admin/vehicles'),
                apiClient.get('/dealers/basic')
            ]);
            
            if (results[0].status === 'fulfilled') setVehicles(results[0].value.data);
            if (results[1].status === 'fulfilled') setDealers(results[1].value.data);

        } catch (error) {
            console.error("Lỗi tải Requests");
            setPurchaseRequests([]);
        } finally {
            setLoadingRequests(false);
        }
    }, [canManage]);

    // --- EFFECTS ---
    useEffect(() => {
        fetchInventoryData();
    }, [fetchInventoryData]);

    useEffect(() => {
        if (activeTab === 'requests' || canManage) {
            fetchNewData();
        }
    }, [fetchNewData, activeTab, canManage]);


    // --- HELPER FUNCTIONS ---
    // SỬA LỖI SELECT CONFIG: Bỏ '/api' trong đường dẫn gọi config
    const handleVehicleChangeInModal = async (vehicleId) => {
        // Reset configId ngay lập tức khi đổi xe
        setForm(prev => ({...prev, vehicleId, configId: ''}));
        
        if (!vehicleId) {
            setConfigs([]);
            return;
        }
        try {
            // SỬA: /vehicles/... thay vì /api/vehicles/...
            const res = await apiClient.get(`/vehicles/${vehicleId}/configs`);
            setConfigs(res.data || []);
        } catch (error) {
            console.error("Lỗi tải config:", error);
            setConfigs([]); // Reset nếu lỗi
        }
    };

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getVehicleName = (id) => {
        if (!vehicles || vehicles.length === 0) return `Xe ${id}`;
        const v = vehicles.find(x => x.vehicleId == id);
        return v ? v.model : `Xe ${id}`;
    };

    const getDealerName = (id) => {
        if (!dealers || dealers.length === 0) return `Đại lý ${id}`;
        const d = dealers.find(x => x.dealerId == id);
        return d ? d.name : `Đại lý ${id}`;
    };

    // --- ACTIONS ---
    const handleApproveRequest = async (request) => {
        if(!window.confirm(`Duyệt yêu cầu số ${request.requestId}?`)) return;

        try {
            // SỬA: Bỏ '/api'
            await apiClient.put(`/procurement/requests/${request.requestId}/approve`);
            
            // Tải config của xe trong request để điền vào form
            if (request.productId) {
                 try {
                    // SỬA: Bỏ '/api'
                    const res = await apiClient.get(`/vehicles/${request.productId}/configs`);
                    setConfigs(res.data);
                } catch (e) { console.error(e); }
            }

            setIsEdit(false);
            setForm({
                vehicleId: request.productId, 
                configId: '', 
                quantity: request.qty,
                fromLocation: 'Kho Tong Ha Noi',
                toDealerId: request.dealerId,
                scheduledDate: new Date().toISOString().slice(0, 10),
            });
            
            alert("Đã duyệt! Vui lòng tạo phiếu điều phối.");
            setActiveTab('distribution');
            setShowModal(true);
            
            fetchInventoryData();
            fetchNewData();
        } catch (error) {
            console.error("Lỗi duyệt:", error);
            alert("Lỗi duyệt yêu cầu.");
        }
    };

    const handleRejectRequest = async (requestId) => {
        if(!window.confirm("Từ chối yêu cầu này?")) return;
        try {
            // SỬA: Bỏ '/api'
            await apiClient.put(`/procurement/requests/${requestId}/reject`);
            fetchNewData();
        } catch (error) {
            alert("Lỗi từ chối yêu cầu.");
        }
    };

    // --- CRUD CŨ ---
    const openCreateInventory = async () => {
        setIsEdit(false);
        setForm({
            vehicleId: '', configId: '',
            locationType: "HQ", locationId: '1',
            quantity: '',
        });
        setConfigs([]);
        setShowModal(true);
        try {
            // SỬA: Bỏ '/api' nếu có
            const [v, d] = await Promise.all([apiClient.get('/admin/vehicles'), apiClient.get('/dealers/basic')]);
            setVehicles(v.data); setDealers(d.data);
        } catch(e) {}
    };

    const saveInventory = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/inventory/stock', { ...form, quantity: parseInt(form.quantity) });
            setShowModal(false);
            fetchInventoryData();
        } catch (error) {
            alert("Lỗi lưu tồn kho.");
        }
    };

    const openCreateDistribution = async () => {
        setIsEdit(false);
        setForm({
            vehicleId: '', configId: '',
            quantity: '',
            fromLocation: 'Kho Tong Ha Noi',
            toDealerId: '',
            scheduledDate: new Date().toISOString().slice(0, 10),
        });
        setConfigs([]);
        setShowModal(true);
         try {
            const [v, d] = await Promise.all([apiClient.get('/admin/vehicles'), apiClient.get('/dealers/basic')]);
            setVehicles(v.data); setDealers(d.data);
        } catch(e) {}
    };

    const saveDistribution = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/inventory/distributions', { ...form, quantity: parseInt(form.quantity) });
            setShowModal(false);
            fetchInventoryData();
        } catch (error) {
            alert("Tạo phiếu thất bại.");
        }
    };

    const confirmDelivery = async (distId) => {
        if (window.confirm("Xác nhận đã nhận hàng?")) {
            try {
                await apiClient.post(`/inventory/distributions/${distId}/confirm`);
                fetchInventoryData();
            } catch (error) {
                alert("Lỗi xác nhận.");
            }
        }
    };

    // --- STYLES ---
    const btnBase = "px-3 py-1.5 rounded-xl font-semibold transition duration-150 text-sm";
    const btnAdd = btnBase + " bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110";
    const btnConfirm = btnBase + " bg-sky-600/30 hover:bg-sky-600 text-white";
    const btnApprove = btnBase + " bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:brightness-110 mr-2";
    const btnReject = btnBase + " bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/50";

    return (
        <div className="space-y-6 p-4 text-white">
            <h1 className="text-3xl font-bold text-slate-100 py-2">Quản lý tồn kho & điều phối xe</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveTab("inventory")} className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === "inventory" ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]" : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"}`}>
                    Tồn kho
                </button>
                <button onClick={() => setActiveTab("distribution")} className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === "distribution" ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]" : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"}`}>
                    Điều phối xe
                </button>
                {canManage && (
                    <button onClick={() => setActiveTab("requests")} className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === "requests" ? "bg-orange-600 text-white border-orange-600 shadow-[0_0_20px_rgba(234,88,12,.4)]" : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-orange-500/40 hover:bg-orange-500/10"}`}>
                        Yêu cầu đặt hàng {purchaseRequests.length > 0 && <span className="ml-2 bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{purchaseRequests.length}</span>}
                    </button>
                )}
            </div>

            {/* CONTENT: INVENTORY */}
            {activeTab === "inventory" && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-emerald-400">Danh sách Tồn kho</h2>
                        {canManage && <button onClick={openCreateInventory} className={btnAdd}>+ Nhập/Xuất kho</button>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-base">
                            <thead className="bg-slate-800/60 text-emerald-300">
                                <tr>
                                    <th className="p-3 text-left">Mã Tồn</th>
                                    <th className="p-3 text-left">Sản phẩm</th>
                                    <th className="p-3 text-left">Loại kho</th>
                                    <th className="p-3 text-left">Địa điểm</th>
                                    <th className="p-3 text-left">Số lượng</th>
                                    <th className="p-3 text-left">Cập nhật lúc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingInventory && inventories.length === 0 ? (<tr><td colSpan="6" className="text-center p-4">Đang tải...</td></tr>) :
                                inventories.length > 0 ? (
                                    inventories.map((i) => (
                                        <tr key={i.inventoryId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3 font-mono text-emerald-200">{i.inventoryId}</td>
                                            <td className="p-3 font-medium">{i.vehicleName} ({i.configName})</td>
                                            <td className="p-3">{i.locationType}</td>
                                            <td className="p-3">{i.locationName}</td>
                                            <td className="p-3 font-semibold">{i.quantity}</td>
                                            <td className="p-3 text-slate-400">{new Date(i.updatedAt).toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center p-6 text-slate-500 italic">Không có dữ liệu tồn kho.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CONTENT: DISTRIBUTION */}
            {activeTab === "distribution" && (
                 <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-sky-400">Danh sách Phiếu điều phối</h2>
                        {canManage && <button onClick={openCreateDistribution} className={btnAdd}>+ Tạo phiếu</button>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-base">
                            <thead className="bg-slate-800/60 text-sky-300">
                                <tr>
                                    <th className="p-3 text-left">Mã Phiếu</th>
                                    <th className="p-3 text-left">Sản phẩm</th>
                                    <th className="p-3 text-left">Số lượng</th>
                                    <th className="p-3 text-left">Từ</th>
                                    <th className="p-3 text-left">Đến Đại lý</th>
                                    <th className="p-3 text-left">Ngày dự kiến</th>
                                    <th className="p-3 text-left">Trạng thái</th>
                                    <th className="p-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                            {loadingInventory && distributions.length === 0 ? (<tr><td colSpan="8" className="text-center p-4">Đang tải...</td></tr>) :
                                distributions.length > 0 ? (
                                    distributions.map((d) => (
                                        <tr key={d.distId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3 font-mono text-sky-200">{d.distId}</td>
                                            <td className="p-3 font-medium">{d.vehicleName} ({d.configName})</td>
                                            <td className="p-3">{d.quantity}</td>
                                            <td className="p-3">{d.fromLocation}</td>
                                            <td className="p-3">{d.toDealerName}</td>
                                            <td className="p-3">{d.scheduledDate}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "Completed" ? "bg-emerald-500/20 text-emerald-300" : d.status === "InTransit" ? "bg-sky-500/20 text-sky-300" : "bg-yellow-500/20 text-yellow-300"}`}>{d.status}</span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {isDealerManager && d.toDealerId === user.dealerId && d.status === 'InTransit' && (
                                                    <button onClick={() => confirmDelivery(d.distId)} className={btnConfirm}>Xác nhận</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8" className="text-center p-6 text-slate-500 italic">Không có phiếu điều phối nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CONTENT: REQUESTS (NEW) */}
            {activeTab === "requests" && canManage && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-orange-400">Yêu cầu đặt hàng (Chờ duyệt)</h2>
                        {loadingRequests && <span className="text-sm text-slate-400">Đang cập nhật...</span>}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-base">
                            <thead className="bg-slate-800/60 text-orange-300">
                                <tr>
                                    <th className="p-3 text-left">Mã YC</th>
                                    <th className="p-3 text-left">Đại lý</th>
                                    <th className="p-3 text-left">Sản phẩm</th>
                                    <th className="p-3 text-left">Số lượng</th>
                                    <th className="p-3 text-left">Ngày tạo</th>
                                    <th className="p-3 text-left">Trạng thái</th>
                                    <th className="p-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseRequests.length > 0 ? (
                                    purchaseRequests.map((req) => (
                                        <tr key={req.requestId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3 font-mono text-orange-200">{req.requestId}</td>
                                            <td className="p-3 font-semibold text-white">{req.dealerName || getDealerName(req.dealerId)}</td>
                                            <td className="p-3">{req.productName || getVehicleName(req.productId)}</td>
                                            <td className="p-3 font-bold text-orange-200">{req.qty}</td>
                                            <td className="p-3 text-slate-400">{req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                            <td className="p-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">{req.status}</span></td>
                                            <td className="p-3 text-center flex justify-center gap-2">
                                                {(req.status === 'Pending' || req.status === 'pending') && (
                                                    <>
                                                        <button onClick={() => handleApproveRequest(req)} className={btnApprove}>✓ Duyệt</button>
                                                        <button onClick={() => handleRejectRequest(req.requestId)} className={btnReject}>✕ Từ chối</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center p-6 text-slate-500 italic">{loadingRequests ? "Đang tải..." : "Không có yêu cầu nào."}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold px-5 py-4 border-b border-slate-800 text-emerald-400">
                           {activeTab === 'inventory' ? 'Nhập/Xuất kho Tổng' : 'Tạo Phiếu điều phối mới'}
                        </h3>
                        <form onSubmit={activeTab === 'inventory' ? saveInventory : saveDistribution} className="px-5 py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-300">Sản phẩm (Xe) *</label>
                                    <select name="vehicleId" value={form.vehicleId} onChange={(e) => handleVehicleChangeInModal(e.target.value)} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                                        <option value="">-- Chọn xe --</option>
                                        {vehicles.map(v => <option key={v.vehicleId} value={v.vehicleId}>{v.model}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-300">Phiên bản (Cấu hình) *</label>
                                    <select name="configId" value={form.configId} onChange={handleFormChange} required disabled={!form.vehicleId} className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700 disabled:opacity-50">
                                        <option value="">-- Chọn phiên bản --</option>
                                        {/* Kiểm tra configs tồn tại trước khi map để tránh lỗi crash */}
                                        {configs && configs.length > 0 && configs.map(c => <option key={c.configId} value={c.configId}>{c.color} - Pin {c.batteryKwh}kWh</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-300">Số lượng *</label>
                                    <input type="number" name="quantity" value={form.quantity} onChange={handleFormChange} required min={activeTab === 'distribution' ? 1 : undefined} className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    {activeTab === 'inventory' && <p className="text-xs text-slate-500 mt-1">Nhập số âm để xuất kho.</p>}
                                </div>
                                {activeTab === 'distribution' && (
                                    <>
                                        <div>
                                            <label className="text-slate-300">Đến Đại lý *</label>
                                            <select name="toDealerId" value={form.toDealerId} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                                                <option value="">-- Chọn đại lý --</option>
                                                {dealers.map(d => <option key={d.dealerId} value={d.dealerId}>{d.name}</option>)}
                                            </select>
                                        </div>
                                         <div>
                                            <label className="text-slate-300">Ngày giao dự kiến *</label>
                                            <input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-700">Hủy</button>
                                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;