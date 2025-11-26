import React, { useEffect, useState } from "react";
import { Settings2, Battery, Gauge } from "lucide-react";
import Modal from "../ui/Modal"; // Import Modal chuẩn
import Button from "../ui/Button";
import { FormGroup, Label, Input } from "../ui/FormComponents";

const ConfigModal = ({ config, onClose, onSave }) => {
  const [form, setForm] = useState({ configId: null, color: "", batteryKwh: "", rangeKm: "" });

  useEffect(() => {
    if (config) { setForm({ configId: config.configId, color: config.color || "", batteryKwh: config.batteryKwh || "", rangeKm: config.rangeKm || "" }); } 
    else { setForm({ configId: null, color: "", batteryKwh: "", rangeKm: "" }); }
  }, [config]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  
  const handleSubmit = () => {
    const payload = { color: form.color, batteryKwh: form.batteryKwh ? parseInt(form.batteryKwh, 10) : null, rangeKm: form.rangeKm ? parseInt(form.rangeKm, 10) : null };
    const dataToSave = form.configId ? { ...payload, configId: form.configId } : payload;
    onSave(dataToSave);
  };

  return (
    <Modal
        isOpen={true}
        onClose={onClose}
        title={form.configId ? "Sửa cấu hình" : "Thêm cấu hình"}
        size="md"
        footer={
            <>
                <Button variant="ghost" onClick={onClose}>Hủy bỏ</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu cấu hình</Button>
            </>
        }
    >
        <div className="space-y-5">
            <FormGroup>
                <Label required>Màu sắc</Label>
                <Input name="color" value={form.color} onChange={handleChange} placeholder="VD: Đen nhám" />
            </FormGroup>

            <div className="grid grid-cols-2 gap-5">
                <FormGroup>
                    <Label>
                        <div className="flex items-center gap-1"><Battery className="w-3 h-3" /> Pin (kWh)</div>
                    </Label>
                    <Input type="number" name="batteryKwh" value={form.batteryKwh} onChange={handleChange} placeholder="80" />
                </FormGroup>
                <FormGroup>
                    <Label>
                        <div className="flex items-center gap-1"><Gauge className="w-3 h-3" /> Phạm vi (km)</div>
                    </Label>
                    <Input type="number" name="rangeKm" value={form.rangeKm} onChange={handleChange} placeholder="450" />
                </FormGroup>
            </div>
        </div>
    </Modal>
  );
};

export default ConfigModal;