// File: src/features/admin/components/modals/ConfigModal.jsx
import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

const ConfigModal = ({ config, onClose, onSave }) => {
  const [form, setForm] = useState({
    configId: null,
    color: "",
    batteryKwh: "",
    rangeKm: "",
  });

  useEffect(() => {
    if (config) {
      setForm({
        configId: config.configId,
        color: config.color || "",
        batteryKwh: config.batteryKwh || "",
        rangeKm: config.rangeKm || "",
      });
    } else {
      setForm({
        configId: null,
        color: "",
        batteryKwh: "",
        rangeKm: "",
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ===================================================================================
    // === PHẦN SỬA LỖI: TẠO ĐỐI TƯỢNG DATA GỬI ĐI KHỚP VỚI DTO CỦA BACKEND ===
    
    // 1. Dữ liệu chung cho cả Thêm và Sửa
    const payload = {
        color: form.color,
        batteryKwh: form.batteryKwh ? parseInt(form.batteryKwh, 10) : null,
        rangeKm: form.rangeKm ? parseInt(form.rangeKm, 10) : null,
    };

    // 2. Nếu là chế độ sửa, thêm configId vào để hàm cha biết
    const dataToSave = form.configId ? { ...payload, configId: form.configId } : payload;
    
    // 3. Gọi hàm onSave với dữ liệu đã được chuẩn hóa
    onSave(dataToSave);
    // ===================================================================================
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0b1622] border border-slate-700 p-6 shadow-xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-100">
            {form.configId ? "Chỉnh sửa cấu hình" : "Thêm cấu hình mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="color"
            value={form.color} 
            onChange={handleChange} 
            className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none" 
            placeholder="Màu sắc (VD: Đen)" 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number"
              name="batteryKwh"
              value={form.batteryKwh} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none" 
              placeholder="Pin (kWh)" 
            />
            <input 
              type="number" 
              name="rangeKm"
              value={form.rangeKm} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none" 
              placeholder="Phạm vi (km)" 
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:brightness-110 transition">
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;