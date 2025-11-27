import React, { useMemo, useState, useEffect } from "react";
import { 
  FileText, Plus, Download, Upload, Calendar, 
  DollarSign, FileCheck, AlertCircle, ChevronDown, 
  Building2, Search, X, ArrowUpDown 
} from "lucide-react";

// Import apiClient
import apiClient from "../../../utils/api/apiClient";

// Import UI Components
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { FormGroup, Label, Input, Select } from '../components/ui/FormComponents';

// ==========================================
// HELPER UTILS
// ==========================================
const formatMoney = (n) => typeof n === "number" ? n.toLocaleString("vi-VN") + ' VNĐ' : n;

const exportToCSV = (data, fileName) => {
    if (!data || data.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }
    const headers = ["ID", "So HD", "Ngay bat dau", "Ngay ket thuc", "Trang thai", "Ghi chu"];
    const rows = data.map(item => [
        item.contractId,
        item.contractNumber || `HD-${item.contractId}`,
        item.startDate,
        item.endDate,
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

// ==========================================
// MAIN COMPONENT
// ==========================================
const DealerContractManagement = () => {
  // --- STATE ---
  const [dealers, setDealers] = useState([]); 
  const [selectedDealerId, setSelectedDealerId] = useState(''); 

  const [contracts, setContracts] = useState([]);
  const [targets, setTargets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [performance, setPerformance] = useState(null);

  const [loadingData, setLoadingData] = useState(false); 
  const [tab, setTab] = useState("contracts");

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Modal State
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractForm, setContractForm] = useState(null); 
  
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetForm, setTargetForm] = useState(null);

  const [uploadingFile, setUploadingFile] = useState(false);

  // --- LOGIC: FILTER & SORT DATA ---
  const processData = (data, idField, searchFields) => {
    let processed = [...data];

    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        processed = processed.filter(item => 
            searchFields.some(field => 
                String(item[field] || "").toLowerCase().includes(lowerTerm)
            )
        );
    }

    processed.sort((a, b) => {
        return sortOrder === 'newest' 
            ? b[idField] - a[idField] 
            : a[idField] - b[idField];
    });

    return processed;
  };

  const sortedContracts = useMemo(() => 
    processData(contracts, 'contractId', ['contractNumber', 'terms']), 
  [contracts, searchTerm, sortOrder]);

  const sortedTargets = useMemo(() => 
    processData(targets, 'targetId', ['periodStart', 'periodEnd']), 
  [targets, searchTerm, sortOrder]);

  const sortedDebts = useMemo(() => 
    processData(debts, 'debtId', ['status']), 
  [debts, searchTerm, sortOrder]);

  // --- API CALLS ---

  // Fetch list of dealers
  const fetchDealers = async () => {
    try {
      const response = await apiClient.get('/Dealers/basic');
      setDealers(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedDealerId(response.data[0].dealerId);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đại lý:", error);
    }
  };

  // Fetch contracts for selected dealer
  const fetchContracts = async (dealerId) => {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/contracts`);
      setContracts(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng:", error);
      setContracts([]);
    }
  };

  // Fetch targets for selected dealer
  const fetchTargets = async (dealerId) => {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/targets`);
      setTargets(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải KPI:", error);
      setTargets([]);
    }
  };

  // Fetch debts for selected dealer
  const fetchDebts = async (dealerId) => {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/debts`);
      setDebts(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải công nợ:", error);
      setDebts([]);
    }
  };

  // Fetch performance (optional - có thể dùng cho tab riêng)
  const fetchPerformance = async (dealerId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/manage/dealers/${dealerId}/performance`, {
        params: { startDate, endDate }
      });
      setPerformance(response.data);
    } catch (error) {
      console.error("Lỗi khi tải hiệu suất:", error);
      setPerformance(null);
    }
  };

  // --- LOGIC 1: LOAD DEALERS ---
  useEffect(() => {
    fetchDealers();
  }, []); 

  // --- LOGIC 2: LOAD DATA ---
  useEffect(() => {
    if (!selectedDealerId) return; 

    setLoadingData(true);
    
    Promise.all([
      fetchContracts(selectedDealerId),
      fetchTargets(selectedDealerId),
      fetchDebts(selectedDealerId)
    ]).finally(() => {
      setLoadingData(false);
    });

  }, [selectedDealerId]); 

  // --- LOGIC 3: UPLOAD FILE ---
  const handleFileChange = async (e, contractId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file PDF hoặc ảnh (JPG, PNG)!");
      return;
    }

    // If this is for creating new contract, just preview
    if (!contractId) {
      const blobUrl = URL.createObjectURL(file);
      setContractForm({
          ...contractForm,
          documentLink: blobUrl,
          fileName: file.name,
          fileToUpload: file
      });
      return;
    }

    // Upload file to server
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(
        `/manage/dealers/${selectedDealerId}/contracts/${contractId}/upload-pdf`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update contract in list
      setContracts(contracts.map(c => 
        c.contractId === contractId ? response.data : c
      ));

      alert("Upload file thành công!");
    } catch (error) {
      console.error("Lỗi khi upload file:", error);
      alert("Lỗi khi upload file: " + (error.response?.data?.message || error.message));
    } finally {
      setUploadingFile(false);
    }
  };

  // --- LOGIC 4: SAVE CONTRACT ---
  const handleContractSave = async () => {
    if (!contractForm.startDate || !contractForm.endDate) {
      alert("Vui lòng nhập đầy đủ ngày bắt đầu và kết thúc!");
      return;
    }

    if (new Date(contractForm.endDate) <= new Date(contractForm.startDate)) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
    }

    try {
      // Create contract
      const contractData = {
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
        terms: contractForm.terms || "",
        status: contractForm.status || "Active"
      };

      const response = await apiClient.post(
        `/manage/dealers/${selectedDealerId}/contracts`,
        contractData
      );

      const newContract = response.data;

      // If there's a file to upload, upload it
      if (contractForm.fileToUpload) {
        const formData = new FormData();
        formData.append('file', contractForm.fileToUpload);

        try {
          const uploadResponse = await apiClient.post(
            `/manage/dealers/${selectedDealerId}/contracts/${newContract.contractId}/upload-pdf`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          // Update with file URL
          setContracts([uploadResponse.data, ...contracts]);
        } catch (uploadError) {
          console.error("Lỗi khi upload file:", uploadError);
          // Still add contract even if upload fails
          setContracts([newContract, ...contracts]);
        }
      } else {
        setContracts([newContract, ...contracts]);
      }

      setShowContractModal(false);
      alert("Tạo hợp đồng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
      alert("Lỗi khi tạo hợp đồng: " + (error.response?.data?.message || error.message));
    }
  };
  
  // --- LOGIC 5: SAVE KPI ---
  const handleTargetSave = async () => {
    if (!targetForm.periodStart || !targetForm.periodEnd || !targetForm.salesTarget) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const targetData = {
        periodStart: targetForm.periodStart,
        periodEnd: targetForm.periodEnd,
        salesTarget: parseFloat(targetForm.salesTarget)
      };

      const response = await apiClient.post(
        `/manage/dealers/${selectedDealerId}/targets`,
        targetData
      );

      setTargets([response.data, ...targets]);
      setShowTargetModal(false);
      alert("Thiết lập KPI thành công!");
    } catch (error) {
      console.error("Lỗi khi thiết lập KPI:", error);
      alert("Lỗi khi thiết lập KPI: " + (error.response?.data?.message || error.message));
    }
  };

  // --- UI ACTIONS ---
  const openCreateContract = () => {
    setContractForm({
      contractNumber: "", 
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "", 
      documentLink: "", 
      fileName: "",
      terms: "",
      status: "Active",
      fileToUpload: null
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

  const handleExport = () => {
      const dealerName = dealers.find(d => d.dealerId == selectedDealerId)?.name || "DaiLy";
      exportToCSV(sortedContracts, `HD_${dealerName}.csv`);
  };
  
  const tabOptions = [
      { value: "contracts", label: "Hợp đồng" },
      { value: "targets", label: "KPI Doanh số" },
      { value: "debts", label: "Công nợ" }
  ];

  return (
    <PageContainer>
      {/* HEADER */}
      <PageHeader
        title="Hợp đồng & KPI"
        subtitle="Hồ sơ đại lý"
        description="Quản lý hợp đồng phân phối, theo dõi chỉ tiêu KPI và công nợ của từng đại lý."
        icon={<FileText />}
        breadcrumbs={[
          { label: "Trang chủ", path: "/" },
          { label: "Hợp đồng & KPI", path: "/contracts" }
        ]}
        actions={
          <div className="flex gap-3">
             {tab === "contracts" && (
                <Button 
                    variant="ghost"
                    className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    onClick={handleExport}
                >
                    <Download className="w-5 h-5 mr-2" /> Xuất Excel
                </Button>
             )}
             {tab === "contracts" ? (
                <Button variant="primary" onClick={openCreateContract} icon={<Plus className="w-5 h-5"/>}>
                    Hợp đồng mới
                </Button>
             ) : tab === "targets" ? (
                <Button variant="primary" onClick={openCreateTarget} icon={<Plus className="w-5 h-5"/>}>
                    Thiết lập KPI
                </Button>
             ) : null}
          </div>
        }
      />

      <div className="mt-8 space-y-8">
        
        {/* FILTER BAR */}
        <div className="w-full bg-[#13233a] border-y border-gray-700 mb-8 shadow-2xl overflow-x-auto rounded-lg">
          <div className="flex items-center w-full h-auto md:h-24">
              
              <div className="h-full flex items-center px-6 md:px-8 border-r border-gray-700/60 bg-[#1a2b44]/50 flex-none">
                  <span className="text-blue-400 font-bold text-lg md:text-xl tracking-wide mr-3">Filter</span>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-pulse"></div>
              </div>
              
              {/* SEARCH BAR */}
              <div className="h-full flex items-center flex-[2] px-4 md:px-6 border-r border-gray-700/60 min-w-[280px] group cursor-text hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 group-hover:text-white transition hidden sm:block">Search</span>
                  <div className="relative flex-1">
                     <div className="flex items-center bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 group-focus-within:border-blue-500 transition">
                        <input 
                          type="text" 
                          placeholder={tab === "contracts" ? "Số HĐ, điều khoản..." : "Tìm kiếm..."} 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="w-full bg-transparent border-none p-0 text-white placeholder:text-gray-500 focus:ring-0 text-base font-medium" 
                        />
                        {searchTerm ? ( 
                          <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-white ml-2">
                            <X className="w-5 h-5" />
                          </button> 
                        ) : (
                          <Search className="w-5 h-5 text-gray-500 ml-2" />
                        )}
                     </div>
                  </div>
              </div>

              {/* Select Dealer */}
              <div className="h-full flex items-center flex-1 px-4 md:px-6 border-r border-gray-700/60 min-w-[220px] group cursor-pointer hover:bg-[#1a2b44]/20 transition">
                  <span className="text-gray-300 font-semibold text-base mr-3 group-hover:text-white transition hidden sm:block">Đại lý</span>
                  <div className="relative flex-1">
                      <select 
                        value={selectedDealerId} 
                        onChange={(e) => setSelectedDealerId(e.target.value)} 
                        className="w-full bg-[#1e293b] border border-gray-600 rounded-xl px-3 py-2 text-white outline-none cursor-pointer"
                      >
                        {dealers.map(d => (
                            <option key={d.dealerId} value={d.dealerId} className="bg-[#1e293b] text-white">
                                {d.name}
                            </option>
                        ))}
                      </select>
                  </div>
              </div>

              {/* Tab Selector */}
              <div className="h-full relative px-4 md:px-6 flex-1 min-w-[180px] border-r border-gray-700/60 hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center">
                  <span className="text-gray-300 text-base font-semibold mr-2 truncate">Dữ liệu</span>
                  <select 
                    value={tab} 
                    onChange={(e) => setTab(e.target.value)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-white"
                  >
                    {tabOptions.map((t) => (
                        <option key={t.value} value={t.value} className="bg-[#1e293b] text-white">{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                  <span className="absolute bottom-2 left-6 text-xs text-cyan-400 font-bold tracking-wider truncate">
                      {tabOptions.find(t => t.value === tab)?.label}
                  </span>
              </div>

              {/* SORT SELECTOR */}
              <div className="h-full relative px-4 md:px-6 flex-1 min-w-[160px] hover:bg-[#1a2b44]/30 transition cursor-pointer flex items-center justify-between">
                   <span className="text-gray-300 text-base font-semibold mr-2 truncate">Thời gian</span>
                   <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-white"
                   >
                       <option value="newest" className="bg-[#1e293b] text-white">Mới nhất</option>
                       <option value="oldest" className="bg-[#1e293b] text-white">Cũ nhất</option>
                   </select>
                   <ArrowUpDown className="w-5 h-5 text-gray-400" />
                   <span className="absolute bottom-2 left-6 text-xs text-emerald-400 font-bold tracking-wider truncate">
                      {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                  </span>
              </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loadingData ? (
             <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
             </div>
        ) : (
             <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        
                        {/* TAB 1: HỢP ĐỒNG */}
                        {tab === "contracts" && (
                            <>
                                <thead>
                                    <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                                        <th className="px-8 py-6">Số Hợp đồng</th>
                                        <th className="px-8 py-6">Hiệu lực</th>
                                        <th className="px-8 py-6">Hết hạn</th>
                                        <th className="px-8 py-6">Điều khoản</th>
                                        <th className="px-8 py-6">Trạng thái</th>
                                        <th className="px-8 py-6">File</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {sortedContracts.length > 0 ? sortedContracts.map((c) => (
                                        <tr key={c.contractId} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900 dark:text-white">{c.contractNumber || `#${c.contractId}`}</div>
                                                {c.documentLink && (
                                                    <a href={c.documentLink} target="_blank" rel="noreferrer" download={c.fileName || "hop-dong.pdf"}
                                                       className="inline-flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:underline mt-1">
                                                        <FileText className="w-3 h-3" /> {c.fileName || "Xem file"}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-emerald-600 dark:text-emerald-400 font-medium">
                                                {new Date(c.startDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-8 py-6 text-red-500 dark:text-red-400 font-medium">
                                                {new Date(c.endDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-500 max-w-xs truncate" title={c.terms}>
                                                {c.terms}
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="success">{c.status}</Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                {c.documentLink ? (
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="text-cyan-600 dark:text-cyan-400 hover:underline"
                                                        onClick={() => window.open(c.documentLink, "_blank")}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" /> Tải xuống
                                                    </Button>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Chưa có file</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6"><EmptyState title="Không tìm thấy hợp đồng" description="Thử thay đổi bộ lọc tìm kiếm." /></td></tr>
                                    )}
                                </tbody>
                            </>
                        )}

                        {/* === TAB 2: KPI (TARGETS) === */}
                        {tab === "targets" && (
                            <>
                                <thead>
                                    <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                                        <th className="px-8 py-6">Kỳ đánh giá</th>
                                        <th className="px-8 py-6">Mục tiêu</th>
                                        <th className="px-8 py-6">Thực đạt</th>
                                        <th className="px-8 py-6">Tiến độ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {sortedTargets.length > 0 ? sortedTargets.map((t) => {
                                        const percent = t.salesTarget > 0 ? Math.round((t.actualSales / t.salesTarget) * 100) : 0;
                                        return (
                                            <tr key={t.targetId} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30">
                                                <td className="px-8 py-6 font-medium text-gray-700 dark:text-gray-300">
                                                    {t.periodStart} <span className="text-gray-400 mx-2">➝</span> {t.periodEnd}
                                                </td>
                                                <td className="px-8 py-6 font-bold text-yellow-600 dark:text-yellow-400">
                                                    {formatMoney(t.salesTarget)}
                                                </td>
                                                <td className="px-8 py-6 font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatMoney(t.actualSales)}
                                                </td>
                                                <td className="px-8 py-6 w-64">
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                        <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${Math.min(percent, 100)}%`}}></div>
                                                    </div>
                                                    <div className="text-right text-xs text-gray-500 mt-1 font-bold">{percent}%</div>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr><td colSpan="4"><EmptyState title="Không tìm thấy KPI" description="Thử thay đổi bộ lọc tìm kiếm." /></td></tr>
                                    )}
                                </tbody>
                            </>
                        )}

                        {/* === TAB 3: CÔNG NỢ (DEBTS) === */}
                        {tab === "debts" && (
                            <>
                                <thead>
                                    <tr className="bg-gray-100/50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm uppercase font-bold tracking-wider">
                                        <th className="px-8 py-6">Mã Nợ</th>
                                        <th className="px-8 py-6">Số tiền</th>
                                        <th className="px-8 py-6">Hạn thanh toán</th>
                                        <th className="px-8 py-6">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {sortedDebts.length > 0 ? sortedDebts.map((d) => (
                                        <tr key={d.debtId} className="hover:bg-cyan-50/30 dark:hover:bg-gray-700/30">
                                            <td className="px-8 py-6 font-mono text-gray-500 dark:text-gray-400">DEBT-{d.debtId}</td>
                                            <td className="px-8 py-6 font-bold text-gray-900 dark:text-white text-lg">{formatMoney(d.amountDue)}</td>
                                            <td className="px-8 py-6 text-gray-600 dark:text-gray-300">{d.dueDate}</td>
                                            <td className="px-8 py-6"><Badge variant="danger">{d.status}</Badge></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4"><EmptyState title="Không tìm thấy công nợ" description="Thử thay đổi bộ lọc tìm kiếm." /></td></tr>
                                    )}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>
             </Card>
        )}
      </div>

      {/* 4. MODAL CREATE CONTRACT */}
      <Modal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        title="Tạo Hợp đồng mới"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowContractModal(false)}>Hủy bỏ</Button>
            <Button variant="primary" onClick={handleContractSave}>Lưu Hợp đồng</Button>
          </>
        }
      >
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                    <Label required>Số Hợp đồng</Label>
                    <Input 
                        placeholder="VD: HD-2025-00X" 
                        value={contractForm?.contractNumber} 
                        onChange={(e) => setContractForm({...contractForm, contractNumber: e.target.value})} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label>File đính kèm (PDF/Ảnh)</Label>
                    <div className="relative">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 text-gray-300 flex items-center justify-between">
                            <span className="truncate max-w-[200px]">{contractForm?.fileName || "Chọn file..."}</span>
                            <Upload className="w-4 h-4" />
                        </div>
                    </div>
                </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormGroup>
                    <Label required>Ngày hiệu lực</Label>
                    <Input type="date" value={contractForm?.startDate} onChange={(e) => setContractForm({...contractForm, startDate: e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label required>Ngày hết hạn</Label>
                    <Input type="date" value={contractForm?.endDate} onChange={(e) => setContractForm({...contractForm, endDate: e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label required>Hoa hồng (%)</Label>
                    <Input type="number" step="0.1" value={contractForm?.commissionRate} onChange={(e) => setContractForm({...contractForm, commissionRate: e.target.value})} />
                </FormGroup>
            </div>

            <FormGroup>
                <Label>Điều khoản & Ghi chú</Label>
                <textarea 
                    rows="3" 
                    className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white focus:border-cyan-500 outline-none"
                    value={contractForm?.terms}
                    onChange={(e) => setContractForm({...contractForm, terms: e.target.value})}
                ></textarea>
            </FormGroup>
        </div>
      </Modal>

      {/* 5. MODAL CREATE KPI */}
      <Modal
        isOpen={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        title="Thiết lập KPI Doanh số"
        size="md"
        footer={
          <>
             <Button variant="ghost" onClick={() => setShowTargetModal(false)}>Hủy bỏ</Button>
             <Button variant="primary" onClick={handleTargetSave}>Lưu KPI</Button>
          </>
        }
      >
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormGroup>
                    <Label required>Từ ngày</Label>
                    <Input type="date" value={targetForm?.periodStart} onChange={(e) => setTargetForm({...targetForm, periodStart: e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label required>Đến ngày</Label>
                    <Input type="date" value={targetForm?.periodEnd} onChange={(e) => setTargetForm({...targetForm, periodEnd: e.target.value})} />
                </FormGroup>
            </div>
            <FormGroup>
                <Label required>Mục tiêu doanh số (VNĐ)</Label>
                <Input type="number" value={targetForm?.salesTarget} onChange={(e) => setTargetForm({...targetForm, salesTarget: e.target.value})} className="font-bold text-lg text-yellow-400" />
            </FormGroup>
        </div>
      </Modal>

    </PageContainer>
  );
};

export default DealerContractManagement;