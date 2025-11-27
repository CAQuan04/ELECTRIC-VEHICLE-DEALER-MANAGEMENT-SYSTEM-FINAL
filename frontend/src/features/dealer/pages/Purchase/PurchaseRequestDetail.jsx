import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Package, Truck, CheckCircle, AlertCircle, DollarSign, Clock, Send } from 'lucide-react'; // Đã thêm icon Send
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { usePageLoading } from '@modules/loading';
import { notifications } from '@utils';
import { useAuth } from '@/context/AuthContext';

// Import UI Components
import {
    PageContainer,
    DetailHeader,
    Button,
    Card,
    Badge,
    InfoSection,
    InfoRow,
    PageHeader
} from '../../components';

// Đảm bảo đường dẫn import đúng tới file Modal bạn đã tạo
import RequestStockConfirmationModal from '../../components/RequestStockConfirmationModal';

const PurchaseRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = usePageLoading();
    const { user } = useAuth();

    const [request, setRequest] = useState(null);
    const [vehicleInfo, setVehicleInfo] = useState(null);

    // State cho Modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            startLoading('Đang tải chi tiết...');
            const reqResult = await dealerAPI.getPurchaseRequestById(id);

            if (!reqResult.success) {
                throw new Error(reqResult.message);
            }

            const reqData = reqResult.data;
            setRequest(reqData);

            // Logic map tên xe (giữ nguyên như cũ)
            if (!reqData.vehicleName && reqData.vehicleId) {
                const vehResult = await dealerAPI.getVehicles();
                if (vehResult.success) {
                    const vList = vehResult.data?.items || vehResult.data || [];
                    const foundVehicle = vList.find(v => String(v.vehicleId || v.id) === String(reqData.vehicleId));

                    let configName = `Cấu hình #${reqData.configId}`;
                    if (foundVehicle) {
                        try {
                            const confResult = await dealerAPI.getVehicleConfigs(reqData.vehicleId);
                            const confList = confResult.data?.items || confResult.data || [];
                            const foundConfig = confList.find(c => String(c.configId || c.id) === String(reqData.configId));
                            if (foundConfig) {
                                configName = foundConfig.configName || [foundConfig.color, foundConfig.trim].filter(Boolean).join(' - ');
                            }
                        } catch (e) { console.warn("Không load được config", e); }
                    }

                    setVehicleInfo({
                        name: foundVehicle ? (foundVehicle.model || foundVehicle.vehicleName) : `Xe #${reqData.vehicleId}`,
                        config: configName,
                        brand: foundVehicle?.brand || 'VinFast'
                    });
                }
            } else {
                setVehicleInfo({
                    name: reqData.vehicleName,
                    config: reqData.configName,
                    brand: reqData.brand || 'VinFast'
                });
            }

        } catch (error) {
            notifications.error("Lỗi", error.message);
            navigate(-1);
        } finally {
            stopLoading();
        }
    };

    const handleConfirmSendToEVM = async (password) => {
        if (!request) return;

        setIsSending(true);
        try {
            // Gọi API Backend
            const result = await dealerAPI.sendPurchaseRequestToEVM(request.requestId || request.id, password);

            if (result.success) {
                notifications.success("Thành công", "Đơn hàng đã được gửi đến EVM!");
                setShowConfirmModal(false); // Đóng modal
                loadData(); // Load lại để cập nhật trạng thái
            } else {
                notifications.error("Lỗi", result.message);
            }
        } catch (error) {
            notifications.error("Lỗi hệ thống", error.message);
        } finally {
            setIsSending(false);
        }
    };

    if (!request) return null;

    // Helpers hiển thị
    const getStatusColor = (status) => {
        const map = {
            'draft': 'secondary',   // Màu xám (Nháp)
            'pending': 'warning',   // Màu vàng (Đã gửi, chờ hãng)
            'approved': 'success',  // Màu xanh (Xong)
            'rejected': 'danger'
        };
        return map[status] || 'info';
    };

    const getStatusLabel = (status) => {
        const map = {
            'draft': 'Bản nháp (Chưa gửi)',
            'pending': 'Đã gửi Hãng (Chờ duyệt)',

            // Các trạng thái sau này của hãng trả về
            'approved': 'Hãng đã duyệt',
            'processing': 'Hãng đang xử lý',
            'rejected': 'Hãng từ chối',
            'cancelled': 'Đã hủy'
        };
        return map[status] || status;
    };
    // -------------------------
    const currentStatus = request.status?.toLowerCase() || '';
    // Logic hiển thị nút bấm
    const isManager = user?.role === 'DealerManager';
    // Nút gửi hiện khi trạng thái là Pending hoặc Approved (tùy logic duyệt nội bộ của bạn)
    const canSend = isManager && (currentStatus === 'draft' || currentStatus === 'approved');
    const canCancel = currentStatus === 'draft';

    return (
        <PageContainer>
            <PageHeader
                title={`Đơn hàng #PR-${String(request.requestId || request.id).padStart(4, '0')}`}
                subtitle={`Ngày tạo: ${new Date(request.createdAt).toLocaleDateString('vi-VN')}`}
                status={<Badge variant={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>}
                onBack={() => navigate(-1)}
                actions={
                    <div className="flex gap-2">
                        {/* Nút Hủy */}
                        {request.status === 'pending' && (
                            <Button variant="danger" size="sm">
                                Hủy yêu cầu
                            </Button>
                        )}

                        {/* ✅ NÚT GỬI ĐẾN HÃNG (ĐÃ THÊM VÀO) */}
                        {canSend && (
                            <Button
                                variant="gradient"
                                size="sm"
                                onClick={() => setShowConfirmModal(true)}
                            >
                                <Send className="w-4 h-4 mr-2" /> Gửi đến Hãng (EVM)
                            </Button>
                        )}

                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            In phiếu
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Cột Trái: Thông tin chính */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thông tin Xe */}
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                                <Truck className="w-5 h-5 mr-2 text-cyan-600" /> Thông tin sản phẩm
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    <Package className="w-12 h-12" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Dòng xe</p>
                                            <p className="text-xl font-bold text-white">
                                                {vehicleInfo?.name || 'Đang tải...'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Thương hiệu</p>
                                            <p className="font-medium">{vehicleInfo?.brand || 'VinFast'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Phiên bản / Cấu hình</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-200">
                                                {vehicleInfo?.config || 'Standard'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Chi tiết đơn hàng */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-bold flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-cyan-600" /> Chi tiết đặt hàng
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoRow label="Mã yêu cầu" value={`PR-${String(request.requestId || request.id).padStart(4, '0')}`} />
                            <InfoRow label="Người tạo" value="Quản lý đại lý" />
                            <InfoRow label="Số lượng đặt" value={<span className="font-bold text-lg">{request.quantity} xe</span>} />
                            <InfoRow label="Đơn giá dự kiến" value="Liên hệ hãng" />
                            <div className="col-span-2 mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Ghi chú đơn hàng</p>
                                <div className="bg-gray-800 p-3 rounded-md border border-yellow-100 text-slate-300 italic">
                                    {request.notes || request.note || "Không có ghi chú"}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Cột Phải: Timeline */}
                <div className="space-y-6">
                    <Card>
                        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-bold flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-cyan-600" /> Tiến độ xử lý
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="relative pl-4 border-l-2 gap-2 border-gray-200 space-y-15">
                                <div className="relative">
                                    <div className="absolute -left-[28px] bg-green-500 w-5 h-5 rounded-full border-1 border-red-500"></div>
                                    <p className="text-xl font-bold text-sky-700">Tạo yêu cầu</p>
                                    <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <div className="relative">
                                    <div className={`absolute -left-[28px] w-5 h-5 rounded-full border-1 border-red-500 ${request.status === 'Pending' || request.status === 'Processing' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <p className={`text-xl font-bold ${request.status === 'Pending' ? 'text-sky-700' : 'text-gray-400'}`}>Đã gửi hãng (EVM)</p>
                                </div>
                            </div>
                            {request.status === 'Rejected' && (
                                <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                                    <div><strong>Đã bị từ chối:</strong><br />Lý do từ chối từ hãng sẽ hiện ở đây.</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* ✅ MODAL XÁC NHẬN (ĐÃ THÊM VÀO) */}
            <RequestStockConfirmationModal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSendToEVM}
                isLoading={isSending}
                quantity={request.quantity}
                selectedVehicle={{
                    name: vehicleInfo?.name || `Xe #${request.vehicleId}`,
                    color: vehicleInfo?.config || 'Standard'
                }}
            />
        </PageContainer>
    );
};

export default PurchaseRequestDetail;