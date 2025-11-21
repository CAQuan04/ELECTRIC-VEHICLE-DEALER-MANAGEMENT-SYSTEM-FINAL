import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../../utils/api/apiClient";
import { useAuth } from "../../../context/AuthContext";

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const { user } = useAuth();

    // --- STATE MANAGEMENT ---
    const [inventories, setInventories] = useState([]);
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({});
    const [isEdit, setIsEdit] = useState(false); // Sẽ dùng trong tương lai cho chức năng Sửa
    
    const [vehicles, setVehicles] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [configs, setConfigs] = useState([]); // State mới để lưu config của xe được chọn

    // --- QUYỀN HẠN ---
    const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';
    const isDealerManager = user?.role === 'DealerManager';

    // --- API CALLS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Cần các API GET mới để lấy dữ liệu đã được JOIN
            const [invRes, distRes] = await Promise.all([
                apiClient.get('/inventory/summary'), 
                apiClient.get('/inventory/distributions/summary')
            ]);
            setInventories(invRes.data);
            setDistributions(distRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchDropdownData = async () => {
        if (vehicles.length === 0 || dealers.length === 0) {
            try {
                const [vehRes, dealRes] = await Promise.all([
                    apiClient.get('/admin/vehicles'),
                    apiClient.get('/dealers/basic')
                ]);
                setVehicles(vehRes.data);
                setDealers(dealRes.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dropdowns:", error);
            }
        }
    };
    
    // Tải danh sách config khi người dùng chọn một xe trong modal
    const handleVehicleChangeInModal = async (vehicleId) => {
        setForm(prev => ({...prev, vehicleId, configId: ''})); // Reset configId
        if (!vehicleId) {
            setConfigs([]);
            return;
        }
        try {
            const res = await apiClient.get(`/api/vehicles/${vehicleId}/configs`);
            setConfigs(res.data);
        } catch (error) {
            console.error("Lỗi khi tải config:", error);
        }
    };

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- CRUD ---
    const openCreateInventory = () => {
        setIsEdit(false);
        setForm({
            vehicleId: '', configId: '',
            locationType: "HQ", locationId: '1',
            quantity: '',
        });
        fetchDropdownData();
        setConfigs([]);
        setShowModal(true);
    };

    const saveInventory = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/inventory/stock', {
                ...form,
                quantity: parseInt(form.quantity)
            });
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi lưu tồn kho:", error);
            alert("Lưu tồn kho thất bại: " + (error.response?.data?.message || ''));
        }
    };

    const openCreateDistribution = () => {
        setIsEdit(false);
        setForm({
            vehicleId: '', configId: '',
            quantity: '',
            fromLocation: 'Kho Tong Ha Noi',
            toDealerId: '',
            scheduledDate: new Date().toISOString().slice(0, 10),
        });
        fetchDropdownData();
        setConfigs([]);
        setShowModal(true);
    };

    const saveDistribution = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/inventory/distributions', {
                ...form,
                quantity: parseInt(form.quantity)
            });
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi tạo phiếu điều phối:", error);
            alert("Tạo phiếu thất bại.");
        }
    };

    const confirmDelivery = async (distId) => {
        if (window.confirm("Bạn có chắc muốn xác nhận đã nhận được lô hàng này?")) {
            try {
                await apiClient.post(`/api/inventory/distributions/${distId}/confirm`);
                fetchData();
            } catch (error) {
                console.error("Lỗi khi xác nhận giao hàng:", error);
                alert("Xác nhận thất bại: " + (error.response?.data?.message || ''));
            }
        }
    };
    
    // --- STYLES ---
    const btnBase = "px-3 py-1.5 rounded-xl font-semibold transition duration-150 text-sm";
    const btnAdd = btnBase + " bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110";
    const btnConfirm = btnBase + " bg-sky-600/30 hover:bg-sky-600 text-white";

    return (
        <div className="space-y-6 p-4 text-white">
            <h1 className="text-3xl font-bold text-slate-100 py-2">Quản lý tồn kho & điều phối xe</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab("inventory")}
                    className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === "inventory" ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]" : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"}`}>
                    Tồn kho
                </button>
                <button
                    onClick={() => setActiveTab("distribution")}
                    className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === "distribution" ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]" : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"}`}>
                    Điều phối xe
                </button>
            </div>

            {/* INVENTORY TAB */}
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
                                {loading ? (<tr><td colSpan="6" className="text-center p-4">Đang tải dữ liệu tồn kho...</td></tr>) :
                                inventories.length > 0 ? (
                                    inventories.map((i) => (
                                        <tr key={i.inventoryId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3">{`I${String(i.inventoryId).padStart(3, "0")}`}</td>
                                            <td className="p-3 font-medium">{i.vehicleName} ({i.configName})</td>
                                            <td className="p-3">{i.locationType}</td>
                                            <td className="p-3">{i.locationName}</td>
                                            <td className="p-3 font-semibold">{i.quantity}</td>
                                            <td className="p-3 text-slate-400">{new Date(i.updatedAt).toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    // === CẢI TIẾN: THÔNG BÁO KHI KHÔNG CÓ DỮ LIỆU ===
                                    <tr><td colSpan="6" className="text-center p-6 text-slate-500 italic">Không có dữ liệu tồn kho.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DISTRIBUTION TAB */}
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
                            {loading ? (<tr><td colSpan="8" className="text-center p-4">Đang tải dữ liệu điều phối...</td></tr>) :
                                distributions.length > 0 ? (
                                    distributions.map((d) => (
                                        <tr key={d.distId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3">{`D${String(d.distId).padStart(3, "0")}`}</td>
                                            <td className="p-3 font-medium">{d.vehicleName} ({d.configName})</td>
                                            <td className="p-3">{d.quantity}</td>
                                            <td className="p-3">{d.fromLocation}</td>
                                            <td className="p-3">{d.toDealerName}</td>
                                            <td className="p-3">{d.scheduledDate}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    d.status === "Completed" ? "bg-emerald-500/20 text-emerald-300" :
                                                    d.status === "InTransit" ? "bg-sky-500/20 text-sky-300" :
                                                    "bg-yellow-500/20 text-yellow-300"
                                                }`}>{d.status}</span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {isDealerManager && d.toDealerId === user.dealerId && d.status === 'InTransit' && (
                                                    <button onClick={() => confirmDelivery(d.distId)} className={btnConfirm}>Xác nhận</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // === CẢI TIẾN: THÔNG BÁO KHI KHÔNG CÓ DỮ LIỆU ===
                                    <tr><td colSpan="8" className="text-center p-6 text-slate-500 italic">Không có phiếu điều phối nào.</td></tr>
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
                                        {configs.map(c => <option key={c.configId} value={c.configId}>{c.color} - Pin {c.batteryKwh}kWh</option>)}
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