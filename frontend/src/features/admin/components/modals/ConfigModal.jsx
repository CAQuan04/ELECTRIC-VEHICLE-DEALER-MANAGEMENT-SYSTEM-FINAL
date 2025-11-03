import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

const ConfigModal = ({ config, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    battery: "",
    range: "",
    price: "",
    colorOptions: [],
  });

  useEffect(() => {
    if (config) setForm(config);
    else setForm({ id: "", name: "", battery: "", range: "", price: "", colorOptions: [] });
  }, [config]);

  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#071025] border border-slate-700 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100">{form.id ? "Chỉnh sửa cấu hình" : "Thêm cấu hình"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.name} onChange={(e) => change("name", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#0b1622] border border-slate-700 text-slate-100" placeholder="Tên cấu hình" required />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.battery} onChange={(e) => change("battery", e.target.value)} className="px-3 py-2 rounded-xl bg-[#0b1622] border border-slate-700 text-slate-100" placeholder="Pin (kWh)" />
            <input type="number" value={form.range} onChange={(e) => change("range", e.target.value)} className="px-3 py-2 rounded-xl bg-[#0b1622] border border-slate-700 text-slate-100" placeholder="Quãng đường (km)" />
          </div>
          <input value={form.price} onChange={(e) => change("price", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-[#0b1622] border border-slate-700 text-slate-100" placeholder="Giá (VNĐ)" />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-200">Hủy</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <Save className="w-4 h-4" /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
