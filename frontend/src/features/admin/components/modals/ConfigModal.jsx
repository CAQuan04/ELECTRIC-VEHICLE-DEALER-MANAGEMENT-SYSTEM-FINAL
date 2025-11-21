// File: src/features/admin/components/modals/ConfigModal.jsx
import React, { useEffect, useState } from "react";
import { X, Save, Settings2, Battery, Gauge } from "lucide-react"; // Thêm icons

const ConfigModal = ({ config, onClose, onSave }) => {
  // ... (Logic giữ nguyên) ...
  const [form, setForm] = useState({ configId: null, color: "", batteryKwh: "", rangeKm: "" });

  useEffect(() => {
    if (config) { setForm({ configId: config.configId, color: config.color || "", batteryKwh: config.batteryKwh || "", rangeKm: config.rangeKm || "" }); } 
    else { setForm({ configId: null, color: "", batteryKwh: "", rangeKm: "" }); }
  }, [config]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { color: form.color, batteryKwh: form.batteryKwh ? parseInt(form.batteryKwh, 10) : null, rangeKm: form.rangeKm ? parseInt(form.rangeKm, 10) : null };
    const dataToSave = form.configId ? { ...payload, configId: form.configId } : payload;
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0b1622] border border-slate-700 p-8 shadow-2xl animate-fade-in-up">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <Settings2 className="w-7 h-7" />
             </div>
             <h3 className="text-2xl font-bold text-slate-100">
               {form.configId ? "Sửa cấu hình" : "Thêm cấu hình"}
             </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm text-slate-400 mb-1">Màu sắc</label>
             <input name="color" value={form.color} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" placeholder="VD: Đen nhám" required />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Battery className="w-4 h-4" /> Pin (kWh)
                </label>
                <input type="number" name="batteryKwh" value={form.batteryKwh} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" placeholder="80" />
            </div>
            <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Gauge className="w-4 h-4" /> Phạm vi (km)
                </label>
                <input type="number" name="rangeKm" value={form.rangeKm} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#0f1b2e] border border-slate-700 text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition" placeholder="450" />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition font-medium">
              Hủy
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition">
              <Save className="w-5 h-5" /> Lưu cấu hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;