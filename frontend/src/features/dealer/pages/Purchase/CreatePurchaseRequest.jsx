import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePageLoading } from '@modules/loading';
import { dealerAPI } from '@/utils/api/services/dealer.api.js';
import { Plus, Trash2, Send, ShoppingCart, AlertCircle } from 'lucide-react';
import { notifications } from '@utils';
// UI Components
import {
  PageContainer,
  PageHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  Card,
  Table
} from '../../components';

const CreatePurchaseRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading, startLoading, stopLoading } = usePageLoading();
  const dealerId = user?.dealerId;
  // --- STATE ---
  const [vehicles, setVehicles] = useState([]);
  const [configs, setConfigs] = useState([]);

  const [currentItem, setCurrentItem] = useState({
    vehicleId: '',
    configId: '',
    quantity: 1
  });

  const [requestItems, setRequestItems] = useState([]);
  const [note, setNote] = useState('');

  // --- 1. LOAD XE (ĐÃ SỬA LOGIC LẤY DATA) ---
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const result = await dealerAPI.getVehicles();
        console.log("🔍 API Vehicles Raw:", result);

        if (result.success) {
          const rawData = result.data;
          const list = rawData?.items || rawData?.data || (Array.isArray(rawData) ? rawData : []);

          console.log("✅ Processed List:", list);
          setVehicles(list);
        }
      } catch (error) {
        console.error(error);
        notifications.error("Lỗi", "Không thể tải danh sách xe");
      }
    };
    loadVehicles();
  }, []);

  // --- 2. XỬ LÝ CHỌN XE ---
  const handleVehicleChange = async (valOrEvent) => {
    // Kiểm tra đầu vào là Event hay Value
    const vId = (valOrEvent && valOrEvent.target) ? valOrEvent.target.value : valOrEvent;

    console.log("🚗 Selected Vehicle ID:", vId);

    // Reset config
    setCurrentItem(prev => ({ ...prev, vehicleId: vId, configId: '' }));
    setConfigs([]);

    if (vId) {
      try {
        const result = await dealerAPI.getVehicleConfigs(vId);
        console.log("🔧 API Configs Raw:", result);
        if (result.success) {
          const rawData = result.data;
          // Áp dụng logic tương tự cho config (đề phòng API config cũng trả về items)
          const configList = rawData?.items || rawData?.data || (Array.isArray(rawData) ? rawData : []);
          console.log("✅ Processed Config List:", configList);
          setConfigs(configList);
        }
      } catch (e) {
        console.error("Lỗi load config:", e);
      }
    }
  };

  const handleConfigChange = (valOrEvent) => {
    const cId = (valOrEvent && valOrEvent.target) ? valOrEvent.target.value : valOrEvent;
    setCurrentItem(prev => ({ ...prev, configId: cId }));
  };

  // --- 3. THÊM VÀO GIỎ ---
  const handleAddItem = () => {
    if (!currentItem.vehicleId || !currentItem.configId) {
      notifications.error("Thiếu thông tin", "Vui lòng chọn Xe và Cấu hình");
      return;
    }
    if (currentItem.quantity <= 0) {
      notifications.error("Lỗi", "Số lượng phải lớn hơn 0");
      return;
    }

    const selectedVehicle = vehicles.find(v => String(v.vehicleId || v.id) === String(currentItem.vehicleId));
    const selectedConfig = configs.find(c => String(c.configId || c.id) === String(currentItem.configId));

    const newItem = {
      id: Date.now(),
      vehicleId: parseInt(currentItem.vehicleId),
      vehicleName: selectedVehicle ? (selectedVehicle.vehicleName || selectedVehicle.model) : 'Unknown',
      config_id: parseInt(currentItem.configId),
      configName: selectedConfig ? (selectedConfig.configName || `${selectedConfig.color || ''} ${selectedConfig.trim || ''}`) : 'Standard',
      quantity: parseInt(currentItem.quantity)
    };

    const existingIndex = requestItems.findIndex(
      i => i.vehicleId === newItem.vehicleId && i.config_id === newItem.config_id
    );

    if (existingIndex >= 0) {
      const updatedItems = [...requestItems];
      updatedItems[existingIndex].quantity += newItem.quantity;
      setRequestItems(updatedItems);
    } else {
      setRequestItems([...requestItems, newItem]);
    }

    setCurrentItem(prev => ({ ...prev, configId: '', quantity: 1 }));
  };

  const handleRemoveItem = (id) => {
    setRequestItems(requestItems.filter(item => item.id !== id));
  };

  // --- 4. SUBMIT ---
  const handleSubmit = async () => {
    if (requestItems.length === 0) {
      notifications.warning("Giỏ hàng trống", "Vui lòng thêm xe");
      return;
    }

    startLoading("Đang gửi yêu cầu...");

    const payload = {
      dealerId: parseInt(user?.dealerId || 0),
      items: requestItems.map(item => ({
        vehicleId: item.vehicleId,
        quantity: item.quantity,
        config_id: item.config_id
      })),
      note: note || "Tồn kho thấp, cần xe gấp"
    };
    console.log("📤 FINAL PAYLOAD:", JSON.stringify(payload, null, 2));
    try {
      const result = await dealerAPI.createProcurementRequest(payload);
      if (result.success) {
        notifications.success("Thành công", "Đã gửi yêu cầu nhập hàng!");
        navigate(`/${dealerId}/dealer/purchase-requests`);
      } else {
        notifications.error("Thất bại", result.message);
      }
    } catch (error) {
      notifications.error("Lỗi", "Lỗi kết nối server");
    } finally {
      stopLoading();
    }
  };

  // --- MAPPING OPTIONS ---
  const vehicleOptions = vehicles.map(v => ({
    value: v.vehicleId || v.id,
    label: v.model || v.vehicleName || (v.brand ? `${v.brand} - Xe #${v.vehicleId}` : `Xe #${v.vehicleId}`)
  }));

  const configOptions = configs.map(c => ({
    // Thử fallback các trường ID phổ biến
    value: c.configId || c.id || c.vehicleConfigId,
    // Tạo nhãn hiển thị đầy đủ thông tin
    label: c.configName || [
      c.color,
      c.trim,
      c.batteryKwh ? `${c.batteryKwh}kWh` : null,
      c.price ? `(${c.price.toLocaleString()}đ)` : null
    ].filter(Boolean).join(' - ') || `Cấu hình #${c.id || '?'}`
  }));

  const columns = [
    { key: 'vehicleName', label: 'Tên xe', render: (row) => <span className="font-bold">{row.vehicleName}</span> },
    { key: 'configName', label: 'Cấu hình', render: (row) => row.configName },
    { key: 'quantity', label: 'SL', render: (row) => <span className="font-bold text-blue-600">{row.quantity}</span> },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button variant="danger" size="sm" onClick={() => handleRemoveItem(row.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Tạo Yêu cầu Nhập hàng (Procurement)"
        subtitle="Gửi yêu cầu mua xe trực tiếp đến hãng (EVM)"
        actions={<Button variant="ghost" onClick={() => navigate(`/${dealerId}/dealer/purchase-requests`)}>Quay lại</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-bold mb-4 flex items-center"><Plus className="w-5 h-5 mr-2" /> Chọn xe nhập</h3>

            <div className="space-y-4">
              <FormGroup>
                <Label required>Dòng xe</Label>
                <Select
                  options={vehicleOptions}
                  value={currentItem.vehicleId}
                  onChange={handleVehicleChange}
                  placeholder="-- Chọn dòng xe --"
                />
              </FormGroup>

              <FormGroup>
                <Label required>Cấu hình</Label>
                <Select
                  options={configOptions}
                  value={currentItem.configId}
                  onChange={handleConfigChange}
                  placeholder={currentItem.vehicleId ? "-- Chọn cấu hình --" : "Vui lòng chọn xe trước"}
                  disabled={!currentItem.vehicleId}
                />
              </FormGroup>

              <FormGroup>
                <Label required>Số lượng</Label>
                <Input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </FormGroup>

              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={handleAddItem}
                disabled={!currentItem.vehicleId || !currentItem.configId}
              >
                Thêm vào danh sách
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 min-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              <div className="flex items-center"><ShoppingCart className="w-5 h-5 mr-2" /> Danh sách ({requestItems.length})</div>
              <span className="text-sm text-gray-500">Dealer ID: {user?.dealerId}</span>
            </h3>

            {requestItems.length > 0 ? (
              <div className="flex-1"><Table columns={columns} data={requestItems} keyField="id" /></div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-lg p-10">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p>Chưa có xe nào</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <FormGroup className="mb-4">
                <Label>Ghi chú</Label>
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </FormGroup>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setRequestItems([])} disabled={requestItems.length === 0}>Xóa tất cả</Button>
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={requestItems.length === 0}
                  loading={isLoading}
                  icon={<Send className="w-4 h-4" />}
                >
                  Gửi yêu cầu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreatePurchaseRequest;