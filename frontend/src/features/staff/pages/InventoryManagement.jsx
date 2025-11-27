import React, { useState, useEffect, useMemo } from "react";
import { 
  Package, Truck, FileText, Plus, Check, X, 
  Warehouse, Search, Filter, ChevronDown, RefreshCw 
} from "lucide-react";
import apiClient from "../../../utils/api/client"; // Đảm bảo đúng path client
import { useAuth } from "../../../context/AuthContext";

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

// --- 1. MOCK DATA DEFINITIONS ---

const MOCK_INVENTORY = [
  { inventoryId: 101, vehicleName: "VinFast VF 8", configName: "Eco - Trắng", locationName: "Kho Tổng Hà Nội", quantity: 15, updatedAt: "2025-11-25T08:00:00Z" },
  { inventoryId: 102, vehicleName: "VinFast VF 8", configName: "Plus - Đen", locationName: "Kho Tổng Hà Nội", quantity: 8, updatedAt: "2025-11-24T14:30:00Z" },
  { inventoryId: 103, vehicleName: "VinFast VF 9", configName: "Eco - Xanh", locationName: "Kho Đà Nẵng", quantity: 5, updatedAt: "2025-11-20T09:15:00Z" },
  { inventoryId: 104, vehicleName: "VinFast VF 5", configName: "Standard - Đỏ", locationName: "Kho HCM", quantity: 20, updatedAt: "2025-11-26T10:00:00Z" },
  { inventoryId: 105, vehicleName: "VinFast VF 6", configName: "Plus - Bạc", locationName: "Kho HCM", quantity: 12, updatedAt: "2025-11-26T11:00:00Z" },
];

const MOCK_DISTRIBUTIONS = [
  { distId: 501, vehicleName: "VinFast VF 8", configName: "Eco - Trắng", quantity: 2, fromLocation: "Kho Tổng Hà Nội", toDealerName: "VinFast Thăng Long", scheduledDate: "2025-11-28", status: "Pending" },
  { distId: 502, vehicleName: "VinFast VF 5", configName: "Standard - Đỏ", quantity: 5, fromLocation: "Kho HCM", toDealerName: "VinFast An Thái", scheduledDate: "2025-11-27", status: "Completed" },
  { distId: 503, vehicleName: "VinFast VF 9", configName: "Plus - Xám", quantity: 1, fromLocation: "Kho Đà Nẵng", toDealerName: "VinFast Hải Châu", scheduledDate: "2025-11-30", status: "In Transit" },
];

const MOCK_REQUESTS = [
  { requestId: 88, dealerId: 101, dealerName: "VinFast Thăng Long", productId: 5, productName: "VF 8 Eco", qty: 2, createdAt: "2025-11-20T08:30:00Z", status: "Pending" },
  { requestId: 89, dealerId: 102, dealerName: "VinFast An Thái", productId: 7, productName: "VF 9 Plus", qty: 1, createdAt: "2025-11-21T09:15:00Z", status: "Pending" },
  { requestId: 90, dealerId: 103, dealerName: "VinFast Hải Châu", productId: 3, productName: "VF e34", qty: 5, createdAt: "2025-11-22T10:00:00Z", status: "Pending" },
  { requestId: 91, dealerId: 101, dealerName: "VinFast Thăng Long", productId: 5, productName: "VF 5 Plus", qty: 10, createdAt: "2025-11-19T08:30:00Z", status: "Approved" },
];

const MOCK_VEHICLES = [
  { vehicleId: 1, model: "VinFast VF 5" },
  { vehicleId: 2, model: "VinFast VF 6" },
  { vehicleId: 3, model: "VinFast VF 8" },
  { vehicleId: 4, model: "VinFast VF 9" },
];

const MOCK_DEALERS = [
  { dealerId: 101, name: "VinFast Thăng Long" },
  { dealerId: 102, name: "VinFast An Thái" },
  { dealerId: 103, name: "VinFast Hải Châu" },
];

const MOCK_CONFIGS = [
  { configId: 10, color: "Trắng", batteryKwh: 60 },
  { configId: 11, color: "Đen", batteryKwh: 80 },
  { configId: 12, color: "Đỏ", batteryKwh: 60 },
];

const InventoryManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("inventory");

  // --- STATE ---
  const [inventories, setInventories] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  
  // Filter State
  const [filter, setFilter] = useState({ searchTerm: "", status: "", location: "" });

  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  
  const [form, setForm] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [actionData, setActionData] = useState({ approvedQty: 0, reason: "" });

  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [configs, setConfigs] = useState([]); 

  const canManage = user?.role === 'Admin' || user?.role === 'EVMStaff';

  // --- 2. SIMULATE API FETCH ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInventories(MOCK_INVENTORY);
      setDistributions(MOCK_DISTRIBUTIONS);
      setPurchaseRequests(MOCK_REQUESTS);
      setVehicles(MOCK_VEHICLES);
      setDealers(MOCK_DEALERS);
      setLoading(false);
    }, 500);
  }, []);

  // Reset filter khi chuyển tab
  useEffect(() => {
    setFilter({ searchTerm: "", status: "", location: "" });
  }, [activeTab]);

  // --- 3. FILTER LOGIC ---
  const filteredData = useMemo(() => {
    let data = [];
    if (activeTab === 'inventory') data = inventories;
    else if (activeTab === 'distribution') data = distributions;
    else data = purchaseRequests;

    return data.filter(item => {
      // 1. Search Logic
      const term = filter.searchTerm.toLowerCase();
      const matchSearch = !filter.searchTerm || 
          (item.vehicleName && item.vehicleName.toLowerCase().includes(term)) ||
          (item.productName && item.productName.toLowerCase().includes(term)) ||
          (item.dealerName && item.dealerName.toLowerCase().includes(term)) ||
          (item.toDealerName && item.toDealerName.toLowerCase().includes(term));

      // 2. Status Logic (Cho Distribution & Requests)
      const matchStatus = !filter.status || item.status === filter.status;

      // 3. Location Logic (Cho Inventory)
      const matchLocation = !filter.location || 
          (item.locationName === filter.location) || 
          (item.fromLocation === filter.location);

      // Kết hợp logic theo Tab
      if (activeTab === 'inventory') return matchSearch && matchLocation;
      return matchSearch && matchStatus;
    });
  }, [activeTab, inventories, distributions, purchaseRequests, filter]);

  // Lấy danh sách Location unique cho Dropdown
  const uniqueLocations = useMemo(() => {
    const locs = new Set(inventories.map(i => i.locationName));
    return Array.from(locs);
  }, [inventories]);

  // --- 4. HANDLERS ---
  const handleVehicleChangeInModal = (vehicleId) => {
    setForm(prev => ({...prev, vehicleId, configId: ''}));
    if (vehicleId) setConfigs(MOCK_CONFIGS);
    else setConfigs([]);
  };

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setActionData({ approvedQty: type === 'approve' ? request.qty : 0, reason: "" });
    setShowActionModal(true);
  };

  const submitAction = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
    
    alert(`[MOCK] Đã chuyển trạng thái yêu cầu #${selectedRequest.requestId} sang ${newStatus}`);
    
    setPurchaseRequests(prev => prev.map(req => 
      req.requestId === selectedRequest.requestId ? { ...req, status: newStatus } : req
    ));

    if (actionType === 'approve' && window.confirm("Tạo phiếu điều phối ngay?")) {
      prepareDistributionFromRequest(selectedRequest, actionData.approvedQty);
    }
    setShowActionModal(false);
  };

  const prepareDistributionFromRequest = (req, qty) => {
    handleVehicleChangeInModal(req.productId || req.vehicleId); 
    setForm({
      vehicleId: req.productId || req.vehicleId,
      configId: '', 
      quantity: qty,
      fromLocation: 'Kho Tổng Hà Nội',
      toDealerId: req.dealerId,
      scheduledDate: new Date().toISOString().slice(0, 10),
    });
    setActiveTab('distribution');
    setShowFormModal(true);
    setShowActionModal(false);
  };

  const openCreateModal = (type) => {
    setForm(type === 'inventory' 
      ? { vehicleId: '', configId: '', quantity: '', locationType: "HQ", locationId: '1' }
      : { vehicleId: '', configId: '', quantity: '', fromLocation: 'Kho Tổng Hà Nội', toDealerId: '', scheduledDate: new Date().toISOString().slice(0, 10) }
    );
    setShowFormModal(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (activeTab === 'inventory') {
        const selectedVehicle = vehicles.find(v => v.vehicleId == form.vehicleId);
        const selectedConfig = configs.find(c => c.configId == form.configId);
        const newItem = {
            inventoryId: Math.floor(Math.random() * 1000) + 1000,
            vehicleName: selectedVehicle?.model || "Unknown",
            configName: selectedConfig ? `${selectedConfig.color} - ${selectedConfig.batteryKwh}kWh` : "Base",
            locationName: "Kho Mới Nhập",
            quantity: form.quantity,
            updatedAt: new Date().toISOString()
        };
        setInventories(prev => [newItem, ...prev]);
        alert("[MOCK] Đã cập nhật tồn kho!");
    } else {
        const selectedVehicle = vehicles.find(v => v.vehicleId == form.vehicleId);
        const selectedDealer = dealers.find(d => d.dealerId == form.toDealerId);
        const newItem = {
            distId: Math.floor(Math.random() * 1000) + 5000,
            vehicleName: selectedVehicle?.model || "Unknown",
            configName: "Standard",
            quantity: form.quantity,
            fromLocation: "Kho Tổng Hà Nội",
            toDealerName: selectedDealer?.name || "Đại lý X",
            scheduledDate: form.scheduledDate,
            status: "Pending"
        };
        setDistributions(prev => [newItem, ...prev]);
        alert("[MOCK] Đã tạo phiếu điều phối!");
    }
    setShowFormModal(false);
  };

  // --- 5. COLUMNS ---
  const inventoryColumns = useMemo(() => [
    { key: 'inventoryId', label: 'Mã Kho', render: (row) => <span className="font-mono text-cyan-300">#{row.inventoryId}</span> },
    { key: 'product', label: 'Sản phẩm', render: (row) => (<div><div className="font-bold text-white">{row.vehicleName}</div><div className="text-xs text-gray-400">{row.configName}</div></div>)},
    { key: 'locationName', label: 'Địa điểm' },
    { key: 'quantity', label: 'Tồn kho', render: (row) => <span className="text-emerald-400 font-bold text-lg">{row.quantity}</span> },
    { key: 'updatedAt', label: 'Cập nhật', render: (row) => new Date(row.updatedAt).toLocaleDateString('vi-VN') },
  ], []);

  const distributionColumns = useMemo(() => [
    { key: 'distId', label: 'Mã Phiếu', render: (row) => <span className="font-mono text-sky-300">#{row.distId}</span> },
    { key: 'product', label: 'Sản phẩm', render: (row) => (<div><div className="font-bold text-white">{row.vehicleName}</div><div className="text-xs text-gray-400">{row.configName}</div></div>)},
    { key: 'quantity', label: 'SL', render: (row) => <span className="font-bold">{row.quantity}</span> },
    { key: 'route', label: 'Lộ trình', render: (row) => (<div className="flex items-center gap-2 text-sm"><span className="text-gray-400">{row.fromLocation}</span><span className="text-gray-500">→</span><span className="text-white font-medium">{row.toDealerName}</span></div>)},
    { key: 'scheduledDate', label: 'Ngày giao', render: (row) => new Date(row.scheduledDate).toLocaleDateString('vi-VN') },
    { key: 'status', label: 'Trạng thái', render: (row) => (<Badge variant={row.status === 'Completed' ? 'success' : row.status === 'In Transit' ? 'info' : 'warning'}>{row.status}</Badge>)},
  ], []);

  const requestColumns = useMemo(() => [
    { key: 'requestId', label: 'ID', render: (row) => <span className="font-mono text-orange-300">#{row.requestId}</span> },
    { key: 'dealerName', label: 'Đại lý' },
    { key: 'productName', label: 'Sản phẩm' },
    { key: 'qty', label: 'SL', render: (row) => <span className="font-bold text-white">{row.qty}</span> },
    { key: 'createdAt', label: 'Ngày tạo', render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN') },
    { key: 'status', label: 'Trạng thái', render: (row) => (<Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}>{row.status === 'Approved' ? 'Đã duyệt' : row.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}</Badge>)},
    { key: 'actions', label: 'Tác vụ', render: (row) => (
        row.status === 'Pending' ? (
            <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="!p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20" onClick={() => openActionModal(row, 'approve')}><Check size={16} /></Button>
                <Button size="sm" variant="ghost" className="!p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => openActionModal(row, 'reject')}><X size={16} /></Button>
            </div>
        ) : <span className="text-gray-500 text-xs italic">Đã xử lý</span>
      )
    }
  ], []);

  // --- RENDER ---
  return (
    <PageContainer>
      {/* 1. Header */}
      <PageHeader
        title="Quản lý Tồn kho & Điều phối"
        subtitle="Theo dõi hàng tồn, điều phối xe về đại lý và xử lý yêu cầu đặt hàng."
        icon={<Warehouse />}
        breadcrumbs={[{ label: "Trang chủ", path: "/" }, { label: "Kho & Vận chuyển" }]}
        actions={canManage && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => openCreateModal(activeTab === 'requests' ? 'distribution' : activeTab)} disabled={activeTab === 'requests'}>
              {activeTab === 'inventory' ? 'Nhập/Xuất Kho' : 'Tạo Phiếu Điều Phối'}
            </Button>
        )}
      />

      <div className="mt-8 space-y-8">
        {/* 2. TAB NAVIGATOR */}
        <div className="flex flex-wrap gap-4 mb-4">
             {[
                  { id: 'inventory', label: 'Tồn kho', icon: Package, color: 'text-emerald-400' },
                  { id: 'distribution', label: 'Điều phối xe', icon: Truck, color: 'text-sky-400' },
                  { id: 'requests', label: 'Yêu cầu đặt hàng', icon: FileText, color: 'text-orange-400', count: purchaseRequests.filter(r => r.status === 'Pending').length },
              ].map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`
                       flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 border
                       ${activeTab === tab.id 
                          ? 'bg-slate-800 border-blue-500/50 text-white shadow-lg shadow-blue-500/10' 
                          : 'bg-transparent border-transparent text-gray-400 hover:bg-slate-800/50'}
                    `}
                 >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                    <span>{tab.label}</span>
                    {tab.count > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">{tab.count}</span>}
                 </button>
              ))}
        </div>

        {/* 3. FILTER BAR (CatalogueViewer Style) */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 shadow-2xl overflow-x-auto rounded-lg mb-6">
            <div className="flex items-center w-full h-auto md:h-24">
                
                {/* Label */}
                <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                    <span className="text-blue-400 font-bold text-lg tracking-wide mr-3">Filter</span>
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
                </div>

                {/* Search */}
                <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[250px] group cursor-text hover:bg-[#1a2b44]/20 transition">
                    <span className="text-gray-300 font-semibold text-base mr-3 hidden sm:block">Search</span>
                    <div className="relative flex-1">
                        <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                            <input 
                                type="text" 
                                placeholder="Tìm tên xe, đại lý..." 
                                value={filter.searchTerm}
                                onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                                className="w-full bg-transparent border-none p-0 text-white placeholder:text-gray-500 focus:ring-0 text-base font-medium"
                            />
                            {filter.searchTerm ? (
                                <button onClick={() => setFilter({...filter, searchTerm: ''})} className="text-gray-400 hover:text-white ml-2"><X className="w-5 h-5" /></button>
                            ) : (<Search className="w-5 h-5 text-gray-500 ml-2" />)}
                        </div>
                    </div>
                </div>

                {/* Dynamic Filters based on Active Tab */}
                {activeTab === 'inventory' ? (
                     /* Filter LOCATION for Inventory */
                    <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300 text-base font-semibold truncate mr-2">Kho / Vị trí</span>
                        <select value={filter.location} onChange={(e) => setFilter({ ...filter, location: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white">
                            <option value="" className="bg-[#1e293b]">Tất cả kho</option>
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc} className="bg-[#1e293b]">{loc}</option>
                            ))}
                        </select>
                        <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                        {filter.location && <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">{filter.location}</span>}
                    </div>
                ) : (
                    /* Filter STATUS for Distribution & Requests */
                    <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300 text-base font-semibold truncate mr-2">Trạng thái</span>
                        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white">
                            <option value="" className="bg-[#1e293b]">Tất cả</option>
                            {activeTab === 'distribution' ? (
                                <>
                                    <option value="Pending" className="bg-[#1e293b]">Pending</option>
                                    <option value="In Transit" className="bg-[#1e293b]">In Transit</option>
                                    <option value="Completed" className="bg-[#1e293b]">Completed</option>
                                </>
                            ) : (
                                <>
                                    <option value="Pending" className="bg-[#1e293b]">Chờ duyệt</option>
                                    <option value="Approved" className="bg-[#1e293b]">Đã duyệt</option>
                                    <option value="Rejected" className="bg-[#1e293b]">Từ chối</option>
                                </>
                            )}
                        </select>
                        <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                        {filter.status && <span className="absolute bottom-2 left-6 text-xs text-purple-400 font-bold tracking-wider truncate">{filter.status}</span>}
                    </div>
                )}
            </div>
        </div>

        {/* 4. CONTENT GRID */}
        <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
             {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-400">Đang tải dữ liệu mô phỏng...</div>
             ) : (
                <>
                   {activeTab === 'inventory' && <Table columns={inventoryColumns} data={filteredData} className="bg-[#1e293b]/50 backdrop-blur-xl" />}
                   {activeTab === 'distribution' && <Table columns={distributionColumns} data={filteredData} className="bg-[#1e293b]/50 backdrop-blur-xl" />}
                   {activeTab === 'requests' && <Table columns={requestColumns} data={filteredData} className="bg-[#1e293b]/50 backdrop-blur-xl" />}
                   
                   {filteredData.length === 0 && (
                       <EmptyState icon="📭" title="Không tìm thấy dữ liệu" description="Thử thay đổi bộ lọc tìm kiếm của bạn." 
                            action={<Button variant="ghost" size="sm" onClick={() => setFilter({searchTerm:"", status:"", location:""})} icon={<RefreshCw size={14}/>}>Xóa bộ lọc</Button>}
                       />
                   )}
                </>
             )}
        </Card>
      </div>

      {/* --- MODALs (Giữ nguyên) --- */}
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} title={activeTab === 'inventory' ? 'Nhập/Xuất Kho (Mock)' : 'Tạo Phiếu Điều Phối (Mock)'} size="lg">
        <form onSubmit={handleSaveForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup><Label>Chọn xe</Label><Select value={form.vehicleId} onChange={e => handleVehicleChangeInModal(e.target.value)} options={[{value: '', label: '-- Chọn xe --'}, ...vehicles.map(v => ({value: v.vehicleId, label: v.model}))]} /></FormGroup>
                <FormGroup><Label>Phiên bản</Label><Select value={form.configId} onChange={e => setForm({...form, configId: e.target.value})} disabled={!form.vehicleId} options={[{value: '', label: '-- Chọn phiên bản --'}, ...configs.map(c => ({value: c.configId, label: `${c.color} - ${c.batteryKwh}kWh`}))]} /></FormGroup>
                <FormGroup><Label>Số lượng</Label><Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required /></FormGroup>
                {activeTab === 'distribution' && (
                    <>
                        <FormGroup><Label>Từ kho</Label><Input value="Kho Tổng Hà Nội" disabled className="opacity-60 cursor-not-allowed" /></FormGroup>
                        <FormGroup><Label>Đến Đại lý</Label><Select value={form.toDealerId} onChange={e => setForm({...form, toDealerId: e.target.value})} options={[{value: '', label: '-- Chọn đại lý --'}, ...dealers.map(d => ({value: d.dealerId, label: d.name}))]} /></FormGroup>
                        <FormGroup><Label>Ngày giao dự kiến</Label><Input type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} required /></FormGroup>
                    </>
                )}
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-700/50 pt-6"><Button variant="ghost" onClick={() => setShowFormModal(false)}>Hủy</Button><Button variant="primary" type="submit">{activeTab === 'inventory' ? 'Lưu' : 'Tạo Phiếu'}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title={actionType === 'approve' ? `Duyệt Yêu Cầu #${selectedRequest?.requestId}` : `Từ Chối Yêu Cầu #${selectedRequest?.requestId}`} size="md">
         <form onSubmit={submitAction}>
            {actionType === 'approve' ? (
                <FormGroup><Label>Số lượng duyệt</Label><Input type="number" min="1" max={selectedRequest?.qty} value={actionData.approvedQty} onChange={e => setActionData({...actionData, approvedQty: e.target.value})}/><p className="text-xs text-gray-500 mt-2">* Data ảo: Không ảnh hưởng DB thật.</p></FormGroup>
            ) : (
                <FormGroup><Label>Lý do từ chối</Label><Input value={actionData.reason} onChange={e => setActionData({...actionData, reason: e.target.value})} placeholder="Nhập lý do..." /></FormGroup>
            )}
            <div className="mt-6 flex justify-end gap-4"><Button variant="ghost" onClick={() => setShowActionModal(false)}>Hủy</Button><Button variant={actionType === 'approve' ? 'primary' : 'danger'} type="submit">Xác nhận</Button></div>
         </form>
      </Modal>
    </PageContainer>
  );
};

export default InventoryManagement;