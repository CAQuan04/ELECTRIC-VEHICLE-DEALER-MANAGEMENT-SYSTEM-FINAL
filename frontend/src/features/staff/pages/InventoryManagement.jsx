import React, { useState, useEffect, useMemo } from "react";
import { 
  Package, Truck, FileText, Plus, Check, X, 
  Warehouse, Search, Filter, ChevronDown, RefreshCw 
} from "lucide-react";
import apiClient from "../../../utils/api/client";
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

  // --- FETCH DATA FROM API ---
  useEffect(() => {
    fetchAllData();
  }, []);

  // helper: unwrap response từ apiClient
  const unwrap = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data !== undefined) return res.data;
    if (res.items !== undefined) return res.items;
    return res;
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting fetchAllData...');

      console.log('📡 Fetching vehicles...');
      const vehiclesRes = await apiClient.get('/admin/vehicles');
      const vehiclesData = unwrap(vehiclesRes);
      console.log('✅ Vehicles:', vehiclesData);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);

      console.log('📡 Fetching dealers...');
      const dealersRes = await apiClient.get('/Dealers/basic');
      const dealersData = unwrap(dealersRes);
      console.log('✅ Dealers:', dealersData);
      setDealers(Array.isArray(dealersData) ? dealersData : []);

      console.log('📡 Fetching inventory...');
      const inventoryRes = await apiClient.get('/Inventory/summary');
      const inventoryData = unwrap(inventoryRes);
      console.log('✅ Inventory:', inventoryData);
      setInventories(Array.isArray(inventoryData) ? inventoryData : []);

      console.log('📡 Fetching distributions...');
      const distributionsRes = await apiClient.get('/Inventory/distributions/summary');
      const distributionsData = unwrap(distributionsRes);
      console.log('✅ Distributions:', distributionsData);
      setDistributions(Array.isArray(distributionsData) ? distributionsData : []);

      console.log('📡 Fetching purchase requests...');
      const requestsRes = await apiClient.get('/v1/dealer-requests/pending');
      const requestsData = unwrap(requestsRes);
      console.log('✅ Purchase Requests:', requestsData);
      setPurchaseRequests(Array.isArray(requestsData) ? requestsData : []);

      console.log('🎉 All data loaded successfully!');
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      alert(`Không thể tải dữ liệu: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset filter khi chuyển tab
  useEffect(() => {
    setFilter({ searchTerm: "", status: "", location: "" });
  }, [activeTab]);

  // --- FILTER LOGIC ---
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
          (item.model && item.model.toLowerCase().includes(term)) ||
          (item.toDealerName && item.toDealerName.toLowerCase().includes(term));

      // 2. Status Logic
      const matchStatus = !filter.status || item.status === filter.status;

      // 3. Location Logic
      const matchLocation = !filter.location || 
          (item.locationName === filter.location) || 
          (item.fromLocation === filter.location);

      if (activeTab === 'inventory') return matchSearch && matchLocation;
      return matchSearch && matchStatus;
    });
  }, [activeTab, inventories, distributions, purchaseRequests, filter]);

  // Lấy danh sách Location unique
  const uniqueLocations = useMemo(() => {
    const locs = new Set(inventories.map(i => i.locationName));
    return Array.from(locs);
  }, [inventories]);

  // Lấy danh sách kho HQ từ inventory
  const hqLocations = useMemo(() => {
    const hqItems = inventories.filter(i => i.locationType === 'HQ');
    const uniqueHQ = new Set(hqItems.map(i => i.locationName));
    return Array.from(uniqueHQ);
  }, [inventories]);

  // Lấy danh sách kho HQ có đủ hàng cho xe được chọn
  const availableHQLocations = useMemo(() => {
    if (!form.vehicleId || !form.configId) return [];

    const validInventories = inventories.filter(i =>
      // so sánh an toàn số/string
      Number(i.locationType === 'HQ' ? i.locationType === 'HQ' : i.locationType) || true && // keep existing filter structure
      i.locationType === 'HQ' &&
      Number(i.vehicleId) === Number(form.vehicleId) &&
      Number(i.configId) === Number(form.configId) &&
      Number(i.quantity) > 0
    );

    return validInventories.map(i => ({
      name: i.locationName,
      quantity: i.quantity
    }));
  }, [inventories, form.vehicleId, form.configId]);

  // --- HANDLERS ---
  const handleVehicleChangeInModal = (vehicleId) => {
    setForm(prev => ({...prev, vehicleId, configId: ''}));
    if (vehicleId) {
      const vehicle = vehicles.find(v => v.vehicleId == vehicleId);
      setConfigs(vehicle?.configs || []);
    } else {
      setConfigs([]);
    }
  };

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setActionData({ approvedQty: type === 'approve' ? Number(request.quantity) || 0 : 0, reason: "" });
    setShowActionModal(true);
  };

  const submitAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      if (actionType === 'approve') {
        const approvedQtyNum = Number(actionData.approvedQty) || 0;
        // Ensure approvedQty is number and <= requested quantity
        if (approvedQtyNum <= 0) return alert("Vui lòng nhập số lượng duyệt hợp lệ.");

        await apiClient.post(`/v1/dealer-requests/${selectedRequest.requestId}/approve`, {
          approvedItems: [{
            vehicleId: Number(selectedRequest.vehicleId),
            quantity: approvedQtyNum
          }]
        });

        alert(`Đã duyệt yêu cầu #${selectedRequest.requestId} thành công!`);
        await fetchAllData();

        if (window.confirm("Tạo phiếu điều phối ngay?")) {
          prepareDistributionFromRequest(selectedRequest, approvedQtyNum);
        }
      } else {
        await apiClient.post(`/v1/dealer-requests/${selectedRequest.requestId}/reject`, {
          reason: actionData.reason || "Không có lý do"
        });
        alert(`Đã từ chối yêu cầu #${selectedRequest.requestId}`);
        await fetchAllData();
      }

      setShowActionModal(false);
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
      // Không vô hiệu hoá modal / không xóa request local khi lỗi xảy ra
    }
  };

  const prepareDistributionFromRequest = (req, qty) => {
    handleVehicleChangeInModal(req.vehicleId);
    setForm({
      vehicleId: req.vehicleId,
      configId: req.configId,
      quantity: qty,
      fromLocation: 'Kho Tong Ha Noi',
      toDealerId: req.dealerId,
      scheduledDate: new Date().toISOString().slice(0, 10),
      dealerRequestId: req.requestId
    });
    setActiveTab('distribution');
    setShowFormModal(true);
    setShowActionModal(false);
  };

  const openCreateModal = (type) => {
    if (type === 'inventory') {
      setForm({ 
        vehicleId: '', 
        configId: '', 
        quantity: '', 
        locationType: "HQ", 
        locationId: '1' 
      });
    } else {
      // Distribution form - cho phép chọn kho
      setForm({ 
        vehicleId: '', 
        configId: '', 
        quantity: '', 
        fromLocation: '', // Để trống để user chọn
        toDealerId: '', 
        scheduledDate: new Date().toISOString().slice(0, 10),
        dealerRequestId: 0
      });
    }
    setShowFormModal(true);
    console.log('🎬 Opened create modal for:', type, 'Initial form:', form);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'distribution') {
        // Chuẩn bị data
        const requestData = {
          dealerRequestId: form.dealerRequestId || 0,
          toDealerId: parseInt(form.toDealerId),
          fromLocation: form.fromLocation,
          scheduledDate: form.scheduledDate,
          items: [{
            vehicleId: parseInt(form.vehicleId),
            configId: parseInt(form.configId),
            quantity: parseInt(form.quantity)
          }]
        };

        // Log để debug
        console.log('📤 Sending distribution request:', requestData);
        console.log('📋 Form data:', form);
        
        // Validate trước khi gửi
        if (!requestData.toDealerId || isNaN(requestData.toDealerId)) {
          alert('Vui lòng chọn đại lý!');
          return;
        }
        if (!requestData.items[0].vehicleId || isNaN(requestData.items[0].vehicleId)) {
          alert('Vui lòng chọn xe!');
          return;
        }
        if (!requestData.items[0].configId || isNaN(requestData.items[0].configId)) {
          alert('Vui lòng chọn phiên bản!');
          return;
        }
        if (!requestData.items[0].quantity || requestData.items[0].quantity <= 0) {
          alert('Vui lòng nhập số lượng hợp lệ!');
          return;
        }
        if (!requestData.scheduledDate) {
          alert('Vui lòng chọn ngày giao!');
          return;
        }

        // Gửi request
        const response = await apiClient.post('/v1/distributions', requestData);
        console.log('✅ Distribution created:', response);
        
        alert("Đã tạo phiếu điều phối thành công!");
        fetchAllData();
        setShowFormModal(false);
        
      } else if (activeTab === 'inventory') {
        // Nhập xuất kho
        const requestData = {
          vehicleId: parseInt(form.vehicleId),
          configId: parseInt(form.configId),
          quantity: parseInt(form.quantity),
          locationType: form.locationType,
          locationId: parseInt(form.locationId)
        };

        console.log('📤 Sending inventory request:', requestData);

        // Validate
        if (!requestData.vehicleId || isNaN(requestData.vehicleId)) {
          alert('Vui lòng chọn xe!');
          return;
        }
        if (!requestData.configId || isNaN(requestData.configId)) {
          alert('Vui lòng chọn phiên bản!');
          return;
        }
        if (isNaN(requestData.quantity)) {
          alert('Vui lòng nhập số lượng hợp lệ!');
          return;
        }

        const response = await apiClient.post('/Inventory/stock', requestData);
        console.log('✅ Inventory updated:', response);
        
        alert("Đã cập nhật tồn kho thành công!");
        fetchAllData();
        setShowFormModal(false);
      }
      
    } catch (error) {
      console.error("❌ Error saving form:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error config:", error.config);
      
      // Hiển thị error chi tiết hơn
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.title || 
                       error.response?.data || 
                       error.message;
      
      alert(`Có lỗi xảy ra: ${errorMsg}`);
    }
  };

  // --- COLUMNS ---
  const inventoryColumns = useMemo(() => [
    { key: 'inventoryId', label: 'Mã Kho', render: (row) => <span className="font-mono text-cyan-300">#{row.inventoryId}</span> },
    { key: 'product', label: 'Sản phẩm', render: (row) => (
      <div>
        <div className="font-bold text-white">{row.vehicleName}</div>
        <div className="text-xs text-gray-400">{row.configName}</div>
      </div>
    )},
    { key: 'locationName', label: 'Địa điểm' },
    { key: 'quantity', label: 'Tồn kho', render: (row) => <span className="text-emerald-400 font-bold text-lg">{row.quantity}</span> },
    { key: 'updatedAt', label: 'Cập nhật', render: (row) => row.updatedAt && row.updatedAt !== '0001-01-01T00:00:00' ? new Date(row.updatedAt).toLocaleDateString('vi-VN') : 'N/A' },
  ], []);

  const distributionColumns = useMemo(() => [
    { key: 'distId', label: 'Mã Phiếu', render: (row) => <span className="font-mono text-sky-300">#{row.distId}</span> },
    { key: 'product', label: 'Sản phẩm', render: (row) => (
      <div>
        <div className="font-bold text-white">{row.vehicleName}</div>
        <div className="text-xs text-gray-400">{row.configName}</div>
      </div>
    )},
    { key: 'quantity', label: 'SL', render: (row) => <span className="font-bold">{row.quantity}</span> },
    { key: 'route', label: 'Lộ trình', render: (row) => (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">{row.fromLocation}</span>
        <span className="text-gray-500">→</span>
        <span className="text-white font-medium">{row.toDealerName}</span>
      </div>
    )},
    { key: 'scheduledDate', label: 'Ngày giao', render: (row) => new Date(row.scheduledDate).toLocaleDateString('vi-VN') },
    { key: 'status', label: 'Trạng thái', render: (row) => {
      const statusMap = {
        'Completed': { variant: 'success', label: 'Hoàn thành' },
        'InTransit': { variant: 'info', label: 'Đang vận chuyển' },
        'Scheduled': { variant: 'warning', label: 'Đã lên lịch' },
        'Pending': { variant: 'warning', label: 'Chờ xử lý' },
        'Cancelled': { variant: 'danger', label: 'Đã hủy' },
        'Failed_OutOfStock': { variant: 'danger', label: 'Thất bại - Hết hàng' }
      };
      const status = statusMap[row.status] || { variant: 'warning', label: row.status };
      return <Badge variant={status.variant}>{status.label}</Badge>;
    }},
  ], []);

  const requestColumns = useMemo(() => [
    { key: 'requestId', label: 'ID', render: (row) => <span className="font-mono text-orange-300">#{row.requestId}</span> },
    { key: 'dealerId', label: 'Đại lý', render: (row) => {
      const dealer = dealers.find(d => d.dealerId === row.dealerId);
      return dealer?.name || `Đại lý #${row.dealerId}`;
    }},
    { key: 'product', label: 'Sản phẩm', render: (row) => {
      const vehicle = vehicles.find(v => v.vehicleId === row.vehicleId);
      const config = vehicle?.configs?.find(c => c.configId === row.configId);
      return (
        <div>
          <div className="font-bold text-white">{vehicle?.model || 'N/A'}</div>
          <div className="text-xs text-gray-400">{config?.color || 'N/A'}</div>
        </div>
      );
    }},
    { key: 'quantity', label: 'SL', render: (row) => <span className="font-bold text-white">{row.quantity}</span> },
    { key: 'createdAt', label: 'Ngày tạo', render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN') },
    { key: 'status', label: 'Trạng thái', render: (row) => (
      <Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}>
        {row.status === 'Approved' ? 'Đã duyệt' : row.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
      </Badge>
    )},
    { key: 'actions', label: 'Tác vụ', render: (row) => (
      row.status === 'Pending' ? (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="!p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20" onClick={() => openActionModal(row, 'approve')}>
            <Check size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="!p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => openActionModal(row, 'reject')}>
            <X size={16} />
          </Button>
        </div>
      ) : <span className="text-gray-500 text-xs italic">Đã xử lý</span>
    )}
  ], [dealers, vehicles]);

  // --- RENDER ---
  return (
    <PageContainer>
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
        {/* TAB NAVIGATOR */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { id: 'inventory', label: 'Tồn kho', icon: Package, color: 'text-emerald-400' },
            { id: 'distribution', label: 'Điều phối xe', icon: Truck, color: 'text-sky-400' },
            { id: 'requests', label: 'Yêu cầu đặt hàng', icon: FileText, color: 'text-orange-400', count: purchaseRequests.filter(r => r.status === 'Pending').length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all duration-300 border
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

        {/* FILTER BAR */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 shadow-2xl overflow-x-auto rounded-lg mb-6">
          <div className="flex items-center w-full h-auto md:h-24">
            <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
              <span className="text-blue-400 font-bold text-lg tracking-wide mr-3">Filter</span>
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
            </div>

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

            {activeTab === 'inventory' ? (
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
              <div className="h-full relative px-4 md:px-6 flex-1 min-w-[200px] hover:bg-[#1a2b44]/30 transition flex items-center justify-between cursor-pointer">
                <span className="text-gray-300 text-base font-semibold truncate mr-2">Trạng thái</span>
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-white">
                  <option value="" className="bg-[#1e293b]">Tất cả</option>
                  {activeTab === 'distribution' ? (
                    <>
                      <option value="Pending" className="bg-[#1e293b]">Chờ xử lý</option>
                      <option value="Scheduled" className="bg-[#1e293b]">Đã lên lịch</option>
                      <option value="InTransit" className="bg-[#1e293b]">Đang vận chuyển</option>
                      <option value="Completed" className="bg-[#1e293b]">Hoàn thành</option>
                      <option value="Cancelled" className="bg-[#1e293b]">Đã hủy</option>
                      <option value="Failed_OutOfStock" className="bg-[#1e293b]">Thất bại</option>
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

        {/* CONTENT GRID */}
        <Card className="p-0 overflow-hidden border-0 bg-transparent shadow-none">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-gray-400">Đang tải dữ liệu...</div>
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

      {/* MODALS */}
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} title={activeTab === 'inventory' ? 'Nhập/Xuất Kho' : 'Tạo Phiếu Điều Phối'} size="lg">
        <form onSubmit={handleSaveForm}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup>
              <Label>Chọn xe</Label>
              <Select value={form.vehicleId} onChange={e => handleVehicleChangeInModal(e.target.value)} 
                options={[{value: '', label: '-- Chọn xe --'}, ...vehicles.map(v => ({value: v.vehicleId, label: v.model}))]} />
            </FormGroup>
            <FormGroup>
              <Label>Phiên bản</Label>
              <Select value={form.configId} onChange={e => setForm({...form, configId: e.target.value})} disabled={!form.vehicleId} 
                options={[{value: '', label: '-- Chọn phiên bản --'}, ...configs.map(c => ({value: c.configId, label: `${c.color} - ${c.batteryKwh}kWh`}))]} />
            </FormGroup>
            <FormGroup>
              <Label>Số lượng</Label>
              <Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required min="1" />
            </FormGroup>
            {activeTab === 'distribution' && (
              <>
                <FormGroup>
                  <Label>Từ kho <span className="text-red-400">*</span></Label>
                  <Select 
                    value={form.fromLocation} 
                    onChange={e => setForm({...form, fromLocation: e.target.value})} 
                    required
                    disabled={!form.vehicleId || !form.configId}
                    options={[
                      {value: '', label: availableHQLocations.length > 0 ? '-- Chọn kho --' : '-- Không có kho nào --'},
                      ...availableHQLocations.map(loc => ({
                        value: loc.name, 
                        label: `${loc.name} (Tồn: ${loc.quantity})`
                      }))
                    ]} 
                  />
                  {!form.vehicleId || !form.configId ? (
                    <span className="text-xs text-yellow-400 mt-1 block">
                      ⚠️ Vui lòng chọn xe và phiên bản trước
                    </span>
                  ) : availableHQLocations.length === 0 ? (
                    <span className="text-xs text-red-400 mt-1 block">
                      ❌ Không có kho HQ nào có sẵn xe này
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 mt-1 block">
                      ℹ️ Chỉ hiển thị kho có hàng sẵn
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Đến Đại lý <span className="text-red-400">*</span></Label>
                  <Select 
                    value={form.toDealerId} 
                    onChange={e => setForm({...form, toDealerId: e.target.value})} 
                    required
                    options={[{value: '', label: '-- Chọn đại lý --'}, ...dealers.map(d => ({value: d.dealerId, label: d.name}))]} 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Ngày giao dự kiến <span className="text-red-400">*</span></Label>
                  <Input 
                    type="date" 
                    value={form.scheduledDate} 
                    onChange={e => setForm({...form, scheduledDate: e.target.value})} 
                    required 
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </FormGroup>
              </>
            )}
            
            {activeTab === 'inventory' && (
              <>
                <FormGroup>
                  <Label>Loại kho</Label>
                  <Select 
                    value={form.locationType} 
                    onChange={e => setForm({...form, locationType: e.target.value})}
                    options={[
                      {value: 'HQ', label: 'Kho Tổng (HQ)'},
                      {value: 'DEALER', label: 'Đại lý'}
                    ]} 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Vị trí</Label>
                  {form.locationType === 'HQ' ? (
                    <Input value="Kho Tổng" disabled className="opacity-60 cursor-not-allowed" />
                  ) : (
                    <Select 
                      value={form.locationId} 
                      onChange={e => setForm({...form, locationId: e.target.value})}
                      options={[{value: '', label: '-- Chọn đại lý --'}, ...dealers.map(d => ({value: d.dealerId, label: d.name}))]} 
                    />
                  )}
                </FormGroup>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-end gap-4 border-t border-gray-700/50 pt-6">
            <Button variant="ghost" type="button" onClick={() => setShowFormModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit">{activeTab === 'inventory' ? 'Lưu' : 'Tạo Phiếu'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} 
        title={actionType === 'approve' ? `Duyệt Yêu Cầu #${selectedRequest?.requestId}` : `Từ Chối Yêu Cầu #${selectedRequest?.requestId}`} size="md">
        <form onSubmit={submitAction}>
          {actionType === 'approve' ? (
            <FormGroup>
              <Label>Số lượng duyệt</Label>
              <Input type="number" min="1" max={selectedRequest?.quantity} value={actionData.approvedQty} 
                onChange={e => setActionData({...actionData, approvedQty: e.target.value})}/>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>Lý do từ chối</Label>
              <Input value={actionData.reason} onChange={e => setActionData({...actionData, reason: e.target.value})} placeholder="Nhập lý do..." />
            </FormGroup>
          )}
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowActionModal(false)}>Hủy</Button>
            <Button variant={actionType === 'approve' ? 'primary' : 'danger'} type="submit">Xác nhận</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default InventoryManagement;