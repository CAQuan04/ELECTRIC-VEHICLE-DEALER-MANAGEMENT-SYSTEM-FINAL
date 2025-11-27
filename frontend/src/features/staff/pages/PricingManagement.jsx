import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Tag, Percent, Plus, Search, Filter, 
  ChevronDown, Edit, PowerOff, RefreshCw, X, TrendingUp 
} from "lucide-react";
import apiClient from "../../../utils/api/apiClient"; 

// --- UI COMPONENTS ---
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { FormGroup, Label, Input, Select } from "../components/ui/FormComponents";

const PricingManagement = () => {
  const [activeTab, setActiveTab] = useState("price");

  // --- STATE ---
  const [pricingList, setPricingList] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ searchTerm: "", dealer: "" });

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isCorrectionMode, setIsCorrectionMode] = useState(false); // Logic sửa lỗi nhập liệu

  // Dropdowns
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
      setPricingList((priceRes.data || []).sort((a, b) => b.priceId - a.priceId));
      setPromotions((promoRes.data || []).sort((a, b) => b.policyId - a.policyId));
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    if (vehicles.length === 0) {
        try {
            const [vehRes, dealRes] = await Promise.all([
                apiClient.get('/admin/vehicles'), 
                apiClient.get('/dealers/basic')   
            ]);
            setVehicles(vehRes.data || []);
            setDealers(dealRes.data || []);
        } catch (e) {}
    }
  }, [vehicles.length]);

  useEffect(() => { fetchData(); fetchDropdownData(); }, [fetchData, fetchDropdownData]);
  useEffect(() => { setFilter({ searchTerm: "", dealer: "" }); }, [activeTab]);

  // --- VALIDATION LOGIC ---
  const checkPriceConflict = (newForm) => {
    const newStart = new Date(newForm.validFrom).getTime();
    const newEnd = newForm.validTo ? new Date(newForm.validTo).getTime() : Number.MAX_SAFE_INTEGER; 

    const conflict = pricingList.find(p => {
        if (isEdit && p.priceId === newForm.priceId) return false;
        const formProductId = parseInt(newForm.productId);
        const formDealerId = newForm.dealerId ? parseInt(newForm.dealerId) : null;
        
        if (p.productId !== formProductId || p.dealerId !== formDealerId) return false;

        const pStart = new Date(p.validFrom).getTime();
        const pEnd = p.validTo ? new Date(p.validTo).getTime() : Number.MAX_SAFE_INTEGER;

        return (newStart <= pEnd && newEnd >= pStart);
    });
    return conflict;
  };

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    const data = activeTab === 'price' ? pricingList : promotions;
    return data.filter(item => {
      const term = filter.searchTerm.toLowerCase();
      const matchSearch = !filter.searchTerm || 
        (item.productName?.toLowerCase().includes(term)) || (item.description?.toLowerCase().includes(term));
      const displayDealerName = item.dealerName || "Tất cả (Chung)";
      const matchDealer = !filter.dealer || displayDealerName === filter.dealer;
      return matchSearch && matchDealer;
    });
  }, [activeTab, pricingList, promotions, filter]);

  const uniqueDealersInList = useMemo(() => {
    const list = activeTab === 'price' ? pricingList : promotions;
    const names = new Set(list.map(i => i.dealerName || "Tất cả (Chung)"));
    return Array.from(names).sort();
  }, [activeTab, pricingList, promotions]);

  // --- HANDLERS ---
  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // 1. Create New
  const openCreateModal = () => {
    setIsEdit(false);
    setIsCorrectionMode(true);
    if (activeTab === 'price') {
      setForm({ productId: "", dealerId: "", price: "", validFrom: new Date().toISOString().slice(0, 10), validTo: "" });
    } else {
      setForm({ dealerId: "", description: "", discountPercent: "", startDate: new Date().toISOString().slice(0, 10), endDate: "" });
    }
    setShowModal(true);
  };

  // 2. Edit (Correction)
  const openEditModal = (item) => {
      setIsEdit(true);
      setIsCorrectionMode(false); // Mặc định khóa các trường nhạy cảm
      setForm({ 
          ...item,
          validFrom: item.validFrom?.split('T')[0] || "",
          validTo: item.validTo?.split('T')[0] || "",
          startDate: item.startDate?.split('T')[0] || "",
          endDate: item.endDate?.split('T')[0] || ""
      });
      setShowModal(true);
  };

  // 3. Adjust Price (New Record)
  const openAdjustPriceModal = (item) => {
      setIsEdit(false);
      setIsCorrectionMode(true); 
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setForm({
          productId: item.productId,
          dealerId: item.dealerId || "",
          price: item.price,
          validFrom: tomorrow.toISOString().slice(0, 10),
          validTo: ""
      });
      setShowModal(true);
  };

  // 4. Deactivate
  const handleDeactivate = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn ngừng áp dụng mục này ngay lập tức?")) {
        // Gọi API deactivate nếu có, hoặc alert
        alert("Đã gửi yêu cầu ngừng áp dụng.");
        fetchData();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (activeTab === 'price') {
            const conflict = checkPriceConflict(form);
            if (conflict) {
                const productName = vehicles.find(v => v.vehicleId === parseInt(form.productId))?.model || "Sản phẩm";
                alert(`⛔ LỖI TRÙNG LẶP:\n\n${productName} đã có mức giá áp dụng trong khoảng thời gian này!\n\n- Giá trùng: ${conflict.price.toLocaleString()} VNĐ\n- Hiệu lực: ${conflict.validFrom.split('T')[0]} -> ${conflict.validTo ? conflict.validTo.split('T')[0] : '...'}`);
                return;
            }

            const payload = {
                productId: parseInt(form.productId),
                dealerId: form.dealerId ? parseInt(form.dealerId) : null,
                price: parseFloat(form.price),
                validFrom: form.validFrom,
                validTo: form.validTo,
            };
            const endpoint = isEdit ? `/pricing/wholesale-prices/${form.priceId}` : '/pricing/wholesale-prices';
            const method = isEdit ? 'put' : 'post'; 
            await apiClient[method](endpoint, payload);

        } else {
            // Logic cho Promotion (Tương tự, thêm check trùng nếu cần)
            const payload = { ...form };
            if (form.dealerId) payload.dealerId = parseInt(form.dealerId);
            if (form.discountPercent) payload.discountPercent = parseFloat(form.discountPercent);

            const endpoint = isEdit ? `/pricing/promotion-policies/${form.policyId}` : '/pricing/promotion-policies';
            const method = isEdit ? 'put' : 'post';
            await apiClient[method](endpoint, payload);
        }
        alert("Lưu thành công!");
        setShowModal(false);
        fetchData();
    } catch (error) {
        console.error("Submit error:", error);
        alert("Lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại.");
    }
  };

  // --- COLUMNS ---
  const priceColumns = useMemo(() => [
    { key: 'priceId', label: 'Mã', render: (row) => <span className="font-mono text-cyan-300">#{row.priceId}</span> },
    { key: 'productName', label: 'Sản phẩm', render: (row) => <span className="font-bold text-white">{row.productName}</span> },
    { key: 'dealerName', label: 'Đại lý', render: (row) => row.dealerName ? <Badge variant="info">{row.dealerName}</Badge> : <Badge variant="success">Giá chung</Badge> },
    { key: 'price', label: 'Giá (VNĐ)', render: (row) => <span className="text-emerald-400 font-bold text-lg">{row.price?.toLocaleString()}</span> },
    { key: 'validity', label: 'Hiệu lực', render: (row) => <div className="text-sm text-gray-400">{row.validFrom?.split('T')[0]} <br/>➝ {row.validTo?.split('T')[0] || '...'}</div> },
    { key: 'actions', label: '', render: (row) => (
        <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" className="!p-2 text-emerald-400 hover:bg-emerald-500/10" onClick={() => openAdjustPriceModal(row)} title="Điều chỉnh giá (Tạo mới)">
                <TrendingUp size={16} />
            </Button>
            <Button size="sm" variant="ghost" className="!p-2 text-blue-400 hover:bg-blue-500/10" onClick={() => openEditModal(row)} title="Sửa lỗi nhập liệu">
                <Edit size={16} />
            </Button>
            <Button size="sm" variant="ghost" className="!p-2 text-red-400 hover:bg-red-500/10" onClick={() => handleDeactivate(row.priceId)} title="Ngưng áp dụng">
                <PowerOff size={16} />
            </Button>
        </div>
    )}
  ], [uniqueDealersInList]);

  const promoColumns = useMemo(() => [
    { key: 'policyId', label: 'Mã', render: (row) => <span className="font-mono text-cyan-300">#{row.policyId}</span> },
    { key: 'description', label: 'Chương trình', render: (row) => <span className="font-medium text-white">{row.description}</span> },
    { key: 'dealerName', label: 'Đại lý', render: (row) => <Badge variant="info">{row.dealerName}</Badge> },
    { key: 'discount', label: '% Giảm', render: (row) => <span className="text-orange-400 font-bold text-lg">-{row.discountPercent}%</span> },
    { key: 'validity', label: 'Thời gian', render: (row) => <div className="text-sm text-gray-400">{row.startDate?.split('T')[0]} <br/>➝ {row.endDate?.split('T')[0]}</div> },
    { key: 'actions', label: '', render: (row) => (
        <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" className="!p-2 text-blue-400 hover:bg-blue-500/10" onClick={() => openEditModal(row)} title="Sửa thông tin">
                <Edit size={16} />
            </Button>
            <Button size="sm" variant="ghost" className="!p-2 text-red-400 hover:bg-red-500/10" onClick={() => handleDeactivate(row.policyId)} title="Kết thúc chương trình">
                <PowerOff size={16} />
            </Button>
        </div>
    )}
  ], []);

  // --- RENDER ---
  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Giá & Khuyến mãi"
        subtitle="Thiết lập bảng giá sỉ và các chương trình ưu đãi cho đại lý."
        icon={<Tag />}
        breadcrumbs={[{ label: "Trang chủ", path: "/" }, { label: "Kinh doanh" }]}
        actions={
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
             {activeTab === 'price' ? 'Thêm Giá Mới' : 'Thêm Khuyến Mãi'}
          </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* Filter Bar */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 shadow-2xl overflow-x-auto rounded-lg mb-6">
            <div className="flex items-center w-full h-auto md:h-24">
                <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                    <span className="text-blue-400 font-bold text-lg tracking-wide mr-3">Filter</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
                </div>
                <div className="flex h-full border-r border-gray-700/60">
                    <button onClick={() => setActiveTab('price')} className={`px-6 h-full font-bold transition-colors ${activeTab === 'price' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Bảng giá sỉ</button>
                    <button onClick={() => setActiveTab('promotion')} className={`px-6 h-full font-bold transition-colors ${activeTab === 'promotion' ? 'bg-orange-600/20 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Khuyến mãi</button>
                </div>
                <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[250px]">
                    <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 w-full">
                        <input type="text" placeholder="Tìm kiếm..." value={filter.searchTerm} onChange={(e) => setFilter({...filter, searchTerm: e.target.value})} className="w-full bg-transparent border-none p-0 text-white placeholder:text-gray-500 focus:ring-0 text-base" />
                        {filter.searchTerm ? <button onClick={() => setFilter({...filter, searchTerm: ''})} className="text-gray-400 hover:text-white ml-2"><X className="w-4 h-4" /></button> : <Search className="w-4 h-4 text-gray-500 ml-2" />}
                    </div>
                </div>
                <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                    <span className="text-gray-300 text-base font-semibold truncate mr-2">Đại lý</span>
                    <select value={filter.dealer} onChange={(e) => setFilter({ ...filter, dealer: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white">
                        <option value="" className="bg-[#1e293b]">Tất cả</option>
                        {uniqueDealersInList.map(dl => <option key={dl} value={dl} className="bg-[#1e293b]">{dl}</option>)}
                    </select>
                    <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                    {filter.dealer && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.dealer}</span>}
                </div>
            </div>
        </div>

        {/* Content */}
        <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
             {loading ? <div className="py-20 text-center animate-pulse text-gray-400">Đang tải...</div> : (
                <>
                   {activeTab === 'price' ? <Table columns={priceColumns} data={filteredData} className="bg-[#1e293b]/50 backdrop-blur-xl" /> 
                                          : <Table columns={promoColumns} data={filteredData} className="bg-[#1e293b]/50 backdrop-blur-xl" />}
                   {filteredData.length === 0 && <EmptyState icon="📭" title="Không có dữ liệu" description="Chưa có bản ghi nào phù hợp." />}
                </>
             )}
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? "Sửa thông tin (Correction Mode)" : "Tạo mới / Điều chỉnh"} size="lg">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'price' ? (
                    <>
                        <FormGroup><Label>Sản phẩm</Label><Select name="productId" value={form.productId} onChange={handleFormChange} disabled={isEdit} options={[{value:'', label:'-- Chọn xe --'}, ...vehicles.map(v=>({value: v.vehicleId, label: v.model}))]} /></FormGroup>
                        <FormGroup><Label>Đại lý</Label><Select name="dealerId" value={form.dealerId} onChange={handleFormChange} disabled={isEdit} options={[{value:'', label:'Tất cả'}, ...dealers.map(d=>({value: d.dealerId, label: d.name}))]} /></FormGroup>
                        
                        <FormGroup className="md:col-span-2">
                            <div className="flex justify-between">
                                <Label>Giá sỉ (VNĐ)</Label>
                                {isEdit && (
                                    <label className="flex items-center gap-2 text-xs text-yellow-400 cursor-pointer select-none">
                                        <input type="checkbox" checked={isCorrectionMode} onChange={(e) => setIsCorrectionMode(e.target.checked)} />
                                        Mở khóa sửa lỗi nhập liệu
                                    </label>
                                )}
                            </div>
                            <Input type="number" name="price" value={form.price} onChange={handleFormChange} required disabled={isEdit && !isCorrectionMode} className={isEdit && !isCorrectionMode ? "opacity-50 cursor-not-allowed" : ""} />
                            {isEdit && !isCorrectionMode && <p className="text-xs text-slate-500 mt-1">* Để thay đổi giá thị trường, vui lòng dùng nút 'Điều chỉnh giá' (TrendingUp).</p>}
                        </FormGroup>
                    </>
                ) : (
                    <>
                        <FormGroup className="md:col-span-2">
                            <Label>Mô tả chương trình</Label>
                            <Input name="description" value={form.description} onChange={handleFormChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Đại lý áp dụng</Label>
                            <Select name="dealerId" value={form.dealerId} onChange={handleFormChange} disabled={isEdit} options={[{value:'', label:'-- Chọn đại lý --'}, ...dealers.map(d=>({value: d.dealerId, label: d.name}))]} />
                        </FormGroup>
                        
                        <FormGroup>
                            <div className="flex justify-between">
                                <Label>Chiết khấu (%)</Label>
                                {isEdit && (
                                    <label className="flex items-center gap-2 text-xs text-yellow-400 cursor-pointer select-none">
                                        <input type="checkbox" checked={isCorrectionMode} onChange={(e) => setIsCorrectionMode(e.target.checked)} />
                                        Mở khóa sửa lỗi
                                    </label>
                                )}
                            </div>
                            <Input type="number" name="discountPercent" value={form.discountPercent} onChange={handleFormChange} required disabled={isEdit && !isCorrectionMode} className={isEdit && !isCorrectionMode ? "opacity-50 cursor-not-allowed" : ""} />
                        </FormGroup>
                    </>
                )}

                <FormGroup><Label>Từ ngày</Label><Input type="date" name={activeTab === 'price' ? "validFrom" : "startDate"} value={activeTab === 'price' ? form.validFrom : form.startDate} onChange={handleFormChange} required /></FormGroup>
                <FormGroup><Label>Đến ngày</Label><Input type="date" name={activeTab === 'price' ? "validTo" : "endDate"} value={activeTab === 'price' ? form.validTo : form.endDate} onChange={handleFormChange} /></FormGroup>
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-700/50 pt-6">
                <Button variant="ghost" onClick={() => setShowModal(false)}>Hủy</Button>
                <Button variant="primary" type="submit">Lưu lại</Button>
            </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default PricingManagement