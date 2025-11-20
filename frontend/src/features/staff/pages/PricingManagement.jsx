import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../../utils/api/apiClient"; // Đảm bảo đường dẫn này đúng

const PricingManagement = () => {
    const [activeTab, setActiveTab] = useState("price");

    // --- STATE MANAGEMENT ---
    const [pricingList, setPricingList] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // State cho dropdowns
    const [vehicles, setVehicles] = useState([]);
    const [dealers, setDealers] = useState([]);

    // --- API CALLS ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [priceRes, promoRes] = await Promise.all([
                apiClient.get('/pricing/wholesale-prices-summary'),
                apiClient.get('/pricing/promotion-policies-summary')
            ]);
            
            // SẮP XẾP DỮ LIỆU TĂNG DẦN THEO ID
            const sortedPricingList = priceRes.data.sort((a, b) => a.priceId - b.priceId);
            const sortedPromotions = promoRes.data.sort((a, b) => a.policyId - b.policyId);

            setPricingList(sortedPricingList);
            setPromotions(sortedPromotions);
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

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- PRICE CRUD ---
    const openCreatePrice = () => {
        setIsEdit(false);
        setForm({
            productId: "",
            dealerId: "",
            price: "",
            validFrom: new Date().toISOString().slice(0, 10),
            validTo: "",
        });
        fetchDropdownData();
        setShowModal(true);
    };

    const openEditPrice = (p) => { /* Logic sửa sẽ được thêm sau */ };
    const deletePrice = () => { /* Logic xóa sẽ được thêm sau */ };

    const savePrice = async (e) => {
        e.preventDefault();
        const payload = {
            productId: parseInt(form.productId),
            dealerId: form.dealerId ? parseInt(form.dealerId) : null,
            price: parseFloat(form.price),
            validFrom: form.validFrom,
            validTo: form.validTo,
        };
        try {
            await apiClient.post('/pricing/wholesale-prices', payload);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi lưu giá:", error);
            alert("Lưu giá thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    // --- PROMOTION CRUD ---
    const openCreatePromo = () => {
        setIsEdit(false);
        setForm({
            dealerId: "",
            description: "",
            discountPercent: "",
            conditions: "{}",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: ""
        });
        fetchDropdownData();
        setShowModal(true);
    };

    const openEditPromo = (p) => { /* Logic sửa sẽ được thêm sau */ };
    const deletePromo = () => { /* Logic xóa sẽ được thêm sau */ };

    const savePromo = async (e) => {
        e.preventDefault();
        const payload = {
            dealerId: parseInt(form.dealerId),
            description: form.description,
            discountPercent: parseFloat(form.discountPercent),
            conditions: form.conditions,
            startDate: form.startDate,
            endDate: form.endDate,
        };
        try {
            await apiClient.post('/pricing/promotion-policies', payload);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi lưu khuyến mãi:", error);
            alert("Lưu khuyến mãi thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    // --- STYLES ---
    const btnBase = "px-3 py-1.5 rounded-xl font-semibold transition duration-150 text-sm";
    const btnAdd = btnBase + " bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110";
    const btnEdit = btnBase + " bg-emerald-600/30 hover:bg-emerald-600 text-white";
    const btnDelete = btnBase + " bg-rose-600/30 hover:bg-rose-600 text-white";

    return (
        <div className="space-y-6 p-4 text-white">
            <h1 className="text-3xl font-bold py-4">
                Quản lý giá & khuyến mãi
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: "price", label: "Bảng giá sỉ" },
                    { key: "promotion", label: "Chính sách khuyến mãi" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-full border px-5 py-2.5 font-semibold transition ${activeTab === tab.key
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.4)]"
                            : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* PRICE TABLE */}
            {activeTab === "price" && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-emerald-400">Bảng giá sỉ</h2>
                        <button onClick={openCreatePrice} className={btnAdd}>+ Thêm giá</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm md:text-base">
                            <thead className="bg-slate-800/60 text-emerald-300">
                                <tr>
                                    <th className="p-3 text-left">Mã Giá</th>
                                    <th className="p-3 text-left">Sản phẩm</th>
                                    <th className="p-3 text-left">Đại lý áp dụng</th>
                                    <th className="p-3 text-left">Giá sỉ (VNĐ)</th>
                                    <th className="p-3 text-left">Từ ngày</th>
                                    <th className="p-3 text-left">Đến ngày</th>
                                    <th className="p-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (<tr><td colSpan="7" className="text-center p-4">Đang tải...</td></tr>) :
                                    pricingList.map((p, index) => ( // SỬ DỤNG index ĐỂ LÀM SỐ THỨ TỰ
                                        <tr key={p.priceId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3 font-semibold">{index + 1}</td> {/* HIỂN THỊ SỐ THỨ TỰ 1, 2, 3... */}
                                            <td className="p-3 font-medium">{p.productName}</td>
                                            <td className="p-3">{p.dealerName || "Tất cả (Giá chung)"}</td>
                                            <td className="p-3 font-semibold">{p.price.toLocaleString()}</td>
                                            <td className="p-3">{p.validFrom}</td>
                                            <td className="p-3">{p.validTo}</td>
                                            <td className="p-3 text-center space-x-2">
                                                <button onClick={() => openEditPrice(p)} className={btnEdit}>Sửa</button>
                                                <button onClick={() => setConfirmDelete(p)} className={btnDelete}>Xoá</button>
                                            </td>
                                        </tr>
                                    ))}
                                {!loading && pricingList.length === 0 && (<tr><td colSpan="7" className="text-center p-4 text-slate-500">Chưa có bảng giá nào.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PROMOTION TABLE */}
            {activeTab === "promotion" && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-emerald-400">Chính sách khuyến mãi</h2>
                        <button onClick={openCreatePromo} className={btnAdd}>+ Thêm khuyến mãi</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm md:text-base">
                            <thead className="bg-slate-800/60 text-sky-300">
                                <tr>
                                    <th className="p-3 text-left">Mã KM</th>
                                    <th className="p-3 text-left">Mô tả</th>
                                    <th className="p-3 text-left">Đại lý áp dụng</th>
                                    <th className="p-3 text-left">Chiết khấu (%)</th>
                                    <th className="p-3 text-left">Bắt đầu</th>
                                    <th className="p-3 text-left">Kết thúc</th>
                                    <th className="p-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (<tr><td colSpan="7" className="text-center p-4">Đang tải...</td></tr>) :
                                    promotions.map((pm, index) => ( // SỬ DỤNG index ĐỂ LÀM SỐ THỨ TỰ
                                        <tr key={pm.policyId} className="border-t border-slate-800 hover:bg-slate-800/40">
                                            <td className="p-3 font-semibold">{index + 1}</td> {/* HIỂN THỊ SỐ THỨ TỰ 1, 2, 3... */}
                                            <td className="p-3 font-medium">{pm.description}</td>
                                            <td className="p-3">{pm.dealerName}</td>
                                            <td className="p-3 font-semibold">{pm.discountPercent}%</td>
                                            <td className="p-3">{pm.startDate}</td>
                                            <td className="p-3">{pm.endDate}</td>
                                            <td className="p-3 text-center space-x-2">
                                                <button onClick={() => openEditPromo(pm)} className={btnEdit}>Sửa</button>
                                                <button onClick={() => setConfirmDelete(pm)} className={btnDelete}>Xoá</button>
                                            </td>
                                        </tr>
                                    ))}
                                {!loading && promotions.length === 0 && (<tr><td colSpan="7" className="text-center p-4 text-slate-500">Chưa có chính sách khuyến mãi nào.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                            <h3 className="text-xl font-bold text-emerald-400">
                                {activeTab === "price"
                                    ? (isEdit ? "Cập nhật giá" : "Thêm giá mới")
                                    : (isEdit ? "Sửa khuyến mãi" : "Thêm khuyến mãi mới")}
                            </h3>
                            <button className="w-8 h-8 grid place-items-center rounded-lg border border-slate-700 hover:border-emerald-500/40 hover:bg-emerald-500/10" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        {/* Form cho Bảng giá sỉ */}
                        {activeTab === 'price' && (
                            <form onSubmit={savePrice} className="px-5 py-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-300">Sản phẩm (Xe) *</label>
                                        <select name="productId" value={form.productId} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                                            <option value="">-- Chọn xe --</option>
                                            {vehicles.map(v => <option key={v.vehicleId} value={v.vehicleId}>{v.model}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Áp dụng cho Đại lý</label>
                                        <select name="dealerId" value={form.dealerId} onChange={handleFormChange} className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                                            <option value="">-- Giá chung cho tất cả --</option>
                                            {dealers.map(d => <option key={d.dealerId} value={d.dealerId}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-slate-300">Giá sỉ (VNĐ) *</label>
                                        <input type="number" name="price" placeholder="Ví dụ: 1100000000" value={form.price} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Hiệu lực từ *</label>
                                        <input type="date" name="validFrom" value={form.validFrom} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Hiệu lực đến *</label>
                                        <input type="date" name="validTo" value={form.validTo} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-700">Hủy</button>
                                    <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
                                </div>
                            </form>
                        )}

                        {/* Form cho Khuyến mãi */}
                        {activeTab === 'promotion' && (
                            <form onSubmit={savePromo} className="px-5 py-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-slate-300">Mô tả khuyến mãi *</label>
                                        <input name="description" value={form.description} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Áp dụng cho Đại lý *</label>
                                        <select name="dealerId" value={form.dealerId} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700">
                                            <option value="">-- Chọn đại lý --</option>
                                            {dealers.map(d => <option key={d.dealerId} value={d.dealerId}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Chiết khấu (%) *</label>
                                        <input type="number" name="discountPercent" min="0" max="100" value={form.discountPercent} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Ngày bắt đầu *</label>
                                        <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="text-slate-300">Ngày kết thúc *</label>
                                        <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} required className="w-full mt-1 rounded-xl bg-slate-900/60 p-2 border border-slate-700" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-700">Hủy</button>
                                    <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
};

export default PricingManagement;